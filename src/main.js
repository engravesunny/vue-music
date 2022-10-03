import Vue from 'vue'
import App from './App.vue'
import '@/mobile/flexible'
import '@/styles/reset.css'
import router from '@/router'

// 测试封装api的方法
import { recommendMusicAPI } from './api'
async function fn(){
  const res = await recommendMusicAPI()
  console.log(res);
}
fn()

import { Tabbar, TabbarItem ,NavBar,Col, Row,Image as VanImage,Cell, CellGroup,Icon,Search,List,} from 'vant';

Vue.use(List);
Vue.use(Search);
Vue.use(Cell);
Vue.use(Icon);
Vue.use(CellGroup);
Vue.use(VanImage);
Vue.use(Col);
Vue.use(Row);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(NavBar);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
