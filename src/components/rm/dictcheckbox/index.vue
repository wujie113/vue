
<template>
  <el-checkbox-group :min="min" :max="max" :value="value" @input="handleInput" >
    <el-checkbox v-for="(item,key ) in optionlists" :key="key" :name="'name['+key+']'" :label="item.value">{{item.label}}</el-checkbox>
  </el-checkbox-group>

</template> 
<script>
  import { getdictList } from "@/components/rm/dict/dict.js"
  export default {
    name: "RmDictCheckbox",
    props: {
      value: {
        required: false
      },
      title: {
        required: false,
        type: String
      },
      type: {
        required: true,
        type: String
      }, min: {
        required: false,
        type: Number,
        default: 0
      }, max: {
        required: false,
        type: Number 
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
        //console.log('checkbox:',JSON.stringify(value))
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
