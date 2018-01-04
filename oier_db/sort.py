#coding: utf8
#the code is really slow
#pypy is recommended
import sys,math,random
reload(sys)
sys.setdefaultencoding('utf-8')
import json
t=open('op2.txt','r').read()
t=t.replace('提高','提高组')
t=t.replace('普及','普及组')
o=json.loads(t)
o.sort(key=lambda g:-g[6])
for g in range(0,len(o)):
    o[g].append('BL')
f=open('data.js','w')
str=json.dumps(o,ensure_ascii=False)
str=str.replace(u', "BL"],',u'],\n').replace(u', "BL"',u'').replace(' ','')
f.write('var tb='+str+';')
f.close()