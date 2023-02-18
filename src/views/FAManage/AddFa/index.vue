<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
      <el-form-item
        prop="name"
        label="资产名称"
      >
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item
        prop="type"
        label="资产类别"
      >
        <el-select v-model="form.type" placeholder="请选择...">
          <el-option
            v-for="item in typeOptions"
            :key="item.tid"
            :label="item.name"
            :value="item.tid"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        prop="model"
        label="型号"
      >
        <el-input v-model="form.model" />
      </el-form-item>

      <el-form-item
        prop="producer"
        label="产商"
      >
        <el-input v-model="form.producer" />
      </el-form-item>

      <el-form-item
        prop="price"
        label="单价"
      >
        <el-input v-model="form.price" />
      </el-form-item>

      <el-form-item
        prop="dep"
        label="所属部门"
      >
        <el-select v-model="form.dep" placeholder="请选择...">
          <el-option
            v-for="item in deptOptions"
            :key="item.did"
            :label="item.name"
            :value="item.did"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        prop="custodian"
        label="负责人"
      >
        <el-select v-model="form.custodian" placeholder="请选择...">
          <el-option
            v-for="item in custodianOptions"
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
import { getAllDepts } from '@/api/depts'
import { addFa, getAllType } from '@/api/fa'
import { getAllCustodian } from '@/api/user'

export default {
  data() {
    const validatePrice = (rule, value, callback) => {
      const reg = /^\d{0,10}.\d{0,4}$/
      if (!reg.test(value)) {
        callback(new Error('检查输入'))
      } else {
        callback()
      }
    }
    return {
      deptOptions: [],
      typeOptions: [],
      custodianOptions: [],
      form: {
        'fid': null,
        'name': '',
        'type': null,
        'model': '',
        'producer': '',
        'price': null,
        'dep': null,
        'custodian': null,
        'delFlag': 0
      },
      formRules: {
        name: [
          { required: true, trigger: 'blur', message: '不能为空' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, trigger: 'blur', message: '不能为空' }
        ],
        model: [
          { required: true, trigger: 'blur', message: '不能为空' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        producer: [
          { required: true, trigger: 'blur', message: '不能为空' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, trigger: 'blur', message: '不能为空' },
          { required: true, trigger: 'blur', validator: validatePrice }
        ],
        dep: [
          { required: true, trigger: 'blur', message: '不能为空' }
        ],
        custodian: [
          { required: true, trigger: 'blur', message: '不能为空' }
        ]
      }
    }
  },
  created() {
    this.getOptions()
  },
  methods: {
    getOptions() {
      getAllDepts().then(resp => {
        if (resp.code === 200) {
          this.deptOptions = resp.data
        }
      })

      getAllType().then(resp => {
        if (resp.code === 200) {
          this.typeOptions = resp.data
        }
      })

      getAllCustodian().then(resp => {
        if (resp.code === 200) {
          this.custodianOptions = resp.data
        }
      })
    },

    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          addFa(this.form).then(resp => {
            if (resp.code === 200) {
              this.$router.go(0)
              this.$message.success('提交成功')
            } else {
              this.$message.error(resp.msg)
            }
          })
        } else {
          this.$message.error('检查输入!!')
          return false
        }
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

