<template>
  <div class="hello">
    <div class="listtitle">考勤记录</div>
    <div class="listSearchC">
      <!-- 下载 -->
      <form id="searchForm" method='post' style="display:none;">
        <input name="taskId" v-model="querydata.taskId"/>
        <input name="id" v-model="querydata.id"/>
        <input name="nameOrPhone" v-model="querydata.nameOrPhone"/>
        <input name="beginDate" v-model="querydata.beginDate"/>
        <input name="endDate" v-model="querydata.endDate"/>
      </form>
      <el-select v-model="querydata.taskId" placeholder="选择任务">
        <el-option
          label="请选择任务"
          value="">
        </el-option>
        <el-option
          v-for="attendance in attendanceName"
          :key="attendance.id"
          :label="attendance.checkName"
          :value="attendance.id">
        </el-option>
      </el-select>
      <el-select v-model="querydata.id" placeholder="选择分组">
        <el-option
          label="请选择分组"
          value="">
        </el-option>
        <el-option
          v-for="agroup in attendanceGroup"
          :key="agroup.id"
          :label="agroup.name"
          :value="agroup.id">
        </el-option>
      </el-select>
      <el-input
        placeholder="输入姓名、手机号"
        v-model="querydata.nameOrPhone"
        clearable>
      </el-input>
      <el-date-picker
        v-model="querydata.beginDate_unform"
        type="date"
        placeholder="选择开始日期">
      </el-date-picker>
      <el-date-picker
        v-model="querydata.endDate_unform"
        type="date"
        placeholder="选择结束日期">
      </el-date-picker>
      <el-button round @click="querylist">查询</el-button>
      <el-button class="exportbtn" @click="kq_export"><img src="../../assets/img/icons/content_export.png"/> 导出</el-button>
      
    </div>
    <div class="listtableC">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column label="姓名">
          <template slot-scope="scope">{{ifnull(scope.row.name)}}</template>
        </el-table-column>
        <el-table-column label="手机号" width='130'>
          <template slot-scope="scope">{{ifnull(scope.row.phone)}}</template>
        </el-table-column>
        <el-table-column label="分组">
          <template slot-scope="scope">{{ifnull(scope.row.group)}}</template>
        </el-table-column>
        <el-table-column label="日期" width='120'>
          <template slot-scope="scope">{{ifnull(scope.row.date)}}</template>
        </el-table-column>
        <el-table-column label="上班时间">
          <template slot-scope="scope">{{ifnull(scope.row.beginDate)}}</template>
        </el-table-column>
        <el-table-column label="上班状态">
          <template slot-scope="scope">
            <span v-if="scope.row.beginStatus === '0'" class="span_yel">迟到</span>
            <span v-if="scope.row.beginStatus === '1'" class="span_gre">正常</span>
            <span v-if="scope.row.beginStatus === '2'" class="span_yel">早退</span>
            <span v-if="scope.row.beginStatus === '3'" class="span_red">缺勤</span>
          </template>
        </el-table-column>
        <el-table-column label="下班时间">
          <template slot-scope="scope">{{ifnull(scope.row.endDate)}}</template>
        </el-table-column>
        <el-table-column label="下班状态">
          <template slot-scope="scope">
            <span v-if="scope.row.endStatus === '0'" class="span_yel">迟到</span>
            <span v-if="scope.row.endStatus === '1'" class="span_gre">正常</span>
            <span v-if="scope.row.endStatus === '2'" class="span_yel">早退</span>
            <span v-if="scope.row.endStatus === '3'" class="span_red">缺勤</span>
          </template>
        </el-table-column>
        <el-table-column label="工作时长">
          <template slot-scope="scope">{{ifnull(scope.row.longTime)}}</template>
        </el-table-column>
        <!-- <el-table-column label="设备名">
          <template slot-scope="scope">{{ifnull(scope.row.deviceName)}}</template>
        </el-table-column>
        <el-table-column label="场景名">
          <template slot-scope="scope">{{ifnull(scope.row.senseName)}}</template>
        </el-table-column> -->
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
        nameOrPhone:'',
        taskId:'',
        id:'',
        beginDate_unform:'',
        endDate_unform:'',
        beginDate:'',
        endDate:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      attendanceName:[],
      attendanceGroup:[],
      options: [{
          value: '选项1',
          label: '选项1'
      }],
      tableData: [],
      
    }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    // 任务列表
    self._ajax(self,'/get/notice/attendanceName', self.querydata, function (data) {
        self.attendanceName = data.data;
    })
    // 分组列表
    self._ajax(self,'/get/notice/attendanceGroup', self.querydata, function (data) {
        self.attendanceGroup = data.data;
    })
    // 页面加载获取第一列数据
    this.querylist();
  },
  methods: {
    querylist(){
      let self = this;
      
      self.querydata.beginDate = self.formatTime(self.querydata.beginDate_unform,1);
      self.querydata.endDate = self.formatTime(self.querydata.endDate_unform,2);
      if(self.querydata.beginDate === '' && self.querydata.endDate !== '' ||self.querydata.beginDate !== '' && self.querydata.endDate === ''){
        self.$message.error('你必须同时选择开始和结束时间！')
      }else if(self.querydata.beginDate_unform - self.querydata.endDate_unform >0){
        self.$message.error('开始时间不能晚于结束时间！')
      } else{
        self._ajax(self,'/get/notice/attendanceRecord', self.querydata, function (data) {
          self.querydata.pagetotal = data.data.total;
          self.querydata.pageSize = data.data.pageSize;
          self.querydata.pageIndex = data.data.pageNum;
          self.tableData = data.data.list;
        })
      }
      
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.querylist();
    },
    kq_export(){
      let self = this;
      self.querydata.beginDate = self.formatTime(self.querydata.beginDate_unform,1);
      self.querydata.endDate = self.formatTime(self.querydata.endDate_unform,2);
      if(self.querydata.beginDate === '' && self.querydata.endDate !== '' ||self.querydata.beginDate !== '' && self.querydata.endDate === ''){
        self.$message.error('你必须同时选择开始和结束时间！')
      }else if(self.querydata.beginDate_unform - self.querydata.endDate_unform >0){
        self.$message.error('开始时间不能晚于结束时间！')
      }else{
        var form = $('#searchForm');
        form.attr("action", this.APIURL + "/get/notice/export");
        form.submit();
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
