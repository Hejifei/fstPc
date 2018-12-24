<template>
  <div class="hello">
    <div class="listtitle">监控管理</div>
    <div class="monitorC">
      <div class="monitorL">
        <el-tree
          :data="treedata"
          :props="defaultProps"
          accordion
          @node-click="handleNodeClick">
        </el-tree>
      </div>
      <div class="monitorR">
        <object type='application/x-vlc-plugin' pluginspage="http://www.videolan.org/" id='vlc' events='false' width="720" height="410">
          <!-- rtsp://admin:Eutroeye@10.10.30.231:554/h264/ch1/main -->
          <param name='mrl' value='' />
          <param name='volume' value='50' />
          <param name='autoplay' value='true' />
          <param name='loop' value='false' />
          <param name='fullscreen' value='false' />
          <param name='controls' value='false' />
        </object>
        <div class="imglistoutC">
          <div class="imglist">
            <div class="imgC" :class="[person.registered === true ? 'registed' : 'unregist']" v-for="(person,index) in personlist" :key="index">
              <img :src="APIURL+'/' +person.image" />
              <p>{{person.registered === true ? '已注册' : '未注册'}}</p>
              <p>{{person.time}}</p>
            </div>
            <!-- <div class="imgC unregist">
              <img src="../../assets/img/head.jpg" />
              <p>未注册</p>
              <p>2018.07.10 17:25</p>
            </div>
            <div class="imgC registed">
              <img src="../../assets/img/head.jpg" />
              <p>未注册</p>
              <p>2018.07.10 17:25</p>
            </div> -->
          </div>
        </div>
      </div>
      
    </div>
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      senseTree:[],
      cameraId:1,
      videourl:'',
      treedata:[],
      defaultProps: {
          children: 'children',
          label: 'label'
      },
      querydata:{
        currentPage: 1,
        pagesize:10,
        pagetotal:100
      },
      tableData: [],
      personlist:[],
    }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    //获取场景树
    self._ajax(self,'/sense/tree', {}, function (data) {
      let treelist = [];
      if(data.data.length>0){
        treelist = data.data.map((val)=>{
          let menu_p ={'label':val.name,'id':val.id};
          if(val.monitorDevices.length > 0){
            let menu_s=val.monitorDevices.map((val1)=>{
              let menu2 ={'label':val1.name,'id':val1.id};
              if(val1.cameras.length > 0){
                let menu_ss=val1.cameras.map((val2)=>{
                  return {'label':val2.name,'id':val2.id,'ifcamera':true}
                })
                menu2.children = menu_ss;
              }
              return menu2
            })
            menu_p.children = menu_s
          }
          return menu_p
        })
        self.treedata = treelist;
      }
    })
    // 页面加载获取第一列数据
    this.getVideoUrl();
    this.getMointorPerson();
  },
  methods: {
     doGo(mrl) { 
      try {
        var vlc = document.getElementById("vlc"); 
        vlc.playlist.clear();
        var itemId=vlc.playlist.add(mrl);
        vlc.playlist.playItem(itemId); 
      } catch (error) {
        console.log(error);
      }    
    },
    getVideoUrl(){
      let self = this;
      self._ajax(self,'/monitor/video', {cameraId:self.cameraId}, function (data) {
        self.videourl = data.data.url;
      })
      if(self.videourl){
        this.doGo(self.videourl);
      }
    },
    getMointorPerson(){
      let self = this;
      self._ajax(self,'/monitor/person', {cameraId:self.cameraId}, function (data) {
        self.personlist = data.data;
      })
    },
    handleNodeClick(data) {
      // 状态树点击
      if(data.ifcamera === true){
        this.cameraId = data.id;
        this.getMointorPerson();
        this.getVideoUrl();
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
