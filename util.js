const url = require('url')
const fs = require('fs')
let index = 0
/* 定义爬取页面方法 */
const  getTargetSiteContent = (targetUrl, success) => {
  // 解析地址
  let urlQuery = url.parse(targetUrl)
  // console.log(urlQuery)

  let http = ''
  if (urlQuery.protocol === 'http') {
    http = require('http')
  } else {
    http = require('https')
  }
  // 使用http模块的request()方法请求页面内容
  let req = http.request({
    'hostname': urlQuery.hostname,
    'path': urlQuery.path,
    'headers':{ // 有的页面需要带cookie请求
      'cookie': '_uab_collina=154462581895984850177888; saveFpTip=true; UM_distinctid=167b514441c7c6-07ada88d176c74-b781636-144000-167b514441d2da; zg_did=%7B%22did%22%3A%20%22167b5144513e5-0b7fc15fd1d3d7-b781636-144000-167b514451423c%22%7D; acw_tc=2a30794215527926590026504e062150e036f345d85790af6e9e0efe7b; QCCSESSID=kgso1340p60p2be2m8ub6u27l2; hasShow=1; Hm_lvt_3456bee468c83cc63fb5147f119f1075=1552792657,1553005179; zg_de1d1a35bfa24ce29bbf2c7eb17e6c4f=%7B%22sid%22%3A%201553009675735%2C%22updated%22%3A%201553009675740%2C%22info%22%3A%201552792657285%2C%22superProperty%22%3A%20%22%7B%7D%22%2C%22platform%22%3A%20%22%7B%7D%22%2C%22utm%22%3A%20%22%7B%7D%22%2C%22referrerDomain%22%3A%20%22%22%2C%22cuid%22%3A%20%2291182f6f67ce0c4080f53b124a6d501e%22%7D; CNZZDATA1254842228=1642590488-1544928305-https%253A%252F%252Fwww.baidu.com%252F%7C1553008063; Hm_lpvt_3456bee468c83cc63fb5147f119f1075=1553009676'
    }
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
