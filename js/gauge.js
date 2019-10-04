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
			json.mesure = 47 - json.mesure;
			document.getElementById("actual_t").innerHTML = json.temp + "°C"
			document.getElementById("actual_p").innerHTML = json.pressure + "hPa"
			document.getElementById("actual_h").innerHTML = json.mesure + "cm"
			document.getElementById("time").innerHTML = Date(json.mesure).split(" ")[4] + ")"
		}).catch((e) => {
			console.log(e);
		})
});
