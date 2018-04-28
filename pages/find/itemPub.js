var app = getApp();
var bmap = require('../../utils/bmapwx.min.js');
var util = require('../../utils/util.js');
var returnFloat = function (value) {
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
    }
    if (xsd.length > 1) {
        if (xsd[1].length < 2) {
            value = value.toString() + "0";
        }
        return value;
    }
}
Page({
	data:{
		globalCostPrice:'0.00',
		globalPurchasePrice:'0.00',
		globalDiscount:1,
		mainPic:'',
		name:'',
		findAddress:'',
		buySite:'',
		detail:'',
		upc:'',
		skuValue:'',
		startDate:'',
		id:'',
		endDate:'',
		category:null,
		item:['','',''],
		pictureList:[],
		itemClass:['','',''],
		threeCategoryList:[],
		popFlag:false,
		popType:'sku',
		detailFlag:false,
		skuBoxFlag:false,
		categoryFlag:false,
		brand:'',
		categoryItem:0,
		secondCategoryItem:0,
		threeCategoryItem:0,
		categoryId:null,
		categoryName:'',
		mainProgress:'0px',
		uploadType:'mainPic',
		itemUploadIndex:0,
		currency:'$',
		itemProgress:['0px','0px','0px'],
		skuInfo:[{ "index": 0, "color":'', "scale":'', "collapse":true, "weight":0.0, "virtualInv":0, "costPrice":0.00, "purchasePrice":0.00,"model":'', "salePrice":0.00, "upc":'', "discount":0}]
	},
	bindTextAreaInput:function(e){
		this.setData({
			detail:e.detail.value
		})
	},
	name:function(e){
		this.setData({
			name:e.detail.value
		})
	},
	reason:function(e){
		this.setData({
			reason:e.detail.value
		})
	},
	remark:function(e){
		this.setData({
			remark:e.detail.value
		})
	},
	brand:function(e){
		this.setData({
			brand:e.detail.value
		})
	},
	closePop:function(){
		this.setData({
			popFlag:false,
			skuBoxFlag:false,
			categoryFlag:false,
			detailFlag:false
		})
	},
	showDetail:function(){
		this.setData({
			popType:'detail',
			popFlag:true,
			detailFlag:true
		})
	},
	choseConfirm:function(){
		let threeCategoryList = this.data.threeCategoryList;
		let threeCategoryItem = this.data.threeCategoryItem;
		this.setData({
			categoryName:threeCategoryList[threeCategoryItem].allPath,
			categoryId:threeCategoryList[threeCategoryItem].id,
			popFlag:false,
			categoryFlag:false
		})
	},
	cancelChoseCategoty:function(){
		this.setData({
			popFlag:false,
			categoryFlag:false
		})
	},
	choseThreeCategoryItem:function(e){
		let that = this;
		let threeCategoryItem = e.currentTarget.dataset.index;
		that.setData({
        	threeCategoryItem:threeCategoryItem
        })
	},
	choseSecondCategoryItem:function(e){
		let that = this;
		let pid = e.currentTarget.dataset.id;
		let threeCategoryList = [];
		let secondCategoryItem = e.currentTarget.dataset.index;
		wx.request({
	      url: app.globalData.apiUrl + "/data/child_list.htm?pid="+pid,
	      success: function (res) {
	      	wx.hideNavigationBarLoading();
	      	if (res.data.retCode == '0') {
	      		threeCategoryList = res.data.data;
		    }
		    that.setData({
	        	threeCategoryList:threeCategoryList,
	        	secondCategoryItem:secondCategoryItem
	        })
	      }
	    })  
	},
	choseCategoryItem:function(e){
		let that = this;
		let index = e.currentTarget.dataset.index;
		let threeCategoryList = [];
		let pid = that.data.category[index].categoryList[0].id;
		wx.request({
	      url: app.globalData.apiUrl + "/data/child_list.htm?pid="+pid,
	      success: function (res) {
	      	wx.hideNavigationBarLoading();
	      	if (res.data.retCode == '0') {
		        that.setData({
		        	threeCategoryList:res.data.data,
		        })
		    }
	      }
	    })  
		this.setData({
			categoryItem:index,
			secondCategoryItem:0,
			threeCategoryItem:0
		})
	},
	choseCategory:function(){
		let that = this;
		that.setData({
			categoryFlag:!that.data.categoryFlag,
			popFlag:!that.data.popFlag,
		})
		let threeCategoryList = [];
		let pid = that.data.category[0].categoryList[0].id;
		wx.request({
	      url: app.globalData.apiUrl + "/data/child_list.htm?pid="+pid,
	      success: function (res) {
	      	wx.hideNavigationBarLoading();
	      	if (res.data.retCode == '0') {
		        that.setData({
		        	threeCategoryList:res.data.data,
		        })
		    }
	      }
	    })
	},
	confirm:function(){
		if(this.data.popType=="sku"){
			let skuValue = '';
			let skuInfo = this.data.skuInfo;
			let index = skuInfo.length;
			if(skuInfo[index-1].color==''){
				wx.showToast({
			        title: "请填写颜色",
			        icon: 'none',
			    	duration: 2000
			    });
			    return;
			}
			if(skuInfo[index-1].upc==''){
				wx.showToast({
			        title: "请填写upc",
			        icon: 'none',
			    	duration: 2000
			    });
			    return;
			}
			for(let i in skuInfo){
				skuValue =skuValue +"“"+skuInfo[i].color+" "+skuInfo[i].scale+","+skuInfo[i].virtualInv+"件”"
			}
			this.setData({
				popFlag:false,
				skuBoxFlag:false,
				skuValue:skuValue
			})
		}else{
			this.setData({
				popFlag:false,
				categoryFlag:false
			})
		}
	},
	openSkuPopBox:function(){
		this.setData({
			popType:'sku',
			popFlag:true,
			skuBoxFlag:true
		})
	},
	scan:function(e){
		let index = e.currentTarget.dataset.index;
		let that = this;
		let skuInfo = that.data.skuInfo;
		wx.scanCode({
            success: (res) => {
                let upc = res.result;
                skuInfo[index].upc = upc;
                that.setData({
                	skuInfo:skuInfo
                })
            }
        })        
	},
	addSku:function(){
		let that = this;
		let skuInfo = that.data.skuInfo;
		let index = that.data.skuInfo.length;
		if(skuInfo[index-1].color==''){
			wx.showToast({
		        title: "请填写颜色",
		        icon: 'none',
		    	duration: 2000
		    });
		    return;
		}
		if(skuInfo[index-1].upc==''){
			wx.showToast({
		        title: "请填写upc",
		        icon: 'none',
		    	duration: 2000
		    });
		    return;
		}
		let newSkuInfoStr = skuInfo.slice(-1)[0];
		let newSkuInfo = JSON.parse(JSON.stringify(newSkuInfoStr));
		newSkuInfo.index++;
		newSkuInfo.collapse = true;
		skuInfo.push(newSkuInfo);
		that.setData({
        	skuInfo:skuInfo
        })
	},
	inputGlobalCostPrice:function(e){
		let skuInfo = this.data.skuInfo;
		let value = e.detail.value;
		skuInfo[0].costPrice = value;
		let discount = this.data.globalDiscount;
		if(discount!=null || discount!=''){
			value = discount*value
		}
		this.setData({
        	skuInfo:skuInfo,
        	globalPurchasePrice:value,
        	globalCostPrice:e.detail.value
        })
	},
	focusCostPrice:function(e){
		let globalCostPrice = this.data.globalCostPrice;
		if(globalCostPrice=="0.00"){	
			globalCostPrice = "";
		}
		this.setData({
			globalCostPrice:globalCostPrice
		})
	},
	focusPurchasePrice:function(){
		let globalPurchasePrice = this.data.globalPurchasePrice;
		if(globalPurchasePrice=="0.00"){	
			globalPurchasePrice = "";
		}
		this.setData({
			globalPurchasePrice:globalPurchasePrice
		})
	},
	inputGlobalDiscount:function(e){
		let skuInfo = this.data.skuInfo;
		let value = e.detail.value;
		skuInfo[0].discount = value;
		let globalCostPrice = this.data.globalCostPrice;
		let globalPurchasePrice = returnFloat(globalCostPrice*e.detail.value);
		this.setData({
        	skuInfo:skuInfo,
        	globalDiscount:e.detail.value,
        	globalPurchasePrice:globalPurchasePrice
        })
	},
	inputGlobalPurchasePrice:function(e){
		let skuInfo = this.data.skuInfo;
		let value = e.detail.value;
		skuInfo[0].purchasePrice = value;
		let discount = returnFloat(e.detail.value / this.data.globalCostPrice);
		skuInfo[0].discount = discount;
		this.setData({
        	skuInfo:skuInfo,
        	globalPurchasePrice:e.detail.value,
        	globalDiscount:discount
        })
	},
	inputColor:function(e){
		let index = e.currentTarget.dataset.index;
		let value = e.detail.value;
		let that = this;
		let skuInfo = that.data.skuInfo;
		skuInfo[index].color = value;
		that.setData({
        	skuInfo:skuInfo
        })
	},
	inputModel:function(e){
		let index = e.currentTarget.dataset.index;
		let value = e.detail.value;
		let that = this;
		let skuInfo = that.data.skuInfo;
		skuInfo[index].model = value;
		that.setData({
        	skuInfo:skuInfo
        })
	},
	inputSize:function(e){
		let index = e.currentTarget.dataset.index;
		let value = e.detail.value;
		let that = this;
		let skuInfo = that.data.skuInfo;
		skuInfo[index].scale = value;
		that.setData({
        	skuInfo:skuInfo
        })
	},
	inputWeight:function(e){
		let index = e.currentTarget.dataset.index;
		let value = e.detail.value;
		let that = this;
		let skuInfo = that.data.skuInfo;
		skuInfo[index].weight = value;
		that.setData({
        	skuInfo:skuInfo
        })
	},
	collapse:function(e){
		let index = e.currentTarget.dataset.index;
		let skuInfo = this.data.skuInfo;
		skuInfo[index].collapse = !skuInfo[index].collapse ;
		this.setData({
        	skuInfo:skuInfo
        })
	},
	inputVirtualInv:function(e){
		let index = e.currentTarget.dataset.index;
		let value = e.detail.value;
		let that = this;
		let skuInfo = that.data.skuInfo;
		skuInfo[index].virtualInv = value;
		that.setData({
        	skuInfo:skuInfo
        })
	},
	inputCostPrice:function(e){
		let index = e.currentTarget.dataset.index;
		let value = e.detail.value;
		let that = this;
		let skuInfo = that.data.skuInfo;
		skuInfo[index].costPrice = value;
		that.setData({
        	skuInfo:skuInfo
        })
	},
	inputPurchasePrice:function(e){
		let index = e.currentTarget.dataset.index;
		let value = e.detail.value;
		let that = this;
		let skuInfo = that.data.skuInfo;
		skuInfo[index].purchasePrice = value;
		that.setData({
        	skuInfo:skuInfo
        })
	},
	inputPurchasePrice:function(e){
		let index = e.currentTarget.dataset.index;
		let value = e.detail.value;
		let that = this;
		let skuInfo = that.data.skuInfo;
		skuInfo[index].purchasePrice = value;
		that.setData({
        	skuInfo:skuInfo
        })
	},
	inputUpc:function(e){
		let index = e.currentTarget.dataset.index;
		let value = e.detail.value;
		let that = this;
		let skuInfo = that.data.skuInfo;
		skuInfo[index].upc = value;
		that.setData({
        	skuInfo:skuInfo
        })
	},
	inputDiscount:function(e){
		let index = e.currentTarget.dataset.index;
		let value = e.detail.value;
		let that = this;
		let skuInfo = that.data.skuInfo;
		skuInfo[index].discount = value;
		that.setData({
        	skuInfo:skuInfo
        })
	},
	onLoad:function(e){
		let that = this;
		let upc = e.upc;
    	if(upc!=null){
    		let skuInfo = that.data.skuInfo;
    		skuInfo[0].upc = upc;
    		that.setData({
    			skuInfo:skuInfo
    		})
    	}
    	let startDate = util.formatTime(new Date()).substring(0, 10).replace(/\//g, '-');//当前时间
        that.setData({
            startDate: startDate
        });
		wx.request({
	      url: app.globalData.apiUrl + "/data/list.htm",
	      success: function (res) {
	      	wx.hideNavigationBarLoading();
	      	if (res.data.retCode == '0') {
		        that.setData({
		        	category:res.data.data.category,
		        })
		    }else {
	            wx.showToast({
			        title: "获取分类数据失败",
			        icon: 'none',
			    	duration: 2000
			    })
	        }
	      }
	    })  
	    if(e.id!="" && e.id !=undefined){
	    	wx.request({
		      url: app.globalData.apiUrl + "/find/detail.htm?id="+e.id,
		      success: function (res) {
		      	wx.hideNavigationBarLoading();
		      	if (res.data.retCode == '0') {
		      		let item = res.data.data.item;
		      		let category = res.data.data.category;
		      		if(category==null || category==undefined){
		      			category = ""
		      		}
		      		let skuInfo = res.data.data.itemSkuList;
		      		let skuValue ="";
		      		for(let i in skuInfo){
						skuValue =skuValue +"“"+skuInfo[i].color+" "+skuInfo[i].scale+","+skuInfo[i].virtualInv+"件”";
						skuInfo[i].collapse = true;
					}
			    	that.setData({
			    		categoryName:category.allPath,
			    		categoryId:category.id,
			    		mainPic:item.pictureList[0].url,
			    		reason:item.reason,
			    		startDate:item.startDateStr,
			    		endDate:item.endDateStr,
			    		findAddress:item.findAddress,
			    		buySite:item.buySite,
			    		detail:item.detail,
			    		remark:item.remark,
			    		brand:item.brand,
			    		name:item.name,
			    		id:e.id,
			    		skuInfo:skuInfo,
			    		skuValue:skuValue
			    	})
			    }
		      }
		    })
	    }else{
	    	let BMap = new bmap.BMapWX({
	            ak: '4AiKHbwIFi7ipjFO8d8qWpaizMSW5yBG'
	        });
	        let fail = function(data){
	        	console.log(data)
	        }
	        let success = function (data) {
	            that.setData({
	                findAddress: data.wxMarkerData[0].address,
	                buySite:data.wxMarkerData[0].address
	            });
	        }
	        BMap.regeocoding({
	        	fail:fail,
	            success: success
	        });
	    }
        
	},
	choseAddress:function(e){
		let that = this;
		let type = e.currentTarget.dataset.type;
		wx.chooseLocation({
			success: function(res) {
				switch(type){
					case "site":that.setData({ buySite:res.address });break;
					case "address":that.setData({ findAddress:res.address});break;
				}
			}
		})
	},
	scanUpc: function (e) {
        let that = this;
        let upc = '';
        wx.scanCode({
            success: (res) => {
                upc = res.result;
                that.setData({
                	upc:upc
                })
            }
        })      
    },
    bindStartDateChange:function(e){
		let startDate = e.detail.value;
		this.setData({
			startDate:startDate
		})
	}, 
    bindEndDateChange:function(e){
		let endDate = e.detail.value;
		this.setData({
			endDate:endDate
		})
	},
	choseImg:function(e){
		let type = e.currentTarget.dataset.type;
		let index = e.currentTarget.dataset.index;
		let that = this;
		let count = 1;
		if("mainPic"==type){
			count = 9;
		}
		that.setData({
			uploadType:type,
			itemUploadIndex:index
		})
		wx.chooseImage({
		    count: count,
		    success: function (res) {
	    		let tempFilePaths = res.tempFilePaths;
				if("mainPic"==type){
					for (let i in tempFilePaths) { 
						that.uploadFileServer(that,tempFilePaths[i],i,type);
				    }	
	    		}else{
				    that.uploadFileServer(that,tempFilePaths[0],index,type)
	    		}
		    }
		})
	},
	uploadFileServer:function(that, filePath, i,type) {
    	const uploadTask = wx.uploadFile({ 
			url:  app.globalData.apiUrl + "/find/upload.htm",
			filePath: filePath,
			name: 'item',
			success: function(res){
				let resData = JSON.parse(res.data);
		        let data = resData.data.pictureList;
		        if(type=="mainPic"){
		        	if(i==0){
			        	that.setData({
					    	mainPic:data[0]
					    })
				    }else{
				    	let item = that.data.item;
			        	let itemClass = that.data.itemClass;
			        	let itemProgress = that.data.itemProgress;
			        	item[i-1] = data[0]
			        	itemClass[i-1] = 'on';
			   			itemProgress[i-1] = '0px';
			        	that.setData({
					    	item:item,
					    	itemClass:itemClass,
					    	itemProgress:itemProgress
					    })
				    }
		        }else{
		        	let item = that.data.item;
		        	let itemClass = that.data.itemClass;
		        	let itemProgress = that.data.itemProgress;
		        	item[i] = data
		        	itemClass[i] = 'on';
		        	itemProgress[i] = '0px';
		        	that.setData({
				    	item:item,
				    	itemClass:itemClass,
				    	itemProgress:itemProgress
				    })
		        }    
			}    
		})
		uploadTask.onProgressUpdate((res) => {
		    if(that.data.uploadType=='mainPic'){
		    	if(i==0){
		    		that.setData({
			    		mainProgress:res.progress+'px'
			    	})
			    	if(res.progress==100){
			    		that.setData({
				    		mainProgress:'0px'
				    	})
			    	}
		    	}else{
		    		let itemProgress = that.data.itemProgress;
			    	itemProgress[i-1] = res.progress+'px';
			    	that.setData({
			    		itemProgress:itemProgress
			    	})
		    	}	
		    }else{
		    	let itemProgress = that.data.itemProgress;
		    	itemProgress[i] = res.progress+'px';
		    	that.setData({
		    		itemProgress:itemProgress
		    	})
		    }
		})
	},
	submit:function(e){
		let type = e.currentTarget.dataset.type;
		let that = this;
		let param = {};
		let purchaseStatus = 0;
		if(type=="save"){
			purchaseStatus = 2;
		}else{
			if(that.data.skuInfo[0].color==''|| that.data.skuInfo[0].costPrice=='' || that.data.skuInfo[0].discount==''|| that.data.skuInfo[0].purchasePrice=='' || that.data.skuInfo[0].upc==''){
				wx.showToast({
	                title: '请补全规格信息',
	            });
				return;
			}
		}
		param.purchaseStatus = purchaseStatus;
		param.name = that.data.name;
		if(that.data.name==null || that.data.name==''){
			wx.showToast({
                title: '请输入商品名称',
            });
			return;
		}
		param.categoryId = that.data.categoryId;
		if(that.data.categoryId==null || that.data.categoryId==''){
			wx.showToast({
                title: '请选择分类',
            });
			return;
		}
		if(that.data.mainPic==null || that.data.mainPic==''){
			wx.showToast({
                title: '请上传图片',
            });
			return;
		}
		that.data.pictureList[0] = that.data.mainPic;
		for(let i=0;i<that.data.item.length;i++){
			if(that.data.item[i]!=""){
				that.data.pictureList[i+1] = that.data.item[i];
			}
		}
		param.brand = that.data.brand;
		param.mainPic = that.data.pictureList;
		param.reason =that.data.reason;
		param.startDate=that.data.startDate;
		param.endDate=that.data.endDate;
		param.buySite=that.data.buySite;
		param.findAddress=that.data.findAddress;
		param.buyerId = parseInt(app.globalData.buyerId);
		param.detail=that.data.detail;
		param.remark=that.data.remark;
		param.pictureList = that.data.pictureList;
		param.id = that.data.id;
		let skuInfo = that.data.skuInfo;
		param.skuInfo = skuInfo;
		wx.request({
	      url: app.globalData.apiUrl + "/find/save.htm",
	      method:"POST",
	      data: param,
	      success: function (res) {
	      	wx.hideNavigationBarLoading();
	      	if (res.data.retCode == '0') {
			    wx.switchTab({
			    	url:'list'
			    })
		    }
	      }
	    }) 
	}   
})