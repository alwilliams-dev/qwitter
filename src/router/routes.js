
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/PageHome.vue'),
        name: 'Home'
      },
      {
        path: '/bookmarks',
        component: () => import('pages/PageBookmarks.vue'),
        name: 'Bookmarks'
      },
      {
        path: '/messages',
        component: () => import('pages/PageMessages.vue'),
        name: 'Messages'
      },
      { 
        path: '/about',
        component: () => import('pages/PageAbout.vue'),
        name: 'About'
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
