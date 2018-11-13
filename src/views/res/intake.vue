<template>
  <div>
    <div class="filter-container">
      <el-input placeholder="检索取水口名称、编码" v-model="listQuery.search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button icon="el-icon-download" type="primary" @click="downloadExcel">下载取水口数据模板</el-button>
      <el-button icon="el-icon-refresh" type="primary" @click="updateData">更新取水口数据</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border row-key="id" stripe style="width: 100%">
      <el-table-column prop="name" label="取水口名称" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="code" label="取水口编码" :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="lat" label="经度" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="lng" label="纬度" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="province" label="省" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="region" label="地区" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="county" label="县" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="town" label="乡（镇）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="village" label="街（村）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="regimeCode" label="行政区划代码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="postion" label="取水口位置" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="waterNameCode" label="所在水资源三级区名称及编码" :show-overflow-tooltip="true" min-width="250px" />
      <el-table-column prop="getMethod" label="取水方式" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="lockName" label="水闸名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="lockCode" label="水闸编码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="pumpName" label="泵站名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="pumpCode" label="泵站编码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="isGetWater" label="是否为引(调)水工程取水口" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="citeName" label="引调水工程名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="citeCode" label="引调水工程编码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="isOrigin" label="是否位于地表水水源地" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="originName" label="水源地名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="originCode" label="水源地编码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="originType" label="水源类型" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="lakeName" label="湖（水库）名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="lakeCode" label="湖（水库）编码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="riverName" label="河流名称" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="riverCode" label="河流编码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="flow" label="取水流量（立方米/秒）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="getFlow" label="年最大取水量（万立方米）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="flowUse" label="主要取水用途" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="flowY2011" label="2011年取水量（万立方米）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="flowRepeat" label="取水量重复系数" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="flowMethod" label="取水量取得方式" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="personNum" label="供水人口（万人）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="area" label="灌溉面积（万亩）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="dept" label="单位名称（个人）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="deptCode" label="单位代码" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="industry" label="所属行业" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="isFlow" label="有无取水许可证" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="flowCode" label="取水许可证编号" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="flowNum" label="许可取水量（万立方米/年）" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="approveDept" label="取水许可审批单位" :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="supervision" label="取水许可监督管理机关" :show-overflow-tooltip="true" min-width="200px" />
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="v.formhistory" title="历史上传资源文件列表" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false">
      <el-table v-loading="listLoadingHistory" :data="listDate" row-key="id" stripe width="90%" border>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="CreateDate" label="上传时间" width="150" />
        <el-table-column prop="name" label="文件名" width="250" />
        <el-table-column prop="id" label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" title="导出该时间上传资源文件"><a :href="(scope.row.url)">导出</a></el-button>
            <el-button type="primary" size="mini" title="资源恢复到该时间上传的文件">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :visible.sync="v.formupdate" title="上传提示" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false">
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
import Pagination from '@/components/Pagination'
import { getList, getfiles } from '@/api/res/intake.js'
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
import { getToken } from '@/utils/auth'
export default {
  components: { Pagination, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect },
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
        formhistory: false,
        loading: false,
        formupdate: false
      },
      visible: false,
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
        postion: null,
        waterNameCode: null,
        getMethod: null,
        lockName: null,
        lockCode: null,
        pumpName: null,
        pumpCode: null,
        isGetWater: null,
        citeName: null,
        citeCode: null,
        isOrigin: null,
        originName: null,
        originCode: null,
        originType: null,
        lakeName: null,
        lakeCode: null,
        riverName: null,
        riverCode: null,
        flow: null,
        getFlow: null,
        flowUse: null,
        flowY2011: null,
        flowRepeat: null,
        flowMethod: null,
        personNum: null,
        area: null,
        dept: null,
        deptCode: null,
        industry: null,
        isFlow: null,
        flowCode: null,
        flowNum: null,
        approveDept: null,
        supervision: null,
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
      uploadaction: process.env.BASE_API + '/api/res/intake/import?token=' + getToken(),
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        importance: undefined,
        search: undefined,
        type: undefined,
        sort: '+id'
      },
      uploaddata: {
        bizId: 10007,
        bizType: "qsk"
      },
      importanceOptions: [1, 2, 3]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log("this.listQuery::::", this.listQuery)
      getList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.count
      })
    },
    downloadExcel() {
      this.v.formhistory = true
      this.listLoadingHistory = true
      getfiles(this.uploaddata).then(response => {
        this.listDate = response.data;
        this.listLoadingHistory = false
      })
    },

    updateData() {
      this.v.formupdate = true
    },
    beforeUpload(file) {
      this.listLoading = true
      this.v.formupdate = false
    },
    handleSuccess(respone) {
      if (respone.success == true) {
        this.$message({
          message: '导入数据成功',
          type: 'success'
        });
      } else {
        this.$message({
          message: respone.msg,
          type: 'error'
        });
      }
      this.listQuery.search = ""
      this.getList();
    },
    handlError() {
      this.$message({
        message: '导入数据失败',
        type: 'error'
      });
      this.listQuery.search = ""
      this.getList();
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    edit(row) {
      //console.log(JSON.stringify(row));
      this.visible = true
      this.form = row
    },
    save() {
      //console.log('保存:',JSON.stringify(this.form),this.selectUser);
      this.visible = false
      //
    },
    del(row) {
      var self = this
      //console.log(row); 
    }
  }
}
</script>
<style>
.leftBox .el-form-item__content {
  float: left;
}
</style>
