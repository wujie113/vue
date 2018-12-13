<template>
  <treeselect
    :load-options="loadAreas"
    :options="areas"
    :auto-load-root-options="autoload"
    :value="value"
    :multiple="multiple"
    value-consists-of="LEAF_PRIORITY"
    no-children-text="空记录"
    retry-text="重试"
    :value-format="format"
    placeholder="选择部门..."
    @input="handleInput"
    :normalizer="normalizer"
    :defaultExpandLevel="defaultExpand"
  />
</template> 
<script>
  // import the component
  import Treeselect from "@riophae/vue-treeselect"
  // import the styles
  import "@riophae/vue-treeselect/dist/vue-treeselect.css"
  import { tree } from "@/api/core/area"
  export default {
    components: { Treeselect },
    name: "RmAreaSelect",
    props: {
      value: {
        required: false
      },
      format: {
        required: false,
        type: String,
        default: "object"
      },
      multiple: {
        required: false,
        type: Boolean,
        default: false
      },
      autoload: {
        required: false,
        type: Boolean,
        default: false
      },
        defaultExpand: {
        required: false,
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        areas: null,
        normalizer(node) {
          //console.log('normalizer:',node)
          node.label = node.label || node.name
          return node
        }
      }
    },
    computed: {},
    created() { 
        // this.loadAreas({action:'LOAD_ROOT_OPTIONS'}); 
    },
    methods: {
      handleInput(value, instanceId) {
        console.log('value', JSON.stringify(value))
        this.$emit("input", value)
      },
      handleSelect(node, instanceId) {
        console.log("node:", node)
        console.log("instanceId:", instanceId)

        //支持v-model方式
        //  console.log("input :", JSON.stringify(this.value));
        if (this.multiple) {
          this.value.push(node)
          this.$emit("input", this.value)
        } else {
          this.$emit("input", node)
        }
        //this.$emit('update:org',node)
      },
      loadAreas({ action, parentNode, callback }) { 
        console.log(action, parentNode, callback)
        var self = this
        var pid = null
        if (action !== "LOAD_ROOT_OPTIONS") {
          pid = parentNode.id
        }
        tree(pid)
          .then(response => {
            //console.log("response:::", response);
            const data = response.data
            var list = data.list
            if (list.length === 0) {
              if (pid) parentNode.children = undefined
              callback()
              return
            }
            self.areas = list
            if(self.areas.children.length>0){
              areas = open  
            }else{
              areas = close
            }
            callback()
          })
          .catch(error => {
            console.log(error)
            callback()
          })
      }
    }
  }
</script>

<style scoped>
</style>
