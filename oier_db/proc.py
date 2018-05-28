#coding: utf8
import sys 
reload(sys)
sys.setdefaultencoding('utf-8')
fs=unicode(open('data-.txt','r').read(),'utf8')
fs=fs.replace(' ','')
tt=fs.split('\n')
edg={}
sum={}
tot={}
man={}
ff={}
sch=set()
cnt={}
def gf(x):
    if not ff.has_key(x):
        return x
    ff[x]=gf(ff[x])
    return ff[x]
def uni(a,b):
    ga,gb=gf(a),gf(b)
    if ga!=gb:
        ff[ga]=gb
db={}
prov=set()
ys={u'一':1,u'二':2,u'三':3,u'四':4,u'五':5,u'六':6,
u'七':7,u'八':8,u'九':9,u'十':1000233,u'零':0}
def isd(x):
    return len(x)==1 and '0'<=x and x<='9'
def num(a):
    g=''
    for b in prov:
        a=a.replace(b,'')
    for c in a:
        if isd(c):
            g=g+c
        if ys.has_key(c):
            g=g+str(ys[c])
    return g
def tc(a):
    bk=[u'校',u'学',u'大',u'分',u'范',u'属',u'省',u'市',u'区',u'书院',u'初级',u'初中',u'高中',u'中',u'第']
    tmp=(a.find(u'初')!=-1)
    for b in bk:
        a=a.replace(b,'')
    for b in prov:
        a=a.replace(b,'')
    if tmp:
        a=a+'初中'
    return a
def LCS(a,b):
    a,b='!'+a,'!'+b
    g=[]
    for i in range(0,len(a)):
        g.append([0]*len(b))
    for i in range(1,len(a)):
        for j in range(1,len(b)):
            if a[i]==b[j]:
                g[i][j]=g[i-1][j-1]+1
            else:
                g[i][j]=max(g[i-1][j],g[i][j-1])
    return g[len(a)-1][len(b)-1]
rp=[]
def yyy(yr):
    while not yr[-1:].isdigit():
        yr=yr[:-1]
    return int(yr[-4:])
for ss in tt:
    p=ss.split(',')
    if len(p)!=8:
        continue
    if p[6]=='@' or p[2]=='@' or p[4]=='@':
        print 'invalid data'
        print p
    prov.add(p[6])
    g=p[6]+'|'+p[2]
    if not man.has_key(g):
        man[g]=set()
    man[g].add(p[4])
    sch.add(p[4])
    yr=-1
    if p[3]!='@':
        yr=int(p[3])
    g=p[4]
    if not cnt.has_key(g):
        cnt[g]=0
    cnt[g]=cnt[g]+1
    rp.append(p)
    if yr==-1:
        continue
    yr=yr-yyy(p[0])
    if not tot.has_key(g):
        tot[g]=sum[g]=0
    tot[g]=tot[g]+1
    sum[g]=sum[g]+yr
for p in man:
    tmp=[]
    for g in man[p]:
        tmp.append(g)
    for a in range(0,len(tmp)):
        for b in range(a+1,len(tmp)):
            t=(tmp[a],tmp[b])
            if not edg.has_key(t):
                edg[t]=0
            edg[t]=edg[t]+1
for e in edg:
    #if edg[e]<2 or (not tot.has_key(e[0])) or (not tot.has_key(e[1])):
    #    continue
    #a0=sum[e[0]]*1.0/tot[e[0]]
    #a1=sum[e[1]]*1.0/tot[e[1]]
    #if abs(a0-a1)>=2:
    #    continue
    if num(e[0])!=num(e[1]):
        continue
    r,s=tc(e[0])+'$',tc(e[1])+'$'
    if not (r[:len(s)]==s[:] or s[:len(r)]==r[:]):
        continue
    uni(e[0],e[1])
for c in sch:
    f=gf(c)
    if not db.has_key(f):
        db[f]=c
    elif cnt[c]>cnt[db[f]]:
        db[f]=c
for a in range(0,len(rp)):
    rp[a][4]=db[gf(rp[a][4])]

def zs(s):
    mc,mp=0,'@'
    for g in s:
        if s[g]>mc:
            mc,mp=s[g],g
    return mp

#dump data by person
#for a person [name,sex,province,{age},[school],[[award,contest,rank]]]
ps={}
rk={}
for a in range(0,len(rp)):
    ky=rp[a][6]+'|'+rp[a][2]
    if not ps.has_key(ky):
        ps[ky]=[rp[a][2],rp[a][7],rp[a][6],{},[rp[a][4]],[]]
    if ps[ky][1]=='@':
        ps[ky][1]=rp[a][7]
    if ps[ky][2]=='@':
        ps[ky][2]=rp[a][6]
    if rp[a][3]!='@':
        if not ps[ky][3].has_key(rp[a][3]):
            ps[ky][3][rp[a][3]]=0
        ps[ky][3][rp[a][3]]=ps[ky][3][rp[a][3]]+1
    #elif ps[ky][3]!=rp[a][3] and rp[a][3]!='@':
    #    print u'年龄不一致',rp[a][2],ps[ky][3],rp[a][3]
    # 年龄不一致一般是由于数据错误、留级等
    if rp[a][4] in ps[ky][4]:
        ps[ky][4].remove(rp[a][4])
    ps[ky][4].append(rp[a][4])
    if not rk.has_key(rp[a][0]):
        rk[rp[a][0]]=0
    rk[rp[a][0]]=rk[rp[a][0]]+1
    ps[ky][5].append([rp[a][1],rp[a][0],rk[rp[a][0]]])
ds=[]
for g in ps:
    ps[g][3]=zs(ps[g][3])
    ds.append(ps[g])
import json
str=json.dumps(ds,ensure_ascii=False)
str=str.replace(u']]],',u']]],\n')#.replace(' ','')
print str.encode('utf8')