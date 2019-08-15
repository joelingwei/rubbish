var utils = require('/utils/util.js');
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      //console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    //获取缓存中的城市id
    var cid = wx.getStorageSync('cid');
    var rubbish_list = [{
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
    ]
    //如果城市id不存在则要发起定位授权请求
    var that = this
    if (!cid) {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
            wx.showModal({
              title: '“垃圾分类引导指南”需要获取你的地理位置',
              content: '你的位置信息将用于垃圾分类城市区分',
              success: function (data) {
                if (data.cancel) {
                  wx.showToast({
                    title: '拒绝授权',
                    icon: 'none',
                    duration: 1000
                  })
                  //授权失败，默认成都
                  wx.setStorageSync('cid', '2')
                } else if (data.confirm) {
                  wx.openSetting({
                    success: function (dataAu) {
                      if (dataAu.authSetting["scope.userLocation"] == true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 1000
                        })
                        //授权失败，默认成都
                        wx.setStorageSync('cid', '2')
                        utils.rubbishCity('2', 'id', function (e) {
                          that.globalData.rubbish_list = e.rubbish_list
                          if (that.userInfoReadyCallback) {
                            that.userInfoReadyCallback(e.rubbish_list)
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          } else {
            //进行定位
            wx.getLocation({
              type: 'wgs84',
              success(res) {
                //定位成功后获取城市名并获取城市分类数据
                utils.getLocal(res.latitude, res.longitude, function (events) {
                  //获取城市数据
                  utils.rubbishCity(events.substring(0, events.length - 1), 'name', function (e) {
                    if (e.rubbish_list == false) {
                      if (wx.getStorageSync('city_fenlei') == false) {
                        wx.setStorageSync('city_fenlei', rubbish_list)
                        that.globalData.rubbish_list = rubbish_list
                        if (that.userInfoReadyCallback) {
                          that.userInfoReadyCallback(rubbish_list)
                        }
                      }
                      wx.showToast({
                        title: '当前城市【' + events.substring(0, events.length - 1) + '】暂未开放数据,敬请期待~',
                        icon: 'none',
                        duration: 3000
                      })
                      wx.setStorageSync('cid', '2')
                    } else {
                      wx.setStorageSync('cid', e.id)
                      that.globalData.rubbish_list = e.rubbish_list
                      if (that.userInfoReadyCallback) {
                        that.userInfoReadyCallback(e.rubbish_list)
                      }
                    }
                  })
                })
                
              },
              fail() {
                wx.setStorageSync('cid', '2')
                utils.rubbishCity('2', 'id', function (e) {
                  that.globalData.rubbish_list = e.rubbish_list
                  if (that.userInfoReadyCallback) {
                    that.userInfoReadyCallback(e.rubbish_list)
                  }
                })
              }
            })
          }
        }
      })
    } else {
      utils.rubbishCity(cid, 'id', function (e) {
        that.globalData.rubbish_list = e.rubbish_list
        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback(e.rubbish_list)
        }
      })
    }
    
  },
  globalData: {
    userInfo: null,
    rubbish_list: null
  }
})