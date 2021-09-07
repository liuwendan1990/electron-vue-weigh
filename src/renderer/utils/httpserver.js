import log from '@/utils/log'
import {router} from '@/utils/router'
const http = require('http')
// const url = require('url')

const server = http.createServer((req, resp) => {
  router(req, resp)
})
server.listen('8888', () => {
  console.log('服务器启动成功, 请访问: http://localhost:8888')
})

log.info('local http server running at 8888')
