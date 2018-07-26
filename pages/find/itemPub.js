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
		mode:"scaleToFill",
		popSwiperBox:false,
	    arr:[],
	    unit:'克',
	    indicatorDots: true,
	    autoplay: false,
	    interval: 1000,
	    currencyFlag:false,
	    duration: 300,
		globalCostPrice:'0.00',
		globalPurchasePrice:'0.00',
		globalDiscount:100,
		name:'',
		selectIndex:'',
		findAddress:'',
		startDateLimit:'',
		buySite:'',
		detail:'',
		upc:'',
		skuValue:'',
		startDate:'',
		id:'',
		endDate:'',
		category:null,
		item:['','','','','','','','',''],
		pictureList:[],
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
		percent:'%',
		current:0,
		swiperHeight:wx.getSystemInfoSync().windowWidth/3,
		itemProgress:['0px','0px','0px','0px','0px','0px','0px','0px','0px'],
		skuInfo:[{ "index": 0, "color":'', "scale":'', "collapse":true, "weight":0.0, "virtualInv":0, "costPrice":0.00, "purchasePrice":0.00,"model":'', "salePrice":0.00, "upc":'', "discount":0}]
	},
	bindTextAreaInput:function(e){
		this.setData({
			detail:e.detail.value
		})
	},
	selectUnit:function(){
		this.setData({
			unitFlag:true
		})
	},
	choseUnit:function(e){
		this.setData({
			unitFlag:false,
			unit:e.currentTarget.dataset.type
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

	setBuySite:function(e){
		console.log("input buysite:"+e.detail.value)
		this.setData({
			buySite:e.detail.value
		})
	},
	setFindAddress:function(e){
		console.log("input add:"+e.detail.value)
		this.setData({
			findAddress:e.detail.value
		})
	},
	remark:function(e){
		this.setData({
			remark:e.detail.value
		})
	},
	choseCurrency:function(e){
		let type = e.currentTarget.dataset.type;
		this.setData({
			currency:type,
			currencyFlag:false
		})
	},
	mytouchstart: function (e) {  
		let that = this;  
		that.setData({  
			touch_start: e.timeStamp  
		})  
	},  
	mytouchend: function (e) {  
		let that = this;  
		that.setData({  
			touch_end: e.timeStamp  
		})  
	}, 
	selectCurrency:function(e){
		this.setData({
			currencyFlag:true
		})
	},
	closePopSwiperBox:function(){
		this.setData({
			popSwiperBox:false
		})
	},	
	settingImg:function(e){
		console.log("aaa");
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
		console.log(this)
		let that = this;
		that.setData({
			categoryFlag:!that.data.categoryFlag,
			popFlag:!that.data.popFlag,
		})
		let threeCategoryList = [];
		// console.log(that.data)
		// console.log(that.data.category[0])
		// console.log(that.data.category[0].categoryList[0])
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
			        title: "请填写规格一",
			    	duration: 2000
			    });
			    return;
			}
			if(skuInfo[index-1].upc==''){
				wx.showToast({
			        title: "请填写upc",
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
		        title: "请填写规格一",
		    	duration: 2000
		    });
		    return;
		}
		if(skuInfo[index-1].upc==''){
			wx.showToast({
		        title: "请填写upc",
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
		let discount = this.data.globalDiscount;
		if(discount!=null || discount!=''){
			value = discount*value/100
		}
		skuInfo[0].purchasePrice = value;
		skuInfo[0].discount = this.data.globalDiscount;
		skuInfo[0].costPrice = e.detail.value;
		this.setData({
        	skuInfo:skuInfo,
        	globalPurchasePrice:value,
        	globalCostPrice:e.detail.value
        })
	},
	inputGlobalDiscount:function(e){
		let skuInfo = this.data.skuInfo;
		let value = e.detail.value;
		let globalCostPrice = this.data.globalCostPrice;
		let globalPurchasePrice = returnFloat(globalCostPrice*e.detail.value/100);
		skuInfo[0].purchasePrice =globalPurchasePrice;
		skuInfo[0].discount = e.detail.value;
		skuInfo[0].costPrice = this.data.globalCostPrice;
		this.setData({
        	skuInfo:skuInfo,
        	globalDiscount:e.detail.value,
        	globalPurchasePrice:globalPurchasePrice
        })
	},
	inputGlobalPurchasePrice:function(e){
		let skuInfo = this.data.skuInfo;
		let value = e.detail.value;
		let discount = returnFloat(e.detail.value / this.data.globalCostPrice*100);
		skuInfo[0].purchasePrice = e.detail.value;
		skuInfo[0].discount = discount;
		skuInfo[0].costPrice = this.data.globalCostPrice;
		this.setData({
        	skuInfo:skuInfo,
        	globalPurchasePrice:e.detail.value,
        	globalDiscount:discount
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
	focusDiscount:function(e){
		let globalDiscount = this.data.globalDiscount;
		if(globalDiscount=="100.00"){	
			globalDiscount = "";
		}
		this.setData({
			globalDiscount:globalDiscount
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
	iFocus:function(e){
		let index = e.currentTarget.dataset.index;
		let that = this;
		let skuInfo = that.data.skuInfo;
		if(skuInfo[index].virtualInv==0){
			skuInfo[index].virtualInv =''
		}
		that.setData({
        	skuInfo:skuInfo
        })
	},
	iBlur:function(e){
		let index = e.currentTarget.dataset.index;
		let that = this;
		let skuInfo = that.data.skuInfo;
		if(skuInfo[index].virtualInv==''){
			skuInfo[index].virtualInv =0
		}
		that.setData({
        	skuInfo:skuInfo
        })
	},
	cpFocus:function(e){
		let index = e.currentTarget.dataset.index;
		let that = this;
		let skuInfo = that.data.skuInfo;
		if(skuInfo[index].costPrice==0){
			skuInfo[index].costPrice =''
		}
		that.setData({
        	skuInfo:skuInfo
        })
	},
	cpBlur:function(e){
		let index = e.currentTarget.dataset.index;
		let that = this;
		let skuInfo = that.data.skuInfo;
		if(skuInfo[index].costPrice==''){
			skuInfo[index].costPrice =0
		}
		that.setData({
        	skuInfo:skuInfo
        })
	},
	dFocus:function(e){
		let index = e.currentTarget.dataset.index;
		let that = this;
		let skuInfo = that.data.skuInfo;
		if(skuInfo[index].discount==0){
			skuInfo[index].discount =''
		}
		that.setData({
        	skuInfo:skuInfo
        })
	},
	dBlur:function(e){
		let index = e.currentTarget.dataset.index;
		let that = this;
		let skuInfo = that.data.skuInfo;
		if(skuInfo[index].discount==''){
			skuInfo[index].discount =0
		}
		that.setData({
        	skuInfo:skuInfo
        })
	},
	wFocus:function(e){
		let index = e.currentTarget.dataset.index;
		let that = this;
		let skuInfo = that.data.skuInfo;
		if(skuInfo[index].weight==0){
			skuInfo[index].weight =''
		}
		that.setData({
        	skuInfo:skuInfo
        })
	},
	wBlur:function(e){
		let index = e.currentTarget.dataset.index;
		let that = this;
		let skuInfo = that.data.skuInfo;
		if(skuInfo[index].weight==''){
			skuInfo[index].weight =0
		}
		that.setData({
        	skuInfo:skuInfo
        })
	},
	ppFocus:function(e){
		let index = e.currentTarget.dataset.index;
		let that = this;
		let skuInfo = that.data.skuInfo;
		if(skuInfo[index].purchasePrice==0){
			skuInfo[index].purchasePrice =''
		}
		that.setData({
        	skuInfo:skuInfo
        })
	},
	ppBlur:function(e){
		let index = e.currentTarget.dataset.index;
		let that = this;
		let skuInfo = that.data.skuInfo;
		if(skuInfo[index].purchasePrice==''){
			skuInfo[index].purchasePrice =0
		}
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
		let items = this.data.item;
		let globalCostPrice = this.data.globalCostPrice
		let globalPurchasePrice = this.data.globalPurchasePrice
		//let globalDiscount = this.data.globalDiscount
		let globalDiscount = this.data.globalDiscount
		
    	if(upc!=null){
    		let skuInfo = that.data.skuInfo;
    		skuInfo[0].upc = upc;
    		that.setData({
    			skuInfo:skuInfo
    		})
    	}
    	let endTime = new Date();
        endTime.setDate(endTime.getDate()+7);

    	let startDate = util.formatTime(new Date()).substring(0, 10).replace(/\//g, '-');//当前时间
        let endDate = util.formatTime(endTime).substring(0, 10).replace(/\//g, '-');//当前时间
        that.setData({
            startDateLimit: startDate,
            startDate:startDate,
            endDateLimit: endDate,
            endDate:endDate
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
		      		let itemList = res.data.data.item.pictureArr;
		      		for(let i in itemList){
		      			items[i] = itemList[i]
		      		}
		      		let skuValue ="";
		      		for(let i in skuInfo){
						skuValue =skuValue +"“"+skuInfo[i].color+" "+skuInfo[i].scale+","+skuInfo[i].virtualInv+"件”";
						skuInfo[i].collapse = true;
					}
					if(skuInfo[0]){
						globalCostPrice = skuInfo[0].costPrice
						globalPurchasePrice = skuInfo[0].purchasePrice
						globalDiscount = skuInfo[0].discount*100
                        skuInfo[0].discount = globalDiscount;
						console.log("globalDiscount:"+globalDiscount)
					}
			    	that.setData({
			    		categoryName:category.allPath,
			    		categoryId:category.id,
			    		reason:item.reason,
			    		item:items,
			    		startDate:item.startDateStr,
			    		endDate:item.endDateStr,
			    		findAddress:item.findAddress,
			    		buySite:item.buySite,
			    		detail:item.detail,
			    		remark:item.remark,
			    		brand:item.brand,
			    		name:item.itemName,
			    		id:e.id,
			    		skuInfo:skuInfo,
			    		skuValue:skuValue,
			    		globalCostPrice:globalCostPrice,
						globalPurchasePrice:globalPurchasePrice,
						globalDiscount:globalDiscount
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
		console.log("您在添加或者修改站点或者地点");
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
	setFirst:function(e){
		console.log('设置首图');
	},
	delImg:function(e){
		console.log('删除图片');
	},
	choseImg:function(e){
		let type = e.currentTarget.dataset.type;
		let index = e.currentTarget.dataset.index;
		let item = this.data.item;
		let size = item.length;
		console.log("size: " + size)
		let that = this;
		let count = 1;
		if("mainPic"==type){
			count = 9;
		}
        if("itemPic"==type){
		    //修改值
            let size = 0;
            for(let i in item){
                if(item[i] ==null || item[i] == "" || item[i] == undefined){

                }else {
                    size++;
                }
            }
            count = 9 - size;
            console.log("size: "+size);
            console.log("count: "+count);
        }
		that.setData({
            itemUploadIndex:index
		})
		if("mainPic"!=type && item[index]!=''){
			this.setData({
				popSwiperBox:true
			})
		}else{
			wx.chooseImage({
			    count: count,
			    success: function (res) {
		    		let tempFilePaths = res.tempFilePaths;
					if("mainPic"==type){
						for (let i in tempFilePaths) { 
							that.uploadFileServer(that,tempFilePaths[i],i,type);
					    }	
		    		}else if("itemPic"==type){
					    //往点击的这个index开始填充从前往后填充
                        let j = 0;
                        for (let i in tempFilePaths) {
                            //i = parseInt(i);
                            //let currentIndex = index+i;
                            while(j < item.length){
                                if(item[j] ==null || item[j] == "" || item[j] == undefined){
                                    that.uploadFileServer(that,tempFilePaths[i],j,type);
                                    j++;
                                    break;
                                }else{
                                    j++;
                                }
                            }
                        }
                    }else{
					    that.uploadFileServer(that,tempFilePaths[0],index,type)
		    		}
			    }
			})
		}
	},
	closePopSwiperBox:function(){
		this.setData({
			popSwiperBox:false
		})
	},
	setting:function(){
		let item = this.data.item;
		let current = this.data.current;
		let imageSrc = item[0];
		if(current==0){
			if(item[1]!=null){
				item[0] = item[1];
				item[1] = imageSrc;
			}else{
				return
			}
		}else{
			item[0] = item[current];
			item[current] = imageSrc;
		}
		this.setData({
			item:item,
			current:0
		})
	},
	imgChange:function(e){
		this.setData({
			current:e.detail.current
		})
	},
	delImg:function(){
		let item = this.data.item;
		let current = this.data.current;
		let imageList = 0;
		for(let i=0;i<this.data.item.length;i++){
			if(this.data.item[i]==""){
				imageList++;
			}
		}
		if(imageList==this.data.item.length-1){
			this.setData({
				popSwiperBox:false
			})
		}
		item.splice(current, 1);
		item.push('');
		this.setData({
			item:item,
			current:0
		})
	},
	uploadFileServer:function(that, filePath, i,type) {
    	const uploadTask = wx.uploadFile({ 
			url:  app.globalData.apiUrl + "/find/upload.htm",
			filePath: filePath,
			name: 'item',
			success: function(res){
				console.log("reply of image upload:"+res.data);
                let resData = JSON.parse(res.data);
                //let data = resData.data.pictureList.toString().replace(/img.haihu.com/, "img-us.haihu.com");
                let data = resData.data.pictureList.toString();
                //console.log(data.toString().replace(/img.haihu.com/, "img-us.haihu.com"))
                console.log(data)
	        	let item = that.data.item;
	        	let itemProgress = that.data.itemProgress;
	        	item[i] = data+'?x-oss-process=image/resize,m_fill,h_420,w_420';
	        	itemProgress[i] = '0px';
	        	that.setData({
			    	item:item,
			    	itemProgress:itemProgress
			    })		          
			}    
		})
		uploadTask.onProgressUpdate((res) => {
		    let itemProgress = that.data.itemProgress;
	    	itemProgress[i] = res.progress+'px';
	    	that.setData({
	    		itemProgress:itemProgress
	    	})
		})
	},
	submit:function(e){
		let type = e.currentTarget.dataset.type;
		let that = this;
		let param = {};
		let purchaseStatus = 0;
		app.globalData.findStatus = 0 ;
		if(type=="save"){
			purchaseStatus = 2;
			app.globalData.findStatus=2;
		}else{
			if( that.data.skuInfo[0].costPrice=='' || that.data.skuInfo[0].costPrice==null || that.data.skuInfo[0].costPrice==undefined ){
				wx.showToast({
					title: '请补全原价',
				});
				return;
			}
			if( that.data.skuInfo[0].discount=='' || that.data.skuInfo[0].discount==null || that.data.skuInfo[0].discount==undefined ){
				wx.showToast({
					title: '请补全折扣',
				});
				return;
			}
			if( that.data.skuInfo[0].purchasePrice=='' || that.data.skuInfo[0].purchasePrice==null || that.data.skuInfo[0].purchasePrice==undefined ){
				wx.showToast({
					title: '请补全采购价',
				});
				return;
			}
			if(that.data.skuInfo[0].upc=='' || that.data.skuInfo[0].upc==null ){
				wx.showToast({
					title: '请补全upc',
				});
				return;
			}
			if(that.data.skuInfo[0].color=='' || that.data.skuInfo[0].color==null){
				wx.showToast({
					title: '请补全规格信息',
				});
				return;
			}
		}
		param.purchaseStatus = purchaseStatus;
		param.itemName = that.data.name;
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
		//品牌不能为空，xiajun
		if(that.data.brand==null || that.data.brand==''){
			wx.showToast({
                title: '请填写品牌',
            });
			return;
		}
		if(that.data.startDate=='' || that.data.endDate=='' || that.data.endDate==null){
			wx.showToast({
                title: '请选择时间',
            });
			return;
		}
		let imageList = 0;
		let picture = '';
		for(let i=0;i<that.data.item.length;i++){
			if(that.data.item[i]==""){
				imageList++;
			}else{
				picture = picture+that.data.item[i]+";";
			}
		}
		if(imageList==9){
			wx.showToast({
                title: '请上传商品图片',
            });
			return;
		}
		picture = picture.substring(0,picture.length-1);
		param.brand = that.data.brand;
		param.reason =that.data.reason;
		param.startDate=that.data.startDate;
		param.endDate=that.data.endDate;
		param.buySite=that.data.buySite;
		param.findAddress=that.data.findAddress;
		param.buyerId = parseInt(app.globalData.buyerId);
		param.detail=that.data.detail;
		param.remark=that.data.remark;
		param.pictureList = picture;
		param.id = that.data.id;
		let skuInfo = that.data.skuInfo;
		//处理一下折扣的情况,xiajun
		for(var i = 0;i < skuInfo.length;i++) {
			let sku = skuInfo[i];
			//console.log("sku.discount:"+sku.discount);
			sku.discount = sku.discount/100;
			//console.log("sku.discount:"+sku.discount);
		}

		param.skuInfo = skuInfo;
		param.companyNo = app.globalData.companyNo
		//console.log('thisthsithsitshi')
		console.log(param)
		wx.request({
	      url: app.globalData.apiUrl + "/find/save.htm",
	      method:"POST",
	      data: param,
	      success: function (res) {
			  //console.log("enter success");
			  wx.hideNavigationBarLoading();
			  //console.log('this')
			  //console.log("code:"+res.data.retCode);
	      	if (res.data.retCode == '0' || res.data.retCode == '10001') {
			    wx.switchTab({
			    	url:'list'
			    })
		    }else if(res.data.msg != undefined && res.data.msg != null){
                wx.showToast({
                    title: res.data.msg,
                    icon:'none'
                });
                setTimeout(function () {
                    wx.switchTab({
                        url:'list'
                    })
                },2000);

            }else{

                //显示失败信息
                wx.showToast({
                    title: res.data.errorMsg,
                    icon:'none'
                });

                setTimeout(function () {
                    wx.switchTab({
                        url:'list'
                    })
                },2000);


            }
		  }
	    }) 
	}   
})
