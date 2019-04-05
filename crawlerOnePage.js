/* 
  爬取不分页站点内容
*/
const util = require('./util')
const fs = require('fs')
var cheerio = require('cheerio')
/* 定义爬虫的目标地址 */
const targetUrl = 'https://www.qichacha.com/search_index?key=%25E5%259B%25BD%25E7%25BD%2591%25E6%25B9%2596%25E5%258C%2597%25E7%259C%2581%25E7%2594%25B5%25E5%258A%259B&ajaxflag=1&p=2&'
util.getTargetSiteContent(targetUrl, data => {
  if (data) {
    let $ = cheerio.load(data)
    /* 分析爬取的页面信息获取想要的内容 */
    let goodsItemList = $('#search-result tr')
    let goodsData = []
    goodsItemList.each(function(item){
      // let name1 = $(this).find('td').eq(2).children('a').children('em').find('em').text()
      let name = $(this).find('td').eq(2).children('a').text()
      // let name =  name2
      let phone =  $(this).find('td').eq(2).children('p').eq(1).find('.m-l').text()
      let address = $(this).find('td').eq(2).children('p').eq(2).text()
      goodsData.push({
        name,
        phone,
        address
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
