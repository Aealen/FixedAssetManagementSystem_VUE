<template>
  <div class="app-container">

    <el-input
      v-model="pageParams.keyword"
      placeholder="搜索关键字"
      clearable
      style="width: 50%"
    />
    <el-select v-model="searchByTD.did" clearable placeholder="请选择部门" @change="getFAByTD">
      <el-option
        v-for="item in deptOptions"
        :key="item.did"
        :label="item.name"
        :value="item.did"
      />
    </el-select>
    <el-select v-model="searchByTD.tid" clearable placeholder="请选择角色" @change="getFAByTD">
      <el-option
        v-for="item in typeOptions"
        :key="item.tid"
        :label="item.name"
        :value="item.tid"
      />
    </el-select>
    <el-button type="primary" style="width: 100px;" @click="getSearch()">搜索</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >

      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          <!--          {{ scope.$index }}-->
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="资产名" width="180">
        <template slot-scope="scope">
          {{ scope.row.faName }}
        </template>
      </el-table-column>
      <el-table-column label="型号" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.faModel }}</span>
        </template>
      </el-table-column>

      <el-table-column label="生产厂商" width="220" align="center">
        <template slot-scope="scope">
          {{ scope.row.faProducer }}
        </template>
      </el-table-column>
      <el-table-column label="单价" width="210" align="center">
        <template slot-scope="scope">
          {{ scope.row.faPrice }}
        </template>
      </el-table-column>
      <el-table-column label="所属分类" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.faTid }}.{{ scope.row.faTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="所属部门" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.faDid }}.{{ scope.row.faDeptName }}
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="190" align="center">
        <template slot-scope="scope">
          {{ scope.row.faCustodianId }}. {{ scope.row.faCustodian }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="350">
        <template slot-scope="scope">
          <el-link class="text_link" type="primary" @click="showFADrawer=true;currSelFaId=scope.row.id;showFAInfoDraw()">详细信息</el-link>
          <el-dropdown v-if="currRole==='1'||currRole==='4'">
            <el-link class="el-dropdown-link" type="primary">
              操作列表<i class="el-icon-arrow-down el-icon--right" />
            </el-link>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span @click="delFixedAsset(scope.row.id)">删除此项</span></el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-size="pageParams.perPage"
      :pager-count="5"
      layout="prev, pager, next"
      :total="sumCount"
      :current-page="pageParams.currPage"
      @current-change="handleChangePage"
    />

    <FAInfoDraw :f-a-id="currSelFaId" :show-f-a-drawer="showFADrawer" @closeFAInfoDraw="closeFAInfoDraw()" />

  </div>
</template>

<script>
import FAInfoDraw from '@/components/FAInfoDraw/index'
import request from '@/utils/request'
import { delFa, getAllType, getFaCount, getFASearchCount, getFASearchCountByData, queryFaByPage } from '@/api/fa'
import { getAllDepts } from '@/api/depts'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  components: {
    FAInfoDraw
  },
  data() {
    return {
      list: null,
      pageParams: {
        keyword: null,
        currPage: 1,
        perPage: 10
      },
      searchByTD: {
        tid: null,
        did: null
      },
      currRole: null,
      sumCount: 0,
      listLoading: true,
      showFADrawer: false,
      currSelFaId: 0,
      deptOptions: null,
      typeOptions: null
    }
  },
  created() {
    this.fetchData()
    getAllDepts().then(resp => {
      this.deptOptions = resp.data
    })
    getAllType().then(resp => {
      this.typeOptions = resp.data
    })
  },
  mounted() {
  },
  methods: {
    async getFAByTD() {
      if (this.searchByTD.tid !== '' || this.searchByTD.did !== '') {
        this.listLoading = true
        // 先查再计数

        await getFASearchCountByData({
          keyword: this.pageParams.keyword,
          page: this.pageParams.currPage,
          perPage: this.pageParams.perPage,
          tid: this.searchByTD.tid,
          did: this.searchByTD.did
        }).then(resp => {
          this.sumCount = resp.data
        })
        await queryFaByPage({
          tid: this.searchByTD.tid,
          did: this.searchByTD.did,
          page: 1,
          perPage: this.sumCount
        }).then(resp => {
          this.list = resp.data
          this.listLoading = false
        })
      } else {
        this.fetchData()
      }
    },
    async getSearch() {
      this.listLoading = true
      // 获取搜索结果的条数
      await this.fetchData()

      await getFASearchCount(this.pageParams.keyword, this.pageParams.currPage, this.pageParams.perPage).then(resp => {
        if (resp.code === 200) {
          this.sumCount = resp.data
        }
      })

      this.listLoading = false
      this.$forceUpdate()
    },
    fetchData() {
      this.currRole = sessionStorage.getItem('rid')
      this.listLoading = true
      getFaCount().then(response => {
        // console.log(response)
        if (response.code !== 200) {
          this.$message.error(response.msg)
        }
        this.handleChangePage(this.pageParams.currPage)

        this.sumCount = response.data
      }).catch(error => {
        this.$message.error(error)
      })
    },
    delFixedAsset(fid) {
      this.$confirm('此操作将会删除此项!!!, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFa(fid).then(resp => {
          if (resp.code === 200) {
            this.fetchData()
            this.$forceUpdate()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: resp.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handleChangePage(val) {
      request({
        url: '/fa/queryFaByPage',
        method: 'post',
        data: {
          'keyword': this.pageParams.keyword,
          'page': val,
          'perPage': this.pageParams.perPage
        }
      }).then(resp => {
        if (resp.code !== 200) {
          this.$message.error(resp.msg)
        }
        this.list = resp.data
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    showFAInfoDraw() {
      this.showFADrawer = true
      // console.log(this.showFADrawer)
    },
    async closeFAInfoDraw() {
      this.showFADrawer = false
      await this.fetchData()
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="css" scoped>
.text_link{
  margin-right:20px
}
</style>
