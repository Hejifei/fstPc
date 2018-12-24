<template>
  <div class="hello">
    <el-container class='containerC'>
      <el-header class='BMhead'>
        <el-row :gutter="20">
          <el-col :span="4" class='BMheadL'>
            <img @click='menushow = !menushow' src="../../assets/img/icons/side_hide.png"/>
          </el-col>
          <el-col :span="16" class='BMheadmid'>
            <img src="../../assets/img/logo_title.png"/>
          </el-col>
          <el-col :span="4" class='BMheadR'>
            <el-dropdown >
              <span class="el-dropdown-link">
                <img src="../../assets/img/icons/menu.png"/>
                {{loginName}}
                <img class="headimg" src='../../assets/img/icons/de_head.png'/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <router-link class="headtopa" to="/SystemManage/PasswordReset">编辑密码</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <a class="headtopa" @click="logout">退出</a>
                </el-dropdown-item>
                <!-- <el-dropdown-item >退出</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <transition name="slide-fade">
          <el-collapse-transition>
            <el-aside  v-if="menushow" width="200px">
              <el-menu
                class="el-menu-vertical-demo"
                text-color="#fff"
                background='transparent'
                active-text-color="#fff"
                :unique-opened='true'
                :router="true">
                <el-menu-item class="textleft" index="/home">
                  <img src="../../assets/img/icons/side_main.png" style="margin:0 5px;"/>
                  <span slot="title">首页</span>
                </el-menu-item>
                <div v-for="(menuson,index) in leftmenu" :key="index">
                  <el-submenu class="textleft" :index="String(menuson.id)" v-if="menuson.child.length !== 0">
                    <template slot="title">
                      <img src="../../assets/img/icons/side_rygl.png" v-if="menuson.id === 1"/>
                      <img src="../../assets/img/icons/side_tdgl.png" v-if="menuson.id === 2"/>
                      <img src="../../assets/img/icons/side_tzgl.png" v-if="menuson.id === 3"/>
                      <img src="../../assets/img/icons/side_znmg.png" v-if="menuson.id === 5"/>
                      <img src="../../assets/img/icons/side_kqgl.png" v-if="menuson.id === 6"/>
                      <img src="../../assets/img/icons/side_fkgl.png" v-if="menuson.id === 7"/>
                      <img src="../../assets/img/icons/side_xtgl.png" v-if="menuson.id === 8"/>
                      <span>{{menuson.name}}</span>
                    </template>
                    <el-menu-item v-for="(menuchid,index2) in menuson.child" :key="index2" :index="String(menuchid.url)" >
                      {{menuchid.name}}
                    </el-menu-item>
                  </el-submenu>
                  <el-menu-item class="textleft" :index="menuson.url" v-if="menuson.child.length === 0">
                    <img src="../../assets/img/icons/side_jkgl.png"/>
                    <span slot="title">{{menuson.name}}</span>
                  </el-menu-item>
                </div>
                
                <!-- <el-submenu class="textleft" index="1">
                  <template slot="title">
                    <img src="../../assets/img/icons/side_rygl.png"/>
                    <span>人员管理</span>
                  </template>
                  <el-menu-item index="/PeopleManage/PeopleRegistered">已登记人员管理</el-menu-item>
                  <el-menu-item index="/PeopleManage/PeopleUnRegist">未登记人员管理</el-menu-item>
                  <el-menu-item index="/PeopleManage/PeopleGroupList">人员分组管理</el-menu-item>
                  <el-menu-item index="/PeopleManage/PeopleDataAsync">人员数据同步</el-menu-item>
                </el-submenu>
                <el-submenu class="textleft" index="2">
                  <template slot="title">
                    <img src="../../assets/img/icons/side_tdgl.png"/>
                    <span>通道管理</span>
                  </template>
                  <el-menu-item index="/passManage/EquipmentManage">设备管理</el-menu-item>
                  <el-menu-item index="/passManage/SceneManage">场景管理</el-menu-item>
                </el-submenu> -->
                <!-- <el-submenu class="textleft" index="3">
                  <template slot="title">
                    <img src="../../assets/img/icons/side_tzgl.png"/>
                    <span>通知管理</span>
                  </template>
                  <el-menu-item index="/noticeManage/NoticeTask">通知任务</el-menu-item>
                  <el-menu-item index="/noticeManage/NoticeRecord">通知记录</el-menu-item>
                </el-submenu> -->
                <!-- <el-menu-item class="textleft" index="/Monitor/MonitorManage">
                  <img src="../../assets/img/icons/side_jkgl.png"/>
                  <span slot="title">监控管理</span>
                </el-menu-item> -->
                <!-- <el-submenu class="textleft" index="5">
                  <template slot="title">
                    <img src="../../assets/img/icons/side_znmg.png"/>
                    <span>智能门岗</span>
                  </template>
                  <el-menu-item index="/IntelligentDoor/PatrolOndutyTask">在岗巡查任务</el-menu-item>
                  <el-menu-item index="/IntelligentDoor/PatrolOndutyRecord">在岗巡查记录</el-menu-item>
                  <el-menu-item index="/IntelligentDoor/PatroSignRecord">在岗签到记录</el-menu-item>
                  <el-menu-item index="/IntelligentDoor/ExposureTimesTask">曝光频次任务</el-menu-item>
                  <el-menu-item index="/IntelligentDoor/ExposureTimesRecord">曝光频次记录</el-menu-item>
                  <el-menu-item index="/IntelligentDoor/CountRealtimeTask">实时计数任务</el-menu-item>
                  <el-menu-item index="/IntelligentDoor/CountRealtimeRecord">实时计数记录</el-menu-item>
                </el-submenu>
                <el-submenu class="textleft" index="6">
                  <template slot="title">
                    <img src="../../assets/img/icons/side_kqgl.png"/>
                    <span>考勤管理</span>
                  </template>
                  <el-menu-item index="/WorkCheckManage/WorkCheckTask">考勤任务</el-menu-item>
                  <el-menu-item index="/WorkCheckManage/WorkCheckRecord">考勤记录</el-menu-item>
                </el-submenu>
                <el-submenu class="textleft" index="7">
                  <template slot="title">
                    <img src="../../assets/img/icons/side_fkgl.png"/>
                    <span>访客管理</span>
                  </template>
                  <el-menu-item index="/VistorManage/VistorAuthorize">访客授权</el-menu-item>
                  <el-menu-item index="/VistorManage/VistorRecord">访客记录</el-menu-item>
                </el-submenu>
                <el-submenu class="textleft" index="8">
                  <template slot="title">
                    <img src="../../assets/img/icons/side_xtgl.png"/>
                    <span>系统管理</span>
                  </template>
                  <el-menu-item index="/SystemManage/EmployeeManage">用户管理</el-menu-item>
                  <el-menu-item index="/SystemManage/RoleManage">角色管理</el-menu-item>
                  <el-menu-item index="/SystemManage/DatabaseManage">数据库管理</el-menu-item>
                  <el-menu-item index="/SystemManage/LogManage">日志管理</el-menu-item>
                  <el-menu-item index="/SystemManage/Holidays">节假日管理</el-menu-item>
                </el-submenu> -->
              </el-menu>
            </el-aside>
          </el-collapse-transition>
        </transition>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data () {
    return {
      leftmenu:[],
      loginName:JSON.parse(localStorage.fst).loginName,
      menushow:true,
      imglist:[
        '../../assets/img/icons/side_rygl.png'
      ]
    }
  },
  mounted(){
    // 若没有菜单重新登录
    if(sessionStorage.menuC === undefined){
      this.$router.push({path:'/login'});
    }else{
      let menulist = JSON.parse(sessionStorage.menuC);
      let leftmenu = [];
      for(let i in menulist){
        if(menulist[i].pid === 0){
          let menuson = {'name':menulist[i].name,'id':menulist[i].id,'child':[],'url':menulist[i].url};
          for(let j in menulist){
            if(menulist[j].pid === menulist[i].id){
              menuson.child.push({'name':menulist[j].name,'id':menulist[j].id,'url':menulist[j].url})
            }
          }
          leftmenu.push(menuson);
        }
      }
      this.leftmenu = leftmenu;
    }
    
  },
  methods:{
    logout(){
      let self = this;
      self._ajax(self,'/get/system/logout', {}, function (data) {
        localStorage.removeItem('fst')
        self.$message({
          message: data.desc,
          type: 'success'
        });
        // 页面跳转
        self.$router.push({path:'/login'});
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-header, .el-footer,.el-aside,.el-menu{background-color:transparent;}
.el-menu-item:focus, .el-menu-item:hover,.el-submenu__title:hover,.el-submenu__title:focus{background-color:#00416B !important;}
.el-menu{width:199px;}
.el-submenu img{width:25px;height:25px;margin:0 5px 0 2px;}
.el-menu .is-opened{background-color:#00578F;}
.el-menu .textleft{text-align:left;}
.el-submenu__title i,.el-menu-item i{color:#fff;}
.el-submenu .el-menu-item{padding-left:53px  !important;}
.containerC{height:100vh;background: linear-gradient(to right, #006DB3 , #3CA0D0);}
.BMhead{color:#fff;text-align:left;z-index: 2000;background: linear-gradient(to right, #006DB3 , #3CA0D0);}
.BMheadmid{text-align:left;}
.BMheadmid img{width:220px;height:22px;display: inline-block;position: relative;top: 5px;}
.BMheadL img{width:25px;height:25px;position:relative;top:8px;}
.BMheadR{color:#fff;text-align:right;}
.BMheadR .el-dropdown-link{color:#fff;font-size:12px;}
/* .BMheadR .el-dropdown-link i:nth-child(1){font-size:12px;width:16px;height:16px;display: inline-block;} */
.BMheadR .el-dropdown-link img:nth-child(1){width:15px;height:15px;position:relative;top:3px;margin-right:5px;}
.BMheadR .el-dropdown-link .headimg{width:25px;height:25px;position:relative;top:8px;margin:0 5px;}


.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.el-dropdown{cursor: pointer;}
</style>
