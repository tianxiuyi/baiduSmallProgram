import { ajax } from '../../utils/util.js';
import { buy } from '../../utils/config.js';
Page({
    data: {
        encryptions: false, //密码隐藏显示
        companyName: '',// 公司名称
        number: '',// 手机号
        graphicalVerification: '',// 图形验证码
        verification: '',// 短信验证码
        password: '',// 密码
        graphicalVerificationAddress: '',//图形验证码地址
        key: '',
        countDown: '获取验证码',//
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        this.graphicalVerification();
    },
    bindinputName(e){
        //获取公司名称
        this.setData({
            companyName: e.detail.value
        })
    },
    bindinputNumber(e){
        //获取手机号
        this.setData({
            number: e.detail.value
        })

    },
    bindinputGraphicalVerification(e){
        //获取图形验证码
        this.setData({
            graphicalVerification: e.detail.value
        })


    },
    bindinputVerification(e){
        //获取短信验证码
        this.setData({
            verification: e.detail.value
        })


    },
    bindinputPassword(e){
        //获取密码
        this.setData({
            password: e.detail.value
        })


    },
    graphicalVerification(){
        //点击更换图形验证码
        let _this = this;
        ajax({
            url: buy.loginTicket,
        }).then(options => {
            let json = options.split('"')
            if(options!=null){
                _this.setData({
			  	    graphicalVerificationAddress: buy.validImage+"?seed="+json[1],
			  	    key: json[3]
                })
			}
        });
    },
    shortMessageVerification(){
        //点击获取短信验证码
        let { key, number, graphicalVerification, countDown } = this.data,_this = this,mark = 60,inter = null;
        if(number === ""){
            _this.showToast('请输入您的手机号');
            return false;
        }else if(graphicalVerification === ''){
            _this.showToast('请输入图形验证码');
            return false;
        }
        if(countDown === '获取验证码'){
            ajax({
                method: 'post',
                url: buy.sendMessage,
                header:{
                    "Content-type": "application/x-www-form-urlencoded"
                },
                data: {
                    phone: number,
                    ctoken: key,
                    valicode: graphicalVerification
                }
            }).then( options => {
                if(options == "4"){
                    _this.graphicalVerification();
                    _this.showToast('短信发送成功。');
                    _this.setData({
                        countDown: mark+'秒后重试'
                    })
                    inter = setInterval(function(){
                        mark--;
                        _this.setData({
                            countDown: mark+'秒后重试'
                        })
                        if(mark < 1){
                            mark = 60;
                            _this.setData({
                                countDown: '获取验证码'
                            })
                            clearInterval(inter);
                        }
                        },1000)
                }else if(options == "1"){
                    _this.showToast('手机号格式不正确 请重新输入!');
                }else if(options == "2"){
                    _this.showToast('请输入正确的图形验证码!');
                }else if(options == "3"){
                    _this.showToast("手机号码已被绑定 请重新输入!");
                }else{
                    _this.showToast(options);
                }

            })
        }
    },
    encryption(e){
        //密码隐藏显示
        let index = e.target.dataset.index;
        if(index === '1'){
            this.setData({
                encryptions: false
            })
        }else{
            this.setData({
                encryptions: true
            })
        }
    },
    register(){
        //点击注册
        let { companyName, number, graphicalVerification, verification, password} = this.data,_this = this,//用户填写信息
        name = companyName.match(/^[\u4E00-\u9FA5A-Za-z0-9\\(\\)\\（\\）]{2,19}$/),
        name1 = companyName.match(/^(?![0-9]+$)(?![a-zA-Z]+$)/),
        number1 = number.match(/^1[345678]\d{9}$/),
        passwords = password.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/);
        if(!name1 || !name){
            this.showToast('请输入正确公司名称！');
            return false
        }
        if(!number1){
            this.showToast('请输入正确手机号！');
            return false
        }
        if(!passwords){
            this.showToast('密码不能是纯数字、纯字母、特殊符号、空格；长度：6-20！');
            return false
        }
        ajax({
            method: 'post',
            url: buy.regLodingotherJson,
            header:{
                "Content-type": "application/x-www-form-urlencoded"
            },
            data: {
                flag:'',
                sourcetypeid:'10075',
                identity: '0',
                ReturnURL: '',
                company: encodeURI(companyName),//公司名称
                phone: number,//手机号
                valicode: graphicalVerification,//图形验证码
                code: verification, //验证码
                password: password //密码
            }
        }).then( options => {
            let code = options.code;
            if(code === "003"){
                swan.setStorage({
                    key: 'code',
                    data: code
                });
                swan.navigateBack({
                    delta: 1
                });
                //注册成功页面  注册成功 添加转化代码
                _this.showToast("注册成功")
                return false;
            }
            _this.showToast("注册异常")
        })
    },
    showToast(text){
        swan.showToast({
            title: text,
            duration: 1000,
            icon: 'none'
        });
    }
});