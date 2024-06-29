let starttime;
let timestart, timedone;
let timer;


function msToTime(duration) {
	const time = new Date(duration);
	const
		hours   = `${time.getHours()}`.padStart(2, '0'),
		minutes = `${time.getMinutes()}`.padStart(2, '0'),
		seconds = `${time.getSeconds()}`.padStart(2, '0'),
		milliseconds = Math.floor(time.getMilliseconds() / 100);
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}


function capitalizeString(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}


let query = {
	ip      : '81.169.138.37',
	port    : '9777',
	timeout : 1,
};

class PageUrl {
	static parse() {
		const url = new URL(location.href);
		return {
			ip      : url.searchParams.get('ip'),
			port    : url.searchParams.get('port'),
			timeout : url.searchParams.get('timeout'),
		}
	}

	static update(url) {
		query = ui.search.getParams();
		if (typeof url !== 'string') {
			url = location.origin + location.pathname
		}
		location.href = `${url}?${new URLSearchParams(query)}`;
	}
}


class TOServer {
	static baseUrl = 'https://serverstatus.tacops.de';

	// TODO:
	//  Show alert on HTTP error
	//  Add input validation
	static getStat(ip, port, timeout=1) {
		const url = `${TOServer.baseUrl}/serverquery.php?${new URLSearchParams({ip, port, timeout})}`;
		return fetch(url).then(response => response.json());
	}
}


const ui = {
	init() {
		this.search.$host    = document.getElementById('queryIP');
		this.search.$port    = document.getElementById('queryPort');
		this.search.$timeout = document.getElementById('queryTimeout');
		this.search.$submitBtn = document.getElementById('querySubmitBtn');
		this.loader.$element = document.getElementById('loader');

		this.serverInfo.$container = document.getElementById('gameinfo');
		this.teams.$container      = document.getElementById('teaminfo');
		this.players.$container    = document.getElementById('players');
		this.warnings.$container   = document.getElementById('warnings');
	},

	clear() {
		this.serverInfo.clear();
		this.teams.clear();
		this.players.clear();
		this.warnings.clear();
	},

	search: {
		$host: null,
		$port: null,
		$timeout: null,
		$submitBtn: null,

		getParams() {
			return {
				ip      : this.$host.value,
				port    : this.$port.value,
				timeout : this.$timeout.value,
			}
		},
		setParams({ip, port, timeout=1}) {
			this.$host.value    = ip;
			this.$port.value    = port;
			this.$timeout.value = timeout;
		}
	},

	loader: {
		$element: null,

		show() { this.$element.classList.remove('hidden'); },
		hide() { this.$element.classList.add('hidden'); },
	},

	serverInfo: {
		$container: null,

		clear() {
			this.$container.innerHTML = '';
		},
		render(server, errors) {
			const entryTemplate = (p, v) => `<tr>
				<td>${p}</td>
				<td>${v}</td>
			</tr>`

			const $gameinfo = this.$container;
			this.clear();

			if (errors && errors.length > 0) {
				errors.forEach(
					(error, index) => $gameinfo.innerHTML += entryTemplate(index, error)
				);
				// timer = window.setTimeout(initialize, querytimeout);
				return;
			}

			if (typeof server === undefined) return;
			// if (typeof server === undefined) {
			// 	timer = window.setTimeout(initialize, querytimeout);
			// 	return;
			// }

			const server_fields = ['hostname', 'map', 'roundnumber', 'gameperiod'];
			for (const [field, value] of Object.entries(server)) {
				if (server_fields.includes(field)) {
					$gameinfo.innerHTML += entryTemplate(capitalizeString(field), value);
				}
			}
			return true;
		},
	},

	teams: {
		$container: null,

		clear() {
			this.$container.innerHTML = '';
		},
		render(teams) {
			const $teams = this.$container;
			this.clear();

			if (teams.length) {
				const $head = document.createElement('thead');
				const columns = Object.keys(teams[0]).map(capitalizeString);
				$head.innerHTML += `<tr>
					${columns.map(name => `<th>${name}</th>`).join('')}
				</tr>`;
				$teams.appendChild($head);

				const $body = document.createElement('tbody');
				for (const team of teams) {
					// if (o === 'info' || o === 'note') continue; /* <- What was this for? 🙄 */
					let $tr = document.createElement('tr');
					$tr.dataset.team = (team.name === 'Terrorists') ? 't' : 'ct';

					for (const [field, value] of Object.entries(team)) {
						switch (field) {
							case 'names':
								$tr.innerHTML += `<td>${value.join('<br>')}</td>`;
								break;
							default:
								$tr.innerHTML += `<td>${value}</td>`;
						}
					}
					$body.appendChild($tr);
				}
				$teams.appendChild($body);
			}
		},
	},

	players: {
		$container: null,

		clear() {
			this.$container.innerHTML = '';
		},
		render(players) {
			const $players = this.$container;
			this.clear();

			if (players.length) {
				const $head = document.createElement('thead');
				const columns = Object.keys(players[0]).map(capitalizeString);
				$head.innerHTML += `<tr>
					${columns.map(name => `<th>${name}</th>`).join('')}
				</tr>`;
				$players.appendChild($head);

				const $body = document.createElement('tbody');
				for (const player of players) {
					const team = parseInt(player.team);
					if (team !== 255) {
						const $tr = document.createElement('tr');
						$body.appendChild($tr);

						$tr.dataset.team = (!team) ? 't' : 'ct';
						const isDead = (player.health === '0');
						if (isDead) {
							$tr.classList.add('dead');
						}

						for (let [field, value] of Object.entries(player)) {
							if (field === 'health') {
								value = (isDead) ? 'dead' : value;
							}
							$tr.innerHTML += `<td>${value}</td>`;
						}
					}
				}
				$players.appendChild($body);
			}
		},
	},

	warnings: {
		$container: null,

		show () { this.$container.classList.remove('hidden'); },
		hide () { this.$container.classList.add('hidden'); },

		clear() {
			this.$container.innerHTML = '';
		},
		render(warnings) {
			this.hide();
			this.clear();

			const $warnings = this.$container;
			if (warnings.length > 0) {
				this.show();
				$warnings.innerHTML = `
					<strong>This Server does not support:</strong> ${warnings.join(', ')}.
					Find more info on <a href="https://discord.gg/PXmbUKxjb5">https://discord.gg/PXmbUKxjb5</a>
				`;
			}
		}
	},
}


function initialize() {
	query = ui.search.getParams();
	ui.loader.show();

	TOServer.getStat(query.ip, query.port, query.timeout)
		.then(function(data) {
			while (timer--) {
				window.clearTimeout(timer);
			}
			ui.loader.hide();
			ui.clear();

			// if (isNaN(query.timeout) || query.timeout < 1 || query.timeout > 10) query.timeout = 1;

			if (!data || !ui.serverInfo.render(data.gameinfo, data.errors)) {
				timer = window.setTimeout(initialize, query.timeout);
				return;
			}
			ui.warnings.render(data.warnings);
			ui.players.render(data.players);
			ui.teams.render(data.teaminfo);

			timer = window.setTimeout(initialize, query.timeout);
		});
}


window.onload = function() {
	console.log(PageUrl.parse());
	ui.init();
	initialize();
};