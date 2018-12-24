<template>
  <div class='wechatoutC'>
    <div class="applicationC">
      <h3>请假信息</h3>
      <div class='appliFormC' id='AjaxForm'>
        <div class='formline row form-group'>
          <label>姓名</label>
          <input placeholder='请输入姓名' v-model="Formdata.name" readonly/>
          <span class='tip'></span>
        </div>
        <div class='formline row form-group'>
          <label>联系方式</label>
          <input maxlength='11' placeholder='请输入联系方式' v-model="Formdata.phone" readonly/>
          <span class='tip'></span>
        </div>
        <div class='formline row form-group'>
          <label>请假类型</label>
          <select class='required' v-model="Formdata.leave_type">
            <option value=''>请选择请假类型</option>
            <option value='病假'>病假</option>
            <option value='事假'>事假</option>
            <option value='其他'>其他</option>
          </select>
          <span class='tip'></span>
        </div>
        <div class='formline row form-group'>
          <label>开始时间</label>
          <input class="required timestart" disable @click="timeStr_show()" v-model="Formdata.beginDate" placeholder='开始时间' readonly/>
          <span class='tip'></span>
        </div>
        <div class='formline row form-group'>
          <label>结束时间</label>
          <input class="required timeend" disable @click="timeEnd_show()" v-model="Formdata.endTime" placeholder='结束时间' readonly/>
          <span class='tip'></span>
        </div>
        <van-popup v-model="datebegin_vanshow" position="bottom">
          <van-datetime-picker
            v-model="Formdata.beginDate_norm"
            type="datetime"
            title='开始时间'
            @change='datebeg_change()'
            @confirm='cfm_dateSta()'
            @cancel='datebegin_vanshow = !datebegin_vanshow'
          />
        </van-popup>
        <van-popup v-model="dateend_vanshow" position="bottom">
          <van-datetime-picker
            v-model="Formdata.endTime_norm"
            type="datetime"
            title='结束时间'
            @change='dateend_change()'
            @confirm='cfm_dateEnd()'
            @cancel='dateend_vanshow = !dateend_vanshow'
          />
        </van-popup>
        <!-- <div class='formline row form-group'>
          <label>请假时间</label>
          <div class='daterangeC clearfix'>
            <input class="fl required timestart"  type="datetime-local" :min='mintime' v-model="Formdata.beginDate_norm" placeholder='起始时间'/>
            <input class="fl required timeend"  type="datetime-local" :min='mintime' v-model="Formdata.endTime_norm" placeholder='结束时间'/>
            <span class='tip'></span>
          </div>
        </div> -->
        <div class='formline form-group'>
          <label>请假事由</label>
          <textarea  class='required' maxlength='50' v-model="Formdata.reason"></textarea>
          <span class='tip'></span>
        </div>

        <div class='formline form-group' id="AjaxForm">
          <label>上传照片</label>
          <ul class='imgC clearfix'>
            <li v-for='(imgson,index) in Formdata.imglist' :key='index'>
              <i class='cancelbtn' @click='imgDel(index)'></i>
              <img :src='APIURL+"/"+imgson'/>
            </li>
            <li @click='focusclick' v-if="Formdata.imglist.length <4">
              <div class='upload'></div>
            </li>
          </ul>
          <input type="file" id="csl_file" class="imginput form-submit required" accept="image/*"  @change='javaimgupload'/>
          <span class='tip'></span>
        </div>
        <div class='formline row form-group'>
          <label>审批类型</label>
          <select class='required' placeholder='请选择审批人类型' v-model="Formdata.approval_type" @change="approval_typechange">
            <option value=''>请选择审批人类型</option>
            <option value='2'>辅导员</option>
            <option value='3'>宿管</option>
          </select>
          <span class='tip'></span>
        </div>
        <div class='formline row form-group'>
          <label>审批人</label>
          <select class='required' placeholder='请选择审批人' v-model="Formdata.approvalId">
            <option value=''>请选择审批人</option>
            <option v-for="approver in approverList" :key="approver.id" :value='approver.id'>{{approver.name}}</option>
          </select>
          <span class='tip'></span>
        </div>
        <a class='weui-btn submitBtn' id='SubmitBtn'>提交</a>
        
        
      </div>
    </div>
    <div v-transfer-dom>
      <alert v-model="show" title="提示" @on-hide="onHide">{{msg}}</alert>
    </div>
    <div v-transfer-dom>
      <toast v-model="toast.show" type="cancel">{{toast.text}}</toast>
    </div>
  </div>
</template>
<script>
import { AlertModule, Alert,Toast,TransferDomDirective as TransferDom } from 'vux'

export default {
  name: 'Application',
  data () {
    return {
      // minDate: new Date(),
      currentDate: new Date(),
      datebegin_vanshow:false,
      dateend_vanshow:false,

      mintime:`${(new Date()).getFullYear()}-${this.size2((new Date()).getMonth()+1)}-${this.size2((new Date()).getDate())}T${this.size2((new Date()).getHours())}:${this.size2((new Date()).getMinutes())}`,
      show: false,
      msg:'',
      toast:{
        show:false,
        text:'',
      },
      imgaction:this.APIURL+'/get/common/picture/upload',
      dialogVisible: false,
      dialogImageUrl: '',
      datestart: '',
      dateend: '',
      Formdata:{
        name:'',
        phone:'',
        personId:'',
        leave_type:'',
        reason:'',
        image:'',
        approval_type:'',
        approvalId:'',
        beginDate:'',
        endTime:'',
        beginDate_norm:'',
        endTime_norm:'',
        
        imglist:[]
      },
      approverList:[],
      show9:false
    }
  },
  directives: {
    TransferDom
  },
  components: {
    // DatetimePicker,
    Alert,
    Toast,
  },
  mounted:function(){
    let self = this;
    // 兼容ios返回不刷新的问题
    window.addEventListener('pageshow', function () {
        if (isPageHide) {
          window.location.reload();
        }
    });
    window.addEventListener('pagehide', function () {
        isPageHide = true;
    });
    if(sessionStorage.info){
      let info = JSON.parse(sessionStorage.info);
      self.Formdata.name =  info.name;
      self.Formdata.phone =  info.phone;
      self.Formdata.personId =  info.id;
      self.AjaxSumbit(self,'','',()=>{
        self.submitnow();
      })
    }else{
      // 判定是否有code，若有code进行下一步操作
      self.ifhascode(this,()=>{
        self._ajax(self,'/get/visitor/leave/info',{'code':self.code},(data)=>{
          sessionStorage.info=JSON.stringify(data.data);
          self.Formdata.name =  data.data.name;
          self.Formdata.phone =  data.data.phone;
          self.Formdata.personId =  data.data.id;
        })
        self.AjaxSumbit(self,'','',()=>{
          self.submitnow();
        })
      })
    }
    
  },
  created(){

  },
  methods: {
    onHide () {
      // 提交成功弹框显示后，点击确定刷新界面
      // window.location.reload();
      this.$router.push({path:'/Leave/ApplicationSubSuc'});
    },
    submitnow(){
      let self = this;
      self.Formdata.image = String(self.Formdata.imglist);
      // self.Formdata.beginDate = self.Formdata.beginDate_norm.replace('T',' ');
      // self.Formdata.endTime = self.Formdata.endTime_norm.replace('T',' ');
      this._ajax(self,'/get/visitor/addLeave',this.Formdata,(data)=>{
        self.msg =data.desc;
        self.show = true;
      })
    },
    approval_typechange(){
      let self = this;
      this._ajax(self,'/get/visitor/approverList',{'approval_type':this.Formdata.approval_type},(data)=>{
        self.approverList = data.data;
        self.Formdata.approvalId = '';
      })
    },
    focusclick () {
      document.getElementById('csl_file').click();
    },
    javaimgupload(){
      let self = this;
      this.imginputchange("#csl_file",(data)=>{
        self.Formdata.imglist.push(data.data)
      })
    },
    imgDel(index){
      // 图片删除
      this.Formdata.imglist.splice(index,1);
    },
    timeStr_show(){
      this.Formdata.beginDate_norm = new Date();
      this.datebegin_vanshow = !this.datebegin_vanshow;
    },
    datebeg_change(){
      let self = this;
      self.Formdata.beginDate = self.Format_nmdhm(self.Formdata.beginDate_norm);
    },
    cfm_dateSta(){
      this.datebegin_vanshow = !this.datebegin_vanshow;
      this.datebeg_change();
    },
    timeEnd_show(){
      this.Formdata.endTime_norm = new Date();
      this.dateend_vanshow = !this.dateend_vanshow;
    },
    dateend_change(){
      let self = this;
      self.Formdata.endTime = self.Format_nmdhm(self.Formdata.endTime_norm);
    },
    cfm_dateEnd(){
      this.dateend_vanshow = !this.dateend_vanshow;
      this.dateend_change();
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
