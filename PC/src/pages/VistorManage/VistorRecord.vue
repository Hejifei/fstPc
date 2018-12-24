<template>
  <div class="hello">
    <div class="listtitle">访客记录</div>
    <div class="listSearchC">
      <p>
        <label>来访中人数：<span>{{visitingCount}}</span>人</label>
        <label>已离开人数：<span>{{timeOutCount}}</span>人</label>
        <label>未来访人数：<span>{{futureToVisitCount}}</span>人</label>
      </p>
      <el-select v-model="querydata.status" placeholder="状态">
        <el-option
          label="请选择访客状态"
          value="">
        </el-option>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input
        placeholder="输入访客姓名"
        v-model="querydata.name"
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
        <el-table-column  label="访客">
          <template slot-scope="scope">{{ifnull(scope.row.name)}}</template>
        </el-table-column>
        <el-table-column  label="访客电话" width='130'>
          <template slot-scope="scope">{{ifnull(scope.row.phone)}}</template>
        </el-table-column>
        <el-table-column label="被访人">
          <template slot-scope="scope">{{ifnull(scope.row.bname)}}</template>
        </el-table-column>
        <el-table-column label="被访人电话" width='130'>
          <template slot-scope="scope">{{ifnull(scope.row.bphone)}}</template>
        </el-table-column>
        <el-table-column
          title="reason"
          :show-overflow-tooltip='true'
          label="来访事由">
          <template slot-scope="scope">{{ifnull(scope.row.reason)}}</template>
        </el-table-column>
        <el-table-column
          title="beginDate"
          :show-overflow-tooltip='true'
          label="最早抓拍时间">
          <template slot-scope="scope">{{ifnull(scope.row.beginDate)}}</template>
        </el-table-column>
        <el-table-column
          title="endDate"
          :show-overflow-tooltip='true'
          label="最晚抓拍时间">
          <template slot-scope="scope">{{ifnull(scope.row.endDate)}}</template>
        </el-table-column>
        <el-table-column
          title="longTime"
          :show-overflow-tooltip='true'
          label="访客时长">
          <template slot-scope="scope">{{ifnull(scope.row.longTime)}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '0'">未来访</span>
            <span v-else-if="scope.row.status === '1'">来访中</span>
            <span v-else-if="scope.row.status === '2'">已离开</span>
            <span v-else >--</span>
          </template>
        </el-table-column>
        <el-table-column label="抓拍设备">
          <template slot-scope="scope">
            {{scope.row.deviName}}/{{scope.row.deviStatus === '1' ? '入口' :'出口'}}
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
      querydata:{
        date:'',
        name:'',
        status:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      options: [
        {
          value: '0',
          label: '未来访'
        },
        {
          value: '1',
          label: '来访中'
        },
        {
          value: '2',
          label: '已离开'
        },
      ],
      tableData: [],
      futureToVisitCount:0,
      timeOutCount:0,
      visitingCount:0
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
      self._ajax(self,'/get/visitor/visitorRecordList', self.querydata, function (data) {
        self.querydata.pagetotal = data.data.list.total;
        self.querydata.pageSize = data.data.list.pageSize;
        self.querydata.pageIndex = data.data.list.pageNum;
        // self.tableData = data.data.list.list;
        let list =  data.data.list.list.map((val)=>{
          val.beginDate = val.beginDate !== null ? val.beginDate.substring(0,16) : null;
          val.endDate = val.endDate !== null ? val.endDate.substring(0,16) : null;
          val.longTime =  val.longTime !== null ? val.longTime.split('-').join('') :null;
          return val;
        })
        self.tableData = list;
        self.futureToVisitCount = data.data.futureToVisitCount;
        self.timeOutCount = data.data.timeOutCount;
        self.visitingCount = data.data.visitingCount;
        
      })
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.querylist();
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
