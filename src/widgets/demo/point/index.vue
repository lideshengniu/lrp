<template>
  <mars-dialog title="隐患点" right='10' top="60" width="300">
  <ul class="point">
    <li v-for="(item,i) in points" :key="i" class="point-card" :class="{'active-card':active === item.uuid}"  @click ='changePoints(i,item)'>
    <div><img class="icon"  :src="`img/points/${i+1}.png`"/> {{item.name}}</div>
    </li>
  </ul>
  
  </mars-dialog>
</template>
<script lang="ts" setup>
import { onUnmounted, reactive, ref, onMounted } from "vue"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import { useWidget } from "@mars/common/store/widget"
import * as mapWork from "./map"
let position 
const { activate, disable, isActivate, updateWidget } = useWidget()
useLifecycle(mapWork)
const points = ref<any[]>([])
const active = ref("")
onMounted(() => {
    const points = mapWork.getGraphics()
    console.log("point")
    console.log(points)
    initData(points)
})
function initData(e:any) {
    points.value = e.graphics.map((m:any) => {
        if (m.isAdded && m.show) {
            active.value = m.uuid
           
        }
         console.log("m")
            console.log(m)
        return {
            name: m.name,
            uuid: m.uuid,
            widget: m.options.widget
        }
    })
}
function changePoints(i:any, item:any) {
    mapWork.changePoints((active.value = i))
    console.log("item")
    console.log(item)
     activate(item.widget)
}
onUnmounted(() => {
  // 销毁操作
})
</script>
<style scoped lang="less">
.point{
      height: calc(100% - 40px);
}
.point-card {
  display: inline-block;
  width: 75px;
  list-style-type: none;
  margin-top: 10px;
  margin-left: 10px;
  float: left;
  text-align: center;
  cursor: pointer;
  font-size: 12px;
  color: #fff;
  &:hover {
    .active-card();
  }
  .icon {
    border: 1px solid #4db3ff78;
    width: 75px;
    height: 70px;
    padding: 1px;
  }
}

.active-card {
  color: #337fe5 !important;
  .icon {
    border-color: #a9aeb6;
  }
}
</style>
