Component({
  data: {
    tabList: ['今', '烟', '净'],
    currentTab: 0
  },
  properties: {
    tabList: {
      type: Object,
      value: []
    },
    currentTab: {
      type: Number,
      value: 0
    }
  },
  attached: function () {
    console.info('attached ', this.data)



  },
  methods: {
    //选择tab
    selectTab: function (e) {
      console.info('selectTab ', e)
      console.info('selectTab currentTarget', e.currentTarget.dataset.index)
      this.setData({
        currentTab: e.currentTarget.dataset.index,
      })
      console.info('selectTab data ', this.data)

    },
  }
})