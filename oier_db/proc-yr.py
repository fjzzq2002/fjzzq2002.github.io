#coding: utf8
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
fs=unicode(open('data.txt','r').read(),'utf8')
tt=fs.split('\n')
off={
"小学一年级":0,"小一":0,
"小学二年级":1,"小二":1,
"小学三年级":2,"小三":2,
"小学四年级":3,"小四":3,
"小学五年级":4,"小五":4,
"小学六年级":5,"小六":5,
"初一":6,"初二":7,"初三":8,"初四":8, #实在抱歉
"高一":9,"高二":10,"高三":11,
"中一":6,"中二":7,"中三":8,
"中四":9,"中五":10,"中六":11,"中七":12,
"初中一年级":6,"初中二年级":7,"初中三年级":8,
"高中一年级":9,"高中二年级":10,"高中三年级":11,
"初中":-1,'小学':-1,'六':5}
ys=["小一","小二","小三","小四","小五","小六","初一","初二","初三","高一","高二","高三"]+["高三以上"]*999
op=[]
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
    print g
    return -1
def ord(st):
    p=st.split(',')
    if len(p)!=8:
        return (10**18,10**18)
    yr=p[0]
    while not yr[-1:].isdigit():
        yr=yr[:-1]
    return (int(yr[-4:]),od(yr[:-4]))
tt.sort(key=ord)
for ss in tt:
    p=ss.split(',')
    if len(p)!=8:
        continue
    for g in range(0,8):
        if p[g]=='':
            p[g]='@'
    p[2]=p[2].replace(' ','').replace('\n','')
    if p[3]!='@':
        p[3]=p[3].replace('年级','')
        g=-1
        if off.has_key(p[3].encode('utf8')):
            g=off[p[3].encode('utf8')]
        else:
            pass #print p[3]
        yr=p[0]
        while not yr[-1:].isdigit():
            yr=yr[:-1]
        yr=yr[-4:]
        yr=int(yr)
        if not p[0].startswith('NOIP'):
            yr=yr-1
        if g!=-1:
            g=yr-g
        if g!=-1:
            p[3]=unicode(str(g),'utf8')
        else:
            p[3]=u'@'
    op.append(u','.join(p))
print '\n'.join(op).encode('utf8')