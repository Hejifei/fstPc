<template>
  <div class="hello">
    <div class="listtitle">通知任务</div>
    <div class="listSearchC">
      <el-input
        placeholder="输入任务名称"
        v-model="querydata.noticeName"
        clearable>
      </el-input>
      <el-button round @click="querylist">查询</el-button>
      <el-row>
        <el-col :span="12">
          <router-link to="/noticeManage/NoticeTaskAdd" class="el-button">新增</router-link>
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
          width='50'>
        </el-table-column>
        <el-table-column label="任务名称">
          <template slot-scope="scope">{{ifnull(scope.row.noticeName)}}</template>
        </el-table-column>
        <el-table-column label="任务状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '1'">启动</span>
            <span v-if="scope.row.status === '2'">暂停 </span>
            <span v-if="scope.row.status === '4'">已结束 </span>
            <span v-if="scope.row.status === '0'">--</span>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.noticType === '1'">普通通知</span>
            <span v-if="scope.row.noticType === '2'">定时通知 </span>
          </template>
        </el-table-column>
        <el-table-column label="通知有效时间" width='220'>
          <template slot-scope="scope">{{ifnull(scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column label="通知状态">
          <template slot-scope="scope">
            <span v-if="scope.row.noticeStatus === '1'">有效</span>
            <span v-if="scope.row.noticeStatus === '2'">过期 </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width='230'>
          <template slot-scope="scope">
            <router-link :to="'/noticeManage/NoticeTaskAdd?id='+scope.row.id+'&view=true'" class="el-button el-button--mini redbtn">查看</router-link>
            <el-button title="启动状态的任务无法编辑" v-if="scope.row.status === '1' || scope.row.status === '4'" size="mini" disabled class="disablebtn">编辑</el-button>
            <router-link v-if="scope.row.status === '0' || scope.row.status === '2'" :to="'/noticeManage/NoticeTaskAdd?id='+scope.row.id" class="el-button el-button--mini redbtn">编辑</router-link>
            <el-button v-if="scope.row.status === '0' || scope.row.status === '4' || scope.row.noticeStatus === '2'" size="mini" disabled class="disablebtn">启动</el-button>
            <el-button v-if="scope.row.status === '1' && scope.row.noticeStatus === '1'" class="greybtn" size="mini" @click="taskStop(scope.row.id)">暂停</el-button>
            <el-button v-if="scope.row.status === '2' && scope.row.noticeStatus === '1'" class="greybtn" size="mini" @click="taskStart(scope.row.id)">启动</el-button>
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
        noticeName:'',
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
      self._ajax(self,'/get/notice/taskList', self.querydata, function (data) {
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
      var self = this;
      self.$confirm('是否暂停?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self._ajax(self,'/get/notice/updateNoticeStatus', {'taskId':id}, function (data) {
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
        self._ajax(self,'/get/notice/startNoticeStatus', {'taskId':id}, function (data) {
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
      this.Delete(this,'/get/notice/deleteNotice',{'ids':String(this.delIds)});
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
