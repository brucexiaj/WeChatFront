//app.js
App({
    globalData: {
        userInfo: null,
        apiUrl: 'http://local.konggeek.com:8080/',
        //apiUrl: 'https://cg.logthin.com',
        xcxCookieId: null,
        powerCode:0
    },
    onLaunch: function (res) {
        let that = this;
        that.checkLogin();
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
                url: that.globalData.apiUrl + '/api/wx/purchaseLogin/setWxAppLaunch',
                data: parame,
                success: function (res) {
                    that.globalData.refer = res.data.data;
                }
            })
        }, 10000);
    },

    checkLogin: function () {
        var that = this;
        wx.checkSession({
            success: function () {
                var xcxCookieId = wx.getStorageSync('xcxCookieId');
                if (!xcxCookieId) {
                    that.toLogin();
                } else {
                    that.globalData.xcxCookieId = xcxCookieId;
                    that.setUserInfo();
                }
            },
            fail: function () {
                that.toLogin();
            }
        });
    },
    toLogin: function () {
        var that = this;
        wx.login({
            success: function (res) {
                var code = res.code;
                if (code) {
                    wx.request({
                        url: that.globalData.apiUrl + '/api/wx/purchaseLogin/getXcxCookieId',
                        data: { code: code },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            var xcxCookieId = res.data.data.openid;
                            wx.setStorageSync('xcxCookieId', xcxCookieId);
                            that.globalData.xcxCookieId = xcxCookieId;

                            that.globalData.sessionKey = res.data.data.session_key;
                            that.setUserInfo();
                        }
                    })
                } else {
                    console.log('获取用户登录态失败：' + res.errMsg);
                }
            }
        })
    },
    setUserInfo: function () {
        var that = this;
        wx.getUserInfo({
            withCredentials: true,
            lang: 'zh_CN',
            success: function (res) {
                that.globalData.userInfo = res.userInfo;
                that.globalData.buyerName = res.userInfo.nickName;
            },
            complete: function (res) {
                if (that.globalData.xcxCookieId) {
                    let param = null;
                    if (that.globalData.userInfo) {
                        param = that.globalData.userInfo;
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
                        url: that.globalData.apiUrl + '/api/wx/purchaseLogin/setUserInfo',
                        data: param,
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success(res) {
                            that.globalData.buyerId = res.data.data.id;
                            that.globalData.powerCode = res.data.data.powerCode;
                        }
                    });
                }
            },
            fail:function(res){
                console.log(res);
            }
        });
    },
    getXcxCookieId: function () {
        return this.globalData.xcxCookieId;
    },
    getUserInfo: function () {
        return this.globalData.userInfo;
    },
    isOwnEmpty: function (obj) {
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                return false;
            }
        }
        return true;
    },
    showToast: function (text, o, count) {
        var _this = o;
        count = parseInt(count) ? parseInt(count) : 2000;
        _this.setData({
            toastText: text,
            isShowToast: true,
        });
        setTimeout(function () {
            _this.setData({ isShowToast: false });
        },
            count
        );
    }
})
