import axios from 'axios'
// import { Message, MessageBox } from 'element-ui'
import { Message } from 'element-ui'
// import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers['token'] = token// 让每个请求携带自定义token 请根据实际情况自行修改
  }
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
    const res = response.data
    if (res.code !== 0 && res.code !== 1) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })

      // 999:非法的token
      // if (res.code === 999) {
      //   MessageBox.confirm('身份验证失败请重新登录', '提示', {
      //     confirmButtonText: '重新登录',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('FedLogOut').then(() => {
      //       location.reload()// 为了重新实例化vue-router对象 避免bug
      //     })
      //   })
      // }
      return Promise.reject(new Error(res.msg))
    } else {
      return res
    }
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
