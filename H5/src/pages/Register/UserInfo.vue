<template>
  <div class='wechatoutC'>
    <div class="registBG wxbg">
      <div class='wechatInfo'>
        <img :src="userinfo.url"/>
        <p>{{userinfo.weiXinName}}</p>
      </div>
      <div class='lineC'></div>
      <div class='userInfo'>
        <div class='infoLine row'>
          <label>姓名</label><span>{{userinfo.name}}</span>
        </div>
        <div class='infoLine row'>
          <label>手机号</label><span>{{userinfo.phone}}</span>
        </div>
        <div class='infoLine row'>
          <label>性别</label>
          <span v-if="userinfo.gender === '0'">未知</span>
          <span v-if="userinfo.gender === '1'">男</span>
          <span v-if="userinfo.gender === '2'">女</span>
        </div>
        <div class='infoLine row'>
          <label>分组</label><span>{{userinfo.groupName}}</span>
        </div>
        <div class='infoLine row'>
          <label>身份证</label><span>{{userinfo.idCard}}</span>
        </div>
      </div>
      <a @click="AccountBind" v-if="userinfo.personStatus !== '1'">绑定</a>
      <a v-if="userinfo.personStatus === '1'" class="graybtn">绑定</a>
    </div>
    <confirm v-model="show"
        title="操作提示"
        @on-confirm="onConfirm">
        <p style="text-align:center;">手机号一旦绑定无法编辑，是否确认绑定？</p>
      </confirm>
  </div>
</template>

<script>
import { Toast,Confirm, TransferDomDirective as TransferDom } from 'vux'

export default {
  name: 'Register',
  components: {
    Confirm,
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      show:false,
      userinfo:{
      }
    }
  },
  mounted:function(){
    if(localStorage.userInfo){
      let userInfo = JSON.parse(localStorage.userInfo)
      this.userinfo = userInfo;
    }else{
      this.$router.push({path:'/Register/index'});
    }
  },
  methods:{
    AccountBind(){
      this.show = true;
    },
    onConfirm (msg) {
      let self = this;
      this._ajax(self,'/get/visitor/updateBinding',{'openId':self.userinfo.openId,'id':self.userinfo.id,},(data)=>{
        // self.Toast(1,data.desc)
        self.$router.push({path:'/Register/Succeed'});
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
