import axios from 'axios'
// import { Message, MessageBox } from 'element-ui'
import { Message } from 'element-ui'
// import store from '../store'
// import { getToken } from '@/utils/auth'
// import qs from 'qs'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // 1、处理post请求的请求体参数：转换为urlencode格式（默认用的json格式）
  // const {method, data} = config
  // if (method.toUpperCase() === 'POST' && data instanceof Object) {
  //   config.data = qs.stringify(data)
  // }
  // 2、如果需要携带token的请求，从state中取出token
  // const token = getToken()
  // if (token) {
  // config.headers['erp-token'] = token// 让每个请求携带自定义token 请根据实际情况自行修改
  config.headers['erp-token'] = 'def6d90e829e50c63f98c387daecd138'
  // }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非0或1是抛错 可结合自己业务进行修改
  */
    // console.log(response)
    const res = response.data
    // console.log(res, res.code)
    if (res.code !== 0) {
      Message({
        message: res.msg,
        type: 'error',
        center: true,
        duration: 5 * 1000
      })
      // return Promise.reject(new Error(res.msg))
    }
    return res
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
