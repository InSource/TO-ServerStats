function HudUi(mode, useIcons, showRanks) {
	function init() {
		mode = mode || 'main';
		document.body.dataset.mode = mode;
		_teams.useIcons  = (useIcons === true);
		_teams.showRanks = (showRanks === true);

		_server.$container  = document.querySelector('.server-info');
		_teams.$containerT  = document.querySelector('.card-container[data-team="0"]');
		_teams.$containerSF = document.querySelector('.card-container[data-team="1"]');
	}

	const _server = {
		$container: null,
		template: ejs.compile(`
			<div class="side-section">
				<div data-stat="server-players">
					<span class="label">Players</span>
					<br>
					<%= server.numplayers %> / <%= server.maxplayers %>
				</div>
				<div data-stat="server-map">
					<%= server.mapname %>
				</div>
			</div>
			<div>
				<div data-stat="server-name">
					<%= server.hostname %>
				</div>
				<div data-stat="team-wins">
					<span>Terrorists <span data-team="0"><%= teams[0].score %></span></span> - <span>Special Forces <span data-team="1"><%= teams[1].score %></span></span>
				</div>
				<div data-stat="server-round">
					Round: <%= server.roundnumber %> - <%= server.gameperiod %>
				</div>
			</div>
			<div class="side-section">
				<div data-stat="team-lastwinner">
					<span class="label">Last Win</span>
					<br>
					<span data-team="<%= server.lastwinnerteamid %>"><%= server.lastwinnerteam %></span>
				</div>
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
				<div></div>
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

	const _teams = {
		$containerT: null,
		$containerSF: null,
		template: ejs.compile(`
			<div class="player-card <%= (player.isDead) ? 'dead' : 'alive' %>" data-team="<%= player.team %>">
				<div class="player-name">
					<%= player.name %>
					<% if (ranks) { %>
						<% for (let i = 0; i < player.rank; i++) { %>
							<i class="fa-solid fa-trophy fa-fw"></i>
						<% } %>
					<% } %>
				</div>
				<div class="player-stats">
					<% if (icons) { %>
						<div data-stat="player-score">
							<i class="fa-solid fa-star fa-fw"></i> <%= player.score %>
						</div>
						<div data-stat="player-kills">
							<i class="fa-solid fa-crosshairs fa-fw"></i> <%= player.kills %>
						</div>
						<div data-stat="player-deaths">
							<i class="fa-solid fa-skull-crossbones fa-fw"></i> <%= player.deaths %>
						</div>
						<div data-stat="player-ping">
							<i class="fa-solid fa-signal fa-fw"></i> <%= player.ping %>
						</div>
					<% } else { %>
						<div data-stat="player-score">S: <%= player.score %></div>
						<div data-stat="player-kills">K: <%= player.kills %></div>
						<div data-stat="player-deaths">D: <%= player.deaths %></div>
						<div data-stat="player-ping">P: <%= player.ping %></div>
					<% } %>
				</div>
			</div>
		`),
		useIcons: false,
		showRanks: false,

		render(teams) {
			this.clear();

			if (teams.length) {
				const settings = {icons: this.useIcons, ranks: this.showRanks};
				teams[0].players.forEach(
					(player) => this.$containerT.innerHTML += this.template({player, ...settings})
				);
				teams[1].players.forEach(
					(player) => this.$containerSF.innerHTML += this.template({player, ...settings})
				);
			}
		},
		clear() {
			this.$containerT.innerHTML = '';
			this.$containerSF.innerHTML = '';
		},
	};


	init();

	return {
		renderInfo(server) {
			console.log(server, server.teams);
			_server.render(server, server.teams);
			_teams.render(server.teams);
		},
	};
}