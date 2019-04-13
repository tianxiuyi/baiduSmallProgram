import { search } from '../../utils/config.js';
import { ajax,lishi } from '../../utils/util.js';
Page({
    data: {
        text:"",//搜索框value变化
        textval:"",//搜索框最终value
        windowHeight: '',//获取设备的高度
        currentTab: 0,//左右滑动切换
        currentTabs: 0,//点击切换
        sort: "",//排序
        sorts:null,//商品排序
        format: true,//格式
        top:0,//点击分页回到顶部
        commoditylist:[],//商品数据
        shopslist:[],//商铺数据
        informationlist:[],//资讯数据
        hotwordList:[],//你还可以查找数据
        pageNum: 1,//商品第几页
        pageNum1: 1,//商铺第几页
        pageNum2: 1,//资讯第几页
        pageSize: 0,//一页多少条
        pages: 0, //总页数
        pages1: 0, //商品总页数
        pages2: 0, //商铺总页数
        pages3: 0, //资讯总页数
        mark: false,//商品搜索框是否变值如果变了，tap切换的时候就重新请求
        mark1: false,//商铺搜索框是否变值如果变了，tap切换的时候就重新请求
        mark2: false,//资讯搜索框是否变值如果变了，tap切换的时候就重新请求
        register: '',//是否注册
    },
    onLoad: function (consts) {
        this.setData({
            "text": consts.name,
            "textval": consts.name
        })
        this.hotword();
        lishi(consts.name);
        this.commodity(false);
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
        // 监听页面加载的生命周期函数
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
                windowHeight: _this.data.windowHeight-res[0].height
            })
        });
    },
    hotword(){
        //热词数据
        let _this = this; 
        ajax({
            url: search.hotword,
        }).then(options => {
            _this.setData({
                "hotwordList": options
            })
        });
    },
    commodity(paging){
        // 商品接口
        let _this = this;
        let { textval,pageNum,commoditylist,sorts } = _this.data;
        if(commoditylist.length === 0 || paging){
            ajax({
                url: search.search,
                data: {
                    w: textval,
                    pageno: pageNum,
                    pagesize: 24,
                    v: sorts
                }
            }).then(options => {
                _this.setData({
                    "commoditylist": options.list,
                    "pages1": options.pages,
                    "pages": options.pages,
                    "top":1, //回到顶部
                    "mark": false
                })
            });
        }
    },
    searchshop(paging){
        // 商铺接口
        let _this = this;
        let { textval,pageNum1,shopslist } = _this.data;
        if(shopslist.length === 0 || paging){
            ajax({
                url: search.searchshop,
                data: {
                    w: textval,
                    pageno: pageNum1,
                    pagesize: 24
                }
            }).then(options => {
                _this.setData({
                    "shopslist": options.list,
                    "pages2": options.pages,
                    "pages": options.pages,
                    "top":1, //回到顶部
                    "mark1": false
                })
            });
        }
    },
    information(paging){
        // 资讯接口
        let _this = this;
        let { textval,pageNum2,informationlist } = _this.data;
        if(informationlist.length === 0 || paging){
            ajax({
                url: search.info,
                data: {
                    w: textval,
                    pageno: pageNum2,
                    pagesize: 24
                }
            }).then(options => {
                _this.setData({
                    "informationlist": options.list,
                    "pages3": options.pages,
                    "pages": options.pages,
                    "top":1, //回到顶部
                    "mark2": false
                })
            });
        }
    },
    numChange(e){
        //触发分页
        let {currentTab} = this.data;
        if(currentTab == '0'){
            this.setData({
                pageNum:e.detail
            })
            this.commodity(true);
        }else if(currentTab == '1'){
            this.setData({
                pageNum1:e.detail
            })
            this.searchshop(true);
        }else if(currentTab == '2'){
            this.setData({
                pageNum2:e.detail
            })
            this.information(true);
        }
    },
    onMyEvent(e){
        //你还可以查找
        this.setData({
            "text": e.detail,
            "textval": e.detail,
            "mark": true,
            "mark1": true,
            "mark2": true,
            "pageNum": 1,
            "pageNum1": 1,
            "pageNum2": 1
        })
        lishi(e.detail);
        this.searchLookup();
    },
    bindtapSort(){
        // 排序
        let sort = this.data.sort;
        ((sort === "") || (sort === "down")) && this.setData({"sort": "up","sorts":8});
        (sort === "up") && this.setData({"sort": "down","sorts":9});
        this.commodity(true);
    },
    bindtapFormat(){
        // 格式
        let format = this.data.format;
        format?this.setData({"format": false}):this.setData({"format": true});
    },
    bindtapComprehensive(){
        //综合
        this.setData({"sort": "","sorts":''})
        this.commodity(true);
    },
    bindscrollRoll(){
        //往下滑动
        if(this.data.top === 1){
            this.setData({
                top:0 //回到顶部初始化
            })
        }
    },
    bindtapTap(e){
        // tap切换
        let index = e.currentTarget.dataset.index;
        this.tapSwitch(index);
    },
    changeContent(e){
        //滑动切换
        let index = e.detail.current;
        this.tapSwitch(index);
    },
    tapSwitch(index){
        //tap切换改变数据
        let {pages1,pages2,pages3,mark,mark1,mark2} = this.data;
        if(index != this.data.currentTab){
            this.setData({
                "currentTab": index,
            })
            if(index == '0'){
                this.setData({
                    "pages": pages1,
                })
                this.commodity(mark);
            }else if(index == '1'){
                this.setData({
                    "pages": pages2,
                })
                this.searchshop(mark1);
            }else if(index == '2'){
                this.setData({
                    "pages": pages3,
                })
                this.information(mark2);
            }
        }
    },
    bindinputInput(e){
        //搜索框value变化
        let val = e.detail.value;
        this.setData({
            "text": val
        })
    },
    bindtapSearch(){
        //搜索按钮
        if(this.data.text !== ''){
            this.setData({
                "pageNum": 1,
                "pageNum1": 1,
                "pageNum2": 1,
                "textval": this.data.text,
                "mark": true,
                "mark1": true,
                "mark2": true,
            })
            lishi(this.data.text);
            this.searchLookup();
        }else{
            swan.showToast({
                title: '请输入关键词！',
                duration: 1000,
                icon: 'none'
            });
        }
    },
    searchLookup(){
        //搜索和查找改变数据
        let {currentTab} = this.data;
        if(currentTab == '0'){
            this.commodity(true);
        }else if(currentTab == '1'){
            this.searchshop(true);
        }else if(currentTab == '2'){
            this.information(true);
        }
    },
    bindtapDifference(){
        //差号按钮
        this.setData({
            "textval": "",
            "text": ""
        })
    }
});