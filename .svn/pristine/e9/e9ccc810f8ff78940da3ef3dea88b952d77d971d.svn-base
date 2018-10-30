<template>
  <div class="app-container">
    <div class="filter-container"> 
       <el-input placeholder="输入标题" v-model="listQuery.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.importance" placeholder="请选择列别" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select> 
      <rm-dict title="请选择类型"  placeholder="请选择类型"  type="yes_no"     :name.sync="listQuery.type" />
       <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
       <el-button
			 type="primary"
			 icon="el-icon-plus"
			 @click="visible=true"
			>新增</el-button>
    </div>
      <el-table :data="list" row-key="id"  stripe style="width: 100%">
                <el-table-column prop="专员" label="专员"/>
        <el-table-column prop="riverId" label="河流id"/>
        <el-table-column prop="province" label="省"/>
        <el-table-column prop="region" label="地区"/>
        <el-table-column prop="county" label="县"/>
        <el-table-column prop="town" label="乡（镇）"/>
        <el-table-column prop="startTime" label="起时间"/>
        <el-table-column prop="endTime" label="止时间"/>
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
			<el-form-item label="专员">
				<el-input v-model="form.专员"/>
			</el-form-item>
			<el-form-item label="河流id">
				<el-input v-model="form.riverId"/>
			</el-form-item>
			<el-form-item label="省">
				<el-input v-model="form.province"/>
			</el-form-item>
			<el-form-item label="地区">
				<el-input v-model="form.region"/>
			</el-form-item>
			<el-form-item label="县">
				<el-input v-model="form.county"/>
			</el-form-item>
			<el-form-item label="乡（镇）">
				<el-input v-model="form.town"/>
			</el-form-item>
			<el-form-item label="起时间">
				 <el-date-picker v-model="form.startTime" type="date" placeholder="Pick a date" style="width: 100%;"/>
				<!-- <span class="help-inline"><font color="red">*</font> </span>-->
			</el-form-item>
			<el-form-item label="止时间">
				 <el-date-picker v-model="form.endTime" type="date" placeholder="Pick a date" style="width: 100%;"/>
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
import { getList } from '@/api/work/checkRiver.js'
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
      visible : false,
	  form: {
	  	专员:null,	  	
	  	riverId:null,	  	
	  	province:null,	  	
	  	region:null,	  	
	  	county:null,	  	
	  	town:null,	  	
	  	startTime:null,	  	
	  	endTime:null,	  	
	  },
      list:  null, 
      total: 0 ,
      listQuery: {
        pageNo: 1,
        pageSize: 10, 
        importance: undefined,
        search: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
    }
    },
  created() {
    this.getList()
  },
  methods: {
    getList() {  
        this.listLoading = true ;
        console.log("this.listQuery::::",this.listQuery);
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
	edit(row){
		//console.log(JSON.stringify(row));
		this.visible=true;
		this.form=row;
	},
	save(){
		//console.log('保存:',JSON.stringify(this.form),this.selectUser);
		this.visible=false;
		//
	},
	del(row){
		var self=this;
		//console.log(row); 
	}  
  }
}
</script>