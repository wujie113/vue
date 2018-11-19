import request from "@/utils/request";
export function tree(params) {
  return request({
    url: "api/sys/office/trees",
    method: "get",
    params
  });
}
export function tableList(params) {
  return request({
    url: "/api/sys/user/list",
    method: "get",
    params
  });
}

export function Delete(params) {
  return request({
    url: "/api/sys/user/del",
    method: "get",
    params
  });
}
export function save(params) {
  return request({
    url: "/api/sys/user/save",
    method: "post",
    data: params    
  });
}

export function modifyPwd(params) {
  return request({
    url: "/api/sys/user/pwd",
    method: "post",
    data: params
  });
}

export function modifyState(params) {
  return request({
    url: "/api/sys/user/state",
    method: "post",
    data: params
  });
}
