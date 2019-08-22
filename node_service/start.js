var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var position = require('./position');

app.set('port', process.env.PORT || 3179);
app.use(bodyParser.urlencoded({ extended: true })) ;
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../node_web')));//设置静态文件目录
app.get('/',function (req, res) {res.sendFile( __dirname + '../node_web/Index.html' )});
app.post('/getMarkers',(req,res)=>{return position.getMarkers(req.body,res)});
app.post('/postFeedback',(req,res)=>{
	console.log('Feedback: '+JSON.stringify(req.body))
		return position.feedback(req.body,res);		
});
app.post('/infoadd',(req,res)=>{
		return position.dataAdd(req.body,res);		
});
setInterval(()=>{position.KeepAlive()},60000);//query mysql server every 1 min	
app.listen(app.get('port'),function(){
    console.log('Node Port :'+app.get('port'));
});

process.on('uncaughtException', function (err) {
    console.log(err);
});