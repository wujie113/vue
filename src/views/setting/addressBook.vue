/*
 * @Author: 刘小康 
 * @Date: 2018-12-27 09:43:44 
 * @Last Modified by:   刘小康 
 * @Last Modified time: 2018-12-27 09:43:44 
 */
// 通讯录
<template>
  <div class="app-container">
    <el-container v-loading="listLoading">
      <el-aside>
        <!-- <div class="panel">
          <div class="panelHeading">
            <div>单位</div>
            <div>
              <el-checkbox v-model="checked" @change="onlyShowSelectBtn()">仅显示所选单位</el-checkbox>
            </div>
          </div>
          <div class="source panel-body">
            <el-tree
              :data="dataArray"
              :props="defaultProps"
              @node-click="handleNodeClick"
              empty-text="暂无数据"
              highlight-current
            ></el-tree>
          </div>
        </div> -->
        <left-tree titleName="单位" :dataArray="dataArray" @areaData="handleNodeClick" :isShowTabbar="isShowTabbar" />
      </el-aside>
      <el-container>
        <el-header height="125px">
          <div style class="topTitle">通讯录列表</div>
          <div class="filter-container" style>
            <el-input
              placeholder="输入姓名、单位或电话搜索..."
              style="width: 210px;"
              class="filter-item"
              @keyup.enter.native="searchBtn"
              v-model="query.name"
            />

            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="searchBtn"
            >查询</el-button>
          </div>
        </el-header>

        <el-main v-loading="mainLoading">
          <div class="filter-container" style="padding-top: 0;">
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-plus"
              @click="create"
            >新增</el-button>
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
              <el-table-column prop="name" label="名称"/>
              <el-table-column prop="phone" label="电话"/>
              <el-table-column prop="unitName" label="单位"/>
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

    <el-dialog :visible.sync="v.form" title="编辑">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话"/>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="form.unit" placeholder="请选择单位" clearable class="filter-item">
            <el-option
              v-for="item in lowerofficeList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序"/>
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
import { getList, get, save, del } from '@/api/setting/addressbook.js'
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
import { getorgtrees, getSynergOffice, getLoweroffice } from '@/api/res/management.js'
import LeftTree from './components/leftTree'

export default {
  components: { Pagination, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect, LeftTree },
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
      isShowTabbar: false,
      v: {
        form: false,
        loading: false
      },
      listLoading: false,
      mainLoading: false,
      list: null,
      checked: false,
      dataArray: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      lowerofficeList: null,
      query: {
        unit: undefined,
        total: 0,
        pageNo: 1,
        pageSize: 10,
        search: undefined,
        type: undefined
      },
      form: {
        name: "",
        phone: "",
        unit: "",
        sort: "",
      },
      multipleSelection: [],
    }
  },
  created() {
    this.listLoading = true
    this.loadLeftTree()
  },
  methods: {
    loadLeftTree() {
      getorgtrees().then((res) => {
        const data = res.data.list
        this.dataArray = data
        // 第一次默认
        // this.listQuery['office.id'] = data[0].id
        this.unit = data[0].label
        this.companyID = data[0].id
        this.getList()
      }).catch((errorRes) => {
        console.error("errror:::::::", errorRes)
      })
    },
    getList() {
      getList(this.query).then(response => {
        this.listLoading = false
        this.mainLoading = false
        this.list = response.data.list
        this.query.total = response.data.count
      })
      getLoweroffice().then(response => {
        // console.log('接单单位数据：',response.data);
        this.lowerofficeList = response.data.list
      });
    },
    onlyShowSelectBtn() {
      //console.log("只显示所属单位",this.query,this.checked)

      this.handleNodeClick(this.officeData);
    },
    handleNodeClick(data) {
      console.log("节点信息", data)
      this.officeData = data
      //选择的是哪个单位
      //this.unit = data.label
      this.companyID = data.id
      if (this.checked) {
        this.query.unit = data.id
        this.query.areaId = null
      } else {
        this.query.areaId = data.area.id
        this.query.unit = null
      }
      this.mainLoading = true
      this.getList()
    },
    searchBtn() {
      this.query.pageNo = 1
      this.mainLoading = true
      this.getList()
    },
    create() {
      // this.$nextTick(() => {
      if(this.$refs['form'] !== undefined) {
        this.$refs['form'].resetFields()
      }
      this.v.form = true
      // })

      // this.form = {}
    },
    edit(row) {
      //console.log(JSON.stringify(row));
      this.v.form = true
      this.form = row
      console.log('this.form', this.form)
    },
    save() {
      //console.log('保存:',JSON.stringify(this.form),this.selectUser);         
      save(this.form).then(response => {
        this.v.form = false
        if (response.success) {
          this.$message({
            message: response.msg,
            type: "success"
          })
          //添加到列表中
          this.list.unshift(this.form)
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
    del() {
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
          type: "warn",
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
    }
  }
}
</script>
<style lang="scss" scoped>
.el-button .svg-icon {
  width: 1.2rem;
  height: 1.2rem;
}
.cell .el-button--text:first-of-type .svg-icon {
  fill: #4ecc89;
}
// .cell .el-button--text:nth-of-type(3) .svg-icon {
//   fill: #f25c5c;
// }

.app-container {
  .panel {
    margin-bottom: 0;
    min-height: 86vh;
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
      padding: 24px;
    }
    .panel-body {
      overflow: auto;
      height: calc(86vh - 41px);
    }
  }
}

.panel {
  margin-bottom: 20px;
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
<style scoped>
.userM >>> .el-table--medium td {
  padding: 3px 0 !important;
}
.userM >>> .el-dialog__body {
  max-height: 500px;
}
</style>

