<template>
  <div class='wechatoutC'>
    <div class="applicationC">
      <h3>访客信息</h3>
      <div class='appliFormC' id='AjaxForm'>
        <div class='formline row form-group'>
          <label>姓名</label>
          <input placeholder='请输入姓名' class='required' v-model="Formdata.name"/>
          <span class='tip'></span>
        </div>
        <div class='formline row form-group'>
          <label>身份证号</label>
          <input placeholder='请输入身份证号' class='required idcard' v-model="Formdata.idcard"/>
          <span class='tip'></span>
        </div>
        <div class='formline row form-group'>
          <label>联系电话</label>
          <input maxlength='11' placeholder='请输入联系电话' class='required phone' v-model="Formdata.phone"/>
          <span class='tip'></span>
        </div>
        <div class='formline form-group'>
          <label>来访事由</label>
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
          <label>被访人姓名</label>
          <input placeholder='请输入被访人姓名' class='required' v-model="Formdata.bname"/>
          <span class='tip'></span>
        </div>
        <div class='formline row form-group'>
          <label>被访人电话</label>
          <input maxlength='11' placeholder='请输入被访人电话' class='required phone' v-model="Formdata.bphone"/>
          <span class='tip'></span>
        </div>
        <div class='formline row form-group'>
          <label>开始时间</label>
          <input class="required timestart" disable @click="timeStr_show()" v-model="Formdata.beginDate" placeholder='开始时间' readonly/>
          <span class='tip'></span>
        </div>
        <div class='formline row form-group'>
          <label>结束时间</label>
          <input class="required timeend" disable @click="timeEnd_show()" v-model="Formdata.endDate" placeholder='结束时间' readonly/>
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
            :min-date="minDate"
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
            :min-date="minDate"
          />
        </van-popup>
        <div class="grayline"></div>
        <div class="tips">
          <label>用户提示<i>*</i></label>
          <p>1.网上预约请提前1天至30天</p>
          <p>2.请在预约完成后电话联系被访人，审批通过您的来访申请</p>
          <p>3.来访时请携带您的身份证</p>
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
      minDate: new Date(),
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
      fileList:[],
      datestart: '',
      dateend: '',
      Formdata:{
        name:'',
        phone:'',
        // personId:'',
        // leave_type:'',
        reason:'',
        image:'',
        approval_type:'',
        // approvalId:'',
        beginDate:'',
        endDate:'',
        beginDate_norm:'',
        endDate_norm:'',
        imglist:[]
      },
      show9:false
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

    self.AjaxSumbit(self,'','',()=>{
      self.submitnow();
    });
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
      // self.Formdata.endDate = self.Formdata.endDate_norm.replace('T',' ');
      if(self.Formdata.phone === self.Formdata.bphone){
        this.Toast(2,'访客手机号与被访人手机号不能相同！');
        // self.msg = '访客手机号与被访人手机号不能相同！';
        // self.show = true;
      }else{
        this._ajax(self,'/get/visitor/addVistorAppointment',this.Formdata,(data)=>{
          self.msg =data.desc;
          self.show = true;
        })
      }
      
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
      self.Formdata.endDate = self.Format_nmdhm(self.Formdata.endTime_norm);
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


/* mint ui timepicker样式修改 */
/* .picker-item{height: 36px !important;line-height: 36px !important;}
.picker-items{height:252px;}
.picker-center-highlight{height: 36px !important;margin-top: -18px !important;} */

/* .picker-toolbar{height: 1.06666rem;}
.mint-datetime .picker-toolbar {
    border-bottom: solid 0.026666rem #eaeaea;
}
.mint-datetime-action{line-height: 1.06666rem;font-size: 0.426666rem;}
.picker-items{font-size: 0.64rem;height:504px;}
.picker-slot{font-size: 0.48rem;}
.picker-item{height: 0.96rem !important;line-height: 0.96rem !important;padding: 0 0.266666rem;}
.picker-center-highlight{height: 72px !important;margin-top: -36px  !important;}
.picker-center-highlight:before, .picker-center-highlight:after{height: 0.026666rem;} */
</style>
