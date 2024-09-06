class _333NetworksAPI {
	static baseUrl = 'https://master.333networks.com/json';

	static gameTypes = ['TO340', 'TO350', 'TOonUT'];

	static doRequest(url) {
		return new Promise(
			function(resolve, reject) {
				fetch(url)
					.then(response => response.json())
					.then(
						(response) => (response.hasOwnProperty('error'))
										? reject(`API error:\n${JSON.stringify(response)}`)
										: resolve(response)
					)
					.catch(reject);
			}
		);
	}

	static getServerList(gametype, limit=1000) {
		if (!this.gameTypes.includes(gametype)) {
			return Promise.reject(`Wrong server gametype=${gametype}`);
		}
		return this.doRequest(`${_333NetworksAPI.baseUrl}/ut?gametype=${gametype}&r=${limit}`);
	}

	static getStat(ip, port) {
		if (typeof ip !== 'string' || !ip || typeof port !== 'string' || !port) {
			return Promise.reject(`Wrong server ip=${ip}, port=${port}. Check the url`);
		}
		return this.doRequest(`${_333NetworksAPI.baseUrl}/ut/${ip}:${port}`);
	}
}

class LuckyDogAPI {
	static baseUrl = 'https://serverstatus.tacops.de';

	static doRequest(url) {
		return new Promise(
			function(resolve, reject) {
				fetch(url)
					.then(response => response.json())
					.then(
						(response) => ((response.errors || []).length > 0)
										? reject(['API Error:', ...response.errors].join('\n'))
										: resolve(response)
					)
					.catch(reject);
			}
		);
	}

	static getStat(ip, port) {
		if (typeof ip !== 'string' || !ip || typeof port !== 'string' || !port) {
			Promise.reject(`Wrong server ip=${ip}, port=${port}. Check the url`);
		}
		const url = `${LuckyDogAPI.baseUrl}/serverquery.php?${new URLSearchParams({ip, port, timeout: 0})}`
		return this.doRequest(url);
	}
}