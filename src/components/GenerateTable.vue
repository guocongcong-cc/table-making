<template>
  <div>
    <el-form ref="generateTable" 
      label-suffix=":"
      :size="data.config.size"
      :model="models" :rules="rules" :label-position="data.config.labelPosition" :label-width="data.config.labelWidth + 'px'">
      <template v-for="item in data.list">
          <generate-table-item 
            :key="item.key" 
            :models.sync="models" 
            :rules="rules" 
            :widget="item" 
            @input-change="onInputChange"
            :remote="remote">
          </generate-table-item>   
      </template>
    </el-form>
  </div>
</template>

<script>
import GenerateTableItem from './GenerateTableItem'
import {loadJs} from '../util/index.js'

export default {
  name: 'fm-generate-table',
  components: {
    GenerateTableItem
  },
  props: ['data', 'remote', 'value', 'insite'],
  data () {
    return {
      models: {},
      rules: {}
    }
  },
  created () {
    this.generateModle(this.data.list)
  },
  mounted () {
  },
  methods: {
    generateModle (genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this.generateModle(item.list)
          })
        } else {
          if (this.value && Object.keys(this.value).indexOf(genList[i].model) >= 0) {
            this.models[genList[i].model] = this.value[genList[i].model]
          } else {
            if (genList[i].type === 'blank') {
              this.$set(this.models, genList[i].model, genList[i].options.defaultType === 'String' ? '' : (genList[i].options.defaultType === 'Object' ? {} : []))
            } else {
              this.models[genList[i].model] = genList[i].options.defaultValue
            }      
          }
          
          if (this.rules[genList[i].model]) {
            
            this.rules[genList[i].model] = [...this.rules[genList[i].model], ...genList[i].rules.map(item => {
              if (item.pattern) {
                return {...item, pattern: eval(item.pattern)}
              } else {
                return {...item}
              }
            })]
          } else {
            
            this.rules[genList[i].model] = [...genList[i].rules.map(item => {
              if (item.pattern) {
                return {...item, pattern: eval(item.pattern)}
              } else {
                return {...item}
              }
            })]
          }      
        }
      }
    },
    getData () {
      return new Promise((resolve, reject) => {
        this.$refs.generateTable.validate(valid => {
          if (valid) {
            resolve(this.models)
          } else {
            reject(new Error(this.$t('tb.message.validError')).message)
          }
        })
      })
    },
    reset () {
      this.$refs.generateTable.resetFields()
    },
    onInputChange (value, field) {
      this.$emit('on-change', field, value, this.models)
    },
    refresh () {
      
    }
  },
  watch: {
    data: {
      deep: true,
      handler (val) {
        this.generateModle(val.list)
      }
    },
    value: {
      deep: true,
      handler (val) {
        console.log(JSON.stringify(val))
        this.models = {...this.models, ...val}
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/cover.scss';
</style>
