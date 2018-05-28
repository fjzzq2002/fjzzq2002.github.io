#coding=utf-8
'''
本来有一个很好用的脚本的，由于个人原因找不到了，先凑合着用吧= =
将csv转换成js，ansi编码。格式如下：
@比赛名
#奖项名
R从哪几列读取个人信息，csv格式，可以使用[名|省|校|年|性|分]。
'''
def readfile(fn):
    fo=open(fn)
    y=0
    cn=""
    di={}
    bs=''
    jx=''
    for line_ in fo:
        line=line_
        line=line[:-1].decode("gb2312",'ignore').encode("utf-8",'ignore')
        if len(line)==0:
            continue
        if line[0:1]=='@': #year
            bs=line[1:]
            continue
        if line[0:1]=='#':
            jx=line[1:]
            continue
        if line[0:1]=='R': #column pos
            tmp=line[1:].split(',')
            for i in range(0,len(tmp)):
                if tmp[i]!=' ':
                    di[tmp[i]]=i
            continue
        ip=line.split(',')
        scor="@" if di.get('分')==None else ip[di.get('分')]
        name="@" if di.get('名')==None else ip[di.get('名')]
        prov="@" if di.get('省')==None else ip[di.get('省')]
        scho="@" if di.get('校')==None else ip[di.get('校')]
        year="@" if di.get('年')==None else ip[di.get('年')]
        male="@" if di.get('性')==None else ip[di.get('性')]
        print '%s,%s,%s,%s,%s,%s,%s,%s'%(bs,jx,name,year,scho,scor,prov,male)
    fo.close()
while 1:
    t=raw_input()
    readfile(t)
