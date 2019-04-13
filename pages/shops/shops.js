import { shop } from '../../utils/config.js';
import { ajax,formatTime } from '../../utils/util.js';
Page({
    data: {
        pid:'',
        windowHeight: '',//中间滑动的高
        windowHeight1: '',//头部的高
        currentTab: 0,//左右滑动切换
        markShow: true,//头部显示隐藏
        animation: false,//留言显示隐藏
        commodityList: [],//商品数据
        shops: null,//商铺信息
        pages: 0,//全部页数
        pageNum: 1,//第几页
        top: 0,//回到最顶部
        stayWord: '',//留言
        telephone: '',//电话
        iPhoneX: false,//判断是不是iPhoneX
        commodity: false,//判断商品有3和4条的时候
        authentication: false,//是否认证
        register: '',//是否注册
    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        // 监听页面加载的生命周期函数
        let _this = this;
        swan.getSystemInfo({
            success: function(res) {
                let name = 'iPhone X'
                if(res.model.indexOf(name) > -1){
                    _this.setData({
                        iPhoneX: true
                    })
                }
            }
        })
        this.setData({
            pid: options.pid
        })
        this.commodity();
        this.info();
    },
    onShow(){
        let _this = this;
        swan.getStorage({
            key: 'code',
            success(options) { 
                _this.setData({
                    register: options.data
                })
            },
            fail(e) {
            }
        })
    },
    onReady:function(){
        swan.getSystemInfo({  // 获取当前设备的宽高
            success: (res) => {
                this.setData({
                    windowHeight: res.windowHeight
                })
            },
        })
        // 监听页面初次渲染完成的生命周期函数
        const query = swan.createSelectorQuery(),_this = this;
        query.select('.view').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function (res) {
            _this.setData({
                windowHeight: _this.data.windowHeight-res[0].height-50
            })
        });
        // 监听页面初次渲染完成的生命周期函数
        const query1 = swan.createSelectorQuery();
        query1.select('.shopsTop').boundingClientRect()
        query1.selectViewport().scrollOffset()
        query1.exec(function (res) {
            _this.setData({
                windowHeight1: res[0].height
            })
        });
    },
    bindtapBtn(e){
        //进入商品详情
        let {bcid} = e.currentTarget.dataset;
        swan.navigateTo({
            url: '../detail/detail?bcid='+bcid
        });
    },
    commodity(){
        //商品数据
        let _this = this,{pid,pageNum} = this.data;
        ajax({
            url: shop.pro,
            data: {
                pid: pid,
                pageno: pageNum,
            }
        }).then(options => {
            _this.setData({
                commodityList: options.list,
                pages: options.pages,
                pageNum: options.pageNum,
                top: 0,//回到最顶部
            })
            if(options.list.length === 3 || options.list.length === 4){
                _this.setData({
                    commodity: true
                })
            }
        });
    },
    info(){
        //商铺信息
        let _this = this,{pid} = this.data;
        ajax({
            url: shop.info,
            data: {
                pid: pid
            }
        }).then(options => {
            options.bizstartdate = formatTime(options.bizstartdate/1000,'Y-M-D');
            options.bizenddate = formatTime(options.bizenddate/1000,'Y-M-D');
            _this.setData({
                shops: options,
                authentication: options.isShield || false
            })
        });
    },
    numChange(e){
        //分页
        this.setData({
            pageNum: e.detail
        })
        this.commodity();
        this.setData({
            top: 1,//回到最顶部
        })
    },
    bindscrollRoll(e){
        //上下滑动隐藏显示头部
        if(e.detail.scrollTop < 20){
            if(!this.data.markShow){
                this.setData({
                    windowHeight: this.data.windowHeight - this.data.windowHeight1
                })
            }
            this.setData({
                "markShow": true
            })
        }else{
            if(this.data.markShow){
                this.setData({
                    "windowHeight": this.data.windowHeight + this.data.windowHeight1
                })
            }
            this.setData({
                "markShow": false
            })
        }
    },
    changeContent(e){
        //滑动切换
        let index = e.detail.current;
        if(!this.data.markShow){
            this.setData({
                "windowHeight": this.data.windowHeight - this.data.windowHeight1
            })
        }
        this.setData({
            "currentTab": index,
            "markShow": true
        })
    },
    bindtapTap(e){
        // tap切换
        let index = e.currentTarget.dataset.index;
        this.setData({
            "currentTab": index
        })
    },
    bindtapPurchase(){
        //点击发布采购
        swan.navigateTo({
            url: '../purchase/purchase'
        });
    },
    bindtapContact(){
        //点击立即联系
        let {shops} = this.data
        if(shops.mp){
            swan.makePhoneCall({
                phoneNumber: shops.mp
            });
        }else{
            swan.showToast({
                title: '没有手机号！',
                duration: 1000,
                icon: 'none'
            });
        }
    },
    bindtapLeavingAmessage(){
        //点击留言
        this.setData({
            animation: true
        });
    },
    bindtapCancel(){
        //隐藏留言
        this.setData({
            animation: false
        });
    },
    bindinputStayWord(e){
        //留言
        let val = e.detail.value;
        this.setData({
            stayWord: val
        })
    },
    bindinputTelephone(e){
        //电话
        let val = e.detail.value;
        this.setData({
            telephone: val
        })
    },
    bindtapSend(){
        //发送留言
        let {stayWord,telephone,pid} = this.data,_this = this;
        if(stayWord === ''){
            swan.showToast({
                title: '请输入留言内容！',
                duration: 1000,
                icon: 'none'
            });
            return false;
        }else if(!(/^1(3|4|5|6|7|8)\d{9}$/.test(telephone))){
            swan.showToast({
                title: '请输入正确手机号码！',
                duration: 1000,
                icon: 'none'
            });
            return false;
        }
        
        //提交接口
        ajax({
            url: shop.message,
            data:{
                businTitle: stayWord,
                telephone: telephone,
                pid: pid
            }
        }).then(options => {
            if(options.code === 0){
                swan.showToast({
                    title: '提交成功！',
                    duration: 1000,
                    icon: 'none',
                    success:function(e){
                        //隐藏留言
                        _this.setData({
                            animation: false
                        });
                    }
                });
            }else{
                swan.showToast({
                    title: '提交失败！',
                    duration: 1000,
                    icon: 'none'
                });
            }
        });
    }
});