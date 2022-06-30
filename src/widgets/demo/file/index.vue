<template>
  <mars-pannel :visible="true" top="50" right="50" bottom="70" width="400" v-if="true">
    <!-- 右侧图表面板-->
    <div class="bg">
      <div class="_item_top">
        <div class="_item_title">受灾建筑</div>
      </div>
      <div class="_item_row _item_full_box_width justify-between">
        <div class="row1 flex-1">
          <!-- <img src="/img/icon/监测建筑.png" alt="" class="icon" /> -->
          <div class="row1_right">
            <div class="right_title">87</div>
            <div class="right_sub_title">监测建筑</div>
          </div>
        </div>
        <div class="row1 flex-1 ml">
          <!-- <img src="/img/icon/监测面积.png" alt="" class="icon" /> -->
          <div class="row1_right">
            <div class="right_title">2021</div>
            <div class="right_sub_title">监测面积(万m²)</div>
          </div>
        </div>
      </div>
      <div class="_item_row" style="align-items: flex-start">
        <div class="row3">
          <div class="_item_row_box3">
            <div class="ring1">
              <div ref="ring" id="ring"></div>
            </div>
          </div>
        </div>
        <div class="row2 flex items-center">
          <div class="_item_row_box2">
            <div class="box2_item" count="64">办公建筑</div>
            <div class="box2_item1" count="1">综合建筑</div>
            <div class="box2_item2" count="4">商场建筑</div>
            <div class="box2_item3" count="10">宾馆饭店</div>
            <div class="box2_item4" count="1">医疗卫生</div>
            <div class="box2_item5" count="1">文化教育</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg down">
      <div class="right_item">
        <div class="_item_top item_bottom">
          <div class="_item_title">各类建筑接入情况</div>
        </div>
        <div class="_item_full_box">
          <div class="bar">
            <div id="bar" ref="bar"></div>
          </div>
        </div>
      </div>
    </div>
  </mars-pannel>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue"
import * as echarts from "echarts"

const ring = ref()

const bar = ref()

onMounted(() => {
  nextTick(() => {
    initEcharts()
  })
})

function initEcharts() {
  // 饼形图
  const myChart = echarts.init(ring.value)
  const option = {
    backgroundColor: "transparent",

    legend: {
      // 图例组件
      show: false,
      top: "50%",
      left: "left",
      icon: "roundRect",
      itemWidth: 8,
      textStyle: {
        fontSize: fontSize(0.7)
      }
    },

    series: [
      {
        type: "pie",
        radius: ["40%", "77"],
        center: ["50%", "50%"],
        avoidLabelOverlap: "ture",
        itemStyle: {
          borderType: "solid",
          borderColor: "#ffffff"
        },
        emphasis: {
          scale: "ture",
          scaleSize: 15,
          focus: "self",
          blurScope: "series"
        },
        label: {
          show: true,
          position: "center",
          lineHeight: 28,
          formatter: () => {
            return ""
          },
          emphasis: {
            formatter: (params: any) => {
              return "{p|" + params.data.name + "}" + "\n{nm|" + params.data.value + "}"
            }
          },
          rich: {
            p: {
              width: 130,
              itemWidth: 100,
              color: "#fff",
              fontSize: fontSize(1),
              lineHeight: fontSize(1),
              fontWeight: "bold"
              //   backgroundColor: "rgba(15, 21, 70, 1)", // 覆盖index=0时的数据
            },
            nm: {
              width: 130,
              itemWidth: 100,
              color: "#fff",
              fontSize: fontSize(1.5),
              lineHeight: fontSize(1.625),
              fontWeight: "bold"
              //   backgroundColor: "rgba(15, 21, 70, 1)", // 覆盖index=0时的数据
            }
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: 64,
            name: "办公建筑",
            itemStyle: {
              color: "rgba(14,227,247, 0.58)"
            }
          },
          {
            value: 1,
            name: "综合建筑",
            itemStyle: {
              color: "rgba(255,113,94, 0.58)"
            }
          },
          {
            value: 4,
            name: "商场建筑",
            itemStyle: {
              color: "rgba(254,  217,  118, 0.64)"
            }
          },
          {
            value: 10,
            name: "宾馆饭店",
            itemStyle: {
              color: "rgba(234,94,230, 0.64)"
            }
          },
          {
            value: 1,
            name: "医疗卫生",
            itemStyle: {
              color: "rgba(94, 225, 186, 0.58)"
            }
          },
          {
            value: 1,
            name: "文化教育",
            itemStyle: {
              color: "rgba(113, 204, 78, 0.58)"
            }
          }
        ]
      }
    ]
  }
  myChart.setOption(option)

  // 柱状图
  const myChart2 = echarts.init(bar.value, "dark")
  const option2 = {
    backgroundColor: "transparent",

    tooltip: {
      // 提示框组件
      trigger: "axis", // 触发的类型  柱状图用axis
      show: true,
      confine: true, // 是否限制tooltip 在图框内
      textStyle: {
        align: "left",
        color: "#70DB93",
        fontWeight: "bold",
        height: 18
      },
      formatter: function (item: any) {
        console.log(item)
        let html = `${item[0].name}:${item[0].data}`
        console.log(html)
        item.slice(1).forEach((s: any) => {
          if (s.seriesName.indexOf("series") === -1) {
            html += `<br/> ${s.seriesName}:${s.data}`
          }
        })
        return html
      },
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // cross 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      show: false,
      top: "5%",
      left: "center",
      icon: "roundRect",
      itemWidth: 8,
      textStyle: {
        fontSize: fontSize(0.6875)
      }
    },
    grid: {
      left: "0%",
      right: "0%",
      top: "20%",
      bottom: "5%",
      containLabel: true
    },
    xAxis: {
      type: "category", // 'category' 类目轴，适用于离散的类目数据。为该类型时类目数据可自动从 series.data 或 dataset.source 中取，或者可通过 xAxis.data 设置类目数据。
      data: ["建筑", "综合建筑", "商场建筑", "宾馆饭店", "医疗卫生", "文化教育"], // 他等于 series.data
      axisTick: {
        alignWithLabel: false,
        show: true,
        lineStyle: {
          color: "#ccc"
        }
      },
      axisLabel: {
        fontSize: fontSize(0.6875),
        interval: 0,
        padding: [10, 0, 0, 0]
      },
      axisLine: {
        lineStyle: {
          color: "#ccc"
        }
      },
      splitLine: {
        show: false
      },
      show: true
    },

    yAxis: {
      max: 70,
      name: "栋",
      nameTextStyle: {
        // color: "rgba(217, 35, 35, 1)",
        align: "right",
        verticalAlign: "middle",
        borderDashOffset: 0,
        padding: [6, 6, 6, 6]
      },
      axisLabel: {
        // color: '#ff0000',
        fontSize: fontSize(0.6875),
        interval: 0,
        padding: [0, 0, 0, 0]
      },
      splitLine: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: "#ccc"
        }
      },
      axisTick: {
        alignWithLabel: false,
        show: true,
        lineStyle: {
          color: "#ccc"
        }
      }
    },
    series: [
      {
        name: "dotted", // name 为dotted 时候 传的 name 就是 x轴
        type: "pictorialBar",
        symbol: "rect", // 柱子一块一块的形状
        barGap: "-100%",
        showBackground: true,
        itemStyle: {
          color: "rgba(14,227,247, 1)"
        },
        symbolRepeat: true,
        symbolSize: [20, 6],
        symbolMargin: 1,
        data: [64, 1, 4, 10, 1, 1],
        z: -8
      },
      {
        type: "bar",
        itemStyle: {
          color: "rgba(0,0,0,0.2)"
        },
        barGap: "-100%",
        barWidth: 12,
        z: -9,
        showBackground: true,

        data: [70, 70, 70, 70, 70, 70]
      }
    ]
  }
  myChart2.setOption(option2)

  // 折线图
}

function fontSize(res: number) {
  return res * 18
}
</script>
<style scoped lang="less">
.achart_container {
  position: absolute;
  padding: 10px;
  top: 0;
  right: 0;
  width: 29rem;
  height: 100%;
  background: linear-gradient(to right, rgba(84, 97, 117, 0.5), rgba(42, 52, 69, 1));
}

._item_top {
  position: relative;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.22rem;
}

.item_bottom {
  margin-bottom: -2rem;
}

._item_title {
  position: relative;
  height: 1.56rem;
  padding-left: 1.25rem;
  line-height: 1.56rem;
  font-size: 1.8rem;
  font-weight: 400;
  color: #1df7ff;
  letter-spacing: 1px;
  margin-bottom: 0.7rem;
}

._item_title::before {
  content: "";
  width: 0.5rem;
  height: 1rem;
  background: rgba(229, 237, 255, 1);
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

._item_title::after {
  content: "";
  width: 26.5rem;
  height: 0.63rem;
  //   background: url("/img/icon/分割.png");
  background-repeat: no-repeat;
  position: absolute;
  left: 0;
  top: calc(100% + 0.13rem);
}

._item_row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  text-align: left;
}

._item_row_title {
  font-size: 0.88rem;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.25rem;
  letter-spacing: 2px;
  text-shadow: 0px 0px 0px #02e1ff;
}

.row1 {
  width: 10rem;
  align-items: center;
  display: flex;
  margin-bottom: 1.19rem;
}

.icon {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
}

.row1_right {
  margin-left: 0.8rem;
  text-align: left;
}

.ml {
  margin-left: 50px;
}

.right_title {
  font-size: 2rem;
  font-weight: bold;
  color: #febc04;
  line-height: 2rem;
  background: linear-gradient(180deg, #e5be38 0%, #ff882e 100%);
  -webkit-background-clip: text;
  white-space: nowrap;
  -webkit-text-fill-color: transparent;
  font-family: "UnidreamLED", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.right_sub_title {
  font-size: 0.88rem;
  color: #d8d8d8;
  line-height: 1;
  white-space: nowrap;
  background: linear-gradient(180deg, #e5be38 0%, #ff882e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

._item_full_box {
  width: 100%;
  height: 14rem;
  margin-top: 35px;
}

._item_full_box_width {
  width: 100%;
}

.row3 {
  flex: 1;
  position: relative;
}

._item_row_box3 {
  width: 12rem;
  height: 12rem;
}
.right_item {
  margin-top: 300px;
  //   background-color: #02e1ff;
}
.row2 {
  //   background-color: #02e1ff;
}
._item_row_box2 {
  width: 12rem;
  //   background-color: #02e1ff;
  margin-right: 8px;
  margin-top: 20px;
  transform: translateX(0rem);
  border: 5px solid rgba(43, 161, 207, 0.2);
  //   box-shadow: rgba(22, 106, 131, 0.4);
}

.box2_item,
.box2_item1,
.box2_item2,
.box2_item3,
.box2_item4,
.box2_item5 {
  position: relative;
  width: 100%;
  height: 1.9rem;
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(60, 192, 224, 0.8);
  display: flex;
  align-items: center;
  padding-left: 1.5rem;
  border-bottom: 1px solid rgba(23, 205, 218, 0.2);
}

.box2_item::before,
.box2_item1::before,
.box2_item2::before,
.box2_item3::before,
.box2_item4::before,
.box2_item5::before {
  content: "";
  width: 0.8rem;
  height: 0.5rem;
  border: 0.06rem solid #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 0.5rem;
  transform: translateY(-50%);
}
.bg {
  height: 300px;
  margin-top: 50px;
  //   background-color: #02e1ff;
}
.box2_item::before {
  background: rgba(20, 117, 126, 0.58);
}

.box2_item1::before {
  background: rgba(255, 113, 94, 0.58);
}

.box2_item2::before {
  background: rgba(254, 217, 118, 0.64);
}

.box2_item3::before {
  background: rgba(234, 94, 230, 0.64);
}

.box2_item4::before {
  background: rgba(94, 225, 186, 0.58);
}

.box2_item5::before {
  background: rgba(113, 204, 78, 0.58);
}

.box2_item::after,
.box2_item1::after,
.box2_item2::after,
.box2_item3::after,
.box2_item4::after,
.box2_item5::after {
  content: attr(count);
  font-size: 1.2rem;
  font-weight: 600;
  color: #4fa4f8;
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
}

.box2_item:last-child {
  border-bottom: 1px solid rgba(255, 255, 255, 0);
}

.ring1 {
  //   background-color: #02e1ff;
  width: 200px;
  height: 200px;
  padding-top: 1.2rem;
  overflow: visible;
}

#ring {
  width: 100%;
  height: 100%;
}
.bar {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.bar_chart {
  width: 100%;
  height: 100%;
}
#bar {
  width: 100%;
  height: 100%;
}
.container-last-chart {
  margin-top: 8px;
}
.down {
  margin-top: -100px;
}
</style>
