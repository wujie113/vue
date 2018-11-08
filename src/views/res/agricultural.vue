<template>
  <div class="app-container">
    <div class="filter-container"> 
         <el-input placeholder="检索水闸农饮工程编码、名称" v-model="query.search" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter"/>
       <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
	   <el-upload :action="uploadaction"  :show-file-list="false" :limit="1" accept=".xlsx,.xls" class="upload-demo"
              :before-upload="beforeUpload"  
				:data="uploaddata"   :on-success="handleSuccess"   :on-error="handlError">
				<el-button  class="filter-item"  type="primary">点击上传</el-button> 
		</el-upload>
    </div>
      <el-table :data="list" row-key="id"  stripe style="width: 100%">
                <el-table-column prop="name" label="工程名称"/>
        <el-table-column prop="code" label="工程编码"/>
        <el-table-column prop="lat" label="经度"/>
        <el-table-column prop="lng" label="纬度"/>
        <el-table-column prop="province" label="省"/>
        <el-table-column prop="region" label="地区"/>
        <el-table-column prop="county" label="县"/>
        <el-table-column prop="tower" label="乡（镇）"/>
        <el-table-column prop="village" label="街（村）"/>
        <el-table-column prop="regimeCode" label="行政区划代码"/>
        <el-table-column prop="threeCode" label="所在水资源三级区名称及编码"/>
        <el-table-column prop="type" label="取水水源类型"/>
        <el-table-column prop="isReservoir" label="是否为水库水"/>
        <el-table-column prop="projectType" label="工程类型"/>
        <el-table-column prop="benefitVillageNum" label="受益行政村数量（个）"/>
        <el-table-column prop="drinkWay" label="供水方式"/>
        <el-table-column prop="isCertificate" label="是否有取水许可证"/>
        <el-table-column prop="certificateCode" label="取水许可证编号"/>
        <el-table-column prop="isHealth" label="是否取得卫生许可"/>
        <el-table-column prop="healthCode" label="卫生许可证编号"/>
        <el-table-column prop="pipeLength" label="入户前的管网长度（km）"/>
        <el-table-column prop="power" label="配套功率（kw）"/>
        <el-table-column prop="construction" label="工程建设情况"/>
        <el-table-column prop="buildedYear" label="建成时间（年）"/>
        <el-table-column prop="buildedMonth" label="建成时间（月）"/>
        <el-table-column prop="buildYear" label="开工时间（年）"/>
        <el-table-column prop="buildMonth" label="开工时间（月）"/>
        <el-table-column prop="scale" label="设计供水规模（立方米/d）"/>
        <el-table-column prop="planPerson" label="设计供水人口(人)"/>
        <el-table-column prop="gross" label="年实际供水总量（万立方米）"/>
        <el-table-column prop="grossLife" label="年实际生活供水量（万立方米）"/>
        <el-table-column prop="grossProduction" label="年实际生产供水量（万立方米）"/>
        <el-table-column prop="person" label="年实际供水人口 （人）"/>
        <el-table-column prop="excessiveNum" label="水质超标项目"/>
        <el-table-column prop="purification" label="净水处理"/>
        <el-table-column prop="detectionEqui" label="水质检测设备"/>
        <el-table-column prop="detectionWay" label="水质检测方式"/>
        <el-table-column prop="mangerName" label="管理单位名称"/>
        <el-table-column prop="mangerCode" label="管理单位代码"/>
        <el-table-column prop="manger" label="管理主体"/>
        <el-table-column prop="charge" label="收费形式"/>
        <el-table-column prop="measureMoney" label="计量收费执行居民生活水价（元/立方米）"/>
        <el-table-column prop="totalMeasureMoney" label="计量收费年实收水费（万元）"/>
        <el-table-column prop="fixedMoney" label="固定收费执行居民生活水价（元/户&middot;月）"/>
        <el-table-column prop="totalFixedMoney" label="固定收费年实收水费（万元）"/>
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
    <pagination v-show="query.total>0" :total="query.total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="getList" /> 
  
  
  <el-dialog :visible.sync="v.form" title="编辑">
  	<el-form ref="form" :model="form" label-width="120px">
			<el-form-item label="工程名称">
				<el-input v-model="form.name" placeholder="请输入工程名称"/>
			</el-form-item>
			<el-form-item label="工程编码">
				<el-input v-model="form.code" placeholder="请输入工程编码"/>
			</el-form-item>
			<el-form-item label="经度">
				<el-input v-model="form.lat" placeholder="请输入经度"/>
			</el-form-item>
			<el-form-item label="纬度">
				<el-input v-model="form.lng" placeholder="请输入纬度"/>
			</el-form-item>
			<el-form-item label="省">
				<el-input v-model="form.province" placeholder="请输入省"/>
			</el-form-item>
			<el-form-item label="地区">
				<el-input v-model="form.region" placeholder="请输入地区"/>
			</el-form-item>
			<el-form-item label="县">
				<el-input v-model="form.county" placeholder="请输入县"/>
			</el-form-item>
			<el-form-item label="乡（镇）">
				<el-input v-model="form.tower" placeholder="请输入乡（镇）"/>
			</el-form-item>
			<el-form-item label="街（村）">
				<el-input v-model="form.village" placeholder="请输入街（村）"/>
			</el-form-item>
			<el-form-item label="行政区划代码">
				<el-input v-model="form.regimeCode" placeholder="请输入行政区划代码"/>
			</el-form-item>
			<el-form-item label="所在水资源三级区名称及编码">
				<el-input v-model="form.threeCode" placeholder="请输入所在水资源三级区名称及编码"/>
			</el-form-item>
			<el-form-item label="取水水源类型">
				<el-input v-model="form.type" placeholder="请输入取水水源类型"/>
			</el-form-item>
			<el-form-item label="是否为水库水">
				<el-input v-model="form.isReservoir" placeholder="请输入是否为水库水"/>
			</el-form-item>
			<el-form-item label="工程类型">
				<el-input v-model="form.projectType" placeholder="请输入工程类型"/>
			</el-form-item>
			<el-form-item label="受益行政村数量（个）">
				<el-input v-model="form.benefitVillageNum" placeholder="请输入受益行政村数量（个）"/>
			</el-form-item>
			<el-form-item label="供水方式">
				<el-input v-model="form.drinkWay" placeholder="请输入供水方式"/>
			</el-form-item>
			<el-form-item label="是否有取水许可证">
				<el-input v-model="form.isCertificate" placeholder="请输入是否有取水许可证"/>
			</el-form-item>
			<el-form-item label="取水许可证编号">
				<el-input v-model="form.certificateCode" placeholder="请输入取水许可证编号"/>
			</el-form-item>
			<el-form-item label="是否取得卫生许可">
				<el-input v-model="form.isHealth" placeholder="请输入是否取得卫生许可"/>
			</el-form-item>
			<el-form-item label="卫生许可证编号">
				<el-input v-model="form.healthCode" placeholder="请输入卫生许可证编号"/>
			</el-form-item>
			<el-form-item label="入户前的管网长度（km）">
				<el-input v-model="form.pipeLength" placeholder="请输入入户前的管网长度（km）"/>
			</el-form-item>
			<el-form-item label="配套功率（kw）">
				<el-input v-model="form.power" placeholder="请输入配套功率（kw）"/>
			</el-form-item>
			<el-form-item label="工程建设情况">
				<el-input v-model="form.construction" placeholder="请输入工程建设情况"/>
			</el-form-item>
			<el-form-item label="建成时间（年）">
				<el-input v-model="form.buildedYear" placeholder="请输入建成时间（年）"/>
			</el-form-item>
			<el-form-item label="建成时间（月）">
				<el-input v-model="form.buildedMonth" placeholder="请输入建成时间（月）"/>
			</el-form-item>
			<el-form-item label="开工时间（年）">
				<el-input v-model="form.buildYear" placeholder="请输入开工时间（年）"/>
			</el-form-item>
			<el-form-item label="开工时间（月）">
				<el-input v-model="form.buildMonth" placeholder="请输入开工时间（月）"/>
			</el-form-item>
			<el-form-item label="设计供水规模（立方米/d）">
				<el-input v-model="form.scale" placeholder="请输入设计供水规模（立方米/d）"/>
			</el-form-item>
			<el-form-item label="设计供水人口(人)">
				<el-input v-model="form.planPerson" placeholder="请输入设计供水人口(人)"/>
			</el-form-item>
			<el-form-item label="年实际供水总量（万立方米）">
				<el-input v-model="form.gross" placeholder="请输入年实际供水总量（万立方米）"/>
			</el-form-item>
			<el-form-item label="年实际生活供水量（万立方米）">
				<el-input v-model="form.grossLife" placeholder="请输入年实际生活供水量（万立方米）"/>
			</el-form-item>
			<el-form-item label="年实际生产供水量（万立方米）">
				<el-input v-model="form.grossProduction" placeholder="请输入年实际生产供水量（万立方米）"/>
			</el-form-item>
			<el-form-item label="年实际供水人口 （人）">
				<el-input v-model="form.person" placeholder="请输入年实际供水人口 （人）"/>
			</el-form-item>
			<el-form-item label="水质超标项目">
				<el-input v-model="form.excessiveNum" placeholder="请输入水质超标项目"/>
			</el-form-item>
			<el-form-item label="净水处理">
				<el-input v-model="form.purification" placeholder="请输入净水处理"/>
			</el-form-item>
			<el-form-item label="水质检测设备">
				<el-input v-model="form.detectionEqui" placeholder="请输入水质检测设备"/>
			</el-form-item>
			<el-form-item label="水质检测方式">
				<el-input v-model="form.detectionWay" placeholder="请输入水质检测方式"/>
			</el-form-item>
			<el-form-item label="管理单位名称">
				<el-input v-model="form.mangerName" placeholder="请输入管理单位名称"/>
			</el-form-item>
			<el-form-item label="管理单位代码">
				<el-input v-model="form.mangerCode" placeholder="请输入管理单位代码"/>
			</el-form-item>
			<el-form-item label="管理主体">
				<el-input v-model="form.manger" placeholder="请输入管理主体"/>
			</el-form-item>
			<el-form-item label="收费形式">
				<el-input v-model="form.charge" placeholder="请输入收费形式"/>
			</el-form-item>
			<el-form-item label="计量收费执行居民生活水价（元/立方米）">
				<el-input v-model="form.measureMoney" placeholder="请输入计量收费执行居民生活水价（元/立方米）"/>
			</el-form-item>
			<el-form-item label="计量收费年实收水费（万元）">
				<el-input v-model="form.totalMeasureMoney" placeholder="请输入计量收费年实收水费（万元）"/>
			</el-form-item>
			<el-form-item label="固定收费执行居民生活水价（元/户&middot;月）">
				<el-input v-model="form.fixedMoney" placeholder="请输入固定收费执行居民生活水价（元/户&middot;月）"/>
			</el-form-item>
			<el-form-item label="固定收费年实收水费（万元）">
				<el-input v-model="form.totalFixedMoney" placeholder="请输入固定收费年实收水费（万元）"/>
			</el-form-item>
			<el-form-item label="填表人员">
				<el-input v-model="form.recordMan" placeholder="请输入填表人员"/>
			</el-form-item>
			<el-form-item label="填表联系人电话">
				<el-input v-model="form.recordPhone" placeholder="请输入填表联系人电话"/>
			</el-form-item>
			<el-form-item label="复核人员">
				<el-input v-model="form.reviewMan" placeholder="请输入复核人员"/>
			</el-form-item>
			<el-form-item label="复核人联系电话">
				<el-input v-model="form.reviewPhone" placeholder="请输入复核人联系电话"/>
			</el-form-item>
			<el-form-item label="审查人员">
				<el-input v-model="form.auditMan" placeholder="请输入审查人员"/>
			</el-form-item>
			<el-form-item label="审核标志">
				<el-input v-model="form.auditSymbol" placeholder="请输入审核标志"/>
			</el-form-item>
			<el-form-item label="地区审核">
				<el-input v-model="form.regionAudit" placeholder="请输入地区审核"/>
			</el-form-item>
			<el-form-item label="省级审核">
				<el-input v-model="form.provinceAudit" placeholder="请输入省级审核"/>
			</el-form-item>
			<el-form-item label="中央审核">
				<el-input v-model="form.nationAudit" placeholder="请输入中央审核"/>
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
import { getList,get,save,del } from '@/api/res/agricultural.js'
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
import { getToken } from '@/utils/auth'
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
	uploadaction: process.env.BASE_API+'/api/res/agricultural/import?token='+getToken(),
      query: {
      	total: 0 ,
        pageNo: 1,
        pageSize: 10, 
        search: undefined,
        type: undefined
	  },
	    uploaddata:{
        bizId:10001,
        bizType:"SZ"
      },
	  form: {
	  	name:null,	  	
	  	code:null,	  	
	  	lat:null,	  	
	  	lng:null,	  	
	  	province:null,	  	
	  	region:null,	  	
	  	county:null,	  	
	  	tower:null,	  	
	  	village:null,	  	
	  	regimeCode:null,	  	
	  	threeCode:null,	  	
	  	type:null,	  	
	  	isReservoir:null,	  	
	  	projectType:null,	  	
	  	benefitVillageNum:null,	  	
	  	drinkWay:null,	  	
	  	isCertificate:null,	  	
	  	certificateCode:null,	  	
	  	isHealth:null,	  	
	  	healthCode:null,	  	
	  	pipeLength:null,	  	
	  	power:null,	  	
	  	construction:null,	  	
	  	buildedYear:null,	  	
	  	buildedMonth:null,	  	
	  	buildYear:null,	  	
	  	buildMonth:null,	  	
	  	scale:null,	  	
	  	planPerson:null,	  	
	  	gross:null,	  	
	  	grossLife:null,	  	
	  	grossProduction:null,	  	
	  	person:null,	  	
	  	excessiveNum:null,	  	
	  	purification:null,	  	
	  	detectionEqui:null,	  	
	  	detectionWay:null,	  	
	  	mangerName:null,	  	
	  	mangerCode:null,	  	
	  	manger:null,	  	
	  	charge:null,	  	
	  	measureMoney:null,	  	
	  	totalMeasureMoney:null,	  	
	  	fixedMoney:null,	  	
	  	totalFixedMoney:null,	  	
	  	recordMan:null,	  	
	  	recordPhone:null,	  	
	  	reviewMan:null,	  	
	  	reviewPhone:null,	  	
	  	auditMan:null,	  	
	  	auditSymbol:null,	  	
	  	regionAudit:null,	  	
	  	provinceAudit:null,	  	
	  	nationAudit:null,	  	
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
	beforeUpload(file){ 
		  this.listLoading = true 
 	 },
     handleFilter() {
      this.query.pageNo = 1
      this.getList()
	},
handleSuccess(respone){  
		if(respone.success==true){
			this.$message({
				message: '导入数据成功',
				type: 'success'
        	}); 
		}else{
			this.$message({
				message: respone.msg,
				type: 'error'
        	}); 
		}
		this.query.search = ""
		this.fileList = [];
		this.getList(); 
	},
	handlError(){  
		this.$message({
          message: '导入数据失败',
          type: 'error'
		}); 
		this.query.search = ""
		this.fileList = [];
		this.getList(); 
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
<style>
.upload-demo {
	display: inline-block;
}
</style>
