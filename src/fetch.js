/***************************************************************************************************************************************************************
 *
 * Fetch data from a server
 *
 * Fetch - Promisified request to get data
 *
 **************************************************************************************************************************************************************/

'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import Request from 'request';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log } from './helper';


/**
 * Fetch
 * @param {string} url - The URL to get the data from
 */
export const Fetch = ( url ) => {
	Log.verbose(`Getting data from: ${ url }`);

	return new Promise( ( resolve, reject ) => {
		Request( url, ( error, response, body ) => {
			if( !error && response.statusCode === 200 ) {
				resolve( JSON.parse( body ) );
			}
			else {
				reject( error );
			}
		});
	})
};