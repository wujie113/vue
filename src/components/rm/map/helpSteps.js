const steps = [
  {
    element: '#mapctrl',
    popover: {
      title: '操作工具栏',
      description: '图形操作区域，包括工具栏开关、图层管理开关。<br><br>绘图模式下，绘图按键：<p><ol><li>点击，开始绘图，或添加点；</li><li>双击，完成绘图；</li><li>Alt+点击，删除连接节点；</li><li> Shift+拖动鼠标，任意绘图；</li></ol></p>',
      position: 'left'
    }
  },
  {
    element: '#map-btn-toolbar',
    popover: {
      title: '工具栏',
      description: '图形操作工具栏，包括对象编辑、测距、标注等常用操作',
      position: 'left'
    }
  }, {
    element: '#map-btn-resetaction',
    popover: {
      title: '选择操作',
      description: '选择操作，将退出地图的其其它编辑环境，回到地图浏览模式。',
      position: 'bottom'
    }
  }, {
    element: '#map-btn-clean',
    popover: {
      title: '清除',
      description: '清除地图中所有的绘制内容',
      position: 'bottom'
    }
  }, {
    element: '#map-btn-mea',
    popover: {
      title: '测距',
      description: '测量多个连接点之间的实际距离',
      position: 'bottom'
    }
  }, {
    element: '#map-btn-mark',
    popover: {
      title: '标注',
      description: '在地图上标注点，方便快速查找',
      position: 'left'
    }
  }, {
    element: '#map-btn-help',
    popover: {
      title: '帮助',
      description: '帮助菜单入口',
      position: 'left'
    }
  },
  {
    element: '#map-btn-layer',
    popover: {
      title: '图层管理',
      description: '地图所有图层列表，点击选中或取消选中图层',
      position: 'left'
    }
  }
]

export default steps
