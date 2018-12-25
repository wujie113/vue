<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="输入标题" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="请选择列别" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addRiver">新增</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row row-key="id" stripe style="width: 100%">
      <el-table-column prop="name" label="水系名称" />
      <el-table-column prop="area.name" label="责任主体" />
      <el-table-column prop="code" label="水系编码" />
      <el-table-column prop="chief" label="河长办" />
       <el-table-column prop="sort" label="排序" />
      <el-table-column prop="id" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="mini" icon="el-icon-edit" />
          <el-button @click="del(scope.row)" type="text" size="mini" icon="el-icon-delete" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :visible.sync="visible" width="30%" title="编辑">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item prop="name" label="水系名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item prop="area" label="责任主体">
          <rm-area-select v-model="form.area"  iscontains="yes"/>
        </el-form-item>
          <el-form-item   prop="sort"  label="排序">
           <el-input v-model="form.sort"/>
        </el-form-item> 
        <el-form-item prop="description" label="水系描述">
          <el-input v-model="form.description" :rows="4" type="textarea" />
        </el-form-item> 
      </el-form> 
      
       <el-upload 
        :action="doUpload"
        list-type="picture-card"
        :auto-upload="false"
        :on-preview="handlePictureCardPreview"
        accept=".jpg,.jpeg,.png,.gif"
        ref="upload"
        :file-list="fileList"
        :before-remove="removefile"
        :data="uploaddata"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
        </el-upload>  
          <div slot="footer" class="dialog-footer">
              <el-button @click="visible = false">取 消</el-button>
              <el-button @click="save()" type="primary" >确 定</el-button>
          </div> 
        </el-dialog>
       </div>
</template> 
<script> 
import Pagination from '@/components/Pagination' 
import { getList, save, del, getfiles, delfiles, uploadFile} from '@/api/res/river.js'
import RmDict from '@/components/rm/dict'
import RmOrgSelect from "@/components/rm/orgselect"
import RmUserSelect from "@/components/rm/userselect"
import { getToken } from '@/utils/auth'
import RmAreaSelect from "@/components/rm/areaselect"
import { file } from '@/api/imgUplodFile'

export default {
   name: 'drainage',
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
      visible: false,
       doUpload:process.env.BASE_FILE_API+"?token="+getToken(),
      fullscreenLoading: false,
      fileList:[],
       dialogImageUrl: '',
      dialogVisible: false,
      uploaddata:{
        bizId:"",
        bizType: "R",
      },
      listLoading:null,
      form: {
        id:null,
        type: "SX",
        name: null,
        lng: null,
        lat: null,
        description: null,
        area: null,
        code: null,
        river: null,
        sort:null
      },
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        importance: undefined,
        search: undefined,
        type: "SX",
        sort: '+id'
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
      getList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.count
      })
    },
    addRiver() {
      this.visible = true
      if (this.$refs.form !== undefined) {
        Object.assign(this.form, this.$options.data().form)
      }
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    edit(row) {
      this.visible = true
      Object.assign(this.form, row)
    },
	  save() {
      // this.fullscreenLoading = true;
      this.listLoading = true
      console.log('保存:', JSON.stringify(this.form))
      save(this.form).then(response => {
          // this.fullscreenLoading=false;
       console.log("     cosole.log(response);:::",response.data.id)
       this.uploaddata.bizId = response.data.id
       this.form.id = response.data.id
       console.log("upload::::",this.$refs.upload.uploadFiles.length)
       if (this.$refs.upload.uploadFiles !== undefined && this.$refs.upload.uploadFiles.length > 0){
         // this.$refs.upload.submit()
         // 上传到服务器
         const imgParams =  '&bizType=' + this.uploaddata.bizType + '&bizId=' + this.uploaddata.bizId

         file(imgParams, this.$refs.upload.uploadFiles).then(res => {
           // console.log('file----res', res)
         }).catch((errorRes) => {})
       } else {
         this.getList()
       }
       this.visible = false
       this.listLoading = false
      }).catch(error => {
        this.listLoading = false
        console.log("出错了。。。。。：：：", error)
      })
  },
    handleSuccess(){
      console.log('上传成功:',JSON.stringify(this.form))
      this.fileList = []
      this.getList()
    },
    removefile(file){
        console.log("删除文件：：：",file)
        delfiles({ ids:file.id }).then(response => {
            console.log("图片删除成功!!!!!")
       })
    },
    beforeUpload(file){
        // let fd = new FormData();
        // fd.append('file',file);//传文件
        // console.log("this.form.id:::::",this.form.id);
        // fd.append('bizId',this.form.id);//传其他参数
        // fd.append('bizType',"R");
        // uploadFile(fd).then(response => {
        //      alert('成功');
        //      return false;
        // }).catch(error => {
        //     console.log("error:::",error)
        // })

    },
    del(row) {
      console.log(row.id)
      del(row.id).then(response => {
            // this.fullscreenLoading=false;
       this.getList()
         // console.log("then:::")
      }).catch(error => {
        //  this.fullscreenLoading=false;
        this.listLoading = false
        // console.log(this.listLoading);
      })
    }
  }
}
</script>
