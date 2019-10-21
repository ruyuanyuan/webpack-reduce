import '@/css/test.scss'
import '@/css/test.css'

import {testTreeShake} from './test'
import provinceData from './china-province-city'

testTreeShake()
addEvent(window, 'load', inital)

function addEvent (ele, event, fun) {
  if (!ele || !event || !fun) {
    return
  }
  ele.addEventListener(event, fun)
}

function inital () {
  const rules = {
    PHONE: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/, // 手机号正则
    EMAIL: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/, // 邮箱正则
    SPECIAL: /^(?=.*?[0-9])(?=.*?[_\-@&=])[a-z0-9_\-@&=]+$/, // 至少包含一个数字或一个特殊字符的正则
    CHINESE: /^[\u4e00-\u9fa5]+$/, // 中文正则
    LETTER: /[\W]|^[\u4E00-\u9FA5]/g, // 字母和中文正则
  }

  // 页面打开时获取验证码
  getCode()

  // 获取单个节点
  function getNode (idName) {
    if (idName === undefined || !idName) {
      return
    }
    return document.querySelector(idName)
  }

  // 获取多个类名相同的节点
  function getMoreNode (className) {
    if (className === undefined || !className) {
      return
    }
    return document.querySelectorAll(className)
  }

  // 获取当前节点的一下个兄弟节点
  function getNextNode (node) {
    if (node === undefined || !node) {
      return
    }
    return node.nextElementSibling
  }

  // 获取单选值
  let communicateCategory = 0 // 沟通类型
  // 动态添加类名来实现模拟单选框
  getMoreNode('.check')[1].onclick = function () {
    this.classList.add('checked')
    getMoreNode('.check')[0].classList.remove('checked')
    communicateCategory = 0
  }
  getMoreNode('.check')[0].onclick = function () {
    this.classList.add('checked')
    getMoreNode('.check')[1].classList.remove('checked')
    communicateCategory = 1
  }

  // 省下拉菜单
  let provinceCode = '' // 省code值
  let cityList = [] // 市数据列表
  // 点击‘请选择’显示/隐藏下拉菜单
  getMoreNode('.dropdown-btn')[0].onclick = function () {
    const nextNode = getNextNode(this) // 当前节点的一下个兄弟节点:菜单节点
    // 通过判断是否有类名'open'来控制下拉菜单显示/隐藏
    if (nextNode.classList.contains('open')) {
      nextNode.classList.remove('open')
      return
    }
    nextNode.classList.add('open')
    // 省菜单打开时关闭市菜单
    const theNode = getMoreNode('.dropdown-btn')[1]
    const theNextNode = getNextNode(theNode)
    theNextNode.classList.remove('open')

    // 展示省数据列表
    let html = ''
    for (let item = 0; item < provinceData.length; item++) {
      html += `<li><a href="javascript:;" class="the-province">${provinceData[item].name}</a></li>`
    }
    getNode('.province-list').innerHTML = html
    selectProvince(nextNode)
  }
  // 选取省
  function selectProvince (node) {
    const allProvince = getMoreNode('.the-province') // 获取所有省的节点数组
    for (let res = 0; res < allProvince.length; res++) {
      // 遍历添加点击事件
      allProvince[res].onclick = function () {
        const selected = this.innerHTML // 选中的省
        const valueProvince = getMoreNode('.select-value')[0] // 省选中后的value框节点
        valueProvince.innerHTML = selected
        // 获取省code和市的数据列表
        for (let ber = 0; ber < provinceData.length; ber++) {
          if (provinceData[ber].name === selected) {
            provinceCode = provinceData[ber].code
            cityList = provinceData[ber].cityList
          }
        }
        // 选中后关闭下拉菜单
        node.classList.remove('open')
      }
    }
  }

  // 市下拉菜单
  let cityCode = ''
  // 点击‘请选择’显示/隐藏下拉菜单
  getMoreNode('.dropdown-btn')[1].onclick = function () {
    const nextNode = getNextNode(this) // 当前节点的一下个兄弟节点:菜单节点
    // 通过判断是否有类名'open'来控制下拉菜单显示/隐藏
    if (nextNode.classList.contains('open')) {
      nextNode.classList.remove('open')
      return
    }
    nextNode.classList.add('open')
    // 市菜单打开时关闭省菜单
    const theNode = getMoreNode('.dropdown-btn')[0]
    const theNextNode = getNextNode(theNode)
    theNextNode.classList.remove('open')
    // 展示市数据列表
    if (!cityList.length) {
      return
    }
    let html = ''
    for (let item = 0; item < cityList.length; item++) {
      html += `<li><a href="javascript:;" class="the-city">${cityList[item].name}</a></li>`
    }
    getNode('.city-list').innerHTML = html
    selectCity(nextNode)
  }
  // 选取市
  function selectCity (node) {
    const allCity = getMoreNode('.the-city') // 获取所有市的节点数组
    for (let res = 0; res < allCity.length; res++) {
      // 遍历添加点击事件
      allCity[res].onclick = function () {
        const selected = this.innerHTML // 选中的省
        const valueCity = getMoreNode('.select-value')[1] // 市选中后的value框节点
        valueCity.innerHTML = selected
        // 获取省code和市的数据列表
        for (let ber = 0; ber < cityList.length; ber++) {
          if (cityList[ber].name === selected) {
            cityCode = cityList[ber].code
          }
        }
        // 选中后关闭下拉菜单
        node.classList.remove('open')
      }
    }
  }

  // 正则验证
  function blurTest (idName, rule) {
    if (idName === undefined || !idName || rule === undefined || !rule) {
      return
    }
    const theNode = getNode(idName) // 获取当前节点input
    const value = theNode.value // 获取当前节点的value值
    const nextNode = getNextNode(theNode) // 获取当前节点的下一个兄弟节点info
    if (value.trim() === '' || !rule.test(value)) {
      // 验证有误时标红
      theNode.style.borderColor = 'red'
      nextNode.style.color = 'red'
      return
    }
    // 验证通过后再置灰
    theNode.style.borderColor = '#CCC'
    nextNode.style.color = 'rgb(51, 51, 51)'
  }

  // 失焦事件验证
  function blur (idName, rule) {
    if (idName === undefined || !idName || rule === undefined || !rule) {
      return
    }
    getNode(idName).onblur = function () {
      blurTest(idName, rule)
    }
  }

  // 姓名失焦验证
  blur('#name')

  // 电话失焦验证
  blur('#phone', rules.PHONE)

  // 邮箱失焦验证
  blur('#email', rules.EMAIL)

  // 学校/单位失焦验证
  blur('#school')

  // 部门失焦验证
  blur('#department')

  // 获取验证码
  function getCode () {
    ajax(
      'GET',
      'https://mp.minecraft.education.jdcloud.com/e/oap/v2/kaptcha/image'
    )
  }

  // 验证验证码
  // function testCode () {}

  // 提交
  getNode('.btn-mine').onclick = function () {}

  // 请求接口
  function ajax (type, url) {
    var xhr = new XMLHttpRequest()
    xhr.open(type, url, true)
    xhr.send()
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          return xhr.responseText
        }
      }
    }
  }
}
