const requestUrl = require('../../config').requestUrl
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var cid = my.getStorageSync({ key: 'cid' });
    if (cid.data) {
      cid = cid.data['cid']
    } else {
      cid = cid.data
    }
    if (!cid) {
      cid = 2
    }
    var that = this;
    my.request({
      url: requestUrl + 'Rubbish/CityList',
      data: {

      },
      success(res) {
        if (res.data.status == 0) {
          if (res.data.result) {
            var newcityList = [];
            for (var i = 0; i < res.data.result.length; i++) {
              if (cid == res.data.result[i].id) {
                newcityList[i] = {
                  "name": res.data.result[i].name,
                  "id": res.data.result[i].id,
                  "is_show": true
                };
              } else {
                newcityList[i] = {
                  "name": res.data.result[i].name,
                  "id": res.data.result[i].id,
                  "is_show": false
                };
              }
            }
            that.setData({
              city_list: newcityList
            })
          } else {
            my.showToast({
              content: '网络异常',
              type: 'none',
              duration: 2000
            })
            setTimeout(function () {
              my.navigateTo({
                url: '../index/index'
              })
            }, 1000)
          }
        } else {
          my.showToast({
            content: '网络异常',
            type: 'none',
            duration: 2000
          })
          setTimeout(function () {
            my.navigateTo({
              url: '../index/index'
            })
          }, 1000)
        }
      },
      fail() {
        my.showToast({
          content: '网络异常',
          type: 'none',
          duration: 2000
        })
        setTimeout(function () {
          my.navigateTo({
            url: '../index/index'
          })
        }, 1000)
      }
    })
  },
  bindNativeCity: function (e) {
    const cid = e.currentTarget.dataset.cid
    var newcityList = [];
    for (var i = 0; i < this.data.city_list.length; i++) {
      if (cid == this.data.city_list[i].id) {
        newcityList[i] = {
          "name": this.data.city_list[i].name,
          "id": this.data.city_list[i].id,
          "is_show": true
        };
      } else {
        newcityList[i] = {
          "name": this.data.city_list[i].name,
          "id": this.data.city_list[i].id,
          "is_show": false
        };
      }
    }
    this.setData({
      city_list: newcityList
    });
    my.setStorageSync({
      key: 'cid',
      data: {
        cid: cid,
      }
    });
    utils.rubbishCity(cid, 'id', function (e) {

    })
  },
 //分享
  onShareAppMessage(res) {
    // 返回自定义分享信息
    return {
      title: '垃圾扔前分一分，绿色生活一百分，今天，你做到了吗？',
      path: '/pages/index/index',
      imageUrl: '/images/share.jpg',
      bgImgUrl: '/images/share.jpg'
    };
  }
})