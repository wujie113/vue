<template>
  <div class=""> 
     <el-container> 
       <rm-map v-model="map"></rm-map>
      <div class="el-mindiv" v-show="!dialogVisible" @click="dialogVisible=!dialogVisible">
        <div class="layui-layer-title">河流管理</div>
         
        <span class="layui-layer-setwin">
          <!-- <svg-icon icon-class="huanyuan" /> -->
          <i class="el-icon-ali-diejia"></i>
        </span>
      </div>
    </el-container> 
     <Layer 
title="河流管理" 
v-model="dialogVisible"   
:dialog="false" 
class="layer-1" 
width="1000" :animation="2" :maskLayer="false" :shade= "false"
        height="600" 
confirm="确定" 
cancel="取消" > 
            <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
              <el-tab-pane name="HL">
                 <span slot="label"><i class="el-icon-date"></i> 河流</span>  
                <keep-alive><div>
                <div class="filter-container river">
                    <el-input placeholder="输入河流湖泊名称" v-model="river.listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
                    <el-select v-model="river.listQuery.type" placeholder="请选择类型" clearable class="filter-item" style="width: 130px">
                      <el-option v-for="item in river.typeOptions" :key="item.key" :label="item.label" :value="item.key" />
                    </el-select>
                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="riverhandleFilter">查询</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="riveraddRiver">新增</el-button>
                  </div>
                  <el-table v-loading="river.listLoading" :data="river.list" border fit highlight-current-row row-key="id" stripe size="mini" @current-change="riverhandleCurrentChange" >
                    <el-table-column prop="name" label="名称" />
                    <el-table-column prop="river.name" label="所属水系" />
                    <el-table-column prop="typename" label="河流类型" />
                    <el-table-column prop="area.name" label="责任主体" />
                    <el-table-column prop="description" label="描述" :show-overflow-tooltip="true" />
                    <el-table-column prop="area.name" label="责任主体" />
                    <el-table-column prop="sort" label="排序" :show-overflow-tooltip="true" />
                    <el-table-column prop="id" label="操作" width="100">
                      <template slot-scope="scope">
                        <el-button @click="riveredit(scope.row)" type="text" size="mini" icon="el-icon-edit" title="编辑" />
                        <el-button @click="personEdit(scope.row)" type="text" title="人员管理">
                          <svg-icon icon-class="user_blue" />
                        </el-button>
                        <el-button @click="riverdel(scope.row)" type="text" size="mini" icon="el-icon-delete" title="删除" />
                      </template>
                    </el-table-column>
                  </el-table>
                  <pagination v-show="river.total>0" :total="river.total" :page.sync="river.listQuery.pageNo" :limit.sync="river.listQuery.pageSize" @pagination="rivergetList" />
                  
                  <el-dialog :visible.sync="river.dialogVisibleImg" title="图片预览" :append-to-body="false" :close-on-click-modal="false" :modal="false" :modal-append-to-body="false">
                    <img width="100%" :src="river.dialogImageUrl" alt>
                  </el-dialog> 
                   </div>
                    </keep-alive>
              </el-tab-pane>
              <el-tab-pane name="HP">
                  <span slot="label"><i class="el-icon-date"></i> 山塘、湖库</span>
                  <keep-alive>
                   <div> 
                    <div class="filter-container lake"> 
                        <el-input placeholder="输入名称搜索" v-model="lake.listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="lakehandleFilter" />
                        <el-select v-model="lake.listQuery.type" placeholder="请选择类型" clearable style="width: 90px" class="filter-item">
                          <el-option v-for="item in lake.typeOptions" :key="item.key" :label="item.label" :value="item.key" />
                        </el-select>
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="lakehandleFilter">查询</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click="lakeadd">新增</el-button>
                      </div>
                      <el-table v-loading="lake.listLoading" :data="lake.list" border fit highlight-current-row row-key="id" stripe style="width: 100%">
                        <el-table-column type="index" label="序号" width="80" />
                        <el-table-column prop="name" label="名称" />
                        <el-table-column prop="typename" label="类型(湖泊山塘)" />
                        <el-table-column prop="lake.name" label="所属区域" />
                        <el-table-column prop="area.name" label="责任主体" />
                        <el-table-column prop="description" label="描述" />
                        <el-table-column prop="id" label="操作" width="100">
                          <template slot-scope="scope">
                            <el-button @click="lakeedit(scope.row)" type="text" size="mini" icon="el-icon-edit" />
                            <el-button @click="personEdit(scope.row)" type="text" title="人员管理">
                              <svg-icon icon-class="user_blue" />
                            </el-button>
                            <el-button @click="lakedel(scope.row)" type="text" size="mini" icon="el-icon-delete" />
                          </template>
                        </el-table-column>
                      </el-table>
                      <pagination v-show="lake.total>0" :total="lake.total" :page.sync="lake.listQuery.pageNo" :limit.sync="lake.listQuery.pageSize" @pagination="lakegetList" /> 
                    </div>
                    </keep-alive>
              </el-tab-pane>
              <el-tab-pane name="ZRD">
                <span slot="label"><i class="el-icon-date"></i> 责任段</span>
                <keep-alive>
                  <div>
                      <div class="filter-container duty" >
                        <el-input placeholder="输入责任段名称" v-model="duty.listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="dutyhandleFilter" />
                        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="dutyhandleFilter">查询</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click="dutyaddRiver">新增</el-button>
                      </div>
                      <el-table v-loading="duty.listLoading" :data="duty.list" border fit highlight-current-row row-key="id" stripe style="width: 100%">
                        <el-table-column prop="name" label="名称" />
                        <el-table-column prop="river.name" label="所属河流" />
                        <el-table-column prop="area.name" label="责任主体" />
                        <el-table-column prop="code" label="河流编码" />
                        <el-table-column prop="sort" label="排序" :show-overflow-tooltip="true" />
                        <el-table-column prop="description" label="描述" :show-overflow-tooltip="true" />
                        <el-table-column prop="id" label="操作" width="135">
                          <template slot-scope="scope">
                            <el-button title="设置打卡点" type="text"  icon="el-icon-location-outline" @click="spot(scope.row)"></el-button>
                            <el-button @click="dutyedit(scope.row)" type="text" size="mini" icon="el-icon-edit" />
                            <el-button @click="personEdit(scope.row)" type="text" title="人员管理">
                              <svg-icon icon-class="user_blue" />
                            </el-button>
                            <el-button @click="dutydel(scope.row)" type="text" size="mini" icon="el-icon-delete" />
                          </template>
                        </el-table-column>
                      </el-table>
                      <pagination v-show="duty.total>0" :total="duty.total" :page.sync="duty.listQuery.pageNo" :limit.sync="duty.listQuery.pageSize" @pagination="dutygetList" />
                  </div>
                </keep-alive>
              </el-tab-pane>
          </el-tabs>
    </Layer> 
     <!--责任段form-->
    <Layer 
:title="duty.dialogTitle" 
v-model="duty.visible"   
:dialog="false" 
class="layer-1" 
width="600" :animation="2" :maskLayer="false" :shade= "false"
                    height="500" 
confirm="保存" 
cancel="关闭" 
:confirmBack="dutysave"> 
            <el-form ref="dutyform" :model="duty.form" label-width="90px">
              <el-form-item prop="name" label="责任段名称">
                <el-input v-model="duty.form.name" />
              </el-form-item>
              <el-form-item label="所属河流">
                <rm-river-select v-model="duty.form.river" />
              </el-form-item>
              <el-form-item prop="area" label="责任主体">
                <rm-area-select v-model="duty.form.area" />
              </el-form-item>
              <el-form-item prop="sort" label="排序">
                <el-input v-model="duty.form.sort" />
              </el-form-item>
              <el-form-item prop="description" label="河流描述">
                <el-input v-model="duty.form.description" :rows="4" type="textarea" />
              </el-form-item>
               <el-form-item prop="description" label="绘图">
                  <el-button type="button"  @click="drawRiverLine()">请点击按钮后绘图</el-button>
              </el-form-item>
            </el-form>
            <el-upload 
              :action="duty.doUpload" 
              list-type="picture-card" 
              :auto-upload="false" 
              :on-preview="dutyhandlePictureCardPreview" accept=".jpg,.jpeg,.png,.gif" ref="dutyupload" :file-list="duty.fileList" :before-remove="dutyremovefile" :data="duty.uploaddata" :on-success="dutyhandleSuccess" 
              :on-remove="dutyhandleRemove" :on-error="dutyfileerror">
              <i class="el-icon-plus"></i>
            </el-upload> 
    </Layer>
    <!--end 责任段form-->
    <!-- 河流form --> 
    <Layer 
:title="river.dialogTitle" 
v-model="river.visible"   
:dialog="false" 
class="layer-1" 
width="500" :animation="2" :maskLayer="false" :shade= "false"
                    height="400" 
confirm="保存" 
cancel="关闭" 
:confirmBack="riversave"> 
                      <el-form ref="form" :model="river.form" label-width="80px">
                        <el-form-item prop="name" label="河流名称">
                          <el-input v-model="river.form.name" />
                        </el-form-item>
                        <el-form-item label="所属水系">
                          <el-select v-model="river.form.river.id" placeholder="请选择水系" clearable class="filter-item">
                            <el-option v-for="item in river.sxOptions" :key="item.key" :label="item.label" :value="item.key" />
                          </el-select>
                        </el-form-item>
                        <el-form-item prop="type" label="河流类型">
                          <el-select v-model="river.form.type" placeholder="请选择类型" clearable class="filter-item">
                            <el-option v-for="item in river.typeOptions" :key="item.key" :label="item.label" :value="item.key" />
                          </el-select>
                        </el-form-item>
                        <el-form-item prop="area" label="责任主体">
                          <rm-area-select v-model="river.form.area" />
                        </el-form-item>
                        <el-form-item prop="sort" label="排序">
                          <el-input v-model="river.form.sort" />
                        </el-form-item>
                        <el-form-item prop="description" label="河流描述">
                          <el-input v-model="river.form.description" :rows="4" type="textarea" />
                        </el-form-item>
                      </el-form>
                      <el-upload 
                            :action="river.doUpload" 
                            list-type="picture-card" 
                            :auto-upload="false" 
                            :on-preview="riverhandlePictureCardPreview" accept=".jpg,.jpeg,.png,.gif" ref="riverupload" :file-list="river.fileList" :before-remove="riverremovefile" :data="river.uploaddata" :on-success="riverhandleSuccess" 
                            :on-remove="riverhandleRemove">
                        <i class="el-icon-plus"></i>
                      </el-upload> 
    </Layer>
    <!--湖泊form-->
    <Layer 
          :title="lake.dialogTitle"  
          v-model="lake.visible"   
          :dialog="false" 
          class="layer-1" 
          width="500" :animation="2" :maskLayer="false" :shade= "false"
                      height="400" 
          confirm="保存" 
          cancel="关闭" 
          :confirmBack="lakesave"> 
            <el-form ref="lakeform" :model="lake.form" label-width="80px">
              <el-form-item label="水库名称">
                    <el-input v-model="lake.form.name" />
                  </el-form-item>
                  <el-form-item prop="lake.type" label="类型">
                    <el-select v-model="lake.form.type" placeholder="请选择类型" clearable class="filter-item">
                      <el-option v-for="item in lake.typeOptions" :key="item.key" :label="item.label" :value="item.key" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="所属区域">
                    <el-select v-model="lake.form.lake.id" placeholder="请选择水系" clearable class="filter-item">
                      <el-option v-for="item in lake.quOptions" :key="item.key" :label="item.label" :value="item.key" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="责任主体">
                    <rm-area-select v-model="lake.form.area" />
                  </el-form-item> 
                  <el-form-item label="描述">
                    <el-input v-model="lake.form.description" :rows="4" type="textarea" />
                  </el-form-item>
                   <el-form-item prop="description" label="绘图">
                  <el-button type="button"  @click="drawlakeAarea()">请点击按钮后绘图</el-button>
                </el-form-item>
            </el-form>   
         


                <el-upload 
                            :action="lake.doUpload" 
                            list-type="picture-card" 
                            :auto-upload="false" 
                            :on-preview="lakehandlePictureCardPreview" accept=".jpg,.jpeg,.png,.gif" ref="lakeupload" :file-list="lake.fileList" :before-remove="lakeremovefile" :data="lake.uploaddata" :on-success="lakehandleSuccess" 
                            :on-remove="lakehandleRemove">
                        <i class="el-icon-plus"></i>
                </el-upload> 
     </Layer>
    <Layer 
            title="关联管理人员" 
            v-model="areauser.selecteduser"   
            :dialog="false" 
            class="layer-1" 
            width="500" :animation="2" :maskLayer="false" :shade= "false"
                              height="400" 
            confirm="保存" 
            cancel="关闭" > 
                        <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="adduser">添加新用户</el-button>
                        <el-table  v-loading="areauser.userloadinged" :data="areauser.userlisted"    border  fit highlight-current-row  row-key="id"  stripe style="width: 100%"> 
                            <el-table-column prop="userName" label="姓名"/> 
                            <el-table-column prop="post" label="职属"/>  
                            <el-table-column prop="id" label="操作" width="100"   >
                            <template slot-scope="scope"> 
                                <el-button @click="deluser(scope.row)" type="text" size="mini" icon="el-icon-delete" title="删除" />
                            </template>
                            </el-table-column>    
                        </el-table>   
    </Layer> 
    <Layer 
title="人员选择" 
v-model="areauser.selectinguser"   
:dialog="false" 
class="layer-1" 
width="400" :animation="2" :maskLayer="false" :shade= "false"
      height="300" 
confirm="人员添加" 
cancel="关闭" 
:confirmBack="saveusers"  > 
      <el-table  v-loading="areauser.userloading" :data="areauser.userlist"    @selection-change="handleSelectionChange"  border  fit highlight-current-row  row-key="id"  stripe style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="序号" width="100px" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="postLabel" label="职属" />     
      </el-table> 
    </Layer> 
    <!--打卡点-->


  <Layer 
title="设置打卡点" 
v-model="duty.visiblespot"   
:dialog="false" 
class="layer-1" 
width="500" :animation="2" :maskLayer="false" :shade= "false"
                  height="400" 
confirm="保存" 
cancel="关闭" >  
       <div style="width:100%">
         <label class="upload-demo">请在地图上设置打卡点</label>
         <el-table style="width:100%"    :data="duty.dutyClockList">
           <el-table-column label="名称" prop='name'></el-table-column>
           <el-table-column label="坐标" :formatter="formatterthis"> </el-table-column>
           <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="delspot(scope.index, scope.row)">删除</el-button>
                </template></el-table-column>
         </el-table>
       </div> 
  </Layer>
  </div>
</template>
<script>
import { tree } from '@/api/res/river'
import { lakegetList, lakessave, lakeget, lakedel, getqlist,hptree } from '@/api/res/lake' 
import RmMap from "@/components/rm/map" 
import Layer from '@/components/layer'
import Pagination from '@/components/Pagination'
import { getList, save, del, getxslist, getfiles, delfiles } from '@/api/res/river.js' 
import { deluser, getmanagerlist, saveusers, gethzbuserbyareaid } from '@/api/res/management.js'
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import RmAreaSelect from "@/components/rm/areaselect"
import { getToken } from '@/utils/auth'
import RmRiverSelect from "@/components/rm/riverselect"
import { delBtn,addspot,getspot } from "@/api/res/dutyPart.js"
export default {
  name: "Rivermap",
  components: { Pagination, RmMap, RmDict, RmOrgSelect, RmUserSelect, RmAreaSelect,RmRiverSelect },
  data() {
    return {
      activeName: "HL", 
      checked: false,
      dataArray: [],
      map: null,
      hpdataarray: [],
      dialogVisible: false,
      defaultProps: {
        children: "children",
        label: "label"
      }, 
      commonrow: null,
      currentType: 'HL',
      areadid: null,
      bizid: null,
      areauser: {
              checkuserids: null,
              userlisted: null,
              userloadinged: false,
              userlist: null,
              visible: false,
              form: {
                bizid: null,
                type: 'HL',
                userids: null
              }, 
              selecteduser: false,
              selectinguser: false,
              checkeduser: null
      },
      river: { 
            visible: false,
            listLoading: null,
            doUpload: process.env.BASE_FILE_API + "?token=" + getToken(),
            fileList: [],  
            dialogVisibleImg: false,
            dialogImageUrl: null,
            dialogTitle: null,
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
              area: null,
              sort: null,
              river: {
                id: null
              }
            },
            uploaddata: {
              bizId: null,
              bizType: "R"
            },
            list: null,
            total: 0,
            riverrow: null,
            listQuery: {
              pageNo: 1,
              pageSize: 10,
              importance: undefined,
              search: null,
              type: "HL",
              sort: null
            },
            typeOptions: [{ label: '河流', key: 'HL' }, { label: '沟渠', key: 'GQ' }],
            sxOptions: null
      },
      lake: {
            visible: false,
            listLoading: false,
            quOptions: null, 
           doUpload: process.env.BASE_FILE_API + "?token=" + getToken(),
            dialogVisibleImg: false,
           fileList: [],  
           dialogImageUrl: null, 
            form: {
              id: null,
              name: null,
              province: null,
              region: null,
              county: null,
              town: null,
              type: null,
              lng: null,
              lat: null,
              area: null,
              lake: { id: null },
              description: null,
              pid: null,
              wkt: null,
              acreage: null, 
              isNew: true
            },
            uploaddata: {
              bizId: null,
              bizType: "L"
            },
            list: null,
            total: 0,
            listQuery: {
              pageNo: 1,
              pageSize: 10,
              importance: undefined,
              name: undefined,
              type: undefined,
              sort: '+id'
            },
            typeOptions: [{ label: '山塘', key: 'ST' }, { label: '湖泊', key: 'HP' }]
      },
      duty: {
          visible: false,
          listLoading: null,
          doUpload: process.env.BASE_FILE_API + "?token=" + getToken(),
          fileList: [],
          visiblespot: false,
          dutyClockList: null, 
          dialogVisibleImg: false,
          dialogImageUrl: null, 
          form: {
            id: null,
            type: "ZRD",
            province: null,
            region: null,
            county: null,
            town: null,
            name: null,
            lng: null,
            lat: null,
            code: null,
            description: null,
            area: null,
            river: null,
            sort: null,
            wkt: null,
            length: null,
            isnew: true
          },
          uploaddata: {
            bizId: null,
            bizType: "ZRD"
          },
          params: null,
          list: null,
          total: 0,
          listQuery: {
            pageNo: 1,
            pageSize: 10,
            importance: undefined,
            search: undefined,
            type: "ZRD",
            sort: "+id"
          },
          sxOptions: null
      } 
   }
  },
  created() {
    this.init()
  },
  methods: {  
    handleClick(tab) { 
        if (tab.name == 'HP') {
           this.lakegetList()
            getqlist("B").then(response => {
              this.lake.quOptions = response.data.list
            })
        }
        if (tab.name == 'ZRD') {
            this.dutygetList()
            this.dutygetxslist()
            this.duty.listQuery.type = tab.name
            this.duty.uploaddata.bizType = tab.name
            this.duty.form.type = tab.name
        }
        if (tab.name == 'HL') {
            this.rivergetList()
            this.rivergetxslist()
            this.river.listQuery.type = tab.name
             this.river.uploaddata.bizType = tab.name
           this.river.form.type = tab.name
        }
        this.areauser.form.type = tab.name 
    },
    handleNodeClick() {
      // console.log("tab:::",tab);
    },
    clickrow(data) {
       this.centerView(data)
    },
    clicktest() { 
        this.$refs.river.testclick()
    },
    centerView(data) {
        // console.log(data);
        console.log("data.lng, data.lat:::",data)
        this.map.centerView([data.lng, data.lat],16)
    },
    init() {
      this.rivergetList()
      this.rivergetxslist()
    } , 
    /***********************************************河流责任段画线部分**************************************************** */
    drawRiverLine() {
        // var id = '001'
        var self = this
        var id = this.duty.form.id
        var name = this.duty.form.name
        console.log(this.duty.form)
        if (this.duty.form.length == null) {
            this.duty.form.isnew = false
        }  
        this.dialogVisible = false
        this.map.drawLine({ id: id,name: name },this.callback)
    },
    callback(type,data) {   
            // console.log('回调：',type,data)
        if (type === 'change') {
          this.duty.form.length = data.remarks
          this.duty.form.lng = data.coord[0]
          this.duty.form.lat = data.coord[1]
          this.duty.form.wkt = data.wkt
        } 
    }, 
 
   /***********************************************end 河流责任段画线部分**************************************************** */
   /***********************************************star 湖泊画多边形部分**************************************************** */
    drawlakeAarea() {
            // var id = '001'
            var self = this
            var id = this.lake.form.id
            var name = this.lake.form.name 
            if (this.lake.form.acreage == null) {
                this.lake.form.isNew = false
            }  
            this.dialogVisible = false
            this.map.drawArea({ id: id,name: name },this.lakecallback)
        },
    lakecallback(type,data) {   
                // console.log('回调：',type,data)
            if (type === 'change') {
              this.lake.form.acreage = data.remarks
              this.lake.form.lng = data.coord[0]
              this.lake.form.lat = data.coord[1]
              this.lake.form.wkt = data.wkt
            } 
   }, 
   /***********************************************end 湖泊画多边形部分**************************************************** */
   /******************************************************** 河流部分***************************************************************************/ 
    rivergetList() {
      // this.river.listLoading = true
      // console.log("this.river.listQuery::::", this.river.listQuery)
      getList(this.river.listQuery).then(response => {
        this.river.listLoading = false
        this.river.list = response.data.list
        this.river.total = response.data.count 
        this.dialogVisible = true 
        this.duty.visible = false
        this.duty.listLoading = false
      })
    },
    riverhandleFilter() {
      this.river.listQuery.pageNo = 1
      this.rivergetList()
    },
    rivergetxslist() {
      getxslist(this.river.listQuery).then(response => {
        this.river.sxOptions = response.data.list
      })
    },
    riveraddRiver() {
      this.river.visible = true
      this.river.dialogTitle = '新增'  
        Object.assign(this.river.form, this.$options.data().river.form)
    },
    riveredit(row) {
      this.river.visible = true
      this.river.dialogTitle = '编辑'
      Object.assign(this.river.form, row)
      // console.log('form', this.river.form)
      getfiles({ bizId: this.river.form.id, bizType: "R" }).then(response => {
        this.river.fileList = response.data
      }) 
    },  
    riversave() {
      this.river.visible = false
      this.river.listLoading = true
      save(this.river.form).then(response => {
        this.river.uploaddata.bizId = response.data.id
        console.log("uploadFiles:::::",this.$refs.riverupload.uploadFiles.length)
        if (this.$refs.riverupload.uploadFiles != undefined && this.$refs.riverupload.uploadFiles.length > 0) {
          // 上传到服务器 
          this.$refs.riverupload.submit() 
        } else {
          this.rivergetList()
        }
      }).catch(error => {
        this.river.listLoading = false
      })
    },
    riverhandleSuccess() {
      console.log("success:::::::::::::::::::::::::")
      this.river.fileList = []
      this.rivergetList()
    },
    riverremovefile(file) {
      delfiles({ ids: file.id }).then(response => {
        console.log("图片删除成功!!!!!")
      })
    },
    riverhandleRemove(file, fileList) {
      console.log(file, fileList)
    },
    riverhandlePictureCardPreview(file) {
      this.river.dialogImageUrl = file.url
      this.river.dialogVisibleImg = true
    },
    riverfileerror(error){
      console.log("error::::",error);
    },
    riverdel(row) {
      var self = this
      console.log(row.id)
      del(row.id).then(response => {
        this.river.getList()
      }).catch(error => {
        this.river.listLoading = false
      })
    },
    /*******************************************************用户部分 **************************************************************/
   personEdit(row) {
       this.commonrow = row
       this.areauser.selecteduser = true
       this.areauser.listLoadinged = true
       this.findmanagerlist(row.id)
    },
    findmanagerlist(id) {
      getmanagerlist({ type: this.currentType, bizid: id }).then(response => { 
        this.areauser.userlisted = response.data.list
        this.areauser.userloadinged = false
      })
    },
    adduser() {
      this.areauser.selectinguser = true 
      gethzbuserbyareaid({ areaid: this.commonrow.area.id, bizid: this.commonrow.id }).then(response => {
        if (response.data == undefined || response.data.list == null || response.data.list == undefined) {
          this.areauser.userlist = []
        } else {
          this.areauser.userlist = response.data.list 
        } 
        this.areauser.listLoading = false
      })
    },
   deluser(row) { 
      deluser(row.id).then(response => {
        this.$message({
          message: "删除用户成功!!",
          type: "success"
        })
        this.areauser.userloadinged = true
        this.findmanagerlist(this.commonrow.id)
      })
    },
    saveusers() {
        if (this.areauser.checkuserids == null || this.areauser.checkuserids  == '') {
          this.closeuser()
          return
        }
        saveusers({ bizid: this.commonrow.id, userids: this.areauser.checkuserids , type: this.currentType }).then(response => {
          console.log("response:::", response) 
          if (response.success == true) {
            this.$message({
              message: "新增用户成功",
              type: "success"
            })
            this.closeuser()
          } else {
            this.$message({
              message: "新增用户失败",
              type: "error"
            })
          }
        }).catch(error => {
          this.river.listLoading = false
        })
    },
	handleSelectionChange(val) {
      this.river.multipleSelection = val
      val.forEach((a, b) => {
        if (b == 0) {
          this.areauser.checkuserids = a.id
        } else {
          this.areauser.checkuserids  += "," + a.id
        }
      })
    },
	closeuser() { 
      this.areauser.userlist = []
      this.findmanagerlist(this.commonrow.id)
      this.areauser.checkuserids  = null
      this.areauser.selectinguser  = false
    },
    closedialog() {
      this.areauser.tbshow = true
      this.areauser.userlist = []
      this.areauser.visible = false
      this.areauser.checkuserids  = null
      this.riverrow = null
    },
    /*******************************************************用户部分 end******************************************************************************** */
    //地图界面交互操作
    riverhandleCurrentChange(row) {  
    },
    rivertestclick(data) {
      console.log("子界面data:::",data)
    },
    /******************************************************** end 河流部分**************************************************************************/

    
    /******************************************************** 湖泊部分***************************************************************************/
    lakegetList() {
      this.lake.listLoading = true
      console.log("this.listQuery::::", this.lake.listQuery)
      lakegetList(this.lake.listQuery).then(response => {
        this.lake.listLoading = false 
        this.lake.list = response.data.list
        this.lake.total = response.data.count
      })
    },
    lakehandleFilter() {
      this.lake.listQuery.pageNo = 1
      this.lakegetList()
    }, 
    lakeadd() {
      this.lake.visible = true 
       this.lake.dialogTitle = '新增'  
      Object.assign(this.lake.form, this.$options.data().lake.form) 
    },
    lakeedit(row) { 
      this.lake.visible = true
         this.lake.dialogTitle = '编辑'  
      Object.assign(this.lake.form, row)
       getfiles({ bizId: this.lake.form.id, bizType: "L" }).then(response => {
        this.lake.fileList = response.data
      }) 
    },
    lakesave() {
      console.log('保存:',JSON.stringify(this.form))
      this.lake.visible = false
      this.lake.listLoading = true 
      lakessave(this.lake.form).then(response => {
       this.lake.uploaddata.bizId = response.data.id   
        if (this.$refs.lakeupload.uploadFiles != undefined && this.$refs.lakeupload.uploadFiles.length > 0) {
          // 上传到服务器  
          this.$refs.lakeupload.submit() 
        } else { 
          this.lakegetList()
        }
      }).catch(error => {
        console.error("error::",error);
        this.listLoading = false
      })
      //
    }, 
    lakehandleSuccess() {
      console.log("success:::::::::::::::::::::::::")
      this.lake.fileList = []
      this.lakegetList()
    },
    lakeremovefile(file) {
      delfiles({ ids: file.id }).then(response => {
        console.log("图片删除成功!!!!!")
      })
    },
    lakehandleRemove(file, fileList) {
      console.log(file, fileList)
    },
    lakehandlePictureCardPreview(file) {
      this.lake.dialogImageUrl = file.url
      this.lake.dialogVisibleImg = true
    },
    lakeerror(error){
      console.log("error::::",error);
    },
    lakedel(row) {
      var self = this
      var self = this
      console.log(row)
      lakedel(row.id).then(response => {
        this.lakegetList()
      }).catch(error => {
        this.lake.listLoading = false
      })
    }, 
    lakeclosedialog() {
      this.lake.areauser.tbshow = true
      this.lake.areauser.userlist = []
      this.lake.areauser.visible = false
      this.lake.areauser.checkuserids  = null
      this.lake.riverrow = null
    },
     /******************************************************** 湖泊部分 end***************************************************************************/
    
     /******************************************************** 责任段部分 ***************************************************************************/
     dutygetList() {
      this.listLoading = true
      console.log("this.listQuery::::", this.listQuery)
      getList(this.duty.listQuery).then(response => {
        this.duty.listLoading = false
        this.duty.list = response.data.list
        this.duty.total = response.data.count
      })
    },
    formatterthis(row) {
      return row.lng + "," + row.lat
    },
    dutyhandleFilter() {
      this.duty.listQuery.pageNo = 1
      this.dutygetList()
    },
    dutygetxslist() {
      getxslist(this.duty.listQuery).then(response => {
        this.sxOptions = response.data.list
      })
    },
    dutyaddRiver() {
      this.duty.visible = true
      this.duty.dialogTitle = "新增"
      if (this.$refs.form != undefined) {
        Object.assign(this.duty.form, this.$options.data().duty.form)
      }
    },
 
    dutysave() {
      this.duty.visible = false
      this.duty.listLoading = true
      save(this.duty.form).then(response => { 
          this.duty.uploaddata.bizId = response.data.id 
          this.dialogVisible = true
          if (this.$refs.dutyupload.uploadFiles != undefined && this.$refs.dutyupload.uploadFiles.length > 0) { 
            this.$refs.dutyupload.submit()
          } else {  
            this.dutygetList()
          }
        })
        .catch(error => {
          this.duty.listLoading = false
        })
    },
    dutyhandleSuccess() {
      this.duty.fileList = []
      this.dutygetList()
    },
    dutyremovefile(file) {
      delfiles({ ids: file.id }).then(response => {
        console.log("图片删除成功!!!!!")
      })
    },
    dutyhandleRemove(file, fileList) {
      console.log(file, fileList)
    },
    dutyhandlePictureCardPreview(file) {
      this.duty.dialogImageUrl = file.url
      this.duty.dialogVisible = true
    },
    dutyfileerror(err){
      console.log("err:::",err)
    },
    dutydel(row) {
      var self = this
      console.log(row.id)
      del(row.id)
        .then(response => {
          this.dutygetList()
        })
        .catch(error => {
          this.duty.listLoading = false
        })
    },
    dutyedit(row) {
        this.duty.visible = true
        this.duty.dialogTitle = '编辑'
        Object.assign(this.duty.form, row)
        if (this.duty.form.lat != null && this.duty.form.lng != null) {
            this.centerView(this.duty.form)
            this.map.selectLine({ id: row.id,lng: row.lng,lat: row.lat })
        }
        this.commonrow = row
        // console.log('form', this.river.form)
        getfiles({ bizId: this.duty.form.id, bizType: "ZRD" }).then(response => {
          this.duty.fileList = response.data
        }) 
    },  
   //责任段id
    spot(row) {
      this.duty.visiblespot = true
      this.commonrow = row
      console.log("row:::::",row)
      getspot(row.id).then(response => {
            this.duty.dutyClockList = response.data.list
      })
    },
    //提交打卡点
    commit() {
      //  数组转成json字符串
      //  var jsonstr = JSON.stringify(this.dutyClockList)
       var json = {
            idA: this.commonrow.id,
            latlng: JSON.stringify(this.dutyClockList)
      }
      addspot(json).then(response => {
        this.duty.visiblespot = false
        this.$message({
            message: "添加打卡点成功!!",
            type: "success"
        })
      })
    },
    //删除打卡点
    delspot(index, row) {
       var arry = this.duty.dutyClockList
       arry.splice(index, 1)
       delBtn(row.id).then(response => {
          this.$message({
          message: "删除打卡点成功!!",
          type: "success"
        })
       })
    },
    //还原
    rest() {
      this.duty.dutyClockList = null
    }
     
     /******************************************************** 责任段部分 end***************************************************************************/
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
// .cell .el-button--text:nth-of-type(3) .svg-icon {
//   fill: #f25c5c;
// }
.el-container {
  .el-aside {
    width: 15% !important;
    margin-right: 1%;
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
      padding-left: 10px;
      padding-right: 10px;
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
<style>
.title {
  padding: 0 80px 0 20px;
  height: 42px;
  line-height: 42px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: #f8f8f8;
  border-radius: 2px 2px 0 0;
}

.el-dialog__body {
  padding-top: 10px;
}
</style>
