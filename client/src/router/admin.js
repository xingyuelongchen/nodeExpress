
export default [
    {
        path: '/admin',
        name: 'admin',
        meta: { requiresAuth: true, isBack: false },
        // meta: { 
        //  requiresAuth: true, 判断是否登陆才可访问 
        //  isBack: false 是否可以后退
        // },
        component: () => import('@/components/error/index.vue'),
        children: [

        ]
    }
]