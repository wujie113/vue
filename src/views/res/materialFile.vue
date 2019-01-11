<template>
  <div class="app-container">
    <div class="filter-container"> 
       <el-input placeholder="输入标题" v-model="query.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <rm-dict title="请选择类型"  placeholder="请选择类型"  type="yes_no"     :name.sync="query.type" />
       <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
       <el-button type="primary" icon="el-icon-plus" @click="create">新增</el-button>
    </div>
      <el-table :data="list" row-key="id"  stripe style="width: 100%">
                <el-table-column prop="title" label="标题"/>
        <el-table-column prop="industry" label="行业"/>
        <el-table-column prop="species" label="种类(1:河流归档资料。2:法律法规。3:一档一侧)"/>
        <el-table-column prop="type" label="类型"/>
        <el-table-column prop="issueStatus" label="发布状态"/>
        <el-table-column prop="issueUserId" label="发布人"/>
        <el-table-column prop="issueDate" label="发布时间"/>
		<el-table-column prop="id" label="操作" width="100"   >
        	<template slot-scope="scope">
            	<el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit"/>
			<el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete"/>
        	</template>
        </el-table-column>
      </el-table>  
    <pagination v-show="query.total>0" :total="query.total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="getList" /> 
  
  
  <el-dialog :visible.sync="v.form" title="编辑">
  	<el-form ref="form" :model="form" label-width="120px">
			<el-form-item label="标题">
				<el-input v-model="form.title" placeholder="请输入标题"/>
			</el-form-item>
			<el-form-item label="行业">
				<el-input v-model="form.industry" placeholder="请输入行业"/>
			</el-form-item>
			<el-form-item label="种类(1:河流归档资料。2:法律法规。3:一档一侧)">
				<el-input v-model="form.species" placeholder="请输入种类(1:河流归档资料。2:法律法规。3:一档一侧)"/>
			</el-form-item>
			<el-form-item label="类型">
				<el-input v-model="form.type" placeholder="请输入类型"/>
			</el-form-item>
			<el-form-item label="发布状态">
				<el-input v-model="form.issueStatus" placeholder="请输入发布状态"/>
			</el-form-item>
			<el-form-item label="发布人">
				<el-input v-model="form.issueUserId" placeholder="请输入发布人"/>
			</el-form-item>
			<el-form-item label="发布时间">
				 <el-date-picker v-model="form.issueDate" type="date" placeholder="请选择日期" style="width: 100%;"/>
				<!-- <span class="help-inline"><font color="red">*</font> </span>-->
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
import { getList,get,save,del } from '@/api/res/materialFile.js'
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
      v: {
          form: false,
          loading: false
        },
      list:  null,      
      query: {
      	total: 0 ,
        pageNo: 1,
        pageSize: 10, 
        search: undefined,
        type: undefined
      },
	  form: {
	  	title:null,	  	
	  	industry:null,	  	
	  	species:null,	  	
	  	type:null,	  	
	  	issueStatus:null,	  	
	  	issueUserId:null,	  	
	  	issueDate:null,	  	
	  }
    }
    },
  created() {
    this.getList()
  },
  methods: {
    getList() {  
        this.listLoading = true ;
        console.log("this.query::::",this.query);
        getList(this.query).then(response => { 
          this.listLoading = false 
           this.list = response.data.list
           this.query.total = response.data.count
        })
    },
     handleFilter() {
      this.query.pageNo = 1
      this.getList()
    },
    create() {
        this.v.form = true
        this.form = {}
    },
	edit(row){
		//console.log(JSON.stringify(row));
		this.v.form=true;
		this.form=row;
	},
    save() {
        //console.log('保存:',JSON.stringify(this.form),this.selectUser);         
        save(this.form).then(response => {
          this.v.form = false
          if (response.success) {
            this.$message(response.msg)
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
      del(row) {
        //var self = this
        //console.log(row) 
        del(row.id).then(response => {
          this.v.form = false
          if (response.success) {
            this.$message(response.msg)
            //删除列表数据
            const index = this.list.indexOf(row) //找到要删除数据在list中的位置 
            this.list.splice(index, 1) //通过splice 删除数据
          } else {
            this.$message({
              message: response.msg,
              type: "warning"
            })
          }
        })
      } 
  }
}
</script>