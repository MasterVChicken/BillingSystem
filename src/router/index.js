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

const pay = () => import('@/views/stuPayment/pay')

const refund = () => import('@/views/stuPayment/refund/refund')

const receiptInquiry = () => import('@/views/stuPayment/receiptInquiry')

const loanInquiry = () => import('@/views/stuPayment/loanInquiry')

const otherInquiry = () => import('@/views/stuPayment/otherInquiry')

const stuList = () => import('@/views/stuAssit/stuList')
const classList = () => import('@/views/stuAssit/classList')

const teaStuList = () => import('@/views/teacher/teaStuList')

const teaClassList = () => import('@/views/teacher/teaClassList')

const grade = () => import('@/views/teacher/grade')

const academy = () => import('@/views/teacher/academy')

const stuQuery = () => import('@/views/finance/stuQuery')

const weekData = () => import('@/views/finance/weekData')

const itemList = () => import('@/views/finance/itemList')

const submitReview = () => import('@/views/finance/submitReview')

const finalReview_checkee = () => import('@/views/finance/finalReview_checkee')

const finalReview_manager = () => import('@/views/finance/finalReview_manager')

const teacherPermission = () => import('@/views/permission/teacherPermission')

const stuPermission = () => import('@/views/permission/stuPermission')

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
        roles: ['stu', 'admin','checkee','manager'], //当前菜单哪些角色可以看到
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
      roles: ['admin', 'stu', 'teacher', 'finance', 'stu_assit','checkee','manager']
    },
    children: [{
      path: "/example/table",
      name: "Table",
      component: table,
      meta: {
        title: "table案例",
        icon: "el-icon-goods",
        roles: ['admin', 'stu', 'teacher', 'finance', 'stu_assit','checkee','manager']
      },
      // 三级菜单写法，对应demotable案例下边的两个菜单
      children: [{
        path: "table1",
        name: "Table1",
        component: tableFirst,
        meta: {
          title: "table1",
          icon: "el-icon-mobile-phone",
          roles: ['admin', 'stu', 'teacher', 'finance', 'stu_assit','checkee','manager']

        }
      },
        {
          path: "table2",
          name: "Table2",
          component: tableSecond,
          meta: {
            title: "table2",
            icon: "el-icon-service",
            roles: ['admin', 'stu', 'teacher', 'finance', 'stu_assit','checkee','manager']
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
          roles: ['admin', 'stu', 'teacher', 'finance', 'stu_assit','checkee','manager']
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
      roles: ['admin', 'stu', 'teacher', 'finance', 'stu_assit','checkee','manager']
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
          roles: ['stu', 'stu_assit']
        }
      },
      {
        path: "finance",
        name: "Finance",
        component: finance,
        meta: {
          title: "财务人员主页",
          icon: "el-icon-upload",
          roles: ['finance','checkee','manager']
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
      },
      {
        path: "stuPermission",
        name: "StuPermission",
        component: stuPermission,
        meta: {
          title: "学生权限管理",
          icon: "el-icon-upload",
          roles: ['admin']
        }
      },
    ]
  },
  {
    path: "/stuPayment",
    component: layout,
    name: "StuPayment",
    meta: {
      title: "学生缴费",
      icon: "el-icon-success",
      roles: ['stu', 'stu_assit']
    },
    children: [
      {
        path: "basicPayment",
        name: "BasicPayment",
        component: basicPayment,
        meta: {
          title: "费用总览",
          icon: "el-icon-upload",
          roles: ['stu', 'stu_assit']
        }
      },
      {
        path: "pay",
        name: "Pay",
        component: pay,
        meta: {
          title: "学生缴费",
          icon: "el-icon-upload",
          roles: ['stu', 'stu_assit']
        }
      },
      {
        path: "refund",
        name: "Refund",
        component: refund,
        meta: {
          title: "学生退费",
          icon: "el-icon-upload",
          roles: ['stu', 'stu_assit']
        }
      },
      {
        path: "receiptInquiry",
        name: "ReceiptInquiry",
        component: receiptInquiry,
        meta: {
          title: "学生收据查询",
          icon: "el-icon-upload",
          roles: ['stu', 'stu_assit']
        }
      },
      {
        path: "loanInquiry",
        name: "LoanInquiry",
        component: loanInquiry,
        meta: {
          title: "学生贷款查询",
          icon: "el-icon-upload",
          roles: ['stu', 'stu_assit']
        }
      },
      {
        path: "otherInquiry",
        name: "OtherInquiry",
        component: otherInquiry,
        meta: {
          title: "学生其他费用查询",
          icon: "el-icon-upload",
          roles: ['stu', 'stu_assit']
        }
      }
    ]
  },
  {
    path: "/stuAssit",
    component: layout,
    name: "StuAssit",
    meta: {
      title: "学生协助管理",
      icon: "el-icon-success",
      roles: ['stu_assit']
    },
    children: [{
      path: "stuList",
      name: "StuList",
      component: stuList,
      meta: {
        title: "管理学生列表",
        icon: "el-icon-upload",
        roles: ['stu_assit']
      }
    }, {
      path: "classList",
      name: "ClassList",
      component: classList,
      meta: {
        title: "管理班级列表",
        icon: "el-icon-upload",
        roles: ['stu_assit']
      }
    }
    ]
  },
  {
    path: "/teacher",
    component: layout,
    name: "Teacher",
    meta: {
      title: "教师操作",
      icon: "el-icon-success",
      roles: ['teacher']
    },
    children: [{
      path: "teaStuList",
      name: "TeaStuList",
      component: teaStuList,
      meta: {
        title: "管理学生列表",
        icon: "el-icon-upload",
        roles: ['teacher']
      }
    },
      {
        path: "teaClassList",
        name: "TeaClassList",
        component: teaClassList,
        meta: {
          title: "管理班级列表",
          icon: "el-icon-upload",
          roles: ['teacher']
        }
      },
      {
        path: "grade",
        name: "Grade",
        component: grade,
        meta: {
          title: "年级缴费报表",
          icon: "el-icon-upload",
          roles: ['teacher']
        }
      },
      {
        path: "academy",
        name: "Academy",
        component: academy,
        meta: {
          title: "学院缴费报表",
          icon: "el-icon-upload",
          roles: ['teacher']
        }
      },
    ]
  },
  {
    path: "/finance",
    component: layout,
    name: "Finance",
    meta: {
      title: "财务人员",
      icon: "el-icon-success",
      roles: ['finance','checkee','manager']
    },
    children: [{
      path: "stuQuery",
      name: "StuQuery",
      component: stuQuery,
      meta: {
        title: "学生缴费查询",
        icon: "el-icon-upload",
        roles: ['finance','checkee','manager']
      }
    },
      {
        path: "weekData",
        name: "WeekData",
        component: weekData,
        meta: {
          title: "每周报表",
          icon: "el-icon-upload",
          roles: ['finance','checkee','manager']
        }
      },
      {
        path: "itemList",
        name: "ItemList",
        component: itemList,
        meta: {
          title: "项目状态",
          icon: "el-icon-upload",
          roles: ['finance','checkee','manager']
        }
      },
      {
        path: "submitReview",
        name: "SubmitReview",
        component: submitReview,
        meta: {
          title: "提交审核",
          icon: "el-icon-upload",
          roles: ['finance','checkee','manager']
        }
      },
      {
        path: "finalReview_checkee",
        name: "FinalReview_checkee",
        component: finalReview_checkee,
        meta: {
          title: "审核",
          icon: "el-icon-upload",
          roles: ['checkee']
        }
      },
      {
        path: "finalReview_manager",
        name: "FinalReview_manager",
        component: finalReview_manager,
        meta: {
          title: "总管审核",
          icon: "el-icon-upload",
          roles: ['manager']
        }
      },
    ]
  }
]


export default new Router({
  routes: fixedRouter
})
