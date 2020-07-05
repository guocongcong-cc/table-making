<template>
  <div v-if="selectData" class="form-config-container">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="$t('tb.config.widget.tableAttr')" name="baseConfig">   
        <el-form label-position="left" > 
          <el-form-item :label="$t('tb.config.widget.model')">
            <el-input style="width:220px;margin-left:20px" v-model="selectData.model"></el-input>
          </el-form-item>
          <el-form-item :label="$t('tb.config.widget.name')">
            <el-input style="width:220px;margin-left:20px" v-model="selectData.name"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item :title="$t('tb.config.widget.tableStyle')" name="tableStyleConfig">    
        <el-form label-position="left" >
          <el-form-item :label="$t('tb.config.widget.width')" v-if="Object.keys(selectData.options).indexOf('width')>=0">
            <el-input v-model="selectData.options.width"></el-input>
          </el-form-item>
          <el-form-item :label="$t('tb.config.widget.height')" v-if="Object.keys(selectData.options).indexOf('maxHeight')>=0">
            <el-input style="width:220px;margin-left:20px" v-model="selectData.options.maxHeight"></el-input>
          </el-form-item>
        </el-form>
        <el-form label-position="left">
          <el-form-item :label="$t('tb.config.form.labelPosition.title')">
            <el-radio-group v-model="data.labelPosition">
              <el-radio-button label="left">{{$t('tb.config.form.labelPosition.left')}}</el-radio-button>
              <el-radio-button label="right">{{$t('tb.config.form.labelPosition.right')}}</el-radio-button>
              <el-radio-button label="top">{{$t('tb.config.form.labelPosition.top')}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label-width="80px" :label="$t('tb.config.form.labelWidth')">
            <el-input-number v-model="data.labelWidth" :min="0" :max="200" :step="10"></el-input-number>
          </el-form-item>
          <el-form-item label-width="80px" :label="$t('tb.config.form.size')">
            <el-radio-group v-model="selectData.options.size">
              <el-radio-button label="medium">medium</el-radio-button>
              <el-radio-button label="small">small</el-radio-button>
              <el-radio-button label="mini">mini</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-form label-width="120px" label-position="left">
          <el-form-item  :label="$t('tb.config.widget.isBorder')">
            <el-radio-group v-model="selectData.options.border">
              <el-radio-button :label="false">{{$t('tb.config.widget.no')}}</el-radio-button>
              <el-radio-button :label="true">{{$t('tb.config.widget.yes')}}</el-radio-button>
            </el-radio-group>     
          </el-form-item>
          <el-form-item :label="$t('tb.config.widget.isStripe')">
            <el-radio-group v-model="selectData.options.stripe">
              <el-radio-button :label="false">{{$t('tb.config.widget.no')}}</el-radio-button>
              <el-radio-button :label="true">{{$t('tb.config.widget.yes')}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item :title="$t('tb.config.widget.theaderStyle')" name="columnStyleConfig">
         <el-form label-width="120px" label-position="left">
          <el-form-item label-width="70px" :label="$t('tb.config.widget.background')+':'">
              <span>
              <el-color-picker v-model="selectData.options.headerCellStyle.backgroundColor"></el-color-picker>
              </span>  
          </el-form-item>
          <el-form-item label-width="70px" :label="$t('tb.config.widget.fontSize')+'(px):'">
            <el-input style="width:190px" v-model="selectData.options.headerCellStyle.fontSize"></el-input>
          </el-form-item>
          <el-form-item label-width="70px" :label="$t('tb.config.widget.fontColor')+':'">
              <el-color-picker style="width:190px" v-model="selectData.options.headerCellStyle.color"></el-color-picker>
          </el-form-item>
          <el-form-item label-width="70px" :label="$t('tb.config.widget.theaderHeight')+':'">
              <el-input style="width:190px" v-model="selectData.options.headerCellStyle.lineHeight"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  props: ['data','selectData'],
  data(){
    return{
      activeName: 'baseConfig',
    }
  }
}
</script>
