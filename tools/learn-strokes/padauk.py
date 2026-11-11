"""Build js/learn-data.js from Padauk Book (SIL OFL).
O: glyph outlines (SVG path, 100 units = 1 em, baseline y=0, y down) -> what visitors see.
G: hidden centre-line strokes per glyph (order + direction) -> drive the ink reveal and check the finger.
Consonants keep the hand-made stroke order from the previous Noto-based data (mapped onto Padauk's centre-line);
everything else (vowel signs, medials) is ordered automatically like gen2.py."""
import json,math,sys,numpy as np,freetype,uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from skimage.morphology import skeletonize
from scipy.ndimage import distance_transform_edt
from scipy.spatial import cKDTree
import strokes as S, gen2
from circlify import spl, even, alen
FONT='PadaukBook.ttf'; EM=420
tt=TTFont(FONT); UPM=tt['head'].unitsPerEm; SC=100/UPM; gs=tt.getGlyphSet(); order=tt.getGlyphOrder()
face=freetype.Face(FONT); face.set_pixel_sizes(0,EM)
hbf=hb.Font(hb.Face(hb.Blob.from_file_path(FONT)))
H,W=1000,1300; OX,BASE=400,650
def raster(g):
    face.load_glyph(g,freetype.FT_LOAD_RENDER|freetype.FT_LOAD_NO_HINTING)
    b=face.glyph.bitmap; a=np.zeros((H,W),bool)
    if b.width==0: return a
    arr=np.array(b.buffer,dtype=np.uint8).reshape(b.rows,b.pitch)[:,:b.width]>127
    x0=OX+face.glyph.bitmap_left; y0=BASE-face.glyph.bitmap_top
    a[y0:y0+b.rows,x0:x0+b.width]=arr; return a
def U(y,x): return [(x-OX)/EM*100,(y-BASE)/EM*100]
def outline(g):
    pen=SVGPathPen(gs,ntos=lambda v:('%.1f'%v).rstrip('0').rstrip('.'))
    gs[order[g]].draw(TransformPen(pen,(SC,0,0,-SC,0,0))); return pen.getCommands()
def skel(g):
    a=raster(g); sk=skeletonize(a); return a,sk
def auto(g):
    a,sk=skel(g)
    if not a.any(): return []
    sk,dots=gen2.blobs_as_dots(a,sk); sk=S.prune(sk); nodes,E=S.edges_of(sk)
    paths=gen2.auto(nodes,E)+dots; paths.sort(key=lambda p:min(q[1] for q in p))
    return [[U(y,x) for y,x in gen2.resample(p)] for p in paths]
def chainify(pix):
    """order a set of skeleton pixels (one thin component) into a path"""
    S_=set(map(tuple,pix)); nb=lambda p:[(p[0]+a,p[1]+b) for a in(-1,0,1) for b in(-1,0,1) if (a or b) and (p[0]+a,p[1]+b) in S_]
    ends=[p for p in S_ if len(nb(p))<=1]; cur=ends[0] if ends else next(iter(S_)); path=[cur]; seen={cur}
    while True:
        n=[q for q in nb(cur) if q not in seen]
        if not n: break
        n.sort(key=lambda q:abs(q[0]-cur[0])+abs(q[1]-cur[1])); cur=n[0]; path.append(cur); seen.add(cur)
    return path
def mapped(g,noto):
    a,sk=skel(g); sk=S.prune(sk); pix=np.argwhere(sk); pts=np.array([U(y,x) for y,x in pix]); tree=cKDTree(pts)
    allp=np.vstack([even(np.array(s),1.0) for s in noto]); n0,n1=allp.min(0),allp.max(0); p0,p1=pts.min(0),pts.max(0)
    A=np.diag((p1-p0)/(n1-n0)); t=p0-n0@A
    for it in range(30):                      # affine ICP, both directions
        m=allp@A+t; d1,i1=tree.query(m); d2,i2=cKDTree(m).query(pts)
        src=np.vstack([allp,allp[i2]]); dst=np.vstack([pts[i1],pts])
        X=np.c_[src,np.ones(len(src))]; M=np.linalg.lstsq(X,dst,rcond=None)[0]; A,t=M[:2],M[2]
    out=[]
    for s in noto:
        s=even(np.array(s),1.0); m=s@A+t
        d,i=tree.query(m); q=np.where((d<6)[:,None],pts[i],m)
        closed=np.linalg.norm(s[0]-s[-1])<1.5 and len(s)>30
        q=spl(q,closed,0.15); q=even(q,1.0)
        if closed: q[-1]=q[0]
        out.append(q)
    # parts of the letter no stroke reaches: extend a stroke whose end touches them, else add a stroke after its neighbour
    R=W_INK*0.75
    for _ in range(6):
        allq=np.vstack(out); dd,_=cKDTree(allq).query(pts); miss=dd>R
        if miss.sum()<4: break
        mp=pix[miss]; lab=-np.ones(len(mp),int); T=cKDTree(mp); c=0
        for k in range(len(mp)):
            if lab[k]>=0: continue
            st=[k]; lab[k]=c
            while st:
                j=st.pop()
                for n_ in T.query_ball_point(mp[j],1.5):
                    if lab[n_]<0: lab[n_]=c; st.append(n_)
            c+=1
        done=False
        for ci in sorted(range(c),key=lambda ci:-(lab==ci).sum()):
            comp=mp[lab==ci]
            if len(comp)<8: continue
            path=np.array([U(y,x) for y,x in chainify(comp)])
            best=None
            for si,s in enumerate(out):
                for end in (0,-1):
                    for pe in (0,-1):
                        dist=np.linalg.norm(s[end]-path[pe])
                        if best is None or dist<best[0]: best=(dist,si,end,pe)
            dist,si,end,pe=best
            seg=path if pe==0 else path[::-1]
            if dist<R*2.2:
                out[si]=np.vstack([out[si],seg]) if end==-1 else np.vstack([seg[::-1],out[si]])
            else:
                # new stroke, starting from the end nearest existing ink; goes right after the stroke it touches
                allq=np.vstack(out); da=cKDTree(allq).query(path[0])[0]; db=cKDTree(allq).query(path[-1])[0]
                seg=path if da<=db else path[::-1]
                near=min(range(len(out)),key=lambda si:cKDTree(out[si]).query(seg[0])[0])
                out.insert(near+1,seg)
            done=True; break
        if not done: break
    res=[]
    for q in out: res.append(q)
    out=res; res=[]
    for q in out:
        closed=np.linalg.norm(q[0]-q[-1])<1.5 and alen(q)[-1]>30
        q=spl(q,closed,0.15); q=even(q,2.0)
        if closed: q[-1]=q[0]
        res.append(q.round(1).tolist())
    return res
def shape(s):
    b=hb.Buffer(); b.add_str(s); b.guess_segment_properties(); hb.shape(hbf,b)
    x=0; out=[]
    for i,p in zip(b.glyph_infos,b.glyph_positions):
        out+= [i.codepoint, round((x+p.x_offset)*SC,1), round(-p.y_offset*SC,1)]; x+=p.x_advance
    return [round(x*SC,1)]+out
old=json.load(open(sys.argv[1])); oldG=old['G']; oldK=old['K']
P=lambda s:[[float(v) for v in q.split(',')] for q in s.split()]
C={c:shape(c) for c in old['C']}
cmap=tt.getBestCmap(); K={ch:order.index(cmap[ord(ch)]) for ch in oldK}
gids=set(K.values())|{e[i] for e in C.values() for i in range(1,len(e),3)}
G={};Ol={}
for g in sorted(gids):
    Ol[g]=outline(g)
a=raster(K['ဝ']); dt=distance_transform_edt(a); W_INK=2*np.median(dt[skeletonize(a)])/EM*100
for ch,g in K.items(): G[g]=mapped(g,[P(s) for s in oldG[str(oldK[ch])]])
for g in sorted(gids-set(G)): G[g]=auto(g)
def extend_ends(g,strokes):
    a=raster(g); out=[]
    def inside(p):
        x=int(round(p[0]/100*EM+OX)); y=int(round(p[1]/100*EM+BASE))
        return 0<=y<H and 0<=x<W and a[y,x]
    for s in strokes:
        s=[list(p) for p in s]
        if len(s)>=3 and np.hypot(s[0][0]-s[-1][0],s[0][1]-s[-1][1])>1.5:
            for end in (0,1):
                p=np.array(s[-1] if end else s[0]); q=np.array(s[-4 if len(s)>4 else -2] if end else s[3 if len(s)>4 else 1])
                v=p-q; v=v/(np.linalg.norm(v)+1e-9)
                # how far the ink continues straight on from this end
                k=0
                while k<W_INK*1.2 and inside(p+v*(k+0.5)): k+=0.5
                if k>=W_INK*1.2: continue          # ink keeps going: a junction, not a terminal
                e=(p+v*min(k+W_INK*0.15,W_INK)).round(1).tolist()
                if end: s.append(e)
                else: s.insert(0,e)
        out.append(s)
    return out
for g in G: G[g]=extend_ends(g,G[g])
# ink width: twice the max distance-to-edge along wa's centre-line
a=raster(K['ဝ']); dt=distance_transform_edt(a); w=2*np.median(dt[skeletonize(a)])/EM*100
b=np.argwhere(a); top=U(b[:,0].min(),0)[1]; bot=U(b[:,0].max(),0)[1]
fmt=lambda s:' '.join('%s,%s'%(('%.1f'%x).rstrip('0').rstrip('.'),('%.1f'%y).rstrip('0').rstrip('.')) for x,y in s)
data={'TOP':round(top,1),'BOT':round(bot,1),'W':round(w,2),'K':K,'O':Ol,'G':{g:[fmt(s) for s in v] for g,v in G.items()},'C':C}
empty=[g for g in gids if not G[g] and Ol[g]]
print('glyphs',len(gids),'clusters',len(C),'ink width',round(w,2),'top',top,'bot',bot,'no strokes:',empty)
hdr='''/* Data for learn.html. Letter shapes: Padauk Book by SIL Global (SIL Open Font License 1.1, https://openfontlicense.org).
   O: glyph id -> outline (SVG path; 100 units = 1 em, baseline y=0, y down). What visitors see.
   G: glyph id -> hidden centre-line strokes "x,y x,y …" in writing order; they drive the ink and check the finger.
   C: Burmese cluster -> [advance, glyphId, x, y, …].  K: consonant -> glyph id.  TOP/BOT: ink top/bottom of a round letter.  W: ink width.
   Built by tools/learn-strokes/padauk.py. */
'''
open(sys.argv[2],'w').write(hdr+'window.MCC_STROKES='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
