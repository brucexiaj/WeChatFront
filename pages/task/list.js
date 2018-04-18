var app = getApp();
Page({
	data:{
		searchBoxShow:false,
		status:null,
		pageNum:0,
		canLoad:true,
		tab:'goods',
		key:'',
		taskDailyList:[],
		taskDailyDetailList:[]
	},
    onReachBottom:function(){
		let that = this;
		wx.showNavigationBarLoading();
		ajaxLoad(that.data.pageNum,that);
	},
	input:function(e){
		let key = e.detail.value;
		this.setData({
			key:key
		})
	},
	confirm:function(){
		this.setData({
			taskDailyList:[],
			taskDailyDetailList:[],
			pageNum:0,
			canLoad:true
		})
		ajaxLoad(0,this);
	},
	searchSwitch:function(){
		let that = this;
		switch(that.data.searchBoxShow){
			case true:that.setData({searchBoxShow:false,key:''});break;
			case false:that.setData({searchBoxShow:true});break;
		}
	},
	detail:function(e){
		let id = e.currentTarget.dataset.detailid;
		let goodsId = e.currentTarget.dataset.id;
		wx.navigateTo({
      		url: "../purchase/list?id="+id+"&goodsId="+goodsId
      	})	
	},
	switchTab:function(e){
		let that = this;
		let status = e.currentTarget.dataset.status;
		that.setData({
			status:status,
			taskDailyList:[],
			taskDailyDetailList:[],
			pageNum:0,
			canLoad:true
		});
		ajaxLoad(0,that);
	},
	switchOrder:function(e){
		let that = this;
		let order = e.currentTarget.dataset.order;
		that.setData({
			tab:order,
			taskDailyList:[],
			taskDailyDetailList:[],
			pageNum:0,
			canLoad:true
		});
		ajaxLoad(0,that);
	},
	onShow:function(){
		ajaxLoad(0,this);
	}
})
var ajaxLoad = function(pageNum,that){
	if(!that.data.canLoad){
		wx.hideNavigationBarLoading();
		return;
	}
	let key = that.data.key;
	let type = that.data.tab;
	let status = that.data.status;
	if(status=='null' || status==null){
		status = '';
	}
	wx.request({
      url: app.globalData.apiUrl + "/task/list.htm",
      data: {pageNum:pageNum,key:key,type:type,status:status},
      success: function (res) {
      	wx.hideNavigationBarLoading();
      	if (res.data.retCode == '0') {
      		if('order'==type){
      			if(res.data.data.taskDailyList ==null || res.data.data.taskDailyList ==undefined ||res.data.data.taskDailyList.length==0){
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
	      		let taskDailyList = that.data.taskDailyList.concat(res.data.data.taskDailyList);
		        that.setData({
		        	taskDailyList:taskDailyList,
		        	pageNum:pageNum+1
		        })
      		}else{
      			if(res.data.data.taskDailyDetailList ==null || res.data.data.taskDailyDetailList ==undefined ||res.data.data.taskDailyDetailList.length==0){
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
	      		let taskDailyDetailList = that.data.taskDailyDetailList.concat(res.data.data.taskDailyDetailList);
		        that.setData({
		        	taskDailyDetailList:taskDailyDetailList,
		        	pageNum:pageNum+1
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