import request from '@/utils/request'
export function loginByUsername(username, password) {
  const data = {
    username,
    password,
    mobileLogin: true
  }
  return request({
    url: '/c/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/c/logout',
    method: 'post',
    transformResponse: [function(data) {
      // logout shiro拦截器返回的数据不是json，而是文本
      // console.log('data:',data)
      data = JSON.parse(data)
      data.success = data.success || true
      return data
    }]
  })
}

export function getUserInfo(token) {
  return request({
    url: '/api/employee/me',
    method: 'get',
    params: { token }
  })
}

// 旧代码
export function login(username, password) {
  return request({
    url: '/c/login',
    method: 'post',
    data: {
      username,
      password,
      mobileLogin: true
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/api/employee/me',
    method: 'get'
  })
}

export function logout2() {
  return request({
    url: '/c/logout',
    method: 'get',
    transformResponse: [function(data) {
      // logout shiro拦截器返回的数据不是json，而是文本
      // console.log('data:',data)
      data = JSON.parse(data)
      data.success = data.success || true
      return data
    }]
  })
}
