Component({
    properties: {
        list: { // 属性名
            type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: 'val', // 属性初始值（必填）
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
            }
        }
    },

    data: {}, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},

    detached: function () {},

    methods: {
        bindtapShop(e){
            //商铺页
            let pid = e.currentTarget.dataset.pid;
            swan.navigateTo({
                url: '../shops/shops?pid='+pid
            });
        },
        bindtapContact(e){
            //点击联系方式
            let mp = e.currentTarget.dataset.mp;
            if(mp){
                swan.makePhoneCall({
                    phoneNumber: mp
                });
            }else{
                swan.showToast({
                    title: '没有手机号',
                    duration: 1000,
                    icon: 'none'
                });
            }
        }
    }
});