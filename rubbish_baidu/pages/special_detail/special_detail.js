const requestUrl = require('../../config').requestUrl;
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
    swan.showLoading({
      title: '加载中'
    });
    var id = options.id;
    var that = this;
    swan.request({
      url: requestUrl + 'Rubbish/SpecialDetail',
      data: {
        id: id,
        city_id: swan.getStorageSync('cid')
      },
      success(res) {
        if (res.data.status == 0) {
          swan.setNavigationBarTitle({
            title: res.data.result.name + '专题'
          });
          that.setData({
            spec_list: res.data.result.detail
          });
          swan.hideLoading();
        } else {
          swan.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          });
          setTimeout(function () {
            swan.navigateBack({
              delta: 1
            });
          }, 1000);
        }
      }
    });
  },
  //跳转博客小程序
  changeJoeling() {
    swan.navigateToSmartProgram({
      appId: 'wxe1e103707cde65e5',
      path: 'pages/index/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    });
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
    };
  }
});