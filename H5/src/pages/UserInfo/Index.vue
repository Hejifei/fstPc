<template>
  <div class='wechatoutC'>
    <div class="registBG wxbg">
      <div class='wechatInfo'>
        <img />
        <p>{{userinfo.nickname}}</p>
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
          <label>性别</label><span>{{userinfo.sex}}</span>
        </div>
        <div class='infoLine row'>
          <label>分组</label><span>{{userinfo.group}}</span>
        </div>
        <div class='infoLine row'>
          <label>身份证</label><span>{{userinfo.idcard}}</span>
        </div>
      </div>
      <a>绑定</a>
      <span class="mui-badge">1</span>
<span class="mui-badge mui-badge-primary">12</span>
<span class="mui-badge mui-badge-success">123</span>
<span class="mui-badge mui-badge-warning">3</span>
<span class="mui-badge mui-badge-danger">45</span>
<span class="mui-badge mui-badge-purple">456</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      userinfo:{
        imgsrc:'',
        nickname:'微信昵称xxx',
        name:'京津冀',
        phone:'1280938038',
        sex:'女',
        group:'xxx',
        idcard:'xxxxxxxx'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
