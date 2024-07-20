const ui = {
	init() {
		const self = this;
		const $form = document.getElementById('queryForm');
		this.search.$form  = $form;
		this.search.$host  = $form.elements.ip;
		this.search.$port  = $form.elements.port;
		this.search.$mode  = $form.elements.mode;
		this.search.$icons = $form.elements.icons;
		this.search.$ranks = $form.elements.ranks;
		this.search.$rate  = $form.elements.rate;

		this.search.$mode.onchange = function(e) {
			if (this.value.includes('legacy')) {
				self.search.$rate.min = 10;
				self.search.$rate.max = 60;
				self.search.$rate.value = 15;
			} else {
				self.search.$rate.min = 1;
				self.search.$rate.max = 20;
				self.search.$rate.value = 2;
			}
		}

		this.search.$form.onsubmit = function(e) {
			e.preventDefault();
			window.open(self.search.getUrl());
		}

		this.preview.$iframe = document.querySelector('#preview iframe');
		this.preview.$showBtn = document.getElementById('showPreview');

		this.preview.$showBtn.onclick = function(e) {
			self.preview.show(self.search.getUrl());
		};
	},

	preview: {
		$iframe: null,
		$showBtn: null,

		show(url) {
			this.$iframe.src = url;
		},
		hide() {

		},
	},

	search: {
		$form  : null,
		$host  : null,
		$port  : null,
		$mode  : null,
		$icons : null,
		$ranks : null,
		$rate  : null,

		getParams() {
			const [type, mode] = this.$mode.value.split('-');
			return {
				ip    : this.$host.value,
				port  : this.$port.value,
				type,
				mode,
				icons : this.$icons.checked,
				ranks : this.$ranks.checked,
				rate  : this.$rate.value,
			};
		},
		getUrl() {
			const {ip, port, type, mode, icons, ranks, rate} = ui.search.getParams();
			const params = {ip, port, timeout: rate, mode};
			if (icons) { params.icons = true; }
			if (ranks) { params.ranks = true; }
			return `${location.href}/../obs_${type}_overlay.html?${new URLSearchParams(params)}`;
		},
	},
};


function initialize() {

}


window.onload = function() {
	ui.init();
	console.log(ui.search.getParams());
	initialize();
};