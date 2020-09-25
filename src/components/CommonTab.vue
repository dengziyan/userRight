<template>
  <div class="tags">
    <el-tag
      v-for="tag in tags"
      :key="tag.name"
      size="small"
      :closable="tag.name !== 'home'"
      :disable-transitions="false"
      :type="tag.type"
      :effect="tag.effect"
      @close="handleClose(tag)"
      @click="changeMenu(tag)"
    >
      {{ tag.title }}
    </el-tag>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    ...mapState({
      tags: state => state.tab.tabsList
    })
  },
  methods: {
    ...mapMutations({
      close: 'closeTab'
    }),
    handleClose(tag) {
      const index = this.tags.findIndex(item => item.effect === 'dark')
      this.close(tag)
      const lastTag = index === 0 ? this.tags[0] : this.tags[this.tags.length - 1]
      this.changeMenu(lastTag)
    },
    changeMenu(item) {
      // console.log(this.tags)
      this.$router.push({ name: item.name })
      this.$store.commit('selectMenu', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.tags{
  padding: 20px;
  .el-tag{
    margin-right: 15px;
  }
}
</style>
