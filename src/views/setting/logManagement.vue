<template>
  <div class="app-container">
    <el-container v-loading="logLoading">
      <el-container>
        <el-header height="125px">
          <div class="topTitle">日志列表</div>
          <div class="filter-container">
            <template>
              <div class="block">
                <span>时间段</span>
                <el-date-picker
                  v-model="value1"
                  type="date"
                  value-format="timestamp"
                  @change="start"
                  size="mini"
                  placeholder="开始日期"
                >
                </el-date-picker>
                <span> — </span>
                <el-date-picker
                  v-model="value2"
                  type="date"
                  value-format="timestamp"
                  @change="end"
                  size="mini"
                  placeholder="结束日期"
                >
                </el-date-picker>
                <el-popover
                  placement="right-start"
                  title=""
                  width="200"
                  trigger="manual"
                  content="结束时间需大于开始时间。"
                  v-model="popoverVisible"
                >
                </el-popover>
                <el-button
                  type="primary"
                  slot="reference"
                  icon="el-icon-search"
                  @click="handleFilter"
                  size="mini"
                >查询</el-button>
              </div>
            </template>
          </div>
        </el-header>
        <el-main>
          <div class="filter-container" style="padding-top: 0;">
            <!--<el-button class="filter-item" type="primary" icon="el-icon-plus" @click="create">新增公告</el-button>-->
            <!--<el-button class="filter-item" type="info" icon="el-icon-delete" @click="del">删除</el-button>-->
          </div>
          <div>
            <el-table :data="tableData" stripe style="width: 100%" border>
              <el-table-column
                prop="date"
                label="操作">
              </el-table-column>
              <el-table-column
                prop="name"
                label="操作人">
              </el-table-column>
              <el-table-column
                prop="address"
                label="操作时间">
              </el-table-column>
            </el-table>
            <pagination v-show="query.total>0" :total="query.total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="getList" />
          </div>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>
<script>
  import Pagination from "@/components/Pagination"

  export default {
  name: 'logManagement',
  components: { Pagination },
  data(){
    return {
      logLoading: false,
      popoverVisible: false,
      value1: '',
      value2: '',
      parems: {
        starttime: '',
        endtime: '',
      },
      query: {
        total: 2,
        pageNo: 1,
        pageSize: 10,
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    getList(){

    },
    start(start) {
      this.parems.starttime = start
    },
    end(end) {
      this.parems.endtime = end
    },
    // 查询按钮
    handleFilter(){
      if (this.parems.starttime > this.parems.endtime) {
        this.popoverVisible = true
        // setTimeout(() => {
        //   this.popoverVisible = false
        // }, 1500)
        return
      } else {
        //进行查询
      }
    },
  }
}
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
      min-height: 86vh;
    }
  }
</style>
