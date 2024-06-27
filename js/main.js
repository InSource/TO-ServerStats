var queryip 		= "";
var queryport 		= "";
var querytimeout 	= "";

var starttime;
var timedone;
var timestart;
var timer;

var loading			= false;

function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function get_json(callback)
{
	var asyncronous = false;
	var url = "serverquery.php";
	var data = {
		"ip"		: queryip,
		"port"		: queryport,
		"timeout"	: querytimeout
	};

	$.ajax({
		type: "GET",
		dataType: "JSON",
		url: url,
		data: data,
		success: function (feedback)
		{


			while (timer--) {
				window.clearTimeout(timer); // will do nothing if no timeout with id is present
			}
			loading.style = "display:none;";

			callback(feedback);
		}
	});
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

 


function initialize()
{
	get_json(function(json)
	{

		var gameinfo 	= document.getElementById("gameinfo");
		var warnings 	= document.getElementById("warnings");
		var players 	= document.getElementById("players");
		var teams 		= document.getElementById("teaminfo");

		gameinfo.innerHTML = "";
		players.innerHTML = "";
		teams.innerHTML = "";
		warnings.innerHTML = "";

		if(isNaN(querytimeout) || querytimeout < 1 || querytimeout > 10)
			querytimeout = 1;

		if(json.warnings.length > 0)
		{
			warnings.innerHTML = '<strong style="color:#990033;">This Server does not support: </strong>';
			for (var warning in json.warnings)
				warnings.innerHTML += json.warnings[warning] + ', ';

			warnings.innerHTML = warnings.innerHTML.substring(0, warnings.innerHTML.length -2) + '. Find more info on <a style="color:#990033;" href="https://discord.gg/PXmbUKxjb5"> https://discord.gg/PXmbUKxjb5 </a>';
			warnings.style = "display:block;";
		}


		var ServerInfos = ["hostname", "map", "roundnumber", "gameperiod"];

		if(typeof(json.errors) != undefined && json.errors.length > 0)
		{
			for (var o in json.errors)
			{

					var tr = document.createElement('tr');
					tr.innerHTML +='<td style="padding:3px;">' + o + '</td><td style="padding:3px;">' + json.errors[o] + '</td>';

					gameinfo.appendChild(tr);

			}
			timer = window.setTimeout(function(){
						initialize();
			}, querytimeout);
				return;	

		}


		// DRAW GameInfo

		if(typeof(json) == undefined || typeof(json.gameinfo) == undefined)
		{
			timer = window.setTimeout(function(){
				initialize();
			}, querytimeout);
			return;

		}

		for (var o in json.gameinfo)
		{
			if(ServerInfos.includes(o))
			{
				var tr = document.createElement('tr');

				tr.innerHTML ='<td style="padding:3px;">' +  o.charAt(0).toUpperCase() + o.slice(1) + '</td><td style="padding:3px;">' + json.gameinfo[o] + '</td>';

				gameinfo.appendChild(tr);
			}
		}


		// DRAW PlayerInfo



		var tr = document.createElement('tr');
		players.appendChild(tr);

		for(var ob in json.players[0])
		{
			var td = document.createElement('td');
			td.innerHTML =  ob.charAt(0).toUpperCase() + ob.slice(1);
			td.style = "padding: 5px;"
			tr.appendChild(td);

		}

		for (var o in json.players)
		{
			tr = document.createElement('tr');
			players.appendChild(tr);

			if(json.players[o].team != 255)
			{
				for(var ob in json.players[o])
				{

					var td = document.createElement('td');
					td.style = "padding: 5px;"
					td.innerHTML = json.players[o][ob];

					if(json.players[o]['team'] == 0 && json.players[o]['health'] > 0)
						td.style = "color:#ff0000;padding:5px;"
					else if(json.players[o]['team'] == 1 && json.players[o]['health']  > 0)
						td.style = "color:#0055ff;padding:5px;"
					else {

						if(typeof(json.players[o]['health']) == 'undefined')
						{
							if(json.players[o]['team'] == 0)
								td.style = "color:#ff0000;padding:5px;"
							else if(json.players[o]['team'] == 1 )
								td.style = "color:#0055ff;padding:5px;"
						} else {
							td.style = "color:#aaaaaa;padding:5px;"
							if(ob == "health")
								td.innerHTML = "dead";
						}
					}
					tr.appendChild(td);
				}
			}
		}
		// TEams
		var tr = document.createElement('tr');
		teams.appendChild(tr);


			for(var ob in json.teaminfo[0])
			{
				var td = document.createElement('td');
				td.innerHTML = ob.charAt(0).toUpperCase() + ob.slice(1);
				td.style = "padding: 5px;"
				tr.appendChild(td);
			}

			for (var o in json.teaminfo)
			{
				if(o == "info" || o == "note")
					continue;
				tr = document.createElement('tr');
				teams.appendChild(tr);

				for(var ob in json.teaminfo[o])
				{
					var td = document.createElement('td');
					if(ob == "names")
					{
						for (const el of json.teaminfo[o]['names'])
							td.innerHTML += el + "<br>";
					} else
						td.innerHTML = json.teaminfo[o][ob];

					if(json.teaminfo[o]['name'] == "Terrorists" )
					{
						td.style = "color:#ff0000;padding:5px;vertical-align: top;";
						tr.appendChild(td);
					}

					if(json.teaminfo[o]['name'] == "Special Forces")
					{
						td.style = "color:#0055ff;padding:5px;vertical-align: top;"
						tr.appendChild(td);
					}
				}
			}

		timer = window.setTimeout(function(){
			initialize();
		}, querytimeout);

	});

}

function KeyUpInput(url)
{
	queryip 		= document.getElementById("queryIP").value;
	queryport 		= document.getElementById("queryPort").value;
	querytimeout 	= document.getElementById("queryTimeout").value;

	location.href = url +"?ip=" + queryip + "&port=" + queryport + "&timeout=" + querytimeout;
}

$( document ).ready(function() {
	queryip 		= document.getElementById("queryIP").value;
	queryport 		= document.getElementById("queryPort").value;
	querytimeout 	= document.getElementById("queryTimeout").value;
	loading	= document.getElementById("loading"); 
	loading.style = "display:block;";
	initialize();
});

