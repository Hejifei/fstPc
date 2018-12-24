<template>
  <div class="hello">
    <div class="listtitle">实时计数记录</div>
    <!-- 下载 -->
      <form id="searchForm" method='post' style="display:none;">
        <input name="taskId" v-model="querydata.taskId"/>
        <input name="senceId" v-model="querydata.senceId"/>
      </form>
    <div class="listSearchC">
      <el-select v-model="querydata.taskId" placeholder="选择任务">
        <el-option label="请选择任务" value=""></el-option>
        <el-option
          v-for="attendance in attendanceName"
          :key="attendance.id"
          :label="attendance.countingName"
          :value="attendance.id">
        </el-option>
      </el-select>
      <el-select v-model="querydata.senceId" placeholder="选择场景">
        <el-option label="请选择场景" value=""></el-option>
        <el-option
          v-for="sense in senseList"
          :key="sense.id"
          :label="sense.name"
          :value="sense.id">
        </el-option>
      </el-select>
      <el-button round @click="querylist">查询</el-button>
      <el-button class="exportbtn" @click="exportEposure"><img src="../../assets/img/icons/content_export.png"/> 导出</el-button>
      
    </div>
    <div class="listtableC">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column label="任务名称">
          <template slot-scope="scope">{{ifnull(scope.row.countingName)}}</template>
        </el-table-column>
        <el-table-column label="场景">
          <template slot-scope="scope">{{ifnull(scope.row.senseName)}}</template>
        </el-table-column>
        <el-table-column label="计数">
          <template slot-scope="scope">{{ifnull(scope.row.countName)}}</template>
        </el-table-column>
        <el-table-column label="实时计数日期">
          <template slot-scope="scope">{{ifnull(scope.row.createTime)}}</template>
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
        taskId:'',
        senceId:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      tableData: [],
      attendanceName:[],
      senseList:[],
    }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    // 任务
    self._ajax(self,'/get/door/getCountTaskAll', {}, function (data) {self.attendanceName = data.data;})
    //场景
    self._ajax(self,'/get/door/getAll', {}, function (data) {self.senseList = data.data;})
    // 页面加载获取第一列数据
    this.querylist();
  },
  methods: {
    querylist(){
      let self = this;
      self._ajax(self,'/get/door/selectRecordList', self.querydata, function (data) {
          self.querydata.pagetotal = data.data.total;
          self.querydata.pageSize = data.data.pageSize;
          self.querydata.pageIndex = data.data.pageNum;
          self.tableData = data.data.list;
      })
    },
    handleCurrentChange(val) {
      this.querylist();
    },
    exportEposure(){
      var form = $('#searchForm');
      form.attr("action", this.APIURL + "/get/door/exportCount");
      form.submit();
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
