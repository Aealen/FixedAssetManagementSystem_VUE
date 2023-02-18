<template>
  <div>
    <el-drawer
      title="详细信息"
      :visible.sync="showUserDrawer"
      :before-close="handleClose"
    >
      <el-descriptions class="margin-top"  :column="3"  border>

        <el-descriptions-item span="3">
          <template slot="label" >
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{currUserData.username}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label" >
            <i class="el-icon-user"></i>
            昵称
          </template>
          {{currUserData.nickname}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label" >
            <i class="el-icon-user"></i>
            联系电话
          </template>
          {{currUserData.phoneNum}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label" >
            <i class="el-icon-user"></i>
            电子邮箱
          </template>
          {{currUserData.email}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label" >
            <i class="el-icon-user"></i>
            所属部门
          </template>
          {{currUserData.deptId}} . {{currUserData.deptName}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label" >
            <i class="el-icon-user"></i>
            用户权限等级
          </template>
          {{currUserData.roleId}} . {{currUserData.roleName}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label" >
            <i class="el-icon-user"></i>
            注册时间
          </template>
          {{currUserData.regTime}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label" >
            <i class="el-icon-user"></i>
            上次登陆时间
          </template>
          {{currUserData.loginTime}}
        </el-descriptions-item>

      </el-descriptions>


    </el-drawer>

  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'UserManagerDraw',
  props: {
    showUserDrawer: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Number,
      default: 1
    }

  },
  data() {
    return {
      // realShowDrawer: this.showUserDrawer
      currUserData: []
    }
  },

  updated() {
    // 获取用户信息
    request({
      url: '/user/getUserViewById/' + this.userId,
      method: 'get'
    }).then(resp => {
      if (resp.code !== 200) {
        this.$message.error(resp.msg)
      }
      this.currUserData = resp.data
      // this.listLoading = false
    }).catch(err => {
      console.log(err)
      // this.listLoading = false
    })
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          // 向父组件传递关闭事件
          this.$emit('closeUserManagerDrawer')
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style scoped>

</style>
