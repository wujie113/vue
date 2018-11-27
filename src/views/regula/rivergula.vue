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
                      <el-button type="text" class="el-icon-tickets" size="mini" @click.stop="detailClick(data)"/>  
                    </span>
                  </span>
                </el-tree>
              </el-tab-pane>
              <el-tab-pane label="湖泊" name="HP">
                <el-tree :data="hpdataarray" :props="defaultProps" @node-click="handleNodeClick" empty-text="暂无数据" highlight-current>
                     <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span>
                          <el-button type="text" class="el-icon-tickets" size="mini" @click="detailClick(data)"></el-button>
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
        <rm-map   v-model="map"/>
      </el-container>
    </el-container> 
     <Layer :title="dialogtitle" v-model="showLayer2"   :dialog="false" class="layer-1" width="800" :animation="2" :maskLayer="false" :shade= "false"
        height="600" confirm="确定" cancel="取消"> 
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
            <keep-alive>
                <div>
                      <div class="filter-container duty" >  
                          <el-select v-model="geo.listQuery.distance" clearable placeholder="查询半径"  style="width: 90px" class="filter-item">
                          <el-option v-for="item in geo.options" :key="item.key" :label="item.label" :value="item.key" />
                          </el-select>
                           <el-button class="filter-item" type="primary" icon="el-icon-search" @click="geohandleFilter">查询</el-button> 
                        </div>
                        <el-table v-loading="geo.geoListLoading" :data="geo.geometryList" border fit highlight-current-row row-key="id" stripe style="width: 100%">
                          <el-table-column type="index" label="序号" width="80" />
                          <el-table-column prop="name" label="资源类型名称" />
                          <el-table-column prop="num" label="数量" width="100"/>  
                        </el-table>
                </div> 
            </keep-alive>  
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
    </Layer>  
    <el-dialog :visible.sync="detailvisible" :title="dialogtitle">
      
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
import { getgeometryList } from '@/api/res/geometry'
import Layer from '@/components/layer'


export default {
  name: "rivergula",
  components: { Pagination, RmMap },
  data() {
    return {
      map:null,
      activeName: "HL",
      loading: true,
      tableLoading: false,
      checked: false,
      dataArray: [],
      hpdataarray: [],
      activeNamedetail: "1",
      dialogtitle: "",
      detailvisible: false,
      showLayer2:false,
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
      geo:{
         geometryList:null,
         geoListLoading:false,
         listQuery:{
           distance:'200',
           lat:1,
           lng:2
         },
         options: [{ label: '200米', key: '200' }, { label: '500米', key: '500' }, { label: '1千米', key: '1000' }, { label: '2千米', key: '2000' }, { label: '5千米', key: '5000' }],
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
    /***map相关方法 */
    centerView(data) {
        // console.log(data);
        if(data.lng==undefined ||data.lng==undefined)return;
        this.map.centerView([data.lng, data.lat],16)
    },
    /***map相关方法 end */
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
    showline(data){
      console.log(data);
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
        //this.detailvisible = true;
        this.showLayer2=true;
      });
      this.getfilesLists();
    },
    handleClick(tab) {
      console.log(tab);
    },
    handleNodeClick(data) {
       this.centerView(data);
    },
    
    detailClick(node) {
      console.log("node::::", node); 
      this.dialogtitle = node.label + "详情";
      this.getriver(node.id)
    },
    detailClick2(node) {
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
    geohandleFilter(){
        console.log(this.geo.listQuery);
        this.geo.listQuery.lat=this.form.lat;
        this.geo.listQuery.lng=this.form.lng;
         this.geo.geoListLoading=true;
         console.log("33::",this.geo.listQuery)
        getgeometryList(this.geo.listQuery).then(response => {
        this.geo.geometryList=response.data.list;
        this.geo.geoListLoading=false;
      })
    }, 
    findmanagerlist(id) {
      this.areauser.userloadinged = true;
      getmanagerlist({ type: this.activeName, bizid: id }).then(response => {
        this.areauser.userlisted = response.data.list;
        this.areauser.userloadinged = false
      })
    },
    detailhandleClick(tab) {
      if (this.activeNamedetail == '4') {
        this.findmanagerlist(this.form.id);
      }
      if (this.activeNamedetail == '2') {
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
