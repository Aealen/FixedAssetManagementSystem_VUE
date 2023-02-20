<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">城科固定资产维修系统丨忘记密码</h3>
      </div>

      <el-form-item prop="email">
        <span class="svg-container">
          <i class="el-icon-message" />
        </span>
        <el-input
          ref="email"
          v-model="loginForm.email"
          placeholder="请输入邮箱"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="code">
        <span class="svg-container">
          <i class="el-icon-info" />
        </span>
        <el-input
          ref="code"
          v-model.number="loginForm.code"
          placeholder="请输入验证码"
          name="code"
          type="text"
          tabindex="1"
          auto-complete="on"
          style="width: 50%"
        />
        <el-button style="float: right;height: 100%;vertical-align: middle;line-height: 1" type="primary" :loading="sendCodeLoading" @click="sendMailCode">发送验证码</el-button>
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="passwordVerify">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="passwordVerify"
          v-model="loginForm.passwordVerify"
          :type="passwordType"
          placeholder="再次输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleReset">提交</el-button>

      <div class="tips">
        <span style="margin-right:20px;" @click="$router.push('/login')">前往登陆</span>
      </div>

    </el-form>
  </div>
</template>

<script>
import { changePwd, checkCode, sendCode } from '@/api/user'

export default {
  name: 'Regist',
  data() {
    const validatePasswordVerify = (rule, value, callback) => {
      if (value !== this.loginForm.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        password: '',
        passwordVerify: '',
        email: '',
        code: ''
      },
      sendCodeLoading: false,

      loginRules: {
        passwordVerify: [
          { required: true, trigger: 'blur', validator: validatePasswordVerify }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]

      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
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
  mounted() {

  },
  methods: {

    sendMailCode() {
      this.sendCodeLoading = true
      sendCode({ email: this.loginForm.email, code: null }).then(resp => {
        if (resp.code === 200) {
          // 发送成功
          this.$message.success('邮件发送成功,请在五分钟内使用验证码!')
        }
      })
      this.sendCodeLoading = false
    },
    checkMailCode() {
      // 校验Code是否正确
      checkCode({ email: this.loginForm.email, code: this.loginForm.code }).then(resp => {
        if (resp.code === 200) {
          this.$message.success(resp.msg)
          return true
        } else {
          this.$message.error(resp.msg)
          return false
        }
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleReset() {
      checkCode({ email: this.loginForm.email, code: this.loginForm.code }).then(resp => {
        if (resp.code === 200) {
          this.$refs.loginForm.validate(valid => {
            if (valid) {
              // 重置密码
              changePwd({ email: this.loginForm.email, password: this.loginForm.password }).then(res => {
                if (res.code === 200) {
                  this.$message.success('密码已更新,请登陆...')
                  this.$router.push('/login')
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else {
              console.log('检查输入!!')
              return false
            }
          })
        } else {
          this.$message.error(resp.msg)
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-select{
    width: 90%;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
