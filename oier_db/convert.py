#coding=utf-8
'''
将csv转换成js，ansi编码。格式如下：
Y年份
R从哪几列读取个人信息，csv格式，可以使用[名|省|校|年|性]。
#奖项名称1
获奖列表，csv格式
#奖项名称2
'''
off={
"小学一年级":0,"小一":0,
"小学二年级":1,"小二":1,
"小学三年级":2,"小三":2,
"小学四年级":3,"小四":3,
"小学五年级":4,"小五":4,
"小学六年级":5,"小六":5,
"初一":6,"初二":7,"初三":8,
"高一":9,"高二":10,"高三":11,
"中一":6,"中二":7,"中三":8,
"中四":9,"中五":10,"中六":11,"中七":12,
"初中一年级":6,"初中二年级":7,"初中三年级":8,
"高中一年级":9,"高中二年级":10,"高中三年级":11}
ys=["小一","小二","小三","小四","小五","小六","初一","初二","初三","高一","高二","高三"]+["高三以上"]*999
def py(a,b):
    if b==None:
        return None
    return a-b
def readfile(fn):
    fo=open(fn)
    y=0
    cn=""
    di={}
    for line_ in fo:
        line=line_
        line=line[:-1].decode("gb2312",'ignore').encode("utf-8",'ignore')
        if len(line)==0:
            continue
        if line[0:1]=='Y': #year
            y=int(line[1:])
            continue
        if line[0:1]=='R': #column pos
            tmp=line[1:].split(',')
            for i in range(0,len(tmp)):
                if tmp[i]!=' ':
                    di[tmp[i]]=i
            continue
        if line[0:1]=='#':
            cn='"'+line[1:]+'"'
            continue
        ip=line.split(',')
        name="undefined" if di.get('名')==None else '"'+ip[di.get('名')]+'"'
        prov="undefined" if di.get('省')==None else '"'+ip[di.get('省')]+'"'
        scho="undefined" if di.get('校')==None else '"'+ip[di.get('校')]+'"'
        year="undefined" if di.get('年')==None else py(y,off.get(ip[di.get('年')]))
        if year==None:
            year="undefined"
        male="undefined" if di.get('性')==None else ("1" if ip[di.get('性')]=='男' or ip[di.get('性')]=='男生' else "0")
        print 'rec(%s,%s,%s,%s,%s,%s);'%(name,prov,scho,year,male,cn)
    fo.close()
while 1:
    t=raw_input()
    readfile(t)
