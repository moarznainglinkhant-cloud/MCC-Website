import json, math, numpy as np, freetype, uharfbuzz as hb
from PIL import Image, ImageDraw, ImageFont
from skimage.morphology import skeletonize
import strokes as S
from strokes import edges_of, prune, plen, OX, OY, EM, CW, CH
FONT='f_NotoSansMyanmarBwdthCwghtD.ttf'
ASC=S.font.getmetrics()[0]; BASE=OY+ASC
face=freetype.Face(FONT); face.set_pixel_sizes(0,EM)
hbfont=hb.Font(hb.Face(hb.Blob.from_file_path(FONT)))
def U(x,y): return [round((x-OX)/EM*100,1), round((y-BASE)/EM*100,1)]
def raster_gid(g):
    face.load_glyph(g, freetype.FT_LOAD_RENDER|freetype.FT_LOAD_NO_HINTING)
    b=face.glyph.bitmap; a=np.zeros((CH,CW),bool)
    if b.width==0: return a
    arr=np.array(b.buffer,dtype=np.uint8).reshape(b.rows,b.pitch)[:,:b.width]>127
    x0=OX+face.glyph.bitmap_left+300; y0=BASE-face.glyph.bitmap_top   # +300: marks have negative x
    a[y0:y0+b.rows, x0:x0+b.width]=arr
    return a
def area(p): return sum(p[i][1]*p[(i+1)%len(p)][0]-p[(i+1)%len(p)][1]*p[i][0] for i in range(len(p)))/2  # >0 clockwise on screen
def tang(p,at_end,k=12):
    k=min(k,len(p)-1); a,b=(p[-1-k],p[-1]) if at_end else (p[0],p[k])
    v=(b[0]-a[0],b[1]-a[1]); n=math.hypot(*v) or 1; return (v[0]/n,v[1]/n)
def resample(p,step=EM*0.025,k=9):
    p=np.array(p,float)
    if len(p)>k:
        pad=np.concatenate([np.repeat(p[:1],k//2,0),p,np.repeat(p[-1:],k//2,0)])
        p=np.stack([np.convolve(pad[:,i],np.ones(k)/k,'valid') for i in (0,1)],1)
    d=np.concatenate([[0],np.cumsum(np.hypot(*np.diff(p,axis=0).T))])
    if d[-1]<1: return p[:1].repeat(2,0)
    n=max(2,int(round(d[-1]/step))+1); t=np.linspace(0,d[-1],n)
    return np.stack([np.interp(t,d,p[:,0]),np.interp(t,d,p[:,1])],1)
def chain(nodes,E,start,eds):
    path=[]; cur=start
    for e in eds:
        na,nb,p=E[e]
        if na==nb:
            if path:
                t0=tang(path,True); f=tang(p,False); r=tang(p[::-1],False)
                if t0[0]*r[0]+t0[1]*r[1]>t0[0]*f[0]+t0[1]*f[1]: p=p[::-1]
            elif area(p)<0: p=p[::-1]
        elif nb==cur: p=p[::-1]; cur=na
        else:
            assert na==cur,(start,eds,e,na,nb,cur); cur=nb
        path+=p
    return path
def split_bottom(p):
    i=max(range(len(p)),key=lambda i:p[i][0]); a=p[:i+1]; b=p[i:][::-1]
    if a[0][1]>b[0][1]: a,b=b,a
    return [a,b]
def cyc_start(p):
    p=p[:-1] if p[0]==p[-1] else p
    if area(p)<0: p=p[::-1]
    i=max(range(len(p)),key=lambda i:p[i][0]*1.0-p[i][1]*0.6); return p[i:]+p[:i]+[p[i]]
def auto(nodes,E):
    # edge ends at junctions, pair the straightest continuations
    ends={}
    for ei,(a,b,p) in enumerate(E):
        if a is None: continue
        ends.setdefault(a,[]).append((ei,0)); ends.setdefault(b,[]).append((ei,1))
    def tv(e,side):
        p=E[e][2]; return tang(p,False) if side==0 else tang(p[::-1],False)
    link={}
    for n,lst in ends.items():
        if nodes[n][0]!='J': continue
        cand=[]
        for i in range(len(lst)):
            for j in range(i+1,len(lst)):
                a=tv(*lst[i]); b=tv(*lst[j]); cand.append((a[0]*b[0]+a[1]*b[1],i,j))
        cand.sort(); used=set()
        for d,i,j in cand:
            if d>-0.25 or i in used or j in used: continue
            used|={i,j}; link[lst[i]]=lst[j]; link[lst[j]]=lst[i]
    out=[]; seen=set()
    for ei in range(len(E)):
        if ei in seen: continue
        if E[ei][0] is None: seen.add(ei); out.append((cyc_start(E[ei][2]),True)); continue
        # rewind
        e,side=ei,0; guard=0
        while (e,side) in link and guard<50:
            e2,s2=link[(e,side)]; e,side=e2,1-s2; guard+=1
            if e==ei: break
        path=[]; closed=False; first=e
        while True:
            seen.add(e); p=E[e][2]; path+= p if side==0 else p[::-1]
            nxt=link.get((e,1-side))
            if not nxt: break
            e,side=nxt
            if e==first or e in seen: closed=(e==first); break
        out.append((path,closed))
    res=[]
    for path,closed in out:
        L=plen(path)
        if L<10: continue
        A=area(path)
        if abs(A)/(L*L)>0.045:
            if A<0: path=path[::-1]
        else:
            ys=[q[0] for q in path]; xs=[q[1] for q in path]
            if (max(ys)-min(ys))>(max(xs)-min(xs)):
                if path[0][0]>path[-1][0]: path=path[::-1]
            elif path[0][1]>path[-1][1]: path=path[::-1]
        res.append(path)
    res.sort(key=lambda p:min(q[1] for q in p))
    return res
def blobs_as_dots(a,sk):
    # filled dots: components of the glyph whose skeleton is tiny
    import cv2
    n,lab,st,cen=cv2.connectedComponentsWithStats(a.astype('uint8'),8); dots=[]; keep=sk.copy()
    for i in range(1,n):
        m=lab==i
        if sk[m].sum()<16 and st[i,4]>30:
            keep[m]=False; dots.append([(cen[i][1],cen[i][0])]*2)
    return keep,dots
SPEC={
 'က':[(2,[0,1]),(0,[2])],'ခ':[(1,[1,0])],'ဂ':[(0,[0])],'ဃ':[('split',2,[1,0]),(1,[2])],'င':[(1,[0])],
 'စ':[(0,[2,0,1])],'ဆ':[(3,[3,4,0]),(1,[2])],'ဇ':[(3,[1,2,3]),(0,[0])],'ဈ':[(2,[4,3,2,1]),(3,[0])],'ည':[(3,[3,2,0]),(4,[4])],
 'ဋ':[(7,[6,1,0,4])],'ဌ':[(1,[1,2])],'ဍ':[(2,[4,0,2])],'ဎ':[('split',0,[0])],'ဏ':[(3,[3,2,0]),(1,[1])],
 'တ':[(0,[0,1])],'ထ':[(1,[0,1]),(1,[2])],'ဒ':[(1,[0])],'ဓ':[(0,[1,2]),(0,[0])],'န':[(1,[1,0,2])],
 'ပ':[('split',0,[0])],'ဖ':[(1,[1]),(0,[0])],'ဗ':[('ba',)],'ဘ':[(2,[0,1]),(0,[2])],'မ':[(3,[3,1]),(2,[0]),(1,[2])],
 'ယ':[('split',1,[1,0]),(2,[2])],'ရ':[(0,[1,0])],'လ':[(1,[0])],'ဝ':[('cyc',[0])],'သ':[(2,[0,1]),(1,[2])],
 'ဟ':[('split',2,[2,0]),(0,[1])],'ဠ':[(5,[2,0,4])],'အ':[(3,[2,3]),(1,[0,1])],
}
def manual(ch):
    a,sk,nodes,E=S.letter(ch); out=[]
    for sp in SPEC[ch]:
        if sp[0]=='cyc': out.append(cyc_start(E[sp[1][0]][2]))
        elif sp[0]=='split': out+=split_bottom(chain(nodes,E,sp[1],sp[2]))
        elif sp[0]=='ba':
            p=E[0][2][:-1]; cx=sum(q[1] for q in p)/len(p)
            l=min((i for i in range(len(p)) if p[i][1]<cx),key=lambda i:p[i][0]); p=p[l:]+p[:l]
            r=min((i for i in range(len(p)) if p[i][1]>cx),key=lambda i:p[i][0])
            a1=p[:r+1]; a2=(p[r:]+[p[0]])[::-1]
            cup,dip=(a1,a2) if plen(a1)>plen(a2) else (a2,a1)
            out+=split_bottom(cup)+[dip]
        else: out.append(chain(nodes,E,sp[0],sp[1]))
    return [[U(x,y) for y,x in resample(p)] for p in out]
def auto_gid(g):
    a=raster_gid(g)
    if not a.any(): return []
    sk=skeletonize(a); sk,dots=blobs_as_dots(a,sk); sk=prune(sk); nodes,E=edges_of(sk)
    paths=auto(nodes,E)+dots
    paths.sort(key=lambda p:min(q[1] for q in p))
    return [[U(x-300,y) for y,x in resample(p)] for p in paths]
def shape(s):
    b=hb.Buffer(); b.add_str(s); b.guess_segment_properties(); hb.shape(hbfont,b)
    x=0; out=[]
    for i,p in zip(b.glyph_infos,b.glyph_positions):
        out.append([i.codepoint, round((x+p.x_offset)/10,1), round(-p.y_offset/10,1)]); x+=p.x_advance
    return out, round(x/10,1)
if __name__=='__main__':
    clusters=json.load(open('clusters.json'))
    CL={}; gids=set()
    for c in clusters:
        g,adv=shape(c); CL[c]=[adv]+g; gids|={x[0] for x in g}
    cmap=face.get_char_index
    cons={chr(c):cmap(c) for c in range(0x1000,0x1022) if c!=0x1009}
    G={}
    for ch,g in cons.items(): G[g]=manual(ch)
    autos=sorted(gids-set(G))
    for g in autos: G[g]=auto_gid(g)
    json.dump({'G':G,'CL':CL,'cons':cons,'autos':autos},open('raw.json','w'),ensure_ascii=False)
    print(len(CL),len(gids),len(autos),[g for g in autos if not G[g]])
    names={}
    for c in clusters:
        for x in CL[c][1:]: names.setdefault(x[0],c)
    # debug sheets
    f2=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',13)
    cols=[(200,0,0),(0,0,220),(0,150,0),(200,120,0),(160,0,160)]
    def sheet(keys,fn,label):
        ncol=8; cell=250; rows=-(-len(keys)//ncol)
        im=Image.new('RGB',(ncol*cell,rows*cell),'white'); d=ImageDraw.Draw(im)
        for i,g in enumerate(keys):
            ox=(i%ncol)*cell+90; oy=(i//ncol)*cell+150; k=1.6
            d.rectangle(((i%ncol)*cell,(i//ncol)*cell,(i%ncol)*cell+cell-1,(i//ncol)*cell+cell-1),outline=(220,220,220))
            d.line((ox-80,oy,ox+150,oy),fill=(225,225,225)); d.line((ox,oy-120,ox,oy+90),fill=(225,225,225))
            for n,s in enumerate(G[g]):
                pts=[(ox+x*k,oy+y*k) for x,y in s]; c=cols[n%5]
                d.line(pts,fill=c,width=3); x0,y0=pts[0]; d.ellipse((x0-7,y0-7,x0+7,y0+7),fill=c); d.text((x0-3,y0-7),str(n+1),fill='white',font=f2)
                if len(pts)>6:
                    j=len(pts)//3; a,b=pts[j],pts[j+2]; an=math.atan2(b[1]-a[1],b[0]-a[0])
                    for da in (2.6,-2.6): d.line((b[0],b[1],b[0]+9*math.cos(an+da),b[1]+9*math.sin(an+da)),fill=(0,0,0),width=2)
            d.text(((i%ncol)*cell+5,(i//ncol)*cell+4),label(g),fill=(0,0,0),font=f2)
        im.save(fn)
    inv={v:k for k,v in cons.items()}
    sheet(list(cons.values()),'dbg_cons.png',lambda g:'U+%04X'%ord(inv[g]))
    sheet(autos,'dbg_auto.png',lambda g:'g%d %s'%(g,' '.join('%04X'%ord(c) for c in names[g])))
