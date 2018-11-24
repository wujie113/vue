import request from "@/utils/request"

export function getList(params) {
  return request({
    url: "/api/homePage/home/list",
    method: "get",
    params
  });
}
