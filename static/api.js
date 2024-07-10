class _333NetworksAPI {
	static baseUrl = 'https://master.333networks.com/json';

	static getStat(ip, port) {
		return new Promise(
			function(resolve, reject) {
				if (typeof ip !== 'string' || !ip || typeof port !== 'string' || !port) {
					reject(`Wrong server ip=${ip}, port=${port}. Check the url`);
				}

				const url = `${_333NetworksAPI.baseUrl}/ut/${ip}:${port}`;
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
}

class LuckyDogAPI {
	static baseUrl = 'https://serverstatus.tacops.de';

	static getStat(ip, port) {
		return new Promise(
			function(resolve, reject) {
				if (typeof ip !== 'string' || !ip || typeof port !== 'string' || !port) {
					reject(`Wrong server ip=${ip}, port=${port}. Check the url`);
				}

				const url = `${LuckyDogAPI.baseUrl}/serverquery.php?${new URLSearchParams({ip, port, timeout: 0})}`;
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
}