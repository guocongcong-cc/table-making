import VueI18n from 'vue-i18n'
import 'normalize.css/normalize.css'

import MakingTable from './components/Container.vue'
import GenerateTable from './components/GenerateTable.vue'

import enUSCC from './lang/en-US'
import zhCNCC from './lang/zh-CN'

import './iconfont/iconfont.css'
import './styles/cover.scss'
import './styles/index.scss'

const loadLang = function (Vue, lang, locale, i18n) {debugger
  if (locale) {
    locale('en-US', { ...locale('en-US'), ...enUSCC})
    locale('zh-CN', { ...locale('zh-CN'), ...zhCNCC})
    Vue.config.lang = lang
  } else if (i18n) {
    i18n.setLocaleMessage('en-US', { ...i18n.messages['en-US'], ...enUSCC})
    i18n.setLocaleMessage('zh-CN', { ...i18n.messages['zh-CN'], ...zhCNCC})
    i18n.locale = lang
  } else {
    Vue.use(VueI18n)
    Vue.locale('en-US', { ...Vue.locale('en-US'), ...enUSCC})
    Vue.locale('zh-CN', { ...Vue.locale('zh-CN'), ...zhCNCC})
    Vue.config.lang = lang
  }
}

MakingTable.install = function (Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  loadLang(Vue, opts.lang, opts.locale, opts.i18n)
  Vue.component(MakingTable.name, MakingTable)
}

GenerateTable.install = function (Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  loadLang(Vue, opts.lang, opts.locale, opts.i18n)
  Vue.component(GenerateTable.name, GenerateTable)
}

const components = [
  MakingTable,
  GenerateTable
]

const install = function (Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  loadLang(Vue, opts.lang, opts.locale, opts.i18n)
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  install,
  MakingTable,
  GenerateTable
}

export default {
  install,
  MakingTable,
  GenerateTable
}
