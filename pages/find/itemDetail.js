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
	      			category:res.data.data.category
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
	collapse:function(e){
		let type = e.currentTarget.dataset.type;
		let that = this;
		switch(type){
			case "detail":that.setData({detailCollapse:!that.data.detailCollapse});break;
			case "params":that.setData({paramsCollapse:!that.data.paramsCollapse});break;
			case "sku":that.setData({skuCollapse:!that.data.skuCollapse});break;
		}
	}
})