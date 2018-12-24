<template>
  <div class='wechatoutC'>
    <div class="applicationC">
      <h3>访客信息</h3>
      <div class='appliFormC' id='AjaxForm'>
        <div class='formline row form-group'>
          <label>访客姓名</label>
          <input class='required' disabled v-model="userinfo.name"/>
        </div>
        <div class='formline row form-group'>
          <label>身份证号</label>
          <input class='required' disabled v-model="userinfo.idcard"/>
        </div>
        <div class='formline row form-group'>
          <label>联系方式</label>
          <input class='required phone'  disabled v-model="userinfo.phone" />
        </div>
        <div class='formline form-group'>
          <label>来访事由</label>
          <textarea  disabled v-model="userinfo.reason"></textarea>
        </div>

        <div class='formline form-group'>
          <label>访客照片</label>
          <ul class='imgC clearfix'>
            <li v-for='(imgson,index) in userinfo.imglist' :key='index'>
              <img :src='imgson'/>
            </li>
          </ul>
        </div>
        <div class='formline row form-group'>
          <label>被访人姓名</label>
          <input class='required' disabled v-model="userinfo.bname"/>
        </div>
        <div class='formline row form-group'>
          <label>被访人电话</label>
          <input class='required phone'  disabled v-model="userinfo.bphone" />
        </div>
        <div class='formline row form-group'>
          <label>来访时间</label>
          <div class='daterangeShow'>
            {{Format(userinfo.beginDate)}}~{{Format(userinfo.endDate)}}
          </div>
        </div>
        <div class='ifpassBtnC' v-if="userinfo.status === '0'">
          <a class='weui-btn submitBtn' @click='aplcIfpass(1)'>通过</a>
          <a class='weui-btn submitBtn refuseBtn' @click="refushow = !refushow">拒绝</a>
        </div>
        <div class='ifpassBtnC passedBtn' v-if="userinfo.status !== '0'">
          <a class='weui-btn submitBtn'>通过</a>
          <a class='weui-btn submitBtn refuseBtn'>拒绝</a>
        </div>
        <!-- <div class='ifpassBtnC'>
          <a class='weui-btn submitBtn' @click='aplcIfpass(1)'>通过</a>
          <a class='weui-btn submitBtn refuseBtn' @click="Confirmshow = !Confirmshow">拒绝</a>
        </div> -->
      </div>
    </div>
    <div v-transfer-dom>
      <alert v-model="alertshow" title="提示" @on-hide="onHide">{{alertmsg}}</alert>
      <toast  type="cancel"></toast>
      <div class="refuseC"  v-show="refushow">
        <div class="refuseBG" @click="refushow = !refushow"></div>
        <div class="refuseB">
          <span class="close" @click="refushow = !refushow">X</span>
          <div class="title">备注</div>
          <textarea placeholder="请输入拒绝原因" v-model="updateData.refuseReason"></textarea>
          <a @click="refuseSubmit">提交</a>
        </div>
      </div>
      <toast  type="cancel">qq</toast>
    </div>
  </div>
</template>
<script>
import { AlertModule, Alert,Toast,TransferDomDirective as TransferDom } from 'vux'
export default {
  name: 'Application',
  data () {
    return {
      alertshow:false,
      alertmsg:'',
      refushow:false,
      Confirmshow:false,
      datestart: '',
      dateend: '',
      userinfo:{
      },
      updateData:{
        id:'',
        refuseReason:'',
        status:''
      }
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Alert,
    Toast,
  },
  mounted:function(){
    let self = this;
    this.userinfo = JSON.parse(localStorage.userInfo);
    this.updateData.id = this.userinfo.id;
    let imglist = this.userinfo.image.split(',');
    this.userinfo.imglist = imglist.map((val)=>this.APIURL+'/'+val);
  },
  created(){

  },
  methods: {
    refuseSubmit(){
      if(this.updateData.refuseReason !== ''){
        this.refushow = !this.refushow;
        this.aplcIfpass(2)
      }
    },
    aplcIfpass(state){
      // 是否通过
      let self = this;
      this.updateData.status=state;
      this._ajax(this,'/get/visitor/updateAppointment',this.updateData,(data)=>{
        self.alertmsg = data.desc;
        self.alertshow = true;
      })
    },
    onHide () {
      // 提交成功弹框显示后，点击确定刷新界面
      this.$router.push({path:'/Visitors/VisitorsList'});
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
