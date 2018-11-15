/* 
  爬取分页站点内容
*/
const util = require('./util')
const fs = require('fs')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
const Goods = require('./dbModel')
mongoose.connect('mongodb://127.0.0.1:27017/goods')
mongoose.connection.on('connected', function(){
  console.log('Mongodb connected success')
})
// 要爬取的目标路径
let targetUrls = []
// 要爬取的总共页数(可以根据自己需求修改)
let targetPageSize = 10
for (let i = 1; i <= targetPageSize; i++) {
  // 将抓取目标分页路径存入数组
  targetUrls.push(`https://www.hua.com/flower/?r=0&pg=${i}`)
}
let targetDatas = []
targetUrls.forEach(function(targetUrl, index) {
  util.getTargetSiteContent(targetUrl, data => {
    if (data) {
      /* 分析爬取的页面信息获取想要的内容 */
      let $ = cheerio.load(data)
      let goodsItemList = $('.grid-item')
      goodsItemList.each(function(item){
        let imgSrc = $(this).find('a').children('img').attr('src')
        let price = $(this).find('.price-num').text() 
        let describe = $(this).find('.product-title').text()
        targetDatas.push({
          imgSrc,
          price,
          describe
        })
      })
    } else {
      console.log('未爬取到内容！')
    }
  })
  if (index === (targetPageSize - 1)) {
    /* 抓取内容时异步操作的，因此需要加个定时器，等内容都抓取完且都解析之后在写入json文件 */
    setTimeout(() => {
      let totalDatas = JSON.stringify(targetDatas)
      // 将处理好的数据写入json文件，方便进行数据mock
      fs.writeFile('./mock/data.json', totalDatas, function(err){
        if (err) {
          console.log(err)
        }
      })
      // 将解析的内容写入到mongodb数据库中
      targetDatas.map((value, index) => {
        let goods = new Goods(value)
        goods.save().then(() => {
          console.log(`成功写入数据库${index + 1}条数据！`)
        })
      })
    }, 2000)
  }
})

