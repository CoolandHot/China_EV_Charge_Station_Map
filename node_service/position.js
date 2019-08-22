
var sql = require('mysql');
var Map_database = 'amap_table';
var Map_table = 'geolocat';
var connection = sql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		port: '3306',
	});
connection.connect();
connection.query("use " + Map_database);
/**
 * 获取所有标记点
 * @param req
 * @param res
 */
 exports.KeepAlive=function(){
	 connection.query("select 1;");
 }
 exports.feedback=function(info,res){
	 var FB_table="feedbackForm";
	 var SqlStr="insert into "+FB_table+" (FBType,title,detail,contactM,contactN) values(?,?,?,?,?)";
		connection.query(SqlStr, [info.station=="BUG"?0:1,info.title,info.FBDetail,info.contact,info.number], (err, result) => {
			if (err) {
				throw err;
			}
			res.send('已接收' + result.affectedRows+'条反馈，谢谢#^_^#');
		});//BUG为0，桩增减为1
		
 }
  exports.dataAdd=function(info,res){
	 var SqlStr="insert into "+Map_table+" (city,site_id,site_brand,lng,lat,fast,slow) values(?,?,?,?,?,?,?)";
	 var lnglat=info.lnglat.split(",");
	 if(info.psw=="qNSqxWgBFecV1DGxLv8o"){
		 	connection.query(SqlStr, [info.city,info.siteID,info.siteBrand,lnglat[0],lnglat[1],info.fast,info.slow], (err, result) => {
			if (err) {
				throw err;
				res.send('输入有误');
			}
			res.send('已增加' + result.affectedRows+'条桩信息，谢谢#^_^#');
		});
	 }
	 else res.send("密保错误");
 }

exports.getMarkers = function (req, res) {
	var lng = parseFloat(req.lng);
	var lat = parseFloat(req.lat);
	var queryTime = new Date();
	var radius = 6371; //地球半径千米
	var SqlStr = "select * from " + Map_table + " WHERE (lng between ? and ? ) and (lat between ? and ? )";
	var check_count=1; //第一次查询
	var dlng,
	dlat,
	minlat,
	maxlat,
	minlng,
	maxlng;
	console.log('LngLat : ' + lng + "," + lat + ' ; Time : ' + (queryTime.getMonth() + 1) + '-' + queryTime.getDate() + ' ' + queryTime.getHours() + ':' + queryTime.getMinutes() + ':' + queryTime.getSeconds());

	//半径为distance的范围计算
	function RadiusField(dis) {
		dlng = 2 * Math.asin(Math.sin(dis / (2 * radius)) / Math.cos(lat * Math.PI / 180));
		dlng = dlng * 180 / Math.PI; //角度转为弧度
		dlat = dis / radius;
		dlat = dlat * 180 / Math.PI;
		minlat = lat - dlat;
		maxlat = lat + dlat;
		minlng = lng - dlng;
		maxlng = lng + dlng;
	} //end of RadiusField

	function FrontSend(result) {
		if (result.length > 600 && check_count) {
			Query_Con(10);
			check_count=0;//只再查询一次
			return;
		}
		var new_3 = [];
		result.forEach(function (item) {
			var new_1item = {
				site_id: item.site_id,
				lng: item.lng,
				lat: item.lat,
				fast: item.fast,
				slow: item.slow,
				site_brand: item.site_brand
			};
			new_3.push(new_1item);
		});
		console.log("Return " + new_3.length + " query results");
		res.send(new_3);
	} //end of FrontSend

	function Query_Con(dis) {
		RadiusField(dis) //dis公里
		//console.log("four Radius point : "+minlng+","+maxlng+","+minlat+","+maxlat);
		connection.query(SqlStr, [minlng, maxlng, minlat, maxlat], (err, result) => {
			if (err) {
				throw err;
			}
			FrontSend(result);
		})
	}
	Query_Con(100); //默认查询100公里内
};
