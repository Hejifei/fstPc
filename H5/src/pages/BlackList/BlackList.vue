<template>
  <div>
    <div class="BlakListC div-table"  ref="noCharge"  v-if="authority">
      <div class="groupC">
        <label>分组</label>
        <select v-model="queryData.groupId" placeholder='请选择分组' @change="listquery(1)">
          <option value="">请选择分组</option>
          <option v-for="group in grouplist" :key="group.id" :value="group.id">{{group.name}}</option>
        </select>
      </div>
      <ul class='list table-loading'>
        <li v-for='(user,index) in requestlist' :key='index'  @click='user.ifchecked = !user.ifchecked'>
          <div class='label row'>
            <i class='radiobox' :class='[{radioboxSel:user.ifchecked}]'></i>
            <div class='userInfoC clearfix'>
              <div class='infoC'>
                <h3>{{user.personName}}</h3>
                <p>手机号：{{user.personPhone}}</p>
              </div>
              <span>{{user.personStatus === '0' ? '无效' :'有效' }}</span>
            </div>
            <!-- <input :id='user.id' type='checkbox' v-model="user.ifchecked" /> -->
          </div>
        </li>
        <mugen-scroll v-if="!queryData.isLastPage" :handler="fetchData" :should-handle="!loading" scroll-container="noCharge">
        <!--  <loading :hasLoading="hasLoading"></loading> -->
        loading...
        </mugen-scroll>
      </ul>
      <a class='joinlist' @click='blacklistAdd'>加入黑名单</a>
      
    </div>
    <div class="noauth wxbg" v-if="!authority">
      <img src="../../assets/img/wx_noauth.png"/>
      <h3>您暂时无权访问，请联系管理员</h3>
    </div>
    <toast  type="cancel">qq</toast>
  </div>
</template>
<script>
import MugenScroll from 'vue-mugen-scroll';
import { Toast, TransferDomDirective as TransferDom } from 'vux'

export default {
  name: 'BlackList',
  data () {
    return {
      noauthimg:"../../assets/img/wx_noauth.png",
      authority:false,
      loading:false,
      requestlist:[],
      queryData:{
        groupId:'',
        pageIndex:1,
        pageSize:'15',
        isLastPage:true,
        personId:''
      },
      grouplist:[]
    }
  },
  directives: {
    TransferDom
  },
  components: {
    MugenScroll,
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
    if(sessionStorage.personId){
      self.queryData.personId = sessionStorage.personId;
      // self.queryData.personId = 7;
      self.listquery(1);

      self._ajax(self,'/get/notice/attendanceGroup',{},(data)=>{
        self.grouplist= data.data;
      })
    }else{
      // 判定是否有code，若有code进行下一步操作
      self.ifhascode(self,()=>{
        self._ajax(self,'/get/common/get/personId',{'code':self.code},(data)=>{
          self.queryData.personId = data.data;
          sessionStorage.personId=data.data;
          self.listquery(1);
        })
        
        self._ajax(self,'/get/notice/attendanceGroup',{},(data)=>{
          self.grouplist= data.data;
        })
      })
    }
  },
  created(){

  },
  methods: {
    fetchData() {
      this.loading = true;
      if(!this.queryData.isLastPage){
        this.queryData.pageIndex = this.queryData.pageIndex+1;
        this.listquery();
      }
      this.loading = false;
    },
    listquery(num){
      // 列表查询
      let self = this;
      this._ajax(self,'/get/visitor/blackList',this.queryData,(data)=>{
        self.queryData.isLastPage = data.data.isLastPage;
        self.authority = true;
        let newlist = data.data.list;
        newlist = newlist.map((val)=>{
          val['ifchecked']=false;
          return val;
        })
        if(num){
          self.requestlist = newlist;
        }else{
          self.requestlist = (self.requestlist).concat(newlist);
        }
      },(data)=>{
        if(data.code === 403){
          self.authority = false;
        }else{
          self.Toast(2,data.desc)
        }
      })
    },
    blacklistAdd(){
      //添加到黑名单
      let self = this;
      let newlist=new Array();
      this.requestlist.filter((val)=>{
        if(val.ifchecked){
          newlist.push(val.personPhone);
        }
      })
      if(newlist.length === 0){
        self.Toast(2,'请选择数据！')
      }else{
        this._ajax(self,'/get/visitor/addBlackList',{'strId':String(newlist)},(data)=>{
          self.listquery(1)
          self.Toast(1,data.desc)
        })
      }
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
