<template>
  <div class="infomation">
    <el-container v-loading="loading">
      <el-aside style="margin-right: 0;">
        <div class="panel">
          <div class="source panel-body">
            <el-tabs v-model="activeName">
              <el-tab-pane label="河流" name="HL">
                <el-tree
                  :data="dataArray"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                  empty-text="暂无数据"
                  highlight-current
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                      <el-button
                        type="text"
                        class="el-icon-tickets"
                        size="mini"
                        @click.stop="detailClick(data)"
                      />
                    </span>
                  </span>
                </el-tree>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-aside>
      <el-container>
        <el-dialog :visible.sync="forms" title="编辑">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="基本信息">
              <!--富文本上传-->
              <quill-editor
                v-model="form.wxContent"
                ref="myQuillEditor"
                :options="quillform.editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
              ></quill-editor>
              <el-upload
                style="display:none"
                class="avatar-uploader"
                :action="uploadform.serverUrl"
                :http-request="uploadFile"
                name="img"
                :data="uploaddata"
                :headers="uploadform.header"
                :show-file-list="false"
                :on-success="handleSuccess"
                :on-error="handlError"
                :before-upload="beforeUpload"
                :file-list="fileList"
                accept=".png, .jpg, .gif"
              ></el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="forms = false">取 消</el-button>
            <el-button @click="save()" type="primary">确 定</el-button>
          </div>
        </el-dialog>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { tree, save, getdata } from '@/api/res/river'
import Pagination from '@/components/Pagination'
import { getfiles, delfiles, uploadFile } from '@/api/core/file.js'
import { upload } from "@/api/imgUplodFile"
import { getToken } from '@/utils/auth'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image', 'video'],
  ['clean']                                         // remove formatting button
]
export default {
  name: "information",
  components: { Pagination, quillEditor },
  data() {
    return {
      forms: false,
      form: {
        id: null,
        wxContent: null,
      },
      activeName: "HL",
      loading: true,
      dataArray: [],
      fileList: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      uploaddata: {
        bizId: null,
        bizType: "ifm"
      },
      uploadaction: process.env.BASE_API + "/c/common/fileRecord/uploadFile?token=" + getToken(),
      uploadform: {
        serverUrl: process.env.BASE_FILE_API + "?token=" + getToken(),  // 这里写你要上传的图片服务器地址
        // header: {token: getToken()}  // 有的图片服务器要求请求头需要有token  
      },
      quillform: {
        serverUrl: '',  // 这里写你要上传的图片服务器地址
        header: { token: getToken() },  // 有的图片服务器要求请求头需要有token之类的参数，写在这里 
        editorOption: {
          placeholder: '',
          theme: 'snow',  // or 'bubble'
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  console.log("image:::", value)
                  if (value) {
                    // 触发input框选择图片文件
                    document.querySelector('.avatar-uploader input').click()
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            }
          }
        }
      },
    }
  },
  created() {
    this.loadLeftTree()
  },
  methods: {
    detailClick() {

    },
    loadLeftTree() {
      tree({ type: this.activeName }).then((res) => {
        console.log("左边树", res)
        const data = res.data.list
        this.dataArray = data
        this.loading = false
      }).catch((errorRes) => {
        this.loading = false
      })
    },
    onEditorBlur(quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    },
    onEditorChange({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      this.form.wxContent = html
    },
    handleNodeClick(data) {
      this.forms = true
      this.form.wxContent = ''
      this.form.id = data.id
      this.$nextTick(() => {
        getdata(this.form.id).then(response => {
          this.form.wxContent = response.data.wxContent
        })
      })

    },
    save() {
      var regu = /^ +| +$/g;
      save(this.form).then(response => {
        this.$message({
          message: '新增成功',
          type: 'success'
        });
        this.forms = false
      })
    },
    handleSuccess(respone) {
      if (respone.data.success == true) {
        let quill = this.$refs.myQuillEditor.quill
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', respone.data.data[0].url)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message({
          message: respone.msg,
          type: "error"
        });
      }
    },
    handlError() {
      this.$message({
        message: "导入数据失败",
        type: "error"
      });
    },
    beforeUpload(file) {
      console.log("file", file);
    },
    uploadFile(options) {
      // :http-request="uploadFile"
      // import { upload } from "@/api/imgUplodFile"
      return upload(this.uploadaction, options)
    },
  }
}
</script>

<style lang="scss" scoped>
.infomation {
  /deep/ .el-dialog__body {
    max-height: 49em;
  }
}
.el-button .svg-icon {
  width: 1.2rem;
  height: 1.2rem;
}
.cell .el-button--text:first-of-type .svg-icon {
  fill: #4ecc89;
}
.el-container {
  .el-aside {
    width: 15% !important;
  }
  .el-header,
  .el-main {
    border: 1px solid transparent;
    border-color: #ddd;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    width: 100%;
  }
  .el-header {
    margin-bottom: 1%;
  }
}

.panel {
  margin-bottom: 0;
  min-height: 91vh;
  overflow: auto;
  height: 100%;
  .panelHeading {
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 39px;
    .svg-icon {
      margin: 0 5px;
    }
    .btn-group {
      position: relative;
      // display: inline-block;
      vertical-align: middle;
      float: right;
    }
  }
  .source {
    padding-left: 10px;
    padding-right: 10px;
  }
  .panel-body {
    overflow: auto;
    height: calc(86vh - 41px);
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.panel {
  background-color: #fff;
  border: 1px solid transparent;
  border-color: #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.panelHeading {
  padding: 8px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
</style>
