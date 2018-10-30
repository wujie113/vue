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
                <el-table-column prop="name" label="泵站名称"/>
        <el-table-column prop="code" label="泵站编码"/>
        <el-table-column prop="lat" label="经度"/>
        <el-table-column prop="lng" label="纬度"/>
        <el-table-column prop="province" label="省"/>
        <el-table-column prop="region" label="地区"/>
        <el-table-column prop="county" label="县"/>
        <el-table-column prop="town" label="乡（镇）"/>
        <el-table-column prop="village" label="街（村）"/>
        <el-table-column prop="regimeCode" label="行政区划代码"/>
        <el-table-column prop="threeCode" label="所在水资源三级区名称及编码"/>
        <el-table-column prop="riverName" label="所在河流(湖泊、水库、渠道)名称"/>
        <el-table-column prop="riverCode" label="所在河流(湖泊、水库、渠道)编码"/>
        <el-table-column prop="irrigationName" label="所在灌区(引调水工程)名称"/>
        <el-table-column prop="irrigationCode" label="所在灌区(引调水工程)编码"/>
        <el-table-column prop="type" label="泵站类型"/>
        <el-table-column prop="isBrake" label="是否为闸站工程"/>
        <el-table-column prop="isSpring" label="是否为引泉工程"/>
        <el-table-column prop="construction" label="工程建设情况"/>
        <el-table-column prop="builtEndYear" label="建成时间（年）"/>
        <el-table-column prop="builtEndMonth" label="建成时间（月）"/>
        <el-table-column prop="builtStartYear" label="开工时间（年）"/>
        <el-table-column prop="builtStartMonth" label="开工时间（月）"/>
        <el-table-column prop="projectTask" label="工程任务"/>
        <el-table-column prop="projectLevel" label="工程等别"/>
        <el-table-column prop="projectBuildLevel" label="主要建筑物级别"/>
        <el-table-column prop="traffic" label="装机流量(立方米/秒)"/>
        <el-table-column prop="power" label="装机功率(kW)"/>
        <el-table-column prop="lift" label="设计扬程(m)"/>
        <el-table-column prop="pumpNum" label="水泵数量(台)"/>
        <el-table-column prop="mangerName" label="泵站管理单位名称"/>
        <el-table-column prop="mangerCode" label="泵站管理单位代码"/>
        <el-table-column prop="mangerExportName" label="泵站归口管理部门"/>
        <el-table-column prop="division" label="是否完成划界"/>
        <el-table-column prop="confirm" label="是否完成确权"/>
        <el-table-column prop="recordMan" label="填表人员"/>
        <el-table-column prop="recordPhone" label="填表联系人电话"/>
        <el-table-column prop="reviewMan" label="复核人员"/>
        <el-table-column prop="reviewPhone" label="复核人联系电话"/>
        <el-table-column prop="auditMan" label="审查人员"/>
        <el-table-column prop="auditSymbol" label="审核标志"/>
        <el-table-column prop="regionAudit" label="地区审核"/>
        <el-table-column prop="provinceAudit" label="省级审核"/>
        <el-table-column prop="nationAudit" label="中央审核"/>
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
			<el-form-item label="泵站名称">
				<el-input v-model="form.name"/>
			</el-form-item>
			<el-form-item label="泵站编码">
				<el-input v-model="form.code"/>
			</el-form-item>
			<el-form-item label="经度">
				<el-input v-model="form.lat"/>
			</el-form-item>
			<el-form-item label="纬度">
				<el-input v-model="form.lng"/>
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
			<el-form-item label="街（村）">
				<el-input v-model="form.village"/>
			</el-form-item>
			<el-form-item label="行政区划代码">
				<el-input v-model="form.regimeCode"/>
			</el-form-item>
			<el-form-item label="所在水资源三级区名称及编码">
				<el-input v-model="form.threeCode"/>
			</el-form-item>
			<el-form-item label="所在河流(湖泊、水库、渠道)名称">
				<el-input v-model="form.riverName"/>
			</el-form-item>
			<el-form-item label="所在河流(湖泊、水库、渠道)编码">
				<el-input v-model="form.riverCode"/>
			</el-form-item>
			<el-form-item label="所在灌区(引调水工程)名称">
				<el-input v-model="form.irrigationName"/>
			</el-form-item>
			<el-form-item label="所在灌区(引调水工程)编码">
				<el-input v-model="form.irrigationCode"/>
			</el-form-item>
			<el-form-item label="泵站类型">
				<el-input v-model="form.type"/>
			</el-form-item>
			<el-form-item label="是否为闸站工程">
				<el-input v-model="form.isBrake"/>
			</el-form-item>
			<el-form-item label="是否为引泉工程">
				<el-input v-model="form.isSpring"/>
			</el-form-item>
			<el-form-item label="工程建设情况">
				<el-input v-model="form.construction"/>
			</el-form-item>
			<el-form-item label="建成时间（年）">
				<el-input v-model="form.builtEndYear"/>
			</el-form-item>
			<el-form-item label="建成时间（月）">
				<el-input v-model="form.builtEndMonth"/>
			</el-form-item>
			<el-form-item label="开工时间（年）">
				<el-input v-model="form.builtStartYear"/>
			</el-form-item>
			<el-form-item label="开工时间（月）">
				<el-input v-model="form.builtStartMonth"/>
			</el-form-item>
			<el-form-item label="工程任务">
				<el-input v-model="form.projectTask"/>
			</el-form-item>
			<el-form-item label="工程等别">
				<el-input v-model="form.projectLevel"/>
			</el-form-item>
			<el-form-item label="主要建筑物级别">
				<el-input v-model="form.projectBuildLevel"/>
			</el-form-item>
			<el-form-item label="装机流量(立方米/秒)">
				<el-input v-model="form.traffic"/>
			</el-form-item>
			<el-form-item label="装机功率(kW)">
				<el-input v-model="form.power"/>
			</el-form-item>
			<el-form-item label="设计扬程(m)">
				<el-input v-model="form.lift"/>
			</el-form-item>
			<el-form-item label="水泵数量(台)">
				<el-input v-model="form.pumpNum"/>
			</el-form-item>
			<el-form-item label="泵站管理单位名称">
				<el-input v-model="form.mangerName"/>
			</el-form-item>
			<el-form-item label="泵站管理单位代码">
				<el-input v-model="form.mangerCode"/>
			</el-form-item>
			<el-form-item label="泵站归口管理部门">
				<el-input v-model="form.mangerExportName"/>
			</el-form-item>
			<el-form-item label="是否完成划界">
				<el-input v-model="form.division"/>
			</el-form-item>
			<el-form-item label="是否完成确权">
				<el-input v-model="form.confirm"/>
			</el-form-item>
			<el-form-item label="填表人员">
				<el-input v-model="form.recordMan"/>
			</el-form-item>
			<el-form-item label="填表联系人电话">
				<el-input v-model="form.recordPhone"/>
			</el-form-item>
			<el-form-item label="复核人员">
				<el-input v-model="form.reviewMan"/>
			</el-form-item>
			<el-form-item label="复核人联系电话">
				<el-input v-model="form.reviewPhone"/>
			</el-form-item>
			<el-form-item label="审查人员">
				<el-input v-model="form.auditMan"/>
			</el-form-item>
			<el-form-item label="审核标志">
				<el-input v-model="form.auditSymbol"/>
			</el-form-item>
			<el-form-item label="地区审核">
				<el-input v-model="form.regionAudit"/>
			</el-form-item>
			<el-form-item label="省级审核">
				<el-input v-model="form.provinceAudit"/>
			</el-form-item>
			<el-form-item label="中央审核">
				<el-input v-model="form.nationAudit"/>
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
import { getList } from '@/api/res/pump.js'
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
	  	name:null,	  	
	  	code:null,	  	
	  	lat:null,	  	
	  	lng:null,	  	
	  	province:null,	  	
	  	region:null,	  	
	  	county:null,	  	
	  	town:null,	  	
	  	village:null,	  	
	  	regimeCode:null,	  	
	  	threeCode:null,	  	
	  	riverName:null,	  	
	  	riverCode:null,	  	
	  	irrigationName:null,	  	
	  	irrigationCode:null,	  	
	  	type:null,	  	
	  	isBrake:null,	  	
	  	isSpring:null,	  	
	  	construction:null,	  	
	  	builtEndYear:null,	  	
	  	builtEndMonth:null,	  	
	  	builtStartYear:null,	  	
	  	builtStartMonth:null,	  	
	  	projectTask:null,	  	
	  	projectLevel:null,	  	
	  	projectBuildLevel:null,	  	
	  	traffic:null,	  	
	  	power:null,	  	
	  	lift:null,	  	
	  	pumpNum:null,	  	
	  	mangerName:null,	  	
	  	mangerCode:null,	  	
	  	mangerExportName:null,	  	
	  	division:null,	  	
	  	confirm:null,	  	
	  	recordMan:null,	  	
	  	recordPhone:null,	  	
	  	reviewMan:null,	  	
	  	reviewPhone:null,	  	
	  	auditMan:null,	  	
	  	auditSymbol:null,	  	
	  	regionAudit:null,	  	
	  	provinceAudit:null,	  	
	  	nationAudit:null,	  	
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