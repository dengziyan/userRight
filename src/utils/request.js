import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken, getIDKey } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  async config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = await getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  async response => {
    const res = response.data

    // 判断是否携带token
    // 判断与原有token是否相等
    // 不等就换成返回来的token
    // console.log(response.headers.authorization)
    // // 判断是否携带token
    const token = response.headers.authorization
    console.log(token)
    if (token) {
      // 判断与原有token是否相等
      // 不等就换成返回来的token
      await setToken(token)
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 2000 && res.code !== undefined) {
      // 4001: Illegal token;Token expired;
      if (res.code === 4001) {
        if (getIDKey()) {
          axios.get(process.env.VUE_APP_BASE_API+'/sys/user-info/' + getIDKey(), { headers: { Authorization: getToken() } }).then(res => {
            console.log(res)
            if (res.data.code === 4001) {
              // to re-login
              MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                store.dispatch('user/resetToken').then(() => {
                  location.reload()
                })
              })
            }
          })
        } else {
          // to re-login
          MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return res
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
