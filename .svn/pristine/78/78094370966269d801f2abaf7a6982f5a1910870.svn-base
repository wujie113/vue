<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Activity name">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="Activity name"> 
         <treeselect
					  :load-options="loadOrgs"
					  :options="orgs"
					  value="node"
					  v-model="form.org"
					  :auto-load-root-options="false"
					  :multiple="false"  
					  no-children-text="空记录"  retry-text="重试"  value-format="object"
					  placeholder="选择部门..."
					  />
      </el-form-item>

      
    </el-form>
  </div>
</template>

<script>
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { list,loadTreeSelectOrgs } from "@/api/core/org";

export default {
  components: { Treeselect },
  data() {
    return {
      form: {
        name: "",
        org: { name: "", id: "-", label: "-" },
        orgId: ""
      },
      orgs: null
    };
  },
  methods: {
    onSubmit() {
      this.$message("submit!");
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning"
      });
    },
    loadOrgs({ action, parentNode, callback }) {
      console.log(action, parentNode, this.org); 
      //动态加载部门列表
      loadTreeSelectOrgs(this,action, parentNode, callback)       
    }
  }
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

