<template>
  <div class="container">
    <div class="left">
      <ul class="left-ul">
        <li>
          <mars-icon width="35" icon="home-two"></mars-icon>
          <div class="icon-bottom"></div>
        </li>
        <li @click="showif()">
          <mars-icon width="35" icon="search"></mars-icon>
          <div class="icon-bottom"></div>
        </li>
        <li @click="showpoint()">
          <mars-icon width="35" icon="radar"></mars-icon>
          <div class="icon-bottom"></div>
        </li>
      </ul>
    </div>
    <div class="middle">
      <div class="middle-inner">白 鹤 滩 库 滑 坡 预 警 监 测 平 台</div>
      <div class="middle-line"></div>
    </div>
    <div class="right">
      <div class="time">时间：{{ map.dataTime }}</div>
      <div v-bind="map.dataTime"></div>
      <div class="right-icon">
        <mars-icon width="35" icon="sun-one"></mars-icon>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
//  import marsIcon from "@/components/mars-icon/index.vue"
import { useWidgetStore, useWidget } from "@mars/common/store/widget"
import { ref, onMounted, onUnmounted, Ref } from "vue"
import * as map from "./map"
import { useStore } from "vuex"
import { key } from "@mars/common/store/test"
onUnmounted(() => {
  disableAll(true)
})

let trueif
trueif = true
const showif = () => {
  trueif = !trueif
  console.log("trueif")
  console.log(trueif)
  if (trueif) {
    activate("query-poi")
  } else {
    disable("query-poi")
  }
}

let showpoints
showpoints = true
const showpoint = () => {
  showpoints = !showpoints
  console.log("trueif")
  console.log(trueif)
  if (showpoints) {
    activate("toolbar")
  } else {
    disable("toolbar")
  }
}

const store = useStore(key)
const { activate, disableAll, disable } = useWidget()
// activate("line")
console.log(store)
let timer
const widgetStore = useWidgetStore()
// const a = widgetStore.state.testModule.really

onMounted(() => {
  timer = setInterval(() => {
    map.getNowTime()
  }, 1000)
})
onUnmounted(() => {
  // 清理定时器要处理 timer 的类型
  clearInterval(Number(timer))
})
// time =
</script>
<style scoped lang="less">
.container {
  position: absolute;
  width: 100%;
  height: 80px;
  // background-color:rgb(173, 209, 198);
  z-index: 100;

  border-left: 1px solid #008aff70;
  border-right: 1px solid #008aff70;
  background: linear-gradient(to top, @mars-content-color, @mars-content-color) left bottom no-repeat,
    linear-gradient(to bottom, @mars-content-color, @mars-content-color) left bottom no-repeat,
    linear-gradient(to left, @mars-content-color, @mars-content-color) right bottom no-repeat,
    linear-gradient(to left, @mars-content-color, @mars-content-color) right bottom no-repeat;
  background-size: 1px 10px, 10px 1px, 1px 10px, 10px 1px;
  background-color: @mars-primary-color-self;

  div {
    float: left;
  }
}
.left {
  width: 35%;

  height: 80px;
  color: @mars-primary-color;
  opacity: 1;
  z-index: 1000;
  border-right: none;
  border-bottom: 4px solid #57bec270;
  box-shadow: 0px 0px 7px 5px skyblue;
  background-color: @mars-primary-color-self;
  //   background-color: @mars-primary-color;
  .left-ul {
    margin-left: 70px;
  }
  .left-ul > li {
    position: relative;
    float: left;
    height: 60px;
    width: 75px;
    // color: @mars-base-color;
    padding-top: 10px;

    // background-color: green;
    margin-left: 50px;
    margin-right: 50px;
    margin-top: 5px;
    text-align: center;
    vertical-align: middle;
    // line-height: 60px;
    border: 10px;
    // border-bottom-color: green;
    &:hover {
      // background-color: rgb(141, 241, 241);
      // border-bottom: 10px;
      // border-bottom:rgb(108, 178, 199) 5px solid;
      box-shadow: 500px rgba(69, 128, 184, 0.3);
      background-image: repeating-linear-gradient(rgba(55, 170, 190, 0.1), rgba(55, 170, 190, 0.8));
      .icon-bottom {
        width: 85px;
        //  border: solid 3px rgb(10, 202, 236);
        height: 2px;
        background-color: rgba(135, 206, 235, 1);
        position: absolute;
        top: 60px;
        left: -5px;
        box-shadow: 0px 0px 7px 3px skyblue, 0px 0px 7px 3px rgb(0 251 255);
        border-radius: 40px / 70px;
        border-top: none;
      }
    }
  }
}

.middle {
  margin-left: 0px;
  border-left: none;
  width: 30%;
  height: 95px;
  border-bottom: 4px solid #3e999c70;

  z-index: 10;
  //   -webkit-clip-path: polygon(0 0.5%, 99.5% 0, 99.5% 85%, 90% 99.5%, 10% 100%, 0.5% 85%);
  //   clip-path: polygon(0 0, 100% 0, 100% 85%, 90% 100%, 10% 100%, 0 85%);

  background-color: @mars-primary-color-self;
  //   background-color: @mars-primary-color;
  box-shadow: 0px 4px 7px 2px skyblue;
  //   background-color: green;

  .middle-inner {
    width: 600px;
    margin-top: 15px;
    height: 70px;
    font-size: 25px;
    line-height: 75px;
    text-align: center;
    font-family: "Courier New", Courier, monospace;
    //   background-color: green;}
  }
  .middle-line {
    width: 450px;
    height: 3px;
    // background-color: red;
    margin-left: 75px;
    margin-top: -10px;

    background-image: linear-gradient(to right, rgba(55, 170, 190, 0.1), rgba(116, 177, 187, 0.8), rgba(55, 170, 190, 0.1));
    box-shadow: 0px 0px 7px 1px skyblue;
  }
}
.right {
  div {
    float: left;
  }
  height: 80px;
  width: 35%;

  background-color: @mars-primary-color-self;
  //   background-color: @mars-primary-color;
  box-shadow: 0px 4px 7px 2px skyblue;
  //   background-color: green;
  .time {
    font-size: 20px;
    line-height: 80px;
    height: 80px;
    // background-color: green;
    margin-left: 100px;
  }
  .right-icon {
    // background-color: green;
    width: 100px;
    margin-top: 18px;
    margin-left: 100px;
  }
}
</style>
