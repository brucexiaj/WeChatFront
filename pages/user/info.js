var app = getApp();
Page({
	data:{
		userInfo:null,
		hasUserInfo:false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')  
	},
	onPullDownRefresh: function(){
        let that = this;
        that.onShow();
    },
    onReachBottom:function(){
		let that = this;
		wx.showNavigationBarLoading();
		ajaxLoad(that.data.pageNum,that);
	},
	onShow:function(){
		console.log("app onShow");
		if (app.globalData.userInfo) {  
			this.setData({  
				userInfo: app.globalData.userInfo,  
				hasUserInfo: true  
			})  
	    }  else if (this.data.canIUse){  
		      app.userInfoReadyCallback = res => {  
		        this.setData({  
		          userInfo: res.userInfo,  
		          hasUserInfo: true  
		        })  
		      }  
	    }
	},
	onLoad:function(){
		this.setData({
			userInfo:app.globalData.userInfo
		})
	}
})