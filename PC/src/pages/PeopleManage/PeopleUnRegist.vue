<template>
  <div class="hello">
    <div class="listtitle">未登记人员管理</div>
    <div class="listSearchC">
      
      <el-select v-model="querydata.scene" placeholder="场景" @change="sceneChange">
        <el-option label="请选择场景" value="">
        </el-option>
        <el-option
          v-for="item in scenelist"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="querydata.proId" placeholder="设备"  @change="equipmentChange">
        <el-option label="请选择设备" value=""></el-option>
        <el-option
          v-for="item in prolist"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="querydata.cameraId" placeholder="相机">
        <el-option label="请选择相机" value=""></el-option>
        <el-option
          v-for="item in cameralist"
          :key="item.value"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button round @click="querylist">查询</el-button>
      
    </div>
    <div class="listtableC">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column label="实时抓拍">
          <template slot-scope="scope">
            <img :src="imgurl+'/' +scope.row.image"/>
          </template>
        </el-table-column>
        <el-table-column label="抓拍设备">
          <template slot-scope="scope">{{ifnull(scope.row.device)}}</template>
        </el-table-column>
        <el-table-column label="抓拍相机">
          <template slot-scope="scope">{{ifnull(scope.row.camera)}}</template>
        </el-table-column>
        <el-table-column
          prop="time"
          width='230'
          label="最近抓拍时间">
        </el-table-column>
        <el-table-column label="操作" width=180>
          <template slot-scope="scope">
            <router-link :to="'/PeopleManage/PeopleAdd?id='+scope.row.id+'&unregest=1'" class="el-button el-button--mini redbtn">登记</router-link>
            <el-button class="delbtn"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="querydata.pageIndex"
        :page-size="querydata.pageSize"
        :total="querydata.pagetotal"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      querydata:{
        scene:'',
        proId:'',
        cameraId:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      tableData: [],
      scenelist:[],
      prolist:[],
      cameralist:[],
      imgurl:this.APIURL,
    }
  },
  created(){
    var self = this;
  },
  mounted () {  
    var self = this;
    //场景列表
    self._ajax(self,'/sense/all', {}, function (data) {
      self.scenelist = data.data;
    })
    // 页面加载获取第一列数据
    this.querylist();
  },
  methods: {
    querylist(){
      var self = this;
      // console.log(`当前页: ${self.querydata.currentPage}`);
      self._ajax(self,'/urperson/query', self.querydata, function (data) {
        self.querydata.pagetotal = data.data.total;
        self.querydata.pageSize = data.data.pageSize;
        self.querydata.pageIndex = data.data.pageNum;
        let datalist = data.data.list;
        self.tableData =datalist.map((val)=>{
          if(val.time !== null || val.time !== ''){
            val.time = (val.time).substring(0,19);
          }
          return val;
        })
        // self.tableData = data.data.list;
      })
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.querylist();
    },
    handleDelete(id){
      //删除接口
      var self = this;
      let newarr = new Array();
      newarr.push(id)
      this.Delete(self,'/urperson/delete',{ids:newarr});
    },
    sceneChange(){
      // 根据场景获取设备
      let self= this;
      self._ajax(self,'/device/monitor/getBySenseId', {senseId:self.querydata.scene}, function (data) {
        self.prolist = data.data;
        self.querydata.proId = '';
        self.querydata.cameraId = '';
      })
    },
    equipmentChange(){
      // 根据设备获取人员下发库
      let self= this;
      self._ajax(self,'/device/camera/getByDeviceId', {deviceId:self.querydata.proId}, function (data) {
        self.cameralist = data.data;
        self.querydata.cameraId = '';
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
