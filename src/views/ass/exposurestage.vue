<template>
  <div class="app-container">
    <el-container v-loading="v.loading">
      <el-container>
        <el-header height="125px">
          <div style class="topTitle">曝光列表</div>
          <div class="filter-container" style>
            <template>
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
                <span>-</span>
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
            </template>
            <!-- <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button> -->
          </div>
        </el-header>
        <el-main>
          <div class="filter-container" style="padding-top: 0;">
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="create"
            >新增曝光</el-button>
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
                  <el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit"/>
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
    <!--曝光弹窗-->
    <el-dialog :visible.sync="exposureVisible" title="曝光" :modal-append-to-body="false" width="70%">
      <el-container v-loading="exposureLoading">
        <el-aside>
          <left-tree
            titleName="组织部门"
            :dataArray="exposuredataArray"
            @areaData="selectNode"
            :isShowTabbar="isShowTabbar"
            :showCheckbox="isshowCheckbox"
            :panelMinHeight="panelMinHeight"
            :panelbodyHeight="panelbodyHeight"
            @checkBoxBtn="checkBoxBtn"
            v-model="refLeftTree"
          />
        </el-aside>

        <el-container>
          <el-header height="200px">
            <div style class="topTitle">接收列表</div>
            <div class="filter-container container-scroll" style="height: 157px;overflow-y: auto;">
              <span class="command-user" v-for="(item, index) in receivedPersionNodes" :key="index">
                {{ item.label }}
                <i class="el-icon-ali-guanbi" @click="deleteNode(index)"></i>
              </span>
            </div>
          </el-header>
          <el-main style="padding-top:0;position: relative;">
            <div style class="topTitle">曝光详情</div>
            <div class="filter-container container-scroll" style="height: 276px;overflow-y: auto;">
              <el-form ref="exposureForm" :model="exposureForm" label-width="50px">
                <el-form-item label="标题">
                  <el-input v-model="exposureForm.title" placeholder="请输入曝光标题"></el-input>
                </el-form-item>
                <el-form-item label="详情">
                  <el-input
                    type="textarea"
                    v-model="exposureForm.content"
                    rows="5"
                    placeholder="请输入曝光详情"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-upload
                    class="upload-demo"
                    style="text-align: left;"
                    :multiple="true"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :before-remove="beforeRemove"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :auto-upload="false"
                  >
                    <i class="el-icon-ali-icon-test"></i>附件上传
                  </el-upload>
                </el-form-item>
              </el-form>
              <div class="command-mian-body-image">
                <el-button type="primary" @click="submitBtn">确定</el-button>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-dialog>
  </div>
</template> 
<script>
import Pagination from "@/components/Pagination"
import { getList, get, del } from "@/api/ass/exposurestage.js"
import RmDict from "@/components/rm/dict"
import RmOrgSelect from "@/components/rm/orgselect"
import { getToken } from "@/utils/auth"
import { getfiles, delfiles } from "@/api/res/river.js"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
import { file } from "@/api/imgUplodFile"
import { findOrgtreesandusers, saveExposure } from "@/api/res/management.js"
import LeftTree from '../setting/components/leftTree'
export default {
  components: { Pagination, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect, LeftTree },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      v: {
        loading: false
      },
      list: null,
      exposureVisible: false,
      exposureLoading: false,
      exposuredataArray: [],
      isShowTabbar: false,
      isshowCheckbox: true,
      panelMinHeight: 72,
      panelbodyHeight: 72,
      refLeftTree: null,// 用于接收 LeftTree组件里面的this.$refs.tree
      receivedPersionNodes: [],
      fileList: [],
      value1: "",
      value2: "",
      popoverVisible: false,
      exposureForm: {
        title: "",
        content: "",
        userDataId: "",//曝光里面已勾选的用户ID
        bizId: ""
      },
      query: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        search: undefined,
        type: '5',
        starttime: null,
        endtime: null
      },
      uploadParams: {
        bizId: "",
        bizType: "R"
      },
      baoguangid: {
        id: ""
      },
      form: {
        type: '5',
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
      multipleSelection: []
    }
  },
  created() {
    this.getList()
    this.loadLeftTreeData()
  },
  methods: {
    loadLeftTreeData() {
      findOrgtreesandusers().then((res) => {
        this.exposuredataArray = res.data.list
        this.exposureLoading = false
      }).catch((errorRes) => {
        this.exposureLoading = false
      })
    },
    getList() {
      if (this.query.starttime > this.query.endtime) {
        this.popoverVisible = true
        setTimeout(() => {
          this.popoverVisible = false
        }, 1500)
        return
      } else {
        this.v.loading = true
        getList(this.query).then(response => {
          this.v.loading = false
          this.list = response.data.list
          this.query.total = response.data.count
        })
      }
    },
    handleFilter() {
      this.query.pageNo = 1
      this.getList()
    },

    create() {
      //this.exposureForm.bizId = row.id
      this.exposureForm.title = ""
      this.exposureForm.content = ""
      this.loadLeftTreeData()
      this.exposureLoading = true
      this.exposureVisible = true
      this.receivedPersionNodes = []
      if(this.refLeftTree) {
        this.refLeftTree.setCheckedKeys([])
      }
      
      this.fileList = []
    },
    start(start) {
      this.query.starttime = start
    },
    end(end) {
      this.query.endtime = end
    },
    // 曝光保存
    submitBtn() {
      const saveParams = {
        id: this.baoguangid.id,
        userData: this.exposureForm.userDataId,
        title: this.exposureForm.title,
        content: this.exposureForm.content,
        // bizId: this.exposureForm.bizId
      }
      console.log("saveParams", saveParams)
      saveExposure(saveParams).then(res => {
        this.uploadParams.bizId = res.data.id
        console.log("this.uploadParams.bizId", this.uploadParams.bizId)
        // 附件上传到服务器
        const imgParams = "&bizType=" + this.uploadParams.bizType + "&bizId=" + this.uploadParams.bizId
        file(imgParams, this.$refs.upload.uploadFiles).then(res => {
          this.exposureVisible = false
        }).catch(errorRes => {
          this.exposureVisible = false
        })
        this.getList()
      }).catch(errorRes => {
        this.exposureVisible = false
      })
    },
    // 点击人员进行,删除,去掉树勾选
    deleteNode(index) {
      console.log('this.receivedPersionNodes', this.receivedPersionNodes)
      //从 接收列表删除
      this.receivedPersionNodes.splice(index, 1)
      //从 左边的树形 组织机构删除
      this.receivedPersionKeys.splice(index, 1)
      this.exposureForm.userDataId = this.receivedPersionKeys.join(",")
      this.refLeftTree.setCheckedKeys(this.receivedPersionKeys)
    },
    aa(id, arr) {
      for (const i in arr) {
        if (arr[i] == id) {
          return true
        }
      }
    },
    getCity(arr, data, city) {
      if (city === undefined) {
        var city = new Array()
      }
      for (const j in data) {
        if (this.aa(data[j].id, arr)) {
          city.push(data[j])
        }
        if (data[j].children !== undefined) {
          this.getCity(arr, data[j].children, city)
        }
      }
      return city
    },
    // getCity(arr, data,city = []) {
    //   if(typeof data == "object"){
    //     for(let i = 0;arr[i]!=undefined;i++){
    //       for(let j = 0;data[j]!=undefined;j++){
    //         if(arr[i] === data[j].id)city.push(data[j]);
    //       }
    //     }
    //     for(let i = 0;data[i]!=undefined;i++){
    //       this.getCity(arr,data[i].children,city);
    //     }
    //   }
    //   return city;
    // },
    edit(row) {
      console.log("row", row)
      this.baoguangid.id = row.id
      this.exposureVisible = true
      this.exposureForm = row
      // 清空接收列表
      this.receivedPersionNodes = []
      // 清空附件
      this.fileList = []
      // this.receivedPersionNodes.push(item)

      // 获取图片
      getfiles({ bizId: row.id }).then(response => {
        this.fileList = response.list
        console.log(" this.fileList", this.fileList)
      })
      if (row.userData) {
        const userDataArray = row.userData.split(',')
        // 接收列表上面人员ID---- 以','隔开的字符串
        this.exposureForm.userDataId = row.userData
        this.receivedPersionKeys = userDataArray
        setTimeout(() => {
          this.refLeftTree.setCheckedKeys(userDataArray)
          this.receivedPersionNodes = this.getCity(userDataArray, this.exposuredataArray)
        }, 1000)
      } else {
        setTimeout(() => {
          //每次点击编辑  ,左边树置空
          this.refLeftTree.setCheckedKeys([])
        }, 1000)
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove(file, fileList) {
      console.log("----=====", file)
      delfiles({ ids: file.id }).then((res) => {

      }).catch()
    },
    save() {
      //console.log('保存:',JSON.stringify(this.form),this.selectUser);
      this.form.sendState = "2"
      save(this.form).then(response => {
        this.uploaddata.bizId = response.data.id
        if (this.$refs.upload.uploadFiles !== undefined && this.$refs.upload.uploadFiles.length > 0) {
          // 上传到服务器
          const imgParams = "&bizType=" + this.uploaddata.bizType + "&bizId=" + this.uploaddata.bizId
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
            type: "warning"
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击小正方形
    checkBoxBtn(a, b) {
      console.log(a, b)
      this.receivedPersionNodes = []
      this.receivedPersionKeys = []

      b.checkedNodes.map((item, index) => {
        if (item.type === 'u') {
          this.receivedPersionNodes.push(item)
          this.receivedPersionKeys.push(item.id)
        }
      })
      this.exposureForm.userDataId = this.receivedPersionKeys.join(",")
    },
    selectNode(data) {
      console.log('点击树形data', data)
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
    deleteBtn() {

    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .filter-container {
    .command-user {
      margin: 5px 8px;
      height: 34px;
      min-width: 74px;
      font-weight: 500;
      border-radius: 3px;
      padding: 5px 10px;
      line-height: 24px;
      display: inline-block;
      color: #fff;
      font-size: 14px;
      text-align: center;
      background-color: #279cf5;
      float: left;
      i {
        font-size: 15px;
        cursor: pointer;
      }
      i:hover {
        color: #d9534f;
      }
    }
    span {
      color: #636363;
      font-size: 12px;
    }
  }
  /*滚动条样式*/
  .container-scroll::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .container-scroll::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .container-scroll::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  > .el-container {
    min-height: calc(100vh - 126px);
    > .el-container {
      // 兼容IE浏览器
      min-height: calc(100vh - 126px);  
    }
  }
}

.command-mian-body-image {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>

