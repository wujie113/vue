<template>
  <div>
    <div class="filter-container">
      <el-input placeholder="检索排污口名称、编码" v-model="query.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button icon="el-icon-download" type="primary" @click="downloadExcel">下载排污口数据模板</el-button>
      <el-button icon="el-icon-refresh" type="primary" @click="updateData">更新排污口数据</el-button>

    </div>
    <el-table v-loading="listLoading" :data="list" border row-key="id" stripe style="width: 100%">
      <el-table-column prop="name" label="排污口名称" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="code" label="排污口编码" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="lng" label="经度" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="lat" label="纬度" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="province" label="省" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="region" label="地区" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="county" label="县" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="town" label="乡（镇）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="village" label="街（村）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="regimeCode" label="行政区划代码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="threeCode" label="所在水资源三级区名称及编码" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="type" label="排入水域类型" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="reservoirName" label="水库名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="reservoirCode" label="水库编码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="lakeName" label="湖泊名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="lankeCode" label="湖泊编码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="riverName" label="河流名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="riverCode" label="河流编码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="isFunction" label="是否划定水功能区" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="firstType" label="水功能一级区类别" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="firstName" label="水功能一级区名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="secondType" label="水功能二级区类别" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="secondName" label="水功能二级区名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="isApproval" label="是否已登记或取得许可批准" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="approvalNum" label="批准（或登记）的废污水年排放量（万吨）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="approvalYear" label="取得入河湖排污许可(或登记)时间-年" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="approvalMonth" label="取得入河湖排污许可(或登记)时间-月" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="auditLevel" label="审批级别" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="auditDept" label="设置部门" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="approvalY2011" label="2011年入河湖废污水量（万吨）" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="sewageMethod" label="入河湖废污水量数据取得方式" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="sewageSource" label="污水主要来源" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="sewageType" label="污水分类情况" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="isEectric" label="是否为电厂温排水" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="regular" label="排放规律" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="sewageRiver" label="入河湖排污方式" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="sewageName1" label="主要排污单位名称1" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="sewageName2" label="主要排污单位名称2" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="sewageName3" label="主要排污单位名称3" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="recordMan" label="填表人员" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="recordPhone" label="填表联系人电话" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="reviewMan" label="复核人员" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="reviewPhone" label="复核人联系电话" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="auditMan" label="审查人员" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="auditSymbol" label="审核标志" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="regionAudit" label="地区审核" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="provinceAudit" label="省级审核" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="nationAudit" label="中央审核" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="id" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit" />
          <el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="query.total>0" :total="query.total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="v.formhistory" title="历史上传资源文件列表"  width="60%" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false">
      <el-table v-loading="listLoadingHistory" :data="listDate" row-key="id" stripe   border>
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
      <el-form :model="form" abel-width="80px" size="mini" class="leftBox">
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
import { getList, get, save, del, getfiles, delBtn } from "@/api/res/sewage.js";
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
        form: false,
        formhistory: false,
        loading: false,
        formupdate: false
      },
      list: null,
      listDate: null,
      uploadaction:
        process.env.BASE_API + "/api/res/sewage/import?token=" + getToken(),
      query: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        search: undefined,
        type: undefined
      },
      uploaddata: {
        bizId: 10010,
        bizType: "pwk"
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
        town: null,
        village: null,
        regimeCode: null,
        threeCode: null,
        type: null,
        reservoirName: null,
        reservoirCode: null,
        lakeName: null,
        lankeCode: null,
        riverName: null,
        riverCode: null,
        isFunction: null,
        firstType: null,
        firstName: null,
        secondType: null,
        secondName: null,
        isApproval: null,
        approvalNum: null,
        approvalYear: null,
        approvalMonth: null,
        auditLevel: null,
        auditDept: null,
        approvalY2011: null,
        sewageMethod: null,
        sewageSource: null,
        sewageType: null,
        isEectric: null,
        regular: null,
        sewageRiver: null,
        sewageName1: null,
        sewageName2: null,
        sewageName3: null,
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
    getList() {
      this.listLoading = true;
      console.log("this.query::::", this.query);
      getList(this.query).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.query.total = response.data.count;
      });
    },
    downloadExcel() {
      this.v.formhistory = true;
      this.listLoadingHistory = true;
      getfiles(this.uploaddata).then(response => {
        this.listDate = response.data;
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
    handleFilter() {
      this.query.pageNo = 1;
      this.getList();
    },
    create() {
      this.v.form = true;
      this.form = {};
    },
    edit(row) {
      //console.log(JSON.stringify(row));
      this.v.form = true;
      this.form = row;
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
    del(row) {
      //var self = this
      //console.log(row)
      del(row.id).then(response => {
        this.v.form = false;
        if (response.success) {
          this.$message(response.msg);
          //删除列表数据
          const index = this.list.indexOf(row); //找到要删除数据在list中的位置
          this.list.splice(index, 1); //通过splice 删除数据
        } else {
          this.$message({
            message: response.msg,
            type: "warning"
          });
        }
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