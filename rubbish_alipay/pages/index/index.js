const requestUrl = require('../../config').requestUrl
const recorderManager = my.getRecorderManager()
var utils = require('../../utils/util.js');
Page({
  data: {
    hot_list: '',
    is_show: false,
    detail: '',
    seah_name: '',
    hasRecord: false,
    keywords: '',
    rubbish_list: [{
      "name": "其他垃圾",
      "name_sx": "qtlj",
      "desc": "是指除可回收物、有害垃圾、厨余（餐厨）垃圾以外的其它生活废弃物。包括砖瓦陶瓷、普通一次性电池（碱性电池）、受污染的一次性餐盒、卫生间废纸等。"
    }, {
      "name": "餐厨垃圾",
      "name_sx": "cclj",
      "desc": "是指餐饮垃圾、厨余垃圾及废弃食用油脂和集贸市场有机垃圾等易腐蚀性垃圾，包括废弃的食品、蔬菜、瓜果皮核以及家庭产生的花草、落叶等。"
    }, {
      "name": "可回收物",
      "name_sx": "khsw",
      "desc": "是指适宜回收和资源化利用的生活垃圾，包括纸类、塑料、金属、玻璃、木料和织物。"
    },
    {
      "name": "有害垃圾",
      "name_sx": "yhlj",
      "desc": "是指对人体健康或者自然环境造成直接或潜在危害的生活垃圾，包括废电池、废弃药品、废杀虫剂、废水银产品等。"
    }
    ],
    name: "成都"
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //获取缓存中的城市id
    var cid = my.getStorageSync({ key: 'cid' });
    if (cid.data) {
      cid = cid.data['cid']
    } else {
      cid = cid.data
    }
    //如果城市id不存在则要发起定位授权请求
    if (!cid) {

      my.getSetting({
        success(res) {

          if (res.authSetting['location'] != undefined && res.authSetting['location'] != true) {

            my.confirm({
              title: '“垃圾分类引导指南”需要获取你的地理位置',
              content: '你的位置信息将用于垃圾分类城市区分',
              success: function (data) {
                if (data.cancel) {
                  my.showToast({
                    content: '拒绝授权',
                    type: 'none',
                    duration: 1000
                  })
                  //授权失败，默认成都
                  my.setStorageSync({
                    key: 'cid',
                    data: {
                      cid: '2',
                    }
                  });
                } else if (data.confirm) {
                  my.openSetting({
                    success: function (dataAu) {
                      if (dataAu.authSetting['location'] == true) {
                        my.showToast({
                          content: '授权成功',
                          type: 'success',
                          duration: 1000
                        })
                      } else {
                        my.showToast({
                          content: '授权失败',
                          type: 'none',
                          duration: 1000
                        })
                        //授权失败，默认成都
                        my.setStorageSync({
                          key: 'cid',
                          data: {
                            cid: '2',
                          }
                        });
                        utils.rubbishCity('2', 'id', function (e) {
                          that.setData({
                            name: e.name,
                            rubbish_list: e.rubbish_list
                          })
                        })
                      }
                    }
                  })
                }
              }
            })
          } else {
            //进行定位
            my.getLocation({
              success(res) {
                //定位成功后获取城市名并获取城市分类数据
                utils.getLocal(res.latitude, res.longitude, function (events) {
                  //获取城市数据
                  utils.rubbishCity(events.substring(0, events.length - 1), 'name', function (e) {
                    if (e.rubbish_list == false) {
                      var fenlei_hun = my.getStorageSync({ key: 'city_fenlei' })
                      if (fenlei_hun.data == false) {

                        my.setStorageSync({
                          key: 'city_fenlei',
                          data: {
                            list: that.data.rubbish_list,
                          }
                        });
                      }
                      my.showToast({
                        content: '当前城市【' + events.substring(0, events.length - 1) + '】暂未开放数据,敬请期待~',
                        type: 'none',
                        duration: 3000
                      })
                      my.setStorageSync({
                        key: 'cid',
                        data: {
                          cid: '2',
                        }
                      });
                    } else {
                      my.setStorageSync({
                        key: 'cid',
                        data: {
                          cid: e.id,
                        }
                      });
                      that.setData({
                        name: e.name,
                        rubbish_list: e.rubbish_list
                      })
                    }
                  })
                })
              },
              fail() {
                my.setStorageSync({
                  key: 'cid',
                  data: {
                    cid: '2',
                  }
                });
                utils.rubbishCity('2', 'id', function (e) {
                  that.setData({
                    name: e.name,
                    rubbish_list: e.rubbish_list
                  })
                })
              }
            })
          }
        }
      })
    } else {
      utils.rubbishCity(cid, 'id', function (e) {
        that.setData({
          name: e.name,
          rubbish_list: e.rubbish_list
        })
      })
    }
  },
  onLoad: function () {
    var that = this;
    //加载搜索热词
    my.request({
      url: requestUrl + 'Rubbish/hots',
      data: {

      },
      success(res) {
        if (res.data.status == 0) {
          that.setData({
            hot_list: res.data.result
          })
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
  //点击切换城市
  bindLocation: function () {
    this.setData({
      is_show: false,
      keywords: ''
    })
    my.navigateTo({
      url: '../location/location'
    })
  },
  //热词点击事件
  bindNameDeatail: function (e) {
    my.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.rid + '&se_name=' + e.currentTarget.dataset.se_name + '&seah_name=' + e.currentTarget.dataset.seah_name
    })
  },
  //跳转图谱页
  bindDownLoad: function () {
    this.setData({
      is_show: false,
      keywords: ''
    })
    my.navigateTo({
      url: '../download/download'
    })
  },
  //搜索框
  bindReplaceInput: function (e) {
    this.setData({
      is_show: false
    })
    var keywords = e.detail.value;
    var cids = my.getStorageSync({ key: 'cid' })
    if (keywords) {
      var that = this;
      my.request({
        url: requestUrl + 'Rubbish/search',
        data: {
          keywords: keywords,
          cid: cids.data['cid']
        },
        success(res) {
          if (res.data.status == 0) {
            that.setData({
              detail: ''
            })
            if (res.data.result.length > 0) {
              that.setData({
                is_show: true,
                detail: res.data.result,
                seah_name: keywords
              })
            } else {
              my.showToast({
                content: '如此聪明伶俐的我居然会词穷，我要喊我父亲大人送我去深造~',
                type: 'none',
                duration: 1000
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
      this.setData({
        is_show: false
      })
    }
  },
  //拍照识别
  bindImageSerach: function () {
    this.setData({
      is_show: false
    })
    var that = this;
    var cids = my.getStorageSync({ key: 'cid' })
    my.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        my.showLoading({
          content: '上传检索中',
        })
        const tempFilePaths = res.apFilePaths;
        my.uploadFile({
          url: requestUrl + 'Rubbish/images',
          fileType: 'image',
          filePath: tempFilePaths[0],
          fileName: 'file',
          formData: {
            cid: cids.data['cid']
          },
          success(event) {
            var datas = JSON.parse(event.data);
            if (datas.status == 0) {
              my.hideLoading()
              if (datas.result) {
                if (datas.result.length > 0) {
                  that.setData({
                    is_show: true,
                    detail: datas.result,
                    seah_name: ''
                  })
                } else {
                  my.showToast({
                    content: '如此聪明伶俐的我居然会词穷，我要喊我父亲大人送我去深造~',
                    type: 'none',
                    duration: 2000
                  })
                }
              } else {
                my.showToast({
                  content: '如此聪明伶俐的我居然会词穷，我要喊我父亲大人送我去深造~',
                  type: 'none',
                  duration: 2000
                })
              }
            } else {
              my.showToast({
                content: datas.msg,
                type: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  //语音识别
  startRecord() {
    this.setData({
      hasRecord: true,
      is_show: false
    })
    const options = {
      duration: 10000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'wav'
    }
    recorderManager.start(options);
    var that = this;
    recorderManager.onError((res) => {
      my.confirm({
        title: '你拒绝使用录音功能，语音识别功能将无法正常使用',
        content: '是否重新授权使用你的录音功能',
        success: function (data) {
          if (data.cancel) {
            that.setData({
              hasRecord: false
            })
            my.showToast({
              content: '拒绝授权',
              type: 'none',
              duration: 1000
            })
          } else if (data.confirm) {
            my.openSetting({
              success: function (dataAu) {
                if (dataAu.authSetting["record"] != true) {
                  that.setData({
                    hasRecord: false
                  })
                  my.showToast({
                    content: '授权失败',
                    type: 'none',
                    duration: 1000
                  })
                } else {
                  recorderManager.start(options);
                }
              }
            })
          }
        }
      })
    })
  },
  //停止录音
  stopRecord() {
    this.setData({
      hasRecord: false
    })
    var that = this
    var cids = my.getStorageSync({ key: 'cid' })
    recorderManager.stop()
    recorderManager.onStop((res) => {
      const {
        tempFilePath
      } = res;
      my.showLoading({
        content: '语音检索中',
      })
      //上传录制的音频
      my.uploadFile({
        url: requestUrl + 'Rubbish/Voice',
        fileType: 'audio',
        filePath: tempFilePath,
        fileName: 'voice',
        formData: {
          cid:cids.data['cid']
        },
        success: function (event) {
          var datas = JSON.parse(event.data);
          if (datas.status == 0) {
            my.hideLoading()
            if (datas.result.list.length > 0) {
              that.setData({
                is_show: true,
                detail: datas.result.list,
                seah_name: datas.result.voice,
                keywords: datas.result.voice
              })
            } else {
              my.showToast({
                content: '如此聪明伶俐的我居然会词穷，我要喊我父亲大人送我去深造~',
                type: 'none',
                duration: 2000
              })
            }
          } else {
            my.showToast({
              content: datas.msg,
              type: 'none',
              duration: 2000
            })
          }
        }
      })
    })
  },
  //分类跳转
  changeDetail: function (e) {
    var rid = e.currentTarget.dataset.rid;
    my.navigateTo({
      url: '../detail/detail?id=' + rid
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