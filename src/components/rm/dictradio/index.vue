
<template>
  <el-radio-group  :value="value" @input="handleInput">
    <el-radio v-for="item in optionlists" :key="item.value" :label="item.value">{{item.label}}</el-radio>
  </el-radio-group>

</template> 
<script>
  import { getdictList } from "@/components/rm/dict/dict.js"
  export default {
    name: "RmDictRadio",
    props: {
      value: {
        required: false
      },
      placeholder: {
        required: false,
        type: String,
        default: "--请选择--"
      },
      title: {
        required: false,
        type: String
      },
      type: {
        required: true,
        type: String
      }
    },
    data() {
      return {
        optionlists: [] 
      }
    },
    computed: {},
    created() {
      this.getDictList()
    },
    methods: {
      getDictList() { 
        getdictList(this.type).then(response => {
          this.optionlists = response.data.list
          //console.log(" this.optionlists ", this.optionlists)
        })
      },
       handleInput(value, instanceId) {        
        this.$emit("input", value)
      } 
    }
  }
</script>

<style scoped>
  .pagination-container {
    background: #fff;
    padding: 32px 16px;
  }
  .pagination-container.hidden {
    display: none;
  }
</style>
