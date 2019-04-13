Component({
    properties: {
        list: { // 属性名
            type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: 'val', // 属性初始值（必填）
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
                // console.log(newVal)
            }
        }
    },

    data: {}, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},

    detached: function () {},

    methods: {
        bindtapInformation(e){
            //点击进入资讯详情
            let {infoId,webName} = e.currentTarget.dataset;
            swan.navigateTo({
                url: `../newsDetail/newsDetail?infoId=${infoId}&webName=${webName}`
            });
        }
    }
});