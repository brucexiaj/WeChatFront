var app = getApp();
Page({
	data: {
		delBtnWidth: 180,
		canLoad:true,
		pageNum:0,
		findItemList:[],
		key:'',
		status:null,
		orderTimeType:'asc',
		countAll:0,
		filterBoxShow:false,
		audit:0,
		passed:0,
		currentIndex:0,
		scrollTop:0,
		popFlag:false,
		rejectPopFlag:false,
		agreePopFlag:false,
		token:'',
		skuIds:'',
		skuAmounts:'',
		skuLimits:'',
	},
	amount:function(e){
		let skuList = this.data.skuList;
		let index = e.currentTarget.dataset.index;
		skuList[index].amount = e.detail.value;
		this.setData({
			skuList:skuList
		})
	},
	limit:function(e){
		let skuList = this.data.skuList;
		let index = e.currentTarget.dataset.index;
		skuList[index].limit = e.detail.value;
		this.setData({
			skuList:skuList
		})
	},
	onPageScroll:function(e){
		if(Math.abs(this.data.scrollTop - e.scrollTop)>30){	
			let findItemList = this.data.findItemList;
			findItemList[this.data.currentIndex].txtStyle = 'left:0px';
			this.setData({
				findItemList: findItemList,
			})
		}
		this.setData({
			scrollTop: e.scrollTop,
		})
	},
	onShow: function(options) {
		let status = app.globalData.findStatus;
		if(!(status!=null && status !='')){
			status = null
		}
		this.setData({
			delBtnWidth:180,
			canLoad:true,
			pageNum:0,
			status:status,
			scrollTop:0
		})
		this.initEleWidth();
		ajaxLoad(0,this,"refresh")
	},
	onHidden:function(){
		app.globalData.findStatus = null;
	},
	filterSwitch:function(){
		let that = this;
		switch(that.data.filterBoxShow){
			case true:that.setData({filterBoxShow:false});break;
			case false:that.setData({filterBoxShow:true});break;
		}
	},
	closeFilter:function(){
		let that = this;
		that.setData({
			filterBoxShow:false
		});
	},
	switchTab:function(e){
		let that = this;
		let status = e.currentTarget.dataset.status;
		that.setData({
			status:status,
			filterBoxShow:false,
			canLoad:true,
			pageNum:0
		});
		ajaxLoad(0,that,"refresh");
	},
	goDetail:function(e){
		let id = e.currentTarget.dataset.id;
		let status = e.currentTarget.dataset.status;
      	if(status==0 || status==2 || status==-1){
      		wx.navigateTo({
	      		url: "../find/itemPub?id="+id
	      	})	
      	}else{
      		wx.navigateTo({
	      		url: "../find/itemDetail?id="+id
	      	})	
      	}
	},
	pub:function(e){
		let id = '';
		let that = this;
		wx.scanCode({
            success: (res) => {
                let upc = res.result; 
                console.log("扫码返回upc"+upc);
                wx.request({
	                url: app.globalData.apiUrl + '/find/scan.htm',
	                data: {upc:upc},
	                success: function (res) {
	                	if(res.data.retCode=='0'){
	                		id = res.data.data;
	                	}	
	                	wx.navigateTo({
				      		url: "../find/itemPub?id="+id+"&upc="+upc
				      	})	
	                },
	                fail:function(){
	                	console.log("请求upc失败"+upc);
	                	wx.navigateTo({
				      		url: "../find/itemPub"
				      	})	
	                }
	            })
            },
            fail:(res)=>{
            	console.log("扫码失败"+JSON.stringify(res));
            	wx.navigateTo({
		      		url: "../find/itemPub"
		      	})	
            }
        }) 
	},
	changeOrder:function(e){
		let that = this;
		let orderTimeType = "asc";
		switch(that.data.orderTimeType){
			case "asc":orderTimeType = "desc";break;
			case "desc":orderTimeType = "asc";break;
		}
		that.setData({
			canLoad:true,
			filterBoxShow:false,
			pageNum:0,
			orderTimeType:orderTimeType
		})
		ajaxLoad(0,that,"refresh");
	},
	onPullDownRefresh: function(){
        let that = this;
        that.onShow();
    },
    onReachBottom:function(){
		let that = this;
		wx.showNavigationBarLoading();
		ajaxLoad(that.data.pageNum,that,"load");
	},
	touchS: function(e) {
		let findItemList = this.data.findItemList;
		findItemList[this.data.currentIndex].txtStyle = 'left:0px';
		this.setData({
			findItemList: findItemList,
		})
		if (e.touches.length == 1) {
			this.setData({
				startX: e.touches[0].clientX
			})
		}
	},
	touchM: function(e) {
		if (e.touches.length == 1) {
			let moveX = e.touches[0].clientX;
			let disX = this.data.startX - moveX;
			let delBtnWidth = this.data.delBtnWidth;
			let txtStyle = "";
			if (disX == 0 || disX < 0) {
				txtStyle = "left:0px"
			}
			else if(disX > 0) {
				txtStyle = "left:-" + disX + "px";
				if (disX >= delBtnWidth) {
					txtStyle = "left:-" + delBtnWidth + "px"
				}
			}
			let index = e.currentTarget.dataset.index;
			let findItemList = this.data.findItemList;
			findItemList[index].txtStyle = txtStyle;
			this.setData({
				findItemList: findItemList,
				currentIndex:index
			})
		}
	},
	touchE: function(e) {
		if (e.changedTouches.length == 1) {
			let endX = e.changedTouches[0].clientX;
			let disX = this.data.startX - endX;
			let delBtnWidth = this.data.delBtnWidth;
			let txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px": "left:0px";
			let index = e.currentTarget.dataset.index;
			let findItemList = this.data.findItemList;
			findItemList[index].txtStyle = txtStyle;
			this.setData({
				findItemList: findItemList,
				currentIndex:index
			})
		}
	},
	getEleWidth: function(w) {
		let real = 0;
		try {
			let res = wx.getSystemInfoSync().windowWidth;
			let scale = (750 / 2) / (w / 2);
			real = Math.floor(res / scale);
			return real
		} catch(e) {
			return false
		}
	},
	initEleWidth: function() {
		let delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
		this.setData({
			delBtnWidth: delBtnWidth
		})
	},
	delItem: function(e) {
		let index = e.currentTarget.dataset.index;
		let id = e.currentTarget.dataset.id;
		let findItemList = this.data.findItemList;
		let that = this;
		wx.request({
	      url: app.globalData.apiUrl + "/find/delItem.htm",
	      data: {id:id},
	      success: function (res) {
	      	wx.hideNavigationBarLoading();
	      	if (res.data.retCode == '0') {
	      		findItemList.splice(index, 1);
				that.setData({
					findItemList: findItemList
				})
	      		wx.showToast({
			        title: "删除成功",
			        icon: 'none',
			    	duration: 2000
			    });
		    }else {
	            wx.showToast({
			        title: res.data.errorMsg,
			        icon: 'none',
			    	duration: 2000
			    })
	            findItemList[index].txtStyle = '';
				that.setData({
					findItemList: findItemList
				})
	        }
	      },
		  fail: function () {
		  	wx.hideNavigationBarLoading();
			util.errorCallback();
		  } 
	    }) 
	},
	audit:function(e){
		let index = e.currentTarget.dataset.index;
		let id = e.currentTarget.dataset.id;
		let status = e.currentTarget.dataset.status;
		let findItemList = this.data.findItemList;
		let that = this;
		that.setData({
			itemPic:findItemList[index].skuPic,
			itemTitle:findItemList[index].name,
			itemId:findItemList[index].id,
			itemStatus:status,
			itemIndex:index
		})
		if(status==-1){
			that.setData({
				popFlag:true,
				rejectPopFlag:true,
			})	
		}else{
			wx.request({
		      url: app.globalData.apiUrl + "/find/skuList.htm",
		      data: {itemId:findItemList[index].id},
		      success: function (res) {
		      	wx.hideNavigationBarLoading();
		      	if (res.data.retCode == '0') {
					that.setData({
						skuList: res.data.data.skuList
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
			that.setData({
				popFlag:true,
				agreePopFlag:true,
			})
		}
	},
	reason:function(e){
		this.setData({
			reason:e.detail.value
		})
	},
	back:function(){
		this.setData({
			popFlag:false,
			rejectPopFlag:false,
			agreePopFlag:false
		})
	},
	rejectConfirm:function(e){
		this.setData({
			skuIdArr:'',
			skuAmountArr:'',
			skuUpcArr:'',
			skuCodeArr:'',
			skuLimitArr:''
		})
		audit(this.data.itemId,this.data.itemStatus,this);
		this.back();
	},
	agreeConfirm:function(e){
		let skuIdArr= '';
		let skuAmountArr= '';
		let skuLimitArr= '';
		let skuCodeArr= '';
		let skuUpcArr= '';
		let skuList = this.data.skuList;
		for(let i in skuList){
			if(skuList[i].amount=='' || skuList[i].limit==''){
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
		audit(this.data.itemId,this.data.itemStatus,this);
		this.back();
	}
})
let audit = function(id,status,that){
	let findItemList = that.data.findItemList;
	let itemIndex = that.data.itemIndex;
	wx.request({
      url: app.globalData.apiUrl + "/find/audit.htm",
      data: {id:id,status:status,buyerId:app.globalData.buyerId,reason:that.data.reason,skuId:that.data.skuIdArr,skuCode:that.data.skuCodeArr,skuUpc:that.data.skuUpcArr, skuAmount:that.data.skuAmountArr, skuLimit:that.data.skuLimitArr},
      success: function (res) {
      	wx.hideNavigationBarLoading();
      	if (res.data.retCode == '0') {
      		findItemList[itemIndex].purchaseStatus =status;
			that.setData({
				findItemList: findItemList
			})
      		wx.showToast({
		        title: "修改成功",
		        icon: 'none',
		    	duration: 2000
		    });
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
let ajaxLoad = function(pageNum,that,loadType){
	if(!that.data.canLoad){
		wx.hideNavigationBarLoading();
		return;
	}

	let status = that.data.status;
	if(status==null || status=='null'){
		status = '';
	}
	wx.request({
      url: app.globalData.apiUrl + "/find/list.htm",
      data: {pageNum:pageNum,key:that.data.key,status:status,orderTimeType:that.data.orderTimeType},
      success: function (res) {
      	wx.hideNavigationBarLoading();
      	wx.stopPullDownRefresh();
      	if (res.data.retCode == '0') {
      		let token = that.data.token;
      		that.setData({
      			token:res.data.data.token
      		})	
      		if(loadType=="refresh" && res.data.data.token!=token){
	        	that.setData({
	        		findItemList:[]
	        	})
	        }
      		if(res.data.data.findItemList ==null || res.data.data.findItemList ==undefined ||res.data.data.findItemList.length==0){
      			if(loadType=="load"){
      				wx.showToast({
				        title: "没有更多数据",
				        icon: 'none',
				    	duration: 2000
				    });
      			}
			    that.setData({
		        	canLoad:false
		        })
			    return;
      		}
      		if(res.data.data.findItemList.length<app.globalData.pageSize){
      			that.setData({
		        	canLoad:false
		        })
      		}
      		let findItemList = that.data.findItemList.concat(res.data.data.findItemList);
	        that.setData({
	        	passed:res.data.data.passed,
	        	audit:res.data.data.audit,
	        	countAll:res.data.data.countAll,
	        	pageNum:pageNum+1
	        })
	        if(loadType=="load" || (loadType=="refresh" && res.data.data.token!=token)){
	        	that.setData({
	        		findItemList:findItemList
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
	  	wx.stopPullDownRefresh();
		util.errorCallback();
	  } 
    })   
}