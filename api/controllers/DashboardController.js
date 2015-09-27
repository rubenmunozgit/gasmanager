/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	'dashboard': function(req, res) {
		res.view();
	},

	create: function (req, res, next) {
		var dshbObj = {
			distance: req.param('distance'),
			qty: req.param('qty'),
			totalprice: req.param('totalprice'),
			fulldepot: req.param('fulldepot'),
			user: req.param('user')
		}
		//Create a line in Dasboard Table for the user signed_in
		
		Dashboard.find({
			where: {user: dshbObj.user},
			sort: 'createdAt DESC'
			}).exec(function findrecordsbyuserorderbydate (err, recordsByDate) {
				//if error return the error
				if(err) {
					console.log(err);
					//redirect to error page
					return res.negotiate(err);
				} 
				var sumaDistance=0,sumaQty=0, tripsToFull=0;
				var avgDistance, avgQty;
				//After succesfull retrieve all record by date, check if Tank is full or not to calculate comsuntion
				if(dshbObj.fulldepot == "on") {//Full Deposit. Do calculate 
					dshbObj.fulldepot = true;
					dshbObj.consumed = 0;
					/*Start calculating*/
					while(recordsByDate[tripsToFull] !== undefined){
						if(recordsByDate[tripsToFull].fulldepot !== true) {
							sumaDistance += recordsByDate[tripsToFull].distance;
							sumaQty += recordsByDate[tripsToFull].qty;
						}
						else {
							break; //break while
						}
						tripsToFull++;
					}
					sumaDistance += parseFloat(dshbObj.distance);
					sumaQty += parseFloat(dshbObj.qty);
					dshbObj.consumed = (sumaQty*100/sumaDistance).toFixed(3);
					/*End Calculate */
				}
				else {
					dshbObj.fulldepot = false;
				}
				/*res.json({
					recordsByDate: recordsByDate
				});*/
				 
				Dashboard.create(dshbObj, function dashboardcreated (err, dashboard) {
					//if error return the error
					if(err) {
						console.log(err);
						//redirect to error page
						return res.negotiate(err);
					} 
					//After succesfull
					//redirect to the show action
					res.redirect('/dashboard/showdb/' + dashboard.user);
				});		
			}
		);
	},

	showdb: function (req, res, next) {
		if(req.params.id != req.session.User.id) {
			//request from different user, logged as another user
			res.redirect('/');
			return;
		}
		var daysFrom = 365;
		var today = new Date();
		var dateFrom = new Date(today.setDate(today.getDate() - daysFrom));

		Dashboard.find({
			where: {user: req.session.User.id,
					date: {'>': dateFrom}},
			sort: 'date DESC'
			}).exec(function dshbTable(err, dshbtable){
			if(err) {
				console.log(err);
				//redirect to error page
				return res.negotiate(err);
			}
			var sumaDistance=0,sumaConsumed=0,sumaPrice=0, tripsFull=0;
			var avgDistance, avgConsumed, avgQty;
			var percDistance,percConsumed, percPrice;
			for (var i = 0; i < dshbtable.length; i++) {
				sumaPrice = sumaPrice + dshbtable[i].totalprice;
				if(dshbtable[i].consumed != undefined){
					sumaConsumed = sumaConsumed + dshbtable[i].consumed;
					sumaDistance = sumaDistance + dshbtable[i].distance;
					tripsFull++;
				}
			};
			avgDistance = (sumaDistance/tripsFull).toFixed(1);
			avgConsumed = (sumaConsumed/tripsFull).toFixed(2);
			avgPrice = (sumaPrice/dshbtable.length).toFixed(2);
			if (dshbtable.length == 0) {//No data in DB. Init de ShowDashBoard
				percDistance = 0;
				percConsumed = 0;
				percPrice = 0;
			}
			else {
				percDistance = (((dshbtable[0].distance-avgDistance)/avgDistance)*100).toFixed(1);
				percConsumed = (((dshbtable[0].consumed-avgConsumed)/avgConsumed)*100).toFixed(1);
				percPrice = (((dshbtable[0].totalprice-avgPrice)/avgPrice)*100).toFixed(1);

			}
			
			
			// pass the array down to the /views/dashboad/showdb.ejs page
			res.view({
				dshbtable: dshbtable,
				avgDistance: (isNaN(avgDistance) ? "--" : avgDistance),
				avgConsumed: (isNaN(avgConsumed) ? "--" : avgConsumed),
				avgPrice: (isNaN(avgPrice) ? "--" : avgPrice),
				percDistance: (isNaN(percDistance) ? "--" : percDistance),
				percConsumed: (isNaN(percConsumed) ? "--" : percConsumed),
				percPrice: (isNaN(percPrice) ? "--" : percPrice)
			});

			// pass the array down to the /views/dashboad/showdb.ejs page
			/*res.json({
				dataByMonth: dataByMonth,
				dshbtable: dshbtable,
				avgDistance: avgDistance,
				avgConsumed: avgConsumed,
				avgQty: avgQty
			});*/
		});
	},

	findByUserDate: function (req, res, next) {
		console.log(req.allParams());
		var userid = req.session.User.id;
		var daysFrom = req.param('days');
		var today = new Date();
		var dateFrom = new Date(today.setDate(today.getDate() - daysFrom));
		console.log(dateFrom);
		Dashboard.find({
			user: userid,
			date: {'>': dateFrom}
		}).exec(function(err, graphDataByDate){
			res.json(
				graphDataByDate
			);
		});

	},

	findByMonth: function (req, res, next) {
		console.log(req.allParams());
		var userid = req.session.User.id;
		var daysFrom = 180;
		var today = new Date();
		var dateFrom = new Date(today.setDate(today.getDate() - daysFrom));
		
		Dashboard.find({
			user: userid,
			date: {'>': dateFrom}
		}).exec(function(err, graphDataByMonth){
			/*Calculate by month*/
			var grouped = {};


			for(var i = 0; i < graphDataByMonth.length; i++) {
			    var groupKey = graphDataByMonth[i];    
			    var dt_object = new Date(graphDataByMonth[i].date); // convert to datetime object
			    var key = dt_object.getFullYear() + '-' + (dt_object.getMonth()+1);

			    if(typeof grouped[key] === "undefined") {
			        grouped[key] = [{
			            dist: 0,
			            price: 0}];
			    }

			    grouped[key][0].dist = (parseFloat(grouped[key][0].dist) + parseFloat(groupKey.distance)).toFixed(2);
			    grouped[key][0].price = (parseFloat(grouped[key][0].price) + parseFloat(groupKey.totalprice)).toFixed(2);
			    
			}
			
			function bymonth(date,price,distance) {
			    this.date = date;
			    this.price = price;
			    this.distance = distance;
			}

			var dataByMonth = [];
			var idx = 0;
			for(var j in grouped) {
			    dataByMonth[idx] = new bymonth(j,grouped[j][0].price,grouped[j][0].dist );
			    idx++;
			}
			

			/*End Calc By Month*/
			res.json(
				dataByMonth
			);
		});

	}
};

