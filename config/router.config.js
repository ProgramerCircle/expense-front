export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      { path: '/user/register/manager', name: 'registerManager', component: './User/RegisterAsManager' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {

    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      { path: '/', redirect: '/user/login', authority: ['admin', 'user'] },
      {
        path: '/exception',
        name: 'exception',
        icon: 'warning',
        hideInMenu: true,
        routes: [
          {
            path: '/exception/noTeam',
            name: 'noTeam',
            component: './Exception/NoTeam',
            hideInMenu: true
          },
          {
            path: '/exception/noAccess',
            name: 'noAccess',
            component: './Exception/NoAccess',
            hideInMenu: true
          },
          {
            path: '/exception/noFunction',
            name: 'noFunction',
            component: './Exception/NoFunction',
            hideInMenu: true
          },
          {
            path: '/exception/onlyManager',
            name: 'onlyManager',
            component: './Exception/OnlyManager',
            hideInMenu: true
          },
        ]
      },
      //Team
      {
        path: '/team',
        name: 'team',
        icon: 'profile',
        routes: [
          {
            path: '/team/manager',
            name: 'manager',
            component: './Team/Team',
          },
          {
            path: '/team/new',
            name: 'new',
            component: './Team/NewTeam',
            hideInMenu: true
          },
          {
            path: '/team/join',
            name: 'join',
            component: './Team/JoinTeam',
          },
        ]
      },
      //Project
      {
        path: '/project',
        name: 'project',
        icon: 'profile',
        routes: [
          {
            path: '/project/manager',
            name: 'manager',
            component: './Project/Project',
          },
          {
            path: '/project/new',
            name: 'new',
            component: './Project/NewProject',
            hideInMenu: true
          },
        ]
      },
      //ExpenseType
      {
        path: '/expenseType',
        name: 'expenseType',
        icon: 'profile',
        routes: [
          {
            path: '/expenseType/manager',
            name: 'manager',
            component: './ExpenseType/ExpenseType',
          },
          {
            path: '/expenseType/new/:projectId',
            name: 'new',
            component: './ExpenseType/NewExpenseType',
            hideInMenu: true
          }
          ]
      },
      //ExpenseApprove
      {
        path: '/expenseApplication',
        name: 'expenseApplication',
        icon: 'profile',
        routes: [
          {
            path: '/expenseApplication/manager',
            name: 'myExpenseApplication',
            component: './ExpenseApplication/ExpenseApplication',
          },
          {
            path: '/expenseApplication/new',
            name: 'new',
            component: './ExpenseApplication/NewExpenseApplication',
          },
        ]
      },
      //ExpenseApprove
      {
        path: '/expenseApprove',
        name: 'expenseApprove',
        icon: 'profile',
        routes: [
          {
            path: '/expenseApprove/approve',
            name: 'expenseApplicationApprove',
            component: './ExpenseApprove/ExpenseApprove',
          },
          {
            path: '/expenseApprove/record',
            name: 'myApproveRecord',
            component: './ExpenseApprove/MyExpenseApproveRecord',
          }
        ]
      },
      //SynthesizeManager
      {
        path: '/synthesizeManager',
        name: 'synthesizeManager',
        icon: 'profile',
        routes: [
          {
            path: '/synthesizeManager/projectAnalyze',
            name: 'projectAnalyze',
            component: './SynthesizeManager/ProjectAnalyze',
          },
          {
            path: '/synthesizeManager/allExpenseApplication',
            name: 'allExpenseApplication',
            component: './SynthesizeManager/AllExpenseApplication',
          }
        ]
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      //注释

      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/basic/:id',
            name: 'basic',
            hideInMenu: true,
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      //  editor
      {
        name: 'editor',
        icon: 'highlight',
        path: '/editor',
        routes: [
          {
            path: '/editor/flow',
            name: 'flow',
            component: './Editor/GGEditor/Flow',
          },
          {
            path: '/editor/mind',
            name: 'mind',
            component: './Editor/GGEditor/Mind',
          },
          {
            path: '/editor/koni',
            name: 'koni',
            component: './Editor/GGEditor/Koni',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
