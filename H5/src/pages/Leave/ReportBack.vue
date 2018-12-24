<template>
  <div class='wechatoutC'>
    <div class="applicationC">
      <h3>销假申请</h3>
      <div class='appliFormC' id='AjaxForm'>
        <div class='formline row'>
          <label>姓名</label>
          <input class='required' disabled v-model="userinfo.name"/>
          <span class='tip'></span>
        </div>
        <div class='formline row'>
          <label>联系方式</label>
          <input class='required' disabled v-model="userinfo.phone" />
          <span class='tip'></span>
        </div>
        <div class='formline row'>
          <label>请假时间</label>
          <div class='daterangeShow'>
            {{Format(userinfo.beginDate)}}~{{Format(userinfo.endTime)}}
          </div>
        </div>
        <div class='formline row form-group' v-if="status === '1'">
          <label>销假时间</label>
          <input class='required'   @click="timeStr_show()" v-model="updateData.terminateTime" v-if="terminateStatus === '0'"/>
          <div class='daterangeShow' v-if="terminateStatus === '1'">
            {{Format(userinfo.terminateTime)}}
          </div>
          <span class='tip'></span>
        </div>
        <van-popup v-model="datebegin_vanshow" position="bottom">
          <van-datetime-picker
            v-model="updateData.terminateTime_norm"
            type="datetime"
            title='销假时间'
            @change='datebeg_change()'
            @confirm='cfm_dateSta()'
            @cancel='datebegin_vanshow = !datebegin_vanshow'
          />
        </van-popup>
        <div class='formline row'>
          <label>销假状态</label>
          <input disabled v-model="terminateStatustext" />
          <span class='tip'></span>
        </div>
        <div class='formline form-group' v-if="status === '1'">
          <label>销假原因</label>
          <textarea  class='required' maxlength='100' v-model="updateData.terminateReason" placeholder="这里是销假原因" v-if="terminateStatus === '0'"></textarea>
          <textarea maxlength='100' v-model="userinfo.terminateDesc" placeholder="这里是销假原因" v-if="terminateStatus === '1'" disabled></textarea>
          <span class='tip'></span>
        </div>
        <div class='formline form-group' v-if="status === '2'">
          <label>拒绝原因</label>
          <textarea  class='required' maxlength='100' disabled v-model="userinfo.refusereson" placeholder="这里是拒绝原因"></textarea>
          <span class='tip'></span>
        </div>
        <!-- <session> -->
          <a v-show="status === '1' && terminateStatus === '0'" class='weui-btn submitBtn' id='SubmitBtn'>提交</a>
          <a v-show="status === '1' && terminateStatus === '1'" class='weui-btn submitBtn refuseBtn'>提交</a>
          <a v-show="status === '2'" class='weui-btn submitBtn refuseBtn' >提交</a>
        <!-- </session> -->
        
        
        
      </div>
    </div>
    <div v-transfer-dom>
      <alert v-model="alertshow" title="提示" @on-hide="onHide">{{alertmsg}}</alert>
      <toast  type="cancel"></toast>
    </div>
  </div>
</template>
<script>
import { AlertModule, Alert,Toast,TransferDomDirective as TransferDom } from 'vux'
export default {
  name: 'Application',
  data () {
    return {
      status:'1',// 0 审批中 1 通过 2 拒绝
      terminateStatus:'0',// 0 未销假 1 已销假
      terminateStatustext:'未销假',
      datebegin_vanshow:false,
      alertshow:false,
      alertmsg:'',
      userinfo:{
      },
      updateData:{
        id:'',
        terminateReason:'',
        terminateTime:'',
        terminateTime_norm:'',
      },
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
    self.status = this.userinfo.status;
    self.terminateStatus = this.userinfo.terminateStatus;
    self.terminateDesc = this.userinfo.terminateDesc;
    self.terminateStatustext =  this.userinfo.terminateStatus === '0' ? '未销假' : '已销假'
    this.updateData.id = this.userinfo.id;
    this.AjaxSumbit(this,'','',()=>{
      self.submitnow();
    })
  },
  created: function () {
    
  },
  methods: {
    submitnow(){
      let self = this;
      // self.updateData.terminateTime = self.updateData.terminateTime_norm.replace('T',' ');
      this._ajax(this,'/get/visitor/updateTerminate',this.updateData,(data)=>{
        self.alertmsg = data.desc;
        self.alertshow = true;
      })
    },
    onHide () {
      // 提交成功弹框显示后，点击确定刷新界面
      this.$router.push({path:'/Leave/ApplicationOfMine'});
    },
    timeStr_show(){
      this.updateData.terminateTime_norm = new Date();
      this.datebegin_vanshow = !this.datebegin_vanshow;
    },
    datebeg_change(){
      let self = this;
      self.updateData.terminateTime = self.Format_nmdhm(self.updateData.terminateTime_norm);
    },
    cfm_dateSta(){
      this.datebegin_vanshow = !this.datebegin_vanshow;
      this.datebeg_change();
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
