<template>
  <div class="app-container">
    <el-container>
      <el-container>
        <el-header height="125px">
          <div class="topTitle">工作简报列表</div>
          <div class="filter-container">
            <el-input
              placeholder="输入标题"
              v-model="query.title"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
            <el-select
              v-model="query.isAuditor"
              placeholder="请选择列别"
              @change="selectChang"
              clearable
              style="width: 120px"
              class="filter-item"
            >
              <el-option
                v-for="item in examineOptions"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >查询</el-button>
          </div>
        </el-header>
        <el-main>
          <div class="filter-container" style="padding-top: 0;">
            <el-button type="primary" icon="el-icon-plus" @click="create">新增</el-button>
            <el-button class="filter-item" type="info" icon="el-icon-delete" @click="del">删除</el-button>
          </div>
          <el-table :data="list" border stripe row-key="id"  style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="title" label="简报标题"/>
            <!-- <el-table-column prop="content" label="工作简报"/> -->
            <el-table-column prop="auditor" label="审核人"/>
            <el-table-column prop="createDate" label="发布时间"/>
            <el-table-column prop="isAuditor" label="是否审核"/>
            <el-table-column prop="id" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="detailBtn(scope.row)"   type="text" size="mini" title="预览">
                    <svg-icon icon-class="previewColor"/>
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

          <el-dialog :visible.sync="detailformvaisable" title="预览">
            <div style="text-align:center">
              <h1>{{form.title}}</h1>
              <span>
                <p>{{form.createDate}} {{form.auditor}}</p>
              </span>
            </div>
            <div class="content ql-editor" v-html="form.content"></div>
            <div>
              <el-upload
                class="upload-demo"
                style="text-align: left;"
                :multiple="true"
                ref="upload"
                :action="uploadaction"
                :file-list="fileList"
                :auto-upload="true"
                :data="uploaddata"
                :on-remove="handleRemove"
                accept=".pdf"
                :on-preview="handlePreview"
              >
                <i class="el-icon-ali-icon-test"></i>附件上传
              </el-upload>
            </div>
            <div slot="footer" class="dialog-footer" v-if="showBtn">
              <div>
                <el-button @click="detailformvaisable = false">取 消</el-button>
                <el-button @click="reviewBtn" type="primary">审核</el-button>
              </div>
            </div>
          </el-dialog>

          <el-dialog :visible.sync="v.form" title="编辑">
            <el-form ref="form" :model="form" label-width="120px">
              <el-form-item label="简报标题">
                <el-input v-model="form.title" placeholder="请输入简报标题"/>
              </el-form-item>
              <el-form-item label="工作简报">
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
                  :action="uploadform.serverUrl"
                  name="img"
                  :data="uploaddata2"
                  :headers="uploadform.header"
                  :show-file-list="false"
                  :on-success="handleSuccess"
                  :on-error="handlError"
                  :before-upload="beforeUpload"
                  :file-list="fileList"
                  accept=".png, .jpg, .gif"
                ></el-upload>

                <div>
                  <el-upload
                    class="upload-aa"
                    style="text-align: left;"
                    :multiple="true"
                    ref="fileUpload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :file-list="fileList2"
                    :auto-upload="false"
                    :data="uploaddata"
                    :on-remove="handleRemove"
                    accept=".pdf"
                    :on-preview="handlePreview"
                  >
                    <i class="el-icon-ali-icon-test"></i>附件上传
                  </el-upload>
                </div>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="v.form = false">取 消</el-button>
              <el-button @click="save()" type="primary">确 定</el-button>
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template> 
<script> 
import Pagination from '@/components/Pagination'
import { getList, get, save, del, examine } from '@/api/work/workBriefing.js'
import { getfiles, delfiles, uploadFile } from "@/api/res/river.js"
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { getToken } from "@/utils/auth"
import { file } from "@/api/imgUplodFile"
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
  components: { Pagination, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect, quillEditor },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      v: {
        form: false,
        loading: false
      },
      showBtn: true,
      multipleSelection: [],
      examineOptions: [{ label: "全部已审核", key: "1" }, { label: "待审核", key: "0" },],
      query: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        title: undefined,
        type: undefined,
        isAuditor: "1"
      },
      wordUrl: null,
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
      list: null,
      uploaddata: {
        bizId: null,
        bizType: "gzjb"
      },
      uploaddata2: {
        bizId: "10011",
        bizType: "photo"
      },
      fileList: [],
      fileList2: [],
      detailformvaisable: false,

      uploadaction: process.env.BASE_API + "/c/common/fileRecord/uploadFile?token=" + getToken(),
      form: {
        id: null,
        title: null,
        content: null,
        auditor: null,
        auditorDate: null,
        office: null,
        isAuditor: null,
      },
      uploadform: {
        serverUrl: process.env.BASE_FILE_API + "?token=" + getToken(),  // 这里写你要上传的图片服务器地址
        // header: {token: getToken()}  // 有的图片服务器要求请求头需要有token  
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**图片上传 */
    beforeUpload(file) {
      this.listLoading = true;
      this.v.formupdate = false;
    },
    handleSuccess(respone) {
      console.log("respone:::", respone.url);
      if (respone.success == true) {
        let quill = this.$refs.myQuillEditor.quill
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', respone.data[0].url)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message({
          message: respone.msg,
          type: "error"
        });
      }
      this.getList();
    },
    handlError() {
      this.$message({
        message: "导入数据失败",
        type: "error"
      });
      this.listQuery.search = "";
      this.getList();
    },
    beforeUpload(file) {
      this.listLoading = true;
      this.v.formupdate = false;
    },

    /**图片上传部分结束 */
    getList() {
      this.listLoading = true;
      console.log(this.query);

      getList(this.query).then(response => {
        this.listLoading = false
        this.list = response.data.list
        console.log("list", this.list);
        this.query.total = response.data.count
      })
    },
    handleFilter() {
      this.query.pageNo = 1
      this.getList()
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
    create() {
      this.fileList2 = []
      this.v.form = true
      this.form = {}
    },
    save() {
      var regu = /^ +| +$/g; 
      console.log("this.form.title",this.form.title);
      
      if(this.form.title == undefined ){
          this.$message({
          message: "请输入简报标题!",
          type: "error"
        })
        return;
      }
      if (this.$refs.fileUpload.uploadFiles == undefined || this.$refs.fileUpload.uploadFiles.length < 1) {
        this.$message({
          message: "请上传附件!",
          type: "error"
        })
        return;
      }
        const isLt10M = this.$refs.fileUpload.uploadFiles[0].raw.size / 1024 / 1024 < 10
        const type = this.$refs.fileUpload.uploadFiles[0].raw.type === "application/pdf"
        if (!type) {
          this.$message({
            message: "上传附件只能是PDF文件!",
            type: "error"
          })
          return
        }
        if(!isLt10M) {
          this.$message({
            message: "上传附件大小不能超过 10MB!",
            type: "error"
          })
          return          
        }

      save(this.form).then(response => {
        if (this.$refs.fileUpload.uploadFiles !== undefined && this.$refs.fileUpload.uploadFiles.length > 0) {
          // 附件上传到服务器 
          const imgParams = "&bizType=" + this.uploaddata.bizType + "&bizId=" + response.data.id;
          file(imgParams, this.$refs.fileUpload.uploadFiles).then(res => {
          })
          this.$message({
            message: '新增成功',
            type: 'success'
          });
          this.listLoading = true;
          this.v.form = false
          this.getList()
        }
      })
      
    },
    detailBtn(row) { 
      if (this.query.isAuditor == 0) {
        this.showBtn = true
      } else if (this.query.isAuditor == 1) {
        this.showBtn = false
      } else {
        this.showBtn = true
      }

      this.fileList = []
      this.form = row;
      this.detailformvaisable = true;
      this.uploaddata.bizId = row.id
      getfiles(this.uploaddata).then(response => {
        this.fileList = response.worldArr
        console.log("file", this.fileList);
      })
    },
    handleRemove(file, fileList) {
      console.log("----=====", file)
      delfiles({ id: file.id }).then((res) => {
        this.$message({
          message: '已删除',
          type: 'success'
        });
      })
    },
    handlePreview(file) {
      // console.log("ss", file.url)
      // location.href = file.url
      window.open(file.url)
    },
    del() { 
      if (this.multipleSelection.length > 0 ) {
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
            this.$message({
              type: "warning",
              message: errorRes
            })
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
    selectChang(data) {
      console.log("data", data);

      this.query.isAuditor = data
      this.query.pageNo = 1
      this.getList()
    },
    //审核
    reviewBtn() {
      examine(this.form).then(response => {
        this.detailformvaisable = false; 
        this.$message({
          message: response.msg,
          type: "success"
        })
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  .filter-container {
    span {
      color: #636363;
      font-size: 12px;
    }
  }
  > .el-container {
    min-height: calc(100vh - 126px);
  }
  .ql-editor {
    /deep/ img {
      width: 100%;
    }
  }
}
</style>
