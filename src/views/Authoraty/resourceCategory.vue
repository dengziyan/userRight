<template>
  <div class="app-container">
    <!--    添加按钮-->
    <el-card shadow="never" class="operate-container">
      <el-button size="mini" class="btn-add"  type="info" style="margin-left: 5px;" @click="handleAdd()">添加</el-button>
      <el-button size="mini" class="btn-add" type="primary" icon="el-icon-refresh" @click="getList">刷新</el-button>
      <el-button size="mini" class="btn-add" type="success" icon="el-icon-position" @click="returnResources">返回资源列表</el-button>
    </el-card>
    <!--    表格-->
    <div class="table-container">
      <el-table ref="resourceCategoryTable" v-loading="listLoading" :data="list" style="width: 100%;">
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="资源分类名称" align="center">
          <template slot-scope="scope">{{ scope.row.categoryName }}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
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
      <el-form ref="resourceCategoryForm" :model="resourceCategory" label-width="150px" size="small">
        <el-form-item label="资源分类名称：">
          <el-input v-model="resourceCategory.categoryName" style="width: 250px" />
        </el-form-item>
        <el-form-item label="状态：">
          <el-switch
            v-model="resourceCategory.enabled"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            @change="handleStatusChange()"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listAllCate, createResourceCategory, updateResourceCategory, deleteResourceCategory, changecategoryStatus } from '@/api/authoraty/resourceCategory'
import { formatDate } from '@/utils/date'
const defaultResourceCategory = {
  categoryName: null,
  enabled: 1
}
export default {
  name: 'ResourceCategoryList',
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  data() {
    return {
      list: null,
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      resourceCategory: Object.assign({}, defaultResourceCategory)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 返回资源列表
    returnResources() {
      this.$router.replace('/resourceList')
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.resourceCategory = Object.assign({}, defaultResourceCategory)
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.resourceCategory = Object.assign({}, row)
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResourceCategory(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    },
    handleDialogConfirm() {
      if (this.isEdit) {
        updateResourceCategory(this.resourceCategory.id, this.resourceCategory).then(response => {
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          this.dialogVisible = false
          this.getList()
        })
      } else {
        createResourceCategory(this.resourceCategory).then(response => {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
          this.dialogVisible = false
          this.getList()
        })
      }
    },
    // 角色状态修改
    handleStatusChange(row) {
      console.log(row)
      const type = row.enabled === 1 ? 'enable' : 'disable'
      changecategoryStatus(row.id, type).then(res => {
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.getList()
      }).catch(function() {
        row.enabled = row.enabled === 0 ? 1 : 0
      })
    },
    getList() {
      this.listLoading = true
      listAllCate({}).then(response => {
        this.listLoading = false
        this.list = response.data
      })
    }
  }
}
</script>
<style scoped>
  .el-card__body>button{
    float: left;
  }
  .el-card{
    border: 0px;
  }
</style>

