// 上线环境
const URL_TOTAL = 'xxx1';
const URL_CHART = 'xxx2';

// 以假设固定的宽高像素进行开发，方便CSS单位取值（但是宽高比例要正确）
const monitorInfo = {
	width: 1920,
	height: 1080
};
let screenWidth = 1920;
let undoChart = null;
let doingChart = null;

window.onresize = function () {
	initMonitorSize();
}

window.onload = function () {
	initMonitorSize();
	initChart();
	renderClock();

	// 请求综合概览
	getData({
		url: URL_TOTAL,
		onsuccess: renderTotal
	});
	// 请求 未受理工单分布
	getData({
		url: URL_CHART,
		query: {
			requestType: 0
		},
		onsuccess: (data) => updateChart(undoChart, data)
	});
	// 请求 受理中工单分布
	getData({
		url: URL_CHART,
		query: {
			requestType: 1
		},
		onsuccess: (data) => updateChart(doingChart, data)
	});
}

/**
 * 封装 Ajax 并定时请求
 */
function getData(opts = {}) {
	let url = opts.url;
	let query = opts.query || {};
	let queryStr = [];
	for (let key in query) {
		if (query.hasOwnProperty(key)) {
			queryStr.push(`${key}=${query[key]}`);
		}
	}
	if (queryStr.length) {
		queryStr = queryStr.join('&');
		url += '?' + queryStr;
	}
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let data = JSON.parse(xhr.responseText);
			data.code === 0 && opts.onsuccess(data.data);
		}
	}
	xhr.open('GET', url, true);
	xhr.send(null);
	setTimeout(() => getData(opts), 1000 * 10);
}

/**
 * 渲染时钟
 */
function renderClock() {
	let now = new Date(),
		year = now.getFullYear(),       //年
		month = now.getMonth() + 1,			//月
		day = now.getDate(),     				//日
		hh = now.getHours(),            //时
		mm = now.getMinutes(),         	//分
		ss = now.getSeconds(),          //秒
		clock = year + '-';

	month < 10 && (clock += '0');
	clock += month + '-';

	day < 10 && (clock += '0');
	clock += day + ' ';

	hh < 10 && (clock += '0');
	clock += hh + ' : ';

	mm < 10 && (clock += '0');
	clock += mm + ' : ';

	ss < 10 && (clock += '0');
	clock += ss;

	// console.log('clock', clock);
	document.getElementById('clock').innerText = clock;
	setTimeout(renderClock, 1000 * 1);
}

/**
 * 渲染综合概览
 */
function renderTotal(data = {}) {
	// data = mockTotal.data; // 取消注释，启用模拟数据
	document.querySelector('#new .count').innerText = data.newWorkOrderNum < 10
		? '00' + data.newWorkOrderNum
		: data.newWorkOrderNum < 100
			? '0' + data.newWorkOrderNum
			: data.newWorkOrderNum;
	document.querySelector('#finished .count').innerText = data.finishedWorkOrderNum.toLocaleString();
	document.querySelector('#cs .count').innerText = data.csWorkOrderNum.toLocaleString();
	document.querySelector('#undo .count').innerText = data.undoWorkOrderNum.toLocaleString();
	document.querySelector('#doing .count').innerText = data.doingWorkOrderNum.toLocaleString();
}

function initChart() {
	const option = {
		color: ['#07b2ff', '#01cd79', '#fed033'],
		legend: {
			top: '6%',
			right: '5%',
			itemWidth: 14,
			itemGap: 35,
			textStyle: {
				color: '#fff',
				fontSize: 20,
				padding: [0, 0, 0, 10]
			},
		},
		grid: {
			show: true,
			left: '3%',
			right: '5%',
			top: '20%',
			bottom: '5%',
			borderWidth: 0,
			containLabel: true // grid 包含刻度标签，以防止溢出
		},
		tooltip: {
			trigger: 'axis', // 触发类型
			axisPointer: { //轴上如果设置了 axisPointer，会覆盖此设置
				type: 'line'
			},
			backgroundColor: '#3a345d',
			padding: [10, 15],
			textStyle: {
				fontSize: 15,
				lineHeight: 20
			}
		},
		xAxis: [
			{
				type: 'category',
				axisLine: {
					lineStyle: {
						color: '#6788cf', // 轴线颜色
						width: 2
					}
				},
				axisTick: {
					show: false // 不显示坐标轴刻度
				},
				axisLabel: {
					color: '#6788cf', // 刻度标签文字颜色
					fontSize: 18,
					margin: 16,
					interval: 0,	// 无论如何，显示所有标签
					formatter: value => { // 4个字符换行
						const labelArr = [];
						for (let i = 0, length = value.length; i < length; i += 6) {
							labelArr.push(value.substr(i, 6));
						}
						return labelArr.join('\n');
					}
				}
			}
		],
		yAxis: [
			{
				type: 'value',
				name: '数量',
				nameTextStyle: {
					color: '#fff',
					fontSize: 20
				},
				nameGap: 25,
				axisLine: {
					lineStyle: {
						color: '#6788cf', // 轴线颜色
						width: 2
					}
				},
				axisTick: {
					show: false
				},
				minInterval: 1,
				axisLabel: {
					color: '#6788cf', // 刻度标签文字颜色
					fontSize: 20,
					margin: 16
				},
				splitLine: {
					lineStyle: { //坐标轴在 grid 区域中的分隔线
						color: '#3c549c'
					}
				}
			}
		],
	};
	// 初始化容器
	const container = document.getElementsByClassName('container');
	[...container].forEach(ct => {
		ct.style.cssText = 'width: 725px; height: 345px';
	});
	undoChart = echarts.init(container[0]);
	doingChart = echarts.init(container[1]);
	undoChart.setOption(option);
	doingChart.setOption(option);
}

/**
 * 更新图表
 */
function updateChart(chart = {}, { chartdatas = {} }) {
	chart.setOption({
		legend: {
			data: chartdatas.map(d => d.extradata.legend)
		},
		xAxis: {
			data: chartdatas[0].chartdata.x
		},
		series: chartdatas.map(d => ({
			type: 'bar',
			barWidth: 15,
			barMinHeight: 2, // 可以设置最小bar高度，以防数据差过大效果不佳
			barGap: '100%',
			label: {	// 每个图形上的标签
				show: true,
				position: 'top',
				fontSize: 16,
			},
			name: d.extradata.legend,
			data: d.chartdata.y
		}))
	});
}

/**
 * 初始化监控页面尺寸
 */
function initMonitorSize() {
	screenWidth = window.innerWidth;
	document.body.style.width = monitorInfo.width + "px";
	document.body.style.height = monitorInfo.height + "px";
	document.body.style.transform = "scale(" + screenWidth / monitorInfo.width + ")";
}
