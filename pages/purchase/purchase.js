import { buy } from '../../utils/config.js';
import { ajax } from '../../utils/util.js';
Page({
    data: {
        array:["紧急采购(三天)","临时采购(一周)","正常采购(两周)","生产采购(一月)","季度采购(三月)","长期采购(一年)"],
        array1:[3, 7, 14, 30, 90, 365],//采购天数
        index:0,
        nameval:'',//我要采购
        numberval: 1,//采购数量
        thinval:'',//联系电话
        dateval:'',//采购日期
        Show: true,//获取焦点时隐藏加减
        register: '',//是否注册
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
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
    selectorChange(e){
        // 选择采购日期
        let index = e.detail.value;
        this.setData({
            index: index
        })
    },
    bindinputName(e){
        //我要采购
        let val = e.detail.value;
        this.setData({
            nameval: val
        })
    },
    bindinputNumber(e){
        //采购数量
        let val = e.detail.value;
        this.setData({
            numberval: val
        })
    },
    bindblurShow(){
        //获取焦点时隐藏加减
        this.setData({
            Show: true
        })
    },
    bindfocusHide(){
        //获取焦点时隐藏加减
        this.setData({
            Show: false
        })
    },
    bindtapPlus(){
        //加
        let {numberval} = this.data;
        this.setData({
            numberval: (numberval*1)+1
        })
    },
    bindtapReduce(){
        //减
        let {numberval} = this.data;
        if(numberval > 0){
            this.setData({
                numberval: (numberval*1)-1
            })
        }
    },
    bindinputThin(e){
        //联系电话
        let val = e.detail.value;
        this.setData({
            thinval: val
        })
    },
    bindtapPurchase(){
        //点击提交
        let {nameval,numberval,thinval,dateval,index,array1} = this.data;
        if(nameval === ''){
            swan.showToast({
                title: '请输入采购商品！',
                duration: 1000,
                icon: 'none'
            });
            return false;
        }else if(numberval <= 0 || numberval == ''){
            swan.showToast({
                title: '采购数量不能为空，不能小于1！',
                duration: 1000,
                icon: 'none'
            });
            return false;
        }else if(!(/^1(3|4|5|6|7|8)\d{9}$/.test(thinval))){
            swan.showToast({
                title: '请输入正确手机号码！',
                duration: 1000,
                icon: 'none'
            });
            return false;
        }
        //提交接口
        ajax({
            url: buy.push,
            data:{
                businTitle: nameval,
                count: numberval,
                telephone: thinval,
                expirationDate: array1[index]
            }
        }).then(options => {
            if(options.code === 0){
                swan.showToast({
                    title: '提交成功！',
                    duration: 1000,
                    icon: 'none',
                    success:function(e){
                        swan.switchTab({
                            url: '../index/index',
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