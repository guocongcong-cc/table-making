<template>
  <div v-if="show">
    <el-form label-position="left">
      <el-form-item :label="$t('tb.config.widget.option')" v-if="Object.keys(data.options).indexOf('options')>=0">
        <el-radio-group v-model="data.options.remote" size="mini" style="margin-bottom:10px;">
          <el-radio-button :label="false">{{$t('tb.config.widget.staticData')}}</el-radio-button>
          <el-radio-button :label="true">{{$t('tb.config.widget.remoteData')}}</el-radio-button>
        </el-radio-group>
        <template v-if="data.options.remote">
          <div>
            <el-input size="mini" style="" v-model="data.options.remoteFunc">
              <template slot="prepend">{{$t('tb.config.widget.remoteFunc')}}</template>
            </el-input>
            <el-input size="mini" style="" v-model="data.options.props.value">
              <template slot="prepend">{{$t('tb.config.widget.value')}}</template>
            </el-input>
            <el-input size="mini" style="" v-model="data.options.props.label">
              <template slot="prepend">{{$t('tb.config.widget.label')}}</template>
            </el-input>
          </div>
        </template>
        <template v-else>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddOption">{{$t('tb.actions.addOption')}}</el-button>
          </div>
        </template>
      </el-form-item>

      <el-form-item :label="$t('tb.config.widget.remoteData')" v-if="data.type=='cascader'">
        <div>
          <el-input size="mini" style="" v-model="data.options.remoteFunc">
            <template slot="prepend">{{$t('tb.config.widget.remoteFunc')}}</template>
          </el-input>
          <el-input size="mini" style="" v-model="data.options.props.value">
            <template slot="prepend">{{$t('tb.config.widget.value')}}</template>
          </el-input>
          <el-input size="mini" style="" v-model="data.options.props.label">
            <template slot="prepend">{{$t('tb.config.widget.label')}}</template>
          </el-input>
          <el-input size="mini" style="" v-model="data.options.props.children">
            <template slot="prepend">{{$t('tb.config.widget.childrenOption')}}</template>
          </el-input>
        </div>
      </el-form-item>

      <el-form-item :label="$t('tb.config.widget.defaultValue')" v-if="Object.keys(data.options).indexOf('defaultValue')>=0 && (data.type == 'textarea' || data.type == 'input' || data.type=='rate' || data.type=='color' || data.type=='switch')">
        <el-input v-if="data.type=='textarea'" type="textarea" :rows="5" v-model="data.options.defaultValue"></el-input>
        <el-input v-if="data.type=='input'" v-model="data.options.defaultValue"></el-input>
        <el-rate v-if="data.type == 'rate'" style="display:inline-block;vertical-align: middle;" :max="data.options.max" :allow-half="data.options.allowHalf" v-model="data.options.defaultValue"></el-rate>
        <el-button type="text" v-if="data.type == 'rate'" style="display:inline-block;vertical-align: middle;margin-left: 10px;" @click="data.options.defaultValue=0">{{$t('tb.actions.clear')}}</el-button>
        <el-color-picker 
          v-if="data.type == 'color'"
          v-model="data.options.defaultValue"
          :show-alpha="data.options.showAlpha"
        ></el-color-picker>
        <el-switch v-if="data.type=='switch'" v-model="data.options.defaultValue"></el-switch>
      </el-form-item>

      <template v-if="data.type=='elBaseTable' || data.type=='elMltipleTable'">
        <div v-if="activeName != 'addCl'" style="text-align: center;">
          <el-button type="text" @click="initAddColumn">{{$t('tb.actions.addColumn')}}</el-button>
        </div>
        <el-collapse v-model="activeName" accordion  @change="handleCollChange">
          <el-collapse-item v-if="activeName == 'addCl'" :title="$t('tb.config.widget.newColunmAttr')" name="addCl">
            <div>
              <el-form-item label-width="70px" :label="$t('tb.config.widget.columnName')+':'">
                <el-input style="width:190px" v-model="tempSelectCl.label"></el-input>
              </el-form-item>
              <el-form-item label-width="70px" :label="$t('tb.config.widget.dataName')+':'">
                <el-input style="width:190px" v-model="tempSelectCl.prop"></el-input>
              </el-form-item>
              <el-form-item label-width="70px" :label="$t('tb.config.widget.dataType')+':'">
                <el-select v-model="tempSelectCl.propType">
                  <el-option value="string" :label="$t('tb.config.widget.string')"></el-option>
                  <el-option value="number" :label="$t('tb.config.widget.number')"></el-option>
                  <el-option value="dateTime" :label="$t('tb.config.widget.dateTime')"></el-option>
                  <el-option value="amount" :label="$t('tb.config.widget.amount')"></el-option>
                  <el-option value="custom" :label="$t('tb.config.widget.custom')"></el-option>
                </el-select>
              </el-form-item>
              <div class="format-box" v-if="tempSelectCl.propType == 'number'">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>{{$t('tb.config.widget.numberFormat')}}</span>
                  </div>
                  <el-form-item label-width="100px" :label="$t('tb.config.widget.thousandSymbol')+':'">
                    <el-input  style="width:100px" placeholder="," v-model="tempSelectCl.formatConfig.number_format.thousands_sep"></el-input>
                  </el-form-item>
                  <el-form-item label-width="100px" :label="$t('tb.config.widget.decimalSymbol')+':'">
                    <el-input  style="width:100px" placeholder="." v-model="tempSelectCl.formatConfig.number_format.dec_point"></el-input>
                  </el-form-item>
                  <el-form-item label-width="100px" :label="$t('tb.config.widget.reservedBits')+':'">
                    <el-input  style="width:100px" placeholder="4" v-model="tempSelectCl.formatConfig.number_format.decimals"></el-input>
                  </el-form-item>
                </el-card>
              </div>
              <div class="format-box" v-if="tempSelectCl.propType == 'dateTime'">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>{{$t('tb.config.widget.dateFormat')}}</span>
                  </div>
                  <el-form-item label-width="70px" :label="$t('tb.config.widget.format')+':'">
                    <el-input  style="width:160px" placeholder="{y}-{m}-{d} {h}:{i}:{s}" v-model="tempSelectCl.formatConfig.dataTme_format.formatstr"></el-input>
                  </el-form-item>
                </el-card>
              </div>
              <div class="format-box" v-if="tempSelectCl.propType == 'amount'">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>{{$t('tb.config.widget.amountFormat')}}</span>
                  </div>
                  <el-form-item label-width="100px" :label="$t('tb.config.widget.amountWords')+':'">
                    <el-radio-group v-model="tempSelectCl.formatConfig.amount_format.isWords">
                      <el-radio-button :label="false">{{$t('tb.config.widget.no')}}</el-radio-button>
                      <el-radio-button :label="true">{{$t('tb.config.widget.yes')}}</el-radio-button>
                    </el-radio-group>     
                  </el-form-item>
                </el-card>
              </div>
              <div class="format-box" v-if="tempSelectCl.propType == 'custom'">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>{{$t('tb.config.widget.customMethod')}}</span>
                  </div>
                  <el-input :disabled="true" v-model="tempSelectCl.formatter.toString()" style="width:230px" type="textarea"></el-input>
                  <div style="margin-top:20px;text-align: center;">
                    <el-button type="primary" size="mini" @click="openEditeCode">{{$t('tb.config.widget.editCode')}}</el-button>
                  </div>
                </el-card>
              </div>

              <el-form-item label-width="70px" :label="$t('tb.config.widget.minWidth')+':'">
                <el-input style="width:190px" v-model="tempSelectCl.minWidth"></el-input>
              </el-form-item>
              <el-form-item label-width="70px" :label="$t('tb.config.widget.align')+':'">
                <el-radio-group v-model="tempSelectCl.align">
                  <el-radio-button label="left">{{$t('tb.config.widget.left')}}</el-radio-button>
                  <el-radio-button label="center">{{$t('tb.config.widget.center')}}</el-radio-button>
                  <el-radio-button label="right">{{$t('tb.config.widget.right')}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item  label-width="70px" :label="$t('tb.config.widget.columnSort')+':'">
                <el-radio-group v-model="tempSelectCl.sortable">
                  <el-radio-button :label="false">{{$t('tb.config.widget.no')}}</el-radio-button>
                  <el-radio-button :label="true">{{$t('tb.config.widget.yes')}}</el-radio-button>
                </el-radio-group>     
              </el-form-item>
              <el-form-item  label-width="70px" :label="$t('tb.config.widget.columnFixed')+':'">
                <el-radio-group v-model="tempSelectCl.fixed">
                  <el-radio-button :label="false">{{$t('tb.config.widget.no')}}</el-radio-button>
                  <el-radio-button :label="true">{{$t('tb.config.widget.yes')}}</el-radio-button>
                </el-radio-group>     
              </el-form-item>
              <el-form-item  label-width="70px" :label="$t('tb.config.widget.draggable')+':'">
                <el-radio-group v-model="tempSelectCl.resizable">
                  <el-radio-button :label="false">{{$t('tb.config.widget.no')}}</el-radio-button>
                  <el-radio-button :label="true">{{$t('tb.config.widget.yes')}}</el-radio-button>
                </el-radio-group>     
              </el-form-item>
              <el-form-item  label-width="70px" :label="$t('tb.config.widget.longTip')+':'">
                <el-radio-group v-model="tempSelectCl.showOverflowTooltip">
                  <el-radio-button :label="false">{{$t('tb.config.widget.no')}}</el-radio-button>
                  <el-radio-button :label="true">{{$t('tb.config.widget.yes')}}</el-radio-button>
                </el-radio-group>     
              </el-form-item>
            </div>
            
            <div style="text-align:center">
              <el-button type="primary" size="mini" @click="handleAddOrEditTableColumn(tempSelectCl,'add')">{{$t('tb.config.widget.addColumn')}}</el-button>
            </div>
          </el-collapse-item>
          <el-collapse-item :title="$t('tb.config.widget.editColumn')" v-if="data.options.columns.length>0" name="editCl">
            <div v-if="! data.options.selectCl">
              <el-alert
                :title="$t('tb.config.widget.selectTip')+':'"
                type="info">
              </el-alert>
            </div>
            <div v-if="data.options.selectCl">
              <el-form-item label-width="70px" :label="$t('tb.config.widget.columnName')+':'">
                  <el-input style="width:190px" v-model="data.options.selectCl.label"></el-input>
              </el-form-item>
              <el-form-item label-width="70px" :label="$t('tb.config.widget.dataName')+':'">
                <el-input style="width:190px" :disabled="true" v-model="data.options.selectCl.prop"></el-input>
              </el-form-item>
              <el-form-item label-width="70px" :label="$t('tb.config.widget.dataType')+':'">
                  <el-input style="width:190px" :disabled="true" v-model="data.options.selectCl.propType"></el-input>
                  <el-button style="padding-top:20px" type="text" size="mini" @click="openEditColmunData">{{$t('tb.config.widget.editDataType')}}</el-button>
              </el-form-item>
              <el-form-item label-width="70px" :label="$t('tb.config.widget.minWidth')+':'">
                  <el-input style="width:190px" v-model="data.options.selectCl.minWidth"></el-input>
              </el-form-item>
              <el-form-item label-width="70px" :label="$t('tb.config.widget.align')+':'">
                <el-radio-group v-model="data.options.selectCl.align">
                  <el-radio-button label="left">{{$t('tb.config.widget.left')}}</el-radio-button>
                  <el-radio-button label="center">{{$t('tb.config.widget.center')}}</el-radio-button>
                  <el-radio-button label="right">{{$t('tb.config.widget.right')}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item  label-width="70px" :label="$t('tb.config.widget.columnSort')+':'">
                <el-radio-group v-model="data.options.selectCl.sortable">
                  <el-radio-button :label="false">{{$t('tb.config.widget.no')}}</el-radio-button>
                  <el-radio-button :label="true">{{$t('tb.config.widget.yes')}}</el-radio-button>
                </el-radio-group>     
              </el-form-item>
              <el-form-item  label-width="70px" :label="$t('tb.config.widget.columnFixed')+':'">
                <el-radio-group v-model="data.options.selectCl.fixed">
                  <el-radio-button :label="false">{{$t('tb.config.widget.no')}}</el-radio-button>
                  <el-radio-button :label="true">{{$t('tb.config.widget.yes')}}</el-radio-button>
                </el-radio-group>     
              </el-form-item>
              <el-form-item  label-width="70px" :label="$t('tb.config.widget.draggable')+':'">
                <el-radio-group v-model="data.options.selectCl.resizable">
                  <el-radio-button :label="false">{{$t('tb.config.widget.no')}}</el-radio-button>
                  <el-radio-button :label="true">{{$t('tb.config.widget.yes')}}</el-radio-button>
                </el-radio-group>     
              </el-form-item>
              <el-form-item  label-width="70px" :label="$t('tb.config.widget.longTip')+':'">
                <el-radio-group v-model="data.options.selectCl.showOverflowTooltip">
                  <el-radio-button :label="false">{{$t('tb.config.widget.no')}}</el-radio-button>
                  <el-radio-button :label="true">{{$t('tb.config.widget.yes')}}</el-radio-button>
                </el-radio-group>     
              </el-form-item>
            </div>
          </el-collapse-item>
          <el-collapse-item v-if="data.options.columns.length>0" :title="$t('tb.config.widget.adjustColumn')"  name="adjust">    
            <draggable tag="ul" :list="data.options.columns" 
              v-bind="{group:{ name:'columns'}, ghostClass: 'ghost',handle: '.drag-item'}"
              handle=".drag-item"
            >
              <li v-for="(item, index) in data.options.columns" :key="index" >
                <span>{{$t('tb.config.widget.columnName')}}：</span>
                <el-input :style="{'width':'150px','padding':'0 5px' }" :disabled="true" size="mini" v-model="item.label"></el-input>
                <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="iconfont icon-icon_bars"></i></i>
                <el-button @click="handleTableColumnRemove(index)" circle plain type="danger" size="mini" icon="el-icon-minus" style="padding: 4px;margin-left: 5px;"></el-button>
                
              </li>
            </draggable>
          </el-collapse-item>
        </el-collapse>
      </template>

      <template v-if="data.type=='elTreeTable'">
        <el-form-item :label="$t('tb.config.widget.columnName')+':'">
          <el-select  v-model="data.options.defaultType">
            <el-option  v-for="item in  data.options.columns" :key="item.prop" :label="item.label" :value="item.prop">
            </el-option>
          </el-select>
        </el-form-item>
        <draggable tag="ul" :list="data.options.options" 
          v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
          handle=".drag-item"
        >
          <li class="cf-table-columns-li" v-for="(item, index) in data.options.columns" :key="index" >
            <div class="cf-table-columns-content">

            </div>
            <span>{{$t('tb.config.widget.columnName')}}：</span>
            <el-input :style="{'width': data.options.showLabel? '50px': '80px','padding':'0 5px' }" size="mini" v-model="item.label"></el-input>
            <span>{{$t('tb.config.widget.width')}}：</span>
            <el-input style="width:50px;padding: 0 5px;" size="mini"  v-model="item.width"></el-input>
            <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="iconfont icon-icon_bars"></i></i>
            <el-button @click="handleOptionsRemove(index)" circle plain type="danger" size="mini" icon="el-icon-minus" style="padding: 4px;margin-left: 5px;"></el-button>
            
          </li>
        </draggable>

        <div style="margin-left: 22px;">
          <el-button type="text" @click="handleAddTableColumn">{{$t('tb.actions.addOption')}}</el-button>
        </div>
      </template>
    </el-form>
    <el-dialog
      :visible="editeConfig.editeCodeVisible"
      @close='editeConfig.editeCodeVisible = false'
      destroy-on-close
      ref="editeCode"
      width="800px"
    >
      <div>

      </div>
      <p style="text-align: center;margin-top:20px">
       <el-button type="primary" @click="handleCustomCodeSubmit">{{$t('tb.config.widget.submit')}}</el-button>
      </p>
    </el-dialog>
    <el-dialog
      :visible="editeColumnDataVisible"
      @close='editeColumnDataVisible = false'
      ref="editeColumnData"
      width="650px"
      min-height="610px"
    >
      <div v-if="data.options.selectCl">
        <el-form label-position="left">
          <el-form-item label-width="70px" :label="$t('tb.config.widget.columnName')+':'">
            <el-input  :disabled="true" v-model="data.options.selectCl.label"></el-input>
          </el-form-item>
          <el-form-item label-width="70px" :label="$t('tb.config.widget.dataName')+':'">
            <el-input  v-model="data.options.selectCl.prop"></el-input>
          </el-form-item>
          <el-form-item label-width="70px" :label="$t('tb.config.widget.dataType')+':'">
              <el-select v-model="data.options.selectCl.propType">
              <el-option value="string" :label="$t('tb.config.widget.string')"></el-option>
              <el-option value="number" :label="$t('tb.config.widget.number')"></el-option>
              <el-option value="dateTime" :label="$t('tb.config.widget.dateTime')"></el-option>
              <el-option value="amount" :label="$t('tb.config.widget.amount')"></el-option>
              <el-option value="custom" :label="$t('tb.config.widget.custom')"></el-option>
            </el-select>
          </el-form-item>
          <div class="format-box" v-if="data.options.selectCl.propType == 'number'">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{$t('tb.config.widget.numberFormat')}}</span>
              </div>
              <el-form-item label-width="100px" :label="$t('tb.config.widget.thousandSymbol')+':'">
                <el-input  style="width:100px" placeholder="," v-model="data.options.selectCl.formatConfig.number_format.thousands_sep"></el-input>
              </el-form-item>
              <el-form-item label-width="100px" :label="$t('tb.config.widget.decimalSymbol')+':'">
                <el-input  style="width:100px" placeholder="." v-model="data.options.selectCl.formatConfig.number_format.dec_point"></el-input>
              </el-form-item>
              <el-form-item label-width="100px" :label="$t('tb.config.widget.reservedBits')+':'">
                <el-input  style="width:100px" placeholder="4" v-model="data.options.selectCl.formatConfig.number_format.decimals"></el-input>
              </el-form-item>
            </el-card>
          </div>
          <div class="format-box" v-if="data.options.selectCl.propType == 'dateTime'">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{$t('tb.config.widget.dateFormat')}}</span>
              </div>
              <el-form-item label-width="70px" :label="$t('tb.config.widget.format')+':'">
                <el-input  style="width:160px" placeholder="{y}-{m}-{d} {h}:{i}:{s}" v-model="data.options.selectCl.formatConfig.dataTme_format.formatstr"></el-input>
              </el-form-item>
            </el-card>
          </div>
          <div class="format-box" v-if="data.options.selectCl.propType == 'amount'">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{$t('tb.config.widget.amountFormat')}}</span>
              </div>
              <el-form-item label-width="100px" :label="$t('tb.config.widget.amountWords')+':'">
                <el-radio-group v-model="data.options.selectCl.formatConfig.amount_format.isWords">
                  <el-radio-button :label="false">{{$t('tb.config.widget.no')}}</el-radio-button>
                  <el-radio-button :label="true">{{$t('tb.config.widget.yes')}}</el-radio-button>
                </el-radio-group>     
              </el-form-item>
            </el-card>
          </div>
          <div class="format-box" v-if="data.options.selectCl.propType == 'custom'">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{$t('tb.config.widget.customMethod')}}</span>
              </div>
              <el-input :disabled="true" v-model="data.options.selectCl.formatter.toString()" style="width:230px"type="textarea":autosize="{ minRows: 2, maxRows: 4}"></el-input>
              <div style="margin-top:20px;text-align: center;">
                <el-button type="primary" size="mini" @click="openEditeCode">{{$t('tb.config.widget.editCode')}}</el-button>
              </div>
            </el-card>
          </div>
        </el-form>
      </div>
      <p style="text-align: center;margin-top:20px">
        <el-button type="primary" @click="handleAddOrEditTableColumn(data.options.selectCl)">{{$t('tb.config.widget.submit')}}</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

import {deepClone,createRandomStr, createRandomNum, createDateTime,amountnNumberFormat,amountToWords,parseTime} from '../util/index.js'

import CusDialog from './CusDialog'

// import Editor from './Editor'

export default {
  components: {
    Draggable,
    // Editor,
    CusDialog
  },
  props: ['data'],
  data () {
    return {
      testCode:null,
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null
      },
      tempSelectCl:{
        prop: 'newData',
        propType:'string',
        label: '新增列',
        sortable: false,
        width: 100,
        minWidth:100,
        resizable:true,
        fixed:false,
        formatter:function(row, column, cellValue, index){
          return cellValue
        },
        formatterStr:'function(row, column, cellValue, index){return cellValue}',
        formatConfig:{
          number_format:{
            decimals:4,//保留小数点后位数
            dec_point:'.',//小数点符号
            thousands_sep:','//千分位符号
          },
          dataTme_format:{
            formatstr:'{y}-{m}-{d} {h}:{i}:{s}'
          },
          amount_format:{
            isWords:true
          }
        },
        showOverflowTooltip:false,
        align:'left',
      },
      activeName: '',
      editeConfig:{
        editeCodeVisible:false,
        javascriptCodes:'function(row, column, cellValue, index){return cellValue}',
        jsEditor:null,
      },
      editeColumnDataVisible:false
    }
  },
  created:function(){
    this.resetTempSelectCl();
  },
  mounted:function(){

  },
  computed: {
    show () {
      if (this.data && Object.keys(this.data).length > 0) {
        return true
      }
      return false
    }
  },
  methods: {
    handleOptionsRemove (index) {
      if (this.data.type === 'grid') {
        this.data.columns.splice(index, 1)
      } else {
        this.data.options.options.splice(index, 1)
      }
      
    },
    handleAddOption () {
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          value: this.$t('tb.config.widget.newOption'),
          label: this.$t('tb.config.widget.newOption')
        })
      } else {
        this.data.options.options.push({
          value: this.$t('tb.config.widget.newOption')
        })
      }     
    },
    initAddColumn(){
      this.activeName = "addCl"
    },
    handleCollChange(){

    },
    handleAddColumn () {
      this.data.columns.push({
        span: '',
        list: []
      })
    },
    handleAddOrEditTableColumn (cl,type) {
      var temCls = this.data.options
      var tcl = null
      if(cl){
        if(type == 'add'){
          tcl = deepClone(cl)
          temCls.columns.push(tcl)
          this.resetTempSelectCl()
        }else{
          tcl = temCls.columns.find(function(x) {
            return x.prop == cl.prop;
          })
          temCls.tableData = [];
        }
        if(temCls.tableData.length>0){
          temCls.tableData.forEach(data =>{
            temCls.columns.map(item =>{
              if(item.propType == "number"){
                 data[item.prop] = amountnNumberFormat(createRandomNum(10000,99999999),
                  item.formatConfig.number_format.decimals,//保留小数点后位数
                  item.formatConfig.number_format.dec_point,//小数点符号
                  item.formatConfig.number_format.thousands_sep,//千分位符号
                ) 
              }else if(item.propType == "dateTime"){
                data[item.prop] = parseTime(createDateTime(createRandomNum(10000,1000000)), item.formatConfig.dataTme_format.formatstr)
              }else if(item.propType == "amount"){
                if(item.formatConfig.amount_format.isWords){
                  data[item.prop] = amountToWords(createRandomNum(10000,99999))
                }else{
                   data[item.prop] = createRandomNum(10000,99999)
                }
              }else if(item.propType == "custom"){
                data[item.prop] = createRandomStr(10)
              }else{
                data[item.prop] = createRandomStr(10)
              }
            })
          })
        }else{
          for(let i = 0;i<5;i++){
            let tableData = {};
            tableData.id = createRandomNum(1,100000000)
            temCls.columns.map(item =>{
              if(item.propType == "number"){
                tableData[item.prop] = amountnNumberFormat(createRandomNum(10000,99999999),
                item.formatConfig.number_format.decimals,//保留小数点后位数
                item.formatConfig.number_format.dec_point,//小数点符号
                item.formatConfig.number_format.thousands_sep,//千分位符号
                ) 
              }else if(item.propType == "dateTime"){
                tableData[item.prop] = parseTime(createDateTime(createRandomNum(10000,1000000)), item.formatConfig.dataTme_format.formatstr)
              }else if(item.propType == "amount"){
                if(item.formatConfig.amount_format.isWords){
                  tableData[item.prop] = amountToWords(createRandomNum(10000,99999))
                }else{
                  tableData[item.prop] = createRandomNum(10000,99999)
                }
              }else if(item.propType == "custom"){
                tableData[item.prop] = createRandomStr(10)
              }else{
                tableData[item.prop] = createRandomStr(10)
              }
            })
            temCls.tableData.push(tableData)
          }
        }
        temCls.defaultValue = temCls.tableData
        this.data.options.selectCl = tcl
        this.activeName = 'editCl'
        this.editeColumnDataVisible = false
      }     
    },
    resetTempSelectCl(){
      let randomStr =  createRandomStr(6);
       this.tempSelectCl={
        prop: `newData_${randomStr}`,
        propType:'string',
        label: `新增列_${randomStr}`,
        sortable: false,
        width: 100,
        minWidth:100,
        resizable:true,
        fixed:false,
        formatter:function(row, column, cellValue, index){
          return(cellValue)
        },
        formatterStr:'function(row, column, cellValue, index){return(cellValue)}',
        formatConfig:{
          number_format:{
            decimals:4,//保留小数点后位数
            dec_point:'.',//小数点符号
            thousands_sep:','//千分位符号
          },
          dataTme_format:{
            formatstr:'{y}-{m}-{d} {h}:{i}:{s}'
          },
          amount_format:{
            isWords:true
          }
        },
        showOverflowTooltip:false,
        align:'left',
      }
    },
    //编辑tabledata
    openEditColmunData(){
      this.editeColumnDataVisible = true
    },
    //编辑器
    javascriptOnMounted(edit){
      this.jsEditor = edit;
    },
    javascriptOnCodeChange(value,event){
      console.log(value)
      this.editeConfig.javascriptCodes = value;
    },
    openEditeCode(){
      this.editeConfig.editeCodeVisible = true
      this.editeConfig.javascriptCodes ='function(row, column, cellValue, index){return cellValue}'
    },
    handleCustomCodeSubmit(){debugger
      let codeFn =  eval("("+this.editeConfig.javascriptCodes+")");
      this.tempSelectCl.formatter =  codeFn
      this.editeConfig.editeCodeVisible = false
      if( this.data.options.selectCl){
        this.data.options.selectCl.formatter = codeFn
      }
    },
    handleTableColumnRemove(index){
      this.data.options.columns.splice(index, 1)
    },
    generateRule () {
      this.data.rules = []
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key])
        }
      })
    },
    handleSelectMuliple (value) {
      if (value) {
        if (this.data.options.defaultValue) {
          this.data.options.defaultValue = [this.data.options.defaultValue]
        } else {
          this.data.options.defaultValue = []
        }
        
      } else {
        if (this.data.options.defaultValue.length>0){
          this.data.options.defaultValue = this.data.options.defaultValue[0]
        } else {
          this.data.options.defaultValue = ''
        }
        
      }
    },

    validateRequired (val) {
      if (val) {
        this.validator.required = {required: true, message: `${this.data.name}${this.$t('tb.config.widget.validatorRequired')}`}
      } else {
        this.validator.required = null
      }

      this.$nextTick(() => {
        this.generateRule()
      })
    },

    validateDataType (val) {
      if (!this.show) {
        return false
      }
      
      if (val) {
        this.validator.type = {type: val, message: this.data.name + this.$t('tb.config.widget.validatorType')}
      } else {
        this.validator.type = null
      }

      this.generateRule()
    },
    valiatePattern (val) {
      if (!this.show) {
        return false
      }

      if (val) {
        this.validator.pattern = {pattern: val, message: this.data.name + this.$t('tb.config.widget.validatorPattern')}
      } else {
        this.validator.pattern = null
      }

      this.generateRule()
    }
  },
  watch: {
    'data.options.isRange': function(val) {
      if (typeof val !== 'undefined') {
        if (val) {
          this.data.options.defaultValue = null
        } else {
          if (Object.keys(this.data.options).indexOf('defaultValue')>=0) 
            this.data.options.defaultValue = ''
        }
      }
    },
    'data.options.required': function(val) {
      this.validateRequired(val)
    },
    'data.options.dataType': function (val) {
      this.validateDataType(val)
    },
    'data.options.pattern': function (val) {
      this.valiatePattern(val)
    },
    'data.name': function (val) {
      if (this.data.options) {
        this.validateRequired(this.data.options.required)
        this.validateDataType(this.data.options.dataType)
        this.valiatePattern(this.data.options.pattern)
      }
    }
  }
}
</script>
<style>
.cf-table-columns-li{
  list-style-type:none;
  font-size: 12px;
  line-height: 32px;
}
.el-input__inner{
  padding: 0 5px;
}
.el-radio-button__inner{
  padding: 9px 11px;
}
.format-box{
  padding-bottom: 20px;
}
.format-box .el-form-item__label{
  font-size: 12.5px;
}
.format-box>input{
  font-size: 12.5px;
}
</style>
