import { ref, onMounted, onUnmounted } from "vue"
import emitter from "@mars/utils/mitt"
import { useWidgetStore, useWidget } from "@mars/common/store/widget"
const { activate, isActivate, disable } = useWidget()
export const dataTime = ref("")
export const day = ref("")

let shows
export function getNowTime() {
  // 时间戳
  const Dates = new Date()
  // 年份
  const Year = Dates.getFullYear()
  // 星期
  const data: number = Dates.getDay()
  // 月份下标是0-11
  const Months = Dates.getMonth() + 1 < 10 ? "0" + (Dates.getMonth() + 1) : Dates.getMonth() + 1
  // 具体的天数
  const Day = Dates.getDate() < 10 ? "0" + Dates.getDate() : Dates.getDate()
  // 小时
  const Hours = Dates.getHours() < 10 ? "0" + Dates.getHours() : Dates.getHours()
  // 分钟
  const Minutes = Dates.getMinutes() < 10 ? "0" + Dates.getMinutes() : Dates.getMinutes()
  // 秒
  const Seconds = Dates.getSeconds() < 10 ? "0" + Dates.getSeconds() : Dates.getSeconds()
  dataTime.value = `${Hours}:${Minutes}:${Seconds} ${Year}.${Months}.${Day}`
  day.value = `${data + 2}`

  // 数字转化为汉字（switch写法）
  switch (day.value as any) {
    case "1":
      day.value = "星期1"
      break
    case "2":
      day.value = "星期2"
      break
    case "3":
      day.value = "星期3"
      break
    case "4":
      day.value = "星期4"
      break
    case "5":
      day.value = "星期5"
      break
    case "6":
      day.value = "星期6"
      break
    case "7":
      day.value = "星期7"
      break
  }

  // 数字转化为汉字（优化写法）
  const arr = ["星期1", "星期2", "星期3", "星期4", "星期5", "星期6", "星期7"]
  const arr1 = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"]
  for (const i in arr) {
    if (arr[i] === day.value) {
      day.value = arr1[i]
    }
  }
  return dataTime.value
}
