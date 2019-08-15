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
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: requestUrl + 'Rubbish/SpecialList',
      data: {
        
      },
      success(res) {
        if (res.data.status == 0) {
          if (res.data.result.length>0){
            wx.hideLoading()
            that.setData({
              spec_list: res.data.result
            })
          }else{
            that.setData({
              is_show:true
            })
            wx.showToast({
              title: '没有更多数据',
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
  },
  bindNativeSpecial:function(e){
    wx.navigateTo({
      url: '../special_detail/special_detail?id=' + e.currentTarget.dataset.sid
    })
  },
  //跳转博客小程序
  changeJoeling() {
    wx.navigateToMiniProgram({
      appId: 'wxe1e103707cde65e5',
      path: 'pages/index/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return {
      title: '垃圾扔前分一分，绿色生活一百分，今天，你做到了吗？',
      path: '/pages/index/index',
      imageUrl: "/images/share.jpg"
    }
  }
})