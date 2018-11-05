<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
        <div class="panel">
          <div class="panelHeading">
            <div>
              <svg-icon icon-class="tree" />行政区域
            </div>
            <div class="btn-group">
              <button class="btn mini" @click="refreshBtn">
                <i class="el-icon-refresh"></i>
              </button>
              <button class="btn mini" @click="addBtn">
                <i class="el-icon-circle-plus"></i>
              </button>
              <button class="btn mini" @click="deleteBtn">
                <i class="el-icon-delete"></i>
              </button>
            </div>
          </div>
          <div class="source panel-body">
            <el-tree :data="dataArray" node-key="id" :props="defaultProps" @node-click="handleNodeClick" empty-text="暂无数据" highlight-current></el-tree>
          </div>
        </div>
      </el-col>
      <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
        <div class="panel">
          <div class="panelHeading">
            <div>
              <svg-icon icon-class="edit" />{{ leftName }}：{{ firstNode }}
            </div>
          </div>
          <div class="source">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading="loading">
              <el-form-item label="名称" prop="name" required>
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input type="number" v-model="ruleForm.sort"></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="desc">
                <el-input type="textarea" v-model="ruleForm.desc" :rows="4"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { AreaTree, AreaMytree, Delete, Add, Datails } from "@/api/setting/areaTree"
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        sort: "",
        desc: ""
      },
      loading: false,
      rules: {
        name: [
          { required: true, message: "请输入地点名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        sort: [{ required: false, message: "", trigger: "change" }],
        desc: [{ required: false, message: "请填写描述内容", trigger: "blur" }]
      },
      dataArray: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      firstNode: "",
      leftName: "编辑站点"
    }
  },
  created() {
    this.AreaTree()
  },
  methods: {
    // 提交
    submitForm(formName) {
      console.log(this.$refs)
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("ruleForm", this.ruleForm)

          const params = {
            name: this.ruleForm.name
          }
          let message = ""
          if (this.leftName == "编辑站点") {
            if (this.ruleForm.sort) {
              params.sort = this.ruleForm.sort
            }
            if (this.ruleForm.desc) {
              params.desc = this.ruleForm.desc
            }
            // 有记录ID,是修改
            if (this.nodeData.id) {
              params.id = this.nodeData.id
            }
            if (this.nodeData.parentId) {
              params["parent.id"] = this.nodeData.parentId
            }
            message = "修改成功"
          } else if (this.leftName == "添加站点") {
            if (this.ruleForm.sort) {
              params.sort = this.ruleForm.sort
            }
            if (this.ruleForm.desc) {
              params.desc = this.ruleForm.desc
            }
            if (this.nodeData.parentId) {
              params["parent.id"] = this.nodeData.id
            }
            message = "添加成功"
          }

          console.log("params", params)
          this.loading = true
          Add(params).then(res => {
            this.loading = false
            this.$message({
              showClose: true,
              message: message,
              type: "success",
              center: true
            })
            this.AreaTree()
          }).catch(error => {
            this.loading = false
          })
        } else {
          console.log("error submit!!")
          this.$message({
            showClose: true,
            message: "请填写完整",
            type: "error",
            center: true
          })
          return false
        }
      })
    },
    handleNodeClick(data) {
      console.log("节点信息", data)
      this.leftName = "编辑站点"
      this.nodeData = data
      this.firstNode = this.nodeData.label
      this.ruleForm.name = this.nodeData.label
      this.ruleForm.sort = this.nodeData.sort
    },
    AreaTree() {
      AreaTree().then(res => {
        this.dataArray = res.data.list
        this.firstNode = res.data.list[0].label
        this.ruleForm.name = res.data.list[0].label
        this.ruleForm.sort = res.data.list[0].sort
        this.nodeData = res.data.list[0]
      }).catch(errorRes => { })
    },
    refreshBtn() {
      this.AreaTree()
      this.leftName = "编辑站点"
    },
    // 添加
    addBtn() {
      const param = this.ruleForm
      this.leftName = "添加站点"
      this.$refs.ruleForm.resetFields()
      this.ruleForm.sort = 100
    },
    // 删除
    deleteBtn() {
      const ids = this.nodeData.id
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Delete(ids).then(res => {
          this.AreaTree()
          this.$message({
            type: "success",
            message: "删除成功!"
          })
        }).catch(errorRes => {
          this.$message({
            type: "error",
            message: "网络错误!"
          })
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  .panel {
    margin-bottom: 0;
    min-height: 86vh;
    overflow: auto;
    background-color: #fff;
    border: 1px solid transparent;
    border-color: #ddd;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    .panelHeading {
      color: #333;
      background-color: #f5f5f5;
      border-color: #ddd;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 39px;
      padding: 8px 15px;
      border-bottom: 1px solid transparent;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
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
</style>
