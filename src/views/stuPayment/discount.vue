<template>
  <div>
    <el-table :data="yearList" border @row-click="updateRowData">
      <el-table-column align="center" prop="year"></el-table-column>
      <el-table-column align="center">
        <el-button @click="FormVisible=true">申请减免</el-button>
      </el-table-column>
    </el-table>
    <el-dialog title="申请减免信息" :visible.sync="FormVisible">
      <el-form :model="Form">
        <el-form-item label="贫困等级" label-width="120px">
          <el-select v-model="Form.class" placeholder="请选择对应的权限等级" @change="getSelectedClass">
            <el-option label="特困生" value="1"></el-option>
            <el-option label="比较困难" value="2"></el-option>
            <el-option label="一般困难" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="FormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDiscount">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "discount",
  data() {
    return {
      start_year: '',
      yearList: [],
      FormVisible: false,
      Form:{
        class:'1'
      },
      year: ''
    }
  },
  methods: {
    getData() {
      let params = new URLSearchParams()
      params.append('user_id', this.$store.getters.getUserID)
      params.append('user_pwd', this.$store.getters.getUserPWD)
      axios.post('/login/user', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        console.log(response.data.s_grade)
        this.start_year = response.data.s_grade
        console.log(this.start_year)
        this.generateYearList()
      })
    },
    generateYearList() {
      for (let i = parseInt(this.start_year); i < 2023; i++) {
        let somestring = i + '-' + (i + 1)
        this.yearList.push({'year': somestring});
      }
    },
    getSelectedClass(val){
      this.Form.class = val
    },
    submitDiscount(){
      let params = new URLSearchParams()
      console.log(localStorage.getItem('S_no'))
      params.append('S_no',localStorage.getItem('S_no'))
      params.append('identity_id', this.Form.class)
      params.append('year', this.year)
      axios.post('/student/jianmain/shenqing', params, {
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response) => {
        if(response.data === 1){
          this.$message.success('申请成功')
        }else{
          this.$message.error('提交失败，请检查网络')
        }
        this.FormVisible = false
      })
    },
    updateRowData(row){
      this.year = row.year
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>

</style>
