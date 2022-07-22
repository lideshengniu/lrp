<template>
  <div :id="withKeyId" class="mars3d-container"></div>
</template>
<script setup lang="ts">
/**
 * 地图渲染组件
 * @copyright 火星科技 mars3d.cn
 * @author 火星吴彦祖 2022-02-19
 */
import { computed, onUnmounted, onMounted, h, ref, nextTick } from "vue"
import * as mars3d from "mars3d"
import { getQueryString } from "@mars/utils/mars-util"
import { getDefaultContextMenu } from "@mars/utils/getDefaultContextMenu"
import { $alert, $message } from "@mars/components/mars-ui/index"
import axios from "axios"
import { useWidget } from "@mars/common/store/widget"
import path from "path"
import { Turkey } from "@icon-park/svg"
import { callbackify } from "util"
import { graphicLayer } from "@mars/widgets/demo/point/map"
const Cesium = mars3d.Cesium
const a = {
  p: ""
}
const { activate, disable, isActivate, updateWidget } = useWidget()
const requests = axios.create({ timeout: 5000 })

const props = withDefaults(
  defineProps<{
    url: string
    mapKey?: string
    options?: any
  }>(),
  {
    url: "",
    mapKey: "default",
    options: () => ({})
  }
)
let roaddata
let road_test
// 用于存放地球组件实例
let map: mars3d.Map // 地图对象
let A
// 使用用户传入的 mapKey 拼接生成 withKeyId 作为当前显示容器的id
const withKeyId = computed(() => `mars3d-container-${props.mapKey}`)

onMounted(() => {
  // 获取配置

  mars3d.Util.fetchJson({ url: props.url }).then((data: any) => {
    initMars3d({
      // 合并配置项
      ...data.map3d,
      ...props.options
    })
  })
})

console.log(roaddata, "$$$$$$$$")
// onload事件将在地图渲染后触发
const emit = defineEmits(["onload"])
const initMars3d = (option: any) => {
  map = new mars3d.Map(withKeyId.value, option)
  // $$$$$$$$$$$$$$$$$$$
  // const bhtroad = map.getLayer(1001, "id")
  const c = map.getLayerById(100)
  console.log(c, "cccc")
  // 问题处
  const optionss = { pid: 99, id: 2022, name: "白鹤滩", show: false, type: "graphic" }
  const graphicLayer = new mars3d.layer.GraphicLayer(optionss)

  map.addLayer(graphicLayer)
  addDemoGraphic4(graphicLayer)
  function addDemoGraphic4(graphicLayer) {
    const graphicZP = new mars3d.graphic.RectangleEntity({
      positions: [
        [103.1828528375, 26.7822882483],
        [102.8464162955, 26.3648549463]
      ],
      style: {
        image: "baihetan.png",
        clampToGround: true
      }
      //   attr: { remark: "示例4" }
    })
    graphicLayer.addGraphic(graphicZP)
  }

  function addDemoGraphic2(graphicLayer) {
    const graphic = new mars3d.graphic.CircleEntity({
      position: [103.034716, 26.478833],
      style: {
        radius: 200,
        height: 200,
        clampToGround: Turkey,
        material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.CircleWave, {
          color: "#ffff00",
          count: 2,
          speed: 20
        }),
        label: {
          text: "我是原始的\n测试换行",
          font_size: 18,
          color: "#ffffff",
          pixelOffsetY: -10,
          distanceDisplayCondition: true,
          distanceDisplayCondition_far: 500000,
          distanceDisplayCondition_near: 0
        }
      },
      attr: { remark: "示例2" }
    })
    graphicLayer.addGraphic(graphic) // 还可以另外一种写法: graphic.addTo(graphicLayer)

    // graphic转geojson
  } // 这个是圆圈

  //  map.flyToPoint([103.085061, 26.5109])
  // 绑定当前项目的默认右键菜单
  map.bindContextMenu(getDefaultContextMenu(map))

  // 如果有xyz传参，进行定位
  const lat = getQueryString("lat")
  const lng = getQueryString("lng")
  if (lat && lng) {
    map.flyToPoint(new mars3d.LngLatPoint(lng, lat), { duration: 0 })
  }

  // 开场动画
  // map.openFlyAnimation();

  // 针对不同终端的优化配置
  if (mars3d.Util.isPCBroswer()) {
    map.zoomFactor = 2.0 // 鼠标滚轮放大的步长参数

    // IE浏览器优化
    if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 0) {
      map.viewer.targetFrameRate = 20 // 限制帧率
      map.scene.requestRenderMode = false // 取消实时渲染
    }
  } else {
    map.zoomFactor = 5.0 // 鼠标滚轮放大的步长参数

    // 移动设备上禁掉以下几个选项，可以相对更加流畅
    map.scene.requestRenderMode = false // 取消实时渲染
    map.scene.fog.enabled = false
    map.scene.skyAtmosphere.show = false
    map.scene.globe.showGroundAtmosphere = false
  }

  // //二三维切换不用动画
  if (map.viewer.sceneModePicker) {
    map.viewer.sceneModePicker.viewModel.duration = 0.0
  }

  // webgl渲染失败后，刷新页面
  map.on(mars3d.EventType.renderError, async () => {
    await $alert("程序内存消耗过大，请重启浏览器")
    window.location.reload()
  })

  // map构造完成后的一些处理
  const showEditor = (e: any) => {
    const graphic = e.graphic
    if (!graphic._conventStyleJson) {
      graphic.options.style = graphic.toJSON().style // 因为示例中的样式可能有复杂对象，需要转为单个json简单对象
      graphic._conventStyleJson = true // 只处理一次
    }

    if (!isActivate("graphic-editor")) {
      activate({
        name: "graphic-editor",
        data: { graphic: graphic }
      })
    } else {
      updateWidget("graphic-editor", {
        data: { graphic: graphic }
      })
    }
  }
  const bhtroad = map.getLayer(1001, "id")
  const eventTarget = new mars3d.BaseClass()
  eventTarget.on("graphicEditor-start", async (e: any) => {
    showEditor(e)
  })
  eventTarget.on("graphicEditor-update", async (e: any) => {
    showEditor(e)
  })
  eventTarget.on("graphicEditor-stop", async (e: any) => {
    setTimeout(() => {
      if (!bhtroad.isEditing) {
        disable("graphic-editor")
      }
    }, 100)
  })
  // nihao
  function bindLayerEvent() {
    bhtroad.on(mars3d.EventType.drawCreated, function (e) {
      eventTarget.fire("graphicEditor-start", e)
    })

    bhtroad.on(
      [mars3d.EventType.editStart, mars3d.EventType.editMovePoint, mars3d.EventType.editStyle, mars3d.EventType.editRemovePoint],
      function (e) {
        eventTarget.fire("graphicEditor-update", e)
      }
    )

    bhtroad.on([mars3d.EventType.editStop, mars3d.EventType.removeGraphic], function (e) {
      eventTarget.fire("graphicEditor-stop", e)
    })
  }
  bindLayerEvent()
  onMapLoad()

  emit("onload", map)
}

// map构造完成后的一些处理
function onMapLoad() {
  // Mars3D地图内部使用，如右键菜单弹窗
  // @ts-ignore
  window.globalAlert = $alert
  // @ts-ignore
  window.globalMsg = $message

  // 用于 config.json 中 西藏垭口 图层的详情按钮 演示
  // @ts-ignore
  window.showPopupDetails = (item: any) => {
    $alert(item.NAME)
  }

  // @2022 7.22
  // 添加右键沉降

  // 组件卸载之前销毁mars3d实例
  // 给road绑定编辑
  const bhtpoints = map.getLayer(1000, "id")
  bhtpoints.bindContextMenu([
    {
      text: "沉降量",
      show: true,
      callback: (e) => {
        const graphic = e.graphic
        console.log(graphic.attr)
        const html = `${graphic.attr.D_20220217}`
        alert(html)
      }
    }
  ])
  const bhtroad = map.getLayer(1001, "id")

  bhtroad.bindContextMenu([
    {
      text: "开始编辑对象",
      show: function (e) {
        const graphic = e.graphic
        if (!graphicLayer || !graphic.startEditing) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          bhtroad.startEditing(graphic)
        }
      }
    },
    {
      text: "停止编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          bhtroad.stopEditing(graphic)
        }
      }
    }
  ])
  console.log("#####", road_test)
  // 用于 config.json中配置的图层，绑定额外方法和参数
  const tiles3dLayer = map.getLayer(204012, "id") // 上海市区
  if (tiles3dLayer) {
    tiles3dLayer.options.onSetOpacity = function (opacity: number) {
      tiles3dLayer.style = {
        color: {
          conditions: [
            ["${floor} >= 200", "rgba(45, 0, 75," + 0.5 * opacity + ")"],
            ["${floor} >= 100", "rgba(170, 162, 204," + opacity + ")"],
            ["${floor} >= 50", "rgba(224, 226, 238," + opacity + ")"],
            ["${floor} >= 25", "rgba(252, 230, 200," + opacity + ")"],
            ["${floor} >= 10", "rgba(248, 176, 87," + opacity + ")"],
            ["${floor} >= 5", "rgba(198, 106, 11," + opacity + ")"],
            ["true", "rgba(127, 59, 8," + opacity + ")"]
          ]
        }
      }
    }
  }
}

onUnmounted(() => {
  if (map) {
    map.destroy()
    map = null
  }
  console.log("map销毁完成", map)
})
</script>

<style lang="less">
/**cesium 工具按钮栏*/
.cesium-viewer-toolbar {
  top: auto !important;
  bottom: 35px !important;
  left: 12px !important;
  right: auto !important;
}
.cesium-toolbar-button img {
  height: 100%;
}
.cesium-viewer-toolbar > .cesium-toolbar-button,
.cesium-navigationHelpButton-wrapper,
.cesium-viewer-geocoderContainer {
  margin-bottom: 5px;
  float: left;
  clear: both;
  text-align: center;
}
.cesium-button {
  background-color: @mars-bg-base;
  color: #e6e6e6;
  fill: #e6e6e6;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  line-height: 32px;
}
.cesium-button:hover {
  background: @mars-hover-btn-bg;
}

/**cesium 底图切换面板*/
.cesium-baseLayerPicker-dropDown {
  bottom: 0;
  left: 40px;
  max-height: 700px;
  margin-bottom: 5px;
  background-color: @mars-bg-base;
}

/**cesium 帮助面板*/
.cesium-navigation-help {
  top: auto;
  bottom: 0;
  left: 40px;
  transform-origin: left bottom;
  background: none;
  background-color: @mars-bg-base;
  .cesium-navigation-help-instructions {
    background: none;
  }
  .cesium-navigation-button {
    background: none;
  }
  .cesium-navigation-button-selected,
  .cesium-navigation-button-unselected:hover {
    background: @mars-select-bg;
  }
}

/**cesium 二维三维切换*/
.cesium-sceneModePicker-wrapper {
  width: auto;
}
.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-dropDown-icon {
  float: right;
  margin: 0 3px;
}

/**cesium POI查询输入框*/
.cesium-viewer-geocoderContainer .search-results {
  left: 0;
  right: 40px;
  width: auto;
  z-index: 9999;
}
.cesium-geocoder-searchButton {
  background-color: @mars-bg-base;
}
.cesium-viewer-geocoderContainer .cesium-geocoder-input {
  background-color: rgba(63, 72, 84, 0.7);
}
.cesium-viewer-geocoderContainer .cesium-geocoder-input:focus {
  background-color: rgba(63, 72, 84, 0.9);
}
.cesium-viewer-geocoderContainer .search-results {
  background-color: @mars-bg-base;
}

/**cesium info信息框*/
.cesium-infoBox {
  top: 50px;
  background-color: @mars-bg-base;
}
.cesium-infoBox-title {
  background-color: @mars-bg-base;
}

/**cesium 任务栏的FPS信息*/
.cesium-performanceDisplay-defaultContainer {
  top: auto;
  bottom: 35px;
  right: 50px;
}
.cesium-performanceDisplay-ms,
.cesium-performanceDisplay-fps {
  color: #fff;
}

/**cesium tileset调试信息面板*/
.cesium-viewer-cesiumInspectorContainer {
  top: 10px;
  left: 10px;
  right: auto;
}
.cesium-cesiumInspector {
  background-color: @mars-bg-base;
}

/**覆盖mars3d内部控件的颜色等样式*/
.mars3d-compass .mars3d-compass-outer {
  fill: @mars-bg-base;
}
.mars3d-contextmenu-ul,
.mars3d-sub-menu {
  background-color: @mars-bg-base;

  > li > a:hover,
  > li > a:focus,
  > li > .active {
    background-color: @mars-hover-btn-bg;
  }

  > .active > a,
  > .active > a:hover,
  > .active > a:focus {
    background-color: @mars-hover-btn-bg;
  }
}

/* Popup样式*/
.mars3d-popup-color {
  color: @mars-base-color;
}
.mars3d-popup-background {
  background: @mars-bg-base;
}
.mars3d-popup-content {
  margin: 15px;
}
.mars3d-template-content label {
  padding-right: 6px;
}
.mars3d-template-titile {
  border-bottom: 1px solid @mars-hover-btn-bg;
}
.mars3d-template-titile a {
  font-size: 16px;
}
.mars3d-tooltip {
  background: @mars-bg-base;
  border: 1px solid @mars-bg-base;
}

.mars3d-popup-btn-custom {
  padding: 3px 10px;
  border: 1px solid #209ffd;
  background: #209ffd1c;
}
</style>
