<template>
  <div class='wechatoutC'>
    <div class="registBG wxbg">
      <img src='../../assets/img/wx_logo.png'/>
      <input placeholder='手机号' maxlength='11' v-model='phone' />
      <a @click="nextStep">下一步</a>
      <div v-transfer-dom>
        <toast v-model="toast.show" type="cancel">{{toast.text}}</toast>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, TransferDomDirective as TransferDom } from 'vux'

export default {
  name: 'Register',
  directives: {
    TransferDom
  },
  components: {
    Toast,
  },
  data () {
    return {
      toast:{
        show:false,
        text:'',
      },
      phone:'',
      openId:'',
      // phone:'18261598142',
    }
  },
  mounted(){
    let self = this;
    var isPageHide = false;
    // 兼容ios返回不刷新的问题
    window.addEventListener('pageshow', function () {
        if (isPageHide) {
          window.location.reload();
        }
    });
    window.addEventListener('pagehide', function () {
        isPageHide = true;
    });
    if(sessionStorage.openId){
      self.openId = sessionStorage.openId;
    }else{
      // 判定是否有code，若有code进行下一步操作
      self.ifhascode(self,()=>{
        self._ajax(self,'/get/common/get/openId',{'code':self.code},(data)=>{
            self.openId = data.data;
            sessionStorage.openId=data.data;
          })
      });
    }
    
  },
  methods:{
    nextStep(){
      let self = this;
      var reg = /^[1][0-9]{10}$/;
      if(self.phone === ''){
        self.toast.text='请输入手机号!'
        self.toast.show=true;
      }else if(!reg.test(self.phone)){
        self.toast.text='请输入正确的手机号!'
        self.toast.show=true;
      }else{
        self._ajax(self,'/get/visitor/getPersonInfo',{'phone':self.phone,'openId':self.openId},(data)=>{
          localStorage.setItem('userInfo',JSON.stringify(data.data));
          self.$router.push({path:'/Register/UserInfo'});
        })
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
