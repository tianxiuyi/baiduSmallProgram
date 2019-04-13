Page({
    data: {
        current:1,
        picUrls: [],//图片
        title: [],//图片上的文字
        otherTelephone: '',//手机号
        companyName: '',//公司名称
        authentication: false,//是否认证
        register: '',//是否注册
    },
    onLoad: function (e) {
        // 监听页面加载的生命周期函数
        this.setData({
            title: e.title,
            picUrls: e.picUrls.split(','),
            otherTelephone: e.otherTelephone,
            companyName: e.companyName,
            authentication: e.authentication
        })
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
    bindchangePicture(e){
        //滑动图片
        let current = e.detail.current;
        this.setData({
            "current": current+1
        })
    },
    bindtapReturn(){
        //返回商机
        swan.navigateBack({
            delta: 1
        });
    },
    bindtapContact(){
        //点击联系方式
        let {otherTelephone} = this.data;
        swan.makePhoneCall({
            phoneNumber: otherTelephone
        });
    }
});