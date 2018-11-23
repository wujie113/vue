<template>
  <div class="app-container">
    <el-container v-loading="listLoading">
      <el-container>
        <el-header height="125px">
          <div style="" class="topTitle">
            上报列表
          </div>
          <div class="filter-container">
            <el-input placeholder="请输入标题" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <rm-dict class="filter-item" title="请选择类型" placeholder="请选择类型" type="reportType" v-model="listQuery.type" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button  type="primary"  icon="el-icon-plus"  @click="visible=true" >新增</el-button>
          </div>
        </el-header>

        <el-main>
          <div class="widget-divBox">
            <div class="widget-div" v-for="(list, index) in list" :key="index">
              <div class="widget-divContent clearfix">
                <div class="widget-divContent-main">
                  <div class="widget-divContent-main-title">
                    <span>
                        {{ list.title }}
                    </span>
                    <span>
                      {{ list.reportTime }}
                    </span>
                  </div>
                  
                  <div class="widget-divContent-main-imgs clearfix">
                    <ul class="widget-divContent-main-imgsGroup clearfix">
                      <li class="" v-for="(img, index) in list.imageurl" :key="index">
                        <img v-preview="img.url" :src="img.url" :alt="img.title" :key="index" preview-title-enable="true" preview-nav-enable="true">
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
                          {{ list.userName }}
                        </span>
                        <span>
                          <a href="javascript:void(0)" title="上报类型">
                            <svg-icon icon-class="user1" />
                          </a>
                          {{ list.typeLabel }}
                        </span>
                        <span>
                          <a href="javascript:void(0)" title="上报类型">
                            <svg-icon icon-class="user1" />
                          </a>
                         点、线、面
                        </span>
                        <span>
                          <a href="javascript:void(0)" title="所属区域">
                            <svg-icon icon-class="areaColor" />
                          </a>
                          {{ list['area.id'] }}
                        </span>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="9" :lg="7" :xl="6">
                      <div class="grid-content bg-purple-light">
                        <a href="javascript:void(0)" title="生成工单">
                          <svg-icon icon-class="addColor" />
                        </a>
                        <a href="javascript:void(0)" title="定位">
                          <svg-icon icon-class="locationColor" />
                        </a>
                        <a href="javascript:void(0)" title="详情" @click="detailBtn(list.id)">
                          <svg-icon icon-class="detailColor" />
                        </a>
                        <a href="javascript:void(0)" title="修改" @click="edit(list)">
                          <svg-icon icon-class="replayColor" />
                        </a>
                        <a href="javascript:void(0)" title="删除" @click="del(list)">
                          <svg-icon icon-class="replayColor" />
                        </a>
                      </div>
                    </el-col>
                  </el-row>
               
                </div>
              </div>
            </div>
          </div>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
         </el-main>

      </el-container>
    </el-container>
    
  
  
  <el-dialog :visible.sync="visible" title="编辑">
  	<el-form :model="form">
			<el-form-item label="标题">
				<el-input v-model="form.title"/>
			</el-form-item>
			<el-form-item label="专员">
				<el-input v-model="form.user"/>
			</el-form-item>
			<el-form-item label="省">
				<el-input v-model="form.province"/>
			</el-form-item>
			<el-form-item label="地区">
				<el-input v-model="form.region"/>
			</el-form-item>
			<el-form-item label="县">
				<el-input v-model="form.county"/>
			</el-form-item>
			<el-form-item label="乡（镇）">
				<el-input v-model="form.town"/>
			</el-form-item>
			<el-form-item label="经度">
				<el-input v-model="form.lng"/>
			</el-form-item>
			<el-form-item label="纬度">
				<el-input v-model="form.lat"/>
			</el-form-item>
			<el-form-item label="巡河">
				<el-input v-model="form.checkId"/>
			</el-form-item>
			<el-form-item label="类型">
			  <rm-dict class="filter-item" title="请选择类型" placeholder="请选择类型" type="reportType" v-model="form.type" />
			</el-form-item>
			<el-form-item label="河流">
				<el-input v-model="form.reverD"/>
			</el-form-item>
			<el-form-item label="内容">
				<el-input v-model="form.content" type="textarea"></el-input>
			</el-form-item>
 
			<el-form-item label="审核人">
				<el-input v-model="form.auditPerson"/>
			</el-form-item>
			<el-form-item label="审核时间">
				 <el-date-picker v-model="form.auditDate" type="date" placeholder="Pick a date" style="width: 100%;"/>
				<!-- <span class="help-inline"><font color="red">*</font> </span>-->
			</el-form-item>
			<el-form-item label="审核状态">
				<el-input v-model="form.auditStatus"/>
			</el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button @click="save()" type="primary">确 定</el-button>
            </div>
        </el-dialog>
       </div>
</template> 
<script>
import Pagination from "@/components/Pagination";
import { getList, save, del } from "@/api/work/report.js";
import RmDict from "@/components/rm/dict";
import RmOrgSelect from "@/components/rm/orgselect";
import RmUserSelect from "@/components/rm/userselect";
import RmAreaSelect from "@/components/rm/areaselect";
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
      visible: false,
      form: {
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
        auditStatus: null
      },
      list: null,
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
    getList() {
      this.listLoading = true;
      // console.log("this.listQuery::::",this.listQuery)
      getList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.count;
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
      this.visible = false;
      this.listLoading = true;
      save(this.form)
        .then(response => {
          // 上传到服务器
          // this.$refs.upload.submit();
          this.getList();
        })
        .catch(error => {
          this.listLoading = false;
        });
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
}
.widget-divBox {
  p,
  ul,
  li {
    margin: 0;
    padding: 0;
  }
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
              width: 25%;
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
}
</style>

