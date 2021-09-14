import {getToken, setToken, removeToken} from '@/utils/auth.js'
// import { login } from '@/api/sys.js'

const user = {
  state: {
    token: getToken(),
    user: {} // 当前登陆用户
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      removeToken()
      setToken(token)
    },
    RECEIVE_USER: (state, {user}) => {
      state.user = user
    },
    RESET_USER: (state) => {
      state.user = {}
    }
  },
  actions: {
    // 保存user的同步action
    saveUser ({commit}, user) {
      // const token = user.token;
      // 将token保存到localStorage
      // localStorage.setItem('token_key', token)
      // 将token保存到state
      // commit(RECEIVE_TOKEN,{token})
      // 删除user中的token
      // delete user.token;
      commit('RECEIVE_USER', {user})
    }
  }
}

export default user
