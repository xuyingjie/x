import Vue from 'vue'
import Router from 'vue-router'

import Editor from '@/components/Editor'
import Paper from '@/components/Paper'
import File from '@/components/File'
import Join from '@/components/Join'

Vue.use(Router)

const routes = [
    { path: '/edit', component: Editor },
    { path: '/edit/:id', component: Editor },
    { path: '/view/:id', component: Paper },
    { path: '/file', component: File },
    { path: '/join', component: Join },
]

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
