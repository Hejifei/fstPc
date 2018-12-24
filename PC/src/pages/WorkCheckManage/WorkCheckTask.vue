<template>
  <div class="hello">
    <div class="listtitle">考勤任务</div>
    <div class="listSearchC">
      <el-input
        placeholder="输入任务名称"
        v-model="querydata.checkName"
        clearable>
      </el-input>
      <el-button round @click="querylist">查询</el-button>
      <el-row>
        <el-col :span="12">
          <router-link to="/WorkCheckManage/WorkCheckAdd" class="el-button">新增</router-link>
          <el-button @click="listDelete">删除</el-button> 
        </el-col>
        <el-col :span="12" class="rowright"></el-col>
      </el-row>
      
    </div>
    <div class="listtableC">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
          label="选择"
          type="selection"
          width='50'
          >
        </el-table-column>
        <el-table-column label="任务名称">
          <template slot-scope="scope">{{ifnull(scope.row.checkName)}}</template>
        </el-table-column>
        <el-table-column
          prop="checkDesc"
          :show-overflow-tooltip='true'
          label="任务描述">
        </el-table-column>
        <el-table-column
          label="频次">
          <template slot-scope="scope">{{ifnull(scope.row.executionType === '1' ? '每天' : '一次')}}</template>
        </el-table-column>
        <!-- <el-table-column
          prop="checkWeek"
          label="考勤周天"
          title='checkWeek'
          :show-overflow-tooltip='true' >
        </el-table-column> -->
        <el-table-column label="考勤日期" width=220>
          <template slot-scope="scope">{{ifnull(scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span  v-if="scope.row.status === '1'">启动</span>
            <span  v-if="scope.row.status === '2'">暂停</span>
            <span  v-if="scope.row.status === '3'">删除</span>
            <span  v-if="scope.row.status === '4'">已结束</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width=180>
          <template slot-scope="scope">
            <el-button title="启动状态的任务无法编辑" v-if="scope.row.status === '0' || scope.row.status === '1' || scope.row.status === '3' || scope.row.status === '4'" size="mini" disabled class="disablebtn">编辑</el-button>
            <router-link v-if="scope.row.status === '2'" :to="'/WorkCheckManage/WorkCheckAdd?id='+scope.row.id" class="el-button el-button--mini redbtn">编辑</router-link>
            <el-button v-if="scope.row.status === '1'" class="greybtn"  size="mini" @click="taskStop(scope.row.id)">暂停</el-button>
            <el-button v-if="scope.row.status === '2'" class="greybtn"  size="mini" @click="taskStart(scope.row.id)">启动</el-button>
            <el-button v-if="scope.row.status === '4'"   size="mini"  disabled class="暂停">启动</el-button>
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
      delIds:[],
      querydata:{
        checkName:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      tableData: [],
      
    }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    // 页面加载获取第一列数据
    this.querylist();
    
  },
  methods: {
    querylist(){
      let self = this;
      self._ajax(self,'/get/notice/attendanceList', self.querydata, function (data) {
        self.querydata.pagetotal = data.data.total;
        self.querydata.pageSize = data.data.pageSize;
        self.querydata.pageIndex = data.data.pageNum;
        let datalist = data.data.list;
        if(datalist.length > 0){
          for(let i in datalist){
            datalist[i].checkWeek = self.wekdaychange(datalist[i].checkWeek)
          }
        }
        self.tableData = datalist
      })
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.querylist();
    },
    taskStop(id){
      //暂停
      var self = this;
      self.$confirm('是否暂停?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self._ajax(self,'/get/notice/attendanceStatus', {'taskId':id}, function (data) {
          self.$message({
            type: 'success',
            message: data.desc
          });
          self.querylist();
        })
      }).catch(() => {
        self.$message({
          type: 'info',
          message: '已取消暂停'
        });
      });
    },
    taskStart(id){
      // 启动
      var self = this;
      self.$confirm('是否启动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self._ajax(self,'/get/notice/attendanceStart', {'taskId':id}, function (data) {
          self.$message({
            type: 'success',
            message: data.desc
          });
          self.querylist();
        })
      }).catch(() => {
        self.$message({
          type: 'info',
          message: '已取消启动'
        });
      });
    },
    handleSelectionChange(val) {
      // 获取列表选中项id
      this.delIds = val.map((val)=>val.id);
    },
    listDelete(){
      // 列表页删除
      this.Delete(this,'/get/notice/deleteAttendance',{taskId:String(this.delIds)});
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
