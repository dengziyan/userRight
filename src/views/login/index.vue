<template>
  <div class="login-container">
    <!--    通过ref可以获取到表单对象，如this.$refs.loginForm.-->
    <el-card class="login-form-layout">
      <el-form ref="loginForm" auto-complete="on" :model="loginForm" :rules="loginRules" label-position="left">
        <div style="text-align: center">
          <svg-icon icon-class="duck" style="width: 56px;height: 56px;color: #409EFF" />
        </div>
        <h2 class="login-title color-main">user-rights-system</h2>
        <!--用户名        -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="请输入用户名">
            <span slot="prefix">
              <svg-icon icon-class="user" class="color-main" />
            </span>
          </el-input>
        </el-form-item>
        <!--  密码      -->
        <el-form-item prop="password">
          <el-input
            v-model.trim="loginForm.password"
            placeholder="请输入密码"
            :type="passwordType"
            @blur="onBlur"
          >
                        <span slot="prefix">
              <svg-icon icon-class="password" class="color-main" />
            </span>
            <!-- input中加图标必须要有slot="suffix"属性，不然无法显示图标 -->
            <i slot="suffix" :class="icon" @click="showPass" />
          </el-input>
        </el-form-item>

        <!--   记住密码，忘记密码     -->
        <el-form-item>
          <el-checkbox v-model="checked">记住密码</el-checkbox>
          <el-link type="primary"><router-link to="forgetPwd">忘记密码</router-link></el-link>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button style="width: 45%" type="primary" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <router-link to="/">注册</router-link>
    </el-card>

  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    // 校验用户名
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    // 校验密码
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: { // 登录表单的数据绑定对象
        // imgSrc:require('../../assets/6.jpg'),
        username: 'wuyuan',
        password: 'wuyuan'
      },
      loginRules: { // 表单的验证规则对象
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      redirect: undefined,
      checked: true,
      icon: 'el-input__icon el-icon-view',
      passwordType: 'password'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 密码的隐藏和显示
    showPass() {
      // 点击图标是密码隐藏或显示
      if (this.passwordType === 'text') {
        this.passwordType = 'password'
        // 更换图标
        this.icon = 'el-input__icon el-icon-view'
      } else {
        this.passwordType = 'text'
        this.icon = 'el-input__icon el-icon-loading'
        setTimeout(() => {
          this.icon = ''
        }, 500)
      }
    },
    // 密码失焦事件
    onBlur() {
      this.passwordType = 'password'
      this.icon = 'el-input__icon el-icon-view'
    },
    // 重置表单
    resetForm() {
      this.loginForm.username = ''
      this.loginForm.password = ''
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => { // 表单的验证
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 360px;
    margin: 94px auto 0px;
    border-top: 10px solid #409EFF;
  }

  .login-title {
    text-align: center;
  }

  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }
  .el-checkbox:last-of-type {
    margin-right: 0;
    float: left;
  }
  .el-link.el-link--primary {
    color: #409EFF;
    float: right;
  }
  .el-button{
    float: right;
  }
  .el-button--primary{
    float: left;
  }
  .login-container{
    background: url("../../assets/6.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    z-index: 33;
    width: 100%;
    background-position: center;
    height: 100%;
  }
  /*.background{
    width:100%;
    height:100%;  !**宽高100%是为了图片铺满屏幕 *!
    z-index:-1;
    position: absolute;
  }

  .front{
    z-index:1;
    position: absolute;
  }*/
</style>
