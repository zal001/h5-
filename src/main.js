import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { Rate,Skeleton,SkeletonItem  } from 'element-ui'
Vue.use(Rate)
Vue.use(Skeleton)
Vue.use(SkeletonItem)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
