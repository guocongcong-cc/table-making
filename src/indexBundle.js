import Vue from 'vue'
import GenerateTable from './components/GenerateTable.vue'

import './styles/cover.scss'
import './styles/index.scss'

GenerateTable.install = function (Vue) {
  Vue.component(GenerateTable.name, GenerateTable)
}

const components = [
  GenerateTable
]

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  install,
  GenerateTable
}

export default {
  install,
  GenerateTable
}
