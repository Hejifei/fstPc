<template>
  <div class="hello">
    <div class="listtitle">日志管理</div>
    <div class="listSearchC">
      <el-input
        placeholder="请输入用户名"
        v-model="querydata.strKeyword"
        clearable>
      </el-input>
      <el-button round @click="querylist">查询</el-button>
      
    </div>
    <div class="listtableC">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column
          prop="interfaceName"
          label="接口名称">
        </el-table-column>
        <el-table-column
          label="登录时间">
          <template slot-scope="scope">
            {{formatTime(scope.row.interfaceTime)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="accountName"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="ipName"
          label="IP">
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
      formatTime:this.Format,
      delIds:[],
      querydata:{
        name:'',
        state:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      tableData: [],
      dialogVisible: false,
    }
  },
  watch: {
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
      self._ajax(self,'/get/system/logList', self.querydata, function (data) {
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
    handleSelectionChange(val) {
      // 获取列表选中项id
      this.delIds = val.map((val)=>val.id);
    },
    // formatTime(val){
    //   return this.formatTime(val)
    // }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
