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
            <el-table-column prop="deptName" label="处理单位"/>
            <el-table-column prop="receivePesrson" label="接单人"/>
            <el-table-column prop="receiveTime" label="接单时间"/> 
            <el-table-column prop="id" label="操作" width="150"   >
              <template slot-scope="scope">
            
                <el-button type="text" title="曝光" @click="edit(scope.row)">
                  <svg-icon icon-class="puguangColor" />                        
                </el-button>
                <el-button type="text" title="督办" @click="edit(scope.row)">
                  <svg-icon icon-class="jianduColor" />
                </el-button>
                <el-button type="text" title="删除" @click="del(scope.row)">
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
          <el-dialog :visible.sync="visible" title="工单详情" top="1vh">
            <div class="splitBox">
              <div class="work-order-details-list-title">
                上报详情
              </div>
              <el-form :model="form" abel-width="80px" size="mini">
                <el-form-item label="上报类型">
                  {{form.typeLabel}}
                </el-form-item>
                <el-form-item label="上 报 人">
                  {{form.userName}}
                </el-form-item> 
                <el-form-item label="标    题">
                  {{form.auditStatus}}
                </el-form-item>
                <el-form-item label="内    容">
                  {{form.content}}
                </el-form-item>
                <el-form-item label="上报时间"> 
                  {{form.reportTime}}
                </el-form-item>
              </el-form>
            </div>

            <!-- 分割线 -->
            <div class="work-order-details-list-split"></div>
            <div class="splitBox">
              <div class="work-order-details-list-title">
                工单详情
              </div>
              <el-form :model="formProTask" abel-width="80px" size="mini">
                <el-form-item label="相关部门">
                  {{formProTask.unitName}}
                </el-form-item>
                <el-form-item label="发 起 人">
                  {{formProTask.launchName}}
                </el-form-item> 
                <el-form-item label="发起时间"> 
                  {{formProTask.launchTime}}
                </el-form-item>
                <el-form-item label="接单单位">
                  {{formProTask.deptName}}
                </el-form-item>
                <el-form-item label="办结时间"> 
                  {{formProTask.handleTime}}
                </el-form-item>
                <el-form-item label="问题描述">
                  {{formProTask.description}}
                </el-form-item>
                <el-form-item label="任务描述">
                  {{formProTask.taskcontent}}
                </el-form-item>
              </el-form>
              <viewer :images="imgArr" class="clearfix">
                <img :src="img.url" :key="index" v-for="(img, index) in imgArr">
              </viewer>
              <viewer :images="videoArr" class="clearfix">
                <video :src="video.url" :key="index" v-for="(video,index) in videoArr" controls="controls"/>                                         
              </viewer> 
              <viewer :images="audioArr" class="clearfix">
                <audio :src="audio.url" :key="index" v-for="(audio,index) in audioArr" controls="controls"/>                                         
              </viewer> 

            </div>
            <!-- 分割线 -->
            <div class="work-order-details-list-split"></div>
            <div class="splitBox">
              <div class="work-order-details-list-title">
                区、县河长回退工单
              </div>
              <el-form :model="form" abel-width="80px" size="mini">
                <el-form-item label="处 理 人">
                  {{form.content}}
                </el-form-item>
                <el-form-item label="处理时间"> 
                  {{form.reportTime}}
                </el-form-item>
                <el-form-item label="备    注">
                  {{form.typeLabel}}
                </el-form-item> 
              </el-form>
            </div>

            
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
import { getList ,del,get} from '@/api/work/proTask.js'
import RmDict from '@/components/rm/dict'
 import { getfiles, delfiles } from '@/api/res/river.js' 
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
	    formProTask: {
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
      form:{},
      list: null, 
      total: 0 ,
      slide1: [],
      imgArr:[],
      videoArr:[],
      audioArr:[],
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
		console.log(JSON.stringify(row));
	
    this.formProTask = row
    getfiles({ bizId: this.formProTask.id}).then(response => {
        this.imgArr = response.imgArr
        this.audioArr = response.audioArr
        this.videoArr = response.videoArr
     })
     	this.visible = true
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
}
.app-container {
  /deep/ .el-dialog__body {
    max-height: 650px;
  }
  .city {
    color: #35Acf2;
  }
  .country {
    color: #3dc87e;
  }
  /deep/ .el-form-item--mini.el-form-item {
    margin-bottom: 0px;
  }
  .work-order-details-list-title {
    color: #279cf5;
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 2px solid #279cf5;
    height: 14px;
    line-height: 14px;
  }
  .work-order-details-list-split {
    border-top: 10px #f0f3f5 solid;
    margin: -1px -20px 0 -20px;
    padding: 0px 20px 0px 20px;
  }
  .splitBox:not(:first-of-type) {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  /deep/ .el-dialog__body {
    img {
      width: 24%;
      max-height: 15em;
      margin: 0.5em 0.2em 0 0;
      float: left;
    }
    video, audio {
      width: 49%;
      max-height: 15em;
      margin: 0.5em 0.2em 0 0;
      float: left;
    }
  }
}

</style>
