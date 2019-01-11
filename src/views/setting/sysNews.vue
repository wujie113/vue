<template>
  <div class="app-container">
    <el-container>
      <el-container>
        <el-header height="125px">
          <div class="topTitle">新闻动态列表</div>
          <div class="filter-container">
            <div class="block">
              <el-input
                placeholder="输入新闻标题检索"
                v-model="query.title"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"
              />
              <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="handleFilter"
              >查询</el-button>
            </div>
          </div>
        </el-header>
        <el-main v-loading="v.loading">
          <div class="filter-container" style="padding-top: 0;">
            <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="create">新增</el-button>
            <el-button class="filter-item" type="info" icon="el-icon-delete" @click="del">删除</el-button>
          </div>
          <div>
            <el-table
              v-loading="listLoading"
              :data="list"
              row-key="id"
              stripe
              style="width: 100%"
              border
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column prop="title" label="新闻标题"/>
              <el-table-column prop="createByName" label="发起人"/>
              <el-table-column prop="createDate" label="发布时间"/>
              <el-table-column prop="id" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button @click="detailBtn(scope.row)" type="text" size="mini" title="预览">
                    <svg-icon icon-class="previewColor"/>
                  </el-button>
                  <el-button @click="edit(scope.row)" type="text" size="mini" title="编辑">
                    <svg-icon icon-class="editColor"/>
                  </el-button>
                  <!-- <el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete"/> -->
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
    <el-dialog :visible.sync="detailformvaisable" title="预览">
      <div style="text-align:center">
        <h2 style="margin-bottom:0.6em;margin-top:0;">{{form.title}}</h2>
        <span>
          <p style="color: #636363;font-size: 12px;">{{form.createDate}} {{form.createByName}}</p>
        </span>
      </div>
      <div class="content ql-editor" v-html="form.content"></div>
    </el-dialog>
    <el-dialog :visible.sync="v.form" title="编辑">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="新闻标题">
          <el-input v-model="form.title" placeholder="请输入新闻标题"/>
        </el-form-item>
        <el-form-item label="新闻内容">
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
  </div>
</template> 
<script> 
import Pagination from '@/components/Pagination'
import { getList, get, save, del } from '@/api/setting/sysNews.js'
import { getfiles, delfiles } from "@/api/res/river.js"
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
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
      query: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        search: undefined,
        type: undefined
      },
      uploaddata: {
        bizId: null,
        bizType: "gzjb"
      },
      fileList: [],
      detailformvaisable: false,
      uploadaction: process.env.BASE_API + "/c/common/fileRecord/uploadFile?token=" + getToken(),
      form: {
        title: null,
        content: '',
        createByName: null,
        createDate: null,
      },
      uploadform: {
        serverUrl: process.env.BASE_FILE_API + "?token=" + getToken() + "&bizId=1" + "&bizType=news",  // 这里写你要上传的图片服务器地址
        // header: {token: getToken()}  // 有的图片服务器要求请求头需要有token  
      },
      multipleSelection: [],
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
      this.v.form = true
      this.form = {}
    },
    edit(row) {
      //console.log(JSON.stringify(row));
      this.v.form = true;
      this.form = row;
      console.log("row:::::", row);
    },
    save() {
      this.visible = false;
      // console.log('保存:',JSON.stringify(this.form),this.selectUser);         
      if (this.form.title && this.form.content) {
        save(this.form).then(response => {
          this.listLoading = true;
          this.v.form = false
          if (response.success) {
            this.$message({
              message: "保存新闻动态成功!!",
              type: "success"
            });
            this.getList();
            //添加到列表中 
          } else {
            this.$message({
              message: response.msg,
              type: "warning"
            })
          }
        })
      } else {
        this.$message({
          message: "请填写内容",
          type: "warning"
        })
      }

    },
    detailBtn(row) {
      this.fileList = []
      this.form = row;
      this.detailformvaisable = true;
      this.uploaddata.bizId = row.id
      // getfiles(this.uploaddata).then(response => {
      //   this.fileList = response.worldArr
      //   console.log("file", this.fileList);
      // })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    del(row) {
      if (this.multipleSelection.length > 0) {
        const idArray = []
        this.multipleSelection.map(item => {
          idArray.push(item.id)
        })
        const idStr = idArray.join()
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
      // del(row.id).then(response => {
      //   this.v.form = false
      //   if (response.success) {
      //     this.$message(response.msg)
      //     //删除列表数据
      //     const index = this.list.indexOf(row) //找到要删除数据在list中的位置 
      //     this.list.splice(index, 1) //通过splice 删除数据
      //   } else {
      //     this.$message({
      //       message: response.msg,
      //       type: "warning"
      //     })
      //   }
      // })
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
