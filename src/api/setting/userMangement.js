import request from "@/utils/request"
export function tree(params) {
  return request({
    url: "api/sys/office/trees",
    method: "get",
    params
  })
}
export function tableList(params) {
  return request({
    url: "/api/sys/office/list",
    method: "get",
    params
  })
}
