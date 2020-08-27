import { createRouter, createWebHashHistory } from 'vue-router'
import Main from '../views/Main.vue'
import ConnectorChooser from '../views/ConnectorChooser.vue'

const routes = [{
  path: '/',
  name: 'main',
  component: Main
}, {
  path: '/connector-chooser',
  name: 'connector-chooser',
  component: ConnectorChooser
},]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
