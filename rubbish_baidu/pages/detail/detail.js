const requestUrl = require('../../config').requestUrl;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    searec_name: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var img_tet;
    var rid = options.id;
    var se_name = options.se_name;
    var seah_name = options.seah_name;
    var that = this;
    swan.request({
      url: requestUrl + 'Rubbish/Detail',
      data: {
        id: rid,
        cid: swan.getStorageSync('cid')
      },
      success(res) {
        if (res.data.status == 0) {
          if (!se_name) {
            se_name = '';
          }
          that.setData({
            content: res.data.result,
            searec_name: se_name
          });
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
    if (se_name) {
      swan.request({
        url: requestUrl + 'Rubbish/searchName',
        data: {
          name: se_name,
          rid: rid,
          sea_name: seah_name
        },
        success(res) {}
      });
    }
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