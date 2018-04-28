var app = getApp();
Page({
	data:{
		userInfo:null,
		hasUserInfo:false,
		taskList:[],
		taskingNumber:0,
		taskDoneNumber:0,
		findAuditNumber:0,
		pageNum:1,
		canLoad:true,
		todayInCount:0,
		todayAllCount:0,
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
	search:function(){
		wx.navigateTo({
      		url: "../index/search"
      	})	
	},
	viewMore:function(e){
		let taskingNumber = e.currentTarget.dataset.tasking;
		let taskDoneNumber = e.currentTarget.dataset.done;
		wx.navigateTo({
      		url: "../index/taskList?taskingNumber="+taskingNumber+"&taskDoneNumber="+taskDoneNumber
      	})	
	},
	jump:function(e){
		let status = e.currentTarget.dataset.status;
		app.globalData.status = status;
		wx.switchTab({
	    	url:'/pages/task/list'
	    })
	},
	jumpFind:function(e){
		let status = e.currentTarget.dataset.status;
		app.globalData.findStatus = status;
		wx.switchTab({
	    	url:'/pages/find/list'
	    })
	},
	detail:function(e){
		let id = e.currentTarget.dataset.id;
		let status = e.currentTarget.dataset.status;
		app.globalData.taskId = id;
		app.globalData.status = status;
		wx.switchTab({
	    	url:'/pages/task/list'
	    })
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
		var that = this;
	    wx.login({
	      success: res => {
	        console.log("request code:" + res.code)
	        wx.request({
	          url: app.globalData.apiUrl + "/wx/purchaseLogin/getXcxCookieId.htm",
	          data: {
	            version: app.globalData.version,
	            code: res.code
	          },
	          success: function (res) {
                var xcxCookieId = res.data.data.openid;
                wx.setStorageSync('xcxCookieId', xcxCookieId);
                app.globalData.xcxCookieId = xcxCookieId;
                app.globalData.sessionKey = res.data.data.session_key;
	            app.requestAndUpdateUserInfo();
	          }
	        })
	        wx.request({
	            url: app.globalData.apiUrl + '/wx/purchase/main.htm',
	            method: 'POST',
	            header: { 'content-type': 'application/x-www-form-urlencoded' },
	            success: function (res) {
	            	wx.hideNavigationBarLoading();
	                that.setData({
	                    taskingNumber: res.data.data.taskingNumber,
	                    taskDoneNumber: res.data.data.taskDoneNumber,
	                    findAuditNumber: res.data.data.findAuditNumber,
	                    taskList:res.data.data.taskDailyList,
	                    todayInCount:res.data.data.todayInCount,
						todayAllCount:res.data.data.todayAllCount,
	                    powerCode:app.globalData.powerCode,
	                    pageNum:1,
	                    canLoad:true
	                });
	            }
	        });
	        wx.stopPullDownRefresh();
	      },
	      fail: function (res) { console.log(res)
	        wx.showToast({
	          title: '登录小程序失败',
	        });
	      }
	    })
	}
})
var ajaxLoad = function(pageNum,that){
	if(!that.data.canLoad){
		wx.hideNavigationBarLoading();
		return;
	}
	wx.request({
      url: app.globalData.apiUrl + "/wx/purchase/taskList.htm",
      data: {pageNum:pageNum},
      success: function (res) {
      	wx.hideNavigationBarLoading();
      	if (res.data.retCode == '0') {
      		if(res.data.data.taskDailyList ==null || res.data.data.taskDailyList ==undefined ||res.data.data.taskDailyList.length==0){
      			wx.showToast({
			        title: "没有更多数据",
			        icon: 'none',
			    	duration: 2000
			    });
			    that.setData({
		        	canLoad:false
		        })
			    return;
      		}
      		let taskDailyList = that.data.taskList.concat(res.data.data.taskDailyList);
	        that.setData({
	        	taskList:taskDailyList,
	        	pageNum:pageNum+1
	        })
	    }else {
            wx.showToast({
		        title: res.data.errorMsg,
		        icon: 'none',
		    	duration: 2000
		    })
        }
      },
	  fail: function () {
	  	wx.hideNavigationBarLoading();
		util.errorCallback();
	  } 
    })   
}