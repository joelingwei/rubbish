const requestUrl = require('../../config').requestUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    searec_name:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var img_tet;
    var rid = options.id;
    var se_name = options.se_name;
    var seah_name = options.seah_name;
    var that = this;
    var cid = my.getStorageSync({ key: 'cid' });
    if (cid.data) {
      cid = cid.data['cid']
    } else {
      cid = cid.data
    }
    my.request({
      url: requestUrl + 'Rubbish/Detail',
      data: {
        id: rid,
        cid:cid
      },
      success(res) {
        if (res.data.status == 0) {
          if (!se_name){
            se_name = '';
          }
          that.setData({
            content: res.data.result,
            searec_name: se_name
          })
        } else {
          my.showToast({
            content: res.data.msg,
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
    if (se_name) {
      my.request({
        url: requestUrl + 'Rubbish/searchName',
        data: {
          name: se_name,
          rid: rid,
          sea_name: seah_name
        },
        success(res) {
        }
      })
    }
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