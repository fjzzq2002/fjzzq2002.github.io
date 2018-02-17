#coding: utf8
#the code is really slow
#pypy is recommended
import sys,math,random
reload(sys)
sys.setdefaultencoding('utf-8')
import json
def full_(g):
    if g=='NOIP':
        return 10
    if g=='WC':
        return 40
    if g=='CTSC':
        return 50
    if g=='APIO':
        return 25
    if g=='NOI':
        return 100
    if g=='IOI': #todo
        return 10000
    raise Exception('GG')
def od(g):
    if g=='NOIP':
        return 5
    if g=='WC':
        return 0
    if g=='CTSC':
        return 1
    if g=='APIO':
        return 2
    if g=='NOI':
        return 3
    if g=='IOI':
        return 4
    raise Exception('GG')
def typ(p):
    if p.find('金')!=-1 or p.find('一等')!=-1:
        return 0
    if p.find('银')!=-1 or p.find('二等')!=-1:
        return 1
    if p.find('铜')!=-1 or p.find('三等')!=-1:
        return 2
    print p
    raise Exception('GG')
def ord(p):
    yr=p
    while not yr[-1:].isdigit():
        yr=yr[:-1]
    return (int(yr[-4:]),od(yr[:-4]))
def full(p):
    yr=p
    while not yr[-1:].isdigit():
        yr=yr[:-1]
    g=full_(yr[:-4])
    if p[-2:]=='普及' or p[-2:]=='D类':
        g=g/10*6
    return g
#rank->score  [0,1]->[0,1]
def ys(x):
    return 1-math.log(x*0.5+1)/math.log(1.5)
def calc_mark(len,p):
    #f(0)=1  f(p)=0.6  f(len-1)=0.1
    ans=[]
    if p<0:
        for g in range(0,len):
            ans.append(ys(g*1.0/(len-1))*0.9+0.1)
        return ans
    for g in range(0,p):
        ans.append(ys(g*1.0/(p-1))*0.4+0.6)
    for g in range(p,len):
        ans.append((1-ys((len-1-g)*1.0/(len-1-p)))*0.5+0.1)
    return ans
t=open('op.txt','r').read()
o=json.loads(t)
s={}
mx={}
ps={}
for g in o:
    for t in g[5]:
        t.append(0)
        t[2]=t[2]-1 #0-based
        if not mx.has_key(t[1]):
            mx[t[1]]=0
        mx[t[1]]=max(mx[t[1]],t[2])
for g in range(0,len(o)):
    s[o[g][2]+'|'+o[g][0]]=g
for a in mx:
    ps[a]=[0]*(mx[a]+1)
for g in range(0,len(o)):
    for t in o[g][5]:
        ps[t[1]][t[2]]=g
rr=[]
for a in ps:
    rr.append([a,ps[a]])
rr.sort(key=lambda g:ord(g[0]))
for c in rr:
    dt=[]
    print c[0]
    for g in range(0,len(c[1])):
        t=c[1][g]
        for aa in range(0,len(o[t][5])):
            if o[t][5][aa][1]==c[0]:
                dt.append(typ(o[t][5][aa][0]))
                break
    d=full(c[0])
    ps=-1
    for a in range(0,len(dt)):
        if dt[a]==1:
            ps=a
            break
    nx=calc_mark(len(dt),ps)
    for g in range(0,len(c[1])):
        t=c[1][g]
        if t>=len(o):
            raise Exception("SHIT")
        for aa in range(0,len(o[t][5])):
            if o[t][5][aa][1]==c[0]:
                o[t][5][aa][3]=nx[g]*d
for g in range(0,len(o)):
    #calculate score
    pp={}
    for aa in o[g][5]:
        ooo=ord(aa[1])[1]
        if not pp.has_key(ooo):
            pp[ooo]=[]
        pp[ooo].append(aa[3])
    su=0
    for a in pp:
        tmp=pp[a]
        tmp.sort()
        cc=1
        for p in range(0,len(tmp))[::-1]:
            su=su+tmp[p]*cc
            cc=cc*0.5
    o[g].append(su)
    o[g].append('BL')
f=open('op2.txt','w')
str=json.dumps(o,ensure_ascii=False)
str=str.replace(u', "BL"],',u'],\n')#.replace(' ','')
f.write(str)
f.close()