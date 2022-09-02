import axios from 'axios'
import { user } from '@/store'
import { getToken } from './auth'
import { ElNotification } from 'element-plus'

// axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {}
})

// 加载动画
let loading

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 请求前判断
    const userStore = getToken()
    if (userStore) {
      config.headers['Authorization'] = `Bearer ${userStore}`
    }
    // 
    loading = ElLoading.service({
      text: '拼命加载中...',
      background: 'rgba(178,215,173,1)'
    })
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    if (loading) loading.close()
    const { data } = response
    if (data.success) return data
    data.errCode
  },
  err => {
    if (loading) loading.close()
    const { status } = error.response
    switch (status) {
      case 0:
        ElNotification({
          title: "0",
          message: '无法连接服务器',
          type: 'error',
        })
        break;
      case 302:
        ElNotification({
          title: "302",
          message: '登录过期',
          type: 'error',
        })
        break;
      case 401:
        ElNotification({
          title: "401",
          message: '未验证的用户',
          type: 'error',
        })
        break;
      case 403:
        ElNotification({
          title: "403",
          message: '资源拒绝访问',
          type: 'error',
        })
        break;
      case 404:
        ElNotification({
          title: "404",
          message: '服务资源不存在',
          type: 'error',
        })
        break;
      case 500:
        ElNotification({
          title: "500",
          message: '服务运行错误',
          type: 'error',
        })
        break;
      case 504:
        ElNotification({
          title: "504",
          message: '代理访问错误',
          type: 'error',
        })
        break;
    }
    return Promise.reject()
  }
)

request.get = (url, params, headers = {}) => {
  return request({
    url,
    method: "GEt",
    params,
    headers
  })
}

request.post = (url, data) => {
  return request({
    url,
    method: "POST",
    data
  })
}

request.put = (url, data) => {
  return request({
    url,
    method: "GEt",
    data
  })
}

request.delete = (url, params) => {
  return request({
    url,
    method: "DELETE",
    params
  })
}



export default request;