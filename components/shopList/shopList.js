Component({
    properties: {
        format: {
            type: Number,
            value: 'val',
            observer: function(newVal, oldVal) {
                
            }
        },
        list: {
            type: Array,
            value: 'val'
        }
    },

    data: {
    }, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},

    detached: function () {},

    methods: {
        bindtapCommodity(e){
            //进入商品页
            let bcid = e.currentTarget.dataset.bcid;
            swan.navigateTo({
                url: '../detail/detail?bcid='+bcid
            });
        },
    }
});