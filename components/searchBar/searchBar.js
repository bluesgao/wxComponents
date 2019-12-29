
// 本组件为搜索组件
Component({

    properties: {
        content: {//搜索内容
            type: String,
            value: ''
        },
        clearFlag: {//是否显示clear按钮
            type: Boolean,
            value: false,
        },
        backgroundColor: {//背景色
            type: String,
            value: 'rgba(255, 255, 255, 1)'
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
    },

    /**
     * 组件的方法列表

     */
    methods: {

        //获得焦点
        focus() {
            console.info("获得焦点");
        },
        //失去焦点
        blur() {
            console.info('失去焦点')
        },
        //搜索输入
        input(e) {
            console.info('搜索输入',e)
            this.setData({
                content: e.detail.value,
            })
            console.info('搜索输入 content', this.data.content)

            //如果输入数据长度不为空，则显示清除按钮
            //反之，不显示清除按钮
            if(this.data.content!=''){
                this.setData({
                    clearFlag: true,
                })
            }else{
                this.setData({
                    clearFlag: false,
                })
            }
            //this.triggerEvent("searchList", e);
        },
        //查询
        confirm(e) {
            console.info('查询', e)
            this.triggerEvent("endsearchList");
        },
        //清空搜索框
        clear(e) {
            console.info("清空搜索框",e);
            console.info('清空搜索框前 content', this.data.content)
            this.setData({
                content: '',
                clearFlag:false,
            })
            console.info('清空搜索框后 content', this.data.content)

            //this.triggerEvent("clearSearch");
        },
        // 取消
        // cancel() {
        //     console.info("取消", e);
        //     this.setData({
        //         flag: false,
        //     })
        //     this.triggerEvent("cancelSearch");
        // }
    }
})
