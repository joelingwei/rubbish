const requestUrl = require('../config').requestUrl
var QQMapWX = require('./qqmap-wx-jssdk.js');
var qqmapsdk;
//请求城市垃圾分类数据
//type:name 按名称查找 type:id 按id查找
const rubbishCity = function (cid, type, event) {
  if (type == 'name') {
    my.request({
      url: requestUrl + 'Rubbish/City',
      data: {
        name: cid
      },
      success(res) {
        if (res.data.status == 0) {
          if (res.data.result) {

            my.setStorageSync({
              key: 'city_fenlei',
              data: {
                list: res.data.result.rubbish_list,
              }
            });
            return event(res.data.result);
          } else {
            my.showToast({
              content: '网络异常',
              type: 'none',
              duration: 2000
            })
          }
        } else {
          my.showToast({
            content: '网络异常',
            type: 'none',
            duration: 2000
          })
        }
      }
    })
  } else {
    my.request({
      url: requestUrl + 'Rubbish/City',
      data: {
        id: cid
      },
      success(res) {
        if (res.data.status == 0) {
          if (res.data.result) {

            my.setStorageSync({
              key: 'city_fenlei',
              data: {
                list: res.data.result.rubbish_list,
              }
            });
            return event(res.data.result);
          } else {
            my.showToast({
              content: '网络异常',
              type: 'none',
              duration: 2000
            })
          }
        } else {
          my.showToast({
            content: '网络异常',
            type: 'none',
            duration: 2000
          })
        }
      }
    })
  }

}
//根据坐标获取位置信息
const getLocal = function (latitude, longitude, event) {
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
module.exports = {
  rubbishCity: rubbishCity,
  getLocal: getLocal
}
