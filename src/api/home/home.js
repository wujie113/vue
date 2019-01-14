import request from "@/utils/request"

export function getList(params) {
  return request({
    url: "/api/homePage/home/list",
    method: "get",
    params
  })
}

// 新闻动态
export function getNewsList(params) {
  return request({
    url: "/api/sys/sysNews/list",
    method: "get",
    params
  })
}

// 任务提醒
export function getMsgList(params) {
  return request({
    url: "/api/msg/list",
    method: "get",
    params
  })
}

// 工作简报
export function getWorkBriefingList(params) {
  return request({
    url: "/api/work/workBriefing/list",
    method: "get",
    params
  })
}

// 获取图片
export function getFiles(params) {
  return request({
    url: "/c/common/fileRecord/getFiles",
    method: "get",
    params
  })
}

//标记消息已读
export function markRead(params) {
  return request({
    url: "/api/msg/read",
    method: "post",
    data: params
  })
}