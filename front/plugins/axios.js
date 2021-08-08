import Vue from 'vue'
import axios from 'axios'

const serve = axios.create({
  baseURL: '/api'
})

//请求拦截

//响应拦截
serve.interceptors.response.use(response => {
  let { data } = response
  return data
})

Vue.prototype.$http = serve

export const http = serve