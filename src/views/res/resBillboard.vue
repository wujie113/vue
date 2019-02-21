<template>
  <div class="resBillboard">
    <div class="filter-container">
      <el-input
        placeholder="检索公示牌名称、编码"
        v-model="query.search"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        clearable
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>

      <el-button icon="el-icon-download" type="primary" @click="downloadExcel">下载公示牌数据模板</el-button>
      <el-button icon="el-icon-refresh" type="primary" @click="updateData">更新公示牌数据</el-button>
    </div>
    <el-table
      @current-change="handleCurrentChange"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column type="index" label="序号"/>
      <el-table-column label="上传附件">
        <template slot-scope="scope">
          <el-button @click="enclosure(scope.row)" type="success" size="mini">附件</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="公示牌名称" :show-overflow-tooltip="true" min-width="230px"/>
      <el-table-column prop="code" label="公示牌编码" :show-overflow-tooltip="true" min-width="150px"/>
      <el-table-column prop="lng" label="经度" :show-overflow-tooltip="true" min-width="150px"/>
      <el-table-column prop="lat" label="纬度" :show-overflow-tooltip="true" min-width="150px"/>
      <el-table-column prop="province" label="省" :show-overflow-tooltip="true" min-width="150px"/>
      <el-table-column prop="region" label="地区" :show-overflow-tooltip="true" min-width="150px"/>
      <el-table-column prop="county" label="县" :show-overflow-tooltip="true" min-width="150px"/>
      <el-table-column prop="town" label="乡（镇）" :show-overflow-tooltip="true" min-width="150px"/>
      <el-table-column prop="village" label="街（村）" :show-overflow-tooltip="true" min-width="150px"/>
      <el-table-column
        prop="regimeCode"
        label="行政区划代码"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column prop="column1" label="区级河长" :show-overflow-tooltip="true" min-width="400px"/>
      <el-table-column
        prop="column2"
        label="区级河长联系电话"
        :show-overflow-tooltip="true"
        min-width="350px"
      />
      <el-table-column
        prop="column3"
        label="区级副河长"
        :show-overflow-tooltip="true"
        min-width="500px"
      />
      <el-table-column
        prop="column4"
        label="区级副河长联系电话"
        :show-overflow-tooltip="true"
        min-width="400px"
      />
      <el-table-column prop="column5" label="协助单位" :show-overflow-tooltip="true" min-width="300px"/>
      <el-table-column prop="column6" label="街道河长" :show-overflow-tooltip="true" min-width="300px"/>
      <el-table-column
        prop="column7"
        label="街道河长联系电话"
        :show-overflow-tooltip="true"
        min-width="250px"
      />
      <el-table-column
        prop="column8"
        label="街道副河长"
        :show-overflow-tooltip="true"
        min-width="300px"
      />
      <el-table-column
        prop="column9"
        label="街道副河长联系电话"
        :show-overflow-tooltip="true"
        min-width="250px"
      />
      <el-table-column
        prop="column10"
        label="社区河长"
        :show-overflow-tooltip="true"
        min-width="300px"
      />
      <el-table-column
        prop="column11"
        label="社区河长联系电话"
        :show-overflow-tooltip="true"
        min-width="300px  "
      />
      <el-table-column
        prop="column12"
        label="社区副河长"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column
        prop="column13"
        label="社区副河长联系电话"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column
        prop="column14"
        label="河流名称"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column
        prop="column15"
        label="河道起讫点"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column
        prop="column16"
        label="流域面积"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column
        prop="column17"
        label="河道长度"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column
        prop="column18"
        label="管理范围"
        :show-overflow-tooltip="true"
        min-width="250px"
      />
      <el-table-column
        prop="column19"
        label="河长职责"
        :show-overflow-tooltip="true"
        min-width="500px"
      />
      <el-table-column
        prop="column20"
        label="管护目标"
        :show-overflow-tooltip="true"
        min-width="600px"
      />
      <el-table-column
        prop="column21"
        label="监督电话"
        :show-overflow-tooltip="true"
        min-width="400px"
      />
      <el-table-column
        prop="column22"
        label="二级河长单位"
        :show-overflow-tooltip="true"
        min-width="300px"
      />
      <el-table-column
        prop="column23"
        label="辖区河道起讫"
        :show-overflow-tooltip="true"
        min-width="400px"
      />
      <el-table-column
        prop="column24"
        label="三级河段长单位"
        :show-overflow-tooltip="true"
        min-width="300px"
      />
      <el-table-column
        prop="column25"
        label="辖区河段起讫"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column
        prop="column26"
        label="一级河长"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column
        prop="column27"
        label="二级河长"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column prop="column28" label="副河长" :show-overflow-tooltip="true" min-width="150px"/>
      <el-table-column
        prop="column29"
        label="三级河段长"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column
        prop="column30"
        label="管护要求"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column
        prop="column31"
        label="保洁要求"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column
        prop="column32"
        label="黑臭水体基本概况"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column
        prop="column33"
        label="黑臭水体管护单位"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column
        prop="column34"
        label="黑臭水体区级监管单位"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column
        prop="column35"
        label="黑臭水体市级监管单位"
        :show-overflow-tooltip="true"
        min-width="150px"
      />
      <el-table-column prop="column36" label="备注" :show-overflow-tooltip="true" min-width="150px"/>
    </el-table>
    <pagination
      v-show="query.total>0"
      :total="query.total"
      :page.sync="query.pageNo"
      :limit.sync="query.pageSize"
      @pagination="getList"
    />

    <el-dialog
      :visible.sync="v.formhistory"
      title="历史上传资源文件列表"
      width="60%"
      :append-to-body="false"
      :close-on-click-modal="false"
      :modal="false"
      :modal-append-to-body="false"
    >
      <el-table v-loading="listLoadingHistory" :data="listDate" row-key="id" stripe border>
        <el-table-column type="index" label="序号" width="50"/>
        <el-table-column prop="createDate" label="上传时间" width="150"/>
        <el-table-column prop="name" label="文件名" width="250"/>
        <el-table-column prop="id" label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" title="导出该时间上传资源文件">
              <a :href="(scope.row.url)">导出</a>
            </el-button>
            <el-button @click="get(scope.row)" type="primary" size="mini" title="资源恢复到该时间上传的文件">恢复</el-button>
            <el-button @click="del(scope.row)" type="primary" size="mini" title="删除该时间上传的文件">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      :visible.sync="v.formupdate"
      title="上传提示"
      :append-to-body="false"
      :close-on-click-modal="false"
      :modal="false"
      :modal-append-to-body="false"
      width="30%"
    >
      <el-form :model="form" abel-width="80px" size="mini" class="leftBox">
        <el-form-item label="文件格式要求为：">
          <span style="color:red">.xls</span>(Excel 97-2018工作簿)
        </el-form-item>
        <el-form-item label="文件必需包含字段：">名称
          <br>县名
          <br>经度（如：113.8569）
          <br>纬度（如：27.6253）
          <br>
        </el-form-item>
      </el-form>
      <el-upload
      
:http-request="uploadFile"
        :action="uploadaction"
        :show-file-list="false"
        accept=".xlsx, .xls"
        class="upload-demo"
        :before-upload="beforeUpload"
        :data="uploaddata"
        :on-success="handleSuccess"
        :on-error="handlError"
      >
        <el-button type="primary" size="mini">去上传</el-button>
      </el-upload>
    </el-dialog>
    <!--附件详情-->
    <el-dialog
    
      :visible.sync="v.formenclosure"
      v-loading="v.enclosureLoading"
      title="附件详情"
      :append-to-body="false"
      :close-on-click-modal="false"
      :modal="false"
      :modal-append-to-body="false"
      width="30%"
    >
      <el-form>
        <el-form-item label="只能上传：">
          <span style="color:red">png/jpg/gif</span>
          <span>文件</span>
        </el-form-item>
      </el-form>
      <!--上传图片-->
      <el-upload
      :http-request="uploadFile2"
        class="upload-demo"
        style="text-align: left;"
        :multiple="true"
        ref="upload"
        accept=".png, .jpg, .gif"
        :action="uploadaction2"
        :file-list="fileList"
        :auto-upload="true"
        :data="uploaddata2"
        :on-remove="handleRemove"
        :on-preview="handlePreview"
        :before-upload="beforeAvatarUpload"
      >
        <i class="el-icon-ali-icon-test"></i>附件上传
      </el-upload>
      <!-- <div style="text-align: right; margin: 10px">
        <el-button size="mini" type="primary" @click="closeBtn()">关闭</el-button>
      </div> -->
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="visible = false">取 消</el-button> -->
        <el-button @click="closeBtn()" type="primary">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="v.showphotodialog"
      title="查看图片文件"
      :append-to-body="false"
      :close-on-click-modal="false"
      :modal="false"
      :modal-append-to-body="false"
    >
      <img :src="imgUrl" alt width="100%">
      <!-- <div style="text-align: right; margin: 10px">
        <el-button size="mini" type="primary" @click="v.showphotodialog=false">关闭</el-button>
      </div> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="v.showphotodialog = false" type="primary">关 闭</el-button>
        <!-- <el-button @click="save()" type="primary">确 定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template> 
<script> 
import Pagination from '@/components/Pagination'
import { getList, get, delBtn, getphotolist } from '@/api/res/resBillboard.js'
import { getfiles, delfiles } from "@/api/res/river.js"
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
import { getToken } from "@/utils/auth";

import { upload } from "@/api/imgUplodFile"
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
        formupdate: false,
        formenclosure: false,
        enclosureLoading: false,
        showphotodialog: false,
      },
      listLoadingHistory: false,
      listLoading: false,
      listDate: null,
      list: null,
      uploadaction: process.env.BASE_API + "/api/res/resBillboard/import?token=" + getToken(),
      uploadaction2: process.env.BASE_API + "/c/common/fileRecord/uploadFile?token=" + getToken(),
      fileList: [],
      imgUrl: null,
      uploaddata: {
        bizId: 10010,
        bizType: "gsp"
      },
      uploaddata2: {
        bizId: null,
        bizType: "gsp"
      },
      query: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        search: undefined,
        type: undefined
      },
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
        column1: null,
        column2: null,
        column3: null,
        column4: null,
        column5: null,
        column6: null,
        column7: null,
        column8: null,
        column9: null,
        column10: null,
        column11: null,
        column12: null,
        column13: null,
        column14: null,
        column15: null,
        column16: null,
        column17: null,
        column18: null,
        column19: null,
        column20: null,
        column21: null,
        column22: null,
        column23: null,
        column24: null,
        column25: null,
        column26: null,
        column27: null,
        column28: null,
        column29: null,
        column30: null,
        column31: null,
        column32: null,
        column33: null,
        column34: null,
        column35: null,
        column36: null,
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      getList(this.query).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.query.total = response.data.count
      })
    },
    handleCurrentChange(row) {
      this.$emit('clickRow', { id: row.id, gtype: 'gongshipai', name: row.name, lng: row.lng, lat: row.lat })
    },

    enclosure(row) {
      this.fileList = []
      this.uploaddata2 = {
        bizId: row.id,
        bizType: this.uploaddata2.bizType
      }
      this.v.formenclosure = true
      this.enclosureLoading = true
      getphotolist(this.uploaddata2).then(response => {
        this.enclosureLoading = false
        this.fileList = response.mapArr
        console.log("file", this.fileList)
      })

    },

    // 下载历史模板
    downloadExcel() {
      this.v.formhistory = true;
      this.listLoadingHistory = true;
      getfiles(this.uploaddata).then(response => {
        this.listDate = response.worldArr;
        this.listLoadingHistory = false;
      });
    },
    //更新资源数据
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
        this.listLoading = false;
      } else {
        this.$message({
          message: respone.msg,
          type: "error"
        });
        this.listLoading = false;
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
      this.query.pageNo = 1
      this.getList()
    },
    create() {
      this.v.form = true
      this.form = {}
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
    handleRemove(file, fileList) {
      console.log("----=====", file)
      delfiles({ id: file.id }).then((res) => {
        this.$message({
          message: '已删除',
          type: 'success'
        });
      })
    },
    handlePreview(file) {
      console.log("file", file.url)
      this.v.showphotodialog = true
      this.imgUrl = ""
      this.$nextTick(() => {
        this.imgUrl = file.url
      })
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error('上传图片只能是 JPG 格式!');
      // } 
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    closeBtn() {
      this.fileList = []
      this.v.formenclosure = false
    },
    uploadFile(options) {
			// :http-request="uploadFile"
			// import { upload } from "@/api/imgUplodFile"   
			return upload(this.uploadaction,options)
    },
    uploadFile2(options) {
			// :http-request="uploadFile"
			// import { upload } from "@/api/imgUplodFile"   
			return upload(this.uploadaction2,options)
		}

  }
}
</script>
<style lang="scss" scoped>
.resBillboard {
  /deep/ .el-dialog__body {
    max-height: 29em;
  }
}
</style>
