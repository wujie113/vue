<template>
  <div class="app-container">
    <div class="filter-container"> 
       <el-input placeholder="输入标题" v-model="listQuery.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.importance" placeholder="请选择列别" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select> 
       <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
       <el-button
			 type="primary"
			 icon="el-icon-plus"
			 @click="visible=true"
			>新增</el-button>
    </div>
      <el-table :data="list" row-key="id"  stripe style="width: 100%">
                <el-table-column prop="lng" label="经度"/>
        <el-table-column prop="lat" label="纬度"/>
        <el-table-column prop="type" label="工单类型"/>
        <el-table-column prop="source" label="数据来源"/>
        <!-- <el-table-column prop="area.id" label="所属区划"/> -->
        <el-table-column prop="dept" label="接单单位"/>
        <el-table-column prop="unit" label="相关部门"/>
        <el-table-column prop="handleTime" label="办结时间"/>
        <el-table-column prop="description" label="问题描述"/>
        <el-table-column prop="taskcontent" label="任务描述"/>
        <el-table-column prop="launchTime" label="发起时间"/>
        <el-table-column prop="receivePesrson" label="接单人"/>
        <el-table-column prop="receiveTime" label="接收时间"/>
        <el-table-column prop="dealDept" label="处理单位"/>
        <el-table-column prop="dealStatus" label="处理状态"/>
        <el-table-column prop="dealDate" label="处理时间"/>
		<el-table-column prop="id" label="操作" width="100"   >
        	<template slot-scope="scope">
            	<el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit"/>
			<el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete"/>
        	</template>
        </el-table-column>
      </el-table>  
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" /> 
  
  
  <el-dialog :visible.sync="visible" title="编辑">
  	<el-form :model="form">
		 
			<el-form-item label="工单类型">
				<el-input v-model="form.type"/>
			</el-form-item>
			<el-form-item label="数据来源">
				<el-input v-model="form.source"/>
			</el-form-item>
		<!--	<el-form-item label="所属区划">
				 <rm-area-select v-model="form.area.id"  />
			</el-form-item>-->
			<el-form-item label="接单单位">
				<el-input v-model="form.dept"/>
			</el-form-item>
			<el-form-item label="相关部门">
				<el-input v-model="form.unit"/>
			</el-form-item>
			<el-form-item label="办结时间">
				 <el-date-picker v-model="form.handleTime" type="date" placeholder="Pick a date" style="width: 100%;"/>
				<!-- <span class="help-inline"><font color="red">*</font> </span>-->
			</el-form-item>
			<el-form-item label="问题描述">
				<el-input v-model="form.description"/>
			</el-form-item>
			<el-form-item label="任务描述">
				<el-input v-model="form.taskcontent"/>
			</el-form-item>
			<el-form-item label="发起时间">
				 <el-date-picker v-model="form.launchTime" type="date" placeholder="Pick a date" style="width: 100%;"/>
				<!-- <span class="help-inline"><font color="red">*</font> </span>-->
			</el-form-item>
			<el-form-item label="接单人">
				<el-input v-model="form.receivePesrson"/>
			</el-form-item>
			<el-form-item label="接收时间">
				 <el-date-picker v-model="form.receiveTime" type="date" placeholder="Pick a date" style="width: 100%;"/>
				<!-- <span class="help-inline"><font color="red">*</font> </span>-->
			</el-form-item>
			<el-form-item label="处理单位">
				<el-input v-model="form.dealDept"/>
			</el-form-item>
			<el-form-item label="处理状态">
				<el-input v-model="form.dealStatus"/>
			</el-form-item>
			<el-form-item label="处理时间">
				 <el-date-picker v-model="form.dealDate" type="date" placeholder="Pick a date" style="width: 100%;"/>
				<!-- <span class="help-inline"><font color="red">*</font> </span>-->
			</el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button @click="save()" type="primary">确 定</el-button>
            </div>
        </el-dialog>
       </div>
</template> 
<script> 
import Pagination from '@/components/Pagination' 
import { getList ,save,del} from '@/api/work/proTask.js'
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
      listQuery: {
        pageNo: 1,
        pageSize: 10, 
        importance: undefined,
        search: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3]
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
	save() {
	//	console.log('保存:',JSON.stringify(this.form),this.selectUser);
      this.visible = false
      this.listLoading = true
      save(this.form).then(response => {        
          // 上传到服务器
         // this.$refs.upload.submit();
        	this.getList();
      }).catch(error => {
        this.listLoading = false
      })
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
