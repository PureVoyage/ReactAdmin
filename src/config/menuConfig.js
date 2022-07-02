const menuList = [
	{key: '/home', title:'首页'},
	{key: 'sub1', title:'商品', children: [
			{key: '/category', title:'品类管理'},
			{key: '/product', title:'商品管理'}
		]
	},
	{key: '/user', title:'用户管理'},
	{key: '/role', title:'角色管理'},
	{key: 'sub2', title:'图形图表', children: [
			{key: '/charts/bar', title:'柱状图'},
			{key: '/charts/line', title:'折线图'},
			{key: '/charts/pie', title:'饼状图'}
		]
	},
]

export default menuList;
