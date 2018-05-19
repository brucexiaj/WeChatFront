var app = getApp();
var bmap = require('../../utils/bmapwx.min.js');
Page({
	data:{
		char_lt:'<',
		taskDaily:null,
		taskReceipt:null,
		taskDailyDetail:null,
		itemSku:null,
		item:null,
		totalPrice:0,
		upc:'',
		upcPlaceholder:'扫码不成功请手动输入核对',
		quantity:0,
		transQuantity:0,
		price:0
	},
	onLoad:function(e){
		let id = e.id;
		let taskDaily = JSON.parse(e.taskDailyJson);
		let that = this;
		wx.request({
	      url: app.globalData.apiUrl + "/task/detail.htm",
	      data: {id:id},
	      success: function (res) {
	      	wx.hideNavigationBarLoading();
	      	if (res.data.retCode == '0') {
				that.setData({
					taskReceipt: res.data.data.taskReceipt,
					taskDailyDetail:res.data.data.taskDailyDetail,
					itemSku:res.data.data.itemSku,
					item:res.data.data.item,
					taskDaily:taskDaily
				})	
				that.setData({
					max:that.data.taskDailyDetail.count - that.data.taskReceipt.transQuantity - that.data.taskReceipt.quantity    
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
	    let BMap = new bmap.BMapWX({
            ak: '4AiKHbwIFi7ipjFO8d8qWpaizMSW5yBG'
        });
        let fail = function(data){
        	console.log(data)
        }
        let success = function (data) {
            that.setData({
                buySite:data.wxMarkerData[0].address
            });
        }
        BMap.regeocoding({
        	fail:fail,
            success: success
        });
	},
	choseAddress:function(e){
		let that = this;
		wx.chooseLocation({
			success: function(res) {
				that.setData({ 
					buySite:res.address 
				});
			}
		})
	},
	transQuantityInput:function(e){
		let max =this.data.max;
		let quantity = 0;
		if(this.data.quantity && this.data.quantity!="undefined"){
			max = max - this.data.quantity;
			quantity =  this.data.quantity;
		}else{
			quantity= 0;
		}
		let value = e.detail.value;
		if(e.detail.value>max){
			value = max;
		}
		let transQuantity = value;
		this.setData({
			transQuantity:transQuantity,
			quantity:quantity
		})
		calc(this);
	},
	upcInput:function(e){
		this.setData({
			upc:e.detail.value
		})
	},
	quantityInput:function(e){
		let max =this.data.max;
		let transQuantity = 0;
		if(this.data.transQuantity && this.data.transQuantity!="undefined"){
			max = max - this.data.transQuantity;
			transQuantity =  this.data.transQuantity;
		}else{
			transQuantity= 0;
		}
		let value = e.detail.value;
		if(e.detail.value>max){
			value = max;
		}
		let quantity = value;
		this.setData({
			transQuantity:transQuantity,
			quantity:quantity
		})
		calc(this);
	},
	purchasePriceInput:function(e){
		let price = e.detail.value;
		if(price > this.data.taskDailyDetail.taskMaxPrice){
			price = this.data.taskDailyDetail.taskMaxPrice;
		}
		this.setData({
			price:price
		});
		calc(this);
	},
	scan:function(e){
		let that = this;
		wx.scanCode({
            success: (res) => {
                let upc = res.result; 
                that.setData({
            		upc:upc
            	})
            },
            fail:(res)=>{
            	that.setData({
            		upcPlaceholder:'扫码不成功请手动输入核对'
            	})
            }
        }) 
	},
	calc:function(){
		let purchasePrice = this.data.price;
		let quantity = this.data.quantity;
		let transQuantity = this.data.transQuantity;
		let taskDetailId = this.data.taskDailyDetail.id;
		let skuBuysite = this.data.buySite;
		let purchaseUpc = this.data.upc;
		let skuId = this.data.itemSku.id;
		if(!purchasePrice || purchasePrice<=0 || (quantity<=0 && transQuantity<=0)){
			wx.showToast({
		        title: "请补全完整信息",
		        icon: 'none',
		    	duration: 2000
		    });
		    return;
		}
		wx.showModal({
			title: '提示',
		    content: '您是否确认结算',
		    success: function(res) {
			    if (res.confirm) {
			    	wx.showNavigationBarLoading();
			   		wx.request({
				      url: app.globalData.apiUrl + "/task/calc.htm",
				      data: {quantity:quantity,taskDetailId:taskDetailId,transQuantity:transQuantity,skuBuysite:skuBuysite,purchaseUpc:purchaseUpc,skuId:skuId,buyerId:app.globalData.buyerId,purchasePrice:purchasePrice},
				      success: function (res) {
				      	wx.hideNavigationBarLoading();
				      	if (res.data.retCode == '0') {
				      		app.globalData.calc = true;
				      		wx.switchTab({
							  url: '/pages/task/list'
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
let calc = function(that){
	if(that.data.quantity && that.data.transQuantity && that.data.price){
		that.setData({
			totalPrice:parseFloat((parseInt(that.data.quantity)+parseInt(that.data.transQuantity)) *  that.data.price)
		})
	}
}