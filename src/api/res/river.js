import request from "@/utils/request";

export function getList(params) {
  return request({
    url: "/api/res/river/list",
    method: "get",
    params
  });
}

export function get(id) {
  return request({
    url: "/api/res/river/get",
    method: "get",
    params: { id: id }
  });
}
export function save(data) {
  return request({
    url: "/api/res/river/save",
    method: "post",
    data
  });
}

export function del(ids) {
  return request({
    url: "/api/res/river/del",
    method: "post",
    params: { ids: ids }
  });
}

export function getxslist() {
  return request({
    url: "/api/res/river/sxlist",
    method: "get",
    params: { type: "SX" }
  });
}
export function tree() {
  return request({
    url: "/api/res/river/tree",
    method: "get"
  });
}

//发送图片上传
export function uploadFile(data) {
  return request({
    url: "/c/common/fileRecord/uploadFile",
    method: "post",
    data
  });
}

//获取图片路径数组[{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
export function getfiles(data) {
  return request({
    url: "/c/common/fileRecord/getFiles",
    method: "get",
    params: data
  });
}
//删除图片文件
export function delfiles(data) {
  return request({
    url: "/c/common/fileRecord/deleteFile",
    method: "post",
    data
  });
}
//保存管理人员
export function saveusers(data) {
  return request({
    url: "api/res/management/saveusers",
    method: "post",
    data
  });
}

//获取已经选择的人员信息
export function getmanagerlist(params) {
  return request({
    url: "api/res/management/managementuserlist",
    method: "get",
    params
  });
}
//删除选择的人员
export function deluser(idx) {
  const params = { ids: idx };
  console.log("params:::", params);
  return request({
    url: "api/res/management/del",
    method: "get",
    params
  });
}
export function gethzbuserbyareaid(params) {
  return request({
    url: "api/res/management/gethzbuserbyareaid",
    method: "get",
    params
  });
}

//用户责任段管理
export function getusermanagentriver(params) {
  return request({
    url: "api/res/river/usermanagentriver",
    method: "get",
    params
  });
}
