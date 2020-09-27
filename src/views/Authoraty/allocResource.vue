<template>
  <el-card class="form-container" shadow="never">
    <div v-for="(category,index) in allResourceCate" :class="index===0?'top-line':null" :key="'cate'+category.id">
      <el-row class="table-layout" style="background: #F2F6FC;">
        <el-checkbox
          :model="category.checked"
          :indeterminate="isIndeterminate(category.id)"
          @change="handleCheckAllChange(category)">
          {{category.categoryName}}
        </el-checkbox>
      </el-row>
      <el-row class="table-layout">
          <el-col :span="8" v-for="resource in getResourceByCate(category.id)" :key="resource.id" style="padding: 4px 0">
          <el-checkbox v-model="resource.checked" @change="handleCheckChange(resource)">
            {{resource.resourceName}}
          </el-checkbox>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px" align="center">
      <el-button type="primary" @click="handleSave()">保存</el-button>
      <el-button @click="handleClear()">清空</el-button>
    </div>

  </el-card>
</template>

<script>
import { allocResources, listRoleResources } from '@/api/authoraty/role'
import { fetchAllResourceList } from '@/api/authoraty/resource'
import { listAllCate } from '@/api/authoraty/resourceCategory'
import { allocResource, listResourceByRole} from '@/api/role'

export default {
  name: 'AllocResource',
  data() {
    return {
      roleId: this.$route.query.roleId,
      allResource: [],
      allResourceCate: null
    };
  },
  created() {
    this.getAllResourceCateList()
    this.getResourceByRole(this.roleId)
  },
  methods: {
    getAllResourceList() {
      fetchAllResourceList().then(response => {
        this.allResource = response.data
        console.log(this.allResource)
        for (let i = 0; i < this.allResource.length; i++) {
          this.allResource[i].checked = false
        }
        this.getResourceByRole(this.roleId);
      })
    },
    getAllResourceCateList() {
      listAllCate().then(response => {
        this.allResourceCate = response.data
        console.log(this.allResourceCate)
        for (let i = 0; i < this.allResourceCate.length; i++) {
          this.allResourceCate[i].enabled = false
        }
        this.getAllResourceList()
      });
    },
    getResourceByCate(categoryId) {
      let cateResource = []
      if (this.allResource == null) return null;
      for (let i = 0; i < this.allResource.length; i++) {
        let resource = this.allResource[i];
        if (resource.categoryId === categoryId) {
          cateResource.push(resource)
        }
      }
      return cateResource
    },
    getResourceByRole(roleId){
      listRoleResources(roleId).then(response =>{
        const allocResource = response.data;
        const resources=[]
        if(allocResource!==undefined&&allocResource!==null&&allocResource!==''){
        this.allResource.forEach(function (val,index) {
         for (let i = 0; i < allocResource.length; i++) {
           {
             if (allocResource[i]===val.id){
               val.checked=true
               resources.push(val)
             }
           }
         }
        })
        this.allResource=resources
        }
        // this.allResource.forEach( item=>{
        //   item.checked = this.getResourceChecked(item.id,allocResource);
        // });
        // this.allResourceCate.forEach(item=>{
        //   item.checked = this.isAllChecked(item.id)
        // })
        // this.$forceUpdate()
      })
    },
    getResourceChecked(resourceId,allocResource){
      if(allocResource==null||allocResource.length===0) return false;
      for(let i=0;i<allocResource.length;i++){
        if(allocResource[i].id === resourceId){
          return true;
        }
      }
      return false;
    },
    isIndeterminate(categoryId) {
      const cateResources = this.getResourceByCate(categoryId);
      if (cateResources == null) return false
      let checkedCount = 0
      for (let i = 0; i < cateResources.length; i++) {
        if (cateResources[i].checked === true) {
          checkedCount++
        }
      }
      return !(checkedCount === 0 || checkedCount === cateResources.length);
    },
    isAllChecked(categoryId) {
      let cateResources = this.getResourceByCate(categoryId);
      if (cateResources == null) return false
      let checkedCount = 0
      for (let i = 0; i < cateResources.length; i++) {
        if (cateResources[i].checked === true) {
          checkedCount++
        }
      }
      if (checkedCount === 0) {
        return false
      }
      return checkedCount === cateResources.length
    },
    handleSave() {
      this.$confirm('是否分配资源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let checkedResourceIds = new Set();
        if (this.allResource != null && this.allResource.length > 0) {
          this.allResource.forEach(item => {
            if (item.checked) {
              checkedResourceIds.add(item.id)
            }
          })
        }
        let params = new URLSearchParams();
        params.append("roleId", this.roleId);
        params.append("resourceIds", Array.from(checkedResourceIds));
        allocResources(params).then(response => {
          this.$message({
            message: '分配成功',
            type: 'success',
            duration: 1000
          });
          this.$router.back();
        })
      })
    },
    handleClear() {
      this.allResourceCate.forEach(item => {
        item.checked = false;
      });
      this.allResource.forEach(item => {
        item.checked = false;
      });
      this.$forceUpdate();
    },
    handleCheckAllChange(cate) {
      let cateResources = this.getResourceByCate(cate.id);
      for (let i = 0; i < cateResources.length; i++) {
        cateResources[i].checked = cate.checked;
      }
      this.$forceUpdate();
    },
    handleCheckChange(resource) {
      this.allResourceCate.forEach(item=>{
        if(item.id===resource.categoryId){
          item.checked = this.isAllChecked(resource.categoryId);
        }
      });
      this.$forceUpdate();
    }
  }
}
</script>

<style scoped>
  .table-layout {
    padding: 20px;
    border-left: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
  }

  .top-line {
    border-top: 1px solid #DCDFE6;
  }
</style>
