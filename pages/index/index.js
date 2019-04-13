import { home } from '../../utils/config.js';
import { ajax } from '../../utils/util.js';
Page({
    data: {
        list:[
            {name:"家装建材",names:"建材装饰大全",img:"https://style.org.hc360.com/images/baidu/nImg1.png"},
            {name:"电子元件",names:"电子电子品类",img:"https://style.org.hc360.com/images/baidu/nImg2.png"},
            {name:"工程机械",names:"机械设备采购",img:"https://style.org.hc360.com/images/baidu/nImg3.png"},
            {name:"安防消防",names:"机械设备采购",img:"https://style.org.hc360.com/images/baidu/nImg4.png"},
            {name:"化工涂料",names:"买化塑",img:"https://style.org.hc360.com/images/baidu/nImg5.png"},
            {name:"印刷包装",names:"印刷包装",img:"https://style.org.hc360.com/images/baidu/nImg6.png"},
            {name:"汽车配件",names:"汽车用品热卖",img:"https://style.org.hc360.com/images/baidu/nImg7.png"},
            {name:"服装流行",names:"服装批发",img:"https://style.org.hc360.com/images/baidu/nImg8.png"},
            {name:"皮革制鞋",names:"鞋服采购",img:"https://style.org.hc360.com/images/baidu/nImg9.png"},
            {name:"家居家电",names:"家电城",img:"https://style.org.hc360.com/images/baidu/nImg10.png"},
            {name:"饮水配件",names:"净水设备",img:"https://style.org.hc360.com/images/baidu/nImg11.png"},
            {name:"电子LED",names:"电子元器件",img:"https://style.org.hc360.com/images/baidu/nImg12.png"}
        ],
        hotList: [],//资讯
        register: '',//是否注册
    },
    onLoad: function () {
        this.hot();
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
    hot(){
        //热门资讯
        let _this = this;
        ajax({
            url: home.hot,
        }).then(options => {
            if(options){
                _this.setData({
                    hotList: options
                })
            }
        });
    },
    btnSearch(){
        //点击搜索
        swan.navigateTo({
            url: '../search/search'  
        });
    },
    bindtapResult(e){
        //点击热门分类
        let name = e.currentTarget.dataset.name;
        swan.navigateTo({
            url: '../proSearch/proSearch?name='+ name
        });
    },
    bindtapInformation(e){
        //点击资讯
        let {infoId,webName} = e.currentTarget.dataset;
        swan.navigateTo({
            url: `../newsDetail/newsDetail?infoId=${infoId}&webName=${webName}`
        });
    }
});
