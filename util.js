const url = require('url')
const fs = require('fs')
let index = 0
/* 定义爬取页面方法 */
const  getTargetSiteContent = (targetUrl, success) => {
  // 解析地址
  let urlQuery = url.parse(targetUrl)
  let http = ''
  if (urlQuery.protocol === 'http') {
    http = require('http')
  } else {
    http = require('https')
  }
  // 使用http模块的request()方法请求页面内容
  let req = http.request({
    'hostname': urlQuery.hostname,
    'path': urlQuery.path
  }, res => {
    if (res.statusCode === 200) {
      let str = ''
      res.on('data', chunk => {
        str += chunk
      })
      res.on('end', () => {
        index++
        /* 将抓取到的内容写入本地html文件，方便分析解析内容 
        */
        if (index === 1) { // 只需要将一页内容写入本地文件
          fs.writeFile('./view/target.html', str, (err) => {
            if (err) {
              console.log(err)
            } else {
              console.log('成功写入本地文件！')
            }
          })
        }
        // 调用解析抓取内容的回调函数
        success && success(str)
      })
    } else if (res.statusCode === 302 || res.statusCode === 301) {
      /* 复杂页面会重定向崇礼，可以使用递归寻找真实路径 */
      getTargetSiteContent(res.headers.location, success)
    }
  })
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  })
  req.end()
}
module.exports.getTargetSiteContent = getTargetSiteContent
