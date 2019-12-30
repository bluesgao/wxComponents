const app = getApp();

Component({

    properties: {
        backgroundColor: {//背景色
            type: String,
            value: 'rgba(255, 255, 255, 1)'
        },
        title: {//导航栏-名称
            type: String,
            value: 'Wechat'
        },
        back: {//是否需要显示返回上一页按钮
            type: Boolean,
            value: false
        },
        home: {//是否需要显示返回首页按钮
            type: Boolean,
            value: false
        },
        search: {//是否需要显示搜索框
            type: Boolean,
            value: false
        },
        content: {//搜索内容
            type: String,
            value: ''
        },
        clearFlag: {//搜索框是否显示clear按钮
            type: Boolean,
            value: false,
        },
        tabList: {//tab栏项目
            type: Array,
            value: []
        }
    },

    data: {
        statusBarHeight: 0,
        navBarHeight: 0,
        // tabList: [],
        currentTab: 0
    },

    created: function () {
        this.getSystemInfo();
        console.info("created1:", wx.getSystemInfoSync())

    },
    attached: function () {
        this.setStyle(); //设置样式
    },
    methods: {
        //导航栏-回到首页
        goHome: function () {
            console.info("goHome")
        },
        //导航栏-回到上一页
        goBack: function () {
            console.info("goBack")
            wx.navigateBack({
                delta: 1
            })
        },
        //搜索框-获得焦点
        focus(e) {
            console.info("获得焦点");
            this.triggerEvent("searchFocus", e);

        },
        //搜索框-失去焦点
        blur(e) {
            console.info('失去焦点')
            this.triggerEvent("searchBlur", e)
        },
        //搜索框-输入
        input(e) {
            console.info('搜索输入', e)
            this.setData({
                content: e.detail.value,
            })
            console.info('搜索输入 content', this.data.content)

            //如果输入数据长度不为空，则显示清除按钮
            //反之，不显示清除按钮
            if (this.data.content != '') {
                this.setData({
                    clearFlag: true,
                })
            } else {
                this.setData({
                    clearFlag: false,
                })
            }
            this.triggerEvent("searchInput", e);
        },
        //搜索框-查询
        confirm(e) {
            console.info('搜索框-查询', e)
            this.triggerEvent("searchConfirm", e);
        },
        //搜索框-清空
        clear(e) {
            console.info("清空搜索框", e);
            console.info('清空搜索框前 content', this.data.content)
            this.setData({
                content: '',
                clearFlag: false,
            })
            console.info('清空搜索框后 content', this.data.content)
            this.triggerEvent("searchClear");
        },
        //tab栏-选择
        selectTab: function (e) {
            console.info('selectTab ', e)
            console.info('selectTab currentTarget', e.currentTarget.dataset.index)
            this.setData({
                currentTab: e.currentTarget.dataset.index,
            })
            console.info('selectTab data ', this.data)
        },

        //设置样式（状态栏高度，导航栏高度）
        setStyle: function () {
            this.setData({
                statusBarHeight: app.globalSystemInfo.statusBarHeight,
                navBarHeight: app.globalSystemInfo.navBarHeight,
            })
        },
        //获取系统参数
        getSystemInfo() {
            var app = getApp();
            if (app.globalSystemInfo && !app.globalSystemInfo.ios) {
                console.info("getSystemInfo 1");
                return app.globalSystemInfo;
            } else {
                console.info("getSystemInfo 2");
                let systemInfo = wx.getSystemInfoSync();
                console.info("getSystemInfo systemInfo1 ", systemInfo);

                let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
                let rect;
                try {
                    rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
                    if (rect === null) {
                        throw 'getMenuButtonBoundingClientRect error';
                    }
                    //取值为0的情况  有可能width不为0 top为0的情况
                    if (!rect.width || !rect.top || !rect.left || !rect.height) {
                        throw 'getMenuButtonBoundingClientRect error';
                    }
                } catch (error) {
                    let gap = ''; //胶囊按钮上下间距 使导航内容居中
                    let width = 96; //胶囊的宽度
                    if (systemInfo.platform === 'android') {
                        gap = 8;
                        width = 96;
                    } else if (systemInfo.platform === 'devtools') {
                        if (ios) {
                            gap = 5.5; //开发工具中ios手机
                        } else {
                            gap = 7.5; //开发工具中android和其他手机
                        }
                    } else {
                        gap = 4;
                        width = 88;
                    }
                    if (!systemInfo.statusBarHeight) {
                        //开启wifi的情况下修复statusBarHeight值获取不到
                        systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
                    }
                    rect = {
                        //获取不到胶囊信息就自定义重置一个
                        bottom: systemInfo.statusBarHeight + gap + 32,
                        height: 32,
                        left: systemInfo.windowWidth - width - 10,
                        right: systemInfo.windowWidth - 10,
                        top: systemInfo.statusBarHeight + gap,
                        width: width
                    };
                    console.info('error', error);
                    console.info('rect', rect);
                }
                console.info("getSystemInfo rect,", rect);

                let navBarHeight = '';
                if (!systemInfo.statusBarHeight) {
                    systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
                    navBarHeight = (function () {
                        let gap = rect.top - systemInfo.statusBarHeight;
                        return 2 * gap + rect.height;
                    })();

                    systemInfo.statusBarHeight = 0;
                    systemInfo.navBarExtendHeight = 0; //下方扩展4像素高度 防止下方边距太小
                } else {
                    navBarHeight = (function () {
                        let gap = rect.top - systemInfo.statusBarHeight;
                        return systemInfo.statusBarHeight + 2 * gap + rect.height;
                    })();
                    if (ios) {
                        systemInfo.navBarExtendHeight = 4; //下方扩展4像素高度 防止下方边距太小
                    } else {
                        systemInfo.navBarExtendHeight = 0;
                    }
                }
                systemInfo.navBarHeight = navBarHeight; //导航栏高度不包括statusBarHeight
                systemInfo.capsulePosition = rect; //右上角胶囊按钮信息bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87 目前发现在大多机型都是固定值 为防止不一样所以会使用动态值来计算nav元素大小
                systemInfo.ios = ios; //是否ios

                app.globalSystemInfo = systemInfo; //将信息保存到全局变量中,后边再用就不用重新异步获取了
                console.info("getSystemInfo systemInfo2 ", systemInfo);

                //console.log('systemInfo', systemInfo);
                return systemInfo;
            }
        }
    }
})