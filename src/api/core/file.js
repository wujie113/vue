import request from '@/utils/request'
export function	uploadFile(data){  
    return request({
    url: '/c/common/fileRecord/uploadFile',
    method: 'post',
    data
  })
} 

//获取图片路径数组[{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
export function	getfiles(data){  
    return request({
    url: '/c/common/fileRecord/getFiles',
    method: 'get',
    params: data
  })
}
//删除图片文件
export function	delfiles(data){  
        return request({
            url: '/c/common/fileRecord/del',
            method: 'post',
            data
        })
}