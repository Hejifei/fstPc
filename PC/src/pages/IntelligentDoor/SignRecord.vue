<template>
  <div class="hello">
    <div class="listtitle">签到记录</div>
    <div class="listSearchC">
      <el-select v-model="querydata.selectval" placeholder="选择任务">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="querydata.selectval" placeholder="选择设备">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="querydata.selectval" placeholder="选择摄像头">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="querydata.selectval" placeholder="选择分组">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input
        placeholder="输入关键字查找"
        v-model="querydata.keywords"
        clearable>
      </el-input>
      <el-button round @click="querylist">查询</el-button>
      <el-row>
        <el-col class="rowright">
          <el-button><img src="../../assets/img/icons/content_export.png"/> 导出</el-button>
        </el-col>
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
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="group"
          label="分组">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话号码">
        </el-table-column>
        <el-table-column
          prop="signtime"
          label="签到时间">
        </el-table-column>
        <el-table-column
          prop="scene"
          label="场景">
        </el-table-column>
        <el-table-column
          prop="lastequipment"
          label="最后抓拍设备">
        </el-table-column>
        <el-table-column
          prop="camera"
          label="摄像头">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态">
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
        phone:'',
        selectval:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      options: [{
          value: '选项1',
          label: '选项1'
      }],
      tableData: [{
          id: '1',
          name: '王小虎',
          group: '分组001',
          phone: '18020285668',
          signtime:'21:55',
          scene:'场景1',
          lastequipment:'设备1',
          camera:'摄像头1',
          state:'签到'
        }, {
          id: '2',
          name: '王小虎',
          group: '分组001',
          phone: '18020285668',
          signtime:'21:55',
          scene:'场景1',
          lastequipment:'设备1',
          camera:'摄像头1',
          state:'未签到'
      }],
      
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
      // self._ajax(self,'/api/', self.querydata, function (data) {

      // })
    },
    handleCurrentChange(val) {
      this.querylist();
    },
    handleSelectionChange(val) {
      // 获取列表选中项id
      this.delIds = val.map((val)=>val.id);
    },
    patrolNow(){
      let self = this;
      // self._ajax(self,'/api/', self.querydata, function (data) {

      // })
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
