proc-yr.py >data-.txt
proc.py >op.txt
pypy calcrating.py
sort.py
mkdir tmp
cp data-.txt tmp\
cp proc.py tmp
cp calcrating.py tmp
cp sort.py tmp
cd tmp
proc.py merge_time >op.txt
pypy calcrating.py
sort.py
cp data.js ..\data2.js
cd ..
rd /s /Q tmp
pause