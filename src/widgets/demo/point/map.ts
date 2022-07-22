import * as mars3d from "mars3d"
export let map: mars3d.Map
const Cesium = mars3d.Cesium
export let graphicLayer
export const eventTarget = new mars3d.BaseClass()

export function onMounted(mapInstance: mars3d.Map): void {
  map = mapInstance

  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
  console.log("graphicLayer")
  console.log(graphicLayer.getGraphics())
  bindLayerPopup()
}
/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function addDemoGraphic2(graphicLayer) {
  const graphic = new mars3d.graphic.CircleEntity({
    name: "隐患点1",
    icon: "./imgs/1.png",
    position: [103.034716, 26.478833],
    style: {
      radius: 500,
      height: 200,
      clampToGround: true,
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.CircleWave, {
        color: "#ffff00",
        count: 2,
        speed: 10
      }),
      label: {
        // text: "我是原始的\n测试换行",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -10,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    show: false,
    attr: { remark: "示例2" }
  })
  graphicLayer.addGraphic(graphic)

  // graphicLayer.addGraphic(graphic) // 还可以另外一种graphic.addTo(graphicLayer)

  // graphic转geojson
}
export function addDemoGraphic3(graphicLayer) {
  const graphic = new mars3d.graphic.CircleEntity({
    widget: "line",
    name: "隐患点2",
    icon: "./imgs/1.png",
    position: [103.034716, 26.498833],
    style: {
      radius: 500,
      height: 200,
      clampToGround: true,
      material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.CircleWave, {
        color: "#ffff00",
        count: 2,
        speed: 20
      }),
      label: {
        // text: "我是原始的\n测试换行",
        font_size: 18,
        color: "#ffffff",
        pixelOffsetY: -10,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 500000,
        distanceDisplayCondition_near: 0
      }
    },
    attr: { remark: "示例2" },
    show: false
  })
  graphicLayer.addGraphic(graphic)

  // graphicLayer.addGraphic(graphic) // 还可以另外一种graphic.addTo(graphicLayer)

  // graphic转geojson
}

export function changePoints(index: number) {
  const p = graphicLayer.graphics[index]
  map.flyToPoint(p.options.position)
  p.show = true
  console.log("p")
  console.log(p.options)
  return p

  // console.log(graphicLayer)
  //  return p.position
}
export function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })
  })
}
export function getGraphics() {
  return {
    graphics: graphicLayer.getGraphics()
  }
}
