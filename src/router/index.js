import Vue from 'vue'
import Router from 'vue-router'

const layout = () => import('@/components/layout')
// 登录页
const login = () => import('@/views/login/index')
const teacher = () => import('@/views/dashboard/teacher')
const stu = () => import('@/views/dashboard/stu')
const finance = () => import('@/views/dashboard/finance')
const admin = () => import('@/views/dashboard/admin')

const basicPayment = () => import('@/views/stuPayment/payment/basicPayment')

const receiptInquiry = () => import('@/views/stuPayment/receiptInquiry')

const loanInquiry = () => import('@/views/stuPayment/loanInquiry')

const otherInquiry = () => import('@/views/stuPayment/otherInquiry')

const teacherPermission = () => import('@/views/permission/teacherPermission')

const main = () => import('@/views/index')
const table = () => import('@/views/example/table/index')
const tree = () => import('@/views/example/tree')
const tableFirst = () => import('@/views/example/table/tableFirst')
const tableSecond = () => import('@/views/example/table/tableSecond')
Vue.use(Router)
// 固定的路由表
export const fixedRouter = [
  {
    path: '',
    component: login,
    hidden: true
  },
  {
    path: '',
    component: layout, //整体页面的布局(包含左侧菜单跟主内容区域)
    children: [{
      path: 'main',
      component: main,
      meta: {
        title: '首页', //菜单名称
        roles: ['stu', 'admin'], //当前菜单哪些角色可以看到
        icon: 'el-icon-info' //菜单左侧的icon图标
      }
    }]
  },
]
// 需要权限判断展示的路由
export const permissionRouter = [
  {
    path: "/example",
    component: layout,
    name: "Example",
    meta: {
      title: "案例",
      icon: "el-icon-success",
      roles: ['admin', 'stu']
    },
    children: [{
      path: "/example/table",
      name: "Table",
      component: table,
      meta: {
        title: "table案例",
        icon: "el-icon-goods",
        roles: ['admin']
      },
      // 三级菜单写法，对应demotable案例下边的两个菜单
      children: [{
        path: "table1",
        name: "Table1",
        component: tableFirst,
        meta: {
          title: "table1",
          icon: "el-icon-mobile-phone",
          roles: ['admin']

        }
      },
        {
          path: "table2",
          name: "Table2",
          component: tableSecond,
          meta: {
            title: "table2",
            icon: "el-icon-service",
            roles: ['admin']
          }
        }
      ]
    },
      {
        path: "tree",
        name: "Tree",
        component: tree,
        meta: {
          title: "树形菜单",
          icon: "el-icon-upload",
          roles: ['stu', 'admin']
        }
      }
    ]
  },
  {
    path: "/dashboard",
    component: layout,
    name: "Dashboard",
    meta: {
      title: "主页",
      icon: "el-icon-success",
      roles: ['admin', 'stu', 'teacher', 'finance', 'stu_assit']
    },
    children: [
      {
        path: "teacher",
        name: "Teacher",
        component: teacher,
        meta: {
          title: "教师主页",
          icon: "el-icon-upload",
          roles: ['teacher']
        }
      },
      {
        path: "stu",
        name: "Student",
        component: stu,
        meta: {
          title: "学生主页",
          icon: "el-icon-upload",
          roles: ['stu','stu_assit']
        }
      },
      {
        path: "finance",
        name: "Finance",
        component: finance,
        meta: {
          title: "财务人员主页",
          icon: "el-icon-upload",
          roles: ['finance']
        }
      },
      {
        path: "admin",
        name: "Admin",
        component: admin,
        meta: {
          title: "管理员主页",
          icon: "el-icon-upload",
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: "/permission",
    component: layout,
    name: "Permission",
    meta: {
      title: "权限管理",
      icon: "el-icon-success",
      roles: ['admin']
    },
    children: [
      {
        path: "teacherPermission",
        name: "TeacherPermission",
        component: teacherPermission,
        meta: {
          title: "教师权限管理",
          icon: "el-icon-upload",
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: "/stuPayment",
    component: layout,
    name: "StuPayment",
    meta: {
      title: "学生缴费",
      icon: "el-icon-success",
      roles: ['stu','stu_assit']
    },
    children: [
      {
        path: "basicPayment",
        name: "BasicPayment",
        component: basicPayment,
        meta: {
          title: "学生基础缴费",
          icon: "el-icon-upload",
          roles: ['stu','stu_assit']
        }
      },
      {
        path: "receiptInquiry",
        name: "ReceiptInquiry",
        component: receiptInquiry,
        meta: {
          title: "学生收据查询",
          icon: "el-icon-upload",
          roles: ['stu','stu_assit']
        }
      },
      {
        path: "loanInquiry",
        name: "LoanInquiry",
        component: loanInquiry,
        meta: {
          title: "学生贷款查询",
          icon: "el-icon-upload",
          roles: ['stu','stu_assit']
        }
      },
      {
        path: "otherInquiry",
        name: "OtherInquiry",
        component: otherInquiry,
        meta: {
          title: "学生其他费用查询",
          icon: "el-icon-upload",
          roles: ['stu','stu_assit']
        }
      }
    ]
  },
]


export default new Router({
  routes: fixedRouter
})
