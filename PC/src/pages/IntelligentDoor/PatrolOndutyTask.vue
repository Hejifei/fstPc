<template>
  <div class="hello">
    <div class="listtitle">在岗巡查任务</div>
    <div class="listSearchC">
      <el-input
        placeholder="输入巡查任务名称"
        v-model="querydata.makeName"
        clearable>
      </el-input>
      <el-button round @click="querylist">查询</el-button>
      <el-row>
        <el-col :span="12">
          <router-link to="/IntelligentDoor/PatrolOndutyAdd" class="el-button">新增</router-link>
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
          <template slot-scope="scope">{{ifnull(scope.row.makeName)}}</template>
        </el-table-column>
        <el-table-column label="任务类型">
          <template slot-scope="scope">
            <span v-if="scope.row.makeType === '1'">在岗</span>
            <span v-if="scope.row.makeType === '2'">签到</span>            
          </template>
        </el-table-column>
        <el-table-column label="频次">
          <template slot-scope="scope">
            <span v-if="scope.row.executionType === '1'">每天</span>
            <span v-else-if="scope.row.executionType === '2'">一次</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="巡查(签到)日期" width='230'>
          <template slot-scope="scope">{{ifnull(scope.row.createDate)}}</template>
        </el-table-column>
        <el-table-column label="巡查(签到)时间" width='120'>
          <template slot-scope="scope">{{ifnull(scope.row.createOption)}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '1'">启动</span>
            <span v-else-if="scope.row.status === '2'">暂停</span>
            <span v-else-if="scope.row.status === '3'">删除</span>
            <span v-else-if="scope.row.status === '4'">已结束</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width=340>
          <template slot-scope="scope">
            <router-link :to="'/IntelligentDoor/PatrolOndutyAdd?id='+scope.row.id+'&&view=true'" class="el-button el-button--mini redbtn">查看</router-link>
            <el-button title="启动状态的任务无法编辑" v-if="scope.row.status === '0' || scope.row.status === '1' || scope.row.status === '3' || scope.row.status === '4'" size="mini" disabled class="disablebtn">编辑</el-button>
            <router-link v-if="scope.row.status === '2'" :to="'/IntelligentDoor/PatrolOndutyAdd?id='+scope.row.id" class="el-button el-button--mini redbtn">编辑</router-link>
            <router-link :to="'/IntelligentDoor/NoticeOfLeaving?id='+scope.row.id" class="el-button el-button--mini greybtn">离岗通知</router-link>
            
            <!-- <el-button class="greybtn" size="mini" @click="noticeOfLeaving(scope.row.id)">离岗通知</el-button> -->
            <el-button class="greybtn" size="mini"  @click="taskStop(scope.row.id)" v-if="scope.row.status === '1'">暂停</el-button>
            <el-button class="greybtn" size="mini" @click="taskStart(scope.row.id)" v-if="scope.row.status === '2'">启动</el-button>
            <el-button  size="mini" v-if="scope.row.status === '3' ||scope.row.status === '4'"  disabled class="disablebtn">暂停</el-button>
            <!-- <el-button class="greybtn" size="mini" @click="Patrolnow(scope.row.id)">立即巡查</el-button> -->
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
        makeName:'',
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
      self._ajax(self,'/get/door/patrolList', self.querydata, function (data) {
          self.querydata.pagetotal = data.data.total;
          self.querydata.pageSize = data.data.pageSize;
          self.querydata.pageIndex = data.data.pageNum;
          self.tableData = data.data.list;
      })
    },
    handleCurrentChange(val) {
      this.querylist();
    },
    taskStop(id){
      //暂停
      this.task_Stop(this,'/get/door/updateMakeStatus',{'taskId':id})
    },
    taskStart(id){
      //启动
      this.task_Start(this,'/get/door/makeStart',{'taskId':id})
    },
    noticeOfLeaving(id){
      // 离岗通知
      let self = this;
      self.$confirm('是否离岗通知?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          self._ajax(self,'/get/door/attendanceStart',{'taskId':id}, function (data) {
            self.$message({
              type: 'success',
              message: data.desc
            });
            self.querylist();
          })
      }).catch(() => {
            self.$message({
                type: 'info',
                message: '已取消离岗通知'
            });
      });
    },
    Patrolnow(id){
      //立即巡查
      let self = this;
      self.$confirm('是否立即巡查?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          self._ajax(self,'/get/door/attendanceStart',{'taskId':id}, function (data) {
            self.$message({
              type: 'success',
              message: data.desc
            });
            self.querylist();
          })
      }).catch(() => {
            self.$message({
                type: 'info',
                message: '已取消立即巡查'
            });
      });
    },
    handleSelectionChange(val) {
      // 获取列表选中项id
      this.delIds = val.map((val)=>val.id);
    },
    listDelete(){
      // 列表页删除
      this.Delete(this,'/get/door/deleteMake',{'taskId':String(this.delIds)});
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
