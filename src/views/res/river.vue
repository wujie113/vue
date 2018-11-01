<template>
  <div class="app-container">
    <div class="filter-container"> 
       <el-input placeholder="输入标题" v-model="listQuery.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.type" placeholder="请选择类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
       <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
       <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addRiver"	>新增</el-button>
    </div>
      <el-table  v-loading="listLoading" :data="list"    border  fit highlight-current-row  row-key="id"  stripe style="width: 100%">
      <el-table-column prop="name" label="名称"/> 
      <el-table-column prop="river.name" label="所属水系"/> 
      <el-table-column prop="typename" label="河流类型"/>   
      <el-table-column prop="area.name" label="责任主体"/> 
      <el-table-column prop="description" label="描述" :show-overflow-tooltip="true"/>
		<el-table-column prop="id" label="操作" width="100"   >
        	<template slot-scope="scope">
            	<el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit"/>
			<el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete"/>
        	</template>
        </el-table-column>
      </el-table>  
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />  
  
   <el-dialog :visible.sync="visible"  width="30%" title="编辑">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item prop="name" label="河流名称">
          <el-input v-model="form.name"/>
        </el-form-item>    
       <el-form-item  prop="river" label="所属水系">
            <el-select v-model="form.river" placeholder="请选择水系" clearable class="filter-item" >
              <el-option v-for="item in sxOptions" :key="item.key" :label="item.label" :value="item.key"/>
            </el-select>
        </el-form-item>  
       <el-form-item   prop="type"  label="河流类型">
            <el-select v-model="form.type" placeholder="请选择类型" clearable class="filter-item" >
              <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key"/>
            </el-select>
        </el-form-item>  
        <el-form-item   prop="area"  label="责任主体">
          <rm-area-select v-model="form.area"  />
        </el-form-item>  
        <el-form-item prop="description" label="河流描述">
          <el-input v-model="form.description" :rows="4" type="textarea" />
        </el-form-item>
       </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button @click="save()" type="primary" >确 定</el-button>
            </div>
        </el-dialog>
       </div>
</template> 
<script> 
import Pagination from '@/components/Pagination' 
import { getList ,save,del,getxslist } from '@/api/res/river.js'
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
      listLoading: null,
	  form: {
	  	type: null,	  	
	  	province: null,	  	
	  	region: null,	  	
	  	county: null,	  	
	  	town: null,	  	
	  	name: null,	  	
	  	lng: null,	  	
	  	lat: null,	  	
	  	description: null,	  	
	  	area: null,	
	  	river: null	  	
	  },
      list: null, 
      total: 0 ,
      listQuery: {
        pageNo: 1,
        pageSize: 10, 
        importance: undefined,
        search: undefined,
        type: "HL",
        sort: '+id'
      },
      typeOptions: [{ label: '河流', key: 'HL' }, { label: '沟渠', key: 'GQ' }],
      sxOptions: null
    }
    } ,
  created() {
    this.getList()
    this.getxslist()
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
  getxslist() {
      getxslist(this.listQuery).then(response => {  
            this.sxOptions = response.data.list 
            console.log(response)
      })
  },
  addRiver() {    
    this.visible = true   
    if (this.$refs.form != undefined) {  
       Object.assign(this.form, this.$options.data().form) 
    }  
  },
	edit(row) { 
		this.visible = true 
    Object.assign(this.form, row) 
	},
	save() {
	    this.visible = false
  	  this.listLoading = true   
      save(this.form).then(response => { 
           this.getList() 
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
