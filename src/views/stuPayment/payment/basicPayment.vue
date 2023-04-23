<template>
<!--  <div>-->
<!--    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 10px">-->
<!--      <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>-->
<!--      <el-breadcrumb-item>教师权限管理</el-breadcrumb-item>-->
<!--    </el-breadcrumb>-->
<!--    <el-form :inline="true" class="user-search">-->
<!--      <el-form-item label="简易搜索">-->
<!--        <el-input size="small" v-model="searchByName" placeholder="输入用户名"></el-input>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
<!--    &lt;!&ndash;列表&ndash;&gt;-->
<!--    <el-table size="small" @selection-change="selectChange"-->
<!--              :data="paymentData.filter(data => !searchByName || data.t_name.includes(searchByName))"-->
<!--              highlight-current-row-->
<!--              v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">-->
<!--      <el-table-column align="center" type="selection" width="50">-->
<!--      </el-table-column>-->
<!--      <el-table-column align="center" sortable prop="year" label="学年" width="200">-->
<!--      </el-table-column>-->
<!--      <el-table-column align="center" sortable prop="t_name" label="姓名" width="200">-->
<!--      </el-table-column>-->
<!--      <el-table-column align="center" sortable prop="t_pos" label="职位" width="200">-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--  </div>-->
</template>

<script>
import axios from "axios";
export default {
  name: "basicPayment",
  data(){
    return{
      // searchByName: '',
      basicData:{
        year: '',
        type: '',
        money: '',
        flag: ''
      },
    }
  },
  methods:{
    getBasicData(){
      let params = new URLSearchParams()
      params.append('S_no',localStorage.getItem('S_no'))
      axios.post('/student/find/feiyong',params,{
        headers: {
          'Access-Control-Allow-Credentials': 'true', //解决session问题
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //将表单数据传递转化为form-data类型
        }
      }).then((response)=>{
        console.log(localStorage.getItem('S_no'))
        console.log(response)
      })
    }
  },
  created() {
    this.getBasicData()
  }
}
</script>

<style scoped>

</style>
