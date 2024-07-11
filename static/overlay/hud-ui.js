function HudUi(mode='main', useIcons) {
	function init() {
		document.body.dataset.mode = mode;
		_teams.useIcons = useIcons;

		_server.$container  = document.querySelector('.top-wrapper');
		_teams.$containerT  = document.querySelector('.main-wrapper-left-split .card-container');
		_teams.$containerSF = document.querySelector('.main-wrapper-right-split .card-container');
	}

	const _server = {
		$container: null,
		template: ejs.compile(`
			<div class="top-wrapper-split">
				<div data-stat="server-players">
					<span class="label">Players</span>
					<br>
					<%= server.numplayers %> / <%= server.maxplayers %>
				</div>
				<div data-stat="server-map">
					<%= server.map %>
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
			<div class="top-wrapper-split">
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
					<div><%= player.name %></div>
				</div>
				<% if (icons) { %>
					<div class="player-stats">
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
					</div>
				<% } else { %>
					<div class="player-stats">
						<div data-stat="player-score">S: <%= player.score %></div>
						<div data-stat="player-kills">K: <%= player.kills %></div>
						<div data-stat="player-deaths">D: <%= player.deaths %></div>
						<div data-stat="player-ping">P: <%= player.ping %></div>
					</div>
				<% } %>
			</div>
		`),
		useIcons: true,

		render(teams) {
			this.clear();

			if (teams.length) {
				teams[0].players.forEach(
					(player) => this.$containerT.innerHTML  += this.template({player, icons: this.useIcons})
				);
				teams[1].players.forEach(
					(player) => this.$containerSF.innerHTML += this.template({player, icons: this.useIcons})
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
		renderInfo(server, teams) {
			console.log(server, teams);
			_server.render(server, teams);
			_teams.render(teams);
		},
	};
}