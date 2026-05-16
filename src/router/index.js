import { createRouter, createWebHistory } from 'vue-router'
import PreAuthLayout from '../layouts/PreAuthLayout.vue'
import PreLoginView from '../views/PreLoginView.vue'
import WhyGatesView from '../views/WhyGatesView.vue'
import ContactView from '../views/ContactView.vue'

const Stub = { template: '<div style="padding:40px;font-family:sans-serif">{{ $route.path }}</div>' }

const routes = [
  {
    path: '/',
    component: PreAuthLayout,
    children: [
      { path: '',           name: 'PreLogin',  component: PreLoginView },
      { path: 'why-gates',  name: 'WhyGates',  component: WhyGatesView },
      { path: 'contact',    name: 'Contact',   component: ContactView },
    ],
  },
  { path: '/app',    name: 'App',    component: Stub },
  { path: '/chat',   name: 'Chat',   component: Stub },
  { path: '/offers', name: 'Offers', component: Stub },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
