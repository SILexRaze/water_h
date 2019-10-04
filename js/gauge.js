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
$(function () {
	ajax("/last.json")
		.then((json) => {
			console.log(json);
			if (h != null && t != null)
			{
				document.getElementById("actual_h").innerHTML = json.temp + "°C"
				document.getElementById("actual_p").innerHTML = json.pres + "hPa"
				document.getElementById("actual_t").innerHTML = json.mesure + "cm"
				document.getElementById("time").innerHTML = Date(json.mesure).split(" ")[4] + ")"
			}
			var gaugeOptions = {

				chart: {
					type: 'solidgauge'
				},

				title: null,

				pane: {
					center: ['50%', '85%'],
					size: '140%',
					startAngle: -90,
					endAngle: 90,
					background: {
						backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
						innerRadius: '60%',
						outerRadius: '100%',
						shape: 'arc'
					}
				},

				tooltip: {
					enabled: false
				},

				// the value axis
				yAxis: {
					stops: [
						[0.1, '#DF5353'], // red
						[0.4, '#DDDF0D'], // yellow
						[0.5, '#55BF3B'], // green
						[0.6, '#DDDF0D'], // yellow
						[0.9, '#DF5353'], // red
					],
					lineWidth: 0,
					minorTickInterval: null,
					tickAmount: 2,
					title: {
						y: -70
					},
					labels: {
						y: 16
					}
				},

				plotOptions: {
					solidgauge: {
						dataLabels: {
							y: 5,
							borderWidth: 0,
							useHTML: true
						}
					}
				}
			};
			var chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
				yAxis: {
					min: -50,
					max: 50,
					title: {
						text: 'Hauteur d\'eau'
					}
				},

				credits: {
					enabled: false
				},

				series: [{
					name: 'Hauteur d\'eau',
					data: [mesure[mesure.length - 1][1]],
					dataLabels: {
						format: '<div style="text-align:center"><span style="font-size:25px;color:' +
						((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
						'<span style="font-size:12px;color:silver">cm</span></div>'
					},
					tooltip: {
						valueSuffix: ' cm'
					}
				}]

			}));
		}).catch((e) => {
			console.log(e);
		})
});
