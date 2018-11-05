/*
 * @Author: 刘小康 
 * @Date: 2018-11-05 14:40:52 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2018-11-05 14:42:40
 */
import request from "@/utils/request";
export function AreaTree(params) {
  return request({
    url: "/api/sys/area/tree",
    method: "get",
    params
  });
}
// 查询部门列表
export function getDepList(params) {
  return request({
    url: "/api/sys/office/list",
    method: "get",
    params
  });
}
// 查询部门人员
export function getDepUser(params) {
  return request({
    url: "/api/sys/office/user",
    method: "get",
    params
  });
}
