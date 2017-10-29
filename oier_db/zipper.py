t=open('pb.html','r')
pv=''
o=open('zb.html','w')
for g in t.readlines():
    x=g.decode('utf-8')[4:-3]
    h=x.split(',')
    if len(h)!=6:
        print 'GG'
    jx=h[5]
    h=h[:-1]
    if jx!=pv:
        pv=jx
        print 'f='+jx+';'
        o.write('f='+jx.encode('utf-8','ignore')+';\n')
    if h[3]=='undefined':
        h[3]='u'
    else:
        h[3]=str(int(h[3])-2000)
    if h[4]=='undefined':
        h[4]='u'
    o.write('_('+(','.join(h)).encode('utf-8','ignore')+');\n')
