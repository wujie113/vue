import request from "@/utils/request";
export function AreaTree(params) {
  return request({
    url: "/api/sys/area/tree",
    method: "get",
    params
  });
}