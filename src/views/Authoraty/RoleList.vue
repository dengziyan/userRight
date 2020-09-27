<template>
  <div class="app-container">
    <!-- 搜索框-->
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-select v-model="queryParams.enabled" placeholder="角色状态" clearable size="small" style="width: 120px">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
        <el-form-item>
          <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
    <!--各个操作按钮-->
    <el-row :gutter="10" class="mb8">
      <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
      <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleTopUpdate">修改
      </el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除
      </el-button>
      <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出
      </el-button>
      <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
    </el-row>
    <!--表格-->
    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="角色编号" prop="id" width="120"/>
      <el-table-column label="角色名称" prop="roleName" width="150"/>
      <el-table-column label="角色描述" prop="roleDesc" width="300" :show-overflow-tooltip="true"/>
      <el-table-column label="是否启用" width="150">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleSelectMenu(scope.row)">分配菜单
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleSelectResource(scope.$index,scope.row)"
          >分配资源
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :page-sizes="[10,25,50]"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="isEdit?'编辑角色':'添加角色'" :visible.sync="dialogVisible" width="60%">
      <el-form ref="www" :model="role" label-width="150px" :rules="rules" size="small">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="role.roleName" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="role.enabled">
            <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">
              {{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="role.roleDesc" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配菜单对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
      <el-card class="form-container" shadow="never">
        <el-tree
          ref="tree"
          :data="menuTreeList"
          show-checkbox
          :default-checked-keys="menuRoleIds"
          :default-expanded-keys="menuRoleIds"
          node-key="id"
          :check-strictly="true"
          highlight-current
          :props="defaultProps"
          auto-expand-parent
        />
        <div style="margin-top: 20px" align="center">
          <el-button type="primary" @click="handleSave()">保存</el-button>
          <el-button @click="handleClear()">清空</el-button>
          <el-button type="success" size="mini" @click="handleClear('reset')">还原</el-button>
        </div>

      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRole,
  delRole,
  addRole,
  updateRole,
  exportRole,
  dataScope,
  changeRoleStatus,
  listMenuRole,
  listMenuByRole
} from '@/api/authoraty/role'
import { fetchTreeList } from '@/api/authoraty/menu'
import moment from 'moment'
import fileDownload from 'js-file-download'
// 用于复制给user
const defaultRole = {
  roleDesc: '',
  deleteStatus: 0,
  enabled: 1,
  roleName: ''
}
export default {
  name: 'Role',
  data() {
    return {
      menuTreeList: [],
      roleId: null,
      dialogVisible: false,
      isEdit: false,
      role: Object.assign({}, defaultRole), // user为对话框中:model
      defaultRoleId: null,
      enabled: 0,
      loading: true, // 遮罩层
      ids: [], // 选中数组
      menuRoleIds: [], // 用户所拥有的菜单
      menuNoChildren: [],
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      showSearch: true, // 显示搜索条件
      checkAll: false, // 是否导出所有数据
      updataData: {},
      total: 0, // 总条数
      roleList: [], // 角色表格数据
      title: '', // 弹出层标题
      open: false, // 是否显示弹出层
      openDataScope: false, // 是否显示弹出层（数据权限）
      dateRange: [], // 日期范围
      statusOptions: [{ dictLabel: '启用', dictValue: 1 }, { dictLabel: '停用', dictValue: 0 }], // 状态数据字典
      menuOptions: [], // 菜单列表
      queryParams: { // 查询参数
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        enabled: undefined
      },
      form: {}, // 表单参数
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      rules: { // 表单校验
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    newEnable() {
      return this.queryParams.enabled
    },
    newAccount() {
      return this.queryParams.roleName
    }
  },
  watch: {
    newEnable(val) {
      this.queryParams.enabled = val === '' ? undefined : val
      this.getList()
    },
    newAccount(val) {
      this.queryParams.roleName = val === '' ? undefined : val
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.data.rows
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    handleSelectResource(index, row) {
      this.$router.push({ path: '/allocResource', query: { roleId: row.id } })
    },
    //  保存分配的菜单
    handleSave() {
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      const checkedMenuIds = new Set()
      if (checkedNodes != null && checkedNodes.length > 0) {
        for (let i = 0; i < checkedNodes.length; i++) {
          const checkedNode = checkedNodes[i]
          checkedMenuIds.add(checkedNode.id)
          if (checkedNode.parentId !== 0) {
            checkedMenuIds.add(checkedNode.parentId)
          }
        }
      }
      console.log()
      listMenuByRole(Array.from(checkedMenuIds),this.roleId).then(response => {
        if (response.code === 2000) {
          this.$message({
            message: '分配成功',
            type: 'success',
            duration: 1000
          })
          this.openDataScope = false
          this.menuRoleIds = this.menuNoChildren
        }

      })
    },
    // 清空保存的菜单
    handleClear(val) {
      if (val === 'reset') {
        this.$refs.tree.setCheckedKeys(this.menuRoleIds)
      } else {
        const index = []
        this.menuTreeList.forEach(function(val) {
          if (!val.children) {
            index.push(val.id)
          }
        })
        this.menuNoChildren = index
        this.$refs.tree.setCheckedKeys(index)
      }
    },
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getHalfCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 角色状态修改
    handleStatusChange(row) {
      // console.log(row)
      const type = row.enabled === 1 ? { label: '启用', value: 'enable' } : { label: '停用', value: 'disable' }
      changeRoleStatus(row.id, type.value).then(response => {
        this.getList()
      }).catch(function() {
        row.enabled = row.enabled === 0 ? 1 : 0
      })
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      this.form = {
        roleId: undefined,
        roleName: undefined,
        enabled: undefined,
        remark: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.updataData = selection.length === 1 ? selection : {}
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.role = Object.assign({}, defaultRole) // 默认值为空
    },

    handleSelectMenu(row) {
      this.roleId = row.id
      fetchTreeList().then(response => {
        this.menuTreeList = response.data
      }).then(() => {
        const index = this.menuTreeList.map(item => {
          if (item.enabled !== 1) {
            item.disabled = true
          }
          return item
        })
        this.menuTreeList = index
        this.openDataScope = true
      })
      listMenuRole(row.id).then(res => {
        this.menuRoleIds = res.data
        console.log('this.$store.getters.account:' + this.$store.getters.name)
      }).catch(response => {
        console.log(response)
      })
    },

    // 按修改键弹出对话框（传入当前行的数据）
    handleTopUpdate() {
      console.log(this.updataData)
      this.handleUpdate(this.updataData[0])
    },
    // 按修改键弹出对话框（传入当前行的数据）
    handleUpdate(row) {
      this.dialogVisible = true
      this.isEdit = true
      this.role = Object.assign({}, row)
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.isEdit) { // 更新资源数据（即编辑修改）
        updateRole(this.role).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          }
        })
      } else { // 插入一条资源数据（即添加）
        addRole(this.role).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          }
        })
      }
    },
    /** 分配数据权限操作 */
    // handleDataScope(row) {
    //   this.reset()
    //   const roleDeptTreeselect = this.getRoleDeptTreeselect(row.roleId)
    //   getRole(row.roleId).then(response => {
    //     this.form = response.data
    //     this.openDataScope = true
    //     this.$nextTick(() => {
    //       roleDeptTreeselect.then(res => {
    //         this.$refs.dept.setCheckedKeys(res.checkedKeys)
    //       })
    //     })
    //     this.title = '分配数据权限'
    //   })
    // },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.roleId != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            updateRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              }
            })
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            addRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              }
            })
          }
        }
      })
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.roleId != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys()
        dataScope(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.openDataScope = false
            this.getList()
          }
        })
      }
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      // console.log(row)
      const roleIds = row.id || this.ids
      this.$confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRole(roleIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      if (this.checkAll) {
        queryParams.pageNum = undefined
        queryParams.pageSize = undefined
        queryParams.type = 'all'
      }
      this.$confirm('是否确认导出角色数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportRole(queryParams).then(res => {
          console.log(res)
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          console.log(sysDate)
          fileDownload(res, sysDate + '用户信息表.xlsx')
        })
      }).then(response => {
        this.download(response.msg)
      }).catch(function() {
      })
    }
  }
}
</script>
<style scoped>
.el-row button {
  float: left;
}

.el-checkbox {
  margin-left: 10px;
  float: left;
  margin-top: 6px;
}
</style>
