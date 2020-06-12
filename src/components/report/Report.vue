<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts';
import _ from 'lodash';
export default {
  name: 'Report',
  data() {
    return {
      option: {},
      oldOption: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    };
  },
  // mounted 时 dom 元素已经渲染完毕
  mounted() {
    this.getReports();
  },
  methods: {
    initEcharts() {
      var myChart = echarts.init(document.getElementById('main'));
      const result = _.merge(this.option, this.oldOption);
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result);
    },
    async getReports() {
      const result = await this.$http.getReport();
      if (result.meta.status !== 200) {
        return this.$message.error('获取折线图数据失败');
      }
      this.option = result.data;
      this.initEcharts();
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">

</style>
