<template>
  <div>
    <div class="applicatiolistC"  ref="noCharge"  v-if="requestlist.length !== 0">
      <ul class='list'>
        <li v-for='(request,index) in requestlist' :key='index' @click="appEdit(request)">
          <a>
            <div class='listDetail clearfix'>
              <label>请假类型：</label>
              <span>{{request.leave_type}}</span>
              <i v-if="request.status === '0'">审批中</i>
              <i v-if="request.status === '1'">通过</i>
              <i v-if="request.status === '2'">拒绝</i>
            </div>
            <div class='listDetail clearfix'>
              <label>请假时间：</label>
              <span>{{Format(request.beginDate)}}~{{Format(request.endTime)}}</span>
            </div>
            <div class='listDetail clearfix'>
              <label>请假事由：</label>
              <span>{{request.reason}}</span>
            </div>
          </a>
        </li>
        <mugen-scroll v-if="!queryData.isLastPage" :handler="fetchData" :should-handle="!loading" scroll-container="noCharge">
          loading...
        </mugen-scroll>
      </ul>
    </div>
    <div class="noRecord wxbg" v-if="requestlist.length === 0">暂无记录</div>
  </div>
</template>
<script>
import MugenScroll from 'vue-mugen-scroll';

export default {
  name: 'ApplicationList',
  components: {
    MugenScroll,
  },
  data () {
    return {
      requestlist:[],
      loading:false,
      queryData:{
        personId:'',
        leaveType:'1',
        pageIndex:1,
        pageSize:15,
        isLastPage:true
      }
    }
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
      // self.queryData.personId = 42;
      self.listquery();
    }else{
      // 判定是否有code，若有code进行下一步操作
      this.ifhascode(this,()=>{
        self._ajax(self,'/get/common/get/personId',{'code':self.code},(data)=>{
          self.queryData.personId = data.data;
          sessionStorage.personId=data.data;
          self.listquery();
        })
      })   
    }  
  },
  methods: {
    listquery(){
      // 列表查询
      let self = this;
      this._ajax(self,'/get/visitor/historyList',this.queryData,(data)=>{
        self.queryData.isLastPage = data.data.isLastPage;
        self.requestlist = (self.requestlist).concat(data.data.list);
      })
    },
    fetchData() {
      this.loading = true;
      // 如果不是最后一页继续添加
      if(!this.queryData.isLastPage){
        this.queryData.pageIndex = this.queryData.pageIndex+1;
        this.listquery();
      }
      this.loading = false
    },
    appEdit(info){
      if(info.status !== '0'){
        localStorage.setItem('userInfo',JSON.stringify(info));
        this.$router.push({path:'/Leave/ReportBack'});
      }
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
