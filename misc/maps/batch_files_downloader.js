/*
	1. Go to https://tactical-ops.eu/
	2. Paste it into the Developer Tools console and execute
*/
const fileSaver = {
	$a: null,

	init() {
		this.$a = document.createElement('a');
		document.body.appendChild(this.$a);
	},
	
	save(blob, filename) {
		if (blob && filename) {
			const objUrl = URL.createObjectURL(blob);
			this.$a.href = objUrl;
			this.$a.download = filename;
			this.$a.click();
			setTimeout(URL.revokeObjectURL, objUrl, 100);
		}
	},
};
fileSaver.init();

async function download(urls) {
	for (const url of urls) {
		try {
			const response = await fetch(url);
			if (response) {
				const filename = url.split('/').at(-1);
				console.log(filename);
				fileSaver.save(await response.blob(), filename);
			}
		} catch (e) {
			console.log(e);
		}
	}
}

download([
	"https://mirror.tactical-ops.eu/map-screenshots/1600x900-png/TO-UT-Sesmar.png",
	"https://mirror.tactical-ops.eu/map-screenshots/1600x900-png/TO-UT-StalwartXL.png",
	"https://mirror.tactical-ops.eu/map-screenshots/1600x900-png/TO-UT-Tempest.png",
	"https://mirror.tactical-ops.eu/map-screenshots/1600x900-png/TO-UT-ToysII.png",
	"https://mirror.tactical-ops.eu/map-screenshots/1600x900-png/TO-UT-Turbine.png",
	"https://mirror.tactical-ops.eu/map-screenshots/1600x900-png/TO-UT-Viridian-TOURNEY.png",
	"https://mirror.tactical-ops.eu/map-screenshots/1600x900-png/TO-UT-Zeto.png",
]);