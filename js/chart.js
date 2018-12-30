Highcharts.setOptions(Highcharts.theme);
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
function precise(x) {
	return Number.parseFloat(x).toPrecision(3);
}
var i = 0;
$(function () {
	ajax("/data.json")
		.then((json) => {
			console.log(json);
			var temp = formatTab(json, "temp")
			var mesure = formatTab(json, "mesure")
			var pres = formatTab(json, "pressure")
			var h = document.getElementById("actual_h")
			var t = document.getElementById("actual_t")
			if (h != null && t != null)
			{
				if (mesure[mesure.length - 1][1] > 25 || mesure[mesure.length - 1][1] < -25)
					h.style.color = "red"
				else
					h.style.color = "green"
				if (mesure.length > 1)
					var diff = -1 * (mesure[mesure.length - 2][1] - mesure[mesure.length - 1][1])
				if (diff > 0)
					h.innerHTML = `<span id="sign">(↑)</span> `
				else if (diff < 0)
					h.innerHTML = `<span id="sign">(↓)</span> `
				else
					h.innerHTML = `<span id="sign">(=)</span> `
				h.innerHTML += mesure[mesure.length - 1][1] + "cm";
				h.innerHTML += ` <span id="txt"><span id="deltah">(Δ </span>) </span>`
				document.getElementById("deltah").innerHTML += diff + "cm"
				diff = temp[temp.length - 2][1] - temp[temp.length - 1][1]
				if (diff < 0)
					t.innerHTML = `<span id="sign">(↑)</span> `
				else if (diff < 0)
					t.innerHTML = `<span id="sign">(↓)</span> `
				else
					t.innerHTML = `<span id="sign">(=)</span> `
				t.innerHTML += temp[temp.length - 1][1] + "°C";
				t.innerHTML += ` <span id="txt"><span id="deltat">(Δ </span>) </span>`
				document.getElementById("deltat").innerHTML += precise(diff) + "°C"
				document.getElementById("sign").style.color = "white"
				document.getElementById("txt").style.color = "white"
				document.getElementById("time").innerHTML += Date(mesure[mesure.length - 1][0]).split(" ")[4] + ")"
			}
			$('#container').highcharts({
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
					opposite: true
			
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
						text: 'Pression atmosphérique',
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
					opposite: true
				}],
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
					name: 'Température (deg)',
					data: temp
				}, {
					name: 'Pression (hPa)',
					yAxis: 2,
					data: pres
				}
				]
			});
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

			// Bring life to the dials
			setInterval(function () {
				// Speed
				var point,
					newVal,
					inc;

				if (chartSpeed) {
					point = chartSpeed.series[0].points[0];
					inc = 0;
					newVal = point.y + inc;

					if (newVal < 0 || newVal > 200) {
						newVal = point.y - inc;
					}

					point.update(newVal);
				}
			}, 2000);
		}).catch((e) => {
			console.log(e);
		})
});
