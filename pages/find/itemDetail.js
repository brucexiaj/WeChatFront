var app = getApp();
Page({
	data:{
		item:'',
		skuInfo:'',
		category:'',
		detailCollapse:true,
		paramsCollapse:true,
		skuCollapse:true
	},
	onLoad:function(option) {
		let id = option.id;
		let that = this;
		wx.request({
	      url: app.globalData.apiUrl + "/find/detail.htm",
	      data: {id:id},
	      success: function (res) {
	      	wx.hideNavigationBarLoading();
	      	if (res.data.retCode == '0') {
	      		that.setData({
	      			item:res.data.data.item,
	      			skuInfo:res.data.data.itemSkuList,
	      			category:res.data.data.category,
	      			mainPicHeight:wx.getSystemInfoSync().windowWidth,
	      			mainPicIndex:0
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
	},
	mytouchstart: function (e) {  
		let that = this;  
		that.setData({  
			touch_start: e.timeStamp  
		})  
	},  
	mytouchend: function (e) {  
		let that = this;  
		that.setData({  
			touch_end: e.timeStamp  
		})  
	}
})