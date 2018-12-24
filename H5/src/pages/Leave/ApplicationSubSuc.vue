<template>
  <div class='wechatoutC'>
    <div class="AppSubSuc wxbg">
      <img src='../../assets/img/wx_commitok.png'/>
      <h3>提交成功</h3>
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
    // setTimeout(()=>{
    //   window.opener=null;
    //   window.open('',self);
    //   window.close();
    // },3000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
