<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="订单描述">
        <el-input
          v-model="form.desc"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          style="width: 50%"
        /></el-form-item>
      <el-form-item label="固定资产类别(可选)">
        <el-select v-model="form.faType" placeholder="请选择固定资产类别...">
          <el-option label="所有类别" value="0" />
          <el-option
            v-for="item in typeOption"
            :key="item.tid"
            :label="item.name"
            :value="item.tid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="固定资产部门(可选)">
        <el-select v-model="form.faDept" default-first-option filterable placeholder="请选择固定资产所属部门...">
          <el-option label="所有部门" value="0" />
          <el-option
            v-for="item in deptOption"
            v-if="item.did!=0"
            :key="item.did"
            :label="item.name"
            :value="item.did"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="固定资产">
        <el-select v-model="form.faId" placeholder="请选择固定资产" :rules="{ required: true, message: '固定资产不能为空',trigger:'blur'}">
          <el-option
            v-for="item in faOption"
            :key="item.id"
            :label="item.faName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAllType, queryFaByTDID } from '@/api/fa'
import { getAllDepts } from '@/api/depts'
import { addOrder } from '@/api/order'

export default {
  data() {
    return {
      form: {
        desc: '',
        faType: null,
        faDept: null,
        faId: null
      },
      typeOption: [],
      deptOption: [],
      faOption: []
    }
  },
  async mounted() {
    await this.getFaType()
    await this.getFaDept()
  },
  updated() {
    this.getFaInfo()
  },
  methods: {
    getFaType() {
      getAllType().then(resp => {
        if (resp.code === 200) {
          this.typeOption = resp.data
        }
      })
    },
    getFaDept() {
      getAllDepts().then(resp => {
        if (resp.code === 200) {
          this.deptOption = resp.data
        }
      })
    },
    getFaInfo() {
      queryFaByTDID({ tid: this.form.faType, did: this.form.faDept }).then(resp => {
        if (resp.code === 200) {
          this.faOption = resp.data
        }
      })
    },
    onSubmit() {
      addOrder({ fa: this.form.faId, description: this.form.desc, reporter: sessionStorage.getItem('uid') }).then(resp => {
        if (resp.code === 200) {
          this.$message.success({ message: '提交成功！请勿重复提交', duration: 5000 })
        }
      })
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

