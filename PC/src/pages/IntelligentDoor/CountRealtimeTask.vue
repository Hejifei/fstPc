<template>
  <div class="hello">
    <div class="listtitle">实时计数任务</div>
    <div class="listSearchC">
      <el-input
        placeholder="输入任务名称查找"
        v-model="querydata.countingName"
        clearable>
      </el-input>
      <el-button round @click="querylist">查询</el-button>
      <el-row>
        <el-col :span="12">
          <router-link to="/IntelligentDoor/CountRealtimeAdd" class="el-button">新增</router-link>
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
        <el-table-column label="选择" type="selection" width='50'></el-table-column>
        <el-table-column label="任务名称">
          <template slot-scope="scope">{{ifnull(scope.row.countingName)}}</template>
        </el-table-column>
        <el-table-column label="频次">
          <template slot-scope="scope">
            <span v-if="scope.row.executionType === '1'">每天</span>
            <span v-else-if="scope.row.executionType === '2'">一次</span>
            <span v-else>--</span>
        </template>
        </el-table-column>
        <el-table-column label="计数日期" width='220'>
          <template slot-scope="scope">{{ifnull(scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column label="计数时间" width=120>
          <template slot-scope="scope">{{ifnull(scope.row.countingOptionTime)}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '1'">启动</span>
            <span v-else-if="scope.row.status === '2'">暂停</span>
            <span v-else-if="scope.row.status === '3'">删除</span>
            <span v-else-if="scope.row.status === '4'">已结束</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width=250>
          <template slot-scope="scope">
            <router-link :to="'/IntelligentDoor/CountRealtimeAdd?id='+scope.row.id+'&&view=true'" class="el-button el-button--mini redbtn">查看</router-link>
            <el-button title="启动状态的任务无法编辑" v-if="scope.row.status === '0' || scope.row.status === '1' || scope.row.status === '3' || scope.row.status === '4'" size="mini" disabled class="disablebtn">编辑</el-button>
            <router-link v-if="scope.row.status === '2'" :to="'/IntelligentDoor/CountRealtimeAdd?id='+scope.row.id" class="el-button el-button--mini redbtn">编辑</router-link>
            <el-button class="greybtn" size="mini"  @click="taskStop(scope.row.id)" v-if="scope.row.status === '1'">暂停</el-button>
            <el-button class="greybtn" size="mini" @click="taskStart(scope.row.id)" v-if="scope.row.status === '2'">启动</el-button>
            <el-button  size="mini" v-if="scope.row.status === '3' ||scope.row.status === '4'"  disabled class="disablebtn">暂停</el-button>
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
        countingName:'',
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
      self._ajax(self,'/get/door/selectCountList', self.querydata, function (data) {
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
      this.task_Stop(this,'/get/door/updateCountStatus',{'taskId':id})
    },
    taskStart(id){
      //启动
      this.task_Start(this,'/get/door/countStart',{'taskId':id})
    },
    handleSelectionChange(val) {
      // 获取列表选中项id
      this.delIds = val.map((val)=>val.id);
    },
    listDelete(){
      // 列表页删除
      this.Delete(this,'/get/door/deleteCount ',{'taskId':String(this.delIds)});
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
