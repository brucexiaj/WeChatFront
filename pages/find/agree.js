var app = getApp();
Page({
	data: {
		item:null,
		skuList:[],
		lt:'<',
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
				let itemSkuList = res.data.data.itemSkuList;
				for(var i = 0;i < itemSkuList.length;i++) {
					itemSkuList[i].limit = itemSkuList[i].purchasePrice;
				}
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
	amount:function(e){
		let skuList = this.data.skuList;
		let index = e.currentTarget.dataset.index;
		skuList[index].amount = e.detail.value;
		this.setData({
			skuList:skuList
		})
	},
	focusPurchasePirce:function(e){
		//console.log("focusPurchasePirce");
		let skuList = this.data.skuList;
		let index = e.currentTarget.dataset.index;
		// for(var att in skuList[0]) {
		// 	console.log(att+":"+skuList[0][att]);
		// }
		//console.log("e.detail.value:"+e.detail.value);
		//console.log("skuList[index].purchasePrice:"+skuList[index].limit);
		if(e.detail.value == skuList[index].limit) {
			skuList[index].limit = null; 
		}		
		this.setData({
			skuList:skuList
		})
	},
	limit:function(e){
		//console.log("limit");
		let skuList = this.data.skuList;
		let index = e.currentTarget.dataset.index;
		skuList[index].limit = e.detail.value;
		// for(var att in skuList[index]) {
		// 	console.log(att+":"+skuList[index][att]);
		// }
		//console.log("limit==>e.detail.value:"+e.detail.value);
		this.setData({
			skuList:skuList
		})
	},
	agreeConfirm:function(e){
		let skuIdArr= '';
		let skuAmountArr= '';
		let skuLimitArr= '';
		let skuCodeArr= '';
		let skuUpcArr= '';
		let skuList = this.data.skuList;
		for(let i in skuList){
			if(skuList[i].amount=='' || skuList[i].amount==undefined || skuList[i].limit=='' || skuList[i].limit==undefined){
				wx.showToast({
			        title: "请补全信息",
			        icon: 'none',
			    	duration: 2000
			    });
				return;
			}
			skuIdArr = skuIdArr+skuList[i].id+",";
			skuAmountArr = skuAmountArr+skuList[i].amount+",";
			skuLimitArr = skuLimitArr+skuList[i].limit+",";
			skuUpcArr = skuUpcArr+skuList[i].upc+",";
			skuCodeArr = skuCodeArr+skuList[i].skuCode+",";
		}
		skuIdArr = skuIdArr.substring(0,skuIdArr.length-1);
		skuAmountArr = skuAmountArr.substring(0,skuAmountArr.length-1);
		skuLimitArr = skuLimitArr.substring(0,skuLimitArr.length-1);
		skuUpcArr = skuUpcArr.substring(0,skuUpcArr.length-1);
		skuCodeArr = skuCodeArr.substring(0,skuCodeArr.length-1);
		this.setData({
			skuIdArr:skuIdArr,
			skuAmountArr:skuAmountArr,
			skuUpcArr:skuUpcArr,
			skuCodeArr:skuCodeArr,
			skuLimitArr:skuLimitArr
		})
		let that = this;
		wx.showModal({
			title: '提示',
		    content: '是否生成采购任务单',
		    success: function(res) {
			    if (res.confirm) {
					audit(that);
				}
			}
		})
	}
})
let audit = function(that){
	wx.request({
      url: app.globalData.apiUrl + "/find/audit.htm",
      data: {id:that.data.item.id,status:1,buyerId:app.globalData.buyerId,skuId:that.data.skuIdArr,skuCode:that.data.skuCodeArr,skuUpc:that.data.skuUpcArr, skuAmount:that.data.skuAmountArr, skuLimit:that.data.skuLimitArr,companyNo: app.globalData.companyNo },
      success: function (res) {
      	wx.hideNavigationBarLoading();
      	if (res.data.retCode == '0') {
      		wx.showToast({
		        title: "生成采购任务成功",
		        icon: 'none',
		    	duration: 2000
		    });
		    app.globalData.storage = false;
		    app.globalData.calc = false;
		    app.globalData.status = 0;
		    wx.switchTab({
		    	url:'/pages/task/list'
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
