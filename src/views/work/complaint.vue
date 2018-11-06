<template>
  <div class="app-container">
    <div class="filter-container"> 
       <el-input placeholder="请输入问题描述" v-model="listQuery.description" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
       <rm-dict class="filter-item" title="请选择类型" placeholder="请选择类型" type="work_complan"  v-model="listQuery.type"/>
       <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button> 
    </div>
      <el-table :data="list"  v-loading="listLoading"  row-key="id"  stripe style="width: 100%">
                <el-table-column prop="lat" label="纬度"/>
        <el-table-column prop="lng" label="经度"/>
        <el-table-column prop="area.id" label="所属区域"/>
        <el-table-column prop="typename" label="问题类型"/>
        <el-table-column prop="address" label="事发地点"/>
        <el-table-column prop="report" label="上报人"/>
        <el-table-column prop="reportPhone" label="上报电话"/>
        <el-table-column prop="reportDate" label="上报时间"/>
        <el-table-column prop="description" label="问题描述"/>
		<el-table-column prop="id" label="操作" width="100"   >
        	<template slot-scope="scope">
            	<el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit"/>
			<el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete"/>
        	</template>
        </el-table-column>
      </el-table>  
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />  
  <el-dialog :visible.sync="visible" title="投诉详情" l>
  	<el-form :model="form" abel-width="80px" size="mini"> 
      <el-form-item label="问题类型">
			 {{form.typename}}
			</el-form-item>  
     <el-form-item label="纬度纬度">
				{{form.lat}},{{form.lng}}
			</el-form-item>  
      <el-form-item label="上报人">
				  {{form.report}}
			</el-form-item> 
			<el-form-item label="上报电话"> 
         {{form.reportPhone}}
			</el-form-item> 
	    <el-form-item label="上报时间"> 
        {{form.reportDate}}
			</el-form-item>  
			<el-form-item label="问题描述">  
          {{form.description}}
			</el-form-item> 
      </el-form> 
      <vue-preview :slides="slide1" @close="handleClose"></vue-preview> 
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">关 闭</el-button> 
            </div>
      </el-dialog>
    </div>
</template> 
<script> 
import Pagination from '@/components/Pagination' 
import { getList ,get} from '@/api/work/complaint.js'
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
      listLoading:false,
      slide1: null,
      form: {
        lat:null,	  	
        lng:null,	  	
        area:{id:null},	  	
        type:null,	  	
        address:null,	  	
        report:null,	  	
        reportPhone:null,	  	
        reportDate:null,	  	
        description:null,	
        typename:null  	
      },
      list:  null, 
      total: 0 ,
      listQuery: {
        pageNo: 1,
        pageSize: 10, 
        importance: undefined,
        search: undefined,
        description:null,
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
    get(row.id).then(response => {  
      this.form=response.data;
      console.log("form:::",this.form); this.slide1=[]; 
        const imagelist=this.form.imageurl; 
        imagelist.forEach((value,index)=> { 
            this.slide1.push(
              {
                src:value.url,
                msrc:value.url,
                alt:value.name,
                title:value.name,
                w: 1200,
                h: 900
              }
            )
        }); 
    });
    
	},
	save(){
		//console.log('保存:',JSON.stringify(this.form),this.selectUser);
		this.visible=false;
		//
	},
	del(row){
		var self=this;
		//console.log(row); 
  } ,
  handleClose(){
    console.log(".......")
  } 
  }
}
</script>