<template> 
  <div class="app-container">
    <!--    添加按钮-->
    <el-card shadow="never" class="operate-container">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加</el-button>
    </el-card>
    <!--    表格-->
    <div class="table-container">
      <el-table ref="resourceCategoryTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="资源分类名称" align="center">
          <template slot-scope="scope">{{scope.row.categoryName}}</template>
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
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--    添加分类对话框-->
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="40%">
      <el-form :model="resourceCategory" ref="resourceCategoryForm" label-width="150px" size="small">
        <el-form-item label="资源分类名称：">
          <el-input v-model="resourceCategory.categoryName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-switch
            v-model="resourceCategory.deleteStatus"
            active-value="1"
            inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            @change="handleStatusChange()"
          ></el-switch>
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
import {listAllCate,createResourceCategory,updateResourceCategory,deleteResourceCategory,changecategoryStatus} from '@/api/authoraty/resourceCategory';
import {formatDate} from '@/utils/date';
import {changeResourceStatus} from "@/api/authoraty/resource";
const defaultResourceCategory = {
  categoryName: null,
  deleteStatus: 0,
  enabled: 1
};
export default {
  name: 'resourceCategoryList',
  data() {
    return {
      list: null,
      listLoading: false,
      dialogVisible:false,
      isEdit:false,
      resourceCategory:Object.assign({},defaultResourceCategory)
    }
  },
  created() {
    this.getList();
  },
  filters:{
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A';
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.resourceCategory = Object.assign({},defaultResourceCategory);
    },
    handleUpdate(index,row){
      this.dialogVisible = true;
      this.isEdit = true;
      this.resourceCategory = Object.assign({},row);
    },
    handleDelete(index,row){
      this.$confirm('是否要删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResourceCategory(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      });
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateResourceCategory(this.resourceCategory.id,this.resourceCategory).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
          })
        } else {
          createResourceCategory(this.resourceCategory).then(response => {
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
    // 角色状态修改
    handleStatusChange(row) {
      console.log(row)
      const type = row.deleteStatus === '0' ? 'enable' : 'disable'
      this.$confirm('确认要"' + type + '""' + row.categoryName + '"角色吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changecategoryStatus(row.id, type)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.deleteStatus = row.deleteStatus === '0' ? '1' : '0'
      })
    },
    getList() {
      this.listLoading = true;
      listAllCate({}).then(response => {
        this.listLoading = false;
        this.list = response.data;
      });
    }
  }
}
</script>
<style>
</style>


