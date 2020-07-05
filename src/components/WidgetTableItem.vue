<template>
  <el-form-item
    class="widget-view"
    v-if="element && element.key"
    :class="{active: selectWidget.key == element.key, 'is_req': element.options.required}"
    :label="element.name"
    @click.native.stop="handleSelectWidget(index)"
  >
    <template v-if="element.type == 'elBaseTable'">
      <div style="width:100%">
        <el-table
          :ref="element.options.ref"
          :data="element.options.tableData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          :size="element.options.size"
          :max-height="element.options.maxHeight"
          :border="element.options.border"
          :stripe="element.options.stripe"
          :tooltip-effect="element.options.tooltipEffect"
          :fit="element.options.fit"
          :header-cell-style="element.options.headerCellStyle"
          @header-click="editCl"
        >
          <el-table-column
            v-for="(column) in element.options.columns"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth"
            :resizable="column.resizable"
            :fixed="column.fixed"
            :sortable="column.sortable"
            :show-overflow-tooltip="column.showOverflowTooltip"
            :align="column.align"
            :formatter="column.formatter"
            :class-name="element.options.selectCl && (element.options.selectCl.prop == column.prop)?'table-column-active':''"
          ></el-table-column>
        </el-table>
      </div>
    </template>

    <template v-if="element.type == 'elTreeTable'">
      <div style="width:100%">
        <el-table
          :data="element.options.tableData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          border
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            :key="column.prop"
            v-for="(column) in element.options.columns"
            :prop="column.prop"
            :label="column.label"
            :sortable="column.sortable"
            :width="column.width"
          ></el-table-column>
        </el-table>
      </div>
    </template>

    <template v-if="element.type == 'elMltipleTable'">
      <div style="width:100%">
        <el-table
          :ref="element.options.ref"
          :data="element.options.tableData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          :size="element.options.size"
          :max-height="element.options.maxHeight"
          :border="element.options.border"
          :stripe="element.options.stripe"
          :tooltip-effect="element.options.tooltipEffect"
          :fit="element.options.fit"
          :header-cell-style="element.options.headerCellStyle"
          @header-click="editCl"
        >
          <el-table-column type="selection" fixed width="50"></el-table-column>
          <el-table-column
            v-for="(column) in element.options.columns"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.minWidth"
            :resizable="column.resizable"
            :fixed="column.fixed"
            :sortable="column.sortable"
            :show-overflow-tooltip="column.showOverflowTooltip"
            :align="column.align"
            :class-name="element.options.selectCl && (element.options.selectCl.prop == column.prop)?'table-column-active':''"
          ></el-table-column>
        </el-table>
      </div>
    </template>

    <div class="widget-view-action" v-if="selectWidget.key == element.key">
      <i class="iconfont icon-icon_clone" @click.stop="handleWidgetClone(index)"></i>
      <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"></i>
    </div>

    <div class="widget-view-drag" v-if="selectWidget.key == element.key">
      <i class="iconfont icon-drag drag-widget"></i>
    </div>
  </el-form-item>
</template>

<script>
import FmUpload from "./Upload";
export default {
  props: ["element", "select", "index", "data"],
  components: {
    FmUpload
  },
  data() {
    return {
      selectWidget: this.select
    }
  },
  created() {  },
  mounted() {},
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index];
    },
    handleWidgetDelete(index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = this.data.list[index - 1];
        }
      } else {
        this.selectWidget = this.data.list[index + 1];
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1);
      });
    },
    handleWidgetClone(index) {
      let cloneData = {
        ...this.data.list[index],
        options: { ...this.data.list[index].options },
        key: Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999)
      };

      if (
        this.data.list[index].type === "radio" ||
        this.data.list[index].type === "checkbox" ||
        this.data.list[index].type === "select"
      ) {
        cloneData = {
          ...cloneData,
          options: {
            ...cloneData.options,
            options: cloneData.options.options.map(item => ({ ...item }))
          }
        };
      }

      this.data.list.splice(index, 0, cloneData);

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1];
      });
    },
    //点击编辑列
    editCl(cl, e) {
      console.log(cl);
      this.element.options.selectCl = this.element.options.columns.find(
        item => item.prop === cl.property
      );
    }
  },
  watch: {
    select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      handler(val) {
        debugger;
        this.$emit("update:select", val);
      },
      deep: true
    }
  }
};
</script>
<style>
.table-column-active {
  background-color: #e1e1e1 !important;
}
</style>
