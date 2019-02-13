import request from "@/utils/request";
export function tree(params) {
  return request({
    url: "api/res/management/areaofficetrees",
    method: "get",
    params
  })
}
export function tableList(params) {
  return request({
    url: "/api/employee/usermanagerlist",
    method: "get",
    params
  })
}

export function Delete(params) {
  return request({
    url: "/api/employee/del",
    method: "post",
    data: params
  })
}
export function save(params) {
  return request({
    url: "/api/sys/user/save",
    method: "post",
    data: params
  })
}

export function modifyPwd(params) {
  return request({
    url: "/api/sys/user/pwd",
    method: "post",
    data: params
  })
}

export function modifyState(params) {
  return request({
    url: "/api/sys/user/state",
    method: "post",
    data: params
  })
}

export function getPostState(params) {
  return request({
    url: "/api/sys/office/dutybyofficeid",
    method: "get",
    params
  })
}


