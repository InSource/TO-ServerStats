const ui = {
	init() {
		const self = this;

		const $form = document.getElementById('queryForm');
		self.settings.$form  = $form;
		self.settings.$host  = $form.elements.ip;
		self.settings.$port  = $form.elements.port;
		self.settings.$mode  = $form.elements.mode;
		self.settings.$icons = $form.elements.icons;
		self.settings.$ranks = $form.elements.ranks;
		self.settings.$rate  = $form.elements.rate;

		self.settings.$mode.onchange = function(e) {
			if (this.value.includes('legacy')) {
				self.settings.$rate.min = 10;
				self.settings.$rate.max = 60;
				self.settings.$rate.value = 15;
			} else {
				self.settings.$rate.min = 1;
				self.settings.$rate.max = 20;
				self.settings.$rate.value = 2;
			}
		}

		self.settings.$form.onsubmit = function(e) {
			e.preventDefault();
			self.url.copy();
		}

		self.preview.$iframe = document.querySelector('#preview iframe');
		self.preview.$showBtn = document.getElementById('showPreview');

		self.preview.$showBtn.onclick = function(e) {
			self.preview.show(self.url.get());
		};
	},

	url: {
		get() {
			const {ip, port, type, mode, icons, ranks, rate} = ui.settings.getParams();
			const params = {ip, port, timeout: rate, mode};
			if (icons) { params.icons = true; }
			if (ranks) { params.ranks = true; }
			return `${location.href}/../obs_${type}_overlay.html?${new URLSearchParams(params)}`;
		},

		copy() {
			console.log(this.get());
			navigator.clipboard.writeText(this.get());
		},
	},

	settings: {
		$form   : null,
		$host   : null,
		$port   : null,
		$mode   : null,
		$icons  : null,
		$ranks  : null,
		$rate   : null,

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
	},

	preview: {
		$iframe: null,
		$showBtn: null,

		show(url) {
			this.$iframe.src = url;
		}
	},
};


window.onload = function() {
	ui.init();
	console.log(ui.settings.getParams());
};