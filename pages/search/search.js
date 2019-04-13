import { search } from '../../utils/config.js';
import { ajax } from '../../utils/util.js';
Page({
    data: {
        deleteHistory: false,
        del:false,
        text:'',//搜索value
        list: [],//热搜词数据
        register: '',//是否注册
        lishi:[]
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
    onLoad: function () {
        // 监听页面加载的生命周期函数
        this.hotword();
        let _this = this;
        swan.getStorage({
            key: 'record',
            success: function (res) {
                if(res.data){
                    _this.setData({
                        lishi:res.data
                    })
                }
            }
        });
    },
    bindtapSearch(){
        // 搜索事件
        let _this = this;
        if(this.data.text !== ''){
            swan.redirectTo({
                url: '../proSearch/proSearch?name='+  this.data.text
            });
        }else{
            swan.showToast({
                title: '请输入关键词！',
                duration: 1000,
                icon: 'none'
            });
        }
    },
    bindinputInput(e){
        //搜索框值改变
        this.setData({
            "text": e.detail.value
        })
    },
    bindtopDeleteHistory(){
        // 删除图标事件
        this.setData({
            'deleteHistory': true,
            'del': true,
        });
    },
    bindtapDeleteAll(){
        // 全部删除
        this.setData({
            lishi: []
        })
    },
    bindtapSingleDeletion(e){
        // 单个删除
        let {lishi} = this.data,name = e.currentTarget.dataset.name,arr = [];
        for(var i=0;i<lishi.length;i++){
            if(lishi[i] !== name){
                arr.push(lishi[i])
            }
        }
        this.setData({
            lishi: arr
        })
    },
    bindtapComplete(){
        // 完成事件
        let {lishi} = this.data;
        swan.setStorage({
            key: 'record',
            data: lishi
        });
        this.setData({
            'deleteHistory': false,
            'del': false,
        });
    },
    hotword(){
        //热词数据
        let _this = this; 
        ajax({
            url: search.hotword,
        }).then(options => {
            _this.setData({
                "list": options
            })
        });
    },
    bindtapWords(e){
        //感兴趣的热词点击
        let word = e.target.dataset.word;
        swan.redirectTo({
            url: '../proSearch/proSearch?name='+  word
        });
    }
});