const requestUrl = require('../../config').requestUrl
const recorderManager = qq.getRecorderManager()
var utils = require('../../utils/util.js');
Page({
  data: {
	audios: {
      'img': 'voice',
      'name': '语音查询'
    }, //录音图标
    hot_list: '',
    is_show: false,
    detail: '',
    seah_name: '',
    is_clock: false,
    keywords: '',
    width: '320',
    bar_height: '26',
    bto_height: '58',
    height: '32',
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
  onShow: function() {
    var that = this;
    //获取缓存中的城市id
    var cid = qq.getStorageSync('cid');
    //如果城市id不存在则要发起定位授权请求
    if (!cid) {
      qq.getSetting({
        success(res) {
          if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
            qq.showModal({
              title: '“垃圾分类引导指南”需要获取你的地理位置',
              content: '你的位置信息将用于垃圾分类城市区分',
              success: function(data) {
                if (data.cancel) {
                  qq.showToast({
                    title: '拒绝授权',
                    icon: 'none',
                    duration: 1000
                  })
                  //授权失败，默认成都
                  qq.setStorageSync('cid', '2')
                } else if (data.confirm) {
                  qq.openSetting({
                    success: function(dataAu) {
                      if (dataAu.authSetting["scope.userLocation"] == true) {
                        qq.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                      } else {
                        qq.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 1000
                        })
                        //授权失败，默认成都
                        qq.setStorageSync('cid', '2')
                        utils.rubbishCity('2', 'id', function(e) {
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
            qq.getLocation({
              type: 'wgs84',
              success(res) {
                //定位成功后获取城市名并获取城市分类数据
                utils.getLocal(res.latitude, res.longitude, function(events) {
                  //获取城市数据
                  utils.rubbishCity(events.substring(0, events.length - 1), 'name', function(e) {
                    if (e.rubbish_list == false) {
                      if (qq.getStorageSync('city_fenlei') == false){
                        qq.setStorageSync('city_fenlei', that.data.rubbish_list)
                      }
                      qq.showToast({
                        title: '当前城市【' + events.substring(0, events.length - 1) + '】暂未开放数据,敬请期待~',
                        icon: 'none',
                        duration: 3000
                      })
                      qq.setStorageSync('cid', '2')
                    } else {
                      qq.setStorageSync('cid', e.id)
                      that.setData({
                        name: e.name,
                        rubbish_list: e.rubbish_list
                      })
                    }
                  })
                })
              },
              fail() {
                qq.setStorageSync('cid', '2')
                utils.rubbishCity('2', 'id', function(e) {
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
      utils.rubbishCity(cid, 'id', function(e) {
        that.setData({
          name: e.name,
          rubbish_list: e.rubbish_list
        })
      })
    }
  },
  onLoad: function() {
    var that = this;
    qq.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.statusBarHeight
        })
      },
    })
    //加载搜索热词
    qq.request({
      url: requestUrl + 'Rubbish/hots',
      data: {

      },
      success(res) {
        if (res.data.status == 0) {
          that.setData({
            hot_list: res.data.result
          })
        } else {
          qq.showToast({
            title: '网络异常',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
	//对停止录音进行监控
    recorderManager.onStop((res) => {
      //此时先判断是否需要发送录音
      if (that.data.is_clock == true) {
        //对录音时长进行判断，少于1s的不进行发送，并做出提示
        if (res.duration < 1000) {
          qq.showToast({
            title: '录音时间太短，请长按录音',
            icon: 'none',
            duration: 1000
          })
        } else {
          const {
            tempFilePath
          } = res;
          qq.showLoading({
            title: '语音检索中',
          })
          //上传录制的音频
          qq.uploadFile({
            url: requestUrl + 'Rubbish/Voice',
            filePath: tempFilePath,
            name: 'voice',
            formData: {
              cid: qq.getStorageSync('cid')
            },
            success: function (event) {
              var datas = JSON.parse(event.data);
              if (datas.status == 0) {
                qq.hideLoading()
                if (datas.result.list.length > 0) {
                  that.setData({
                    is_show: true,
                    detail: datas.result.list,
                    seah_name: datas.result.voice,
                    keywords: datas.result.voice
                  })
                } else {
                  qq.showToast({
                    title: '如此聪明伶俐的我居然会词穷，我要喊我父亲大人送我去深造~',
                    icon: 'none',
                    duration: 2000
                  })
                }
              } else {
                qq.showToast({
                  title: datas.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      } else {
        qq.showToast({
          title: '录音已取消',
          icon: 'none',
          duration: 2000
        })
      }
    })
    //监控录音异常情况
    recorderManager.onError((res) => {
      if (res) {
        qq.showModal({
          title: '你拒绝使用录音功能，语音识别功能将无法正常使用',
          content: '是否重新授权使用你的录音功能',
          success: function (data) {
            if (data.cancel) {
              qq.showToast({
                title: '拒绝授权',
                icon: 'none',
                duration: 1000
              })
            } else if (data.confirm) {
              qq.openSetting({
                success: function (dataAu) {
                  if (dataAu.authSetting["scope.record"] != true) {
                    qq.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 1000
                    })
                  } else {
                    qq.showToast({
                      title: '授权成功，请长按录音',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  //点击切换城市
  bindLocation: function() {
    this.setData({
      is_show: false,
      keywords: ''
    })
    qq.navigateTo({
      url: '../location/location'
    })
  },
  //热词点击事件
  bindNameDeatail: function(e) {
    qq.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.rid + '&se_name=' + e.currentTarget.dataset.se_name + '&seah_name=' + e.currentTarget.dataset.seah_name
    })
  },
  //跳转图谱页
  bindDownLoad: function() {
    this.setData({
      is_show: false,
      keywords: ''
    })
    qq.navigateTo({
      url: '../download/download'
    })
  },
  //搜索框
  bindReplaceInput: function(e) {
    this.setData({
      is_show: false
    })
    var keywords = e.detail.value;
    if (keywords) {
      var that = this;
      qq.request({
        url: requestUrl + 'Rubbish/search',
        data: {
          keywords: keywords,
          cid: qq.getStorageSync('cid')
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
              qq.showToast({
                title: '如此聪明伶俐的我居然会词穷，我要喊我父亲大人送我去深造~',
                icon: 'none',
                duration: 1000
              })
            }
          } else {
            qq.showToast({
              title: '网络异常',
              icon: 'none',
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
  bindImageSerach: function() {
    this.setData({
      is_show: false,
	  keywords: ''
    })
    var that = this;
    qq.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        qq.showLoading({
          title: '上传检索中',
        })
        const tempFilePaths = res.tempFilePaths;
        qq.uploadFile({
          url: requestUrl + 'Rubbish/images',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            cid: qq.getStorageSync('cid')
          },
          success(event) {

            var datas = JSON.parse(event.data);
            if (datas.status == 0) {
              qq.hideLoading()
              if (datas.result){
                if (datas.result.length > 0) {
                  that.setData({
                    is_show: true,
                    detail: datas.result,
                    seah_name: ''
                  })
                } else {
                  qq.showToast({
                    title: '如此聪明伶俐的我居然会词穷，我要喊我父亲大人送我去深造~',
                    icon: 'none',
                    duration: 2000
                  })
                }
              }else{
                qq.showToast({
                  title: '如此聪明伶俐的我居然会词穷，我要喊我父亲大人送我去深造~',
                  icon: 'none',
                  duration: 2000
                })
              }
            } else {
              qq.showToast({
                title: datas.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  startRecord(){
    qq.showToast({
      title: '请长按录音',
      icon: 'none',
      duration: 1000
    })
  },
  //语音识别 开始录音
  handleRecordStart(e) {
    this.setData({
      is_clock: true, //长按时应设置为true，为可发送状态
      startPoint: e.touches[0], //记录触摸点的坐标信息
      audios: {
        'img': 'stop',
        'name': '录音中'
      },
      is_show: false
    })
    const options = {
      duration: 10000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'mp3'
    }
	//开启录音
    recorderManager.start(options);
	
	qq.showLoading({
  title: '正在录音，往下滑动取消发送',
})
  },
  //停止录音
  handleRecordStop() {
    qq.hideToast(); //结束录音、隐藏Toast提示框
    this.setData({
      audios: {
        'img': 'voice',
        'name': '语音查询'
      }
    })
    recorderManager.stop() //结束录音
  },
  //滑动取消发送
handleTouchMove: function(e) {
  //计算距离，当滑动的垂直距离大于25时，则取消发送语音
  if (Math.abs(e.touches[e.touches.length - 1].clientY - this.data.startPoint.clientY) > 35) {
    
	qq.showLoading({
  title: '松开手指,取消发送',
})
    this.setData({
      is_clock: false //设置为不发送语音
    })
  } else {
	qq.showLoading({
  title: '正在录音，往下滑动取消发送',
})
    this.setData({
      is_clock: true
    })
  }
},
  //分类跳转
  changeDetail: function(e) {
    var rid = e.currentTarget.dataset.rid;
    qq.navigateTo({
      url: '../detail/detail?id=' + rid
    })
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