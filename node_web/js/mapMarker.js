console.time();

var geolocation, coordinates=[], markers = [];
var map = new AMap.Map("container", {
		resizeEnable: true,
	});

//Markers make
function LoadMarkers(nearMarkers) {
	markers.splice(0, markers.length); //清空markers
	var infoWindow = new AMap.InfoWindow({
			offset: new AMap.Pixel(0, -30)
		});
	nearMarkers.forEach(function (item) {
		var marker = new AMap.Marker({
				position: [item[0],item[1]],
				map: map,
			});
		marker.content = item[2] +"</br><button class='btn btn-blue' onclick='window.open(\"https://uri.amap.com/navigation?from=&to=" + item[0] + "," + item[1] + "," + item[2] + "&via=&mode=car&policy=0&src=STral&coordinate=gaode&callnative=1\")'>高德导航</button>" + "<button class='btn btn-green' onclick='window.open(\"baidumap://map/direction?&region=广东&destination=latlng:" + item[1] + "," + item[0] + "|name:" + item[2] + "&mode=driving&coord_type=gcj02&src=webapp.line.圣创杂学堂.STral\")'>百度导航</button>";
		marker.on('click', function (e) {
			infoWindow.setContent(e.target.content);
			infoWindow.open(map, e.target.getPosition());
		});
		markers.push(marker);
	}) //End of nearMarkers.forEach
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
});

function add_coords(){
	coordinates.splice(0,coordinates.length);
	var add_input=document.getElementById("text_input").value.split("\n");
	if(add_input){
		for(var i in add_input){
			var xx=add_input[i].split(',');
			coordinates.push([xx[0]*1,xx[1]*1,xx[2]]);
		}
	}
	else{
		var xx=document.getElementById("text_input").value.split(',');
		coordinates.push([xx[0]*1,xx[1]*1,xx[2]]);
	}
	LoadMarkers(coordinates);
	document.getElementById('input_coords_div').style.display='none';
}

console.timeEnd();
