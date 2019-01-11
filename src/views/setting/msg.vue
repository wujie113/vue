/*
 * @Author: 刘小康 
 * @Date: 2018-12-27 09:44:29 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2019-01-10 18:03:52
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
      <el-form ref="form" :model="form" label-width="40px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="内容" prop="content">
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
    <!-- 通知公告弹窗 -->
    <el-dialog title="通知公告详情" :visible.sync="dialogVisible" width="60%">
      <div class="NotificationDetailContent clearfix">
        <div class="subContent clearfix">
          <h2 class="ContentHeader">{{ msgDeatail.title }}</h2>
          <p style="color: #636363;font-size: 12px;text-align: center;">{{msgDeatail.createDate}} {{msgDeatail.createByName}}</p>
          <!-- <p class="DetailMore">{{ msgDeatail.content }}</p> -->
          <div class="content ql-editor" v-html="msgDeatail.content"></div>
          <div></div>
          <div class="clearfix">
            <viewer :images="images1" class="clearfix pre-image">
              <img v-for="src in images1" :src="src.url" :key="src.name">
            </viewer>
          </div>
          <!-- <div class="subUser">
            <span class="DetailTime">{{ msgDeatail.createDate }}</span>
            <span class="DetailUser">{{ msgDeatail.updateByName }}</span>
          </div> -->
        </div>
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
import { getfiles, delfiles } from "@/api/res/river.js"
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
      dialogVisible: false,
      list: null,
      fileList: [],
      doUpload: process.env.BASE_FILE_API + "?token=" + getToken(),
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
      msgDeatail: {
        title: "",
        content: "",
        createDate: "",
        updateByName: ""
      },
      images1: []
    };
  },
  created() {
    this.v.loading = true
    this.getList()
  },
  methods: {
    detailBtn(row) {
      // Todo 图片还没接入
      this.msgDeatail.title = ""
      this.msgDeatail.content = ""
      this.msgDeatail.createDate = ""
      this.msgDeatail.updateByName = ""
      this.dialogVisible = true
      this.$nextTick(() => {
        this.images1 = []
        const p = {
          "bizId": row.id
        }
        getfiles(p).then((res) => {
          this.images1 = res.data
        }).catch((errorRes) => {
          
        })
        this.msgDeatail.title = row.title
        this.msgDeatail.content = row.content
        this.msgDeatail.createDate = row.createDate
        this.msgDeatail.updateByName = row.updateByName
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
      this.fileList = []
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

      getfiles({ bizId: this.form.id }).then(response => {
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
      delfiles({ id: file.id }).then(response => {
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
          const imgParams = "&bizType=" + this.uploaddata.bizType + "&bizId=" + this.uploaddata.bizId;
          file(imgParams, this.$refs.upload.uploadFiles).then(res => {
            console.log("file----res", res)
          }).catch(errorRes => { })
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
    deleteBtn() {

    }
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
  > .el-container {
    min-height: calc(100vh - 126px);
  }
  .el-dialog__body .pre-image img{
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
      margin-bottom:0.6em;
      margin-top:0;
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
