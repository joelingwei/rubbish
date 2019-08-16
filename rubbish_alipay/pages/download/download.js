const imgUrl = require('../../config').imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageurl: imgUrl +'/Public/uploads/rubbish'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindImage: function (event) {
    var imagesUrls = event.currentTarget.dataset.imgsurl;
    var that = this
    my.getSetting({
      success(res) {
        if (!res.authSetting['album']) {
          my.openSetting({
            success: function (data) {
              my.downloadFile({
                //需要下载的图片地址
                url: imagesUrls,
                success({ apFilePath }) {
                  // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                  if (apFilePath) {
                    my.saveImage({
                      url: apFilePath,
                      success: function (res) {
                        my.showToast({
                          content: '保存成功',
                        });
                        that.setData({
                          excode: false
                        })
                      },
                      fail: function (res) {
                        my.showToast({
                          content: '保存失败',
                        });
                      }
                    });
                  }
                }
              });
            },
            fail: function (data) {
              console.log("openSetting: fail");
            }
          });
        } else {
          my.downloadFile({
            //需要下载的图片地址
            url: imagesUrls,
            success({ apFilePath }) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (apFilePath) {
                my.saveImage({
                  url: apFilePath,
                  success: function (res) {
                    my.showToast({
                      content: '保存成功',
                    });
                    that.setData({
                      excode: false
                    })
                  },
                  fail: function (res) {
                    my.showToast({
                      content: '保存失败',
                    });
                  }
                });
              }
            }
          });
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