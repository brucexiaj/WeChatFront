App({
    globalData: {
        userInfo: null,
        //apiUrl: 'http://local.konggeek.com:8080/purchase/api/',
        //apiUrl: 'http://apex.buyer007.com/api/',
        //apiUrl: 'http://47.98.164.133:8082/purchase/api',
        apiUrl: 'http://172.16.6.232:8080/purchase/api',
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
        companyNo:null
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
                if (that.globalData.userInfo) {
                    param = userInfo;
                    param.xcxCookieId = that.globalData.xcxCookieId;

                    param.encryptedData = res.encryptedData;
                    param.iv = res.iv;
                    if (that.globalData.sessionKey) {
                        param.sessionKey = that.globalData.sessionKey;
                    }
                } else {
                    param = { xcxCookieId: that.globalData.xcxCookieId };
                }
                wx.request({
                    url: that.globalData.apiUrl + '/wx/purchaseLogin/setUserInfo.htm',
                    data: param,
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                        that.globalData.buyerId = res.data.data.id;
                        that.globalData.powerCode = res.data.data.powerCode;
                        that.globalData.userInfo  = userInfo;
                    }
                })
                if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res);
                  }
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
