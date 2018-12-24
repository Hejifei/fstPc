<template>
  <div class='wechatoutC'>
    <div class="registSucceed wxbg">
      <img src='../../assets/img/wx_bindok.png'/>
      <h3>绑定成功</h3>
      <p>您已成功绑定手机号
        <!-- ，3s后将关闭窗口。 -->
        </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      phone:''
    }
  },
  mounted:function(){
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
