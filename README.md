# China_EV_Charge_Station_Map
Charge Station Map for Energy Vehicle in China

Import the database into MySQL, change the node_services\position.js code
```javascript
var sql = require('mysql');
var Map_database = 'amap_table';
var Map_table = 'geolocat';
var connection = sql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'your database password',
		port: '3306',
	});
```

**Database Structure**
```javascript
database: amap_table
table:		geolocat

mysql> select * from geolocat limit 3;
+-------+--------+--------------------------+--------------+------------+-----------+------+------+
| id    | city   | site_id                  | site_brand   | lng        | lat       | fast | slow |
+-------+--------+--------------------------+--------------+------------+-----------+------+------+
| 56002 | 北京   | 北京利玖洲充电站         | 特来电       | 116.286399 | 39.754035 |    4 |   16 |
| 56003 | 北京   | 北理工充电桩站           | 国家电网     | 116.319789 | 39.957881 |    2 |   14 |
| 56004 | 北京   | 清华科技园充电站         | 国家电网     | 116.329629 | 39.993777 |    3 |   11 |
+-------+--------+--------------------------+--------------+------------+-----------+------+------+
3 rows in set (0.00 sec)
```

