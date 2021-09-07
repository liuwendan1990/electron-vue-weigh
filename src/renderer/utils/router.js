import log from '@/utils/log'
import store from '@/store/index'
const url = require('url')
const querystring = require('querystring')

export function router (req, resp) {
  const urlObj = url.parse(req.url, true)
  if (req.method === 'GET') {
    // 解析url参数
    let params = urlObj.query
    log.info('receive request: ' + req.url)
    console.log(params)
    if (urlObj.pathname === '/warningInfo') {
      if (params.warningInfo) {
        store.dispatch('setWarningInfo', params.warningInfo)
        resp.writeHead(200, {'Content-Type': 'application/json;charset=utf8'})
        resp.write('{code:0, msg: "ok"}')
      } else {
        resp.writeHead(200, {'Content-Type': 'application/json;charset=utf8'})
        resp.write('{code:1, msg: "无警告信息"}')
      }
    }
    if (urlObj.pathname === '/pushPoundInfo') {
      // resp.write('车牌号' + params.carNo)
      // resp.write('毛重' + params.grossWeight)
      // resp.write('皮重' + params.tareWeight)
      // resp.write('净重' + params.netWeight)
      store.dispatch('setPoundInfo', params)
      resp.writeHead(200, {'Content-Type': 'application/json;charset=utf8'})
      resp.write('{code:0, msg: "成功"}')
    }
    resp.end()
  } else if (req.method === 'POST') {
    // 暂存请求体信息
    let body = ''
    // 每当接收到请求体数据，累加到post中
    req.on('data', function (chunk) {
      // 一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
      body += chunk
      // console.log('chunk:', chunk)
    })
    // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    req.on('end', function () {
      // 解析参数，将一个字符串反序列化为一个对象
      body = querystring.parse(body)
      console.log('body:', body)

      if (urlObj.pathname === '/warningInfo') {
        store.dispatch('setWarningInfo', body.warningInfo)
        resp.write('{code:0, msg: "ok"}')
      }
      if (urlObj.pathname === '/pushPoundInfo') {
        let poundInfo = {
          carNo: body.carNo,
          grossWeight: body.grossWeight,
          tareWeight: body.tareWeight,
          netWeight: body.netWeight
        }
        if (body.carNo && body.grossWeight && body.tareWeight && body.netWeight) { // 输出提交的数据
          // resp.write('车牌号：' + body.carNo)
          // resp.write('<br>')
          // resp.write('毛重：' + body.grossWeight)
          // resp.write('<br>')
          // resp.write('皮重：' + body.tareWeight)
          // resp.write('<br>')
          // resp.write('净重：' + body.netWeight)
          console.log(poundInfo)
          store.dispatch('setPoundInfo', poundInfo)
          resp.writeHead(200, {'Content-Type': 'application/json'})
          resp.write('{code:0, msg: "ok"}')
        } else { // 输出表单
          resp.write('请求数据不满足要求')
        }
      }
      resp.end()
    })
  }
}
