class PageUrl {
	static parse() {
		const url = new URL(location.href);
		return {
			ip      : url.searchParams.get('ip'),
			port    : url.searchParams.get('port'),
			timeout : url.searchParams.get('timeout'),
			mode    : url.searchParams.get('mode'),
			icons   : url.searchParams.get('icons'),
		}
	}

	static update(query, url) {
		if (typeof url !== 'string') {
			url = location.origin + location.pathname
		}
		location.href = `${url}?${new URLSearchParams(query)}`;
	}
}


function refresh(ip, port, onError) {
	LuckyDogAPI
		.getStat(ip, port)
		.then(function(data) {
			const server = data.headers;
			const session = data.gameinfo;
			const game = {
				...session,
				numplayers: session.numplayers,
				maxplayers: server.maxplayers,
				roundnumber: session.roundnumber,
				gameperiod: ({
								'PreRound'     : 'Pre-Round',
								'RoundPlaying' : 'Active',
								'GameEnded'    : 'Game Ended',
								'AfterRound'   : 'After Round',
								'RoundEnd'     : 'Round End',
								'AfterMatch'   : 'After Match'
							})[session.gameperiod] || '-',
				lastwinnerteamid: session.lastroundwinner,
				lastwinnerteam: ['T', 'SF'][session.lastroundwinner] || '-',
			};

			const players = (data.players || [])
								.map((player) => {
									player.team     = (typeof player.team !== 'undefined') ? parseInt(player.team) : 0;
									player.teamName = (!player.team) ? 't' : 'sf';
									player.score    = (typeof player.score  !== 'undefined') ? parseInt(player.score)  : 0;
									player.kills    = (typeof player.kills  !== 'undefined') ? parseInt(player.kills)  : 0;
									player.deaths   = (typeof player.deaths !== 'undefined') ? parseInt(player.deaths) : 0;
									player.ping     = (typeof player.ping   !== 'undefined') ? Math.min(+player.ping, 999) : 0;
									player.isDead   = (player.health === '0');
									return player;
								})
								.sort((a, b) => b.score - a.score)
								.filter(player => player.team !== 255);

			const teams = (data.teaminfo || [])
							.sort((a, b) => a.name < b.name ? 1 : -1)
							.map((team, id) => {
								team.id      = id;
								team.nameTag = (!team.id) ? 't' : 'sf'
								team.players = players.filter(player => player.team === id);
								team.score_total = team.players.reduce((score, player) => score + player.score, 0);
								team.kills_total = team.players.reduce((kills, player) => kills + player.kills, 0);
								return team;
							});
			// console.log(game, teams, players, server);

			ui.renderInfo(game, teams);
		})
		.catch(function(e) {
			// alert(e);
			if (typeof onError === 'function') {
				onError(e);
			}
		});
}

function refreshLegacy(ip, port, onError) {
	_333NetworksAPI
		.getStat(ip, port)
		.then(function(data) {
			let teams = [
				{id: 0, name: "Terrorists",     nameTag: 't'},
				{id: 1, name: "Special Forces", nameTag: 'sf'}
			];

			const players = [];
			for (let i = 0; i < data.numplayers; i++) {
				const player = data[`player_${i}`];
				if (player) {
					player.team = parseInt(player.team);
					if (player.team > 1) continue;

					player.teamName = (!player.team) ? 't' : 'sf';
					player.score    = '-';
					player.kills    = player.frags;
					player.deaths   = '-';
					player.ping     = Math.min(player.ping, 999);
					player.isDead   = false;
					players.push(player);
				}
			}

			teams.forEach((team, id) => {
				team.players = players
								.filter((player) => player.team === id)
								.sort((a, b) => b.kills - a.kills);
				team.numplayers  = team.players.length;
				team.score       = '-';
				team.score_total = '-';
				team.kills_total = team.players.reduce((kills, player) => kills + player.kills, 0);
			});

			const game = {
				hostname         : data.hostname,
				map              : data.mapname,
				numplayers       : data.numplayers,
				maxplayers       : data.maxplayers,
				roundnumber      : '-',
				gameperiod       : '-',
				lastwinnerteamid : 255,
				lastwinnerteam   : '-',
			};
			// console.log(game, teams, players);

			ui.renderInfo(game, teams);
		})
		.catch(function(e) {
			// alert(e);
			if (typeof onError === 'function') {
				onError(e);
			}
		});
}


let ui;
let timer, attempts = 5;

window.onload = function() {
	const {ip, port, timeout, mode, icons} = PageUrl.parse();

	ui = new HudUi(mode, (icons === 'true'));

	let getData;
	switch (mode) {
		case 'legacy'    :    getData = refreshLegacy;   break;
		case 'trimmed34' :    getData = refresh;         break;
		case 'trimmed35' :    getData = refresh;         break;
		default          :    getData = refresh;
	}

	getData(ip, port);
	timer = setInterval(
		() => getData(ip, port, () => (!attempts--) && clearInterval(timer)),
		(parseInt(timeout) || 2) * 1000
	);
};