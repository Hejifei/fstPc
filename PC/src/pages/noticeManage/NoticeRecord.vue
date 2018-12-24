<template>
  <div class="hello">
    <div class="listtitle">通知记录</div>
    <div class="listtableC">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column
          label="任务名称">
          <template slot-scope="scope">{{ifnull(scope.row.noticeName)}}</template>
        </el-table-column>
        <el-table-column
          label="通知次数">
          <template slot-scope="scope">{{ifnull(scope.row.countNum)}}</template>
        </el-table-column>
        <el-table-column
          prop="noticText"
          title='noticText'
          :show-overflow-tooltip='true'
          label="通知内容">
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
      self._ajax(self,'/get/notice/noticeList', self.querydata, function (data) {
          self.querydata.pagetotal = data.data.total;
          self.querydata.pageSize = data.data.pageSize;
          self.querydata.pageIndex = data.data.pageNum;
          let tablelist = data.data.list.map((val)=>{
            val.noticText = self.ifnull(val.noticText);
            return val;
          })
          self.tableData = tablelist;
      })
    },
    handleCurrentChange(val) {
      this.querylist();
    },
    
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
