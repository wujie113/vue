<template>
  <div class="app-container">
    <el-container v-loading="listLoading">
     <el-aside>
        <div class="panel">
          <div class="panelHeading">
            <div>
              单位
            </div>
            <div>
              <el-checkbox v-model="checked" @change="onlyShowSelectBtn()">仅显示所选单位</el-checkbox>
            </div>
          </div>
          <div class="source panel-body">
            <el-tree :data="dataArray" :props="defaultProps" @node-click="handleNodeClick" empty-text="暂无数据" highlight-current></el-tree>
          </div>
        </div>
      </el-aside>


      <el-container>
        <el-header height="125px">
          <div style="" class="topTitle">
            上报列表
          </div>
          <div class="filter-container">
             <div  v-if="marks" style="display: inline-block;">
            <el-input placeholder="请输入标题" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <rm-dict class="filter-item" title="请选择类型" placeholder="请选择类型" type="reportType" v-model="listQuery.type" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            </div>
              <el-button
                class="filter-item"
                type="primary"
                :icon="isMapShow ? 'el-icon-menu' : 'el-icon-location'"
                @click="changeMap"
              >切换到{{ isMapShow ? '列表':'地图' }}视图</el-button>
          </div>
            
        </el-header>

        <el-main>
          <div class="widget-divBox" v-show="!isMapShow">
            <!-- 暂无数据的提示 -->
            <div class="noData-divBox" v-show="list.length <= 0">
              <div>
                <img src="../../../static/img/empty.png" alt="无数据记录">
                <p>无数据记录</p>
              </div>
            </div>
            <div class="widget-div" v-for="(report, index) in list" :key="index">
              <div class="widget-divContent clearfix">
                <div class="widget-divContent-main">
                  <div class="widget-divContent-main-title">
                    <span>
                        {{ report.title }}
                    </span>
                    <span>
                      {{ report.reportTime }}
                    </span>
                  </div>
                   <span>
                      {{ report.content }}                      
                    </span>
                   <div class="widget-divContent-main-imgs clearfix">
                    <ul class="widget-divContent-main-imgsGroup clearfix">
                      <li class="" v-for="(img, index) in report.pictureUrls" :key="index">
                          <viewer :images="report.pictureUrls">
                          <img :src="img" :key="index">
                        </viewer>    
                        
                      </li>
                    </ul>
                  </div> 
                  <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="15" :lg="17" :xl="18" class="hidden-sm-and-down">
                      <div class="grid-content bg-purple"> 
                        <span>
                          <a href="javascript:void(0)" title="上报人">
                            <svg-icon icon-class="user1" />
                          </a>
                          {{ report.userName }}
                        </span>
                        <span>
                          <a href="javascript:void(0)" title="上报类型">
                            <svg-icon icon-class="user1" />
                          </a>
                          {{ report.typeLabel }}
                        </span>
                        <span>
                          <a href="javascript:void(0)" title="所属区划">
                            <svg-icon icon-class="areaColor" />
                          </a>
                          {{ report.officeName }}
                        </span>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="9" :lg="7" :xl="6">
                      <div class="grid-content bg-purple-light">
                        <a href="javascript:void(0)" title="生成工单" @click="report.protaskId != null&&report.protaskId!='' ? null : addOrder(report.id)">
                          <svg-icon :icon-class="report.protaskId != null&&report.protaskId!='' ? 'addLightColor' : 'addColor'" />
                        </a>
                        <a href="javascript:void(0)" title="定位" @click="showFeature(report.id,'tousu',report.lng,report.lat)">
                          <svg-icon icon-class="locationColor" /> 
                        </a>
                        <a href="javascript:void(0)" title="详情" @click="detailBtn(report.id)">


                          <svg-icon icon-class="detailColor" />
                        </a><!--
                        <a href="javascript:void(0)" title="修改" @click="edit(list)">
                          <svg-icon icon-class="replayColor" />
                        </a> -->
                        <a href="javascript:void(0)" title="删除" @click="del(report)">
                          <svg-icon icon-class="deleteColor" />
                        </a>
                      </div>
                    </el-col>
                  </el-row> 
                </div>
              </div>
            </div>
             <pagination  v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
          </div>
          <div class="mapBox" v-if="isMapShow">
            <rm-map v-model="map" :clientHeight="clientHeight" />
          </div>
         </el-main>
      </el-container>
    </el-container>
    
  <!-- 工单弹窗 -->
          <el-dialog :visible.sync="visibleOrder" title="生成工单" :modal-append-to-body="false">
               <el-form ref="proTaskFrom" :model="proTaskFrom" abel-width="80px" size="mini">
             
           <!--    <el-form-item prop="area" label="所属区划">
                <rm-area-select v-model="proTaskFrom.area" />
              </el-form-item> -->
              <el-form-item label="接单单位">                                
                   <el-select v-model="proTaskFrom.dept" placeholder="请选择单位" clearable class="filter-item">
                      <el-option v-for="item in lowerofficeList" :key="item.id" :label="item.label" :value="item.id" />
                  </el-select>
              </el-form-item>
              
              <el-form-item label="相关部门">
                  <el-select v-model="proTaskFrom.unit" placeholder="请选择部门" clearable class="filter-item">
                      <el-option v-for="item in synergOfficeList" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
              </el-form-item>

              <el-form-item label="办结时间">
                 <el-date-picker v-model="proTaskFrom.handleTime" type="date" placeholder="Pick a date" style="width: 100%;"/>
              </el-form-item>
              <el-form-item label="问题描述">
                 <el-input v-model="proTaskFrom.description" />
              </el-form-item>
              <el-form-item label="任务描述">
                 <el-input v-model="proTaskFrom.taskcontent" />
              </el-form-item>
            </el-form> 
             <el-upload :action="doUpload" list-type="picture-card" :auto-upload="false" :on-preview="handlePictureCardPreview" accept="" ref="upload" :file-list="fileList" :before-remove="removefile" :data="uploaddata" :on-success="handleSuccess" :on-remove="handleRemove" class="elUpload">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button @click="visibleOrder = false">取 消</el-button>
            <el-button @click="save()" type="primary">确 定</el-button>
          </div>
          </el-dialog>
 <!-- 工单弹窗  end-->

  <!-- 详情弹窗 -->
          <el-dialog :visible.sync="visible" title="上报详情" :modal-append-to-body="false">
            <el-form :model="form" abel-width="80px" size="mini">
              <el-form-item label="上报内容">
                {{form.content}}
              </el-form-item>
              <el-form-item label="事件类型">
                {{form.typeLabel}}
              </el-form-item>
              <el-form-item label="上 报 人">
                {{form.userName}}
              </el-form-item> 
              <el-form-item label="上报时间"> 
                {{form.reportTime}}
              </el-form-item>
              <el-form-item label="处理状态">
                <span :class="[ form.auditStatus == '未处理' ? 'unHandle' : 'handling' ]">
                  {{form.auditStatus}} 
                </span> 
              </el-form-item>
            </el-form>
            <viewer :images="form.pictureUrls" class="clearfix">
              <img :src="img" :key="index" v-for="(img, index) in form.pictureUrls">
            </viewer>
           <div class="work-order-details-list-split" v-if="prodetail.list!=null&&prodetail.list.length >0"></div>
           <div class="splitBox" v-for="(child, wrapindex) in prodetail.list" :key="wrapindex">
              <div class="work-order-details-list-title">{{child.title}}</div>
              <el-form :model="form" abel-width="80px" size="mini">
                <el-form-item
                  v-for="(filed, index2) in child.list"
                  :key="index2"
                  :label="filed.name"
                >{{filed.value}}</el-form-item>
              </el-form>
              <!--图片路径-->
              <viewer :images="child.prictureUrls" class="clearfix">
                <img :src="img" :key="index" v-for="(img, index) in child.prictureUrls">
              </viewer>
              <!-- 分割线 -->
              <div class="work-order-details-list-split" v-if="wrapindex !== prodetail.list.length - 1"></div>
            </div>
            <div style="border-bottom: 1px solid #ddd;"></div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="visible = false">关 闭</el-button>
            </div>
          </el-dialog>
       
       </div>
</template> 
<script>
import Pagination from "@/components/Pagination";
import { getList,  del,get } from "@/api/work/report.js"; 
import RmDict from "@/components/rm/dict";
import RmOrgSelect from "@/components/rm/orgselect";
import RmUserSelect from "@/components/rm/userselect";
import RmAreaSelect from "@/components/rm/areaselect";
import { getToken } from '@/utils/auth' 
import {save,acttaskinfo} from '@/api/work/proTask.js'
import RmMap from "@/components/rm/map";
import { getorgtrees,getSynergOffice,getLoweroffice,findOfficeUserstree} from '@/api/res/management.js'

export default {
  components: { Pagination, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect,RmMap },
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
      clientHeight: 0,
      listLoading:true,
      isMapShow:false,
      marks:true,
      map:null,
      visible: false,
      visibleOrder:false,
      checked: false,
      dataArray: [],
      fileList: [], 
      doUpload: process.env.BASE_FILE_API + "?token=" + getToken(),
      proTaskFrom:{
        name : null,
        reportId:null,
        source : 'report'
      },
      prodetail: {
        list:null,
        handel:{
          btnlist:null
        }
      }, 
      officeData:{},
      defaultProps: {
        children: "children",
        label: "label"
      },
      form: {
        areaId : null,
        officeId:null,
        officeName:null,
        user: null,
        province: null,
        region: null,
        county: null,
        town: null,
        checkId: null,
        reverD: null,
        title: null,
        content: null,
        type: null,
        lng: null,
        lat: null,
        reportTime: null,
        auditPerson: null,
        auditDate: null,
        auditStatus: '',
        pictureUrls : null
      },
      uploaddata: {
        bizId: null,
        bizType: "report"
      },
      slide1: [],
      list: [],
      total: 0,
      synergOfficeList : null,
      lowerofficeList : null,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        importance: undefined,
        search: undefined,
        type: undefined,
        officeId :undefined,
        areaId : undefined,
        sort: "+id"
      },
      importanceOptions: [1, 2, 3]
    };
  },
  created() {
    this.loadLeftTree();
  },
  mounted(){
    const tempH = this.getHeight(document.getElementsByClassName('app-container')[0]) - 210
    this.clientHeight = tempH
    const that = this
    window.onresize = function temp() {
      that.clientHeight = that.getHeight(document.getElementsByClassName('app-container')[0]) - 210
    }
  },
  methods: {
    loadLeftTree() {
      getorgtrees().then((res) => {
        const data = res.data.list
        this.dataArray = data
        // 第一次默认
        this.listQuery['office.id'] = data[0].id
        this.unit = data[0].label
        this.companyID = data[0].id
        this.getList()
      }).catch((errorRes) => {
        console.error("errror:::::::",errorRes)

      })
    },
     // 点击顶部的按钮 切换到地图
    changeMap() {
      if (this.isMapShow && this.marks) {
        this.isMapShow = false;
        this.marks = true;
      } else if (this.isMapShow && this.marks == false) {
        this.isMapShow = false;
        this.marks = true;
      } else {
        this.isMapShow = true;
        this.marks = true;
      }
    },
    //定位
    showFeature(id, type, lng, lat) {
      if (this.isMapShow) {
        this.isMapShow = false;
        this.marks = true;
      } else {
        this.isMapShow = true;
        this.marks = false;
      }
      var lng = lng;
      var lat = lat;
      var self=this;
       setTimeout(() => {
        //console.log("self.map",self.map)
        self.map.showFeature({ id: id, gtype: type, name: '上报', lng: lng, lat: lat })
      }, 500);
    },
    getList() {
      this.listLoading = true;
      // console.log("this.listQuery::::",this.listQuery)
      getList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.count;
      });
      //相关部门数据
      getSynergOffice().then(response => {
        //console.log('相关部门数据：',response.data);
        this.synergOfficeList = response.data.list
      });
      getLoweroffice().then(response => {
       // console.log('接单单位数据：',response.data);
       this.lowerofficeList = response.data.list
      });
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
      //	console.log('保存:',JSON.stringify(this.form),this.selectUser);
 
      save(this.proTaskFrom).then(response => {
          // 上传到服务器
          this.uploaddata.bizId = response.data.id;
          console.log('response.data.id:',  this.uploaddata.bizId);
          console.log('保存:', this.$refs.upload.uploadFiles.length);
          if (this.$refs.upload.uploadFiles != undefined && this.$refs.upload.uploadFiles.length > 0) {
           // 上传到服务器
              this.$refs.upload.submit();         
          }  
          this.visibleOrder = false
              this.$message({
                type: "success",
                message: "提交成功!"
              })
               this.getList();
        }).catch(error => {
          this.listLoading = false;
        });
    },
    // 点击生成工单
      addOrder(id) { /*  */
      this.visibleOrder = true;
       console.log("id", id);
       this.proTaskFrom.reportId = id
    },// 点击详情,查看详情
    detailBtn(idx) {
      this.visible = true;
      console.log("idx", idx);
      get(idx).then(response => {
        this.form = response.data.report;
        const imagelist = this.form.pictureUrls;
        this.prodetail = response.data; 
        this.slide1 = imagelist; 
        
        console.log("this.prodetail.list::::",this.prodetail);
        console.log("this.prodetail.list::::",this.prodetail.list);
        // imagelist.forEach((value, index) => {
        //   this.slide1.push(
        //     {
        //       url: value.url,
        //       name: value.name,
        //     }
        //   )
        // });
      });
    }, 
     onlyShowSelectBtn() {
      console.log("只显示所属单位",this.listQuery,this.checked)

     this.handleNodeClick(this.officeData);
    },
    handleNodeClick(data) {
      console.log("节点信息", data)
      this.officeData = data
      //选择的是哪个单位
      this.unit = data.label
      this.companyID = data.id
      if (this.checked){
          this.listQuery.officeId = data.id
          this.listQuery.areaId = null
      } else {
        this.listQuery.areaId = data.area.id
        this.listQuery.officeId = null
      } 
      this.getList()
    },
    handleSuccess() {
      this.fileList = [];
      this.getList();
    },
   handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisibleImg = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    removefile(file) {
      delfiles({ ids: file.id }).then(response => {
        console.log("图片删除成功!!!!!");
      })
    },  
    del(row) {
      var self = this;
      console.log(row.id);
      del(row.id)
        .then(response => {
          this.getList();
        })
        .catch(error => {
          this.listLoading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dialog__body {
  img {
    width: 24%;
    max-height: 15em;
    margin: 0.5em 0.2em 0 0;
    float: left;
  }
}
.app-container > .el-container {
  min-height: 86vh;
  .el-container {
    width: 80%;
  }
}
.app-container {
  /deep/ .el-form-item--mini.el-form-item {
    margin-bottom: 0px;
  }
}
.widget-divBox {
  padding: 14px 0 10px 0;
  width: 100%;
  // margin: 0 auto;
  text-align: left;
  .widget-div {
    width: 50%;
    display: inline-block;
    height: auto;
    margin-bottom: 0px;
    padding: 10px 10px 8px 10px;
    .widget-divContent {
      background-color: #fff;
      text-align: left;
      border-radius: 5px;
      width: 100%;
      height: auto;
      padding: 10px;
      position: relative;
      box-shadow: 0px 0px 8px 0px rgba(36, 44, 51, 0.2);
      .widget-divContent-main {
        // display: inline-block;
        height: auto;
        float: left;
        width: 100%;
        > span {
          min-height: 40px;
          display: block;
          padding-top: 5px;
        }
        .widget-divContent-main-title > span:first-of-type {
          font-size: 16px;
          font-weight: bold;
          .unProcessed {
            // 未处理
            color: #f25c5c;
          }
          .Processing {
            // 处理中
            color: #3dc87e;
          }
          .processed {
            // 已处理
            color: #279cf5;
          }
        }
        .widget-divContent-main-title > span:last-of-type {
          position: absolute;
          right: 15px;
          top: 15px;
          font-size: 14px;
        }
        .widget-divContent-main-content {
          // min-height: 42px;
          padding: 15px 0;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .widget-divContent-main-imgs {
          min-height: 10em;
          .widget-divContent-main-imgsGroup {
            float: left;
            width: 100%;
            li {
              list-style: none;
              width: 20%;
              font-size: 12px;
              position: relative;
              vertical-align: middle;
              padding: 5px 10px 5px 0;
              float: left;
              img {
                border-radius: 5px;
                width: 100%;
                cursor: pointer;
                height: 10em;
              }
            }
          }
        }
        .bg-purple {
          span {
            line-height: 24px;
            color: #888888;
            margin-right: 0.5em;
          }
        }
        .bg-purple-light {
          text-align: right;
          .svg-icon {
            margin: 0 0.4em;
          }
        }

        .widget-divContent-main-footer {
          padding: 0.5em 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .svg-icon {
            cursor: pointer;
          }
        }
        .widget-divContent-main-footer > div:first-of-type span {
          line-height: 24px;
          color: #888888;
          margin-right: 0.5em;
        }
        .widget-divContent-main-footer > div:last-of-type .svg-icon {
          margin: 0.4em;
        }
      }
    }
    .widget-divContent:hover {
      box-shadow: 0px 0px 10px 0px rgba(36, 44, 51, 0.8);
    }
  }
  .noData-divBox {
    padding: 14px 0px 10px 0px;
    width: 88%;
    margin: 0 auto;
    text-align: left;
    div {
      text-align: center;
      margin: 10px auto;
      img {
        margin-top: 30px;
      }
    }
  }
}

.el-button .svg-icon {
  width: 1.2rem;
  height: 1.2rem;
}
.cell .el-button--text:first-of-type .svg-icon {
  fill: #4ecc89;
}
// .cell .el-button--text:nth-of-type(3) .svg-icon {
//   fill: #f25c5c;
// }

.app-container {
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
      padding: 24px;
    }
    .panel-body {
      overflow: auto;
      height: calc(86vh - 41px);
    }
  }
}

.panel {
  margin-bottom: 20px;
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
<style scoped>
.userM >>> .el-table--medium td {
  padding: 3px 0 !important;
}
.userM >>> .el-dialog__body {
  max-height: 500px;
}
.elUpload {
  margin-top: 20px;  
}
/* 未处理 */
.unHandle {
  color: #f25c5c;
}
/* 处理中 */ 
.handling {
  color: #3dc87e;
}

</style>

<style lang="scss" scoped>
/*打印按钮*/
.printBtn {
  position: absolute;
  right: 20px;
}
/*layout弹窗里面的自定义按钮*/
.customerBtn {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translate(-50%);
}
.command-user {
  margin: 5px 8px;
  height: 34px;
  min-width: 74px;
  font-weight: 500;
  border-radius: 3px;
  padding: 5px 10px;
  line-height: 24px;
  display: inline-block;
  color: #fff;
  font-size: 14px;
  text-align: center;
  background-color: #279cf5;
  float: left;
  i {
    font-size: 15px;
    cursor: pointer;
  }
  i:hover {
    color: #d9534f;
  }
}
.command-mian-body-image {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.app-container > .el-container {
  min-height: 86vh;
}
.app-container {
  /deep/ .el-dialog__body {
    max-height: 650px;
  }
  .city {
    color: #35acf2;
  }
  .country {
    color: #3dc87e;
  }
  /deep/ .el-form-item--mini.el-form-item {
    margin-bottom: 0px;
  }
  .work-order-details-list-title {
    color: #279cf5;
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 2px solid #279cf5;
    height: 14px;
    line-height: 14px;
  }
  .work-order-details-list-split {
    border-top: 10px #f0f3f5 solid;
    margin: -1px -20px 0 -20px;
    padding: 0px 20px 0px 20px;
  }
  .splitBox:not(:first-of-type) {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  /deep/ .el-dialog__body {
    img {
      width: 24%;
      max-height: 15em;
      margin: 0.5em 0.2em 0 0;
      float: left;
    }
    video,
    audio {
      width: 49%;
      max-height: 15em;
      margin: 0.5em 0.2em 0 0;
      float: left;
    }
  }
}
</style>
