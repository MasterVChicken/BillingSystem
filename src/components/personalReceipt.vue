<template>
  <div class="my-multi-table">
    <div class="button_group">
      <el-button type="primary" @click="printSendTable">打印收据</el-button>
    </div>
    <div class="print" ref="print">
      <div style="margin:0 auto;">
        <h3 style="text-align:center;margin-top:30px; margin-bottom: 10px">重庆市非税收入统一票据（电子）</h3>
        <div
          style="color: #666666; text-align:center;margin-top:30px; margin-bottom: 10px; display: flex; justify-content: space-between;"
        >
          <div>票据代码：{{}}</div>
          <div>票据号码：{{msg.shouju_id}}</div>
        </div>
        <div
          style="color: #666666; text-align:center;margin-top:10px; margin-bottom: 10px; display: flex; justify-content: space-between;"
        >
          <div>交款人统一社会信用码：</div>
          <div>校验码：</div>
        </div>
        <div
          style="color: #666666; text-align:center;margin-top:10px; margin-bottom: 10px; display: flex; justify-content: space-between;"
        >
          <div>交款人：{{s_name}}</div>
          <div>开票日期：{{time}}</div>
        </div>
        <table
          style="width: 100%"
          class="table table-striped table-bordered"
          align="center"
          valign="center"
        >
          <tr>
            <td class="column">项目编码</td>
            <td class="column">项目名称</td>
            <td class="column">单位</td>
            <td class="column">数量</td>
            <td class="column">标准</td>
            <td class="column">金额</td>
            <td class="column">备注</td>
          </tr>
          <tr>
            <td>01000101</td>
            <td>{{ msg.jiaofeixiang }}</td>
            <td>元</td>
            <td>{{ msg.money + '.000'}}</td>
            <td>标准</td>
            <td>{{ msg.money }}</td>
            <td>{{this.way}}</td>
          </tr>
        </table>
        <br/>
        <div style="line-height: 30px; color: #333333;">
          <div>其他信息</div>
        </div>
        <br/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'personalReceipt',
  data() {
    return {
      time: '',
      way: ''
    };
  },
  props: ["msg","s_name"],
  watch: {},
  computed: {},
  created() {
    this.getTime()
    this.modifiedWay()
  },
  methods: {
    // 打印收据
    printSendTable() {
      this.$print(this.$refs.print);
    },
    getTime(){
      let now = new Date()
      let day = now.getDate()
      let month = now.getMonth() + 1
      let year = now.getFullYear()
      this.time =  year+'-'+month+'-'+day
    },
    modifiedWay(){
      if (this.msg.flag === 1) {
        this.way =  '自主系统缴费'
      } else if (this.msg.flag === 2) {
        this.way = '通过财务处缴费'
      }
    }
  }
};
</script>

<style scoped>
.button_group {
  margin-top: 30px;
  margin-right: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.print {
  width: 90%;
  margin: 0 auto;
  max-width: 1280px;
}

.table {
  border-collapse: collapse;
  border-spacing: 0;
  background-color: transparent;
  display: table;
  width: 100%;
  max-width: 100%;
  width: 800px;
  margin: 0 auto;
}

.table td {
  text-align: center;
  vertical-align: middle;
  font-size: 14px;
  font-family: "Arial Normal", "Arial";
  color: #333333;
  padding: 8px 12px;
}

.table-bordered {
  border: 1px solid #ddd;
}

.column {
  width: 30px;
  height: 30px;
  border: 1px solid #333;
  background: #f1f1f1;
}

.value {
  width: 70px;
  height: 30px;
  border: 1px solid #333;
}
</style>

