<template>
  <div class="app-container">
    <div class="filter-container"> 
       <el-input placeholder="输入标题" v-model="listQuery.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-input :placeholder="$t('table.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.importance" placeholder="请选择列别" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select> 
       <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button  class="filter-item" type="primary" icon="el-icon-circle-plus"  @click="dialogVisible = true">新增</el-button>
     
    </div>
      <el-table  
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      >
        <el-table-column prop="mrid" label="编号" width="180" align="center">
        </el-table-column>
        <el-table-column prop="name" label="名称" width="180" align="center">
        </el-table-column>
        <el-table-column prop="typename" label="类型" align="center">
        </el-table-column>
         <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width"  >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button> 
          <el-button  size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除
          </el-button>
        </template>
      </el-table-column>
      </el-table>  
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" /> 


  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
     <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
      <el-form-item label="即时配送">
          <el-switch v-model="form.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源">
          <el-radio-group v-model="form.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
  </el-dialog>

  </div>

  


</template>


<script>
import Pagination from "@/components/Pagination"
import { getList } from "@/api/river/river.js"
import RmDict from "@/components/rm/dict"
export default {
  components: { Pagination, RmDict },
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
      tableKey: 0,
      list: null,
      total: 0,
      dialogVisible: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        importance: undefined,
        search: undefined,
        type: undefined,
        sort: "+id"
      },
      downloadLoading: false,
      importanceOptions: [1, 2, 3],
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log("this.listQuery::::", this.listQuery)
      getList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.count
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleUpdate() {
      alert("编辑")
    },
    handleModifyStatus() {
 alert("删除")
    },
     onSubmit() {
        console.log('submit!')
      }
  }
}
</script>
