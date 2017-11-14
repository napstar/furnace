/***************************************************************************************************************************************************************
 *
 * Bundle.js unit tests
 *
 * @file src/bundle.js
 *
 * Tested methods:
 * - Bundle
 *
 **************************************************************************************************************************************************************/


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path from 'path';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Bundle } from '../../src/bundle';
import { Settings } from '../../src/settings';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// uikit.json injection in Settings
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const uikitJson        = require( './mocks/uikit.json' );
const newSettings      = Settings.get();
newSettings.uikit.json = uikitJson;
Settings.set( newSettings );


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Bundle
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
test('Bundle: css minified and jsminified.', () => {

	const data = {
		components: [ 'core', 'animate', 'accordion', 'link-list', 'body', 'breadcrumbs' ],
		styleOutput: 'css',
		jsOutput: 'js',
	};

	Bundle( data )
		.then( data => expect( data._entriesCount ).toEqual( 3 ) );

});

test('Bundle: sassModules and react modules.', () => {

	const data = {
		components: [ 'core', 'animate', 'accordion', 'link-list', 'body', 'breadcrumbs' ],
		styleOutput: 'sassModules',
		jsOutput: 'react',
	};

	Bundle( data )
		.then( data => expect( data._entriesCount ).toEqual( 24 ));

});


test('Bundle: cssModules and jsModules with dependencies.', () => {

	const data = {
		components: [ 'accordion', 'breadcrumbs' ],
		styleOutput: 'cssModules',
		jsOutput: 'jsModules',
	};

	Bundle( data )
		.then( data => expect( data._entriesCount ).toEqual( 4 ) );

});