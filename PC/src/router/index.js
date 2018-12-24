import Vue from 'vue'
import Router from 'vue-router'
// 公共界面
import Layout from '@/components/Layout/Layout'
// 登陆页
import Login from '@/pages/Login/Index'
// 首页
import Index from '@/pages/Index/Index'
// 密码编辑页
import PasswordReset from '@/pages/Index/PasswordReset'

// 人员管理
import PeopleRegistered from '@/pages/PeopleManage/PeopleRegistered';//已登记人员管理
import PeopleAdd from '@/pages/PeopleManage/PeopleAdd';//新增人员
import PeopleUnRegist from '@/pages/PeopleManage/PeopleUnRegist';//未登记人员管理
import PeopleGroupList from '@/pages/PeopleManage/PeopleGroupList';//人员分组管理
import PeopleGroupListAdd from '@/pages/PeopleManage/PeopleGroupListAdd';//人员分组增加
import PeopleGroupListDetail from '@/pages/PeopleManage/PeopleGroupListDetail';//人员分组增加
import PeopleDataAsync from '@/pages/PeopleManage/PeopleDataAsync';//人员数据同步
import PeopleDataAsyncNext from '@/pages/PeopleManage/PeopleDataAsyncNext';//人员数据同步下一步
import PeopleDataAsyncDetail from '@/pages/PeopleManage/PeopleDataAsyncDetail';//人员数据同步查看

//通道管理
import EquipmentManage from '@/pages/passManage/EquipmentManage';//通道管理
import EquipmentAdd from '@/pages/passManage/EquipmentAdd';//通道添加
import SceneManage from '@/pages/passManage/SceneManage';//场景管理
import SceneAdd from '@/pages/passManage/SceneAdd';//场景添加

//通知管理
import NoticeTask from '@/pages/noticeManage/NoticeTask';//通知任务
import NoticeTaskAdd from '@/pages/noticeManage/NoticeTaskAdd';//添加通知任务
import NoticeRecord from '@/pages/noticeManage/NoticeRecord';//通知记录

//监控管理
import MonitorManage from '@/pages/MonitorManage/MonitorManage';//监控管理

// 智能门岗
import PatrolOndutyTask from '@/pages/IntelligentDoor/PatrolOndutyTask';//在岗巡查任务
import PatrolOndutyAdd from '@/pages/IntelligentDoor/PatrolOndutyAdd';//新增在岗巡查
import NoticeOfLeaving from '@/pages/IntelligentDoor/NoticeOfLeaving';//离岗通知
import SignRecord from '@/pages/IntelligentDoor/SignRecord';//签到记录
import PatrolOndutyRecord from '@/pages/IntelligentDoor/PatrolOndutyRecord';//在岗巡查记录
import PatroSignRecord from '@/pages/IntelligentDoor/PatroSignRecord';//在岗签到记录
import ExposureTimesTask from '@/pages/IntelligentDoor/ExposureTimesTask';//曝光频次任务
import ExposureTimesAdd from '@/pages/IntelligentDoor/ExposureTimesAdd';//新增曝光频次
import ExposureTimesRecord from '@/pages/IntelligentDoor/ExposureTimesRecord';//新增曝光频次
import CountRealtimeTask from '@/pages/IntelligentDoor/CountRealtimeTask';//实时计数任务
import CountRealtimeAdd from '@/pages/IntelligentDoor/CountRealtimeAdd';//新增实时计数
import CountRealtimeRecord from '@/pages/IntelligentDoor/CountRealtimeRecord';//实时计数记录

// 考勤管理
import WorkCheckTask from '@/pages/WorkCheckManage/WorkCheckTask';//考勤任务
import WorkCheckAdd from '@/pages/WorkCheckManage/WorkCheckAdd';//新增考勤任务
import WorkCheckRecord from '@/pages/WorkCheckManage/WorkCheckRecord';//考勤记录

//访客管理
import VistorAuthorize from '@/pages/VistorManage/VistorAuthorize';//访客授权
import Authorize from '@/pages/VistorManage/Authorize';//访客授权
import VistorRecord from '@/pages/VistorManage/VistorRecord';//访客记录

//系统管理
import EmployeeManage from '@/pages/SystemManage/EmployeeManage';//用户管理
import EmployeeAdd from '@/pages/SystemManage/EmployeeAdd';//用户角色
import RoleManage from '@/pages/SystemManage/RoleManage';//角色管理
import RoleAdd from '@/pages/SystemManage/RoleAdd';//新增角色
import DatabaseManage from '@/pages/SystemManage/DatabaseManage';//数据库管理
import databaseTaskAdd from '@/pages/SystemManage/databaseTaskAdd';//数据库任务添加
import LogManage from '@/pages/SystemManage/LogManage';//日志管理 
import Holidays from '@/pages/SystemManage/Holidays';//节假日管理

Vue.use(Router)

// export default new Router({

const  routes= [
    {path: '/',component: Layout,
      children:[
        //首页
        {path: '/home',component: Index,},
        //人员管理
        {path: '/PeopleManage/PeopleRegistered',component: PeopleRegistered,},
        {path: '/PeopleManage/PeopleAdd',component: PeopleAdd,},
        {path: '/PeopleManage/PeopleUnRegist',component: PeopleUnRegist,},
        {path: '/PeopleManage/PeopleGroupList',component: PeopleGroupList,},
        {path: '/PeopleManage/PeopleGroupListAdd',component: PeopleGroupListAdd,},
        {path: '/PeopleManage/PeopleGroupListDetail',component: PeopleGroupListDetail,},
        {path: '/PeopleManage/PeopleDataAsync',component: PeopleDataAsync,},
        {path: '/PeopleManage/PeopleDataAsyncNext',component: PeopleDataAsyncNext,},
        {path: '/PeopleManage/PeopleDataAsyncDetail',component: PeopleDataAsyncDetail,},
        //通道管理
        {path: '/passManage/EquipmentManage',component: EquipmentManage,},
        {path: '/passManage/EquipmentAdd',component: EquipmentAdd,},
        {path: '/passManage/SceneManage',component: SceneManage,},
        {path: '/passManage/SceneAdd',component: SceneAdd,},
        //通知管理
        {path: '/noticeManage/NoticeTask',component: NoticeTask,},
        {path: '/noticeManage/NoticeTaskAdd',component: NoticeTaskAdd,},
        {path: '/noticeManage/NoticeRecord',component: NoticeRecord,},
        //监控管理
        {path: '/Monitor/MonitorManage',component: MonitorManage,},
        // 智能门岗
        {path: '/IntelligentDoor/PatrolOndutyTask',component: PatrolOndutyTask,},
        {path: '/IntelligentDoor/PatrolOndutyAdd',component: PatrolOndutyAdd,},
        {path: '/IntelligentDoor/NoticeOfLeaving',component: NoticeOfLeaving,},
        {path: '/IntelligentDoor/SignRecord',component: SignRecord,},
        {path: '/IntelligentDoor/PatrolOndutyRecord',component: PatrolOndutyRecord,},
        {path: '/IntelligentDoor/PatroSignRecord',component: PatroSignRecord,},
        {path: '/IntelligentDoor/ExposureTimesTask',component: ExposureTimesTask,},
        {path: '/IntelligentDoor/ExposureTimesAdd',component: ExposureTimesAdd,},
        {path: '/IntelligentDoor/ExposureTimesRecord',component: ExposureTimesRecord,},
        {path: '/IntelligentDoor/CountRealtimeTask',component: CountRealtimeTask,},
        {path: '/IntelligentDoor/CountRealtimeAdd',component: CountRealtimeAdd,},
        {path: '/IntelligentDoor/CountRealtimeRecord',component: CountRealtimeRecord,},
        //考勤管理
        {path: '/WorkCheckManage/WorkCheckTask',component: WorkCheckTask,},
        {path: '/WorkCheckManage/WorkCheckAdd',component: WorkCheckAdd,},
        {path: '/WorkCheckManage/WorkCheckRecord',component: WorkCheckRecord,},
        //访客管理
        {path: '/VistorManage/VistorAuthorize',component: VistorAuthorize,},
        {path: '/VistorManage/Authorize',component: Authorize,},
        {path: '/VistorManage/VistorRecord',component: VistorRecord,},
        //系统管理
        {path: '/SystemManage/RoleManage',component: RoleManage,},
        {path: '/SystemManage/RoleAdd',component: RoleAdd,},
        {path: '/SystemManage/EmployeeManage',component: EmployeeManage,},
        {path: '/SystemManage/EmployeeAdd',component: EmployeeAdd,},
        {path: '/SystemManage/PasswordReset',component: PasswordReset,},
        {path: '/SystemManage/DatabaseManage',component: DatabaseManage,},
        {path: '/SystemManage/databaseTaskAdd',component: databaseTaskAdd,},
        {path: '/SystemManage/LogManage',component: LogManage,},
        {path: '/SystemManage/Holidays',component: Holidays,},
      ]
    },
    {path: '/login',component: Login,}
  ]
// })

const router = new Router({
  // mode: 'history',
  routes
});

/**
 * to:表示目标路由
 * from:表示来源路由
 * next:表示执行下一步操作
 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') { // 当路由为login时就直接下一步操作
    next();
  } else { // 否则就需要判断
    if(localStorage.fst){  // 如果有用户名就进行下一步操作
      next()
    }else{
      next({path: '/login'})  // 没有用户名就跳转到login页面
    }
  }
})


export default router
