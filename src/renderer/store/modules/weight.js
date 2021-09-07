const weight = {
  state: {
    poundInfo: {},
    warningInfo: ''
  },
  mutations: {
    SET_POUND_INFO: (state, info) => {
      state.poundInfo = info
    },
    SET_WARNING_INFO: (state, info) => {
      state.warningInfo = info
    }
  },
  actions: {
    setPoundInfo ({commit}, info) {
      commit('SET_POUND_INFO', info)
    },
    setWarningInfo ({commit}, info) {
      commit('SET_WARNING_INFO', info)
    }
  }
}
export default weight
