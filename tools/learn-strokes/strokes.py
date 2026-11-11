import numpy as np, json, math
from PIL import Image, ImageDraw, ImageFont
from skimage.morphology import skeletonize
FONT='f_NotoSansMyanmarBwdthCwghtD.ttf'
EM=420; OX,OY=150,80; CW,CH=1100,900
font=ImageFont.truetype(FONT,EM)
def raster(ch):
    im=Image.new('L',(CW,CH),0); ImageDraw.Draw(im).text((OX,OY),ch,font=font,fill=255)
    return np.array(im)>127
N8=[(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
def build(sk):
    pts=set(map(tuple,np.argwhere(sk)))
    def nb(p): return [(p[0]+a,p[1]+b) for a,b in N8 if (p[0]+a,p[1]+b) in pts]
    return pts,nb
def edges_of(sk):
    pts,nb=build(sk)
    deg={p:len(nb(p)) for p in pts}
    # junction clusters: pixels deg>=3 ; merge adjacent
    jun={p for p in pts if deg[p]>=3}
    node_id={}; nodes=[]
    for p in jun:
        if p in node_id: continue
        st=[p]; comp=[]; node_id[p]=len(nodes)
        while st:
            q=st.pop(); comp.append(q)
            for r in nb(q):
                if r in jun and r not in node_id: node_id[r]=len(nodes); st.append(r)
        nodes.append(('J',comp))
    for p in pts:
        if deg[p]==1: node_id[p]=len(nodes); nodes.append(('E',[p]))
    edges=[]; seen=set()
    for p,nid in list(node_id.items()):
        for q in nb(p):
            if q in node_id: 
                continue
            if (p,q) in seen: continue
            path=[p,q]; seen.add((p,q)); prev=p; cur=q
            while True:
                nxt=[r for r in nb(cur) if r!=prev and r not in path[-3:]]
                hit=[r for r in nxt if r in node_id]
                if hit:
                    # prefer a node pixel that is not the start cluster unless path long
                    r=hit[0]; path.append(r); seen.add((r,cur)); break
                if not nxt: break
                # choose 4-neighbour first
                nxt.sort(key=lambda r: abs(r[0]-cur[0])+abs(r[1]-cur[1]))
                prev,cur=cur,nxt[0]; path.append(cur)
            a=nid; b=node_id.get(path[-1],None)
            edges.append([a,b,path])
    # dedupe (each edge found from both ends)
    out=[]; keys=set()
    for a,b,path in edges:
        k=frozenset([path[1],path[-2]]) if len(path)>2 else frozenset(path)
        if k in keys: continue
        keys.add(k); out.append([a,b,path])
    # pure cycles (no nodes)
    used=set(q for _,_,p in out for q in p)|set(node_id)
    rest=pts-used
    while rest:
        p=next(iter(rest)); path=[p]; rest.discard(p); cur=p
        while True:
            n=[r for r in nb(cur) if r in rest]
            if not n: break
            n.sort(key=lambda r: abs(r[0]-cur[0])+abs(r[1]-cur[1])); cur=n[0]; path.append(cur); rest.discard(cur)
        if len(path)>20: path.append(path[0]); out.append([None,None,path])
    return nodes,out
def plen(path): return sum(math.hypot(path[i+1][0]-path[i][0],path[i+1][1]-path[i][1]) for i in range(len(path)-1))
def prune(sk,minlen=34,rounds=3):
    sk=sk.copy()
    for _ in range(rounds):
        nodes,E=edges_of(sk); ch=False
        for a,b,path in E:
            if a is None or b is None: continue
            ta,tb=nodes[a][0],nodes[b][0]
            if (ta=='E')!=(tb=='E') and plen(path)<minlen:
                for p in path:
                    if p not in nodes[a][1] and p not in nodes[b][1]: sk[p]=False
                e=nodes[a][1][0] if ta=='E' else nodes[b][1][0]; sk[e]=False; ch=True
        sk=skeletonize(sk)
        if not ch: break
    return sk
def letter(ch):
    a=raster(ch); sk=prune(skeletonize(a)); nodes,E=edges_of(sk)
    return a,sk,nodes,E
if __name__=='__main__':
    import sys
    L=[chr(c) for c in range(0x1000,0x1022) if c!=0x1009]
    cols=6; cell=420; rows=-(-len(L)//cols)
    sheet=Image.new('RGB',(cols*cell,rows*cell),'white'); d=ImageDraw.Draw(sheet)
    f2=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',15)
    info={}
    for i,ch in enumerate(L):
        a,sk,nodes,E=letter(ch)
        ox=(i%cols)*cell-30; oy=(i//cols)*cell-10; s=0.5
        g=Image.fromarray((~a*40+215).astype('uint8')).resize((int(CW*s),int(CH*s))).crop((30,10,30+cell,10+cell))
        sheet.paste(g.convert('RGB'),((i%cols)*cell,(i//cols)*cell))
        cols_=[(220,0,0),(0,140,0),(0,0,220),(200,120,0),(160,0,160),(0,150,150),(90,90,90),(240,80,160)]
        for k,(na,nb_,path) in enumerate(E):
            c=cols_[k%8]
            d.line([(ox+x*s,oy+y*s) for y,x in path],fill=c,width=2)
            m=path[len(path)//2]; d.text((ox+m[1]*s+4,oy+m[0]*s+4),'e%d'%k,fill=c,font=f2)
        for n,(t,comp) in enumerate(nodes):
            y=sum(p[0] for p in comp)/len(comp); x=sum(p[1] for p in comp)/len(comp)
            d.ellipse((ox+x*s-4,oy+y*s-4,ox+x*s+4,oy+y*s+4),fill=(0,0,0) if t=='J' else (255,140,0))
            d.text((ox+x*s-16,oy+y*s-18),str(n),fill=(0,0,0),font=f2)
        d.text(((i%cols)*cell+6,(i//cols)*cell+6),'%d U+%04X'%(i,ord(ch)),fill=(0,0,0),font=f2)
        info[ch]=[(na,nb_,len(p)) for na,nb_,p in E]
    sheet.save('graph.png'); print(sheet.size)
    for ch,v in info.items(): print('%04X'%ord(ch),v)
