class PageUrl {
	static parse() {
		const url = new URL(location.href);
		return {
			ip      : url.searchParams.get('ip'),
			port    : url.searchParams.get('port'),
			timeout : url.searchParams.get('timeout'),
			mode    : url.searchParams.get('mode'),
			icons   : url.searchParams.get('icons'),
			ranks   : url.searchParams.get('ranks'),
		}
	}

	static update(query, url) {
		if (typeof url !== 'string') {
			url = location.origin + location.pathname
		}
		location.href = `${url}?${new URLSearchParams(query)}`;
	}
}


function decodeHTML(input) {
	return input
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&amp;/g, '&')
			.replace(/&apos;/g, '\'')
			.replace(/&quot;/g, '\"');
}


const hallOfFame = {
	'saru': 4,
	'$aru': 4,
	'spod': 4,
	'spod`': 4,
	'daya': 3,
	'lordo': 2,
	'ninho': 2,
	'ninho`': 2,
	'ninhosdt`': 2,
	'nenad': 1,
	'-[ffd]-*ilus!on$*': 1,
	'alienx': 1,
	'=bia=alienx.bn': 1,
	'apa': 1,
	'asdfj': 1,
	'avyon': 1,
	'billa': 1,
	'bong': 1,
	'combtant': 1,
	'diabolix': 1,
	'dolev': 1,
	'don corleone': 1,
	'drink': 1,
	'extrem': 1,
	'floid': 1,
	'floid.sg': 1,
	'floid.sg`': 1,
	'floid.sg``': 1,
	'floid.tr': 1,
	'giggle': 1,
	'goldenbullet': 1,
	'gold': 1,
	'hauwie': 1,
	'hawk': 1,
	'ladybird': 1,
	'lumi': 1,
	'nezz': 1,
	'nezz`': 1,
	'nezzsdt`': 1,
	'onemanarmy': 1,
	'peterie': 1,
	'pirate': 1,
	'pirras': 1,
	'psyclops': 1,
	'sas': 1,
	'skyline': 1,
	'snow': 1,
	'style': 1,
	'sweet-as': 1,
	'tanaka': 1,
	'tigri': 1,
	'venom': 1,
	'zeus': 1,
	'syntaxjnr': 1
};


class ServerDetails {
	static byLuckyDog(ip, port) {
		return LuckyDogAPI
				.getStat(ip, port)
				.then(function(data) {
					const server = data.headers;
					const session = data.gameinfo;

					const game = {
						hostname    : server.hostname,
						mapname     : server.mapname,
						numplayers  : server.numplayers,
						maxplayers  : server.maxplayers,
						roundnumber : session.roundnumber,
						gameperiod  : ({
										'PreRound'     : 'Pre-Round',
										'RoundPlaying' : 'Active',
										'GameEnded'    : 'Game Ended',
										'AfterRound'   : 'After Round',
										'RoundEnd'     : 'Round End',
										'AfterMatch'   : 'After Match'
									})[session.gameperiod] || '-',
						lastwinnerteamid : session.lastroundwinner,
						lastwinnerteam   : ['T', 'SF'][session.lastroundwinner] || '-',
					};

					const players = (data.players || [])
										.map((player) => {
											player.team     = (typeof player.team !== 'undefined') ? parseInt(player.team) : 0;
											player.teamName = (!player.team) ? 't' : 'sf';
											player.rank     = hallOfFame[player.name.toLowerCase()] || 0;
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

					return {...game, teams, players};
				});
	}

	static by333Networks(ip, port) {
		return _333NetworksAPI
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
							player.name     = decodeHTML(player.name);  // 333Networks response contain HTML entities
							player.rank     = hallOfFame[player.name.toLowerCase()] || 0;
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
						mapname          : data.mapname,
						numplayers       : data.numplayers,
						maxplayers       : data.maxplayers,
						roundnumber      : '-',
						gameperiod       : '-',
						lastwinnerteamid : 255,
						lastwinnerteam   : '-',
					};

					return {...game, teams, players};
				});
	}
}


function initialize(OverlayUi) {
	let {ip, port, timeout, mode, icons, ranks} = PageUrl.parse();
	// console.log(PageUrl.parse());

	// You don't need to query server details more frequently than that
	const defaultTimeout = (mode === 'legacy') ? 15 : 2;
	timeout = parseFloat(timeout);
	timeout = Number.isNaN(timeout)
				? defaultTimeout
				: Math.min(defaultTimeout, timeout);
	icons = (icons === 'true');
	ranks = (ranks === 'true');

	window.onload = function() {
		const ui = new OverlayUi(mode, icons, ranks);

		const maxRetry = 5;
		let attempts = maxRetry;
		let timer;

		function update(ip, port) {
			const getData = (mode === 'legacy')
								? ServerDetails.by333Networks
								: ServerDetails.byLuckyDog;
			getData(ip, port)
				.then(
					function(server) {
						console.log(server);
						attempts = maxRetry;
						ui.renderInfo(server);
					},
					function(error) {
						console.log(error);
						if (!attempts--) {
							clearInterval(timer);
						}
					}
				);
		}

		update(ip, port);
		timer = setInterval(
			() => update(ip, port),
			1000 * timeout
		);
	};
}

