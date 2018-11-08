<template>
  <div class="app-container">
    <div class="filter-container"> 
       <el-input placeholder="检索堤防名称、编码" v-model="query.search" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter"/>
       <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
       <el-upload :action="uploadaction"  :show-file-list="false" :limit="1" accept=".xlsx,.xls" class="upload-demo"
              :before-upload="beforeUpload"  :file-list="fileList"
				:data="uploaddata"   :on-success="handleSuccess"   :on-error="handlError">
				<el-button  class="filter-item"  type="primary">点击上传</el-button> 
		</el-upload>
    </div>
      <el-table :data="list" row-key="id"  stripe style="width: 100%">
                <el-table-column prop="name" label="堤防名称"/>
        <el-table-column prop="code" label="堤防编码"/>
        <el-table-column prop="startLng" label="起点坐标经度"/>
        <el-table-column prop="startLat" label="起点坐标纬度"/>
        <el-table-column prop="endLng" label="终点坐标经度"/>
        <el-table-column prop="endLat" label="终点坐标纬度"/>
        <el-table-column prop="startProvince" label="起点位置 省"/>
        <el-table-column prop="startRegion" label="起点位置 地区"/>
        <el-table-column prop="startCounty" label="起点位置 县"/>
        <el-table-column prop="startTower" label="起点位置 乡（镇）"/>
        <el-table-column prop="startVillage" label="起点位置 街（村）"/>
        <el-table-column prop="startRegimeCode" label="起点 行政区划代码"/>
        <el-table-column prop="endProvince" label="终点位置 省"/>
        <el-table-column prop="endRegion" label="终点位置 地区"/>
        <el-table-column prop="endCounty" label="终点位置 县"/>
        <el-table-column prop="endTown" label="终点位置 乡"/>
        <el-table-column prop="endVillage" label="终点位置 村"/>
        <el-table-column prop="endRegimeCode" label="终点 行政区划代码"/>
        <el-table-column prop="riverName" label="所在河流(湖泊、海岸)名称"/>
        <el-table-column prop="riverCode" label="所在河流(湖泊、海岸)编码"/>
        <el-table-column prop="riverType" label="河流岸别"/>
        <el-table-column prop="crossover" label="堤防跨界情况"/>
        <el-table-column prop="category" label="堤防类型"/>
        <el-table-column prop="method" label="堤防型式"/>
        <el-table-column prop="bulid" label="工程建设情况"/>
        <el-table-column prop="buildedYear" label="建成时间（年）"/>
        <el-table-column prop="buildedMonth" label="建成时间（月）"/>
        <el-table-column prop="buildYear" label="开工时间（年）"/>
        <el-table-column prop="buildMonth" label="开工时间（月）"/>
        <el-table-column prop="projectTask" label="工程任务"/>
        <el-table-column prop="level" label="堤防级别"/>
        <el-table-column prop="planYear" label="规划防洪(潮)标准［重现期］（年）"/>
        <el-table-column prop="length" label="堤防长度(m)"/>
        <el-table-column prop="achieveLength" label="达到规划防洪（潮）标准的长度(m)"/>
        <el-table-column prop="elevation" label="高程系统"/>
        <el-table-column prop="startElevation" label="堤顶高程（起点高程(m)）"/>
        <el-table-column prop="endElevation" label="堤顶高程（终点高程(m)）"/>
        <el-table-column prop="water" label="设计水（高潮）位(m)"/>
        <el-table-column prop="heightMax" label="堤防高度(m)（最大值）"/>
        <el-table-column prop="heightMin" label="堤防高度(m)（最小值）"/>
        <el-table-column prop="widthMax" label="堤顶宽度(m)（最大值）"/>
        <el-table-column prop="widthMin" label="堤顶宽度(m)（最小值）"/>
        <el-table-column prop="lockNum" label="水闸数量(个)"/>
        <el-table-column prop="tubeNum" label="管涵数量(个)"/>
        <el-table-column prop="pumpNum" label="泵站数量(处)"/>
        <el-table-column prop="siphonNum" label="倒虹吸数量(个)"/>
        <el-table-column prop="mangerName" label="堤防工程管理单位名称"/>
        <el-table-column prop="mangerCode" label="堤防工程管理单位编码"/>
        <el-table-column prop="underManger" label="堤防工程归口管理部门"/>
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
			<el-form-item label="堤防名称">
				<el-input v-model="form.name" placeholder="请输入堤防名称"/>
			</el-form-item>
			<el-form-item label="堤防编码">
				<el-input v-model="form.code" placeholder="请输入堤防编码"/>
			</el-form-item>
			<el-form-item label="起点坐标经度">
				<el-input v-model="form.startLng" placeholder="请输入起点坐标经度"/>
			</el-form-item>
			<el-form-item label="起点坐标纬度">
				<el-input v-model="form.startLat" placeholder="请输入起点坐标纬度"/>
			</el-form-item>
			<el-form-item label="终点坐标经度">
				<el-input v-model="form.endLng" placeholder="请输入终点坐标经度"/>
			</el-form-item>
			<el-form-item label="终点坐标纬度">
				<el-input v-model="form.endLat" placeholder="请输入终点坐标纬度"/>
			</el-form-item>
			<el-form-item label="起点位置 省">
				<el-input v-model="form.startProvince" placeholder="请输入起点位置 省"/>
			</el-form-item>
			<el-form-item label="起点位置 地区">
				<el-input v-model="form.startRegion" placeholder="请输入起点位置 地区"/>
			</el-form-item>
			<el-form-item label="起点位置 县">
				<el-input v-model="form.startCounty" placeholder="请输入起点位置 县"/>
			</el-form-item>
			<el-form-item label="起点位置 乡（镇）">
				<el-input v-model="form.startTower" placeholder="请输入起点位置 乡（镇）"/>
			</el-form-item>
			<el-form-item label="起点位置 街（村）">
				<el-input v-model="form.startVillage" placeholder="请输入起点位置 街（村）"/>
			</el-form-item>
			<el-form-item label="起点 行政区划代码">
				<el-input v-model="form.startRegimeCode" placeholder="请输入起点 行政区划代码"/>
			</el-form-item>
			<el-form-item label="终点位置 省">
				<el-input v-model="form.endProvince" placeholder="请输入终点位置 省"/>
			</el-form-item>
			<el-form-item label="终点位置 地区">
				<el-input v-model="form.endRegion" placeholder="请输入终点位置 地区"/>
			</el-form-item>
			<el-form-item label="终点位置 县">
				<el-input v-model="form.endCounty" placeholder="请输入终点位置 县"/>
			</el-form-item>
			<el-form-item label="终点位置 乡">
				<el-input v-model="form.endTown" placeholder="请输入终点位置 乡"/>
			</el-form-item>
			<el-form-item label="终点位置 村">
				<el-input v-model="form.endVillage" placeholder="请输入终点位置 村"/>
			</el-form-item>
			<el-form-item label="终点 行政区划代码">
				<el-input v-model="form.endRegimeCode" placeholder="请输入终点 行政区划代码"/>
			</el-form-item>
			<el-form-item label="所在河流(湖泊、海岸)名称">
				<el-input v-model="form.riverName" placeholder="请输入所在河流(湖泊、海岸)名称"/>
			</el-form-item>
			<el-form-item label="所在河流(湖泊、海岸)编码">
				<el-input v-model="form.riverCode" placeholder="请输入所在河流(湖泊、海岸)编码"/>
			</el-form-item>
			<el-form-item label="河流岸别">
				<el-input v-model="form.riverType" placeholder="请输入河流岸别"/>
			</el-form-item>
			<el-form-item label="堤防跨界情况">
				<el-input v-model="form.crossover" placeholder="请输入堤防跨界情况"/>
			</el-form-item>
			<el-form-item label="堤防类型">
				<el-input v-model="form.category" placeholder="请输入堤防类型"/>
			</el-form-item>
			<el-form-item label="堤防型式">
				<el-input v-model="form.method" placeholder="请输入堤防型式"/>
			</el-form-item>
			<el-form-item label="工程建设情况">
				<el-input v-model="form.bulid" placeholder="请输入工程建设情况"/>
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
			<el-form-item label="工程任务">
				<el-input v-model="form.projectTask" placeholder="请输入工程任务"/>
			</el-form-item>
			<el-form-item label="堤防级别">
				<el-input v-model="form.level" placeholder="请输入堤防级别"/>
			</el-form-item>
			<el-form-item label="规划防洪(潮)标准［重现期］（年）">
				<el-input v-model="form.planYear" placeholder="请输入规划防洪(潮)标准［重现期］（年）"/>
			</el-form-item>
			<el-form-item label="堤防长度(m)">
				<el-input v-model="form.length" placeholder="请输入堤防长度(m)"/>
			</el-form-item>
			<el-form-item label="达到规划防洪（潮）标准的长度(m)">
				<el-input v-model="form.achieveLength" placeholder="请输入达到规划防洪（潮）标准的长度(m)"/>
			</el-form-item>
			<el-form-item label="高程系统">
				<el-input v-model="form.elevation" placeholder="请输入高程系统"/>
			</el-form-item>
			<el-form-item label="堤顶高程（起点高程(m)）">
				<el-input v-model="form.startElevation" placeholder="请输入堤顶高程（起点高程(m)）"/>
			</el-form-item>
			<el-form-item label="堤顶高程（终点高程(m)）">
				<el-input v-model="form.endElevation" placeholder="请输入堤顶高程（终点高程(m)）"/>
			</el-form-item>
			<el-form-item label="设计水（高潮）位(m)">
				<el-input v-model="form.water" placeholder="请输入设计水（高潮）位(m)"/>
			</el-form-item>
			<el-form-item label="堤防高度(m)（最大值）">
				<el-input v-model="form.heightMax" placeholder="请输入堤防高度(m)（最大值）"/>
			</el-form-item>
			<el-form-item label="堤防高度(m)（最小值）">
				<el-input v-model="form.heightMin" placeholder="请输入堤防高度(m)（最小值）"/>
			</el-form-item>
			<el-form-item label="堤顶宽度(m)（最大值）">
				<el-input v-model="form.widthMax" placeholder="请输入堤顶宽度(m)（最大值）"/>
			</el-form-item>
			<el-form-item label="堤顶宽度(m)（最小值）">
				<el-input v-model="form.widthMin" placeholder="请输入堤顶宽度(m)（最小值）"/>
			</el-form-item>
			<el-form-item label="水闸数量(个)">
				<el-input v-model="form.lockNum" placeholder="请输入水闸数量(个)"/>
			</el-form-item>
			<el-form-item label="管涵数量(个)">
				<el-input v-model="form.tubeNum" placeholder="请输入管涵数量(个)"/>
			</el-form-item>
			<el-form-item label="泵站数量(处)">
				<el-input v-model="form.pumpNum" placeholder="请输入泵站数量(处)"/>
			</el-form-item>
			<el-form-item label="倒虹吸数量(个)">
				<el-input v-model="form.siphonNum" placeholder="请输入倒虹吸数量(个)"/>
			</el-form-item>
			<el-form-item label="堤防工程管理单位名称">
				<el-input v-model="form.mangerName" placeholder="请输入堤防工程管理单位名称"/>
			</el-form-item>
			<el-form-item label="堤防工程管理单位编码">
				<el-input v-model="form.mangerCode" placeholder="请输入堤防工程管理单位编码"/>
			</el-form-item>
			<el-form-item label="堤防工程归口管理部门">
				<el-input v-model="form.underManger" placeholder="请输入堤防工程归口管理部门"/>
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
import { getList,get,save,del } from '@/api/res/riverWall.js'
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
				uploadaction: process.env.BASE_API+'/api/res/riverWall/import?token='+getToken(),
      list:  null,      
      query: {
      	total: 0 ,
        pageNo: 1,
        pageSize: 10, 
        search: undefined,
        type: undefined
			} ,
			 fileList:[],
			 uploaddata:{
        bizId:10001,
        bizType:"SZ"
      },
	  form: {
	  	name:null,	  	
	  	code:null,	  	
	  	startLng:null,	  	
	  	startLat:null,	  	
	  	endLng:null,	  	
	  	endLat:null,	  	
	  	startProvince:null,	  	
	  	startRegion:null,	  	
	  	startCounty:null,	  	
	  	startTower:null,	  	
	  	startVillage:null,	  	
	  	startRegimeCode:null,	  	
	  	endProvince:null,	  	
	  	endRegion:null,	  	
	  	endCounty:null,	  	
	  	endTown:null,	  	
	  	endVillage:null,	  	
	  	endRegimeCode:null,	  	
	  	riverName:null,	  	
	  	riverCode:null,	  	
	  	riverType:null,	  	
	  	crossover:null,	  	
	  	category:null,	  	
	  	method:null,	  	
	  	bulid:null,	  	
	  	buildedYear:null,	  	
	  	buildedMonth:null,	  	
	  	buildYear:null,	  	
	  	buildMonth:null,	  	
	  	projectTask:null,	  	
	  	level:null,	  	
	  	planYear:null,	  	
	  	length:null,	  	
	  	achieveLength:null,	  	
	  	elevation:null,	  	
	  	startElevation:null,	  	
	  	endElevation:null,	  	
	  	water:null,	  	
	  	heightMax:null,	  	
	  	heightMin:null,	  	
	  	widthMax:null,	  	
	  	widthMin:null,	  	
	  	lockNum:null,	  	
	  	tubeNum:null,	  	
	  	pumpNum:null,	  	
	  	siphonNum:null,	  	
	  	mangerName:null,	  	
	  	mangerCode:null,	  	
	  	underManger:null,	  	
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
upload-demo

	<style <style lang="scss" scoped>
	.upload-demo {
		display: inline-block;
	}
	</style>