Component({
    properties: {
        pages: { // 属性名
            type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: '0', // 属性初始值（必填）
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
                // console.log(newVal)
            }
        },
        pageNum: {
            type: Number,
            value: '0', 
            observer: function(newVal, oldVal) {
                
            }
        },
        sign: {
            type: Number,
            value: 'val'
        },
        hotwordList:{
            type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: 'val', // 属性初始值（必填）
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
                // console.log(newVal)
            }
        }
    },

    data: {
        pageNum: 1
    }, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},

    detached: function () {},

    methods: {
        bindtapLower(e){
            //下一页
            let {pageNum} = this.data,
            {pages,text} = e.target.dataset;
            switch(text){
                case "1":
                    if(pageNum != 1){
                        this.setData({
                            "pageNum": 1
                        })
                        this.triggerEvent('numChange',this.data.pageNum);
                    }
                    break;
                case "2":
                    if(pageNum > 1){
                        this.setData({
                            "pageNum": pageNum-1
                        })
                        this.triggerEvent('numChange',this.data.pageNum);
                    }
                    break;
                case "3":
                    if(pages > pageNum){
                        this.setData({
                            "pageNum":pageNum+1
                        })
                        this.triggerEvent('numChange',this.data.pageNum);
                    }
                    break;
                case "4":
                    if(pages != pageNum){
                        this.setData({
                            "pageNum": pages
                        })
                        this.triggerEvent('numChange',this.data.pageNum);
                    }
                    break;
                default:
                    console.log('其他')
            }
        },
        bindtapLookup(e){
            //你还可以查找
            let text = e.target.dataset.text;
            this.triggerEvent('myevent',text);
        }
    }
});