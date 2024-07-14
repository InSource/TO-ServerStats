function TextUi(mode, useIcons) {
	function init() {
		mode = mode || 'full';
		document.body.dataset.mode = mode;
		_players.useIcons = useIcons;

		_server.$container  = document.querySelector('.server-info');
		_players.$container = document.querySelector('.card-container');
	}

	const _server = {
		$container: null,
		template: ejs.compile(`
			<div data-stat="server-name">
				<%= server.hostname %>
			</div>
			<div data-stat="server-map">
				<%= server.mapname %>
			</div>
			<div data-stat="server-players">
				Players: <%= server.numplayers %> / <%= server.maxplayers %>
			</div>
			<div data-stat="team-wins">
				<span data-team="0"><%= teams[0].score %></span> - <span data-team="1"><%= teams[1].score %></span>
			</div>
			<div data-stat="team-lastwinner">
				Last Win: <span data-team="<%= server.lastwinnerteamid %>"><%= server.lastwinnerteam %></span>
			</div>
			<div data-stat="server-round">
				Round: <%= server.roundnumber %> [<%= server.gameperiod %>]
			</div>
			<div class="server-info-row">
				<div data-stat="team-kills">
					<span class="label">Total Kills</span>
					<br>
					<span data-team="0"><%= teams[0].kills_total %></span> / <span data-team="1"><%= teams[1].kills_total %></span>
				</div>
				<div data-stat="team-score">
					<span class="label">Total Score</span>
					<br>
					<span data-team="0"><%= teams[0].score_total %></span> / <span data-team="1"><%= teams[1].score_total %></span>
				</div>
			</div>
		`),

		render(server, teams) {
			this.clear();
			this.$container.innerHTML = this.template({server, teams});
		},
		clear() {
			this.$container.innerHTML = '';
		},
	};

	const _players = {
		$container: null,
		templates: {
			header: ejs.compile(`
				<div class="player-card">
					<div class="player-name"></div>
					<div class="player-stats">
						<% if (icons) { %>
							<div data-stat="player-ping">
								<i class="fa-solid fa-signal fa-fw"></i>
							</div>
							<div data-stat="player-kills">
								<i class="fa-solid fa-crosshairs fa-fw"></i>
							</div>
							<div data-stat="player-deaths">
								<i class="fa-solid fa-skull-crossbones fa-fw"></i>
							</div>
							<div data-stat="player-score">
								<i class="fa-solid fa-star fa-fw"></i>
							</div>
						<% } else { %>
							<div data-stat="player-score">S</div>
							<div data-stat="player-kills">K</div>
							<div data-stat="player-deaths">D</div>
							<div data-stat="player-ping">P</div>
						<% } %>
					</div>
				</div>
			`),
			card: ejs.compile(`
				<div class="player-card <%= (player.isDead) ? 'dead' : 'alive' %>" data-team="<%= player.team %>">
					<div class="player-name">
						<%= player.name %>
						<% for (let i = 0; i < player.rank; i++) { %>
							<i class="fa-solid fa-trophy fa-fw"></i>
						<% } %>
					</div>
					<div class="player-stats">
						<div data-stat="player-ping"><%= player.ping %></div>
						<div data-stat="player-kills"><%= player.kills %></div>
						<div data-stat="player-deaths"><%= player.deaths %></div>
						<div data-stat="player-score"><%= player.score %></div>
					</div>
				</div>
			`),
		},
		useIcons: true,

		render(players=[]) {
			this.clear();

			if (players.length) {
				this.$container.innerHTML += this.templates.header({icons: this.useIcons});
				players.forEach(
					(player) => this.$container.innerHTML += this.templates.card({player})
				);
			}
		},
		clear() {
			this.$container.innerHTML = '';
		},
	};


	init();

	return {
		renderInfo(server) {
			console.log(server, server.teams);
			_server.render(server, server.teams);
			_players.render(server.players);
		},
	};
}