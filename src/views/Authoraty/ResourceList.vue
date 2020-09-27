<template> 
  <div class="app-container" style="padding: 0px">
    <!-- 搜索框   -->
    <el-card class="filter-container" shadow="never">
<!--      <div>-->
<!--        <i class="el-icon-search"></i>-->
<!--        <span>筛选搜索</span>-->
<!--      </div>-->
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="资源名称：">
            <el-input v-model="listQuery.resourceName" class="input-width" placeholder="资源名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源路径：">
            <el-input v-model="listQuery.url" class="input-width" placeholder="资源路径" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源分类：">
            <el-select v-model="listQuery.categoryId" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleSearchList">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="handleResetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!--表格    -->
    <el-card class="operate-container" shadow="never">
<!--      <i class="el-icon-tickets"></i>-->
<!--      <span>数据列表</span>-->
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd()" style="margin-left: 20px">新增</el-button>
      <router-link to="/resourceCategory">
        <el-button size="mini" type="success" icon="el-icon-edit" @click="handleShowCategory()">资源分类</el-button>
      </router-link>
    </el-card>
    <div class="table-container">
      <el-table ref="resourceTable" :data="list" style="width: 100%;" v-loading="listLoading" >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="资源名称" align="center">
          <template slot-scope="scope">{{scope.row.resourceName}}</template>
        </el-table-column>
        <el-table-column label="资源路径" align="center">
          <template slot-scope="scope">{{scope.row.url}}</template>
        </el-table-column>
        <el-table-column label="资源描述" align="center">
          <template slot-scope="scope">{{scope.row.resourceTag}}</template>
        </el-table-column>
        <el-table-column label="权限描述" align="center">
          <template slot-scope="scope">{{scope.row.permissionTag}}</template>
        </el-table-column>
<!--        <el-table-column label="是否启用" >-->
<!--          <template slot-scope="scope">-->
<!--            <el-switch-->
<!--              v-model="scope.row.deleteStatus"-->
<!--              active-value="1"-->
<!--              inactive-value="0"-->
<!--              @change="handleStatusChange(scope.row)"-->
<!--            ></el-switch>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createDate | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,25,50]"
        :total="total">
      </el-pagination>
    </div>
    <!-- 添加资源或编辑资源弹出的对话框   -->
    <el-dialog :title="isEdit?'编辑资源':'添加资源'" :visible.sync="dialogVisible" width="40%">
      <el-form :model="resource" ref="resourceForm" label-width="150px" size="small">
        <el-form-item label="资源名称：">
          <el-input v-model="resource.resourceName"></el-input>
        </el-form-item>
        <el-form-item label="资源路径：">
          <el-input v-model="resource.url"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-switch
            v-model="resource.deleteStatus"
            active-value="1"
            inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            @change="handleStatusChange()"
          ></el-switch>
        </el-form-item>
        <el-form-item label="资源分类：">
          <el-select v-model="resource.categoryId" placeholder="全部" clearable class="input-width">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源描述：">
          <el-input v-model="resource.resourceTag" type="textarea" :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="权限描述：">
          <el-input v-model="resource.permissionTag" type="textarea" :rows="5" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {fetchList,createResource,updateResource,deleteResource,changeResourceStatus} from '@/api/authoraty/resource';
import {listAllCate} from '@/api/authoraty/resourceCategory';
import {formatDate} from '@/utils/date';
import {changeRoleStatus} from "@/api/authoraty/role";
// 用于复制给listQuery
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  resourceName: null,
  url: null,
  categoryId:null
};
// 用于复制给resource
const defaultResource = {
  id: null,
  categoryId: null,
  resourceName: null,
  url: null,
  resourceTag: '',
  permissionTag: '',
  deleteStatus: 0,
  enabled: 1,
  createDate: 0
};
export default {
  name: 'resourceList',
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      listLoading: false,
      dialogVisible: false,
      resource: Object.assign({}, defaultResource),// Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
      isEdit: false,
      categoryOptions:[],
      defaultCategoryId:null
    }
  },
  created() {
    this.getList();
    this.getCateList();
  },
  mounted(){

  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A';
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.resource = Object.assign({},defaultResource);
      this.resource.categoryId = this.defaultCategoryId;
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该资源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResource(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      });
    },
    handleUpdate(index, row) {
      console.log('资源的row' + row)
      this.dialogVisible = true;
      this.isEdit = true;
      this.resource = Object.assign({},row);
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) { // 更新资源数据（即编辑修改）
          updateResource(this.resource.id,this.resource).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
          })
        } else { // 插入一条资源数据（即添加）
          createResource(this.resource).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
          })
        }
      })
    },
    handleShowCategory(){
      this.$router.push({path: '/resourceCategory'})
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data;
        this.total = response.data.total;
      });
    },
    // 角色状态修改
    handleStatusChange(row) {
      console.log(row)
      const type = row.deleteStatus === '0' ? 'enable' : 'disable'
      this.$confirm('确认要"' + type + '""' + row.resourceName + '"角色吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeResourceStatus(row.id, type)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.deleteStatus = row.deleteStatus === '0' ? '1' : '0'
      })
    },
    getCateList(){
      listAllCate().then(response=>{
        let cateList = response.data;
        for(let i=0;i<cateList.length;i++){
          let cate = cateList[i];
          this.categoryOptions.push({label:cate.categoryName,value:cate.id});
        }
        this.defaultCategoryId=cateList[0].id;
      })
    }
  }
}
</script>
<style scoped>
  .el-button--mini{
    float: left;
    margin-left: 10px;
  }
  .el-card{
    border: 0px;
  }
  .el-card__body{
    padding: 0px;
  }
  .el-main{
    padding: 0px;
  }
  .el-card__body{
    padding: 0px;
  }
</style>


