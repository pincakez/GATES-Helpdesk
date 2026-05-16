import { createRouter, createWebHistory } from 'vue-router'
import PreAuthLayout  from '../layouts/PreAuthLayout.vue'
import AppShellLayout from '../layouts/AppShellLayout.vue'
import PreLoginView   from '../views/PreLoginView.vue'
import WhyGatesView   from '../views/WhyGatesView.vue'
import ContactView    from '../views/ContactView.vue'

const AppStub = {
  props: ['label'],
  template: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:'Almarai',sans-serif;font-size:32px;font-weight:900;color:#2d2d2d;letter-spacing:0.06em;">{{ label }}</div>`,
}

const routes = [
  {
    path: '/',
    component: PreAuthLayout,
    children: [
      { path: '',          name: 'PreLogin',  component: PreLoginView },
      { path: 'why-gates', name: 'WhyGates',  component: WhyGatesView },
      { path: 'contact',   name: 'Contact',   component: ContactView  },
    ],
  },
  {
    path: '/app',
    component: AppShellLayout,
    redirect: '/app/tickets',
    children: [
      { path: 'tickets',   name: 'Tickets',  component: AppStub, props: { label: 'My Tickets'     } },
      { path: 'live-chat', name: 'LiveChat', component: AppStub, props: { label: 'Live Chat'       } },
      { path: 'inbox',     name: 'Inbox',    component: AppStub, props: { label: 'Personal Inbox'  } },
      { path: 'offers',    name: 'Offers',   component: AppStub, props: { label: 'Offers'          } },
      { path: 'warranty',  name: 'Warranty', component: AppStub, props: { label: 'My Warranty'     } },
      { path: 'loyalty',   name: 'Loyalty',  component: AppStub, props: { label: 'Loyalty Points'  } },
      { path: 'benefits',  name: 'Benefits', component: AppStub, props: { label: 'My Benefits'     } },
      { path: 'profile',   name: 'Profile',  component: AppStub, props: { label: 'My Profile'      } },
    ],
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
