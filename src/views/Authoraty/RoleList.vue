<template>
  <div class="app-container">
    <!--搜索框   -->
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态" prop="deleteStatus">
        <el-select v-model="queryParams.deleteStatus" placeholder="角色状态" clearable size="small" style="width: 240px">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"/>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--各个操作按钮-->
    <el-row :gutter="10" class="mb8">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      <!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>
    <!--表格-->
    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="id" width="120" />
      <el-table-column label="角色名称" prop="roleName" width="150" />
      <el-table-column label="角色描述" prop="roleDesc" width="300" :show-overflow-tooltip="true"/>
      <el-table-column label="是否启用" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.deleteStatus"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleDataScope(scope.row)">数据权限</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.deleteStatus">
            <el-radio v-for="dict in statusOptions" :key="dict" :label="dict" :value="dict" />
          </el-radio-group>
        </el-form-item>
<!--        <el-form-item label="菜单权限" prop="">-->
<!--          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />-->
<!--        </el-form-item>-->
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="form.dataScope == 2" label="数据权限">
          <el-tree
            ref="dept"
            show-checkbox
            default-expand-all
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, exportRole, dataScope, changeRoleStatus } from '@/api/authoraty/role'
import { treeselect as menuTreeselect, roleMenuTreeselect } from '@/api/authoraty/menu'
// import { treeselect as deptTreeselect, roleDeptTreeselect } from "@/api/authoraty/dept";

export default {
  name: 'Role',
  data() {
    return {
      deleteStatus: 0,
      loading: true, // 遮罩层
      ids: [], // 选中数组
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      showSearch: true, // 显示搜索条件
      total: 0, // 总条数
      roleList: [], // 角色表格数据
      title: '', // 弹出层标题
      open: false, // 是否显示弹出层
      openDataScope: false, // 是否显示弹出层（数据权限）
      dateRange: [], // 日期范围
      statusOptions: ['正常', '停用'], // 状态数据字典
      dataScopeOptions: [ // 数据范围选项
        {
          value: '1',
          label: '全部数据权限'
        },
        {
          value: '2',
          label: '自定数据权限'
        },
        {
          value: '3',
          label: '本部门数据权限'
        },
        {
          value: '4',
          label: '本部门及以下数据权限'
        },
        {
          value: '5',
          label: '仅本人数据权限'
        }
      ],
      menuOptions: [], // 菜单列表
      queryParams: { // 查询参数
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        deleteStatus: undefined
      },
      form: {}, // 表单参数
      defaultProps: {
        children: 'children',
        label: 'label'
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
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getHalfCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.menus
        return response
      })
    },
    // 角色状态修改
    handleStatusChange(row) {
      // console.log(row)
      const type = row.deleteStatus === '0' ? 'enable' : 'disable'
      this.$confirm('确认要"' + type + '""' + row.roleName + '"角色吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeRoleStatus(row.id, type)
        setTimeout(() => {
          // console.log(this.roleList)
        }, 3000)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.deleteStatus = row.deleteStatus === '0' ? '1' : '0'
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false
      this.reset()
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      this.form = {
        roleId: undefined,
        roleName: undefined,
        deleteStatus: '0',
        remark: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      listRole().then(response => {
        // this.form = response.data;
        this.open = true
        this.title = '添加角色'
      })
      // this.getMenuTreeselect();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const roleId = row.id || this.ids
      // const roleMenu = this.getRoleMenuTreeselect(roleId);
      getRole(roleId).then(response => {
        this.form = response.data
        this.open = true
        // this.$nextTick(() => {
        //   roleMenu.then(res => {
        //     this.$refs.menu.setCheckedKeys(res.checkedKeys);
        //   });
        // });
        this.title = '修改角色'
      })
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset()
      const roleDeptTreeselect = this.getRoleDeptTreeselect(row.roleId)
      getRole(row.roleId).then(response => {
        this.form = response.data
        this.openDataScope = true
        this.$nextTick(() => {
          roleDeptTreeselect.then(res => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys)
          })
        })
        this.title = '分配数据权限'
      })
    },
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
      }).catch(function() {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有角色数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportRole(queryParams)
      }).then(response => {
        this.download(response.msg)
      }).catch(function() {})
    }
  }
}
</script>
<style scoped>
.el-row button{
  float: left;
}
</style>
