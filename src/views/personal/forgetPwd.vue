<template>
  <div class="login-container">
    <!--    通过ref可以获取到表单对象，如this.$refs.loginForm.-->
    <el-card class="login-form-layout">
      <el-form ref="loginForm" auto-complete="on" :model="loginForm" :rules="loginRules" label-position="left">
        <div style="text-align: center">
          <svg-icon icon-class="duck" style="width: 56px;height: 56px;color: #409EFF" />
        </div>
        <h2 class="login-title color-main">找回密码界面</h2>
        <!-- 手机号        -->
        <el-form-item prop="phonenumber">
          <el-input
            v-model.trim="loginForm.phonenumber"
            name="phonenumber"
            type="text"
            auto-complete="on"
            clearable
            placeholder="请输入与账号绑定的手机号"
            @blur="onBlur"
          >
            <span slot="prefix">
              <svg-icon icon-class="user" class="color-main" />
            </span>
          </el-input>
          <el-link type="primary" @click="sendCode(loginForm.phonenumber)">获取验证码</el-link>
        </el-form-item>
        <el-form-item />
        <!--  密码      -->
        <el-form-item prop="code">
          <el-input
            v-model.trim="loginForm.code"
            placeholder="请输入短信验证码"
            clearable
            @blur="onBlur"
          >
            <span slot="prefix">
              <svg-icon icon-class="password" class="color-main" />
            </span>
            <!-- input中加图标必须要有slot="suffix"属性，不然无法显示图标 -->
          </el-input>
        </el-form-item>

        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button
            style="width: 45%; float: right"
            type="primary"
            :loading="loading"
            @click="toCodeEquals"
          >确定</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import { getCode, codeEquals } from '@/api/authoraty/user'

export default {
  name: 'ForgetPwd',
  data() {
    return {
      loginForm: { // 登录表单的数据绑定对象
        // imgSrc:require('../../assets/6.jpg'),
        code: '',
        phonenumber: ''
      },
      loginRules: { // 表单的验证规则对象
        phonenumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
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

    sendCode() {
      this.$refs.loginForm.validate(valid => { // 表单的验证
        if (valid) {
          this.loading = true
          console.log(this.loginForm.phonenumber)
          // eslint-disable-next-line no-undef
          getCode(this.loginForm.phonenumber).then(response => {
            console.log(this.loginForm.phonenumber)
            console.log(response.message)
            if (response.message === '短信验证码发送成功') {
              this.$message({
                message: '短信验证码发送成功',
                type: 'success'
              })
            }
            // this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    toCodeEquals() {
      this.$refs.loginForm.validate(valid => { // 表单的验证
        if (valid) {
          this.loading = true
          console.log(this.loginForm.code)
          // eslint-disable-next-line no-undef
          codeEquals(this.loginForm.code).then(response => {
            console.log(this.loginForm.code)
            if (response.message === '操作成功') {
              this.$router.push({ path: this.redirect || '/login' })
              this.$message({
                message: response.data,
                type: 'success'
              })
            }
            // this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 密码失焦事件
    onBlur() {
      this.passwordType = 'password'
      this.icon = 'el-input__icon el-icon-view'
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
