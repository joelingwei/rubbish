const requestUrl = require('../../config').requestUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spec_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    my.showLoading({
      content: '加载中',
    })
    var id = options.id;
    var that = this;
    var cid = my.getStorageSync({ key: 'cid' });
    if (cid.data) {
      cid = cid.data['cid']
    } else {
      cid = cid.data
    }
    my.request({
      url: requestUrl + 'Rubbish/SpecialDetail',
      data: {
        id: id,
        city_id: cid
      },
      success(res) {
        if (res.data.status == 0) {
          my.setNavigationBar({
            title: res.data.result.name + '专题'
          });
          that.setData({
            spec_list: res.data.result.detail,
          })
          my.hideLoading()
        } else {
          my.showToast({
            content: '网络异常',
            type: 'none',
            duration: 2000
          })
          setTimeout(function () {
            my.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      }
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