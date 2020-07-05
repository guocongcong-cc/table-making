<template>
  <el-container class="fm2-container">
    <el-main class="fm2-main">
      <el-container>
        <el-aside width="180px">
          <div class="components-list">
            <template v-if="easyTableFields.length">
              <div class="widget-cate">{{$t('tb.components.easyTable.title')}}</div>
              <draggable tag="ul" :list="easyTableComponents" 
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                @end="handleMoveEnd"
                @start="handleMoveStart"
                :move="handleMove"
              >
                <li v-if="easyTableFields.indexOf(item.type) >=0" class="form-edit-widget-label no-put" v-for="(item, index) in easyTableComponents" :key="index">
                  <a>
                    <i class="icon table" :class="item.icon"></i>
                    <span>{{item.name}}</span>
                  </a>
                </li>
              </draggable>
            </template>       
          </div>         
        </el-aside>
        <el-container class="center-container" direction="vertical">
          <el-header class="btn-bar" style="height: 45px;">
            <slot name="action">
            </slot>
            <el-button v-if="upload" type="text" size="medium" icon="el-icon-upload2" @click="handleUpload">{{$t('tb.actions.import')}}</el-button>
            <el-button v-if="clearable" type="text" size="medium" icon="el-icon-delete" @click="handleClear">{{$t('tb.actions.clear')}}</el-button>
            <el-button v-if="preview" type="text" size="medium" icon="el-icon-view" @click="handlePreview">{{$t('tb.actions.preview')}}</el-button>
            <el-button v-if="generateJson" type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateJson">{{$t('tb.actions.json')}}</el-button>
            <el-button v-if="generateCode" type="text" size="medium" icon="el-icon-document" @click="handleGenerateCode">{{$t('tb.actions.code')}}</el-button>
          </el-header>
          <el-main :class="{'widget-empty': widgetForm.list.length == 0}">
            
            <widget-table v-if="!resetJson"  ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect"></widget-table>
          </el-main>
        </el-container>
        
        <el-aside style="width:310px" class="widget-config-container">
          <el-container>
            <el-header height="45px">
              <div class="config-tab" :class="{active: configTab=='widget'}" @click="handleConfigSelect('widget')">{{$t('tb.config.widget.title')}}</div>
              <div class="config-tab" :class="{active: configTab=='form'}" @click="handleConfigSelect('form')">{{$t('tb.config.form.title')}}</div>
            </el-header>
            <el-main class="config-content">
              <widget-config v-show="configTab=='widget'" :data="widgetFormSelect"></widget-config>
              <table-config v-show="configTab=='form'" :data="widgetForm.config" :selectData="widgetFormSelect"></table-config>
            </el-main>
          </el-container>
          
        </el-aside>

        <cus-dialog
          :visible="previewVisible"
          @on-close="previewVisible = false"
          ref="widgetPreview"
          width="1000px"
          form
        >
          <generate-table insite="true" @on-change="handleDataChange" v-if="previewVisible" :data="widgetForm" :value="widgetModels" :remote="remoteFuncs" ref="generateTable">

            <template v-slot:blank="scope">
              Width <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
              Height <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
            </template>
          </generate-table>

          <template slot="action">
            <el-button type="primary" @click="handleTest">{{$t('tb.actions.getData')}}</el-button>
            <el-button @click="handleReset">{{$t('tb.actions.reset')}}</el-button>
          </template>
        </cus-dialog>

        <cus-dialog
          :visible="uploadVisible"
          @on-close="uploadVisible = false"
          @on-submit="handleUploadJson"
          ref="uploadJson"
          width="800px"
          form
        >
          <el-alert type="info" :title="$t('tb.description.uploadJsonInfo')"></el-alert>
          <div id="uploadeditor" style="height: 400px;width: 100%;">{{jsonEg}}</div>
        </cus-dialog>

        <cus-dialog
          :visible="jsonVisible"
          @on-close="jsonVisible = false"
          ref="jsonPreview"
          width="800px"
          form
        >
          
          <div id="jsoneditor" style="height: 400px;width: 100%;">{{jsonTemplate}}</div>
          
          <template slot="action">
            <el-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">{{$t('tb.actions.copyData')}}</el-button>
          </template>
        </cus-dialog>

        <cus-dialog
          :visible="codeVisible"
          @on-close="codeVisible = false"
          ref="codePreview"
          width="800px"
          form
          :action="false"
        >
          <el-tabs type="border-card" style="box-shadow: none;" v-model="codeActiveName">
            <el-tab-pane label="Vue Component" name="vue">
              <div id="vuecodeeditor" style="height: 500px; width: 100%;">{{vueTemplate}}</div>
            </el-tab-pane>
            <el-tab-pane label="HTML" name="html">
              <div id="codeeditor" style="height: 500px; width: 100%;">{{htmlTemplate}}</div>
            </el-tab-pane>
          </el-tabs>
        </cus-dialog>
      </el-container>
    </el-main>
    <el-footer height="30px" style="font-weight: 600;">Powered by <a target="_blank" href="https://github.com/GavinZhuLei/vue-form-making">vue-table-making</a></el-footer>
  </el-container>
  
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import TableConfig from './TableConfig'
import WidgetTable from './WidgetTable'
import CusDialog from './CusDialog'
import GenerateTable from './GenerateTable'
import Clipboard from 'clipboard'
import {basicComponents, layoutComponents, advanceComponents,easyTableComponents} from './componentsConfig.js'
import {loadJs, loadCss} from '../util/index.js'
import request from '../util/request.js'
import generateCode from './generateCode.js'

export default {
  name: 'fm-making-table',
  components: {
    Draggable,
    WidgetConfig,
    TableConfig,
    WidgetTable,
    CusDialog,
    GenerateTable
  },
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    generateCode: {
      type: Boolean,
      default: false
    },
    generateJson: {
      type: Boolean,
      default: false
    },
    upload: {
      type: Boolean, 
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    basicFields: {
      type: Array,
      default: () => ['input', 'textarea', 'number', 'radio', 'checkbox', 'time', 'date', 'rate', 'color', 'select', 'switch', 'slider', 'text']
    },
    advanceFields: {
      type: Array,
      default: () => ['blank', 'imgupload', 'editor', 'cascader']
    },
    layoutFields: {
      type: Array,
      default: () => ['grid']
    },
    easyTableFields: {
      type: Array,
      default: () => ['elBaseTable','elTreeTable','elMltipleTable','easyTable']
    }
  },
  data () {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      easyTableComponents,
      resetJson: false,
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small'
        },
      },
      configTab: 'widget',
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      uploadVisible: false,
      remoteFuncs: {
        func_test (resolve) {
          setTimeout(() => {
            const options = [
              {id: '1', name: '1111'},
              {id: '2', name: '2222'},
              {id: '3', name: '3333'}
            ]

            resolve(options)
          }, 2000)
        },
        funcGetToken (resolve) {
          request.get('http://tools-server.xiaoyaoji.cn/api/uptoken').then(res => {
            resolve(res.uptoken)
          })
        },
        upload_callback (response, file, fileList) {
          console.log('callback', response, file, fileList)
        }
      },
      widgetModels: {},
      blank: '',
      htmlTemplate: '',
      vueTemplate: '',
      jsonTemplate: '',
      uploadEditor: null,
      jsonCopyValue: '',
      jsonClipboard: null,
      jsonEg: `{
  "list": [],
  "config": {
    "labelWidth": 100,
    "labelPosition": "top",
    "size": "small"
  }
}`,
      codeActiveName: 'vue',
    }
  },
  mounted () {
    this._loadComponents()
  },
  methods: {
    _loadComponents () {
      this.basicComponents = this.basicComponents.map(item => {
        return {
          ...item,
          name: this.$t(`tb.components.fields.${item.type}`)
        }
      })
      this.advanceComponents = this.advanceComponents.map(item => {
        return {
          ...item,
          name: this.$t(`tb.components.fields.${item.type}`)
        }
      })
      this.layoutComponents = this.layoutComponents.map(item => {
        return {
          ...item,
          name: this.$t(`tb.components.fields.${item.type}`)
        }
      })
      this.easyTableComponents = this.easyTableComponents.map(item => {
        return {
          ...item,
          name: this.$t(`tb.components.fields.${item.type}`)
        }
      })
    },
    handleGoGithub () {
      // window.location.href = 'https://github.com/GavinZhuLei/vue-form-making'
    },
    handleConfigSelect (value) {
      this.configTab = value
    },
    handleMoveEnd (evt) {
      console.log('end', evt)
    },
    handleMoveStart ({oldIndex}) {
      console.log('start', oldIndex, this.basicComponents)
    },
    handleMove () {
      return true
    },
    handlePreview () {
      console.log(this.widgetForm)
      this.previewVisible = true
    },
    handleTest () {
      this.$refs.generateTable.getData().then(data => {
        this.$alert(data, '').catch(e=>{})
        this.$refs.widgetPreview.end()
      }).catch(e => {
        this.$refs.widgetPreview.end()
      })
    },
    handleReset () {
      this.$refs.generateTable.reset()
    },
    handleGenerateJson () {
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      console.log(JSON.stringify(this.widgetForm))
      this.$nextTick(() => {

        const editor = ace.edit('jsoneditor')
        editor.session.setMode("ace/mode/json")

        if (!this.jsonClipboard) {
          this.jsonClipboard = new Clipboard('.json-btn')
          this.jsonClipboard.on('success', (e) => {
            this.$message.success(this.$t('tb.message.copySuccess'))
          })
        }
        this.jsonCopyValue = JSON.stringify(this.widgetForm)
      })
    },
    handleGenerateCode () {

      this.codeVisible = true
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm), 'html')
      this.vueTemplate = generateCode(JSON.stringify(this.widgetForm), 'vue')
      this.$nextTick(() => {
        const editor = ace.edit('codeeditor')
        editor.session.setMode("ace/mode/html")

        const vueeditor = ace.edit('vuecodeeditor')
        vueeditor.session.setMode("ace/mode/html")
      })
    },
    handleUpload () {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.uploadEditor = ace.edit('uploadeditor')
        this.uploadEditor.session.setMode("ace/mode/json")
      })
    },
    handleUploadJson () {
      try {
        this.setJSON(JSON.parse(this.uploadEditor.getValue()))
        this.uploadVisible = false
      } catch (e) {
        this.$message.error(e.message)
        this.$refs.uploadJson.end()
      }
    },
    handleClear () {
      this.widgetForm = {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small',
          customClass: ''
        },
      }

      this.widgetFormSelect = {}
    },
    getJSON () {
      return this.widgetForm
    },
    getHtml () {
      return generateCode(JSON.stringify(this.widgetForm))
    },
    setJSON (json) {
      this.widgetForm = json

      if (json.list.length> 0) {
        this.widgetFormSelect = json.list[0]
      }
    },
    handleInput (val) {
      console.log(val)
      this.blank = val
    },
    handleDataChange (field, value, data) {
      console.log(field, value, data)
    }
  },
  watch: {
    widgetForm: {
      deep: true,
      handler: function (val) {
        console.log(this.$refs.widgetForm)
      }
    },
    '$lang': function (val) {
      this._loadComponents()
    }
  }
}
</script>

<style lang="scss">
.widget-empty{
  background-position: 50%;
}

</style>
