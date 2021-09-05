import { http } from "../plugins/axios"

const state = () => ({
    token: '',
    id: '',
    email: '',
    nickname: '',
    avator: ''
})

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_USER(state, user) {
    state.id = user._id
    state.email = user.email
    state.nickname = user.nickname
    state.avator = user.avator
  }
}

const actions = {
  detail: async ({state, commit}, res) => {
    let { code, data } = await http.get('/user/detail')
    if (code === 0) {
      commit('SET_USER', data)
    } 
  }
}

export default {
  namespace: true,
  state,
  mutations,
  actions
}