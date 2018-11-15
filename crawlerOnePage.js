/* 
  爬取不分页站点内容
*/
const util = require('./util')
const fs = require('fs')
var cheerio = require('cheerio')
/* 定义爬虫的目标地址 */
const targetUrl = 'https://www.hua.com/flower/'

util.getTargetSiteContent(targetUrl, data => {
  if (data) {
    let $ = cheerio.load(data)
    /* 分析爬取的页面信息获取想要的内容 */
    let goodsItemList = $('.grid-item')
    let goodsData = []
    goodsItemList.each(function(item){
      let imgSrc = $(this).find('a').children('img').attr('src')
      let price = $(this).find('.price-num').text() 
      let describe = $(this).find('.product-title').text()
      goodsData.push({
        imgSrc,
        price,
        describe
      })
    })
    let writeData = JSON.stringify(goodsData)
    // 将处理好的数据写入json文件，方便进行数据mock
    fs.writeFile('./mock/result.json', writeData, function(err){
      if (err) {
        console.log(err)
      }
    })
  } else {
    console.log('未获取到爬虫内容！')
  }
})
