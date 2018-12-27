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
		}).catch((e) => {
			console.log(e);
		})
});
