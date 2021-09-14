import request from '@/utils/request'
import { CurentTime } from '@/utils/timeformat'

export function login (loginName, password) {
  return request({
    url: 'dispatcher/login',
    method: 'post',
    params: {
      loginName,
      password
    }
  })
}

export function getTableData (queryParam) {
  const queryData = {...queryParam}
  if (queryData.queryStartDate !== '') {
    queryData.queryStartDate = CurentTime(queryData.queryStartDate)
  }
  if (queryData.queryEndDate !== '') {
    queryData.queryEndDate = CurentTime(queryData.queryEndDate)
  }
  console.log(queryData)
  return request({
    url: 'weigh/getWarehouseWeighingList',
    method: 'post',
    params: queryData
  })
}

export function gate (weighing, type) {
  return request({
    url: 'weigh/gate',
    method: 'post',
    params: {
      weighing,
      type
    }
  })
}
