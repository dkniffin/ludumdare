import Fetch	 				from '../internal/fetch';

export default {
	Get,
	Walk,
	GetFeed,
	
	GetMy
};

var Nodes = {};

export function Walk( parent, slugs ) {
	return Fetch.Get('//'+API_DOMAIN+'/vx/node/walk/'+parent+'/'+slugs.join('/'));
}

export function Get( ids ) {
	if ( Number.isInteger(ids) ) {
		ids = [ids];
	}

	return Fetch.Get('//'+API_DOMAIN+'/vx/node/get/'+ids.join('+'));
}

export function GetFeed( id, methods, types ) {
	let args = [];

	args.push(id);

	if ( methods ) {
		if ( Array.isArray(methods) ) {
			methods = methods.join("+");
		}
		args.push(methods);
	}

	if ( types ) {
		if ( Array.isArray(types) ) {
			types = types.join("+");
		}
		args.push(types);
	}

	return Fetch.Get('//'+API_DOMAIN+'/vx/node/feed/'+args.join('/'));
}

export function GetMy() {
	return Fetch.Get('//'+API_DOMAIN+'/vx/node/getmy');
}
