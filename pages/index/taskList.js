var app = getApp();
Page({
	data:{
		userInfo:null,
		hasUserInfo:false,
		taskList:[],
		taskingNumber:0,
		taskDoneNumber:0,
		searchBoxShow:false,
		filterBoxShow:false,
		startTime:'',
		endTime:'',
		status:'',
		pageNum:0,
		canLoad:true,
		todayInCount:0,
		todayAllCount:0,
		key:'',
		canIUse: wx.canIUse('button.open-type.getUserInfo')  
	},
	onPullDownRefresh: function(){
        let that = this;
        that.onLoad();
    },
    onReachBottom:function(){
		let that = this;
		wx.showNavigationBarLoading();
		ajaxLoad(that.data.pageNum,that);
	},
	detail:function(e){
		let id = e.currentTarget.dataset.id;
		let status = e.currentTarget.dataset.status;
		app.globalData.taskId = id;
		app.globalData.status = status;
		wx.switchTab({
	    	url:'/pages/task/list'
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
			taskList:[],
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
	filterSwitch:function(){
		let that = this;
		switch(that.data.filterBoxShow){
			case true:that.setData({filterBoxShow:false,key:''});break;
			case false:that.setData({filterBoxShow:true});break;
		}
	},
	onLoad:function(options){
		console.log("app onLoad");
		let taskingNumber = options.taskingNumber;
		let taskDoneNumber = options.taskDoneNumber;
		this.setData({
			taskingNumber:taskingNumber,
			taskDoneNumber:taskDoneNumber
		})
		if (app.globalData.userInfo) {  
			this.setData({  
				userInfo: app.globalData.userInfo,  
				hasUserInfo: true  
			})  
	    }  else if (this.data.canIUse){  
		      app.userInfoReadyCallback = res => {  
		        this.setData({  
		          userInfo: res.userInfo,  
		          hasUserInfo: true  
		        })  
		      }  
	    }
		ajaxLoad(0,this);
	}
})
var ajaxLoad = function(pageNum,that){
	if(!that.data.canLoad){
		wx.hideNavigationBarLoading();
		return;
	}
	let key = that.data.key;
	let startTime = that.data.startTime;
	let endTime = that.data.endTime;
	let status = that.data.status;
	wx.request({
      url: app.globalData.apiUrl + "/wx/purchase/taskList.htm",
      data: {pageNum:pageNum,key:key,startTime:startTime,endTime:endTime,status:status},
      success: function (res) {
      	wx.hideNavigationBarLoading();
      	if (res.data.retCode == '0') {
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
      		let taskDailyList = that.data.taskList.concat(res.data.data.taskDailyList);
	        that.setData({
	        	taskList:taskDailyList,
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
		util.errorCallback();
	  } 
    })   
}