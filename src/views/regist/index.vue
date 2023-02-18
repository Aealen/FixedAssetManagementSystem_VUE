<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">城科固定资产维修系统</h3>
      </div>

      <el-form-item prop="nickname">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="nickname"
          v-model="loginForm.nickname"
          placeholder="输入昵称"
          name="nickname"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="输入用户名  (登陆用)"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
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
      <el-form-item prop="email">
        <span class="svg-container">
          <i class="el-icon-message" />
        </span>
        <el-input
          ref="email"
          v-model="loginForm.email"
          placeholder="请输入邮箱"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="phoneNum">
        <span class="svg-container">
          <i class="el-icon-phone" />
        </span>
        <el-input
          ref="phoneNum"
          v-model.number="loginForm.phoneNum"
          placeholder="请输入联系电话"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="deptId">
        <span class="svg-container">
          <i class="el-icon-s-data" />
        </span>
        <el-select v-model="selDept" placeholder="请选择部门">
          <el-option
            v-for="item in deptOptions"
            :key="item.did"
            :label="item.name"
            :value="item.did"
          />
        </el-select>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegist">注册</el-button>

      <div class="tips">
        <span style="margin-right:20px;" @click="$router.push('/login')">前往登陆</span>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getAllDepts } from '@/api/depts'
import { regist } from '@/api/user'

export default {
  name: 'Regist',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('检查输入'))
      } else {
        callback()
      }
    }

    const validatePasswordVerify = (rule, value, callback) => {
      if (value!=this.loginForm.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6||value.length>20) {
        callback(new Error('密码长度在6~20个字符'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        nickname: '',
        password: '',
        passwordVerify: '',
        email: '',
        phoneNum: '',
        roleId: 2, // 默认角色2   报修员
        deptId: null
      },
      deptOptions: [],
      roleOptions: [],
      selDept: null,
      selRole: null,
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message:'不能为空' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, trigger: 'blur', message:'不能为空' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        passwordVerify: [
          { required: true, trigger: 'blur', validator: validatePasswordVerify }
        ],
        phoneNum: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'change' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
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
    this.getDepts()
  },
  methods: {
    getDepts() {
      getAllDepts()
        .then(resp => {
          if (resp.code === 200) {
            this.deptOptions = resp.data
          } else {
            this.$message.error(resp.msg)
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
    handleRegist() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginForm.deptId = this.selDept

          regist(this.loginForm).then(resp => {
            if (resp.code === 200) {
              this.$message.success('注册成功!')
              this.$router.push('/login')
            }
          })
        } else {
          console.log('检查输入!!')
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
