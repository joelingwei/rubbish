const requestUrl = require('../../config').requestUrl
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasHidden: true,
    detail: [],
    count: 10,
    index: '01',
    scope: 0,
    is_have: true,
    share_title: '垃圾分类知多少？快来测一测就知道了~',
    fenlei_detail: [{
        id: '1',
        name: '其他垃圾'
      },
      {
        id: '2',
        name: '餐厨垃圾'
      },
      {
        id: '3',
        name: '可回收物'
      },
      {
        id: '4',
        name: '有害垃圾'
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      
  },
  onShow: function() {
    if (!wx.getStorageSync('city_fenlei')){
      app.userInfoReadyCallback = rubbish_list => {
        this.downLoadQuestion();
      }
    }else{
      this.downLoadQuestion();
    }    
  },
  //加载题目数据
  downLoadQuestion: function() {
    var fenleis = [];
    for (var i = 0; i < this.data.fenlei_detail.length; i++) {
      this.data.fenlei_detail[i].name = wx.getStorageSync('city_fenlei')[i].name
    }
    fenleis = this.data.fenlei_detail
    this.setData({
      fenlei_detail: fenleis
    })
    if (this.data.index == 1) {
      wx.showLoading({
        title: '加载中',
      })
      var that = this
      //加载题目
      wx.request({
        url: requestUrl + 'Rubbish/ExaminationList',
        data: {},
        success(res) {
          if (res.data.status == 0) {
            if (res.data.result.length > 0) {
              var new_detail = [];
              for (var i = 0; i < res.data.result.length; i++) {
                new_detail[i] = {
                  "id": res.data.result[i].id,
                  "is_show": res.data.result[i].is_show,
                  "is_type": '',
                  "name": res.data.result[i].name,
                  "type": res.data.result[i].type
                }
              }
              that.setData({
                detail: new_detail,
                count: res.data.result.length,
                index: '01',
                scope: 0
              })
              wx.hideLoading()
            } else {
              wx.showToast({
                title: '网络异常',
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
    }
  },
  bindAgain: function() {
    this.setData({
      is_have: true,
      index: '01'
    })
    this.downLoadQuestion()
  },
  bindExam: function(e) {
    var type = e.currentTarget.dataset.type
    var id = e.currentTarget.dataset.id;
    var is_type_name = e.currentTarget.dataset.type_name
    var scopes = this.data.scope;
    //判断答案是否正确 答对加分 并将答案写入
    if (type == this.data.detail[id - 1].type) {
      this.setData({
        scope: Number(scopes) + Number(10),
        share_title: '我在垃圾分类随堂小测试中获得了' + (Number(scopes) + Number(10))+'分，你也来试试吧~'
      })
    }
    var detail_list = [];
    var is_haves = true;
    //当是最后一题时，出结果页
    var number = '';
    if (id == this.data.detail.length) {
      this.data.detail[id - 1].is_show = false
      this.data.detail[id - 1].is_type = type
      detail_list = this.data.detail
      is_haves = false
      number = this.data.detail.length
    } else {
      //跳下一题
      this.data.detail[id - 1].is_show = false
      this.data.detail[id - 1].is_type = type
      this.data.detail[id].is_show = true
      detail_list = this.data.detail
      number = Number(id) + Number(1);
      if (number < 10) {
        number = '0' + number;
      }
      is_haves = true
    }
    if (id == this.data.detail.length) {
      for (var j = 0; j < detail_list.length; j++) {
        detail_list[j].type_name = this.data.fenlei_detail[detail_list[j].type - 1].name
        detail_list[j].is_type_name = this.data.fenlei_detail[detail_list[j].is_type - 1].name
        number = 11
      }
    }
    this.setData({
      detail: detail_list,
      index: number,
      is_have: is_haves
    })

  },
  bindImage: function() {
    var that = this;
    const ctx = wx.createCanvasContext('share');
    //背景图
    var bgImgPath = '../../images/share_bg.jpg';
    //分数
    var fenshu = this.data.scope + '分';
    //姓名
    var nickname = '就不告诉你';
    //答案
    var detail_list = this.data.detail
    //写入背景图
    ctx.drawImage(bgImgPath, 0, 0, 375, 568);
    //写入小程序码
    ctx.drawImage('../../images/erweima.jpg', 30, 460, 100, 100);
    //定义姓名和分数部分字体大小和颜色及导入数据
    ctx.setFontSize(23);
    ctx.setFillStyle('red');
    ctx.fillText(fenshu, 220, 123);
    ctx.setFillStyle('#000');
    ctx.fillText(nickname, 220, 85);
    //题目部分
    ctx.setFontSize(13);
    var d_y = 185;
    for (var i = 0; i < detail_list.length; i++) {
      //写入题目
      ctx.fillText(detail_list[i].name, 10, d_y);
      //写入我的答案
      if (detail_list[i].type == detail_list[i].is_type) {
        ctx.setFillStyle('green');
      } else {
        ctx.setFillStyle('red');
      }
      ctx.fillText(detail_list[i].is_type_name, 230, d_y);
      ctx.setFillStyle('#000');
      //写入正确答案
      ctx.fillText(detail_list[i].type_name, 305, d_y);
      d_y = Number(d_y) + Number(27)
    }
    wx.showToast({
      title: '成绩单生成中...',
      icon: 'loading',
      duration: 1000
    });
    ctx.draw(false, function() {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 750,
        height: 1136,
        destWidth: 750,
        destHeight: 1136,
        fileType: 'jpg',
        quality: '1',
        canvasId: 'share',
        success: function(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(event) {
              wx.showToast({
                title: '保存成功',
              });
            }
          })
        }
      })
    });
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
      title: this.data.share_title,
      path: '/pages/examination/examination',
      imageUrl: '/images/examp_share.jpg'
    }
  }
})