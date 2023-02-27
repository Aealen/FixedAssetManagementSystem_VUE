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
        <el-select v-model="form.faType" placeholder="请选择固定资产类别..." @change="getFaInfo">
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
        <el-select v-model="form.faDept" placeholder="请选择固定资产所属部门..." @change="getFaInfo()">
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
        <el-select v-model="form.faId" placeholder="请选择固定资产" :rules="{ required: true, message: '固定资产不能为空',trigger:'blur'}" @change="getWorker()">
          <el-option
            v-for="item in faOption"
            :key="item.id"
            :label="item.faName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="指派维修员">
        <el-select v-model="form.faWorker" placeholder="请选择维修员" :rules="{ required: true, message: '不能为空',trigger:'blur'}" @focus="getWorker()">
          <el-option
            v-for="item in workerOption"
            :key="item.id"
            :label="item.nickname"
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
import { getAllType, getFaByID, queryFaByTDID } from '@/api/fa'
import { getAllDepts } from '@/api/depts'
import { addOrder, getWorker } from '@/api/order'

export default {
  data() {
    return {
      form: {
        desc: '',
        faType: null,
        faDept: null,
        faWorker: null,
        faId: null
      },
      typeOption: null,
      deptOption: null,
      workerOption: null,
      faOption: null
    }
  },
  async mounted() {
    if (this.typeOption === null) { await this.getFaType() }
    if (this.deptOption === null) { await this.getFaDept() }
    await this.getFaInfo()
  },
  async updated() {
    // await this.getFaInfo()
  },
  methods: {

    getWorker() {
      if (this.form.faDept === null) {
        // 部门为空 则只能 用faID 间接查询
        if (this.form.faId !== null) {
          getFaByID(this.form.faId).then(resp => {
            if (resp.code === 200) {
              getWorker(resp.data.faDid).then(res => {
                if (res.code === 200) {
                  this.workerOption = res.data
                }
              })
            }
          })
        } else {
          return
        }
      } else {
        getWorker(this.form.faDept).then(resp => {
          if (resp.code === 200) {
            this.workerOption = resp.data
          }
        })
      }
    },
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
          // this.getWorker(this.form.faId, this.form.faDept)
        }
      })
    },
    onSubmit() {
      addOrder({ fa: this.form.faId, worker:this.form.faWorker, description: this.form.desc, reporter: sessionStorage.getItem('uid') }).then(resp => {
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

