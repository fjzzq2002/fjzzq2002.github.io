# OI Word Cloud

生成OI词汇云。[Github Pages](https://fjzzq2002.github.io/oi_word_cloud/)

### How To Use

调整滚动条，将浏览器全屏，点击生成按钮即可。这很可能使你的浏览器卡顿数分钟。

### Methodology

提取OI相关的文本计算词频，并与标准文本词频对比，认为商较大的为OI特有词汇。

本项目使用的文本：

+ BZOJ题面：来自 [bzojch](https://github.com/Ruanxingzhi/bzojch)
+ LOJ题面、LOJ讨论：使用爬虫爬取
+ 部分公开算法博客：使用搜索引擎和爬虫爬取
+ OI Wiki 文本部分：[OI Wiki](https://github.com/OI-wiki/OI-wiki)

本项目以MIT License公开，且公开部分仅含词频信息。如果你认为你的权益受到了损害，请联系本项目作者。

### Acknowledgement

本项目用到了以下资源，在此一并致谢。

+ [D3-Cloud](https://github.com/jasondavies/d3-cloud)
+ [Bzojch](https://github.com/Ruanxingzhi/bzojch)
+ [Libre OJ](https://loj.ac/)
+ [OI Wiki](https://github.com/OI-wiki/OI-wiki)
+ [Jieba](https://github.com/fxsjy/jieba)

### Sample

![sample](sample.png)
