App({
    globalData: {
        userInfo: null,
        //apiUrl: 'http://local.konggeek.com:8080/purchase/api/',
        //apiUrl: 'http://apex.buyer007.com/api/',
        //apiUrl: 'http://47.98.164.133:8082/api',
        //apiUrl: 'http://47.98.230.111:8082/api',
        //apiUrl: 'http://47.97.185.180:8082/purchase/api',
        //apiUrl: 'https://cg2.logthin.com/api',
        //apiUrl: 'http://172.16.6.232:8080/purchase/api',
        apiUrl: 'http://127.0.0.1:8080/purchase/api',
        xcxCookieId: null,
        powerCode:0,
        version:"1.0",
        refer:'',
        sessionKey:null,
        buyerId:null,
        pageSize:20,
        taskId:null,
        status:0,
        findStatus:0,
        calc:false,
        storage:false,
        appid:'wxdf84c61fbef8d933'
    },
    onLaunch: function (res) {
        let that = this;
        let parame = {};
        if (res.path) {
            parame.path = res.path;
        }
        if (!that.isOwnEmpty(res.query)) {
            parame.query = JSON.stringify(res.query);
            if (res.query.shareOpenId) {
                parame.shareOpenId = res.query.shareOpenId;
            }
        }
        if (res.scene) {
            parame.scene = res.scene;
        }
        setTimeout(function () {
            parame.ownerOpenId = that.globalData.xcxCookieId;
            parame.appid = that.globalData.appid;
            wx.request({
                url: that.globalData.apiUrl + '/wx/purchaseLogin/setWxAppLaunch.htm',
                data: parame,
                success: function (res) {
                    that.globalData.refer = res.data.data;
                }
            })
        }, 10000);
    },
    onShow: function (options) {
        console.log("app onShow")
    },
    onError: function (msg) {
        console.log(msg)
    },
    requestAuthenticatedUserInfo: function () {
        var that = this;
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              that.requestAndUpdateUserInfo();
            }
          }
        })
    },
    requestAndUpdateUserInfo: function () {
        var that = this;
        wx.getUserInfo({
              success: res => {
                let userInfo = res.userInfo;
                let param = null;
                if (userInfo) {
                    param = userInfo;
                    param.xcxCookieId = that.globalData.xcxCookieId;

                    param.encryptedData = res.encryptedData;
                    param.iv = res.iv;
                    param.appid = that.globalData.appid;
                    if (that.globalData.sessionKey) {
                        param.sessionKey = that.globalData.sessionKey;
                    }         
                } else {     
                    if (this.userInfoReadyCallback) {
                      this.userInfoReadyCallback(res);
                    }
                }
                wx.request({
                  url: that.globalData.apiUrl + '/wx/purchaseLogin/setUserInfo.htm',
                  data: param,
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    console.log("123123" + JOSN.stringify(res));
                    if (res.data.retCode == "0") {
                      that.globalData.buyerId = res.data.data.id;
                      that.globalData.powerCode = res.data.data.powerCode;
                      that.globalData.userInfo = userInfo;
                    } else {
                      wx.showToast({
                        title: res.data.errorMsg,
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                })
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res);
                }
            },
            complete:function(){
              console.log("565656");
              
            }
        })
    },
    isOwnEmpty: function (obj) {
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                return false;
            }
        }
        return true;
    }
})
