(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-902c"],{"/V5w":function(t,e,a){"use strict";a.d(e,"a",function(){return i}),a.d(e,"b",function(){return s});var n=a("t3Un");function i(t){return Object(n.a)({url:"/api/dc/asschart",method:"get",params:t})}function s(t){return Object(n.a)({url:"/api/dc/complaintchart",method:"get",params:t})}},"0PK0":function(t,e,a){"use strict";a.r(e);var n=a("MT78"),i=a.n(n),s=a("/V5w"),c={name:"assessmentStatistics",data:function(){return{legendDataArray:[],echartsData:{},clientHeight:"",year:"",yearMonth:"",value1:"",value2:"",activeName:"first"}},created:function(){this.getChartsList()},mounted:function(){var t=this.getHeight(document.getElementsByClassName("app-container")[0])-217;console.log("--mounted周期",t),this.clientHeight=t;var e=this;window.onresize=function(){e.clientHeight=e.getHeight(document.getElementsByClassName("app-container")[0])-217,console.log("window.onresize",e.clientHeight)},this.init()},methods:{init:function(){var t=this;setTimeout(function(){window.onresize=function(){t.$refs.myChart&&(t.chart=i.a.init(t.$refs.myChart),t.chart.resize())}},20)},getChartsList:function(){var t=this,e={year:this.year};Object(s.a)(e).then(function(e){console.log("res",e),t.echartsData=e.data,t.legendDataArray=e.data.series.map(function(t){return t.name}),t.drawBar()}).catch(function(t){})},handleClick:function(t,e){var a=this;"first"==t.paneName&&setTimeout(function(){a.drawBar()},100)},tabYearChange:function(t){this.year=new Date(t).getFullYear(),this.getChartsList()},drawBar:function(){this.chart1=i.a.init(this.$refs.myChart),this.chart1.setOption({title:{text:this.echartsData.title,x:"50%",y:"3%",textStyle:{color:"#008acd",fontSize:16}},tooltip:{show:!0,trigger:"axis"},legend:{data:this.legendDataArray,x:"7%",y:"10%"},xAxis:[{name:"月份",type:"category",data:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],axisLabel:{interval:0},axisLine:{lineStyle:{color:"#008acd"}},boundaryGap:!0}],yAxis:[{type:"value",name:"总分",nameTextStyle:{color:"#008acd"},axisLine:{lineStyle:{color:"#008acd"}}}],grid:{x:"5%",x2:"5%",y:"20%",y2:"5%"},color:["#52b4ff","#fa7de5","#48dff0","#ff7370","#5ce5aa","#ffb870","#bc84f5","#fae164","#778eff","#ff7faa"],series:this.echartsData.series})},tabMonthChange:function(t){console.log("tabMonth",t)}}},r=(a("BVEj"),a("KHd+")),o=Object(r.a)(c,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"app-container"},[a("el-container",[a("el-container",[a("el-header",{attrs:{height:"125px"}},[a("el-tabs",{on:{"tab-click":t.handleClick},model:{value:t.activeName,callback:function(e){t.activeName=e},expression:"activeName"}},[a("el-tab-pane",{attrs:{label:"考核统计",name:"first"}},[a("div",{staticClass:"filter-container"},[a("div",{staticClass:"block"},[a("span",{staticClass:"demonstration"},[t._v("年份")]),t._v(" "),a("el-date-picker",{attrs:{type:"year",placeholder:"选择年"},on:{change:t.tabYearChange},model:{value:t.value1,callback:function(e){t.value1=e},expression:"value1"}})],1)])]),t._v(" "),a("el-tab-pane",{attrs:{label:"考核报表",name:"second"}},[a("div",{staticClass:"filter-container"},[a("div",{staticClass:"block"},[a("span",{staticClass:"demonstration"},[t._v("年月")]),t._v(" "),a("el-date-picker",{attrs:{type:"month",placeholder:"选择月"},on:{change:t.tabMonthChange},model:{value:t.value2,callback:function(e){t.value2=e},expression:"value2"}})],1)])])],1)],1),t._v(" "),a("el-main",["first"===t.activeName?a("div",{staticClass:"canvasBox"},[a("div",{ref:"myChart",style:{width:"100%",height:t.clientHeight+"px"},attrs:{id:"myChart"}})]):t._e(),t._v(" "),"second"===t.activeName?a("div",{staticClass:"canvasBox"},[a("h2",[t._v("我的tab2")])]):t._e()])],1)],1)],1)},[],!1,null,"10b7712c",null);o.options.__file="assessmentStatistics.vue";e.default=o.exports},BVEj:function(t,e,a){"use strict";var n=a("pZPB");a.n(n).a},pZPB:function(t,e,a){}}]);