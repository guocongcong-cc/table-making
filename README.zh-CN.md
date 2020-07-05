# vue-table-making

简体中文 | [English](./README.md)

## 概要

基于 [vue](https://github.com/vuejs/vue) 和 [element-ui-table](https://github.com/ElemeFE/element)以[Form-Making](http://table.xiaoyaoji.cn/basic-version) 实现的表格设计器，使用了最新的前端技术栈，内置了 i18n 国际化解决方案，可以让表格开发简单而高效。

- [在线预览](http://139.155.50.76:8888/#/zh-CN/)

- [使用文档]整理中
- [高级版本]正在开发中

## 特性

* 可视化配置页面
* 提供栅格布局，并采用flex实现对齐
* 一键预览配置的效果
* 一键生成配置json数据
* 一键生成代码，立即可运行
* 提供自定义组件满足用户自定义需求
* 提供远端数据接口，方便用户需要异步获取数据加载
* 快速获取表格数据
* 国际化支持

## 组件

- [TableMaking](http://139.155.50.76:8888/#/zh-CN/) 表格设计器（基于可视化操作快速设计出表格页面，并获取到表格配置 json 数据）。

- [GenerateTable](http://139.155.50.76:8888/#/zh-CN/) 表格生成器（根据设计器中获取的配置 json 数据，快速渲染出表格页面）。

# 简介
 如果你的项目中有很多的表格，即使用elment-ui table插件你也必须每次都必须写一遍代码进行开发，如果你使用过表格设计器，你就会希望能得到一款像form表格设计器一样可以通过拖拽配置快速生成一个表格，table-making就是一款不错的表格设计器。参照form-making的源码，并可以集成进form-making中配合表格或其他可视化工具中使用快速设计出表格，并且可以在vue项目中渲染。
该插件包含两个重要组件
**TableMaking 表格设计器**
**GenerateTable 表格渲染器**
### gitHub地址
[table-making](https://github.com/guocongcong-cc/table-making/)

### 演示地址
[table-making](http://139.155.50.76:8888/#/zh-CN/)

# 使用教程

### 安装

```
npm install table-making
```
由于该项目使用了自定义代码编辑器monaco-editor，该工具打包后代码量稍大分割后有多个文件，项目中按需加载需要在引入该插件的工程中进行webpack配置 即在vue.config.js文件中增加如下插件CopyWebpackPlugin的配置（如何安装CopyWebpackPlugin及配置请自行学习）

```
    plugins: [
      new CopyWebpackPlugin(
      
        [
          {
            context: 'node_modules/table-making/dist/',
            from: '*.js',
            to: process.env.NODE_ENV === 'development' ? './':'static/js',
            toType: 'dir'
          },
          {
            context: 'node_modules/table-making/dist/',
            from: '*.css',
            to: process.env.NODE_ENV === 'development' ? './':'static/js',
            toType: 'dir'
          },
        ]
    )
  ]
```

### 项目中如何使用

#### 完整引用

```
import TableMaking from 'table-making'
import 'table-making/dist/TableMaking.css'

Vue.use(TableMaking)
```
以上代码便完成了 TableMaking 的引入。需要注意的是，样式文件需要单独引入。

另外该项目实现了i18国际化如果你的项目也支持i18国际化，则请用一下方式引入组件，注意如果你的工程中有多个插件都支持国际化就必须在主工程中以以下方式引入

```
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'zh-CN', // 定义默认语言为中文 
  messages: { }，//主工程的语言包，可以为空
});
//注册table-macking
Vue.use(TableMaking, { lang: 'zh-CN', locale: null, i18n: i18n})
//其他组件必须传入i18对象引入否则将会将上一个组件的语言包覆盖
```
#### 引入部分组件

```
import {
  GenerateTable,
  MakingTable
} from 'table-making'
import 'table-making/dist/TableMaking.css'

Vue.component(GenerateTable.name, GenerateTable)
Vue.component(MakingTable.name, MakingTable)
/* 或写为
 * Vue.use(GenerateTable)
 * Vue.use(MakingTable)
 */
```

#### 引入 ace.js

如果你需要在设计器中预览表格，默认情况下没有引入ace.js，如果需要使用ace.js，需要自己引入

```
<!-- 需要在设计器中预览代码需要引入ace.js库 -->
<script src="https://unpkg.com/table-making/public/lib/ace/ace.js"></script>
```


### 页面中使用组件

#### 1.设计器tabkeMaking的使用

```
    <fm-making-table v-show="activeName == 'config'" ref="makingtable" style=" min-height: calc(100vh - 100px);" preview generate-code generate-json>
      <template slot="action">
      </template>
    </fm-making-table>
```

效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200705180656328.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MDA3MzExNQ==,size_16,color_FFFFFF,t_70)

#### 1.渲染器GenerateTable的使用

```
<template>
  <div>
    <fm-generate-table 
      :data="jsonData" 
      @on-change="onChange"
      :value="formData"
      ref="generateForm"
    >
    </fm-generate-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      jsonData: {
	  "list": [],
	  "config": {
	    "labelWidth": 100,
	    "labelPosition": "right",
	    "size": "small"
	  }
}
  },
  methods: {
    onChange (field, value) {
      if (field == 'name') {
        this.formData.show = value
      }
    }
  }
}
</script>
```
jsonData 数据即是上一步表格设计器生成的数据

效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200705181757906.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MDA3MzExNQ==,size_16,color_FFFFFF,t_70)

#### 关于组件详细使用教程持续更新中




## 支持

* 如果你发现了新的 bug，或者有新的 feature request，请新建一个 issue

## 捐赠 

如果觉得还不错，请给个星星吧 ☺

## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

## 开源协议

[LGPL](https://opensource.org/licenses/LGPL-3.0)

您可以将 vue-table-making 源码用于 LGPL 协议的开源项目中，并保留版权信息。

## 商业许可

