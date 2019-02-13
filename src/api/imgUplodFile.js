import axios from 'axios'
import { getToken } from '@/utils/auth'

/**
 *
 * @param params bizType 和bizId的拼接
 * @param Data  element-ui的图片上传组件(el-upload)中的this.$refs.upload.uploadFiles 里面的数组元素
 * @returns {AxiosPromise} 请求
 * example: src/views/work/proTask.vue
 */
export function file(params, Data) {
  const formData = new FormData()
  for (const key in Data) {
    if (Data[key].raw) {
      formData.append('file' +  key, Data[key].raw)
    }
  }
  return axios({
    url: process.env.BASE_API + "/c/common/fileRecord/uploadFile/" + '?token=' + getToken() + params,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}


export function updateavatar(params, Data) {
  const formData = new FormData()
  formData.append('file', Data) 
  return axios({
    url: process.env.BASE_API + "/api/sys/user/upload/avatar" + '?token=' + getToken() + params,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 每次只上传一个文件，如果多个文件，会调用多次，el-upload组件配合使用
 * @param {*} url 
 * @param {*} option 
 */
export function upload(url,option) {   
  const formData = new FormData()
  formData.append(option.filename, option.file, option.file.name)
  if (option.data) {
    Object.keys(option.data).forEach(key => { 
      formData.append(key, option.data[key])
    })
  }
  return axios({
    url: url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
