<template>
  <div class="app-container">
    <el-container>
      <el-container>
        <el-header height="125px">
          <div class="topTitle">河流归档资料</div>
          <div class="filter-container">
            <template>
              <el-input
                placeholder="输入标题"
                v-model="query.title"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"
              />
              <rm-dict
                title="请选择类型"
                placeholder="请选择类型"
                type="m_file_hlgl_type"
                v-model="query.type"
              />
              <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="handleFilter"
              >查询</el-button>
            </template>
          </div>
        </el-header>
        <el-main v-loading="listLoading">
          <div class="filter-container" style="padding-top: 0;">
            <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
          </div>
          <div>
            <el-table :data="list" stripe style="width: 100%" border>
              <el-table-column prop="title" label="标题"/>
              <el-table-column prop="typeName" label="类别"/>
              <el-table-column label="文件">
                <template slot-scope="scope">
                  <a @click="look(scope.row)">{{scope.row.fileName}}</a>
                </template>
              </el-table-column>
              <el-table-column prop label=" 状态">
                <template slot-scope="scope">{{scope.row.issueStatus=='1'?"已发布":"未发布"}}</template>
              </el-table-column>
              <el-table-column prop="issueUser.name" label="发布人"/>

              <el-table-column prop="issueDate" label="发布时间"/>
              <el-table-column prop="id" label="操作">
                <template slot-scope="scope">
                  <div v-if="scope.row.issueStatus=='1'">
                    <el-button @click="notissue(scope.row)" type="primary" title="发布">取消发布</el-button>
                  </div>
                  <div v-if="scope.row.issueStatus=='0'">
                    <el-button @click="issue(scope.row)" type="primary" title="发布">发布</el-button>
                    <el-button @click="del(scope.row)" type="primary">删除</el-button>
                  </div>
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
            <el-dialog :visible.sync="visible" title="添加文件" width="400px">
              <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="标题">
                  <el-input v-model="form.title" placeholder="请输入标题"/>
                </el-form-item>
                <el-form-item label="类型">
                  <rm-dict
                    title="请选择类型"
                    placeholder="请选择类型"
                    type="m_file_hlgl_type"
                    v-model="form.type"
                  />
                </el-form-item>
                <el-form-item>
                  <el-upload
                    class="upload-demo"
                    style="text-align: left;"
                    :multiple="true"
                    ref="upload"
                    accept=".pdf"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :file-list="fileList"
                    :auto-upload="false"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过10M</div>
                  </el-upload>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button @click="save()" type="primary">确 定</el-button>
              </div>
            </el-dialog>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template> 
<script> 
import Pagination from '@/components/Pagination'
import { getList, get, save, del, issue, notissue } from '@/api/res/materialFile.js'
import { file } from "@/api/imgUplodFile"
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
export default {
  components: { Pagination, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect },
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
      visible: false,
      list: null,
      fileList: [],
      query: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        search: undefined,
        type: null,
        species: 1  //查询法律法规的
      },
      form: {
        title: null,
        type: null,
        species: 1
      },
      uploadParams: {
        bizId: "",
        bizType: "HLZL"
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      console.log("this.query::::", this.query);
      getList(this.query).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.query.total = response.data.count
      })
    },
    handleFilter() {
      this.query.pageNo = 1
      this.getList()
    },
    add() {
      this.visible = true;
    },
    notissue(row) {
      this.listLoading = true;
      notissue(row.id).then(response => {
        this.listLoading = false;
        this.$message({
          message: "取消发布成功!!",
          type: "success"
        })
        this.getList();
      })
    },
    issue(row) {
      this.listLoading = true;
      issue(row.id).then(response => {
        this.listLoading = false;
        this.$message({
          message: "发布成功!!",
          type: "success"
        })
        this.getList();
      })
    },
    look(row) {
      window.open(row.filePath);
    },
    save() {
      //console.log('保存:',JSON.stringify(this.form),this.selectUser);      
      if (this.$refs.upload.uploadFiles == undefined || this.$refs.upload.uploadFiles.length < 1) {
        this.$message({
          message: "请上传附件!!",
          type: "error"
        })
        return;
      }
      save(this.form).then(response => {
        this.visible = false
        if (response.success) {
          this.uploadParams.bizId = response.data.id;
          // 附件上传到服务器
          const imgParams = "&bizType=" + this.uploadParams.bizType + "&bizId=" + this.uploadParams.bizId;
          file(imgParams, this.$refs.upload.uploadFiles).then(res => {
            this.getList();
          })
            .catch(errorRes => {
              this.getList();
            });
        } else {
          this.$message({
            message: response.msg,
            type: "warning"
          })
        }
      })
    },
    del(row) {
      //var self = this 
      del(row.id).then(response => {
        if (response.success) {
          this.$message({
            message: "删除成功!",
            type: "success"
          })
          this.getList()
        } else {
          this.$message({
            message: response.msg,
            type: "warning"
          })
        }
      })
    }
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
}
</style>