<template>
  <el-form-item :label="widget.name" :prop="widget.model">

    <template v-if="widget.type == 'elBaseTable'">
      <div style="width:100%">
        <el-table
          :ref = "widget.options.ref"
          :data = "widget.options.tableData"
          style = "width: 100%;margin-bottom: 20px;"
          row-key = "id"
          :size = "widget.options.size"
          :max-height = "widget.options.maxHeight"
          :border = "widget.options.border"
          :stripe = "widget.options.stripe"
          :tooltip-effect = "widget.options.tooltipEffect"
          :fit = 'widget.options.fit'
          :header-cell-style = 'widget.options.headerCellStyle'
          >
          <el-table-column v-for="(column, index) in widget.options.columns"
            :prop = "column.prop"
            :label = "column.label"
            :min-width = "column.minWidth"
            :resizable = "column.resizable"
            :fixed = "column.fixed"
            :sortable = "column.sortable"
            :show-overflow-tooltip = "column.showOverflowTooltip"
            :align = "column.align" 
            >
          </el-table-column>
        </el-table>
      </div>
    </template>

    <template v-if="widget.type == 'elTreeTable'">
      <div style="width:100%">
        <el-table
          :data="widget.options.tableData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          border
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column v-for="(column, index) in widget.options.columns"
            :prop = "column.prop"
            :label = "column.label"
            :sortable = "column.sortable"
            :width = "column.width">
          </el-table-column>
        </el-table>
      </div>
    </template>
     <template v-if="widget.type == 'elMltipleTable'">
          <div style="width:100%">
            <el-table
              :ref = "widget.options.ref"
              :data = "widget.options.tableData"
              style = "width: 100%;margin-bottom: 20px;"
              row-key = "id"
              :size = "widget.options.size"
              :max-height = "widget.options.maxHeight"
              :border = "widget.options.border"
              :stripe = "widget.options.stripe"
              :tooltip-effect = "widget.options.tooltipEffect"
              :fit = 'widget.options.fit'
              :header-cell-style = 'widget.options.headerCellStyle'
              >
              <el-table-column
                type="selection"
                fixed
                width="50">
              </el-table-column>
              <el-table-column v-for="(column, index) in widget.options.columns"
                :prop = "column.prop"
                :label = "column.label"
                :min-width = "column.minWidth"
                :resizable = "column.resizable"
                :fixed = "column.fixed"
                :sortable = "column.sortable"
                :show-overflow-tooltip = "column.showOverflowTooltip"
                :align = "column.align"
                >
              </el-table-column>
            </el-table>
          </div>
        </template>
  </el-form-item>
</template>

<script>
import FmUpload from './Upload'

export default {
  props: ['widget', 'models', 'rules', 'remote'],
  components: {
    FmUpload
  },
  data () {
    return {
      dataModel: this.models[this.widget.model]
    }
  },
  created () {
    if (this.widget.options.remote && this.remote[this.widget.options.remoteFunc]) {
      this.remote[this.widget.options.remoteFunc]((data) => {
        this.widget.options.remoteOptions = data.map(item => {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            children: item[this.widget.options.props.children]
          }
        })
      })
    }

    if (this.widget.type === 'imgupload' && this.widget.options.isQiniu) {
      this.remote[this.widget.options.tokenFunc]((data) => {
        this.widget.options.token = data
      })
    }
  },
  methods: {
     //点击编辑列
    editCl(cl,e){
      // alert(JSON.stringify(cl))
    }
  },
  watch: {
    dataModel: {
      deep: true,
      handler (val) {
        this.models[this.widget.model] = val
        this.$emit('update:models', {
          ...this.models,
          [this.widget.model]: val
        })
        this.$emit('input-change', val, this.widget.model)
      }
    },
    models: {
      deep: true,
      handler (val) {
        this.dataModel = val[this.widget.model]
      }
    }
  }
}
</script>
