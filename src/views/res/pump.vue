<template>
  <div>
    <div class="filter-container">
      <el-input placeholder="检索泵站名称、编码" v-model="listQuery.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>

      <el-button icon="el-icon-download" type="primary" @click="downloadExcel">下载泵站数据模板</el-button>
      <el-button icon="el-icon-refresh" type="primary" @click="updateData">更新泵站数据</el-button>

    </div>
    <el-table  @current-change="handleCurrentChange" v-loading="listLoading" :data="list" border row-key="id" stripe style="width: 100%">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="name" label="泵站名称" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="code" label="泵站编码" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="lng" label="经度" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="lat" label="纬度" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="province" label="省" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="region" label="地区" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="county" label="县" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="town" label="乡（镇）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="village" label="街（村）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="regimeCode" label="行政区划代码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="threeCode" label="所在水资源三级区名称及编码" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="riverName" label="所在河流(湖泊、水库、渠道)名称" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="riverCode" label="所在河流(湖泊、水库、渠道)编码" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="irrigationName" label="所在灌区(引调水工程)名称" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="irrigationCode" label="所在灌区(引调水工程)编码" :show-overflow-tooltip="true" min-width="20px" />
      <el-table-column prop="type" label="泵站类型" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="isBrake" label="是否为闸站工程" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="isSpring" label="是否为引泉工程" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="construction" label="工程建设情况" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="builtEndYear" label="建成时间（年）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="builtEndMonth" label="建成时间（月）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="builtStartYear" label="开工时间（年）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="builtStartMonth" label="开工时间（月）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="projectTask" label="工程任务" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="projectLevel" label="工程等别" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="projectBuildLevel" label="主要建筑物级别" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="traffic" label="装机流量(立方米/秒)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="power" label="装机功率(kW)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="lift" label="设计扬程(m)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="pumpNum" label="水泵数量(台)" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="mangerName" label="泵站管理单位名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="mangerCode" label="泵站管理单位代码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="mangerExportName" label="泵站归口管理部门" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="division" label="是否完成划界" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="confirm" label="是否完成确权" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="recordMan" label="填表人员" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="recordPhone" label="填表联系人电话" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="reviewMan" label="复核人员" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="reviewPhone" label="复核人联系电话" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="auditMan" label="审查人员" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="auditSymbol" label="审核标志" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="regionAudit" label="地区审核" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="provinceAudit" label="省级审核" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="nationAudit" label="中央审核" :show-overflow-tooltip="true" min-width="200px" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="v.formhistory" title="历史上传资源文件列表" width="60%" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false">
      <el-table v-loading="listLoadingHistory" :data="listDate" row-key="id" stripe   border>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="createDate" label="上传时间" width="150" />
        <el-table-column prop="name" label="文件名" width="250" />
        <el-table-column prop="id" label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" title="导出该时间上传资源文件"><a :href="(scope.row.url)">导出</a></el-button>
            <el-button @click="get(scope.row)" type="primary" size="mini" title="资源恢复到该时间上传的文件">恢复</el-button>
            <el-button @click="del(scope.row)" type="primary" size="mini" title="删除该时间上传的文件">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="v.formupdate" title="上传提示" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false" width="30%">
      <el-form :model="form" abel-width="80px" size="mini" class="leftBox">
        <el-form-item label="文件格式要求为：">
          <span style="color:red">.xls</span>(Excel 97-2018工作簿)
        </el-form-item>
        <el-form-item label="文件必需包含字段：">
          名称<br />县名<br />经度（如：113.8569）<br />纬度（如：27.6253）<br />
        </el-form-item>
      </el-form>
      <el-upload :http-request="uploadFile" :action="uploadaction" :show-file-list="false" accept=".xlsx,.xls" class="upload-demo" :before-upload="beforeUpload" :data="uploaddata" :on-success="handleSuccess" :on-error="handlError">
        <el-button type="primary" size="mini">去上传</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template> 
<script>
import Pagination from "@/components/Pagination";
import { getList, getfiles, get, delBtn } from "@/api/res/pump.js";
import RmDict from "@/components/rm/dict";
import RmOrgSelect from "@/components/rm/orgselect";
import RmUserSelect from "@/components/rm/userselect";
import RmAreaSelect from "@/components/rm/areaselect";
import { getToken } from "@/utils/auth";

import { upload } from "@/api/imgUplodFile"
export default {
  components: { Pagination, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      v: {
        formhistory: false,
        loading: false,
        formupdate: false
      },
      visible: false,
      uploaddata: {
        bizId: 10009,
        bizType: "bz"
      },
      listLoading: null,
      listLoadingHistory: null,
      listDate: null,
      form: {
        name: null,
        code: null,
        lat: null,
        lng: null,
        province: null,
        region: null,
        county: null,
        town: null,
        village: null,
        regimeCode: null,
        threeCode: null,
        riverName: null,
        riverCode: null,
        irrigationName: null,
        irrigationCode: null,
        type: null,
        isBrake: null,
        isSpring: null,
        construction: null,
        builtEndYear: null,
        builtEndMonth: null,
        builtStartYear: null,
        builtStartMonth: null,
        projectTask: null,
        projectLevel: null,
        projectBuildLevel: null,
        traffic: null,
        power: null,
        lift: null,
        pumpNum: null,
        mangerName: null,
        mangerCode: null,
        mangerExportName: null,
        division: null,
        confirm: null,
        recordMan: null,
        recordPhone: null,
        reviewMan: null,
        reviewPhone: null,
        auditMan: null,
        auditSymbol: null,
        regionAudit: null,
        provinceAudit: null,
        nationAudit: null
      },
      list: null,
      uploadaction:
        process.env.BASE_API + "/api/res/pump/import?token=" + getToken(),
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        importance: undefined,
        search: undefined,
        type: undefined,
        sort: "+id"
      },
      importanceOptions: [1, 2, 3]
    };
  },
  created() {
    this.getList();
  },
  methods: {
     handleCurrentChange(row){
			console.log(row)
			  this.$emit('clickRow', { id: row.id, gtype: 'bengzhan', name: row.name, lng: row.lng, lat: row.lat })
		},
    getList() {
      this.listLoading = true;
      console.log("this.listQuery::::", this.listQuery);
      getList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.count;
      });
    },
    downloadExcel() {
      this.v.formhistory = true;
      this.listLoadingHistory = true;
      getfiles(this.uploaddata).then(response => {
        this.listDate = response.worldArr;
        this.listLoadingHistory = false;
      });
    },

    updateData() {
      this.v.formupdate = true;
    },

    beforeUpload(file) {
      this.listLoading = true;
      this.v.formupdate = false;
    },
    handleSuccess(respone) {
      if (respone.data.success == true) {
        this.$message({
          message: "导入数据成功",
          type: "success"
        });
      } else {
        this.$message({
          message: respone.msg,
          type: "error"
        });
      }
      this.listQuery.search = "";
      this.getList();
    },
    handlError() {
      this.$message({
        message: "导入数据失败",
        type: "error"
      });
      this.listQuery.search = "";
      this.getList();
    },

    handleFilter() {
      this.listQuery.pageNo = 1;
      this.getList();
    },
    edit(row) {
      //console.log(JSON.stringify(row));
      this.visible = true;
      this.form = row;
    },
    save() {
      //console.log('保存:',JSON.stringify(this.form),this.selectUser);
      this.visible = false;
      //
    },
    del(row) {
      this.listLoadingHistory = true;
      delBtn(row.id).then(response => {
        this.listLoadingHistory = false;
        this.$message({
          message: '删除数据成功',
          type: 'success'
        });
        this.downloadExcel();
      });
    },
    get(row) {
      this.listLoading = true;
      this.v.formhistory = false;
      this.listQuery.search = "";
      get(row.id).then(response => {    
        this.$message({
          message: '恢复数据成功',
          type: 'success'
        });
        this.listLoading = false;
        this.getList();
      });
    },
    uploadFile(options) {
			// :http-request="uploadFile"
			// import { upload } from "@/api/imgUplodFile"   
			return upload(this.uploadaction,options)
		}
  }
};
</script>

<style>
.leftBox .el-form-item__content {
  float: left;
}
</style>
