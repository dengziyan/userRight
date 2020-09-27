<template>
  <div class="app-container">
    <!-- 搜索框-->
    <el-form :inline="true" :model="listQuery" size="small" label-width="100px">
      <el-form-item label="资源名称：">
        <el-input v-model="listQuery.resourceName" class="input-width" placeholder="资源名称" clearable
                  style="width: 240px"/>
      </el-form-item>
      <el-form-item label="资源路径：">
        <el-input v-model="listQuery.url" class="input-width" placeholder="资源路径" clearable/>
      </el-form-item>
      <el-form-item label="资源分类：">
        <el-select v-model="listQuery.categoryId" placeholder="全部" clearable class="input-width">
          <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-select v-model="listQuery.enabled" placeholder="状态" clearable size="small" style="width: 120px">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleSearchList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="handleResetSearch">重置</el-button>
      </el-form-item>
    </el-form>
    <!--表格    -->
    <el-card class="operate-container" shadow="never">
      <!--      <i class="el-icon-tickets"></i>-->
      <!--      <span>数据列表</span>-->
      <el-button size="mini" type="primary" icon="el-icon-plus" style="margin-left: 20px" @click="handleAdd()">新增
      </el-button>
      <router-link to="/resourceCategory">
        <el-button size="mini" type="success" icon="el-icon-edit" @click="handleShowCategory()">资源分类</el-button>
      </router-link>
    </el-card>
    <div class="table-container">
      <el-table ref="resourceTable" v-loading="listLoading" :data="list" style="width: 100%;">
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="资源名称" align="center">
          <template slot-scope="scope">{{ scope.row.resourceName }}</template>
        </el-table-column>
        <el-table-column label="资源路径" align="center">
          <template slot-scope="scope">{{ scope.row.url }}</template>
        </el-table-column>
        <el-table-column label="资源描述" align="center">
          <template slot-scope="scope">{{ scope.row.resourceTag }}</template>
        </el-table-column>
        <el-table-column label="权限标志" align="center">
          <template slot-scope="scope">{{ scope.row.permissionTag }}</template>
        </el-table-column>
        <el-table-column label="是否启用">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.createDate | formatDateTime }}</template>
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
      <el-pagination
        background
        :page-size="listQuery.pageSize"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-sizes="[10,25,50]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加资源或编辑资源弹出的对话框   -->
    <el-dialog :title="isEdit?'编辑资源':'添加资源'" :visible.sync="dialogVisible" width="40%">
      <el-form ref="resourceForm" :model="resource" label-width="150px" size="small">
        <el-row>

          <el-col :span="12">
            <el-form-item label="资源名称：">
              <el-input v-model="resource.resourceName"/>
            </el-form-item>
            <el-form-item label="资源路径：">
              <el-input v-model="resource.url"/>
            </el-form-item>
            <el-form-item label="权限标志：">
              <el-input v-model="resource.permissionTag"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源分类：">
              <el-select v-model="resource.categoryId" placeholder="全部" clearable class="input-width">
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：">
              <el-switch
                v-model="resource.enabled"
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="停用"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="资源描述：">
              <el-input v-model="resource.resourceTag" type="textarea" :rows="1"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  createResource,
  updateResource,
  deleteResource,
  changeResourceStatus
} from '@/api/authoraty/resource'
import { listAllCate } from '@/api/authoraty/resourceCategory'
import { formatDate } from '@/utils/date'
// 用于复制给listQuery
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  resourceName: null,
  url: null,
  categoryId: null
}
// 用于复制给resource
const defaultResource = {
  id: null,
  categoryId: null,
  resourceName: null,
  url: null,
  enabled: 1
}
export default {
  name: 'ResourceList',
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
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      listLoading: false,
      dialogVisible: false,
      statusOptions: [{ dictLabel: '启用', dictValue: 1 }, { dictLabel: '停用', dictValue: 0 }], // 状态数据字典
      resource: Object.assign({}, defaultResource), // Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
      isEdit: false,
      categoryOptions: [],
      defaultCategoryId: null
    }
  },
  created() {
    this.getList()
    this.getCateList()
  },
  computed: {
    resourceName() {
      return this.listQuery.resourceName
    },
    newEnable() {
      return this.listQuery.enabled
    },
    newUrl() {
      return this.listQuery.url
    },
    newId() {
      return this.listQuery.categoryId
    }
  },
  watch: {
    newEnable(val) {
      this.listQuery.enabled = val === '' ? undefined : val
      this.getList()
    },
    resourceName(val) {
      this.listQuery.resourceName = val === '' ? undefined : val
      this.getList()
    },
    newUrl(val) {
      this.listQuery.url = val === '' ? undefined : val
      this.getList()
    }, newId(val) {
      this.listQuery.categoryId = val === '' ? undefined : val
      this.getList()
    }
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.resource = Object.assign({}, defaultResource)
      this.resource.categoryId = this.defaultCategoryId
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
          })
          this.getList()
        })
      })
    },
    handleUpdate(index, row) {
      console.log('资源的row' + row)
      this.dialogVisible = true
      this.isEdit = true
      this.resource = Object.assign({}, row)
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.isEdit) { // 更新资源数据（即编辑修改）
        updateResource(this.resource.id, this.resource).then(response => {
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          this.dialogVisible = false
          this.getList()
        })
      } else { // 插入一条资源数据（即添加）
        createResource(this.resource).then(response => {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
          this.dialogVisible = false
          this.getList()
        })
      }
    },
    handleShowCategory() {
      this.$router.push({ path: '/resourceCategory' })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    // 角色状态修改
    handleStatusChange(row) {
      console.log(row.enabled)
      const type = row.enabled === 1 ? 'enable' : 'disable'
      changeResourceStatus(row.id, type).then(res => {
        this.$message({
          message: res.message,
          type: 'success',
          duration: 1000
        })
        this.getList()
      }).catch(function(res) {
        console.log(res)
        row.enabled = row.enabled === 0 ? 1 : 0
      })
    },
    getCateList() {
      listAllCate().then(response => {
        const cateList = response.data
        for (let i = 0; i < cateList.length; i++) {
          const cate = cateList[i]
          this.categoryOptions.push({ label: cate.categoryName, value: cate.id })
        }
        this.defaultCategoryId = cateList[0].id
      })
    }
  }
}
</script>
<style scoped>
.el-button--mini {
  float: left;
  margin-left: 10px;
}

.el-card {
  border: 0px;
}

.el-card__body {
  padding: 0px;
}

.el-main {
  padding: 0px;
}

.el-card__body {
  padding: 0px;
}
</style>

