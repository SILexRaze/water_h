Highcharts.setOptions(Highcharts.theme)
const	ajax = (json, method = "POST") => {
	return new Promise(function(resolve, reject) {
		$.ajax({
			method:method,
			url:json,
			success: (data) => {
				try {
					var d = JSON.parse(data)
					resolve(d)
				} catch (e) {
					resolve(data)
				}
			},
			error: (e) => {
				reject(e)
			}
		})
	});
}
const	formatTab = (json, key) => {
	return json.reduce((acc, elem) => {
		var splitDate = elem.date.split("/")
		var d = Date.UTC(splitDate[2], splitDate[1] - 1, splitDate[0], splitDate[3], splitDate[4])
		if (key == "mesure" && elem[key] != 0)
			acc.push([d, 47 - elem[key]])
		else if (elem[key] != 0)
			acc.push([d, elem[key]])
		return acc
	}, [])
}
$(function () {
	ajax("/data.json")
		.then((json) => {
			var temp = formatTab(json, "temp")
			var mesure = formatTab(json, "mesure")
			var pres = formatTab(json, "pressure")
			Highcharts.stockChart('container', {
				chart: {
					type: "spline"
				},
				title: {
					text: ""
				},
				xAxis: {
					type: 'datetime',
					title: {
						text: 'Date'
					}
				},
				yAxis: [{ // Primary yAxis
					gridLineWidth: 0,
					labels: {
						format: '{value}°C',
						style: {
							color: Highcharts.getOptions().colors[1]
						}
					},
					title: {
						text: 'Temperature',
						style: {
							color: Highcharts.getOptions().colors[1]
						}
					},
					opposite: false
				}, { // Secondary yAxis
					gridLineWidth: 0,
					title: {
						text: 'Hauteur d\'eau',
						style: {
							color: Highcharts.getOptions().colors[0]
						}
					},
					labels: {
						format: '{value} cm',
						style: {
							color: Highcharts.getOptions().colors[0]
						}
					}
				}, { // Tertiary yAxis
					gridLineWidth: 0,
					title: {
						text: 'Pression atmospherique',
						style: {
							color: Highcharts.getOptions().colors[2]
						}
					},
					labels: {
						format: '{value} hPa',
						style: {
							color: Highcharts.getOptions().colors[2]
						}
					},
					opposite: false
				}],
				rangeSelector: {
					allButtonsEnabled: true,
					buttons: [{
						type: 'hour',
						count: 1,
						text: '1 Heure'
					},{
						type: 'hour',
						count: 12,
						text: '12 Heures'
					},{
						type: 'day',
						count: 1,
						text: '1 Jour'
					}, {
						type: 'day',
						count: 3,
						text: '3 Jours'
					}, {
						type: 'week',
						count: 1,
						text: '1 Semaine'
					}, {
						type: 'month',
						count: 1,
						text: '1 Mois'
					}, {
						type: 'all',
						text: 'Tout'
					}],
					buttonTheme: {
						width: 60
					},
					selected: 2
				},
				plotOptions: {
					spline: {
						enableMouseTracking: true
					}
				},
				series: [{
					name: 'Mesure (cm)',
					yAxis: 1,
					data: mesure
				}, {
					name: 'Temperature (°C)',
					data: temp
				}, {
					name: 'Pression (hPa)',
					yAxis: 2,
					data: pres
				}
				]
			});
		}).catch((e) => {
			console.log(e);
		})
});
