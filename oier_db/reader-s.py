#coding=gb2312
'''
������һ���ܺ��õĽű��ģ����ڸ���ԭ���Ҳ����ˣ��ȴպ����ð�= =
��csvת����js��ansi���롣��ʽ���£�
@������
#������
R���ļ��ж�ȡ������Ϣ��csv��ʽ������ʹ��[��|ʡ|У|��|��|��]��
'''
def readfile(fn):
    fo=open(fn)
    y=0
    cn=""
    di={}
    bs=''
    jx=''
    ps=[]
    for line_ in fo:
        line=line_
        #�Ժ�Ӧ�ñ���������ٵ���...
        line=line[:-1]
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
                if tmp[i]!=' ' and tmp[i]!='':
                    di[tmp[i]]=i
            continue
        ip=line.split(',')
        scor="@" if di.get('��')==None else ip[di.get('��')]
        name="@" if di.get('��')==None else ip[di.get('��')]
        prov="@" if di.get('ʡ')==None else ip[di.get('ʡ')]
        scho="@" if di.get('У')==None else ip[di.get('У')]
        year="@" if di.get('��')==None else ip[di.get('��')]
        male="@" if di.get('��')==None else ip[di.get('��')]
        ps.append([bs,jx,name,year,scho,scor,prov,male])
#        print '%s,%s,%s,%s,%s,%s,%s,%s'%(bs,jx,name,year,scho,scor,prov,male)
    ps.sort(key=lambda s:-int(s[5]))
    for g in ps:
        print ','.join(g)
    fo.close()
while 1:
    t=raw_input()
    readfile(t)
