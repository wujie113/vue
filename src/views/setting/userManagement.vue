<template>
  <div class="app-container">
    <div class="widget-all-system-body">
      <el-container v-loading="loading">
        <el-aside>
          <div class="grid-content bg-purple-light panel">
            <div class="panelHeading">
              <div>
                单位
              </div>
              <div>
                <el-checkbox v-model="checked" @change="onlyShowSelectBtn">仅显示所选单位用户</el-checkbox>
              </div>
            </div>
            <div class="source panel-body">
              <el-tree :data="dataArray" :props="defaultProps" @node-click="handleNodeClick" empty-text="暂无数据" highlight-current></el-tree>
            </div>
          </div>
        </el-aside>
        <el-container>
          <el-header height="125px">
            <div style="text-align: left;border-bottom: 1px solid #ccc;padding: 10px 0">
              用户列表
            </div>
            <div class="filter-container" style="padding: 25px 0">
              <el-input placeholder="输入姓名、帐号或角色搜索..." style="width: 210px;" class="filter-item" @keyup.enter.native="handleFilter" v-model="listQuery.search" />
              状态：
              <el-select placeholder="请选择状态" clearable style="width: 140px" class="filter-item" v-model="listQuery.state">
                <el-option v-for="item in states" :key="item" :label="item" :value="item" />
              </el-select>
              角色：
              <el-select placeholder="请选择角色" clearable style="width: 140px" class="filter-item" v-model="listQuery.role">
                <el-option v-for="item in roles" :key="item" :label="item" :value="item" />
              </el-select>

              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchBtn">查询</el-button>

            </div>
          </el-header>
          <!-- <div style="height:2%;width:100%;background-color:#f5f5f5"></div> -->
          <el-main>
            <div class="filter-container">
              <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="addBtn">新增用户</el-button>
              <el-button class="filter-item" type="info" icon="el-icon-delete" @click="deleteBtn">删除</el-button>
            </div>
            <div>
              <el-table ref="multipleTable" border stripe :data="tableData3" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableLoading">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column type="index" width="50" align="center" label="序号">
                </el-table-column>
                <el-table-column label="账号" width="120" align="center">
                  <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column prop="name" label="联系号码" width="120" align="center">
                </el-table-column>
                <el-table-column prop="address" label="所属区域" align="center">
                </el-table-column>
                <el-table-column prop="address" label="单位" show-overflow-tooltip align="center">
                </el-table-column>
                <el-table-column prop="address" label="状态" align="center">
                </el-table-column>
                <el-table-column prop="address" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.$index, scope.row)" type="text" title="编辑">
                      <svg-icon icon-class="edit" />
                    </el-button>
                    <el-button type="text" @click="ModifyPassword(scope.$index, scope.row)" title="修改密码">
                      <svg-icon icon-class="password" />
                    </el-button>
                    <el-button @click="handleStart(scope.$index, scope.row)" type="text" :title="scope.row.isStart ? '启用' : '已停用'">
                      <svg-icon :icon-class="scope.row.isStart ? 'remove' : 'remove1'" />
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="tableList" />
            </div>
          </el-main>

        </el-container>
      </el-container>
    </div>

  </div>
</template>
<script>
import { tree, tableList } from '@/api/setting/userMangement'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      loading: true,
      tableLoading: false,
      checked: false,
      dataArray: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      listQuery: {
        search: "",
        state: "",
        role: "",
        pageNo: 1,
        pageSize: 10,
        id: ""
      },
      total: 2,
      states: ["正常", "停用"],
      roles: ["巡河长", "张三", "李四", "王五", "赵六"],
      tableData3: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: true
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: false
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: true
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: true
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: false
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: false

      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: true

      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: true

      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: true

      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: true

      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: true

      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: true

      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isStart: false
      }],
      multipleSelection: []
    }
  },
  created() {
    this.loadLeftTree()
  },
  methods: {
    loadLeftTree() {
      tree().then((res) => {
        console.log("左边树", res)
        const data = res.data.list
        this.dataArray = data
        this.loading = false
      }).catch((errorRes) => {
        this.loading = false
      })
    },
    onlyShowSelectBtn(v) {
      console.log("只显示所属单位", v)
    },
    handleNodeClick(data) {
      console.log("节点信息", data)
      this.tableLoading = true

      let idx = data.id
      const params = {
        id: idx
      }
      this.getList(params)
    },
    // 表单编辑
    handleEdit() {

    },
    // 表单修改密码
    ModifyPassword() {

    },
    // 停用启用
    handleStart() {

    },
    getList(idx) {
      tableList(idx).then((res) => {
        console.log('表单列表', res)
        this.tableLoading = false
      }).catch(errorRes => {
        this.tableLoading = false
      })
    },
    // 查询,分页使用
    tableList() {

    },
    handleFilter() {

    },
    searchBtn() {

    },
    addBtn() {

    },
    deleteBtn() {

    },
    getList() {

    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button--text .svg-icon {
  width: 1.2rem;
  height: 1.2rem;
}
.cell .el-button--text:first-of-type .svg-icon {
  fill: #4ecc89;
}
// .cell .el-button--text:nth-of-type(3) .svg-icon {
//   fill: #f25c5c;
// }
.el-container {
  .el-aside {
    width: 25% !important;
    margin-right: 1%;
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
.widget-all-system-body {
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
