import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import App from './views/App'
import Editor from './views/Editor'
import View from './views/View'
import File from './views/File'
import Join from './views/Join'

export default new Router({
    routes: [
        {
            path: '/',
            component: App,
            children: [
                { path: 'edit', component: Editor },
                { path: 'edit/:id', component: Editor },
                { path: 'view/:id', component: View },
                { path: 'file', component: File }
            ]
        },
        {
            path: '/join',
            component: Join
        }
    ]
})