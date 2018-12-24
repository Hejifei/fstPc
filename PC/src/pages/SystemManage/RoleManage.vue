<template>
  <div class="hello">
    <div class="listtitle">角色管理</div>
    <div class="listSearchC">
      <el-input
        placeholder="关键字查询"
        v-model="querydata.strKeyword"
        clearable>
      </el-input>
      <el-button round @click="querylist">查询</el-button>
      <el-row>
        <el-col :span="12">
          <router-link to="/SystemManage/RoleAdd" class="el-button">新增</router-link>
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
        <el-table-column
          prop="roleName"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          title='roleDesc'
          :show-overflow-tooltip='true'
          label="角色描述">
        </el-table-column>
        <!-- <el-table-column label="角色状态">
          <template slot-scope="scope">
            {{scope.row.roleStatus === '1' ? '有效':'无效'}}
          </template>
        </el-table-column> -->
        <el-table-column label="操作"  width=180>
          <template slot-scope="scope">
            <el-button class="redbtn"
              size="mini"
              @click="roleEdit(scope.row)">编辑</el-button>
            <!-- <router-link :to="'/RoleAdd?id='+scope.row.id" class="el-button el-button--mini redbtn">编辑</router-link> -->
            <el-button class="greybtn"
              size="mini"
              @click="authorize(scope.row.id)">授权</el-button>
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
    <el-dialog
      title="角色授权"
      :visible.sync="dialogVisible">
      <div class="authorizeTreeC">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-tree
          class="filter-tree"
          :data="menutree"
          :default-checked-keys="aTreekeysChecked"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :default-expand-all='false'
          :filter-node-method="filterNode"
          ref="authorizeTree">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="authorizeSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      delIds:[],
      querydata:{
        strKeyword:'',
        pageIndex: 1,
        pageSize:10,
        pagetotal:0
      },
      options: [{
          value: '有效',
          label: '有效'
        },{
          value: '无效',
          label: '无效'
      }],
      tableData: [],
      dialogVisible: false,
      filterText: '',
      menutree:[],
      aTreekeysChecked:[],//默认选中的授权
      authorizeId:'',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
        this.$refs.authorizeTree.filter(val);
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
      self._ajax(self,'/get/system/rolePageList', self.querydata, function (data) {
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
    listDelete(){
      //列表删除
      this.Delete(this,'/get/system/deleteRole',{idStr:String(this.delIds)});
    },
    handleSelectionChange(val) {
      // 获取列表选中项id
      this.delIds = val.map((val)=>val.id);
    },
    roleEdit(role){
      sessionStorage.detail = JSON.stringify(role)
      this.$router.push({path:'/SystemManage/RoleAdd?id='+role.id});
    },
    authorize(id){
      let self = this;
      self._ajax(self,'/get/system/getAllMenu', {'roleIdStr':id}, function (data) {
        let menutree = [];
        let aTreekeysChecked = [];
        let result = data.data;
        result.map((listson)=>{
          let son =new Object;
          son.id= listson.id;
          son.label = listson.name;
          if(listson.checked){aTreekeysChecked.push(Number(listson.id))}
          if(listson.nodes !== null ){
            let menusec = []
            listson.nodes.map((val)=>{
              menusec.push({'id':val.id,'label':val.name})
              if(val.checked){aTreekeysChecked.push(Number(val.id))}
            })
            son.children = menusec;
            
          }
          menutree.push(son)
        })
        self.menutree =menutree;
        // console.log(aTreekeysChecked)
        self.aTreekeysChecked = aTreekeysChecked;
      })
      this.filterText = '';
      // document.getElementsByClassName('el-input__inner').value='';
      this.dialogVisible= true;
      this.authorizeId = id;
    },
    filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
    },
    authorizeSubmit(){
      // 授权提交
      let self = this;
      let menuIdStr = String(this.$refs.authorizeTree.getCheckedKeys());
      self._ajax(self,'/get/system/addMenu', {'roleIdStr':self.authorizeId,'menuIdStr':menuIdStr}, function (data) {
        self.$message({
          type: 'success',
          message: data.desc
        });
      })
      this.dialogVisible = false;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
