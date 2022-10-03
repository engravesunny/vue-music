import Vue from 'vue'
import VueRouter  from 'vue-router'
import Layout from '@/view/Layout'
import Home from '@/view/Home'
import Search from '@/view/Search'
import Play from '@/view/Play'

Vue.use(VueRouter)

const routes = [
    {
        path:'/',
        redirect:'/layout'
    },
    {
        path:'/layout',
        component:Layout,
        children:[
            {
                path:'home',
                component:Home,
                meta:{ //meta保存路由对象额外信息
                    title:'首页'
                }
            },
            {
                path:'search',
                component:Search,
                meta:{
                    title:'搜索'
                }
            }
        ]
    },
    {
        path:'/play',
        component:Play
    }
]

export default new VueRouter({
    routes
})