/*
 * @Author: 刘小康 
 * @Date: 2018-12-27 09:44:29 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2019-01-26 17:25:37
 */
// 通知公告
<template>
  <div class="app-container">
    <el-container>
      <el-container>
        <el-header height="125px">
          <div class="topTitle">通知公告列表</div>
          <div class="filter-container">
            <div class="block">
              <el-input
                placeholder="输入内容搜索..."
                style="width: 210px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"
                v-model="query.title"
              />
              <span>时间段</span>
              <el-date-picker
                v-model="value1"
                type="date"
                value-format="timestamp"
                @change="start"
                size="mini"
                placeholder="开始日期"
              ></el-date-picker>
              <span>—</span>
              <el-date-picker
                v-model="value2"
                type="date"
                value-format="timestamp"
                @change="end"
                size="mini"
                placeholder="结束日期"
              ></el-date-picker>
              <el-popover
                placement="right-start"
                title
                width="200"
                trigger="manual"
                content="结束时间需大于开始时间。"
                v-model="popoverVisible"
              >
                <el-button
                  type="primary"
                  slot="reference"
                  icon="el-icon-search"
                  @click="handleFilter"
                  size="mini"
                >查询</el-button>
              </el-popover>
            </div>
          </div>
        </el-header>
        <el-main v-loading="v.loading">
          <div class="filter-container" style="padding-top: 0;">
            <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="create">新增公告</el-button>
            <el-button class="filter-item" type="info" icon="el-icon-delete" @click="del">删除</el-button>
          </div>
          <div>
            <el-table
              :data="list"
              row-key="id"
              stripe
              style="width: 100%"
              border
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
              <el-table-column prop="title" label="标题"/>
              <el-table-column prop="createByName" label="发起人"/>
              <el-table-column prop="sendTime" label="发起时间"/>
              <el-table-column prop="id" label="操作" width="100">
                <template slot-scope="scope">
                  <!-- <el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit"/> -->
                  <el-button @click="edit(scope.row)" type="text" title="编辑">
                    <svg-icon icon-class="editColor"/>
                  </el-button>
                  <el-button type="text" @click="detailBtn(scope.row)" title="详情">
                    <svg-icon icon-class="detailColor"/>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="query.total>0"
              :total="query.total"
              :page.sync="query.pageNo"
              :limit.sync="query.pageSize"
              @pagination="getList"
            />
          </div>
        </el-main>
      </el-container>
    </el-container>
    <!--添加编辑弹窗-->
    <el-dialog :visible.sync="v.form" title="编辑">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="内容">
          <quill-editor
            v-model="form.content"
            ref="myQuillEditor"
            :options="quillform.editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
          ></quill-editor>
          <el-upload
            style="display:none"
            class="avatar-uploader"
            :http-request="uploadFile"
            :data="uploadform.uploaddata"
            :action="uploadform.serverUrl"
            name="img"
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
        <el-button @click="v.form = false">取 消</el-button>
        <el-button @click="save()" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 通知公告弹窗 -->
    <el-dialog title="通知公告详情" :visible.sync="dialogVisible" width="60%">
      <div style="text-align:center">
        <h2 style="margin-bottom:0.6em;margin-top:0;">{{form.title}}</h2>
        <span>
          <p style="color: #636363;font-size: 12px;">{{form.createDate}} {{form.createByName}}</p>
        </span>
      </div>
      <div class="content ql-editor" v-html="form.content"></div>
    </el-dialog>
  </div>
</template> 
<script>
import Pagination from "@/components/Pagination"
import { getList, get, save, del } from "@/api/setting/msg.js"
import RmDict from "@/components/rm/dict"
import RmOrgSelect from "@/components/rm/orgselect"
import { getfiles, delfiles } from "@/api/res/river.js"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
import { file, upload } from "@/api/imgUplodFile"
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { getToken } from "@/utils/auth";
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
  ['link', 'image'],
  ['clean']                                         // remove formatting button
]
export default {
  components: { Pagination, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect, quillEditor },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      v: {
        form: false,
        loading: false
      },
      dialogVisible: false,
      list: null,
      fileList: [],
      doUpload: process.env.BASE_FILE_API + "?token=" + getToken(),
      uploaddata: {
        bizId: null,
        bizType: "msg"
      },
      uploadform: {
        serverUrl: process.env.BASE_FILE_API + "?token=" + getToken(),  // 这里写你要上传的图片服务器地址
        // header: {token: getToken()},  // 有的图片服务器要求请求头需要有token  
        uploaddata: {
          bizId: "",
          bizType: "msg"
        }
      },
      value1: "",
      value2: "",
      popoverVisible: false,
      originTime: {
        beginDate: '',
        endDate: '',
      },
      query: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        search: undefined,
        type: undefined,
        startTime: "",
        endTime: ""
      },
      // form: {
      //   type: '2',
      //   title: null,
      //   content: null,
      //   from: null,
      //   userType: null,
      //   userDesc: null,
      //   userData: null,
      //   ticket: null,
      //   status: null,
      //   sendTime: null,
      //   sendState: "2",
      //   remark: null
      // },
      form: {
        title: null,
        content: '',
      },
      multipleSelection: [],
      msgDeatail: {
        title: "",
        content: "",
        createDate: "",
        updateByName: ""
      },
      images1: [],
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
    };
  },
  created() {
    this.v.loading = true
    this.getList()
  },
  methods: {
    beforeUpload() {
      let out
      do
        out = Math.floor(Math.random() * 100000);
      while (out < 10000)
      this.uploadform.uploaddata.bizId = ((new Date()).getTime() + out).toString()
      console.log('this.uploadform.uploaddata.bizId', this.uploadform.uploaddata.bizId);

    },
    // 自定义图片的上传方式
    uploadFile(options) {
      return upload(this.uploadform.serverUrl, options)
    },
    handlError() {
      this.$message({
        message: "导入数据失败",
        type: "error"
      });
      this.listQuery.search = "";
      this.getList();
    },
    handleSuccess(respone) {
      let resData = respone.data
      if (resData.success == true) {
        let quill = this.$refs.myQuillEditor.quill
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', resData.data[0].url)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message({
          message: resData.msg,
          type: "error"
        });
      }
      this.getList();
    },
    detailBtn(row) {
      // Todo 图片还没接入
      this.dialogVisible = true
      this.$nextTick(() => {
        this.form = row
      })
    },
    getList() {
      getList(this.query).then(response => {
        this.v.loading = false
        this.list = response.data.list
        this.query.total = response.data.count
      }).catch((errorRes) => {
        this.v.loading = false
      })
    },
    start(start) {
      this.originTime.beginDate = start
      let startDate = new Date(start)
      this.query.startTime = startDate.getFullYear() + '-' + startDate.getMonth() + 1 + '-' + startDate.getDate()
    },
    end(end) {
      this.originTime.endDate = end
      let endDate = new Date(end)
      this.query.endTime = endDate.getFullYear() + '-' + endDate.getMonth() + 1 + '-' + endDate.getDate()
    },
    handleFilter() {
      if (this.originTime.beginDate > this.originTime.endDate) {
        this.popoverVisible = true
        setTimeout(() => {
          this.popoverVisible = false
        }, 1000)
        return
      } else {
        //进行查询
        this.query.pageNo = 1
        this.v.loading = true
        this.getList()
      }
    },
    create() {
      if (this.$refs.form != undefined) {
        this.$refs.form.resetFields()
      }
      this.v.form = true;
      // this.form = {};
    },
    edit(row) {
      //console.log(JSON.stringify(row));
      this.v.form = true;
      this.form = row;

      // getfiles({ bizId: this.form.id }).then(response => {
      //   this.fileList = response.data;
      // });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisibleImg = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    removefile(file) {
      delfiles({ id: file.id }).then(response => {
        console.log("图片删除成功!!!!!");
      });
    },
    save() {
      //console.log('保存:',JSON.stringify(this.form),this.selectUser);
      this.form.sendState = "2"
      if (this.form.title && this.form.content) {
        save(this.form).then(response => {
          this.v.form = false
          if (response.success) {
            this.$message({
              message: response.msg,
              type: "success"
            })
            //添加到列表中
            //this.list.unshift(this.form)
            this.getList()
          } else {
            this.$message({
              message: response.msg,
              type: "warning"
            })
          }
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    del() {
      //var self = this
      if (this.multipleSelection.length > 0) {
        const idArray = []
        this.multipleSelection.map(item => {
          idArray.push(item.id)
        })
        const idStr = idArray.join()
        console.log('idStr', idStr)
        this.$confirm("确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          del(idStr).then(res => {
            this.getList()
            this.$message({
              type: "success",
              message: res.msg
            })
          }).catch(errorRes => {
            this.getList()
          })
        }).catch(() => {
          // 用户点击取消按钮
        })
      } else {
        this.$message({
          type: "warning",
          message: "请先勾选!"
        })
      }

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
      this.content = html
    },
  }
};
</script>
<style scoped lang="scss">
.app-container {
  .filter-container {
    span {
      color: #636363;
      font-size: 12px;
    }
  }
  .ql-editor {
    /deep/ img {
      width: 100%;
    }
  }
  > .el-container {
    min-height: calc(100vh - 126px);
  }
  .el-dialog__body .pre-image img {
    width: 19%;
    height: 100px;
    max-height: 15em;
    margin: 0.5em 0.2em 0 0;
    float: left;
  }
  .subContent {
    h1,
    p {
      margin: 0;
      padding: 0;
    }
    .ContentHeader {
      text-align: center;
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 0.6em;
      margin-top: 0;
      // font-family: "微软雅黑";
    }
    .DetailMore {
      text-indent: 2em;
      padding-top: 15px;
      letter-spacing: 0.08em;
      font-size: 15px;
      color: rgb(41, 46, 51);
      text-align: justify;
      line-height: 26px;
      // font-family: "宋体";
      min-height: 200px;
    }
    .subUser {
      margin-top: 25px;
      float: right;
      span {
        display: block;
        padding-top: 5px;
      }
    }
  }
}
</style>
