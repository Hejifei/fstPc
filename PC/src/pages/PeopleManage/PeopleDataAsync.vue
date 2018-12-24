<template>
  <div class="hello">
    <div class="listtitle">人员数据同步</div>
    <div class="listSearchC">
      <el-input
        placeholder="任务名称"
        v-model="querydata.name"
        clearable>
      </el-input>
      <el-select v-model="querydata.type" placeholder="任务类型">
        <el-option
          label="请选择任务类型"
          value="">
        </el-option>
        <el-option
          v-for="item in tasklit"
          :key="item.value"
          :label="item.desc"
          :value="item.code">
        </el-option>
      </el-select>
      <el-button round @click="querylist">查询</el-button>
      <el-row>
        <el-col :span="12">
          <el-button @click="dataasync">数据同步</el-button> 
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
        >
        <el-table-column
          prop="name"
          label="任务名称">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="status"
          label="同步状态">
        </el-table-column>
        <el-table-column
          width=200
          prop="createTime"
          label="创建时间">
          <template slot-scope="scope">{{ifnull(Format(scope.row.createTime))}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <router-link :to="'/PeopleManage/PeopleDataAsyncDetail?id='+scope.row.id" class="el-button el-button--mini redbtn">查看</router-link>
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
        name:'',
        type:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      tasklit: [],
      tableData: [],
      
    }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    //获取所有任务类型
    self._ajax(self,'/syncTask/type/all', {}, function (data) {
      self.tasklit = data.data;
    })
    // 页面加载获取第一列数据
    this.querylist();
  },
  methods: {
    querylist(){
      let self = this;
      self._ajax(self,'/syncTask/query', self.querydata, function (data) {
        self.querydata.pagetotal = data.data.total;
        self.querydata.pageSize = data.data.pageSize;
        self.querydata.pageIndex = data.data.pageNum;
        self.tableData = data.data.list;
      })
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.querylist();
    },
    handleDelete(id){
      //删除接口
      var self = this;
      this.Delete(self,'url',id);
    },
    dataasync(){
      // 数据同步
      // console.log(`数据同步${this.delIds}`)
      this.$router.push({path:'/PeopleManage/PeopleDataAsyncNext'});
      // this.Delete(self,'url',this.delIds);
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
