var app = getApp();
Page({
	data:{
		searchBoxShow:false,
		pageNum:0,
		canLoad:true,
		status:null,
		key:'',
		taskDailyList:[],
		char_lt:'<',
		taskingNumber:0,
		purchaseStorage:0,
		taskDoneNumber:0,
		orderType:'time',
		token:''
	},
    onReachBottom:function(){
		let that = this;
		if(!app.globalData.taskId){
			wx.showNavigationBarLoading();
			ajaxLoad(that.data.pageNum,that,"load");
		}
	},
	goStorage:function(){
		wx.navigateTo({
			url:'../task/storage'
		})
	},
	goDone:function(){
		wx.navigateTo({
			url:'../task/done'
		})
	},
	upcScan:function(e){
		let upc = e.currentTarget.dataset.upc;
		let index = e.currentTarget.dataset.index;
		let listIndex = e.currentTarget.dataset.listindex;
		let taskDailyList = this.data.taskDailyList;
		wx.scanCode({
            success: (res) => {
                let tempUpc = res.result;
                if(upc!=tempUpc){
                	wx.showToast({
				        title: "upc不符，请核对",
				        icon: 'none',
				    	duration: 2000
				    });
                }else{
                	wx.showToast({
				        title: "upc核对成功",
				        icon: 'none',
				    	duration: 2000
				    });
				    taskDailyList[index].taskDailyDetailExtList[listIndex].purchaseUpc = tempUpc;
					this.setData({
						taskDailyList:taskDailyList
					})
                }
            },
            fail:(res)=>{
            	wx.showToast({
			        title: "扫码失败",
			        icon: 'none',
			    	duration: 2000
			    });
            }
        }) 
	},
	choseItem:function(e){
		let index = e.currentTarget.dataset.index;
		let taskDailyList = this.data.taskDailyList;
		taskDailyList[index].chose = !taskDailyList[index].chose;
		for(let i in taskDailyList[index].taskDailyDetailExtList){
			taskDailyList[index].taskDailyDetailExtList[i].chose = taskDailyList[index].chose
		}
		this.setData({
			taskDailyList:taskDailyList
		})
	},
	choseAddress:function(e){
		let that = this;
		let index = e.currentTarget.dataset.index;
		let listindex = e.currentTarget.dataset.listindex;
		let taskDailyList = this.data.taskDailyList;
		wx.chooseLocation({
			success: function(res) {
				let address = res.address;
				taskDailyList[index].taskDailyDetailExtList[listindex].skuBuysite = address
				that.setData({
					taskDailyList:taskDailyList
				})
			}
		})
	},
	edit:function(e){
		let index = e.currentTarget.dataset.index;
		let listIndex = e.currentTarget.dataset.listindex;
		let taskDailyList = this.data.taskDailyList;
		taskDailyList[index].taskDailyDetailExtList[listIndex].unfold = !taskDailyList[index].taskDailyDetailExtList[listIndex].unfold;
		this.setData({
			taskDailyList:taskDailyList
		})
	},
	transQuantity:function(e){
		let index = e.currentTarget.dataset.index;
		let listIndex = e.currentTarget.dataset.listindex;
		let taskDailyList = this.data.taskDailyList;
		let max = e.currentTarget.dataset.max;
		if(taskDailyList[index].taskDailyDetailExtList[listIndex].quantity && taskDailyList[index].taskDailyDetailExtList[listIndex].quantity!="undefined"){
			max = max -taskDailyList[index].taskDailyDetailExtList[listIndex].quantity;
		}else{
			taskDailyList[index].taskDailyDetailExtList[listIndex].quantity = 0;
		}
		let value = e.detail.value;
		if(e.detail.value>max){
			value = max;
		}
		taskDailyList[index].taskDailyDetailExtList[listIndex].transQuantity = value;
		this.setData({
			taskDailyList:taskDailyList
		})
	},
	quantity:function(e){
		let index = e.currentTarget.dataset.index;
		let listIndex = e.currentTarget.dataset.listindex;
		let taskDailyList = this.data.taskDailyList;
		let max = e.currentTarget.dataset.max;
		if(taskDailyList[index].taskDailyDetailExtList[listIndex].transQuantity && taskDailyList[index].taskDailyDetailExtList[listIndex].transQuantity!="undefined"){
			max = max -taskDailyList[index].taskDailyDetailExtList[listIndex].transQuantity;
		}else{
			taskDailyList[index].taskDailyDetailExtList[listIndex].transQuantity = 0;
		}
		let value = e.detail.value;
		if(e.detail.value>max){
			value = max;
		}
		taskDailyList[index].taskDailyDetailExtList[listIndex].quantity = value;
		this.setData({
			taskDailyList:taskDailyList
		})
	},
	purchase:function(e){
		let index = e.currentTarget.dataset.index;
		let listIndex = e.currentTarget.dataset.listindex;
		let taskDailyList = this.data.taskDailyList;
		let value = e.detail.value;
		let maxValue = e.currentTarget.dataset.max;
		if(value>maxValue){
			value = maxValue;
		}
		taskDailyList[index].taskDailyDetailExtList[listIndex].purchasePrice = value;
		this.setData({
			taskDailyList:taskDailyList
		})
	},
	chose:function(e){
		let index = e.currentTarget.dataset.index;
		let listindex = e.currentTarget.dataset.listindex;
		let taskDailyList = this.data.taskDailyList;
		taskDailyList[index].taskDailyDetailExtList[listindex].chose = !taskDailyList[index].taskDailyDetailExtList[listindex].chose;
		let choseNum = 0;
		for(let i in taskDailyList[index].taskDailyDetailExtList){
			if(!taskDailyList[index].taskDailyDetailExtList[i].chose){
				break;
			}
			choseNum++;
		}
		if(choseNum==0){
			taskDailyList[index].chose = false;
		}
		if(choseNum==taskDailyList[index].taskDailyDetailExtList.length){
			taskDailyList[index].chose = true;
		}
		taskDailyList[index].taskDailyDetailExtList[listindex].unfold = taskDailyList[index].taskDailyDetailExtList[listindex].chose;
		this.setData({
			taskDailyList:taskDailyList
		})
	},
	fold:function(e){
		let taskDailyList = this.data.taskDailyList;
		let index = e.currentTarget.dataset.index;
		taskDailyList[index].unfold = !taskDailyList[index].unfold
		this.setData({
			taskDailyList:taskDailyList
		})
	},
	input:function(e){
		let key = e.detail.value;
		this.setData({
			key:key
		})
	},
	confirm:function(){
		this.setData({
			pageNum:0,
			canLoad:true
		})
		ajaxLoad(0,this,"refresh");
	},
	searchSwitch:function(){
		let that = this;
		switch(that.data.searchBoxShow){
			case true:that.setData({searchBoxShow:false,key:''});break;
			case false:that.setData({searchBoxShow:true});break;
		}
	},
	calc:function(){
		let choseNum = 0;
		let that = this;
		let taskDailyList = that.data.taskDailyList;
		let taskDetailId = "";
		let transQuantity = "";
		let quantity = "";
		let skuBuysite = "";
		let purchaseUpc = "";
		let skuId = "";
		let purchasePrice = "";
		for(let i in taskDailyList){
			for(let j in taskDailyList[i].taskDailyDetailExtList){
				if(taskDailyList[i].taskDailyDetailExtList[j].chose){
					taskDetailId = taskDetailId + taskDailyList[i].taskDailyDetailExtList[j].id+",";
					if(taskDailyList[i].taskDailyDetailExtList[j].quantity + taskDailyList[i].taskDailyDetailExtList[j].transQuantity==0){
						wx.showToast({
					        title: "请填写结算数量",
					        icon: 'none',
					    	duration: 2000
					    });
						return;
					}
					if(!taskDailyList[i].taskDailyDetailExtList[j].skuBuysite){
						taskDailyList[i].taskDailyDetailExtList[j].skuBuysite = '';
					}
					if(!taskDailyList[i].taskDailyDetailExtList[j].purchaseUpc){
						taskDailyList[i].taskDailyDetailExtList[j].purchaseUpc = '';
					}
					transQuantity = transQuantity +taskDailyList[i].taskDailyDetailExtList[j].transQuantity+",";
					quantity = quantity + taskDailyList[i].taskDailyDetailExtList[j].quantity+",";
					skuBuysite = skuBuysite+taskDailyList[i].taskDailyDetailExtList[j].skuBuysite+",";
					purchaseUpc = purchaseUpc+taskDailyList[i].taskDailyDetailExtList[j].purchaseUpc+",";
					skuId = skuId +taskDailyList[i].taskDailyDetailExtList[j].skuId+",";
					purchasePrice = purchasePrice +taskDailyList[i].taskDailyDetailExtList[j].purchasePrice+",";
				}
			}
		}
		taskDetailId = taskDetailId.substring(0,taskDetailId.length-1);
		transQuantity = transQuantity.substring(0,transQuantity.length-1);
		quantity = quantity.substring(0,quantity.length-1);
		skuBuysite = skuBuysite.substring(0,skuBuysite.length-1);
		purchaseUpc = purchaseUpc.substring(0,purchaseUpc.length-1);
		skuId = skuId.substring(0,skuId.length-1);
		purchasePrice = purchasePrice.substring(0,purchasePrice.length-1);
		if(taskDetailId==""){
			wx.showToast({
		        title: "请选择结算的采购商品",
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
				      		wx.navigateTo({
								url:'../task/calc'
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
	},
	viewCalc:function(){
		wx.navigateTo({
      		url: "../task/calc"
      	})	
	},
	switchTab:function(e){
		let that = this;
		let status = e.currentTarget.dataset.status;
		if(status==''){
			status = null;
		}
		app.globalData.status = status;
		app.globalData.taskId = '';
		that.setData({
			pageNum:0,
			canLoad:true,
			status:status
		});
		ajaxLoad(0,that,"refresh");
	},
	onShow:function(){
		console.log("onShow");
		let status = app.globalData.status;
		this.setData({
			status:status,
			pageNum:0,
			canLoad:true,
			key:''
		})
		ajaxLoad(0,this,"refresh");
	}
})
var ajaxLoad = function(pageNum,that,loadType){
	if(!that.data.canLoad){
		wx.hideNavigationBarLoading();
		return;
	}
	let key = that.data.key;
	let status = app.globalData.status;
	if(status=='null' || status==null){
		status = '';
	}
	let taskId = app.globalData.taskId;
	if(taskId=='null' || taskId==null){
		taskId = '';
	}
	wx.request({
      url: app.globalData.apiUrl + "/task/list.htm",
      data: {pageNum:pageNum,key:key,status:status,taskId:taskId},
      success: function (res) {
      	wx.hideNavigationBarLoading();
      	if (res.data.retCode == '0') {
      		let token = that.data.token;
      		that.setData({
      			token:res.data.data.token
      		})	
      		if(loadType=="refresh" && res.data.data.token!=token){
	        	that.setData({
	        		taskDailyList:[]
	        	})
	        }
  			if(loadType=="load" &&(res.data.data.taskDailyList ==null || res.data.data.taskDailyList ==undefined ||res.data.data.taskDailyList.length==0)){
      			wx.showToast({
			        title: "没有更多数据",
			        icon: 'none',
			    	duration: 2000
			    });
			    that.setData({
		        	canLoad:false,
		        	token:token
		        })
			    return;
      		}
      		let taskDailyList = that.data.taskDailyList.concat(res.data.data.taskDailyList);
	        that.setData({
	        	pageNum:pageNum+1,
	        	taskingNumber:res.data.data.taskingNumber,
				purchaseStorage:res.data.data.purchaseStorage,
				taskDoneNumber:res.data.data.taskDoneNumber,
				quantity:res.data.data.quantity,
				transQuantity:res.data.data.transQuantity
	        })
	        if(loadType=="load" || (loadType=="refresh" && res.data.data.token!=token)){
	        	that.setData({
	        		taskDailyList:taskDailyList
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
}