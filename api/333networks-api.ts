type CountryCode = 'AF' | 'AL' | 'AQ' | 'DZ' | 'AS' | 'AD' | 'AO' | 'AG' | 'AZ' | 'AR' | 'AU' | 'AT' | 'BS' | 'BH' | 'BD'
                 | 'AM' | 'BB' | 'BE' | 'BM' | 'BT' | 'BO' | 'BA' | 'BW' | 'BV' | 'BR' | 'BZ' | 'IO' | 'SB' | 'VG' | 'BN'
                 | 'BG' | 'MM' | 'BI' | 'BY' | 'KH' | 'CM' | 'CA' | 'CV' | 'KY' | 'CF' | 'LK' | 'TD' | 'CL' | 'CN' | 'TW'
                 | 'CX' | 'CC' | 'CO' | 'KM' | 'YT' | 'CG' | 'CD' | 'CK' | 'CR' | 'HR' | 'CU' | 'CY' | 'CZ' | 'BJ' | 'DK'
                 | 'DM' | 'DO' | 'EC' | 'SV' | 'GQ' | 'ET' | 'ER' | 'EE' | 'FO' | 'FK' | 'GS' | 'FJ' | 'FI' | 'AX' | 'FR'
                 | 'GF' | 'PF' | 'TF' | 'DJ' | 'GA' | 'GE' | 'GM' | 'PS' | 'DE' | 'GH' | 'GI' | 'KI' | 'GR' | 'GL' | 'GD'
                 | 'GP' | 'GU' | 'GT' | 'GN' | 'GY' | 'HT' | 'HM' | 'VA' | 'HN' | 'HK' | 'HU' | 'IS' | 'IN' | 'ID' | 'IR'
                 | 'IQ' | 'IE' | 'IL' | 'IT' | 'CI' | 'JM' | 'JP' | 'KZ' | 'JO' | 'KE' | 'KP' | 'KR' | 'KW' | 'KG' | 'LA'
                 | 'LB' | 'LS' | 'LV' | 'LR' | 'LY' | 'LI' | 'LT' | 'LU' | 'MO' | 'MG' | 'MW' | 'MY' | 'MV' | 'ML' | 'MT'
                 | 'MQ' | 'MR' | 'MU' | 'MX' | 'MC' | 'MN' | 'MD' | 'ME' | 'MS' | 'MA' | 'MZ' | 'OM' | 'NA' | 'NR' | 'NP'
                 | 'NL' | 'CW' | 'AW' | 'SX' | 'BQ' | 'NC' | 'VU' | 'NZ' | 'NI' | 'NE' | 'NG' | 'NU' | 'NF' | 'NO' | 'MP'
                 | 'UM' | 'FM' | 'MH' | 'PW' | 'PK' | 'PA' | 'PG' | 'PY' | 'PE' | 'PH' | 'PN' | 'PL' | 'PT' | 'GW' | 'TL'
                 | 'PR' | 'QA' | 'RE' | 'RO' | 'RU' | 'RW' | 'BL' | 'SH' | 'KN' | 'AI' | 'LC' | 'MF' | 'PM' | 'VC' | 'SM'
                 | 'ST' | 'SA' | 'SN' | 'RS' | 'SC' | 'SL' | 'SG' | 'SK' | 'VN' | 'SI' | 'SO' | 'ZA' | 'ZW' | 'ES' | 'SS'
                 | 'SD' | 'EH' | 'SR' | 'SJ' | 'SZ' | 'SE' | 'CH' | 'SY' | 'TJ' | 'TH' | 'TG' | 'TK' | 'TO' | 'TT' | 'AE'
                 | 'TN' | 'TR' | 'TM' | 'TC' | 'TV' | 'UG' | 'UA' | 'MK' | 'EG' | 'GB' | 'GG' | 'JE' | 'IM' | 'TZ' | 'US'
                 | 'VI' | 'BF' | 'UY' | 'UZ' | 'VE' | 'WF' | 'WS' | 'YE' | 'ZM'


interface ServerId {
	id         : number;       // gameserver ID in list database
	sid       ?: number;       // reference ID for detailed information
	ip         : string;       // server IP address (in IPv4 format)
	queryport ?: number;       // UDP status query port
	hostport   : number;       // hostport to join the server
	hostname   : string;       // name of the specific server
	country    : CountryCode;  // 2-letter country code where the server is hosted
	location  ?: string;       // GameSpy regional indication (continent index or 0 for world)
}


interface ServerFlags {
	f_protocol    ?: number;  // protocol index to distinguish between GameSpy v0 and others
	t_protocol    ?: number;  // protocol index to distinguish between GameSpy v0 and others
	f_direct      ?: number;  // direct beacon to the masterserver?
	f_blacklist   ?: number;  // server blacklisted?
	f_auth        ?: number;  // authenticated response to the secure/validate challenge?
	dt_added       : number;  // UTC epoch time that the server was added
	dt_beacon     ?: number;  // UTC epoch time that the server sent a heartbeat
	dt_sync       ?: number;  // UTC epoch time that the server was last synced from another masterserver
	dt_updated     : number;  // UTC epoch time that the server information was updated
	dt_serverinfo ?: number;  // UTC epoch time that the detailed server information was updated
}


type GameName = '333networks'
              | 'deusex'        // Deus Ex
              | 'dnf'           // Duke Nukem Forever
              | 'globalops'     // Global Ops
              | 'heretic2'      // Heretic II
              | 'hx'            // Han's Deus Ex Coop
              | 'kingpin'       // Kingpin
              | 'mobileforces'  // Mobile Forces
              | 'nerfarena'     // Nerf Arena
              | 'postal2'       // Postal 2
              | 'rune'          // Rune
              | 'serioussam'    // Serious Sam
              | 'serioussamse'  // Serious Sam: Second Encounter
              | 'sofretail'     // Soldier of Fortune
              | 'unreal'        // Unreal
              | 'ut'            // Unreal Tournament
              | 'ut2004'        // Unreal Tournament 2004
              | 'wot'           // Wheel of Time

interface GameData {
	gamename  : GameName;  // gamename of the server
	label     : string;    // comprehensible game title associated with gamename
	gamever   : string;    // game version of the server
	minnetver : string;    // minimal required game version to join
}


interface GameSettings {            // <-- detailed information
	listenserver   ?: string;         // dedicated server indication
	adminname      ?: string;         // server administrator's name
	adminemail     ?: string;         // server administrator's contact information
	password       ?: string;         // passworded or non-public server
	mutators       ?: string;         // comma-separated mutator/mod list
	gametype        : string | null;  // type of game: capture the flag, deathmatch, assault and more
	gamestyle      ?: string;         // in-game playing style
	debug_map_path ?: string;
	mapurl         ?: string;         // direct url of the map thumbnail relative from this site's domain
	mapname         : string;         // filename of current map
	maptitle        : string | null;  // title or description of current map
	changelevels   ?: string;         // automatically change levels after match end
	botskill       ?: string;         // skill level of bots
	numplayers      : number;         // current number of players
	minplayers     ?: number;         // minimum number of players to start the game
	maxplayers      : number;         // maximum number of players simultaneously allowed on the server
	maxteams       ?: string;         // maximum number of teams
	balanceteams   ?: string;         // team balancing on join
	playersbalanceteams ?: string;   // players can toggle automatic team balancing
	friendlyfire   ?: string;         // friendly fire rate
	fraglimit      ?: string;         // score limit per deathmatch
	goalteamscore  ?: string;         // score limit per match
	timelimit      ?: string;         // time limit per match
	player_no      ?: Player;         // player information as Json object for player #, see table below
	misc           ?: string;         // miscellaneous server attributes (reserved)
}

interface Player {
	sid   : number;     // associated server ID (per player)
	name  : string;     // player display name
	team  : string;     // player indication as team number, color code or text string
	frags : number;     // number of frags or points
	mesh  : string;     // player model / mesh
	skin  : string;     // player body texture
	face  : string;     // player facial texture
	ping  : number;     // player ping
	misc  : string;     // miscellaneous player attributes (reserved)
	dt_player: number;  // UTC epoch time that the player information was updated
}



type SortOrder = 'a' | 'd';  // ascending or descending.

type SortField = 'country' | 'ip' | 'hostport' | 'hostname' | 'gametype' | 'mapname' | 'numplayers';

namespace ServerList {
	interface Request {
		game      ?: string;
		sortBy    ?: SortField;
		sortOrder ?: SortOrder;
		results   ?: number;       // number of results. Minimum 1, maximum 1000. The default is 50.
		page      ?: number;       // show the specified page with results
		searchBy  ?: string;       // search query (identical to the query on the servers page). Maximum query length is 90 characters.
		gametype  ?: string;       // filter by gametype. Maximum length 90 characters.
		hostname  ?: string;       // filter by server name. Maximum length 90 characters.
		mapname   ?: string;       // filter by map name or map title. Maximum length 90 characters.
		country   ?: CountryCode;  // filter by country code (2-letter ISO 3166 code).
	}

	type Entry = Pick<
		ServerId & ServerFlags & GameData & GameSettings,
		'id' | 'ip' | 'hostport' | 'hostname' | 'country' | 'dt_added' | 'dt_updated' | 'gamename' | 'label' | 'gametype' | 'mapname' | 'maptitle' | 'numplayers' | 'maxplayers'
	>;
	
	interface PageInfo {
		total: number;     // total amount of entries
		players?: number;  // players number that are currently in the selected servers
	}

	type Response = [Entry[], PageInfo]
}


namespace ServerDetails {
	type Response = ServerId & ServerFlags & GameData & GameSettings;
}


interface QueryResponse {

}

interface QueryError {
	error     : number;  // indication that an error occurred
	in        : string;  // handler indication where error occurred
	internal ?: string;  // when enabled on the server, a stacktrace or report of the error
	options  ?: object;  // query options that were provided when the error occurred
}

/*
namespace  {
	interface  {

	}
}

interface  {

}
*/


export class RequestManager {
	static do({method, url, data}={}) {
		let body = null;
		const dataPassed = (data instanceof Object) && (Object.keys(data).length > 0);
		const headers = {};

		switch (method) {
			case 'post':
				if (dataPassed) {
					headers['Content-Type'] = 'application/json';
					body = JSON.stringify(data);
				}
				break;
			default: // GET
				if (dataPassed) {
					url = new URL(url);
					url.search = new URLSearchParams(data).toString();
				}
		}

		const onError = (message) => ({success: false, error: message});
		const onSuccess = (data) => ({success: true, data});
		return fetch(url, {method, headers, body})
				.then(async(response) => {
					switch (response.status) {
						case 400:   return onError('[HTTP] 400: Bad request');
						case 401:   return onError('[HTTP] 401: Unauthorized');
						case 404:   return onError('[HTTP] 404: Not found');
						case 429:   return onError('[HTTP] 429: Too many requests');
						case 500:
						case 503:
						case 504:   return onError('[HTTP] 500: Server error');
						default:
							const dataType = response.headers.get('Content-Type');
							if (dataType.includes('application/json')) {
								const data = await response.json();
								return (data.hasOwnProperty('error'))
										? onError(data)
										: onSuccess(data);
							}
							return onSuccess(await response.text());
					}
				})
				.catch(onError);
	}

	static get    = (url, data) => RequestManager.do({url, data});
	static post   = (url, data) => RequestManager.do({method: 'post',   url, data});
	static put    = (url, data) => RequestManager.do({method: 'put',    url, data});
	static delete = (url, data) => RequestManager.do({method: 'delete', url, data});
}


class MasterAPI {
	static baseUrl: string = 'https://master.333networks.com/json'

	// https://master.333networks.com/json/([\w]{1,20})/motd
	static messageOfTheDay(game: string = 'all'): Promise<QueryResponse | QueryError> {
		return RequestManager.get(`${baseUrl}/${game}/motd`);
	}

	// https://master.333networks.com/json/([\w]{1,20})
	// https://master.333networks.com/json/all
	// https://master.333networks.com/json/unreal
	// https://master.333networks.com/json/333networks?r=2&p=1&q=master
	// https://master.333networks.com/json/ut?r=2&p=1&gametype=AssignedTeamsNewCTF&hostname=&mapname=&country=DE
	static serverList({
		game: 'all', results, page, sortBy, sortOrder,
		searchBy, gametype, hostname, mapname, country,
	}: ServerList.Request = {}): Promise<ServerList.Response | QueryError> {
		const query = new URLSearchParams();
		if (typeof sortBy    === 'string') { params.set('s', sortBy); }
		if (typeof sortOrder === 'string') { params.set('o', sortOrder); }
		if (typeof results   === 'number') { params.set('r', results); }
		if (typeof page      === 'number') { params.set('p', page); }
		// if (typeof searchBy === 'string') { params.searchBy = searchBy; }
		if (typeof gametype === 'string') { params.set('gametype', gametype); }
		if (typeof hostname === 'string') { params.set('hostname', hostname); }
		if (typeof mapname  === 'string') { params.set('mapname', mapname); }
		if (typeof country  === 'string') { params.set('country', country); }

		const url = `${baseUrl}/${game}`;
		return RequestManager.get((query.size) ? `${url}?${query}` : url);
	}

	// https://master.333networks.com/json/([w]{1,20})/(d{1,3}.d{1,3}.d{1,3}.d{1,3}):(d{1,5})
	// https://master.333networks.com/json/333networks/84.83.176.234:28900 <-- error
	// https://master.333networks.com/json/333networks/81.169.138.37:9777
	static serverDetails(ip: string, port: string | number): Promise<ServerDetails.Response | QueryError> {
		return RequestManager.get(`${baseUrl}/${game}/${ip}:${port}`);
	}
}


function getServersList(...args) {
	return MasterAPI
			.serverList(...args)
			.then(([servers, meta]) => {...meta, servers})
}

function getServerDetails(...args) {
	return MasterAPI
			.serverDetails(...args)
			.then((data) => {
				data.players = [];
				for (let i = 0; i < data.numplayers; i++) {
					const key = `player_${i}`;
					if (!data[key]) {
						throw new Error(`Player ${i+1} (of ${data.numplayers}) info is absent!`);
					}
					data.players.push(data[key]);
					delete data[key];
				}
				console.log(data);
				return data;
			});
}


getServerDetails('81.169.138.37', 9777).then(info => console.log(info));