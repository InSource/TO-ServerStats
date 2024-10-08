function capitalizeString(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}


let timer;

let query = {
	ip      : null,
	port    : null,
	timeout : null,
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

	static update(params, url) {
		if (typeof url !== 'string') {
			url = location.origin + location.pathname
		}
		location.href = `${url}?${new URLSearchParams(params)}`;
	}
}


const ui = {
	init() {
		const $form = document.getElementById('queryForm');
		this.search.$form    = $form;
		this.search.$host    = $form.elements.ip;
		this.search.$port    = $form.elements.port;
		this.search.$timeout = $form.elements.timeout;
		this.loader.$element = document.getElementById('loader');

		this.search.$form.onsubmit = function(e) {
			e.preventDefault();
			query = ui.search.getParams();
			PageUrl.update(query);
		}

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
		$form: null,
		$host: null,
		$port: null,
		$timeout: null,

		getParams() {
			return {
				ip      : this.$host.value,
				port    : this.$port.value,
				timeout : this.$timeout.value,
			};
		},
		setParams({ip, port, timeout=1}) {
			this.$host.value    = ip;
			this.$port.value    = port;
			this.$timeout.value = timeout;
		},
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
				return;
			}

			if (typeof server === undefined) return;

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
		template: ejs.compile(`
			<thead>
				<tr>
					<% for (const name of columns) { %>
						<th><%= capitalizeString(name) %></th>
					<% } %>
				</tr>
			</thead>
			<tbody>
				<% for (const team of teams) { %>
					<tr data-team="<%= team.nameTag %>">
						<% for (const stat_prop of columns) { %>
							<td>
								<% if (Array.isArray(team[stat_prop])) { %>
									<% for (const value of team[stat_prop]) { %>
										<%= value %><br>
									<% } %>
								<% } else { %>
									<%= team[stat_prop] %>
								<% } %>
							</td>
						<% } %>
					</tr>
				<% } %>
			</tbody>
		`),

		render(teams) {
			const $teams = this.$container;
			this.clear();

			if (teams.length) {
				const columns = Object.keys(teams[0]);
				$teams.innerHTML = this.template({
					columns,
					teams: teams.map(
						(team) => ({
							...team,
							nameTag: (team.name === 'Terrorists') ? 't' : 'ct'
						})
					)
				});
			}
		},
		clear() {
			this.$container.innerHTML = '';
		},
	},

	players: {
		$container: null,
		template: ejs.compile(`
			<thead>
				<tr>
					<% for (const name of columns) { %>
						<th><%= capitalizeString(name) %></th>
					<% } %>
				</tr>
			</thead>
			<tbody>
				<% for (const player of players) { %>
					<tr data-team="<%= player.teamName %>" data-dead="<%= player.isDead %>">
						<% for (const stat_prop of columns) { %>
							<td><%= player[stat_prop] %></td>
						<% } %>
					</tr>
				<% } %>
			</tbody>
		`),

		render(players) {
			const $players = this.$container;
			this.clear();

			if (players.length) {
				const columns = Object.keys(players[0]);
				$players.innerHTML = this.template({
					columns,
					players: players
								.map(player => {
									player.team     = parseInt(player.team);
									player.teamName = (!player.team) ? 't' : 'ct';
									player.score  = (typeof player.score  !== 'undefined') ? parseInt(player.score)  : 0;
									player.kills  = (typeof player.kills  !== 'undefined') ? parseInt(player.kills)  : 0;
									player.isDead = (player.health === '0');
									player.health = (player.isDead) ? 'dead' : player.health;
									return player;
								})
								.sort((a, b) => b.score - a.score)
								.filter(player => player.team !== 255)
				});
			}
		},
		clear() {
			this.$container.innerHTML = '';
		},
	},

	warnings: {
		$container: null,
		template: ejs.compile(`
			<div>
				<strong>This Server does not support:</strong>&nbsp;<%= warnings.join(', ') %>.
				Find more info on&nbsp;<a href="https://discord.gg/PXmbUKxjb5">https://discord.gg/PXmbUKxjb5</a>
			</div>
		`),

		clear() {
			this.$container.innerHTML = '';
		},
		render(warnings) {
			this.hide();
			this.clear();

			const $warnings = this.$container;
			if (warnings.length > 0) {
				this.show();
				$warnings.innerHTML = this.template({warnings});
			}
		},

		show () { this.$container.classList.remove('hidden'); },
		hide () { this.$container.classList.add('hidden'); },
	},
};


function initialize() {
	query = ui.search.getParams();
	ui.loader.show();

	LuckyDogAPI.getStat(query.ip, query.port, query.timeout)
		.then(function(data) {
			while (timer--) {
				clearTimeout(timer);
			}
			ui.loader.hide();
			ui.clear();

			if (!data || !ui.serverInfo.render(data.gameinfo, data.errors)) {
				timer = setTimeout(initialize, 1000*query.timeout);
				return;
			}
			ui.warnings.render(data.warnings);
			ui.players.render(data.players);
			ui.teams.render(data.teaminfo);

			timer = setTimeout(initialize, 1000*query.timeout);
		})
		.catch(alert);
}


window.onload = function() {
	ui.init();
	ui.search.setParams(PageUrl.parse());
	console.log(ui.search.getParams());
	initialize();
};