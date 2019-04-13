import { home,details } from '../../utils/config.js';
import { ajax } from '../../utils/util.js';
var html2wxml = require('../../html2wxml-template/html2wxml.js');
Page({
    data: {
        details:null,//详情
        relatedList: [],//相关资讯
        register: '',//是否注册
    },
    onLoad: function (e) {
        // 监听页面加载的生命周期函数
        this.detail(e)
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
    detail(e){
        //热门资讯详情
        let _this = this;
        ajax({
            url: home.detail,
            data:{
                webName: e.webName,
                infoId: e.infoId
            }
        }).then(options => {
            if(options){
                options.keys = options.keys.split(",");
                _this.setData({
                    details: options
                })
                _this.htmlSwxml(options.content)
                _this.related(options.tittle);
            }
        });
    },
    related(tittle){
        //相关资讯
        let _this = this;
        ajax({
            url: home.related,
            data:{
                keyWord: "申洲国际老板身价高达480亿%20成国内服饰行业首富"
            }
        }).then(options => {
            if(options){
                let {business,info}  = options,list=[];
                //数据处理随机取10条info的数据
                for(var i=0;i<10;i++){
                    _this.getx(list,info);
                }
                //把business的数据，插入随机取得数据里
                list.splice(5, 0, business[0]);
                list.push(business[1]);
                _this.setData({
                    relatedList: list
                })
            }
        });
    },
    getx(arr,info){
        for(var i=0;i>-1;i++){
            let flag = true;
            let num = Math.floor(Math.random()*info.length);
            for(var i in arr){
                if(arr[i] == num){
                    flag= false;
                    break;
                }
            }
            if(flag == true){
                arr.push(info[num]);
                return;
            }
        }
    },
    bindtapInformation(e){
        //点击相关资讯
        let {infoId,webName,bcid} = e.currentTarget.dataset;
        if(infoId && webName){
            swan.navigateTo({
                url: `../newsDetail/newsDetail?infoId=${infoId}&webName=${webName}`
            });
        }else if(bcid){
            swan.navigateTo({
                url: '../detail/detail?bcid='+bcid
            });
        }
    },
    /**
     * html转换
     */
    htmlSwxml(detailData){
        swan.request({
            url: details.html2wxml,
            data: {
                text: detailData,
                type: 'html',
                linenums: true,
                highlight: true
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: res => {
                html2wxml.html2wxml('busindetail', res.data, this, 5);
            }
        })
    },
});