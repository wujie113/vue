(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2954"],{"342e":function(t,e,a){},ARuo:function(t,e,a){"use strict";a.r(e);var n=a("P2sY"),i=a.n(n),o=a("t3Un");function l(t){return Object(o.a)({url:"/api/sys/office/list",method:"get",params:t})}var s=a("t0nZ"),r=a("Mz3J"),c=a("4A2f"),d={name:"unitRole",components:{LeftTree:s.a,Pagination:r.a,RmDict:c.a},data:function(){return{parentMsg:"hello,child",dataArray:[],selectNodeData:{},loading:!0,dialogLoading:!1,isShowTabbar:!1,unitEditDialog:!1,roleEditDialog:!1,authDialog:!1,unitObj:{},dialogTitle:"",form:{id:null,"area.id":null,parentId:null,area:null,depName:null,name:null,depType:null,sort:null,desc:null},tableData:[]}},created:function(){this.AreaTreeFun()},methods:{AreaTreeFun:function(){var t=this;(function(t){return Object(o.a)({url:"/api/sys/area/tree",method:"get",params:t})})().then(function(e){t.loading=!1,t.dataArray=e.data.list,t.unitObj=e.data.list[0];var a={"area.id":t.unitObj.parentId};t.AreaId=t.unitObj.parentId,l(a).then(function(e){t.tableData=e.data.list}).catch(function(e){t.loading=!1})}).catch(function(e){t.loading=!1})},getWay:function(t){console.log(t)},selectNode:function(t){var e=this;this.unitObj=t,this.selectNodeData=t;var a={"area.id":t.parentId};this.AreaId=t.parentId,this.loading=!0,l(a).then(function(t){e.loading=!1,e.tableData=t.data.list}).catch(function(t){e.loading=!1})},inputSelect:function(t){console.log("数字字典",t)},addUnitBtn:function(){this.unitEditDialog=!0,this.dialogTitle="添加",void 0!=this.$refs.form&&(this.$refs.form.resetFields(),i()(this.form,this.$options.data().form))},unitEdit:function(t,e){this.dialogTitle="编辑",this.unitEditDialog=!0,i()(this.form,e)},selectList:function(t){console.log("选择",t);var e;e=this.tableData.find(function(e){return e.name===t}),console.log(e.parentId),this.parentId=e.parentId},unitEditSave:function(t){var e=this,a={"area.id":this.AreaId,"parent.id":this.form.parentId,name:this.form.name,grade:this.form.depType,sort:this.form.sort,remarks:this.form.desc};this.form.id&&(a.id=this.form.id),this.form.parentId?a["parent.id"]=this.form.parentId:a["parent.id"]=this.parentId,this.dialogLoading=!0,function(t){return Object(o.a)({url:"/api/sys/office/save",method:"post",data:t})}(a).then(function(t){e.dialogLoading=!1,e.unitEditDialog=!1,e.$message({type:"success",message:"修改成功!"}),l({"area.id":e.AreaId}).then(function(t){e.tableData=t.data.list}).catch(function(t){})}).catch(function(t){e.dialogLoading=!1,e.unitEditDialog=!1}),console.log("params",a),console.log("this.form",this.form)},handleSelectionChange1:function(t){if(t.length>0){var e,a=[];t.map(function(t){t.id;a.push(t.id)}),e=a.join(),this.deleteDepIDs=e}},deleteBtn:function(){var t=this;this.$confirm("确认删除当前部门?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){(function(t){return Object(o.a)({url:"/api/sys/office/del",method:"post",data:t})})({ids:t.deleteDepIDs}).then(function(e){t.$message({type:"success",message:"删除成功!"}),t.loading=!0,l({"area.id":t.unitObj.parentId}).then(function(e){t.loading=!1,t.tableData=e.data.list}).catch(function(e){t.loading=!1})}).catch(function(e){t.loading=!1})}).catch(function(){})}}},u=(a("HSIG"),a("KHd+")),f=Object(u.a)(d,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"app-container"},[a("el-row",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],attrs:{gutter:20}},[a("el-col",{attrs:{xs:10,sm:10,md:10,lg:6,xl:6}},[a("left-tree",{attrs:{titleName:"行政区域",dataArray:t.dataArray,isShowTabbar:t.isShowTabbar},on:{areaData:t.selectNode}})],1),t._v(" "),a("el-col",{attrs:{xs:14,sm:14,md:14,lg:18,xl:18}},[a("div",{staticClass:"panel"},[a("div",{staticClass:"panelHeading"},[a("div",[a("svg-icon",{attrs:{"icon-class":"server"}}),t._v("部门机构 - "+t._s(t.unitObj.label)+"\n          ")],1)]),t._v(" "),a("div",{staticClass:"source panel-body"},[a("div",{staticClass:"filter-container"},[a("el-button",{staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-plus",size:"mini"},on:{click:t.addUnitBtn}},[t._v("添加单位")]),t._v(" "),a("el-button",{staticClass:"filter-item",attrs:{type:"info",icon:"el-icon-delete",size:"mini"},on:{click:t.deleteBtn}},[t._v("删除")])],1),t._v(" "),a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData,stripe:"",border:""},on:{"selection-change":t.handleSelectionChange1}},[a("el-table-column",{attrs:{type:"selection",align:"center"}}),t._v(" "),a("el-table-column",{attrs:{prop:"name",label:"名称",align:"center"}}),t._v(" "),a("el-table-column",{attrs:{prop:"area",label:"备注",align:"center"}}),t._v(" "),a("el-table-column",{attrs:{label:"操作",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"text",title:"编辑"},on:{click:function(a){t.unitEdit(e.$index,e.row)}}},[a("svg-icon",{attrs:{"icon-class":"editColor"}})],1)]}}])})],1)],1)])])],1),t._v(" "),a("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:t.dialogLoading,expression:"dialogLoading"}],attrs:{visible:t.unitEditDialog,width:"30%",title:t.dialogTitle,"modal-append-to-body":!1},on:{"update:visible":function(e){t.unitEditDialog=e}}},[a("el-form",{ref:"form",attrs:{model:t.form,"label-width":"80px","status-icon":""}},[a("el-form-item",{attrs:{label:"所属区划"}},[t._v("\n        "+t._s(t.form.area?t.form.area:t.unitObj.label)+"\n      ")]),t._v(" "),a("el-form-item",{attrs:{label:"所属部门"}},[a("el-select",{staticClass:"filter-item",attrs:{placeholder:"请选择部门",clearable:""},on:{change:t.selectList},model:{value:t.form.name,callback:function(e){t.$set(t.form,"name",e)},expression:"form.name"}},t._l(t.tableData,function(t){return a("el-option",{key:t.id,attrs:{value:t.name,label:t.name}})}))],1),t._v(" "),a("el-form-item",{attrs:{label:"名 称"}},[a("el-input",{model:{value:t.form.name,callback:function(e){t.$set(t.form,"name",e)},expression:"form.name"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"部门类型"}},[a("rm-dict",{attrs:{type:"sys_office_type",placeholder:"请选择部门类型"},on:{input:t.inputSelect},model:{value:t.form.depType,callback:function(e){t.$set(t.form,"depType",e)},expression:"form.depType"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"排序"}},[a("el-input",{attrs:{type:"number"},model:{value:t.form.sort,callback:function(e){t.$set(t.form,"sort",e)},expression:"form.sort"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"描述"}},[a("el-input",{attrs:{type:"textarea"},model:{value:t.form.desc,callback:function(e){t.$set(t.form,"desc",e)},expression:"form.desc"}})],1)],1),t._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.unitEditDialog=!1}}},[t._v("取 消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:t.unitEditSave}},[t._v("确 定")])],1)],1)],1)},[],!1,null,"05fec728",null);f.options.__file="unitRole.vue";e.default=f.exports},Bc63:function(t,e,a){},HSIG:function(t,e,a){"use strict";var n=a("342e");a.n(n).a},Y5bG:function(t,e,a){"use strict";a.d(e,"a",function(){return i}),Math.easeInOutQuad=function(t,e,a,n){return(t/=n/2)<1?a/2*t*t+e:-a/2*(--t*(t-2)-1)+e};var n=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)};function i(t,e,a){var i=document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop,o=t-i,l=0;e=void 0===e?500:e;!function t(){l+=20,function(t){document.documentElement.scrollTop=t,document.body.parentNode.scrollTop=t,document.body.scrollTop=t}(Math.easeInOutQuad(l,i,o,e)),l<e?n(t):a&&"function"==typeof a&&a()}()}},jatR:function(t,e,a){"use strict";var n=a("Bc63");a.n(n).a},t0nZ:function(t,e,a){"use strict";var n={name:"LeftTree",data:function(){return{text:"我是子组件向父组件传递参数",msg:{number:60,content:"这是从子组件中传递过来的对象"},defaultProps:{children:"children",label:"label"}}},props:{titleName:{type:String,required:!0},dataArray:{type:Array,required:!0},isShowTabbar:{type:Boolean,required:!0},showCheckbox:{type:Boolean,required:!1,default:!1},panelMinHeight:{type:Number,required:!1,default:81},panelbodyHeight:{type:Number,required:!1,default:86}},mounted:function(){this.$emit("input",this.$refs.tree)},methods:{getMsg:function(){this.$emit("getMsgs",this.msg)},refreshBtn:function(){},addBtn:function(){},deleteBtn:function(){},handleNodeClick:function(t){this.$emit("areaData",t)},checkBoxClick:function(t,e){this.$emit("checkBoxBtn",t,e)}}},i=(a("jatR"),a("KHd+")),o=Object(i.a)(n,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"panel",style:{minHeight:t.panelMinHeight+"vh"}},[a("div",{staticClass:"panelHeading"},[a("div",[a("svg-icon",{attrs:{"icon-class":"tree"}}),t._v(t._s(t.titleName)+"\n    ")],1),t._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowTabbar,expression:"isShowTabbar"}],staticClass:"btn-group"},[a("button",{staticClass:"btn mini",on:{click:t.refreshBtn}},[a("i",{staticClass:"el-icon-refresh"})]),t._v(" "),a("button",{staticClass:"btn mini",on:{click:t.addBtn}},[a("i",{staticClass:"el-icon-circle-plus"})]),t._v(" "),a("button",{staticClass:"btn mini",on:{click:t.deleteBtn}},[a("i",{staticClass:"el-icon-delete"})])])]),t._v(" "),a("div",{staticClass:"source panel-body",style:{height:"calc("+t.panelbodyHeight+"vh - 41px)"}},[a("el-tree",{ref:"tree",attrs:{data:t.dataArray,props:t.defaultProps,"empty-text":"暂无数据","highlight-current":"","node-key":"id","show-checkbox":t.showCheckbox},on:{"node-click":t.handleNodeClick,check:t.checkBoxClick}})],1)])},[],!1,null,"646fce6a",null);o.options.__file="leftTree.vue";e.a=o.exports}}]);