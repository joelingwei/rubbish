const requestUrl = require('../config').requestUrl
var QQMapWX = require('./qqmap-wx-jssdk.js');
var qqmapsdk;
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//请求城市垃圾分类数据
//type:name 按名称查找 type:id 按id查找
const rubbishCity = function (cid,type,event) {
  if (type=='name'){
    wx.request({
      url: requestUrl + 'Rubbish/City',
      data: {
        name: cid
      },
      success(res) {
        if (res.data.status == 0) {
          if (res.data.result) {
            wx.setStorageSync('city_fenlei', res.data.result.rubbish_list)
            return event(res.data.result);
          } else {
            wx.showToast({
              title: '网络异常',
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }else{
    wx.request({
      url: requestUrl + 'Rubbish/City',
      data: {
        id: cid
      },
      success(res) {
        if (res.data.status == 0) {
          if (res.data.result) {
            wx.setStorageSync('city_fenlei', res.data.result.rubbish_list)
            return event(res.data.result);
          } else {
            wx.showToast({
              title: '网络异常',
              icon: 'none',
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }
  
}
//根据坐标获取位置信息
const getLocal = function (latitude, longitude,event){
  qqmapsdk = new QQMapWX({
    key: 'yours key'
  });
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: latitude,
      longitude: longitude
    },
    success: function (res) {
      let city = res.result.ad_info.city
      return event(city)
    }
  })
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
module.exports = {
  formatTime: formatTime,
  rubbishCity : rubbishCity,
  getLocal: getLocal
}
