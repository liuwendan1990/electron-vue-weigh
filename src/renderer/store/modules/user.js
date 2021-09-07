import {getToken, setToken, removeToken} from '@/utils/auth.js'
import { login } from '@/api/sys.js'

const user = {
  state: {
    token: getToken()
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      removeToken()
      setToken(token)
    }
  },
  actions: {
    doLogin ({commit}, userInfo) {
      console.log('login' + userInfo.username + ',' + userInfo.password)
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password).then(resp => {
          const token = resp.data.token
          setToken(token)
          commit('SET_TOKEN', token)
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    }
  }
}

export default user
