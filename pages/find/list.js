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
		scrollTop:0
	},
	onPageScroll:function(e){
		if(abs(this.data.scrollTop - e.scrollTop)>60){	
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
		console.log("app onShow");
		this.setData({
			delBtnWidth:180,
			findItemList:[],
			canLoad:true,
			pageNum:0,
			scrollTop:0
		})
		this.initEleWidth();
		ajaxLoad(0,this)
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
			findItemList:[],
			canLoad:true,
			pageNum:0
		});
		ajaxLoad(0,that);
	},
	editItem:function(e){
		let id = e.currentTarget.dataset.id;
		wx.navigateTo({
      		url: "../find/itemPub?id="+id
      	})	
	},
	goDetail:function(e){
		let id = e.currentTarget.dataset.id;
		wx.navigateTo({
      		url: "../find/itemDetail?id="+id
      	})	
	},
	pub:function(e){
		let id = '';
		let that = this;
		wx.scanCode({
            success: (res) => {
                let upc = res.result; 
                wx.request({
	                url: app.globalData.apiUrl + '/find/scan.htm',
	                data: {upc:upc},
	                success: function (res) {
	                	console.log("扫码返回upc"+upc);
	                	if(res.data.retCode=='0'){
	                		id = res.data.data;
	                	}	
	                }
	            })
            },
            complete:(res)=>{
            	wx.navigateTo({
		      		url: "../find/itemPub?id="+id
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
			findItemList:[],
			canLoad:true,
			filterBoxShow:false,
			pageNum:0,
			orderTimeType:orderTimeType
		})
		ajaxLoad(0,that);
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
		wx.request({
	      url: app.globalData.apiUrl + "/find/audit.htm",
	      data: {id:id,status:status,buyerId:app.globalData.buyerId},
	      success: function (res) {
	      	wx.hideNavigationBarLoading();
	      	if (res.data.retCode == '0') {
	      		findItemList[index].purchaseStatus =status;
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
})
let ajaxLoad = function(pageNum,that){
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
      		if(res.data.data.findItemList ==null || res.data.data.findItemList ==undefined ||res.data.data.findItemList.length==0){
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
      		if(res.data.data.findItemList.length<app.globalData.pageSize){
      			that.setData({
		        	canLoad:false
		        })
      		}
      		let findItemList = that.data.findItemList.concat(res.data.data.findItemList);
	        that.setData({
	        	findItemList:findItemList,
	        	passed:res.data.data.passed,
	        	audit:res.data.data.audit,
	        	countAll:res.data.data.countAll,
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
	  	wx.stopPullDownRefresh();
		util.errorCallback();
	  } 
    })   
}