<template>
  <div class="hello">
    <div class="listtitle">已登记人员管理</div>
    <!-- 下载 -->
      <form id="searchForm" method='post' style="display:none;">
        <input name="name" v-model="querydata.name"/>
        <input name="phone" v-model="querydata.phone"/>
        <input name="personType" v-model="querydata.personType"/>
        <input name="groupIds" v-model="querydata.groupIds"/>
      </form>
    <div class="listSearchC">
      <el-input
        placeholder="姓名"
        v-model="querydata.name"
        clearable>
      </el-input>
      <el-input
        placeholder="手机号码"
        v-model="querydata.phone"
        clearable>
      </el-input>
      <el-select v-model="querydata.personType" placeholder="人员类型">
        <el-option label="请选择人员类型" value="">
        </el-option>
        <el-option
          v-for="item in typelist"
          :key="item.value"
          :label="item.desc"
          :value="item.code">
        </el-option>
      </el-select>
      <el-select v-model="querydata.groupIds" placeholder="人员分组">
        <el-option label="请选择人员分组" value=""></el-option>
        <el-option
          v-for="item in grouplist"
          :key="item.value"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button round @click="querylist">查询</el-button>
      <el-row>
        <el-col :span="12">
          <router-link to="/PeopleManage/PeopleAdd" class="el-button">新增</router-link>
          <el-button @click="listDelete">删除</el-button> 
        </el-col>
        <el-col :span="12" class="rowright">
          <el-button @click="moudule_down">模版下载</el-button>
          <el-button @click="insertIn"><img src="../../assets/img/icons/content_import.png"/> 导入</el-button>
          <el-button @click="exportout"><img src="../../assets/img/icons/content_export.png"/> 导出</el-button>
          <el-upload
            style="display:none;"
            class="upload-demo"
            :action="this.APIURL+'/person/import'"
            multiple
            :limit="3"
            :on-success='imageChange'
            :file-list="fileList">
            <el-button id='insertBtn'>导入</el-button>
          </el-upload>
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
          prop="gender"
          label="性别">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="idCard"
          label="身份证号码">
        </el-table-column>
        <el-table-column
          width=200
          prop="createTime"
          label="创建时间">
          <template slot-scope="scope">{{ifnull(Format(scope.row.createTime))}}</template>
        </el-table-column>
        <el-table-column label="操作"  width=180>
          <template slot-scope="scope">
            <router-link :to="'/PeopleManage/PeopleAdd?id='+scope.row.id" class="el-button el-button--mini redbtn">编辑</router-link>
            <el-button class="delbtn"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)">删除</el-button>
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
      fileList:[],
      delIds:[],
      querydata:{
        name:'',
        phone:'',
        personType:'',
        groupIds:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      typelist: [],
      grouplist:[],
      tableData: [],
    }
  },
  created(){
    let self = this;
  },
  mounted () {  
    let self = this;
    // 人员类型
    self._ajax(self,'/person/type/all', {}, function (data) {
      self.typelist = data.data;
    })
    // 人员分组
    self._ajax(self,'/group/all', {}, function (data) {
      self.grouplist = data.data;
    })
    // 页面加载获取第一列数据
    this.querylist();
  },
  methods: {
    querylist(){
      let self = this;
      self._ajax(self,'/person/query', self.querydata, function (data) {
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
      let newarr = new Array();
      newarr.push(id)
      this.Delete(self,'/person/delete',{ids:newarr});
    },
    handleSelectionChange(val) {
      // 获取列表选中项id
      this.delIds = val.map((val)=>val.id);
    },
    listDelete(){
      // 列表页删除
      this.Delete(this,'/person/delete',{ids:this.delIds});
    },
    moudule_down(){
      // 模板下载
      window.location.href = this.APIURL + '/common/download/person'
    },
    insertIn(){
      // 导入
      document.getElementById('insertBtn').click();
    },
    imageChange(response, file, fileList){
      if(response.code === 200){
        this.$message({
          type: 'success',
          message: response.desc
        });
        this.querylist();
      }else{
        this.$message.error(response.desc)
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },
    exportout(){
      var form = $('#searchForm');
      form.attr("action", this.APIURL + "/person/export");
      form.submit();
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
