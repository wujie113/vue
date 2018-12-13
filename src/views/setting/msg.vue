<template>
  <div class="app-container">
    <el-container v-loading="v.loading">
      <el-container>
        <el-header height="125px">
          <div style="" class="topTitle">通知公告列表</div>
          <div class="filter-container" style="">
            <el-input placeholder="输入内容搜索..." style="width: 210px;" class="filter-item" @keyup.enter.native="handleFilter" v-model="query.title" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          </div>
        </el-header>
        <el-main>
          <div class="filter-container" style="padding-top: 0;">
            <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="create">新增用户</el-button>
            <el-button class="filter-item" type="info" icon="el-icon-delete" @click="del">删除</el-button>
          </div>
          <div>
            <el-table :data="list" row-key="id" stripe style="width: 100%" border @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column type="index" width="50" align="center" label="序号">
              </el-table-column>
              <el-table-column prop="title" label="标题"/>
              <el-table-column prop="createByName" label="发起人"/>

              <el-table-column prop="sendTime" label="发起时间"/>

              <el-table-column prop="id" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit"/>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="query.total>0" :total="query.total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="getList" />
          </div>
        </el-main>

      </el-container>
    </el-container>
    <!--添加编辑弹窗-->
    <el-dialog :visible.sync="v.form" title="编辑">
      <el-form ref="form" :model="form" label-width="40px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <el-upload
        :action="doUpload"
        list-type="picture-card"
        :auto-upload="false"
        :on-preview="handlePictureCardPreview"
        accept=".jpg, .jpeg, .png, .gif"
        ref="upload"
        :file-list="fileList"
        :before-remove="removefile"
        :data="uploaddata"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
        class="elUpload"
      >
        <i class="el-icon-plus"></i>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button @click="v.form = false">取 消</el-button>
        <el-button @click="save()" type="primary">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template> 
<script>
import Pagination from "@/components/Pagination"
import { getList, get, save, del } from "@/api/setting/msg.js"
import RmDict from "@/components/rm/dict"
import RmOrgSelect from "@/components/rm/orgselect"
import { getToken } from "@/utils/auth"
import { getfiles,  delfiles } from "@/api/res/river.js"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
import { file } from "@/api/imgUplodFile"
export default {
  components: { Pagination, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect },
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
      list: null,
      fileList: [],
      doUpload: process.env.BASE_FILE_API + "?token=" + getToken(),
      query: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        search: undefined,
        type: undefined
      },
      uploaddata: {
        bizId: null,
        bizType: "msg"
      },
      form: {
        type: '2',
        title: null,
        content: null,
        from: null,
        userType: null,
        userDesc: null,
        userData: null,
        ticket: null,
        status: null,
        sendTime: null,
        sendState: "2",
        remark: null
      },
      multipleSelection: [],
    };
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.v.loading = true;
      console.log("this.query::::", this.query);
      getList(this.query).then(response => {
        this.v.loading = false;
        this.list = response.data.list;
        this.query.total = response.data.count;
      });
    },
    handleFilter() {
      this.query.pageNo = 1;
      this.getList();
    },
    create() {
      this.fileList = []
      this.v.form = true;
      this.form = {};
    },
    edit(row) {
      //console.log(JSON.stringify(row));
      this.v.form = true;
      this.form = row;
      
      getfiles({ bizId: this.form.id}).then(response => {
        this.fileList = response.data;
      });

    },
    handleSuccess() {
      this.fileList = [];
      this.getList();
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisibleImg = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    removefile(file) {
      delfiles({ ids: file.id }).then(response => {
        console.log("图片删除成功!!!!!");
      });
    },
    save() {
      //console.log('保存:',JSON.stringify(this.form),this.selectUser);
      this.form.sendState = "2"
      save(this.form).then(response => {
        this.uploaddata.bizId = response.data.id
        if (this.$refs.upload.uploadFiles !== undefined && this.$refs.upload.uploadFiles.length > 0) {
          // 上传到服务器
          const imgParams =  "&bizType=" +   this.uploaddata.bizType +  "&bizId=" + this.uploaddata.bizId;
          file(imgParams, this.$refs.upload.uploadFiles).then(res => {
              console.log("file----res", res)
            }).catch(errorRes => {})
        } else {
          this.getList()
        }
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
            type: "warn"
          })
        }
      })
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
            this.$message({
              type: "warn",
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
      // -----------------
      // del(row.id).then(response => {
      //   this.v.form = false;
      //   if (response.success) {
      //     this.$message(response.msg);
      //     //删除列表数据
      //     const index = this.list.indexOf(row); //找到要删除数据在list中的位置
      //     this.list.splice(index, 1); //通过splice 删除数据
      //   } else {
      //     this.$message({
      //       message: response.msg,
      //       type: "warning"
      //     });
      //   }
      // });
    },
    deleteBtn(){

    }
  }
};
</script>
