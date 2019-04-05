# NodeJs爬虫程序 -node-crawler 
---
## About
这是一个使用`NodeJs`实现的爬虫程序，可以实现分页站点页面内容的爬取，获取需求数据并将其写入本地`json`文件作为`mock`数据使用，同时支持将数据批量写入到`mongodb`数据库中。
* 使用NodeJs中http模块的request方法爬取页面内容
* 使用cheerio插件解析爬取的内容数据

## Usage
下载项目依赖
`npm install`
爬取不分页站点内容
`node crawlerOnePage`
爬取分页站点内容
`node crawlerAll`

> 注意：需要自行分析爬取站点的URl特征，更改爬取路径以及页码

## Author
wuzhichao
