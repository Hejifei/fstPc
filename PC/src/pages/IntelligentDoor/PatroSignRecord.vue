<template>
  <div class="hello">
    <div class="listtitle">在岗签到记录</div>
    <!-- 下载 -->
      <form id="searchForm" method='post' style="display:none;">
        <input name="taskId" v-model="querydata.taskId"/>
        <input name="groupId" v-model="querydata.groupId"/>
        <input name="deviceId" v-model="querydata.deviceId"/>
        <input name="cameraId" v-model="querydata.cameraId"/>
        <input name="name" v-model="querydata.name"/>
      </form>
    <div class="listSearchC">
      <el-select v-model="querydata.taskId" placeholder="选择任务">
        <el-option label="请选择任务" value=""></el-option>
        <el-option
          v-for="attendance in attendanceName"
          :key="attendance.id"
          :label="attendance.makeName"
          :value="attendance.id">
        </el-option>
      </el-select>
      <el-select v-model="querydata.groupId" placeholder="分组">
        <el-option label="请选择分组" value=""></el-option>
        <el-option
          v-for="group in GroupList"
          :key="group.id"
          :label="group.name"
          :value="group.id">
        </el-option>
      </el-select>
      <el-select v-model="querydata.deviceId" placeholder="设备" @change="deviceChange">
        <el-option label="请选择设备" value=""></el-option>
        <el-option
          v-for="device in DevieAll"
          :key="device.id"
          :label="device.deviceName"
          :value="device.id">
        </el-option>
      </el-select>
      <el-select v-model="querydata.cameraId" placeholder="摄像头">
        <el-option label="请选择摄像头" value=""></el-option>
        <el-option
          v-for="camera in cameralist"
          :key="camera.id"
          :label="camera.name"
          :value="camera.id">
        </el-option>
      </el-select>
      <el-input
        placeholder="输入姓名查找"
        v-model="querydata.name"
        clearable>
      </el-input>
      <el-button round @click="querylist">查询</el-button>
      <el-button class="exportbtn" @click="exportEposure"><img src="../../assets/img/icons/content_export.png"/> 导出</el-button>
      <!-- <el-row>
        <el-col :span="24" class="rowright">
          <el-button @click="exportEposure"><img src="../../assets/img/icons/content_export.png"/> 导出</el-button>
        </el-col>
      </el-row> -->
      
    </div>
    <div class="listtableC">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        >
        <el-table-column label="姓名">
          <template slot-scope="scope">{{ifnull(scope.row.personName)}}</template>
        </el-table-column>
        <el-table-column label="分组">
          <template slot-scope="scope">{{ifnull(scope.row.group)}}</template>
        </el-table-column>
        <el-table-column label="电话号码">
          <template slot-scope="scope">{{ifnull(scope.row.phone)}}</template>
        </el-table-column>
        <el-table-column label="签到时间" width='230'>
          <template slot-scope="scope">{{ifnull(scope.row.beginDate)}}</template>
        </el-table-column>
        <el-table-column label="场景">
          <template slot-scope="scope">{{ifnull(scope.row.senseName)}}</template>
        </el-table-column>
        <el-table-column label="最后抓拍设备">
          <template slot-scope="scope">{{ifnull(scope.row.deviceName)}}</template>
        </el-table-column>
        <el-table-column label="摄像头">
          <template slot-scope="scope">{{ifnull(scope.row.cameraName)}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '0'">未签到</span>
            <span v-if="scope.row.status === '1'">签到</span>
          </template>
        </el-table-column>
        <el-table-column label="记录日期">
          <template slot-scope="scope">{{ifnull(Format_ymd(scope.row.createTime))}}</template>
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
      delIds:[],
      querydata:{
       taskId:'',
        groupId:'',
        deviceId:'',
        cameraId:'',
        name:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      tableData: [],
      attendanceName:[],
      GroupList:[],
      DevieAll:[],
      cameralist:[],
      
    }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    // 任务
    self._ajax(self,'/get/door/getCheckInTaskAll', {}, function (data) {self.attendanceName = data.data;})
    // 分组
    self._ajax(self,'/get/notice/attendanceGroup', {}, function (data) {self.GroupList = data.data;})
    // 设备
    self._ajax(self,'/get/door/getDevieAll', {}, function (data) {self.DevieAll = data.data;})
    // 页面加载获取第一列数据
    this.querylist();
  },
  methods: {
    querylist(){
      let self = this;
      self._ajax(self,'/get/door/checkRecordList', self.querydata, function (data) {
          self.querydata.pagetotal = data.data.total;
          self.querydata.pageSize = data.data.pageSize;
          self.querydata.pageIndex = data.data.pageNum;
          let datalist = [];
          if(data.data.list.length > 0){
            datalist = (data.data.list).map((val)=>{
              if(val.beginDate !== null){
                val.beginDate = (val.beginDate).substring(0,19);
              }
              return val;
            })
          }
          self.tableData = datalist;
          
      })
    },
    handleCurrentChange(val) {
      this.querylist();
    },
    handleSelectionChange(val) {
      // 获取列表选中项id
      this.delIds = val.map((val)=>val.id);
    },
    deviceChange(){
      let self = this;
      self.querydata.cameraId='';
      if(self.querydata.deviceId !== ''){
        self._ajax(self,'/get/door/getCameraAll ', {'devieId':self.querydata.deviceId}, function (data) {self.cameralist = data.data;})
      }else{
        self.cameralist=[];
      }
    },
    exportEposure(){
      // 导出
      var form = $('#searchForm');
      form.attr("action", this.APIURL + "/get/door/exportCheckInRecord");
      form.submit();
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
