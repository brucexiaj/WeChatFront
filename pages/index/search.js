var app = getApp();
Page({
	data:{
		taskList:[],
		pageNum:0,
		canLoad:true,
		key:''
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
	detail:function(e){
		let id = e.currentTarget.dataset.id;
		let status = e.currentTarget.dataset.status;
		app.globalData.taskId = id;
		app.globalData.status = status;
		wx.switchTab({
	    	url:'/pages/task/list'
	    })
	},
	onLoad:function(){
		var that = this;
		that.setData({
			taskList:[],
			pageNum:0,
			canLoad:true
		})
	}
})
var ajaxLoad = function(pageNum,that){
	if(that.data.key.trim()==''){
		wx.showToast({
	        title: "请输入关键字",
	        icon: 'none',
	    	duration: 2000
	    });
	    return;
	}
	if(!that.data.canLoad){
		wx.hideNavigationBarLoading();
		return;
	}
	wx.request({
      url: app.globalData.apiUrl + "/wx/purchase/taskList.htm",
      data: {pageNum:pageNum,key:that.data.key},
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