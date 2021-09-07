import request from '@/utils/request'

export function login (username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    params: {
      username,
      password
    }
  })
}

export function getTableData (queryParam) {
  return request({
    url: '/user/tabledata',
    method: 'post',
    params: queryParam
  })
}
