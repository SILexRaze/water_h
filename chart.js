Highcharts.createElement('link', {
	href: 'https://fonts.googleapis.com/css?family=Unica+One',
	rel: 'stylesheet',
	type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
	colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
		'#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
	chart: {
		backgroundColor: '#2a2a2b',
		style: {
			fontFamily: 'Trebuchet MS'
		},
		plotBorderColor: '#606063'
	},
	title: {
		style: {
			color: '#E0E0E3',
			fontSize: '20px'
		}
	},
	subtitle: {
		style: {
			color: '#E0E0E3',
			textTransform: 'uppercase'
		}
	},
	xAxis: {
		gridLineColor: '#707073',
		labels: {
			style: {
				color: '#E0E0E3'
			}
		},
		lineColor: '#707073',
		minorGridLineColor: '#505053',
		tickColor: '#707073',
		title: {
			style: {
				fontSize: '15px',
				color: '#A0A0A3'

			}
		}
	},
	yAxis: {
		gridLineColor: '#707073',
		labels: {
			style: {
				color: '#E0E0E3'
			}
		},
		lineColor: '#707073',
		minorGridLineColor: '#505053',
		tickColor: '#707073',
		tickWidth: 1,
		title: {
			style: {
				fontSize: '15px',
				color: '#A0A0A3'
			}
		}
	},
	tooltip: {
		backgroundColor: 'rgba(0, 0, 0, 0.85)',
		style: {
			color: '#F0F0F0'
		}
	},
	plotOptions: {
		series: {
			dataLabels: {
				color: '#B0B0B3'
			},
			marker: {
				lineColor: '#333'
			}
		},
		boxplot: {
			fillColor: '#505053'
		},
		candlestick: {
			lineColor: 'white'
		},
		errorbar: {
			color: 'white'
		}
	},
	legend: {
		itemStyle: {
			color: '#E0E0E3'
		},
		itemHoverStyle: {
			color: '#FFF'
		},
		itemHiddenStyle: {
			color: '#606063'
		}
	},
	credits: {
		style: {
			color: '#666'
		}
	},
	labels: {
		style: {
			color: '#707073'
		}
	},

	drilldown: {
		activeAxisLabelStyle: {
			color: '#F0F0F3'
		},
		activeDataLabelStyle: {
			color: '#F0F0F3'
		}
	},

	navigation: {
		buttonOptions: {
			symbolStroke: '#DDDDDD',
			theme: {
				fill: '#505053'
			}
		}
	},

	// scroll charts
	rangeSelector: {
		buttonTheme: {
			fill: '#505053',
			stroke: '#000000',
			style: {
				color: '#CCC'
			},
			states: {
				hover: {
					fill: '#707073',
					stroke: '#000000',
					style: {
						color: 'white'
					}
				},
				select: {
					fill: '#000003',
					stroke: '#000000',
					style: {
						color: 'white'
					}
				}
			}
		},
		inputBoxBorderColor: '#505053',
		inputStyle: {
			backgroundColor: '#333',
			color: 'silver'
		},
		labelStyle: {
			color: 'silver'
		}
	},

	navigator: {
		handles: {
			backgroundColor: '#666',
			borderColor: '#AAA'
		},
		outlineColor: '#CCC',
		maskFill: 'rgba(255,255,255,0.1)',
		series: {
			color: '#7798BF',
			lineColor: '#A6C7ED'
		},
		xAxis: {
			gridLineColor: '#505053'
		}
	},

	scrollbar: {
		barBackgroundColor: '#808083',
		barBorderColor: '#808083',
		buttonArrowColor: '#CCC',
		buttonBackgroundColor: '#606063',
		buttonBorderColor: '#606063',
		rifleColor: '#FFF',
		trackBackgroundColor: '#404043',
		trackBorderColor: '#404043'
	},

	// special colors for some of the
	legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
	background2: '#505053',
	dataLabelsColor: '#B0B0B3',
	textColor: '#C0C0C0',
	contrastTextColor: '#F0F0F3',
	maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
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
		if (key == "mesure")
			acc.push([d, 47 - elem[key]])
		else
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
			var h = document.getElementById("actual_h")
			var t = document.getElementById("actual_t")
			if (h != null && t != null)
			{
				if (mesure[mesure.length - 1][1] < 110)
					h.style.color = "red"
				else if (mesure[mesure.length - 1][1] > 135)
					h.style.color = "red"
				else
					h.style.color = "green"
				if (mesure.length > 1)
					var diff = -1 * (mesure[mesure.length - 2][1] - mesure[mesure.length - 1][1])
				if (diff > 0)
					h.innerHTML = `<i id="arrow" class="far fa-arrow-alt-circle-up"></i> `
				else
					h.innerHTML = `<i id="arrow" class="far fa-arrow-alt-circle-down"></i> `
				h.innerHTML += ` <span id="txt"><span id="deltah">(Δ = </span>) </span>`
				h.innerHTML += mesure[mesure.length - 1][1] + "cm";
				document.getElementById("deltah").innerHTML += diff + "cm"
				diff = temp[temp.length - 2][1] - temp[temp.length - 1][1]
				if (diff < 0)
					t.innerHTML = `<i id="arrow" class="far fa-arrow-alt-circle-up"></i> `
				else
					t.innerHTML = `<i id="arrow" class="far fa-arrow-alt-circle-down"></i> `
				t.innerHTML += ` <span id="txt"><span id="deltat">(Δ = </span>) </span>`
				t.innerHTML += temp[temp.length - 1][1] + "°C";
				document.getElementById("deltat").innerHTML += precise(diff) + "°C"
				document.getElementById("arrow").style.color = "white"
				document.getElementById("txt").style.color = "white"
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
				yAxis: {
					title: {
						text: "Hauteur d'eau"
					}
				},
				plotOptions: {
					spline: {
						enableMouseTracking: true
					}
				},
				series: [{
					name: 'Mesure (cm)',
					data: mesure
				}, {
					name: 'Température (deg)',
					data: temp
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
