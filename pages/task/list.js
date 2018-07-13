var app = getApp();
var util = require('../../utils/util.js');
Page({
	data:{
		searchBoxShow:false,
		pageNum:0,
		canLoad:true,
		status:null,
		key:'',
		taskDailyList:[],
		taskReceiptList:[],
		char_lt:'<',
		token:'',
		calc:false,
		storage:false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		userInfo:null,
		quantity:0,
		transQuantity:0,
		amount:0,	
		AllpriceMax:'',
		total:0,
		eleQuantity:0,
		amountPrice:0,
	},
	onGotUserInfo:function(){
		app.requestAndUpdateUserInfo();
		let that = this;
		setTimeout(function () {
            that.setData({
            	//userInfo:app.globalData.buyerId
            })
        }, 1000);
		if(app.globalData.buyerId==null){
			wx.showToast({
	          title: '授权失败',
	          icon:'none'
	        });
		}else{
			that.onShow();
			wx.showToast({
	          title: '授权成功',
	          icon:'none'
	        });
		}
	},
    onReachBottom:function(){
		let that = this;
		if(app.globalData.appid){
			if(!app.globalData.storage && !app.globalData.calc){
				ajaxLoad(that.data.pageNum,that,"load");
			}else{
				this.setData({
					taskDailyList:[],
					status:null
				})
			}	
			if(app.globalData.calc){
				ajaxLoadTaskReceiptList(that.data.pageNum,that,"load");
				this.setData({
					calc:true,
					storage:false
				})
			}
			if(app.globalData.storage){
				ajaxLoadStorageList(that.data.pageNum,that,"load");
				this.setData({
					storage:true,
					calc:false
				})
			}
		}
	},
	searchSwitch:function(){
		let that = this;
		switch(that.data.searchBoxShow){
			case true:that.setData({searchBoxShow:false,key:''});break;
			case false:that.setData({searchBoxShow:true});break;
		}
	},
	calc:function(e){
		let detailId =  e.currentTarget.dataset.detail;
		let taskJsonStr = e.currentTarget.dataset.taskid;
		let index = e.currentTarget.dataset.index;
		let taskDaily = this.data.taskDailyList[index];
		let tempTaskDaily = {};
		tempTaskDaily.id = this.data.taskDailyList[index].id;
		tempTaskDaily.taskTitle= this.data.taskDailyList[index].taskTitle;
		tempTaskDaily.taskStartTimeStr= this.data.taskDailyList[index].taskStartTimeStr;
		tempTaskDaily.statusDes= this.data.taskDailyList[index].statusDes;
		tempTaskDaily.statusValue= this.data.taskDailyList[index].statusValue;
		tempTaskDaily.schedule= this.data.taskDailyList[index].schedule;
		tempTaskDaily.allInCount= this.data.taskDailyList[index].allInCount;
		tempTaskDaily.allCount= this.data.taskDailyList[index].allCount;
		tempTaskDaily.ownerName= this.data.taskDailyList[index].allCount;
    wx.navigateTo({
      		url: "../task/detail?id="+detailId+'&taskDailyJson='+JSON.stringify(tempTaskDaily)
      	})	
	},
	goDetail:function(e){
		let detailId =  e.currentTarget.dataset.detail;
		let taskJsonStr = e.currentTarget.dataset.taskid;
		let index = e.currentTarget.dataset.index;
		let type = e.currentTarget.dataset.type;
		let taskDaily = this.data.taskDailyList[index];
		let tempTaskDaily = {};
		tempTaskDaily.id = this.data.taskDailyList[index].id;
		tempTaskDaily.taskTitle= this.data.taskDailyList[index].taskTitle;
		tempTaskDaily.taskStartTimeStr= this.data.taskDailyList[index].taskStartTimeStr;
		tempTaskDaily.statusDes= this.data.taskDailyList[index].statusDes;
		tempTaskDaily.statusValue= this.data.taskDailyList[index].statusValue;
		tempTaskDaily.schedule= this.data.taskDailyList[index].schedule;
		tempTaskDaily.allInCount= this.data.taskDailyList[index].allInCount;
		tempTaskDaily.allCount= this.data.taskDailyList[index].allCount;
		tempTaskDaily.ownerName= this.data.taskDailyList[index].allCount;
    wx.navigateTo({
      		url: "../task/detail?id="+detailId+'&taskDailyJson='+JSON.stringify(tempTaskDaily)+'&type='+type
      	})	
	},
	preview:function(e){
		let pic = e.currentTarget.dataset.src;
		wx.previewImage({
		  current: pic, // 当前显示图片的http链接
		  urls: [pic] // 需要预览的图片http链接列表
		})
	},
	addStorage:function(){
		let receiptIds = "";
		let that = this;
		for(let x in this.data.taskReceiptList){
			for(let j in this.data.taskReceiptList[x].taskDailyDetailExtList){
				if(this.data.taskReceiptList[x].taskDailyDetailExtList[j].chose){
					receiptIds = receiptIds+this.data.taskReceiptList[x].taskDailyDetailExtList[j].receiptId+",";
				}
			}
		}
		if(receiptIds==''){
			wx.showToast({
	          title: '请勾选要预入库的商品',
	          icon:'none'
	        });
			return;
		}
		receiptIds = receiptIds.substring(0,receiptIds.length-1);
		let _buyerId = app.globalData.buyerId;
		//console.log("_buyer_id: "+_buyerId);
		wx.request({
		  url: app.globalData.apiUrl + "/task/addStorage.htm",
		  data: {receiptIds:receiptIds,buyerId:_buyerId,appid: app.globalData.appid},
		  success: function (res) {
		  	wx.showToast({
	          title: '预入库成功',
	          icon:'none'
	        });
	        that.goStorage();
		  }
		})
	},
	goCalc:function(){
		this.setData({
			taskDailyList:[],
			taskReceiptList:[],
			calc:true,
			storage:false,
			token:'',
			pageNum:0,
			quantity:0,
			transQuantity:0,
			amount:0,
			status:null,
			eleQuantity:0,
			total:0,
			amountPrice:0,
		});
		app.globalData.status = null;
		app.globalData.calc = true;
		app.globalData.storage = false;
		ajaxLoadTaskReceiptList(0,this,"refresh");
	},
	goStorage:function(){
		this.setData({
			taskDailyList:[],
			storage:true,
			calc:false,
			status:null,
			pageNum:0,
			token:''
		})
		app.globalData.status = null;
		app.globalData.calc = false;
		app.globalData.storage = true;
		ajaxLoadStorageList(0,this,"refresh");
	},
	switchTab:function(e){
		let that = this;
		let status = e.currentTarget.dataset.status;
		if(status==''){
			status = null;
		}
		app.globalData.status = status;
		app.globalData.calc = false;
		app.globalData.storage = false;
		app.globalData.taskId = '';
		that.setData({
			pageNum:0,
			canLoad:true,
			calc:false,
			storage:false,
			status:status
		});
		ajaxLoad(0,that,"refresh");
	},
	onLoad:function(){
		wx.login({
	      success: res => {
	        console.log("request code:" + res.code)
	        wx.request({
	          url: app.globalData.apiUrl + "/wx/purchaseLogin/auth4OpenIdAndCompanyNo.htm",
	          data: {
	            version: app.globalData.version,
	            code: res.code,
		        appid: app.globalData.appid
	          },
	          success: function (res) {
	          	if(res.data.retCode!='0'){
	          		wx.showToast({
			          title: res.data.errorMsg,
			        });
	          	}else{
	          		var xcxCookieId = res.data.data.openid;
	                wx.setStorageSync('xcxCookieId', xcxCookieId);
	                app.globalData.xcxCookieId = xcxCookieId;
                  app.globalData.sessionKey = res.data.data.session_key;
                  //app.globalData.appid = res.data.data.appid;
                  app.globalData.buyerId = res.data.data.buyer_id;
                  console.log(app.globalData.buyerId)
		           // app.requestAndUpdateUserInfo();

                    let _buyerId = res.data.data.buyer_id;
                    if (_buyerId === undefined || _buyerId == null) {
                        //没有buyer_id, 然后显示授权拿到unionId
                        app.requestAndUpdateUserInfo();
                    } else {
                        app.globalData.buyerId = res.data.data.buyer_id;
                    }

	          	}

	          }
	        })
	        wx.stopPullDownRefresh();
	      },
	      fail: function (res) { console.log(res)
	        wx.showToast({
            title: '登录小程序失败',
	        });
	      }
	    })
	},
	onShow:function(){
		console.log("onShow");
		let status = app.globalData.status;
		if(app.globalData.appid){
			this.setData({
				status:status,
				pageNum:0,
				canLoad:true,
				key:'',
				userInfo:app.globalData.userInfo
			})
			if(!app.globalData.storage && !app.globalData.calc){
				ajaxLoad(0,this,"refresh");
			}else{
				this.setData({
					taskDailyList:[],
					status:null
				})
			}	
			if(app.globalData.calc){
				ajaxLoadTaskReceiptList(0,this,"refresh");
				this.setData({
					calc:true,
					storage:false
				})
			}
			if(app.globalData.storage){
				ajaxLoadStorageList(0,this,"refresh");
				this.setData({
					storage:true,
					calc:false
				})
			}
		}
	},
	fold:function(e){
		if(!app.globalData.storage && !app.globalData.calc){
			let taskDailyList = this.data.taskDailyList;
			let index = e.currentTarget.dataset.index;
			taskDailyList[index].unfold = !taskDailyList[index].unfold
			this.setData({
				taskDailyList:taskDailyList
			})
		}else{
			let taskReceiptList = this.data.taskReceiptList;
			let index = e.currentTarget.dataset.index;
			taskReceiptList[index].unfold = !taskReceiptList[index].unfold
			this.setData({
				taskReceiptList:taskReceiptList
			})
		}
	},
	choseItem:function(e){

		let index = e.currentTarget.dataset.index;
		let taskReceiptList = this.data.taskReceiptList;
		// console.log(taskReceiptList[index])
		taskReceiptList[index].chose = !taskReceiptList[index].chose;
		// console.log(taskReceiptList[index].chose)
		// console.log(taskReceiptList[index].taskDailyDetailExtList)
		for(let i in taskReceiptList[index].taskDailyDetailExtList){
			taskReceiptList[index].taskDailyDetailExtList[i].chose = taskReceiptList[index].chose
		
		}
		this.setData({
			taskReceiptList:taskReceiptList
		})
		this.getTotalPrice();
	},
    getTotalPrice() {
		// console.log('this')
		let taskReceiptList = this.data.taskReceiptList;
		let total = 0;
		let eleQuantity = 0;
		let amountPrice =0;
		for (let i = 0;i<taskReceiptList.length; i++){
			// console.log('that')
			var everyElement = taskReceiptList[i].taskDailyDetailExtList;
			for(let j  = 0;j < everyElement.length;j++) {
				var everyElement2 = everyElement[j];
				var everyChose = everyElement2.chose;
				var everyQuantity = everyElement2.transQuantity
				var everyTaQuantity = everyElement2.quantity
				var everyPrice = everyElement2.purchasePrice
				// console.log("everyQuantity:"+everyQuantity);
				if(everyChose){
					total += everyQuantity
					eleQuantity += everyTaQuantity
					amountPrice += (everyQuantity+everyTaQuantity) * everyPrice
					console.log(total,eleQuantity)
					
				}
			}
		}
		this.setData({
			taskReceiptList:taskReceiptList,
			total:total,
			eleQuantity:eleQuantity,
			amountPrice: amountPrice.toFixed(2)
		})  
	},
	chose:function(e){
		let index = e.currentTarget.dataset.index;
		let listindex = e.currentTarget.dataset.listindex;
		let taskReceiptList = this.data.taskReceiptList;
		taskReceiptList[index].taskDailyDetailExtList[listindex].chose = !taskReceiptList[index].taskDailyDetailExtList[listindex].chose;
		let choseNum = 0;
		for(let i in taskReceiptList[index].taskDailyDetailExtList){
			if(!taskReceiptList[index].taskDailyDetailExtList[i].chose){
				break;
			}
			choseNum++;
		}
		if(choseNum==0){
			taskReceiptList[index].chose = false;
		}
		if(choseNum==taskReceiptList[index].taskDailyDetailExtList.length){
			taskReceiptList[index].chose = true;
		}
		taskReceiptList[index].taskDailyDetailExtList[listindex].unfold = taskReceiptList[index].taskDailyDetailExtList[listindex].chose;
		this.setData({
			taskReceiptList:taskReceiptList
		})
		this.getTotalPrice();
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
            data: {pageNum:pageNum,key:key,status:status,taskId:taskId,appid: app.globalData.appid},
            success: function (res) {
                wx.hideNavigationBarLoading();
                if (res.data.retCode == '0') {
                    console.log(that.data)
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
                        pageNum:pageNum+1
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


var ajaxLoadStorageList = function(pageNum,that,loadType){
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
      url: app.globalData.apiUrl + "/task/taskReceiptList.htm",
      data: {pageNum:pageNum,key:key,status:status,taskId:taskId,appid: app.globalData.appid},
      success: function (res) {
      	wx.hideNavigationBarLoading();
      	if (res.data.retCode == '0') {
      		let token = that.data.token;
      		that.setData({
      			token:res.data.data.token
      		})	
      		if(loadType=="refresh" && res.data.data.token!=token){
	        	that.setData({
	        		taskReceiptList:[]
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
      		let taskReceiptList = that.data.taskReceiptList.concat(res.data.data.taskDailyList);
      		let amount = that.data.amount;
      		let quantity = that.data.quantity;
      		let transQuantity = that.data.transQuantity;
	        that.setData({
	        	pageNum:pageNum+1,
	        	amount:amount+res.data.data.amount,
	        	quantity:quantity+res.data.data.quantity,
	        	transQuantity:transQuantity+res.data.data.transQuantity
	        })
	        if(loadType=="load" || (loadType=="refresh" && res.data.data.token!=token)){
	        	that.setData({
	        		taskReceiptList:taskReceiptList
	        	})
	        }
	    }else {
            wx.showToast({
		        title: res.data.errorMsg,
		        icon: 'none',
		    	duration: 2000
		    })
        }
    }
    })   
}
var ajaxLoadTaskReceiptList = function(pageNum,that,loadType){
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
      url: app.globalData.apiUrl + "/task/taskReceiptList.htm",
      data: {pageNum:pageNum,key:key,status:status,taskId:taskId,type:'calc',appid: app.globalData.appid},
      success: function (res) {
      	wx.hideNavigationBarLoading();
      	if (res.data.retCode == '0') {
      		let token = that.data.token;
      		that.setData({
      			token:res.data.data.token
      		})	
      		if(loadType=="refresh" && res.data.data.token!=token){
	        	that.setData({
	        		taskReceiptList:[]
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
      		let taskReceiptList = that.data.taskReceiptList.concat(res.data.data.taskDailyList);
      		let amount = that.data.amount;
      		let quantity = that.data.quantity;
      		let transQuantity = that.data.transQuantity;
      		if(res.data.data.amount==undefined){
      			res.data.data.amount = 0;
      		}
	        that.setData({
	        	pageNum:pageNum+1,
	        	amount:amount+res.data.data.amount,
	        	quantity:quantity+res.data.data.quantity,
	        	transQuantity:transQuantity+res.data.data.transQuantity
	        })
	        if(loadType=="load" || (loadType=="refresh" && res.data.data.token!=token)){
	        	that.setData({
	        		taskReceiptList:taskReceiptList
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
