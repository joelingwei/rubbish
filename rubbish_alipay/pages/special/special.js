const requestUrl = require('../../config').requestUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
      spec_list:[],
      is_show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    my.showLoading({
      content: '加载中',
    })
    my.request({
      url: requestUrl + 'Rubbish/SpecialList',
      data: {
        
      },
      success(res) {
        if (res.data.status == 0) {
          if (res.data.result.length>0){
            my.hideLoading()
            that.setData({
              spec_list: res.data.result
            })
          }else{
            that.setData({
              is_show:true
            })
            my.showToast({
              content: '没有更多数据',
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
  },
  bindNativeSpecial:function(e){
    my.navigateTo({
      url: '../special_detail/special_detail?id=' + e.currentTarget.dataset.sid
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