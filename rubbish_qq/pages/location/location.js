const requestUrl = require('../../config').requestUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
      city_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cid = qq.getStorageSync('cid');
    if (!cid){
      cid = 2
    }
    var that=this;
    qq.request({
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
            qq.showToast({
              title: '网络异常',
              icon: 'none',
              duration: 2000
            })
            setTimeout(function () {
              qq.navigateTo({
                url: '../index/index'
              })
            }, 1000)
          }
        } else {
          qq.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            qq.navigateTo({
              url: '../index/index'
            })
          }, 1000)
        }
      },
      fail(){
        qq.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function(){
          qq.navigateTo({
            url: '../index/index'
          })
        },1000)
      }
    })
  },
  bindNativeCity:function(e){
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
    qq.setStorageSync('cid', cid)
  },
  //跳转博客小程序
  changeJoeling() {
    qq.navigateToMiniProgram({
      appId: '1109607179',
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
  //分享
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