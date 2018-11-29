<template>
  <div class="app-container">
    <el-container v-loading="listLoading">
      <el-container>
        <el-header height="125px">
          <div style="" class="topTitle">
            工单列表
          </div>
          <div class="filter-container">
            <el-input placeholder="输入问题描述" v-model="listQuery.description" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
            <el-select v-model="listQuery.dealStatus" placeholder="请选择列别" clearable style="width: 90px" class="filter-item">
              <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
            </el-select> 
            <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          </div>
        </el-header>
        <el-main>
          <el-table :data="list" row-key="id"  stripe border width="100%">
            <el-table-column label="" width="80">
              <template slot-scope="scope">
                  <span title="时时事事11111" class="city">市</span>
                  <!-- <span title="2222222" class="country">县级</span> -->
                  <span title="督查" style="color: #ffa727;">督</span>
              </template>
            </el-table-column>

            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="description" label="问题描述"/>
            <el-table-column prop="launchName" label="发起人"/>
            <el-table-column prop="launchTime" label="发起时间"/>
            <el-table-column prop="dealStatus" label="处理状态"/>
            <el-table-column prop="dealDept" label="处理单位"/>
            <el-table-column prop="receivePesrson" label="接单人"/>
            <el-table-column prop="receiveTime" label="接单时间"/> 
            <el-table-column prop="id" label="操作" width="150"   >
              <template slot-scope="scope">
                <!-- <el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit"/> -->
                <!-- <el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete"/> -->
                <el-button type="text" title="曝光" @click="edit(scope.row)">
                  <svg-icon icon-class="puguangColor" />                        
                </el-button>
                <el-button type="text" title="督办" @click="edit(scope.row)">
                  <svg-icon icon-class="jianduColor" />
                </el-button>
                <el-button type="text" title="删除" @click="edit(scope.row)">
                  <svg-icon icon-class="deleteColor" />
                </el-button>
                <el-button type="text" title="详情" @click="edit(scope.row)">
                  <svg-icon icon-class="detailColor" />
                </el-button>
              </template>
            </el-table-column>
          </el-table>  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" /> 
        </el-main>
      </el-container>
    </el-container>
    <!-- <div class="filter-container"> 
       <el-input placeholder="输入问题描述" v-model="listQuery.description" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.dealStatus" placeholder="请选择列别" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select> 
       <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      
    </div> -->
      
  

   <!-- 详情弹窗 -->
          <el-dialog :visible.sync="visible" title="工单详情">
            <el-form :model="form" abel-width="80px" size="mini">
              <el-form-item label="上报内容">
                {{form.content}}
              </el-form-item>
              <el-form-item label="事件类型">
                {{form.typeLabel}}
              </el-form-item>
              <el-form-item label="上报人">
                {{form.userName}}
              </el-form-item> 
              <el-form-item label="上报时间"> 
                {{form.reportTime}}
              </el-form-item>
              <el-form-item label="处理状态">
                {{form.auditStatus}}
              </el-form-item>
            </el-form>
            <viewer :images="slide1">
              <img :src="img" :key="index" v-for="(img, index) in slide1">
            </viewer>
            <div slot="footer" class="dialog-footer">
              <el-button @click="visible = false">关 闭</el-button>
            </div>
          </el-dialog>
   
      </div>
</template> 
<script> 
import Pagination from '@/components/Pagination' 
import { getList ,del} from '@/api/work/proTask.js'
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
export default {
  components: { Pagination,RmDict,RmOrgSelect, RmUserSelect, RmAreaSelect },
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
	    form: {
        reportId:null,
        lng: null,	  	
        lat: null,	  	
        type: null,	  	
        source: null,	  	
        area: null,	  	
        dept: null,	  	
        unit: null,	  	
        handleTime: null,	  	
        description: null,	  	
        taskcontent: null,	  	
        launchTime: null,	  	
        receivePesrson: null,	  	
        receiveTime: null,	  	
        dealDept: null,	  	
        dealStatus: null,	  	
        dealDate: null	  	
	    },
      list: null, 
      total: 0 ,
      slide1: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10, 
        importance: undefined,
        search: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: ['未接单', '处理中','已完成','已关闭']
    }
    },
  created() {
    this.getList()
  },
  methods: {
    getList() {  
        this.listLoading = true 
        console.log("this.listQuery::::",this.listQuery)
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
	edit(row) {
		//console.log(JSON.stringify(row));
		this.visible = true
		this.form = row
	}, 
   
	del(row) {
      var self = this
      console.log(row.id)
      del(row.id).then(response => {
        this.getList()
      }).catch(error => {
        this.listLoading = false
      })
   		}  
  }
}
</script>
<style lang="scss" scoped>
.app-container > .el-container {
  min-height: 86vh;
  .city {
    color: #35Acf2;
  }
  .country {
    color: #3dc87e;
  }
}
</style>
