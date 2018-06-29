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
		price:0,
		type:''
	},
	onLoad:function(e){
		let id = e.id;
		let taskDaily = JSON.parse(e.taskDailyJson);
		let that = this;
		let type = '';
		if(e.type){
			type = e.type;
		}
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
					taskDaily:taskDaily,
					type:type
				})	
				that.setData({
					max:that.data.taskDailyDetail.count - that.data.taskReceipt.transQuantity - that.data.taskReceipt.quantity    
				})  
				if(type=='detail'){
					let price = res.data.data.taskReceipt.price;
					if(res.data.data.taskReceipt.maxPrice && res.data.data.taskReceipt.maxPrice !=  res.data.data.taskReceipt.price){
						price = price +"~"+res.data.data.taskReceipt.maxPrice 
					}
					that.setData({
						quantity:res.data.data.taskReceipt.quantity,
						transQuantity:res.data.data.taskReceipt.transQuantity,
						price:price
					})
				}		
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
	purchasePriceFocus:function(e){
		if(this.data.price==0){
			this.setData({
				price:''
			})
		}
	},
	purchasePriceBlur:function(e){
		if(this.data.price==''){
			this.setData({
				price:0
			})
		}
	},
	preview:function(e){
		let pic = e.currentTarget.dataset.src;
		wx.previewImage({
		  current: pic, // 当前显示图片的http链接
		  urls: [pic] // 需要预览的图片http链接列表
		})
	},
	tqFocus:function(e){
		if(this.data.transQuantity==0){
			this.setData({
				transQuantity:''
			})
		}
	},
	tqBlur:function(e){
		if(this.data.transQuantity==''){
			this.setData({
				transQuantity:0
			})
		}
	},
	qFocus:function(e){
		if(this.data.quantity==0){
			this.setData({
				quantity:''
			})
		}
	},
	qBlur:function(e){
		if(this.data.quantity==''){
			this.setData({
				quantity:0
			})
		}
	},
	calc:function(){
		let purchasePrice = this.data.price;
		let quantity = this.data.quantity;
		let transQuantity = this.data.transQuantity;
		let taskDetailId = this.data.taskDailyDetail.id;
		let skuBuysite = this.data.buySite;
		let purchaseUpc = this.data.upc;
		let skuId = this.data.itemSku.id;
		if(!purchaseUpc){
			wx.showToast({
		        title: "请输入校验upc",
		        icon: 'none',
		    	duration: 2000
		    });
			return;
		}
		if(purchaseUpc != this.data.itemSku.upc){
			wx.showToast({
		        title: "UPC核对错误，请检查商品是否正确",
		        icon: 'none',
		    	duration: 2000
		    });
			return;
		}
		if(!purchasePrice || purchasePrice<=0 || (quantity<=0 && transQuantity<=0)){
			wx.showToast({
		        title: "请补全完整信息",
		        icon: 'none',
		    	duration: 2000
		    });
		    return;
		}
		let tempQuantity = parseInt(transQuantity) + parseInt(quantity);
		let totalPrice = this.data.totalPrice;
		wx.showModal({
			title: '提示',
		    content: '结算数量：'+tempQuantity+'\r\n结算价格：$'+totalPrice+'\r\n您是否确认结算',
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
	let totalPrice = 0;
	if(that.data.transQuantity==''){
		that.setData({
			transQuantity:0
		})
	};
	if(that.data.quantity==''){
		that.setData({
			quantity:0
		})
	};
	let price = (parseInt(that.data.quantity)+parseInt(that.data.transQuantity))*that.data.price;
	if(!isNaN(price)){
		that.setData({
			totalPrice:price
		})
	}
}