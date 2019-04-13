import { Ultimate,details,buy } from '../../utils/config.js';
import { ajax } from '../../utils/util.js';
var html2wxml = require('../../html2wxml-template/html2wxml.js');
Page({
    data: {
        current:1,//第几个图片
        animation: false,//询价弹框显示隐藏
        busininfo: null,//终极页数据
        array:["紧急采购(三天)","临时采购(一周)","正常采购(两周)","生产采购(一月)","季度采购(三月)","长期采购(一年)"],
        array1:[3, 7, 14, 30, 90, 365],//采购天数
        index:0,
        numberval: 1,//采购数量
        telephoneval: '',//联系电话
        bcId: '',//商品id
        pid: '',//商家id
        supcatId: '',
        areaId: '',//地区id
        businTitle: '',//商品名称
        otherTelephone: '',//手机
        minOrderNum: 1,//最小数量
        unit: '个',//采购单位
        authentication: false,//是否认证
        iPhoneX: false,
        register: '',//是否注册

    },
    onLoad: function (options) {
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
        this.busininfo(options.bcid);
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
    busininfo(bcid){
        //商品信息
        let _this = this;
        ajax({
            url: Ultimate.busininfo,
            data: {
                bcid: bcid,
            }
        }).then(res => {
            if(res.picUrls != null){
                let picUrls = res.picUrls;
                if(picUrls.length > 5){
                    res.picUrls = picUrls.slice(0,5)
                }
                _this.setData({
                    "busininfo": res,
                    "bcId": res.bcId,//商品id
                    "pid": res.pid,//商家id
                    "supcatId": res.supcatId || 0,//不知道什么id
                    "areaId": res.areaId,//地区id
                    "businTitle": res.tittle,//商品名称
                    "otherTelephone": res.mp,//手机
                    "authentication": res.isShield || false,//是否认证
                })
                if(res.unit){
                    _this.setData({
                        "unit": res.unit,//采购单位
                    })
                }
                if(res.minOrderNum){
                    _this.setData({
                        "minOrderNum": res.minOrderNum,//最小数量
                        "numberval": res.minOrderNum,//最小数量
                    })
                }
                _this.htmlSwxml(res.busindetail)
            }
        });
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
    bindchangePicture(e){
        //滑动图片
        let current = e.detail.current;
        this.setData({
            "current": current+1
        })
    },
    bindtapPicture(e){
        //点击大图进入大图页
        let {picUrls,title,companyName} = e.currentTarget.dataset,{otherTelephone,authentication} = this.data,arr = [];
        for(var i = 0;i<picUrls.length;i++){
            arr.push(picUrls[i].bigPicUrl)
        }
        swan.navigateTo({
            url: `../bigImg/bigImg?picUrls=${arr.join(',')}&title=${title}&otherTelephone=${otherTelephone}&companyName=${companyName}&authentication=${authentication}`
        });
    },
    bindtapPurchase(){
        //采购页
        swan.navigateTo({
            url: '../purchase/purchase'
        });
    },
    bindtapContact(){
        //点击立即联系
        let {otherTelephone} = this.data;
        swan.makePhoneCall({
            phoneNumber: otherTelephone
        });
    },
    bindtapInquiry(){
        //点击立即询价
        this.setData({
            "animation": true
        })
    },
    bindtapCancel(){
        //点击隐藏立即询价弹框
        this.setData({
            "animation": false
        })
    },
    bindtapReduce(){
        //减
        let {numberval,minOrderNum} = this.data;
        if(numberval > minOrderNum){
            this.setData({
                numberval: (numberval*1)-1
            })
        }
    },
    bindtapPlus(){
        //加
        let {numberval} = this.data;
        this.setData({
            numberval: (numberval*1)+1
        })
    },
    bindinputNumber(e){
        //改变数量
        this.setData({
            numberval: e.detail.value
        })
    },
    selectorChange(e){
        // 选择采购日期
        let index = e.detail.value;
        this.setData({
            index: index
        })
    },
    bindinputThin(e){
        //联系电话
        let val = e.detail.value;
        this.setData({
            telephoneval: val
        })
    },
    bindtapSubmission(){
        //点击提交
        let {numberval,telephoneval,index,array1,bcId,pid,supcatId,areaId,businTitle,minOrderNum,unit} = this.data,_this = this;
        if(numberval < minOrderNum || numberval == ''){
            swan.showToast({
                title: `采购数量不能为空或小于${minOrderNum?minOrderNum:'1'}！`,
                duration: 1000,
                icon: 'none'
            });
            return false;
        }else if(!(/^1(3|4|5|6|7|8)\d{9}$/.test(telephoneval))){
            swan.showToast({
                title: '请输入正确手机号码！',
                duration: 1000,
                icon: 'none'
            });
            return false;
        }
        //提交接口
        ajax({
            url: buy.askprice,
            data:{
                bc_id: bcId,//商品id
                count: numberval,
                telephone: telephoneval,
                expirationDate: array1[index],
                pid: pid,//商家id
                supcatId: supcatId,//不知道什么id
                areaId: areaId,//地区id
                businTitle: businTitle,//商品名称
                unit: unit,//采购单位
            }
        }).then(options => {
            if(options.code === 0){
                swan.showToast({
                    title: '提交成功！',
                    duration: 1000,
                    icon: 'none',
                    success:function(e){
                        _this.setData({
                            "animation": false,
                            "telephoneval": ''
                        })
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