<template>
  <div>
    <el-drawer
      title="详细信息"
      :visible.sync="showFADrawer"
      :before-close="handleClose"
    >
      <el-descriptions class="margin-top" :column="4" border>
        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            资产名
          </template>
          <span v-if="!isEditing">{{ currFaData.faName }}</span>
          <el-input v-if="isEditing" v-model="currFaData.faName" placeholder="请输入内容" />
        </el-descriptions-item>
        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            型号
          </template>
          <span v-if="!isEditing">{{ currFaData.faModel }}</span>
          <el-input v-if="isEditing" v-model="currFaData.faModel" placeholder="请输入内容" />
        </el-descriptions-item>
        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            生产厂商
          </template>
          <span v-if="!isEditing">{{ currFaData.faProducer }}</span>
          <el-input v-if="isEditing" v-model="currFaData.faProducer" placeholder="请输入内容" />
        </el-descriptions-item>
        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            单价
          </template>
          <span v-if="!isEditing">{{ currFaData.faPrice }}</span>
          <el-input v-if="isEditing" v-model="currFaData.faPrice" placeholder="请输入内容" />
        </el-descriptions-item>
        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            资产类型
          </template>
          <span v-if="!isEditing">{{ currFaData.faTid }} . {{ currFaData.faTypeName }}</span>
          <el-select v-if="isEditing" v-model="currFaData.faTid" placeholder="请选择">
            <el-option
              v-for="item in typeOption"
              :key="item.tid"
              :label="item.name"
              :value="item.tid"
            />
          </el-select>

        </el-descriptions-item>
        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            所属部门
          </template>
          <span v-if="!isEditing">{{ currFaData.faDid }} . {{ currFaData.faDeptName }}</span>
          <el-select v-if="isEditing" v-model="currFaData.faDid" placeholder="请选择">
            <el-option
              v-for="item in deptOption"
              :key="item.did"
              :label="item.name"
              :value="item.did"
            />
          </el-select>

        </el-descriptions-item>
        <el-descriptions-item span="4">
          <template slot="label">
            <i class="el-icon-user" />
            负责人
          </template>
          <span v-if="!isEditing">{{ currFaData.faCustodianId }}. {{ currFaData.faCustodian }}</span>
          <el-select v-if="isEditing" v-model="currFaData.faCustodianId" placeholder="请选择">
            <el-option
              v-for="item in costodianOption"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <el-button v-if="!isEditing" style="width: 30%" type="warning" @click="isEditing=true;bedoreEdit()"><i class="el-icon-edit" />编辑</el-button>
          <el-button v-if="isEditing" style="width: 30%" type="danger" @click="isEditing=false"><i class="el-icon-edit" />取消</el-button>
          <el-button v-if="isEditing" style="width: 30%" type="primary" @click="handelSubmit"><i class="el-icon-upload2" />提交</el-button>
        </el-descriptions-item>

      </el-descriptions>

    </el-drawer>

  </div>
</template>

<script>
import { getAllType, getFaByID, updatefa } from '@/api/fa'
import { getAllDepts } from '@/api/depts'
import { getAllCustodian } from '@/api/user'

export default {
  name: 'FAInfoDraw',
  props: {
    showFADrawer: {
      type: Boolean,
      default: false
    },
    FAId: {
      type: Number,
      default: 0
    }

  },
  data() {
    return {
      // realShowDrawer: this.showUserDrawer
      currFaData: [],
      isEditing: false,
      typeOption: [],
      deptOption: [],
      costodianOption: []
    }
  },
  // updated() {
  //   if (this.FAId !== 0 && !this.isEditing) {
  //
  //   }
  // },
  watch: {
    isEditing: async function() {
      this.getData()
    },
    showFADrawer: async function() {
      this.getData()
    }
  },
  methods: {
    getData() {
      getFaByID(this.FAId).then(resp => {
        if (resp.code !== 200) {
          this.$message.error(resp.msg)
        }
        this.currFaData = resp.data
        // this.listLoading = false
      }).catch(err => {
        console.log(err)
        // this.listLoading = false
      })
    },
    handelSubmit() {
      // 更新信息
      updatefa(
        {
          fid: this.currFaData.id,
          name: this.currFaData.faName,
          type: this.currFaData.faTid,
          model: this.currFaData.faModel,
          producer: this.currFaData.faProducer,
          price: this.currFaData.faPrice,
          dep: this.currFaData.faDid,
          custodian: this.currFaData.faCustodianId
        }).then(async resp => {
        if (resp.code === 200) {
          this.$emit('closeFAInfoDraw')
          // this.showFADrawer = false
          this.$message.success('信息修改成功！')
        }
      })
    },
    bedoreEdit() {
      this.getAllTypeInfo()
      this.getAllDeptInfo()
      this.getAllCustodianInfo()
    },
    getAllCustodianInfo() {
      getAllCustodian().then(resp => {
        if (resp.code === 200) {
          this.costodianOption = resp.data
        }
      })
    },
    getAllTypeInfo() {
      getAllType().then(resp => {
        if (resp.code === 200) {
          this.typeOption = resp.data
        }
      })
    },
    getAllDeptInfo() {
      getAllDepts().then(resp => {
        if (resp.code === 200) {
          this.deptOption = resp.data
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          // 向父组件传递关闭事件
          this.$emit('closeFAInfoDraw')
          this.isEditing = false
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style scoped>

</style>
