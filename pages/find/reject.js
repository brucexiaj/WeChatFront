var app = getApp();
Page({
	data: {
		item:null,
		skuList:[],
		lt:'<',
		reason:''
	},
	onLoad:function(e){
		let id = e.itemId;
		let tempItem = JSON.parse(e.itemJsonStr);
		let that = this;
		wx.request({
	      url: app.globalData.apiUrl + "/find/detail.htm",
	      data: {id:id},
	      success: function (res) {
	      	if (res.data.retCode == '0') {
	      		let item = res.data.data.item;
	      		item.skuPic = item.pictureArr[0];
	      		item.costPrice = tempItem.costPrice;
				item.day = tempItem.day;
				item.hours = tempItem.hours;
				item.minutes = tempItem.minutes;
	      		that.setData({
	      			item:item,
	      			skuList:res.data.data.itemSkuList,
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
			util.errorCallback();
		  } 
	    }) 		
	},
	back:function(){
		app.globalData.findStatus = 0;
		wx.switchTab({
			url:'/pages/find/list'
	    })
	},
	rejectConfirm:function(){
		let that = this;
		wx.showModal({
			title: '提示',
		    content: '是否拒绝该商品',
		    success: function(res) {
			    if (res.confirm) {
					wx.request({
				      url: app.globalData.apiUrl + "/find/audit.htm",
				      data: {id:that.data.item.id,status:-1,buyerId:app.globalData.buyerId, reason:that.data.reason,appid: app.globalData.appid},
				      success: function (res) {
				      	wx.hideNavigationBarLoading();
				      	if (res.data.retCode == '0') {
				      		wx.showToast({
						        title: "拒绝成功",
						        icon: 'none',
						    	duration: 2000
						    });
						    app.globalData.findStatus = -1;
							wx.switchTab({
								url:'/pages/find/list'
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
			}
		})
		
	}
})
