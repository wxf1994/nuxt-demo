import Vue from 'vue'
import axios from 'axios'
import { MessageBox } from 'element-ui'

const serve = axios.create({
  baseURL: '/api'
})

export default ({ store, redirect }) => {
  //请求拦截
  serve.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.common['Authorization'] = 'Bearer ' + token
    }
    return config
  })
  //响应拦截
  serve.interceptors.response.use(response => {
    let { data } = response
    if (data.code === -666) {
      MessageBox.confirm('登录已过期', '过期', {
        confirmButtonText: '登录',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        redirect({path: 'login'})
      })
    }
    return data
  })
}


Vue.prototype.$http = serve

export const http = serve