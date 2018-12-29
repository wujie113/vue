<template>
  <div>
    <div class="filter-container">
      <el-input placeholder="检索农饮工程名称、编码" v-model="query.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button icon="el-icon-download" type="primary" @click="downloadExcel">下载农饮工程数据模板</el-button>
      <el-button icon="el-icon-refresh" type="primary" @click="updateData">更新农饮工程数据</el-button>
    </div>
    <el-table  @current-change="handleCurrentChange" v-loading="listLoading" :data="list" border row-key="id" stripe style="width: 100%" fit>
      <el-table-column prop="name" label="工程名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="code" label="工程编码" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="lng" label="经度" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="lat" label="纬度" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="province" label="省" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="region" label="地区" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="county" label="县" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="tower" label="乡（镇）" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="village" label="街（村）" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="regimeCode" label="行政区划代码" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="threeCode" label="所在水资源三级区名称及编码" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="type" label="取水水源类型" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="isReservoir" label="是否为水库水" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="projectType" label="工程类型" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="benefitVillageNum" label="受益行政村数量（个）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="drinkWay" label="供水方式" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="isCertificate" label="是否有取水许可证" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="certificateCode" label="取水许可证编号" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="isHealth" label="是否取得卫生许可" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="healthCode" label="卫生许可证编号" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="pipeLength" label="入户前的管网长度（km）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="power" label="配套功率（kw）" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="construction" label="工程建设情况" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="buildedYear" label="建成时间（年）" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="buildedMonth" label="建成时间（月）" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="buildYear" label="开工时间（年）" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="buildMonth" label="开工时间（月）" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="scale" label="设计供水规模（立方米/d）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="planPerson" label="设计供水人口(人)" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="gross" label="年实际供水总量（万立方米）" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="grossLife" label="年实际生活供水量（万立方米）" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="grossProduction" label="年实际生产供水量（万立方米）" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="person" label="年实际供水人口 （人）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="excessiveNum" label="水质超标项目" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="purification" label="净水处理" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="detectionEqui" label="水质检测设备" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="detectionWay" label="水质检测方式" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="mangerName" label="管理单位名称" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="mangerCode" label="管理单位代码" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="manger" label="管理主体" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="charge" label="收费形式" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="measureMoney" label="计量收费执行居民生活水价（元/立方米）" :show-overflow-tooltip="true" min-width="300px" />
      <el-table-column prop="totalMeasureMoney" label="计量收费年实收水费（万元）" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="fixedMoney" label="固定收费执行居民生活水价（元/户&middot;月）" :show-overflow-tooltip="true" min-width="350px" />
      <el-table-column prop="totalFixedMoney" label="固定收费年实收水费（万元）" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="recordMan" label="填表人员" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="recordPhone" label="填表联系人电话" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="reviewMan" label="复核人员" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="reviewPhone" label="复核人联系电话" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="auditMan" label="审查人员" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="auditSymbol" label="审核标志" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="regionAudit" label="地区审核" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="provinceAudit" label="省级审核" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="nationAudit" label="中央审核" :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="id" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit" />
          <el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="query.total>0" :total="query.total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="v.formhistory" title="历史上传资源文件列表" width="60%"  :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false">
      <el-table v-loading="listLoadingHistory" :data="listDate" row-key="id" stripe  border>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="CreateDate" label="上传时间" width="150" />
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
      <el-form :model="form"  abel-width="80px" size="mini" class="leftBox">
        <el-form-item label="文件格式要求为：">
          <span style="color:red">.xls</span>(Excel 97-2018工作簿)
        </el-form-item>
        <el-form-item label="文件必需包含字段：">
          名称<br />县名<br />经度（如：113.8569）<br />纬度（如：27.6253）<br />
        </el-form-item>
      </el-form>
      <el-upload :action="uploadaction" :show-file-list="false" :limit="1" accept=".xlsx,.xls" class="upload-demo" :before-upload="beforeUpload" :data="uploaddata" :on-success="handleSuccess" :on-error="handlError">
        <el-button type="primary" size="mini">去上传</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template> 
<script>
import Pagination from "@/components/Pagination";
import {
  getList,
  get,
  save,
  del,
  getfiles,
  delBtn
} from "@/api/res/agricultural.js";
import RmDict from "@/components/rm/dict";
import RmOrgSelect from "@/components/rm/orgselect";
import RmUserSelect from "@/components/rm/userselect";
import RmAreaSelect from "@/components/rm/areaselect";
import { getToken } from "@/utils/auth";
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
      list: null,
      listDate: null,
      uploadaction:
        process.env.BASE_API +
        "/api/res/agricultural/import?token=" +
        getToken(),
      query: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        search: undefined,
        type: undefined
      },
      uploaddata: {
        bizId: 10005,
        bizType: "nygc"
      },
      
      listLoading: null,
      listLoadingHistory: null,
      form: {
        name: null,
        code: null,
        lat: null,
        lng: null,
        province: null,
        region: null,
        county: null,
        tower: null,
        village: null,
        regimeCode: null,
        threeCode: null,
        type: null,
        isReservoir: null,
        projectType: null,
        benefitVillageNum: null,
        drinkWay: null,
        isCertificate: null,
        certificateCode: null,
        isHealth: null,
        healthCode: null,
        pipeLength: null,
        power: null,
        construction: null,
        buildedYear: null,
        buildedMonth: null,
        buildYear: null,
        buildMonth: null,
        scale: null,
        planPerson: null,
        gross: null,
        grossLife: null,
        grossProduction: null,
        person: null,
        excessiveNum: null,
        purification: null,
        detectionEqui: null,
        detectionWay: null,
        mangerName: null,
        mangerCode: null,
        manger: null,
        charge: null,
        measureMoney: null,
        totalMeasureMoney: null,
        fixedMoney: null,
        totalFixedMoney: null,
        recordMan: null,
        recordPhone: null,
        reviewMan: null,
        reviewPhone: null,
        auditMan: null,
        auditSymbol: null,
        regionAudit: null,
        provinceAudit: null,
        nationAudit: null
      }
    };
  },
  created() {
    this.getList();
  },

  methods: {
     handleCurrentChange(row){
			console.log(row)
			  this.$emit('clickRow', { id: row.id, gtype: 'nongyin', name: row.name, lng: row.lng, lat: row.lat })
		},
    getList() {
      this.listLoading = true;
      getList(this.query).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.query.total = response.data.count;
      });
    },
    beforeUpload(file) {
      this.listLoading = true;
      this.v.formupdate = false;
    },
    handleFilter() {
      this.query.pageNo = 1;
      this.getList();
    },
    handleSuccess(respone) {
      if (respone.success == true) {
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
      this.query.search = "";
      this.getList();
    },
    handlError() {
      this.$message({
        message: "导入数据失败",
        type: "error"
      });
      this.query.search = "";
      this.getList();
    },
    get(row) {
      this.listLoading = true;
      this.v.formhistory = false;
      this.query.search = "";
      get(row.id).then(response => {
        this.$message({
          message: '恢复数据成功',
          type: 'success'
        });
        this.listLoading = false;
        this.getList();
      });
    },
    downloadExcel() {
      this.v.formhistory = true;
      this.listLoadingHistory = true;
      getfiles(this.uploaddata).then(response => {
        this.listDate = response.data.list;
        this.listLoadingHistory = false;
      });
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
    updateData() {
      this.v.formupdate = true;
    },

    save() {
      //console.log('保存:',JSON.stringify(this.form),this.selectUser);
      save(this.form).then(response => {
        this.v.form = false;
        if (response.success) {
          this.$message(response.msg);
          //添加到列表中
          this.list.unshift(this.form);
        } else {
          this.$message({
            message: response.msg,
            type: "warning"
          });
        }
      });
    },
    del(row) {
      //var self = this
      //console.log(row)
      // del(row.id).then(response => {
      //   this.v.form = false;
      //   if (response.success) {
      //     this.$message(response.msg);
      //     //删除列表数据
      //     const index = this.list.indexOf(row); //找到要删除数据在list中的位置
      //     this.list.splice(index, 1); //通过splice 删除数据
      //   } else {
      //     this.$message({
      //       message: response.msg,
      //       type: "warning"
      //     });
      //   }
      // });
      delBtn(row.id).then(response => {
        this.listLoadingHistory = false;
        this.$message({
          message: '删除数据成功',
          type: 'success'
        });
        this.downloadExcel();
      });
    }
  }
};
</script>
<style>
.leftBox .el-form-item__content {
  float: left;
}
</style>