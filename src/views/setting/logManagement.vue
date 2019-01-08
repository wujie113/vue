/*
 * @Author: 刘小康 
 * @Date: 2018-12-27 09:44:57 
 * @Last Modified by: 刘小康
 * @Last Modified time: 2019-01-08 16:02:45
 */
// 日志管理
<template>
  <div class="app-container">
    <el-container>
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
                  placement="right"
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
          </div>
        </el-header>
        <el-main v-loading="logLoading">
          <!-- <div class="filter-container" style="padding-top: 0;">
            <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="create">新增公告</el-button>
            <el-button class="filter-item" type="info" icon="el-icon-delete" @click="del">删除</el-button>
          </div>-->
          <div>
            <el-table :data="tableData" stripe style="width: 100%" border>
              <el-table-column prop="title" label="操作"></el-table-column>
              <el-table-column prop="tenantId" label="操作人"></el-table-column>
              <el-table-column prop="createDate" label="操作时间"></el-table-column>
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
  </div>
</template>
<script>
import Pagination from "@/components/Pagination"
import { getLoglist } from '@/api/setting/logManagement'
export default {
  name: 'logManagement',
  components: { Pagination },
  data() {
    return {
      logLoading: false,
      popoverVisible: false,
      value1: '',
      value2: '',
      originTime: {
        beginDate: '',
        endDate: '',
      },
      query: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        title: "系统登录",
        beginDate: "",
        endDate: ""
      },
      tableData: []
    }
  },
  created() {
    this.logLoading = true
    this.getList()
  },
  methods: {
    getList() {
      getLoglist(this.query).then((res) => {
        this.logLoading = false
        this.query.total = res.data.count
        this.tableData = res.data.list        
      }).catch((errorRes) => {
        this.logLoading = false
      })
    },
    start(start) {
      this.originTime.beginDate = start
      let startDate = new Date(start)
      this.query.beginDate = startDate.getFullYear() + '-' + startDate.getMonth() + 1 + '-' + startDate.getDate()
    },
    end(end) {
      this.originTime.endDate = end
      let endDate = new Date(end)
      this.query.endDate = endDate.getFullYear() + '-' + endDate.getMonth() + 1 + '-' + endDate.getDate()
    },
    // 查询按钮
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
        this.logLoading = true
        this.getList()
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
    min-height: calc(100vh - 126px);
  }
}
</style>
