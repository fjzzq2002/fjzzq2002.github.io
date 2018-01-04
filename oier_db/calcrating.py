#coding: utf8
#the code is really slow
#pypy is recommended
import sys,math,random
reload(sys)
sys.setdefaultencoding('utf-8')
#uoj rating
def calc_rating(ra,w):
    we=[0]*len(ra)
    ex=[0]*len(ra)
    dt=[0]*len(ra)
    for i in range(0,len(ra)):
        we[i]=math.pow(7,ra[i]*1.0/w)
    for i in range(0,len(ra)):
        for j in range(0,len(ra)):
            if i!=j:
                ex[i]=ex[i]+we[i]/(we[i]+we[j])
    for i in range(0,len(ra)):
        dt[i]=int(math.ceil(w*(len(ra)-i-1-ex[i])*1.0/(len(ra)-1)))
    return dt
#按2/3得奖率估计升高的rating
def bet_rating(ra,w):
    print 'len:',len(ra)
    ta,su=[],0
    for g in ra:
        ta.append(g)
        su=su+g
    avr=1.0*su/len(ra)
    ps=[0]*len(ra)
    ex=int(len(ta)*0.5)
    ta=ta[:len(ra)]
    for i in range(0,ex):
        ta.append(int(math.ceil(avr*1.1-avr*0.3*i/ex)))
    tmp=calc_rating(ta,w)
    ps=tmp[:len(ra)]
    return ps
import json
def dts(g):
    if g=='NOIP':
        return 200
    if g=='WC':
        return 300
    if g=='CTSC':
        return 300
    if g=='APIO':
        return 300
    if g=='NOI':
        return 400
    if g=='IOI': #???
        return 1000
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
def ord(p):
    yr=p
    while not yr[-1:].isdigit():
        yr=yr[:-1]
    return (int(yr[-4:]),od(yr[:-4]))
def delta(p):
    yr=p
    while not yr[-1:].isdigit():
        yr=yr[:-1]
    g=dts(yr[:-4])
    if p[-2:]=='普及' or p[-2:]=='D类':
        g=g/10*6
    return g
t=open('op.txt','r').read()
o=json.loads(t)
s={}
mx={}
ps={}
ra=[1500]*len(o)
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
    for g in c[1]:
        dt.append(ra[g])
    d=delta(c[0])
    print 'delta =',d
    nx=bet_rating(dt,d)
    for g in range(0,len(nx)):
        nx[g]=max(nx[g],0)+d/40
    for g in range(0,len(c[1])):
        t=c[1][g]
        ra[t]=ra[t]+nx[g]
        for aa in range(0,len(o[t][5])):
            if o[t][5][aa][1]==c[0]:
                o[t][5][aa][3]=nx[g]
for g in range(0,len(o)):
    o[g].append(ra[g])
    o[g].append('BL')
f=open('op2.txt','w')
str=json.dumps(o,ensure_ascii=False)
str=str.replace(u', "BL"],',u'],\n')#.replace(' ','')
f.write(str)
f.close()