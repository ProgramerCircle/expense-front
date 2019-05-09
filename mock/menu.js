const menus = [
  {
    id: 1,
    path: '/team',
    name: '团队管理',
    icon: 'dashboard',
    parentId: 0,
  },
  {
    id: 101,
    path: '/team/manager',
    name: '资源推荐',
    parentId: 1,
  },
  {
    id: 2,
    path: '/search',
    name: '分类搜索',
    parentId: 0,
  },
  {
    id: 201,
    path: '/search/categorylist',
    name: '分类搜索',
    parentId: 2,
  },
  {
    id: 3,
    path: '/upload',
    name: '资源上传',
    parentId: 0,
  },
  {
    id: 301,
    path: '/upload/submit',
    name: '上传资源',
    parentId: 3,
  },
  {
    id: 302,
    path: '/upload/query',
    name: '资源查看',
    parentId: 3,
  },
];

export default {
  'GET /api/project/menus': menus,
};
