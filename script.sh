#!/bin/sh
curl http://api.openweathermap.org/data/2.5/weather\?id\=3003496\&appid\=7b61461b16a85d0d47cdcd7d41857d68 -o /var/www/html/wthr.json 2> /dev/null
curl http://192.168.1.133:4200/ -o /var/www/html/teste 2> /dev/null
cat /var/www/html/teste | tr '(' '\n' | grep -E "\(*.*cm" | cut -d ',' -f 1 | cut -d '.' -f 1 > /var/www/html/tmp.json
temp=$(echo "$(cat /var/www/html/wthr.json | tr ',' '\n' | tr '{' '\n' | grep -E '\"temp\"' | awk -F ":" '{print$2}') 273.15" | awk '{printf "%f", $1 - $2}')
hum=$(cat /var/www/html/wthr.json | tr ',' '\n' | tr '{' '\n' | grep -E '\"humidity\"' | awk -F ":" '{print$2}')
mesure=$(cat /var/www/html/tmp.json)
date=$(date "+%d/%m/%Y/%H/%M" 2> /dev/null)
ent=$(echo "$temp" | awk -F "." '{print$1}')
rm -f /var/www/html/tmp.json /var/www/html/wthr.json /var/www/html/teste
if [ $mesure -le 200 -a $mesure -gt 10 -a $ent -le 40 -a $ent -ge -25 ]
then
	cat /var/www/html/data.json | sed '/^\]$/d' | sed 's/\}$/\},/g' > /var/www/html/data2.json	
	mv /var/www/html/data2.json /var/www/html/data.json
	echo "\t{\n\t\t\"mesure\":$mesure,\n\t\t\"temp\":$temp,\n\t\t\"humidity\":$hum,\n\t\t\"date\":\"$date\"\n\t}\n]" >> /var/www/html/data.json
fi
