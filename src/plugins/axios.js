/* eslint-disable no-unused-vars */
import axios from 'axios'
import store from '@/store'
import { getToken, getCookies } from '@/utils/cookies' // get token from cookie
import { Message, MessageBox } from 'element-ui'
import baseConfig from './baseConfig'
// create an axios instance
// const whiteList = ['webapi']
const _axios = axios.create({
  baseURL: baseConfig.host_API // api的base_url
  // timeout: 10000 // request timeout
})
// request interceptor
_axios.interceptors.request.use(
  config => {
    // config.params.t = new Date().getTime()
    if (getToken()) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['Token'] = getToken()
    }
    const project_id = getCookies('project_id')
    config.params = {
      project_id: project_id,
      // t: new Date().getTime(),
      ...config.params
    }
    return config
  },
  error => {
    // Do something with request error
    Promise.reject(error)
  }
)

// respone interceptor
_axios.interceptors.response.use(
  response => {
    console.log(response)
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // if (res.code === 401) {
      //   Message({
      //     message: res.msg,
      //     type: 'error',
      //     duration: 5 * 1000
      //   })
      //   return
      // }
      // // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('您已注销，您可以点击取消以停留在此页，或重新登录', '确认注销', {
      //     confirmButtonText: '重新登陆',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return false
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default _axios
