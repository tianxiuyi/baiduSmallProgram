/**
 * [http() 封装 工具函数,ajax 请求 ]
 * [{params: Object(url.. data.. 等参数)}]
 * [-------------------------------------------------]
 */
const ajax = function (params, isLoading = false) {
  return new Promise(function (resolve, reject) {
    !isLoading && swan.showLoading({
      title: '正在加载...',
      mask: true
    });
    swan.showNavigationBarLoading();
    swan.request({
      method: params.method || 'GET',
      url: params.url,
      data: params.data || {},
      scriptCharset:"utf-8",
      header: params.header || {
        "Accept": "application/json, text/javascript, */*"
        // 'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (options) {
        let result = options.data;
        resolve(result);
      },
      fail: function (err) {
      	console.info(err);
        swan.showToast({
          title: '请求失败',
          icon: 'none'
        });
        reject(err);
        swan.showModal({
          title: '警告',
          content: `接口请求失败,错误${JSON.stringify(err)}`
        });
      },
      complete: function () {
        swan.hideNavigationBarLoading();
        !isLoading && swan.hideLoading();
      }
    });
  });
};

//数据转化
function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}
/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function formatTime(number, format) {
    if(number){
        var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
        var returnArr = [];

        var date = new Date(number * 1000);
        returnArr.push(date.getFullYear());
        returnArr.push(formatNumber(date.getMonth() + 1));
        returnArr.push(formatNumber(date.getDate()));

        returnArr.push(formatNumber(date.getHours()));
        returnArr.push(formatNumber(date.getMinutes()));
        returnArr.push(formatNumber(date.getSeconds()));

        for (var i in returnArr) {
            format = format.replace(formateArr[i], returnArr[i]);
        }
        return format;
    }else{
        return number;
    }
}

/**
 * 搜索历史记录
*/
function lishi(text){
    let texts = text;
    swan.getStorage({
        key: 'record',
        success: function (res) {
            let lishi = res.data;
            if(lishi !== ''){
                lishi.unshift(texts);  
                for (var i = 0; i < lishi.length; i++) {
                    if (lishi.indexOf(lishi[i]) != i) {
                        lishi.splice(i,1);//删除数组元素后数组长度减1后面的元素前移
                        i--;//数组下标回退
                    }
                }
                swan.setStorage({
                    key: 'record',
                    data: lishi
                });
            }else{
                swan.setStorage({
                    key: 'record',
                    data: [texts]
                });
            }
        },
        fail: function(){
            swan.setStorage({
                key: 'record',
                data: [texts]
            });
        }
    });
}
module.exports = {
  ajax: ajax,
  formatTime: formatTime,
  lishi: lishi
};