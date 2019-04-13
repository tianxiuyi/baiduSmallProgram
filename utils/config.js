const hostname = 'https://wsmobile.hc360.com/';
const hostname1 = 'https://sso.hc360.com/';
const hostname2 = 'https://mlogin.hc360.com/';
module.exports = {
  home: {
    hot: `${hostname}info/hot`,//热门资讯
    detail: `${hostname}info/detail`,//热门资讯详情
    related: `${hostname}info/related`,//相关资讯
  },
  search: {
    search: `${hostname}search/pro`,//搜索商品
    searchshop: `${hostname}search/shop`,//搜索商铺
    info: `${hostname}search/info`,//搜索资讯
    hotword: `${hostname}get/hotword`,//获取热词
  },
  shop: {
    pro: `${hostname}shop/pro`,//商铺全部产品
    info: `${hostname}shop/info`,//商铺信息
    message: `${hostname}shop/message`,//留言
  },
  Ultimate: {
    busininfo: `${hostname}business/info`,//商品信息
  },
  buy: {
    push: `${hostname}buy/push`,//采购
    askprice: `${hostname}business/askprice`,//询价
    validImage: `${hostname1}ValidImage.jsp`,//图形验证码
    loginTicket: `${hostname1}LoginTicket.jsp`,//刷新图形验证码
    sendMessage: `${hostname2}int/sendMessage`,//短信验证码
    regLodingotherJson: `${hostname2}regLodingotherJson.html`,//短信验证码
  },
  details:{
    html2wxml: "https://madata.hc360.com/html2wxml4J/",//html转换微信
  }
};