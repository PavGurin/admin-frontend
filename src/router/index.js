import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import List from '@/components/List'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'List',
      component: List
    },
    {
      path: '/publish',
      name: 'Publish',
      component: Publish
    }
  ]
})
