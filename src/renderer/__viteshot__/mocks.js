/* eslint-disable no-console */

/* global globalThis */
/* global console */

globalThis.log = {
	debug: console.log,
	error: console.error,
	info: console.log,
	log: console.log,
	silly: console.log,
	verbose: console.log,
	warn: console.error,
};
