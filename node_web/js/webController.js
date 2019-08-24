console.time();

var geolocation, cluster, markers = [];
var map = new AMap.Map("container", {
		resizeEnable: true,
	});

//Markers make
function LoadMarkers(nearMarkers) {
	if (cluster) {
		cluster.setMap(null);
	} //清空cluster
	markers.splice(0, markers.length); //清空markers
	var infoWindow = new AMap.InfoWindow({
			offset: new AMap.Pixel(0, -30)
		});
	nearMarkers.forEach(function (item) {
		var site_id = item.site_id;
		var lng = item.lng;
		var lat = item.lat;
		var fast = item.fast;
		var slow = item.slow;
		var site_brand = item.site_brand;
		var marker = new AMap.Marker({
				position: [lng, lat],
				map: map,
				icon: new AMap.Icon({
					size: new AMap.Size(30, 43), //图标大小
					image: "./img/blue30x38.png"
				})
			});
		switch (site_brand) {
		case "特斯拉":
			marker.setIcon("./img/tsl30x43.png");
			break;
		case "粤易充":
			marker.setIcon("./img/SPG30x38.png");
			break;
		case "南方电网":
			marker.setIcon("./img/SPG30x38.png");
			break;
		case "国家电网":
			marker.setIcon("./img/SPG30x38.png");
			break;
		case "特来电":
			marker.setIcon("./img/teld30x43.png");
			break;
		case "普天":
			marker.setIcon("./img/PT30x38.png");
			break;
		case "爱电牛":
			marker.setIcon("./img/ADN.png");
			break;
		case "依威能源":
			marker.setIcon("./img/evpowergroup.png");
			break;
		case "星星充电":
			marker.setIcon("./img/starcharge.png");
			break;
		case "充电队长":
			marker.setIcon("./img/letscharge.png");
			break;
		default:
			break;
		}

		marker.content = site_id + "<span style='color:#F00;'>" + site_brand + "</span></br>快充：" + fast + "；慢充：" + slow + "；</br>" + "<button class='btn btn-blue' onclick='window.open(\"https://uri.amap.com/navigation?from=&to=" + lng + "," + lat + "," + site_id + "&via=&mode=car&policy=0&src=STral&coordinate=gaode&callnative=1\")'>高德导航</button>" + "<button class='btn btn-green' onclick='window.open(\"baidumap://map/direction?&region=广东&destination=latlng:" + lat + "," + lng + "|name:" + site_id + "&mode=driving&coord_type=gcj02&src=webapp.line.圣创杂学堂.STral\")'>百度导航</button>";
		marker.on('click', function (e) {
			infoWindow.setContent(e.target.content);
			infoWindow.open(map, e.target.getPosition());
		});
		markers.push(marker);
	}) //End of nearMarkers.forEach

	//ClusterMarker
	var count = markers.length;
	var _renderCluserMarker = function (context) {
		var factor = Math.pow(context.count / count, 1 / 18)
			var div = document.createElement('div');
		var Hue = factor * 180;
		var bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
		var fontColor = 'hsla(' + Hue + ',100%,20%,1)';
		var borderColor = 'hsla(' + Hue + ',100%,40%,1)';
		var shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
		div.style.backgroundColor = bgColor
			var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
		div.style.width = div.style.height = size + 'px';
		div.style.border = 'solid 1px ' + borderColor;
		div.style.borderRadius = size / 2 + 'px';
		div.style.boxShadow = '0 0 1px ' + shadowColor;
		div.innerHTML = context.count;
		div.style.lineHeight = size + 'px';
		div.style.color = fontColor;
		div.style.fontSize = '14px';
		div.style.textAlign = 'center';
		context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
		context.marker.setContent(div)
	} //end of cluster context
	addCluster();
	function addCluster() {
		cluster = new AMap.MarkerClusterer(map, markers, {
				gridSize: 80,
				minClusterSize: 10,
				renderCluserMarker: _renderCluserMarker
			});
	}
}

// Draw Map
map.plugin(['AMap.Geolocation'], function () {
	geolocation = new AMap.Geolocation({
			timeout: 15000, //超过15秒后停止定位
			zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			buttonPosition: 'RB'
		});
	map.addControl(geolocation);
	geolocation.getCurrentPosition();
	AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
});
//解析定位结果
function onComplete(data) {
	$("#lnglatSave").text(JSON.stringify({
			lng: data.position.getLng(),
			lat: data.position.getLat()
		}));
	$.post("/getMarkers", {
		lng: data.position.getLng(),
		lat: data.position.getLat()
	},
		function (data) {
		$("#MarkersSave").text(JSON.stringify(data));
		LoadMarkers(data);
	});
}

//POI搜索
AMap.plugin(['AMap.Autocomplete'], function () {
	var autoOptions = {
		city: '', //城市，默认全国
		input: "tipinput" //使用联想输入的input的id
	};
	var autocomplete = new AMap.Autocomplete(autoOptions);
	AMap.event.addListener(autocomplete, "select", function (e) {
		map.setCity(e.poi.adcode, ()=>{
				$("#lnglatSave").text(JSON.stringify({
						lng: map.getCenter().lng,
						lat: map.getCenter().lat
					}));
				$.post("/getMarkers", {
					lng: map.getCenter().lng,
					lat: map.getCenter().lat
				}, (data) => {
					$("#MarkersSave").text(JSON.stringify(data));
					LoadMarkers(data);
				});
		});
	});
});

$("#map_tool").click(() => {
	window.location.href = "./AMap_Geo2Address.html";
});
$("#feedback").click(() => {
	window.location.href = "./feedback.html";
});
$("#chargestation").click(() => {
	if ($(".station_ADN").css("display") == 'block') {
		$("[class^=station_]").hide();
		$("[class^=bg_]").hide();
		$(".clearFilter").hide();
	} else {
		$("[class^=station_]").show();
		$("[class^=bg_]").show();
		$(".clearFilter").show();
	}
});
$(".clearFilter").click(()=>{
	var FilterMarkers = JSON.parse($("#MarkersSave").text());
	LoadMarkers(FilterMarkers);
});
$(".bg_ADN").click(()=>{
	var FilterMarkers = JSON.parse($("#MarkersSave").text());
	var aSearch = $.grep(FilterMarkers, function (item) {
			return item.site_brand == '爱电牛';
		});
	LoadMarkers(aSearch);
});
$(".bg_YYC").click(() => {
	var FilterMarkers = JSON.parse($("#MarkersSave").text());
	var aSearch = $.grep(FilterMarkers, function (item) {
			return item.site_brand == '粤易充';
		});
	LoadMarkers(aSearch);
});
$(".bg_TSL").click(() => {
	var FilterMarkers = JSON.parse($("#MarkersSave").text());
	var aSearch = $.grep(FilterMarkers, function (item) {
			return item.site_brand == '特斯拉';
		});
	LoadMarkers(aSearch);
});
$(".bg_TELD").click(() => {
	var FilterMarkers = JSON.parse($("#MarkersSave").text());
	var aSearch = $.grep(FilterMarkers, function (item) {
			return item.site_brand == '特来电';
		});
	LoadMarkers(aSearch);
});
$(".bg_PT").click(() => {
	var FilterMarkers = JSON.parse($("#MarkersSave").text());
	var aSearch = $.grep(FilterMarkers, function (item) {
			return item.site_brand == '普天';
		});
	LoadMarkers(aSearch);
});
$(".bg_starcharge").click(() => {
	var FilterMarkers = JSON.parse($("#MarkersSave").text());
	var aSearch = $.grep(FilterMarkers, function (item) {
			return item.site_brand == '星星充电';
		});
	LoadMarkers(aSearch);
});
$(".bg_evpower").click(() => {
	var FilterMarkers = JSON.parse($("#MarkersSave").text());
	var aSearch = $.grep(FilterMarkers, function (item) {
			return item.site_brand == '依威能源';
		});
	LoadMarkers(aSearch);
});
$(".bg_letscharge").click(() => {
	var FilterMarkers = JSON.parse($("#MarkersSave").text());
	var aSearch = $.grep(FilterMarkers, function (item) {
			return item.site_brand == '充电队长';
		});
	LoadMarkers(aSearch);
});

console.timeEnd();
