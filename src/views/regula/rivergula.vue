<template>
  <div class="">
    <el-container v-loading="loading">
      <el-aside style="margin-right: 0;">
        <div class="panel">
          <div class="source panel-body">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="河流" name="HL">
                <el-tree :data="dataArray" :props="defaultProps" @node-click="handleNodeClick" empty-text="暂无数据" highlight-current>
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                      <el-button type="text" class="el-icon-tickets" size="mini" @click="detailClick(data)">
                      </el-button>
                    </span>
                  </span>
                </el-tree>
              </el-tab-pane>
              <el-tab-pane label="湖泊" name="HP">
                <el-tree :data="hpdataarray" :props="defaultProps" @node-click="handleNodeClick" empty-text="暂无数据" highlight-current>
                     <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span>
                          <el-button type="text" class="el-icon-tickets" size="mini" @click="detailClick(data)">
                          </el-button>
                        </span>
                      </span> 
                </el-tree>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-aside>
      <el-container>
        <!--插入地图-->
        <rm-map />
      </el-container>
    </el-container>
    <el-dialog :visible.sync="detailvisible" :title="dialogtitle">
      <el-tabs v-model="activeNamedetail" type="border-card" @tab-click="detailhandleClick">
        <el-tab-pane name="1">
          <span slot="label"><i class="el-icon-date"></i> 基本信息</span>
          <el-form :model="form" abel-width="80px" size="mini">
            <el-form-item label="河流名称">
              {{form.name}}
            </el-form-item>
            <el-form-item label="责任主体">
              {{form.area.name}}
            </el-form-item>
            <el-form-item label="河 长 办">
              {{form.chief}}
            </el-form-item>
            <el-form-item label="描   述">
              {{form.description}}
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label"><i class="el-icon-date"></i> 周边资源</span>

        </el-tab-pane>
        <el-tab-pane name="3">
          <span slot="label"><i class="el-icon-date"></i> 一河一档、一河一策</span>
          <el-upload :action="fileup.uploadaction" :show-file-list="false" :limit="1" accept=".pdf" class="upload-demo" :before-upload="beforeUpload" :data="fileup.uploaddata" :on-success="handleSuccess" :on-error="handlError">
            <el-button class="filter-item" type="primary">点击上传</el-button>
          </el-upload>
          <el-table v-loading="fileup.fileListLoading" :data="fileList" border fit highlight-current-row row-key="id" stripe style="width: 100%">
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="id" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="see(scope.row)" type="text" size="mini" icon="el-icon-edit" />
                <el-button @click="delfile(scope.row)" type="text" size="mini" icon="el-icon-delete" />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="4">
          <span slot="label"><i class="el-icon-date"></i> 管理人员</span>
          <el-table v-loading="areauser.userloadinged" :data="areauser.userlisted" v-show="areauser.tbshow" border fit highlight-current-row row-key="id" stripe style="width: 100%">
            <el-table-column type="index" label="序号" width="100px" />
            <el-table-column prop="userName" label="姓名" />
            <el-table-column prop="post" label="职属" />
            <el-table-column prop="mobile" label="电话" />
          </el-table>
        </el-tab-pane> 
      </el-tabs> 
      <!-- <vue-preview :slides="slide1" @close="handleClose"></vue-preview> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailvisible = false">关 闭</el-button>
      </div>
    </el-dialog> 
  </div>
</template>
<script>
import { tree, getmanagerlist, get } from '@/api/res/river'
import { hptree } from '@/api/res/lake'
import Pagination from '@/components/Pagination'
import RmMap from "@/components/rm/map"
import { getfiles, delfiles, uploadFile } from '@/api/core/file.js'
import { getToken } from '@/utils/auth'
import { getAreausers } from '@/api/core/area'
export default {
  name: "rivergula",
  components: { Pagination, RmMap },
  data() {
    return {
      activeName: "HL",
      loading: true,
      tableLoading: false,
      checked: false,
      dataArray: [],
      hpdataarray: [],
      activeNamedetail: "1",
      dialogtitle: "",
      detailvisible: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      areauser: {
        userlisted: null,
        userloadinged: false,
        userlist: null,
        visible: false,
        form: {
          bizid: null,
          type: this.activeName,
          userids: null
        },
        tbshow: true,
        checkeduser: null,
      },
      fileList: null,
      fileup: {
        uploaddata: {
          bizId: null,
          bizType: "yzyc"
        },
        uploadaction: process.env.BASE_API + '/api/res/sluice/import?token=' + getToken(),
        fileListLoading: null,
      },
      isshowpdf: false,
      form: {
        id: null,
        type: null,
        province: null,
        region: null,
        county: null,
        town: null,
        name: null,
        lng: null,
        lat: null,
        description: null,
        area: {
          id: null,
          name: null
        },
        sort: null,
        river: {
          id: null
        }
      }
    }
  },
  created() {
    this.loadLeftTree()
    this.loadHpTree();
  },
  methods: {
    loadLeftTree() {
      tree().then((res) => {
        console.log("左边树", res)
        const data = res.data.list
        this.dataArray = data
        this.loading = false
      }).catch((errorRes) => {
        this.loading = false
      })
    },
    loadHpTree() {
      hptree().then((res) => {
        console.log("左边树22", res)
        const data = res.data.list
        this.hpdataarray = data
        this.loading = false
      }).catch((errorRes) => {
        this.loading = false
      })
    },
    getfilesLists() {
      getfiles(this.fileup.uploaddata).then(response => {
        this.fileList = response.data;
        this.fileup.fileListLoading = false;
      })
    },
    getriver(idx) {
      this.fileup.uploaddata.bizId = idx;
      get(idx).then(response => {
        this.activeNamedetail = "1";
        this.form = response.data;
        this.detailvisible = true;
      });
      this.getfilesLists();
    },
    handleClick(tab) {
      console.log(tab);
    },
    handleNodeClick() {
      // console.log("tab:::",tab);
    },
    detailClick(node) {
      console.log("node::::", node); 
      this.dialogtitle = node.label + "详情";
      this.getriver(node.id)
    },
    see(row) {
      window.open(row.url);
    },
    delfile(row) {
      this.fileup.fileListLoading = true;
      delfiles({ ids: row.id }).then(response => {
        this.fileList = response.data;
        this.getfilesLists();
      })
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
      this.fileList = [];
      this.getfilesLists();
    },
    handlError() {

    },
    beforeUpload() {
      this.fileup.fileListLoading = true
    },
    getuserlist() {

    },
    findmanagerlist(id) {
      this.areauser.userloadinged = true;
      getmanagerlist({ type: this.activeName, riverid: id }).then(response => {
        this.areauser.userlisted = response.data.list;
        this.areauser.userloadinged = false
      })
    },
    detailhandleClick(tab) {
      if (this.activeNamedetail == '4') {
        this.findmanagerlist(this.form.id);
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.el-button .svg-icon {
  width: 1.2rem;
  height: 1.2rem;
}
.cell .el-button--text:first-of-type .svg-icon {
  fill: #4ecc89;
}
.el-container {
  .el-aside {
    width: 15% !important;
  }
  .el-header,
  .el-main {
    border: 1px solid transparent;
    border-color: #ddd;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    width: 100%;
  }
  .el-header {
    margin-bottom: 1%;
  }
}

.panel {
  margin-bottom: 0;
  min-height: 86vh;
  overflow: auto;
  height: 100%;
  .panelHeading {
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 39px;
    .svg-icon {
      margin: 0 5px;
    }
    .btn-group {
      position: relative;
      // display: inline-block;
      vertical-align: middle;
      float: right;
    }
  }
  .source {
    padding-left: 10px;
    padding-right: 10px;
  }
  .panel-body {
    overflow: auto;
    height: calc(86vh - 41px);
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.panel {
  background-color: #fff;
  border: 1px solid transparent;
  border-color: #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.panelHeading {
  padding: 8px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
</style>
