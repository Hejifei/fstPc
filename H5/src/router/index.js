import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import HelloFromVux from '@/components/HelloFromVux'

// 注册
import Register from '@/pages/Register/Index';
import UserInfo from '@/pages/Register/UserInfo';// 用户信息
import Succeed from '@/pages/Register/Succeed';
// 请假
import leaveApplication from '@/pages/Leave/Application';
import ApplicationSubSuc from '@/pages/Leave/ApplicationSubSuc';//提交成功
import ApplicationApprove from '@/pages/Leave/ApplicationApprove';
import ApplicationList from '@/pages/Leave/ApplicationList';
import ApplicationOfMine from '@/pages/Leave/ApplicationOfMine';
import ReportBack from '@/pages/Leave/ReportBack';//销假
//访客
import VisitorsApplication from '@/pages/Visitors/Application';
import VisitorsApprove from '@/pages/Visitors/VisitorsApprove';
import VisitorsList from '@/pages/Visitors/VisitorsList';

//黑名单
import BlackList from '@/pages/BlackList/BlackList';

Vue.use(Router)

export default new Router({
  routes: [
    // {path: '/',name: 'UserInfo',component: UserInfo},
    {path: '/Register/index',name: 'Register',component: Register,meta: {title: '用户注册'}},//注册
    {path: '/Register/UserInfo',name: 'UserInfo',component: UserInfo,meta: {title: '用户信息'}},
    {path: '/Register/Succeed',name: 'Succeed',component: Succeed,meta: {title: '绑定成功'}},
    {path: '/Leave/Application',name: 'leaveApplication',component: leaveApplication,meta: {title: '请假申请'}},//请假申请
    {path: '/Leave/ApplicationSubSuc',name: 'ApplicationSubSuc',component: ApplicationSubSuc,meta: {title: '提交成功'}},//请假申请
    {path: '/Leave/ApplicationApprove',name: 'ApplicationApprove',component: ApplicationApprove,meta: {title: '请假审批'}},
    {path: '/Leave/ApplicationList',name: 'ApplicationList',component: ApplicationList,meta: {title: '请假审批列表'}},//审核列表
    {path: '/Leave/ApplicationOfMine',name: 'ApplicationOfMine',component: ApplicationOfMine,meta: {title: '我的请假列表'}},//用户请假列表
    {path: '/Leave/ReportBack',name: 'ReportBack',component: ReportBack,meta: {title: '销假申请'}},
    {path: '/BlackList/BlackList',name: 'BlackList',component: BlackList,meta: {title: '黑名单'}},//黑名单
    {path: '/Visitors/VisitorsApplication',name: 'VisitorsApplication',component: VisitorsApplication,meta: {title: '访客预约'}},//访客预约
    {path: '/Visitors/VisitorsApprove',name: 'VisitorsApprove',component: VisitorsApprove,meta: {title: '访客审批'}},//访客预约审核
    {path: '/Visitors/VisitorsList',name: 'VisitorsList',component: VisitorsList,meta: {title: '访客审批列表'}},//访客申请列表
  ]
})





