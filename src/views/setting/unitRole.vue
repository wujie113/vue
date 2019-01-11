/*
 * @Author: 刘小康 
 * @Date: 2018-11-05 11:57:16 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2019-01-11 14:26:49
 */
// 单位角色
<template>
  <div class="app-container">
    <el-row :gutter="20" v-loading="loading">
      <el-col :xs="10" :sm="10" :md="10" :lg="5" :xl="5">
        <left-tree titleName="行政区域" :dataArray="dataArray" @areaData="selectNode" :isShowTabbar="isShowTabbar" />
      </el-col>
      <el-col :xs="14" :sm="14" :md="14" :lg="19" :xl="19">
        <div class="panel">
          <div class="panelHeading">
            <div>
              <svg-icon icon-class="server" />部门机构 - {{ unitObj.label }}
            </div>
          </div>
          <div class="source panel-body">
            <div class="filter-container">
              <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addUnitBtn" size="mini">添加单位</el-button>
              <el-button class="filter-item" type="info" icon="el-icon-delete" @click="deleteBtn" size="mini">删除</el-button>
            </div>
            <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange1" border>
              <el-table-column type="selection" align="center">
              </el-table-column>
              <el-table-column prop="name" label="名称" align="center">
              </el-table-column>
              <el-table-column prop="area" label="备注" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="unitEdit(scope.$index, scope.row)" type="text" title="编辑">
                    <svg-icon icon-class="editColor" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 单位编辑弹窗 -->
    <el-dialog :visible.sync="unitEditDialog" width="30%" :title="dialogTitle" v-loading="dialogLoading" :modal-append-to-body="false">
      <el-form ref="form" :model="form" label-width="80px" status-icon>
        <el-form-item label="所属区划">
          {{ form.area ? form.area : unitObj.label}}
        </el-form-item>
        <el-form-item label="所属部门" prop="name">
          <el-select v-model="form.name" placeholder="请选择部门" clearable class="filter-item" @change="selectList">
            <el-option v-for="item in tableData" :key="item.id" :value="item.name" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="名 称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="部门类型" prop="depType">
          <rm-dict type="sys_office_type" placeholder="请选择部门类型" @input="inputSelect" v-model="form.depType" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input type="number" v-model="form.sort" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="unitEditDialog = false">取 消</el-button>
        <el-button @click="unitEditSave" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { AreaTree, getDepList, getDepUser, deleteDep, save } from '@/api/setting/unitRole'
import LeftTree from './components/leftTree'
import Pagination from '@/components/Pagination'
import RmDict from '@/components/rm/dict'

export default {
  name: 'unitRole',
  components: { LeftTree, Pagination, RmDict },
  data() {
    return {
      parentMsg: "hello,child",
      dataArray: [],
      selectNodeData: {},
      // defaultData: [],
      loading: true,
      dialogLoading: false,
      isShowTabbar: false,
      unitEditDialog: false,
      roleEditDialog: false,
      authDialog: false,
      unitObj: {},
      dialogTitle: "",
      form: {
        id: null,
        "area.id": null,
        parentId: null,
        area: null,
        depName: null,
        name: null,
        depType: null,
        sort: null,
        desc: null,
      },
      tableData: []
    }
  },
  created() {
    this.AreaTreeFun()
  },
  destroyed() {
    console.log('执行了销毁周期');
    
    window.onresize = null
  },
  methods: {
    AreaTreeFun() {
      AreaTree().then(res => {
        this.loading = false
        this.dataArray = res.data.list
        // this.defaultData = res.data.list[0]
        this.unitObj = res.data.list[0]
        let params = {
          "area.id": this.unitObj.parentId
        }
        // 把局域id存储起来,编辑和新增的时候需要用到
        this.AreaId = this.unitObj.parentId
        getDepList(params).then((res) => {
          this.tableData = res.data.list
        }).catch((errorRes) => {
          this.loading = false
        })
      }).catch(errorRes => {
        this.loading = false
        
      })
    },
    getWay(msg) {
      console.log(msg)
    },
    selectNode(data) {
      this.unitObj = data
      this.selectNodeData = data
      let params = {
        "area.id": data.parentId
      }
      // 把局域id存储起来,编辑和新增的时候需要用到
      this.AreaId = data.parentId
      this.loading = true
      getDepList(params).then((res) => {
        this.loading = false
        this.tableData = res.data.list
      }).catch((errorRes) => {
        this.loading = false
      })
    },
    inputSelect(data) {
      console.log('数字字典', data)
    },
    // 添加单位
    addUnitBtn() {
      this.unitEditDialog = true
      this.dialogTitle = "添加"
      if (this.$refs.form != undefined) {
        this.$refs.form.resetFields()
        // Object.assign(this.form, this.$options.data().form)
      }
    },
    // 点击 单位 编辑按钮
    unitEdit(index, row) {
      // if (this.$refs.form != undefined) {
      //   this.$refs.form.resetFields()
      // }
      this.dialogTitle = "编辑"
      this.unitEditDialog = true

      Object.assign(this.form, row)
    },
    selectList(selectdata) {
      console.log('选择', selectdata)
      let obj = {};
      obj = this.tableData.find((item) => {
        return item.name === selectdata;
      });
      console.log(obj.parentId)
      this.parentId = obj.parentId
    },
    // 弹窗编辑保存
    unitEditSave(v) {
      let params = {
        "area.id": this.AreaId,//区域ID
        "parent.id": this.form.parentId,//所属部门
        name: this.form.name,//名称
        grade: this.form.depType,//部门类型
        sort: this.form.sort,
        remarks: this.form.desc
      }
      if (this.form.id) {
        params.id = this.form.id
      }
      if (this.form.parentId) {
        params["parent.id"] = this.form.parentId
      } else {
        params["parent.id"] = this.parentId
      }
      this.dialogLoading = true
      save(params).then(res => {
        this.dialogLoading = false
        this.unitEditDialog = false
        this.$message({
          type: "success",
          message: "修改成功!"
        })
        let p = {
          "area.id": this.AreaId
        }
        getDepList(p).then((res) => {
          // this.loading = false
          this.tableData = res.data.list
        }).catch((errorRes) => {
          // this.loading = false
        })
      }).catch(errorRes => {
        this.dialogLoading = false

        this.unitEditDialog = false
      })
      console.log('params', params)
      console.log('this.form', this.form)
    },
    // 全选,单选
    handleSelectionChange1(val) {
      if (val.length > 0) {
        let ids = [], idsStr = ""
        val.map(item => {
          let id = item.id
          ids.push(item.id)
        })
        idsStr = ids.join()
        this.deleteDepIDs = idsStr
      }
    },
    // 删除部门
    deleteBtn() {
      this.$confirm("确认删除当前部门?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          ids: this.deleteDepIDs
        }
        deleteDep(params).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!"
          })
          this.loading = true
          let params = {
            "area.id": this.unitObj.parentId
          }
          getDepList(params).then((res) => {
            this.loading = false
            this.tableData = res.data.list
          }).catch((errorRes) => {
            this.loading = false
          })
        }).catch((errorRes) => {
          this.loading = false
        })
      }).catch(() => {
        // 用户取消删除
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.panel {
  margin-bottom: 0;
  min-height: 86vh;
  overflow: auto;
  background-color: #fff;
  border: 1px solid transparent;
  border-color: #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  .panelHeading {
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 39px;
    padding: 8px 15px;
    border-bottom: 1px solid transparent;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
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
    padding: 24px;
  }
  .panel-body {
    overflow: auto;
    height: calc(86vh - 41px);
  }
}
</style>

