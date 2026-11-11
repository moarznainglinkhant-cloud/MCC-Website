"""Turn traced centre-lines into true-circle handwriting strokes.
Each curved run (same turning direction, >= ~70 deg of turn) is replaced by an exact circular arc;
similar radii within one glyph are snapped to a shared radius; near-straight runs become straight."""
import math,numpy as np
from scipy.interpolate import splprep,splev
def P(s): return np.array([[float(v) for v in q.split(",")] for q in s.split()])
def S(p): return " ".join(f"{round(x,1):g},{round(y,1):g}" for x,y in p)
def alen(p): return np.concatenate([[0],np.cumsum(np.hypot(*np.diff(p,axis=0).T))])
def even(p,step=1.0,closed=False):
    d=alen(p); n=max(2,int(d[-1]/step)+1); t=np.linspace(0,d[-1],n)
    return np.c_[np.interp(t,d,p[:,0]),np.interp(t,d,p[:,1])]
def spl(p,closed,s=0.5):
    q=even(p,1.0)
    if closed: q=q[:-1]
    if len(q)<6: return p
    w=np.ones(len(q));
    if not closed: w[0]=w[-1]=30
    tck,_=splprep(q.T,w=w,s=len(q)*s*s,per=1 if closed else 0,k=3)
    u=np.linspace(0,1,len(q)+(1 if closed else 0)); x,y=splev(u,tck); r=np.c_[x,y]
    if closed: r[-1]=r[0]
    return r
def heading(p,closed):
    n=len(p); h=np.zeros(n)
    for i in range(n):
        a=p[(i-3)%n] if closed else p[max(0,i-3)]; b=p[(i+3)%n] if closed else p[min(n-1,i+3)]
        h[i]=math.atan2(b[1]-a[1],b[0]-a[0])
    return np.unwrap(h)
def fitc(q):
    A=np.c_[2*q,np.ones(len(q))]; b=(q**2).sum(1)
    cx,cy,c=np.linalg.lstsq(A,b,rcond=None)[0]; return np.array([cx,cy]),math.sqrt(max(c+cx*cx+cy*cy,1e-6))
def trim_flick(p):
    # drop a short end hook (font terminal flare) : last <=6 units turning >35deg vs the stroke just before
    for _ in range(2):
        d=alen(p); L=d[-1]
        if L>25:
            h=heading(p,False); i0=np.searchsorted(d,L-12); i1=np.searchsorted(d,L-6)
            ref=h[i0]
            for i in range(i1,len(p)):
                if abs(h[i]-ref)>math.radians(35): p=p[:max(i-1,i1)+1]; break
        p=p[::-1]
    return p
def runs(p,closed):
    h=heading(p,closed); k=np.gradient(h)            # turn per unit
    k=np.convolve(np.pad(k,4,mode='wrap' if closed else 'edge'),np.ones(9)/9,'valid')
    sgn=np.where(np.abs(k)<1/90,0,np.sign(k)).astype(int)   # radius > 90 units = straight
    out=[];i=0;n=len(p)
    while i<n:
        j=i
        while j+1<n and sgn[j+1]==sgn[i]: j+=1
        out.append([i,j,sgn[i]]); i=j+1
    # absorb tiny runs (<5 units) into neighbours
    changed=True
    while changed and len(out)>1:
        changed=False
        for m,(a,b,s) in enumerate(out):
            if b-a<5:
                nb=out[m-1] if m>0 else out[m+1]
                if m>0: out[m-1][1]=b
                else: out[m+1][0]=a
                out.pop(m); changed=True; break
        # merge equal-sign neighbours
        m=0
        while m<len(out)-1:
            if out[m][2]==out[m+1][2]: out[m][1]=out[m+1][1]; out.pop(m+1); changed=True
            else: m+=1
    return out,h
def circlify_glyph(strokes):
    items=[]   # (stroke idx, a, b, kind, center, r)
    geo=[]
    for si,s in enumerate(strokes):
        p=P(s)
        if len(p)<=2 or np.ptp(p,axis=0).max()<3: geo.append(None); continue   # dot
        closed=np.linalg.norm(p[0]-p[-1])<1.5 and alen(p)[-1]>30
        if not closed: p=trim_flick(p)
        p=spl(p,closed,0.6)
        if closed: p=p[:-1]
        R,h=runs(p,closed)
        if closed and len(R)==1: R=[[0,len(p)-1,R[0][2]]]
        geo.append((p,closed))
        for a,b,sg in R:
            turn=abs(h[b]-h[a]); q=p[a:b+1]
            if sg!=0 and turn>math.radians(70) and len(q)>=8:
                c,r=fitc(q); res=np.sqrt(((np.linalg.norm(q-c,axis=1)-r)**2).mean())
                if res/r<0.07 and 4<r<70: items.append([si,a,b,'arc',c,r])
            elif sg==0 or turn<math.radians(14):
                items.append([si,a,b,'line',None,None])
    # shared radii: group arcs whose radii are within 18%
    arcs=sorted([it for it in items if it[3]=='arc'],key=lambda it:it[5])
    groups=[]
    for it in arcs:
        if groups and it[5]<=groups[-1][0][5]*1.08: groups[-1].append(it)
        else: groups.append([it])
    for g in groups:
        L=[it[2]-it[1] for it in g]; R=sum(it[5]*l for it,l in zip(g,L))/sum(L)
        for it in g: it[5]=R
    out=[]
    for si,s in enumerate(strokes):
        if geo[si] is None: out.append(s); continue
        p,closed=geo[si]; q=p.copy(); n=len(p)
        tgt=p.copy(); wt=np.zeros(n)
        for it in [it for it in items if it[0]==si]:
            _,a,b,kind,c,r=it; seg=p[a:b+1]
            if kind=='arc':
                # keep the run's mid point in place: recentre so the arc passes through the original chord geometry
                v=seg-c; nv=np.linalg.norm(v,axis=1,keepdims=True)
                new=c+v/nv*r
            else:
                t=np.linspace(0,1,len(seg))[:,None]; new=seg[0]+(seg[-1]-seg[0])*t
                # fit a line instead of chord
                m=seg.mean(0); u,sv,vt=np.linalg.svd(seg-m); dvec=vt[0]
                new=m+((seg-m)@dvec)[:,None]*dvec
            tgt[a:b+1]=new
            # weight: 1 inside, ramp 4 units at run ends unless it's the stroke end
            w=np.ones(len(seg)); R=min(5,len(seg)//3)
            if a>0 or closed: w[:R]=np.linspace(0.2,1,R)
            if b<n-1 or closed: w[-R:]=np.linspace(1,0.2,R)
            wt[a:b+1]=np.maximum(wt[a:b+1],w)
        q=p+(tgt-p)*wt[:,None]
        if closed: q=np.vstack([q,q[:1]])
        q=spl(q,closed,0.25)
        q=even(q,2.5)
        if closed: q[-1]=q[0]
        out.append(S(q))
    return out
