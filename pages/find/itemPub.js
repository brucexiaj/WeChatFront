var app = getApp();
var bmap = require('../../utils/bmapwx.min.js');
Page({
	data:{
		mainPic:'',
		name:'',
		findAddress:'',
		buySite:'',
		detail:'',
		upc:'',
		skuValue:'',
		startDate:'',
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
		skuInfo:[{ "index": 0, "color":'', "scale":'', "collapse":true, "weight":'', "virtualInv":'', "costPrice":'', "purchasePrice":'', "salePrice":'', "upc":'', "discount":''}]
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
		this.setData({
			categoryName:threeCategoryList[0].allPath,
			categoryId:threeCategoryList[0].id,
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
			if(skuInfo[index-1].weight==''){
				wx.showToast({
			        title: "请填写重量",
			        icon: 'none',
			    	duration: 2000
			    });
			    return;
			}
			if(skuInfo[index-1].costPrice==''){
				wx.showToast({
			        title: "请填写原价",
			        icon: 'none',
			    	duration: 2000
			    });
			    return;
			}
			if(skuInfo[index-1].purchasePrice==''){
				wx.showToast({
			        title: "请填写折扣价",
			        icon: 'none',
			    	duration: 2000
			    });
			    return;
			}
			if(skuInfo[index-1].salePrice==''){
				wx.showToast({
			        title: "请填写销售价",
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
			if(skuInfo[index-1].discount==''){
				wx.showToast({
			        title: "请填写折扣率",
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
		if(skuInfo[index-1].weight==''){
			wx.showToast({
		        title: "请填写重量",
		        icon: 'none',
		    	duration: 2000
		    });
		    return;
		}
		if(skuInfo[index-1].costPrice==''){
			wx.showToast({
		        title: "请填写原价",
		        icon: 'none',
		    	duration: 2000
		    });
		    return;
		}
		if(skuInfo[index-1].purchasePrice==''){
			wx.showToast({
		        title: "请填写折扣价",
		        icon: 'none',
		    	duration: 2000
		    });
		    return;
		}
		if(skuInfo[index-1].salePrice==''){
			wx.showToast({
		        title: "请填写销售价",
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
		if(skuInfo[index-1].discount==''){
			wx.showToast({
		        title: "请填写折扣率",
		        icon: 'none',
		    	duration: 2000
		    });
		    return;
		}
		let newSkuInfoStr = skuInfo.slice(-1)[0];
		let newSkuInfo = JSON.parse(JSON.stringify(newSkuInfoStr));
		newSkuInfo.index++;
		newSkuInfo.collapse = true;
		newSkuInfo.scale = '';
		newSkuInfo.color = '';
		skuInfo.push(newSkuInfo);
		that.setData({
        	skuInfo:skuInfo
        })
	},
	inputGlobalCostPrice:function(e){
		let skuInfo = this.data.skuInfo;
		if(skuInfo[0].costPrice){
			return;
		}
		let value = e.detail.value;
		skuInfo[0].costPrice = value;
		this.setData({
        	skuInfo:skuInfo
        })
	},
	inputGlobalPurchasePrice:function(e){
		let skuInfo = this.data.skuInfo;
		if(skuInfo[0].purchasePrice){
			return;
		}
		let value = e.detail.value;
		skuInfo[0].purchasePrice = value;
		this.setData({
        	skuInfo:skuInfo
        })
	},
	inputGlobalSalePrice:function(e){
		let skuInfo = this.data.skuInfo;
		if(skuInfo[0].salePrice){
			return;
		}
		let value = e.detail.value;
		skuInfo[0].salePrice = value;
		this.setData({
        	skuInfo:skuInfo
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
	inputSalePrice:function(e){
		let index = e.currentTarget.dataset.index;
		let value = e.detail.value;
		let that = this;
		let skuInfo = that.data.skuInfo;
		skuInfo[index].salePrice = value;
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
	    if(e.id!=""){
	    	wx.request({
		      url: app.globalData.apiUrl + "/find/detail.htm?id="+e.id,
		      success: function (res) {
		      	wx.hideNavigationBarLoading();
		      	if (res.data.retCode == '0') {
		      		let item = res.data.data.item;
		      		let category = res.data.data.category;
		      		let skuInfo = res.data.data.itemSkuList;
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
			    		name:item.name
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
		}
		param.purchaseStatus = purchaseStatus;
		param.name = that.data.name;
		if(that.data.name==null){
			wx.showToast({
                title: '请输入商品名称',
            });
			return;
		}
		param.categoryId = that.data.categoryId;
		if(that.data.categoryId==null){
			wx.showToast({
                title: '请选择分类',
            });
			return;
		}
		if(that.data.mainPic==null){
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
		if(that.data.brand==null){
			wx.showToast({
                title: '请填写品牌',
            });
			return;
		}
		param.reason =that.data.reason;
		param.startDate=that.data.startDate;
		param.endDate=that.data.endDate;
		param.buySite=that.data.buySite;
		param.findAddress=that.data.findAddress;
		param.buyerId = parseInt(app.globalData.buyerId);
		param.detail=that.data.detail;
		param.remark=that.data.remark;
		param.pictureList = that.data.param;
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