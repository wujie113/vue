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
                <el-table-column prop="name" label="水电站名称"/>
        <el-table-column prop="code" label="水电站名称            水电站编码"/>
        <el-table-column prop="lat" label="厂房中点地理坐标(经度)"/>
        <el-table-column prop="lng" label="厂房中点地理坐标(纬度)"/>
        <el-table-column prop="province" label="省"/>
        <el-table-column prop="region" label="地区"/>
        <el-table-column prop="county" label="县"/>
        <el-table-column prop="town" label="乡（镇）"/>
        <el-table-column prop="village" label="街（村）"/>
        <el-table-column prop="regimeCode" label="行政区划代码"/>
        <el-table-column prop="threeCode" label="所在水资源三级区名称及编码"/>
        <el-table-column prop="riverName" label="所在河流（湖泊）名称"/>
        <el-table-column prop="riverCode" label="所在河流（湖泊）编码"/>
        <el-table-column prop="isPower" label="是否利用水库发电"/>
        <el-table-column prop="reservoirName" label="水库名称"/>
        <el-table-column prop="reservoirCode" label="水库编码"/>
        <el-table-column prop="type" label="水电站类型"/>
        <el-table-column prop="column1" label="生产安置人口（万人）"/>
        <el-table-column prop="column2" label="搬迁安置人口（万人）"/>
        <el-table-column prop="column3" label="建成时间（年）"/>
        <el-table-column prop="column4" label="建成时间（月）"/>
        <el-table-column prop="column5" label="开工时间（年）"/>
        <el-table-column prop="column6" label="开工时间（月）"/>
        <el-table-column prop="column7" label="工程等别"/>
        <el-table-column prop="column8" label="主要建筑物级别"/>
        <el-table-column prop="column9" label="装机容量（kW）"/>
        <el-table-column prop="column10" label="保证出力（kW）"/>
        <el-table-column prop="column11" label="额定水头(m)"/>
        <el-table-column prop="column12" label="机组台数(台)"/>
        <el-table-column prop="column13" label="多年平均发电量(万kW&middot;h)"/>
        <el-table-column prop="column14" label="2011年发电量(万kW&middot;h)"/>
        <el-table-column prop="column15" label="水电站管理单位名称"/>
        <el-table-column prop="column16" label="水电站管理单位代码"/>
        <el-table-column prop="column17" label="独立核算单位性质"/>
        <el-table-column prop="column18" label="水电站归口管理部门"/>
        <el-table-column prop="column19" label="工程建设情况"/>
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
			<el-form-item label="水电站名称">
				<el-input v-model="form.name"/>
			</el-form-item>
			<el-form-item label="水电站名称            水电站编码">
				<el-input v-model="form.code"/>
			</el-form-item>
			<el-form-item label="厂房中点地理坐标(经度)">
				<el-input v-model="form.lat"/>
			</el-form-item>
			<el-form-item label="厂房中点地理坐标(纬度)">
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
			<el-form-item label="所在河流（湖泊）名称">
				<el-input v-model="form.riverName"/>
			</el-form-item>
			<el-form-item label="所在河流（湖泊）编码">
				<el-input v-model="form.riverCode"/>
			</el-form-item>
			<el-form-item label="是否利用水库发电">
				<el-input v-model="form.isPower"/>
			</el-form-item>
			<el-form-item label="水库名称">
				<el-input v-model="form.reservoirName"/>
			</el-form-item>
			<el-form-item label="水库编码">
				<el-input v-model="form.reservoirCode"/>
			</el-form-item>
			<el-form-item label="水电站类型">
				<el-input v-model="form.type"/>
			</el-form-item>
			<el-form-item label="生产安置人口（万人）">
				<el-input v-model="form.column1"/>
			</el-form-item>
			<el-form-item label="搬迁安置人口（万人）">
				<el-input v-model="form.column2"/>
			</el-form-item>
			<el-form-item label="建成时间（年）">
				<el-input v-model="form.column3"/>
			</el-form-item>
			<el-form-item label="建成时间（月）">
				<el-input v-model="form.column4"/>
			</el-form-item>
			<el-form-item label="开工时间（年）">
				<el-input v-model="form.column5"/>
			</el-form-item>
			<el-form-item label="开工时间（月）">
				<el-input v-model="form.column6"/>
			</el-form-item>
			<el-form-item label="工程等别">
				<el-input v-model="form.column7"/>
			</el-form-item>
			<el-form-item label="主要建筑物级别">
				<el-input v-model="form.column8"/>
			</el-form-item>
			<el-form-item label="装机容量（kW）">
				<el-input v-model="form.column9"/>
			</el-form-item>
			<el-form-item label="保证出力（kW）">
				<el-input v-model="form.column10"/>
			</el-form-item>
			<el-form-item label="额定水头(m)">
				<el-input v-model="form.column11"/>
			</el-form-item>
			<el-form-item label="机组台数(台)">
				<el-input v-model="form.column12"/>
			</el-form-item>
			<el-form-item label="多年平均发电量(万kW&middot;h)">
				<el-input v-model="form.column13"/>
			</el-form-item>
			<el-form-item label="2011年发电量(万kW&middot;h)">
				<el-input v-model="form.column14"/>
			</el-form-item>
			<el-form-item label="水电站管理单位名称">
				<el-input v-model="form.column15"/>
			</el-form-item>
			<el-form-item label="水电站管理单位代码">
				<el-input v-model="form.column16"/>
			</el-form-item>
			<el-form-item label="独立核算单位性质">
				<el-input v-model="form.column17"/>
			</el-form-item>
			<el-form-item label="水电站归口管理部门">
				<el-input v-model="form.column18"/>
			</el-form-item>
			<el-form-item label="工程建设情况">
				<el-input v-model="form.column19"/>
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
import { getList } from '@/api/res/waterSubstation.js'
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
	  	isPower:null,	  	
	  	reservoirName:null,	  	
	  	reservoirCode:null,	  	
	  	type:null,	  	
	  	column1:null,	  	
	  	column2:null,	  	
	  	column3:null,	  	
	  	column4:null,	  	
	  	column5:null,	  	
	  	column6:null,	  	
	  	column7:null,	  	
	  	column8:null,	  	
	  	column9:null,	  	
	  	column10:null,	  	
	  	column11:null,	  	
	  	column12:null,	  	
	  	column13:null,	  	
	  	column14:null,	  	
	  	column15:null,	  	
	  	column16:null,	  	
	  	column17:null,	  	
	  	column18:null,	  	
	  	column19:null,	  	
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