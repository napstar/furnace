/***************************************************************************************************************************************************************
 *
 * Bundle the data into a zipFile
 *
 * Bundle - Iterates over the components, bundles tasks together and adds file to zip.
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path from 'path';
import Archiver from 'archiver';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { SETTINGS }         from './settings';
import { Log }              from './helper';
import { GetMinCss }        from './css';
import { GetMinJs }         from './javascript';
import { AddFile, AddGlob } from './zip';
import { ReadFile }         from './files';


/**
 * Bundle - Iterates over the components, bundles tasks together and adds file to zip
 *
 * @param  {object} data    - The request.body and it's dependencies formatted from the POST
 *
 * @return {object} zipFile - The zipFile which will be sent back to the user
 */
export const Bundle = ( data ) => {
	Log.verbose( `Running PrepareBundle` );

	// A new instance of the zipFile
	let zipFile = Archiver(`zip`);

	// An array of promises that adds files and globs to the zip.
	const bundle = [];

	// Sass @imports for minification and sassModules, always starts with sassVersioning.
	let cssImports    = `@import '${ SETTINGS.npm.sassVersioning }';\n\n`;
	let sassImports   = `@import 'node_modules/sass-versioning/dist/_index.scss';\n\n`;

	// JS values based on the form input
	const jsFileName  = SETTINGS.uikit.jsOutput[ data.jsOutput ].fileName;
	const jsDirectory = SETTINGS.uikit.jsOutput[ data.jsOutput ].directory;

	// Array of JS files to be uglified
	const jsMin = [];

	const packageJson = SETTINGS.packageJson;

	return new Promise ( ( resolve, reject ) => {

		// Iterate through components and dependencies
		data.components.map( component => {

			// The uikit.json object for the current component
			const componentJson = SETTINGS.uikit.json[`${ SETTINGS.uikit.prefix }${ component }`];

			packageJson.dependencies[ `${ SETTINGS.uikit.prefix }${ component }`] = componentJson.version;

			// If the current component has javascript
			if( componentJson['pancake-module'][ jsDirectory ] ) {
				const jsFile = Path.normalize( `uikit/packages/${ component }/${ componentJson['pancake-module'][ jsDirectory ].path }` );

				// minifyJs was selected in the form, add the directory to the array
				if( data.jsOutput === 'js' ) {
					jsMin.push( jsFile );
				}

				// minfyJs not selected in the form, add JS modules based on the fileName/Directory
				if( data.jsOutput === 'react' ) {
					bundle.push(
						ReadFile( Path.normalize( jsFile ) )
							.then( jsData => AddFile( jsData, `/${ SETTINGS.packageJson.pancake.react.location }${ component }.js`, zipFile ) )
					);
				}

				if( data.jsOutput === 'jsModules' ) {
					bundle.push(
						GetMinJs( [ Path.normalize( jsFile ) ] )
							.then( jsData => AddFile( jsData, `/${ SETTINGS.packageJson.pancake.js.location }/${ component }.js`, zipFile ) )
					);
				}
			}


			// minifyCss was selected, create an @Import string
			const sassFile = Path.normalize( `uikit/packages/${ component }/${ componentJson['pancake-module'].sass.path }` );
			if( data.styleOutput === 'css' ) {
				cssImports += `@import '${ sassFile }';\n`;
			}


			// If cssModules was selected
			const dependencies = componentJson.peerDependencies;
			if( data.styleOutput === 'cssModules' && Object.keys( dependencies ).length ) {
				// Create an @import string for CSS modules, add sassVersioning first.
				let cssModuleImport = `@import '${ SETTINGS.npm.sassVersioning }';\n\n`;

				// Add an @import for each dependency
				Object.keys( dependencies ).map( dependency => {
					cssModuleImport += `@import '${ `uikit/packages/${ dependency.replace('@gov.au/', '') }/${ componentJson['pancake-module'].sass.path }` }';\n`;
				});

				// Add an @import for the current component
				cssModuleImport += `@import '${ `uikit/packages/${ component }/${ componentJson['pancake-module'].sass.path }` }';\n`;

				// Compile the CSS and add the file to the Zip
				bundle.push(
					GetMinCss( cssModuleImport )
						.then( cssMin => AddFile( cssMin, `/css/${ component }.css`, zipFile ) )
				);
			}


			// sassModules was selected, create an @import for the zipFile, addGlob to zip
			const sassDirectory = Path.normalize( sassFile ).replace('_module.scss', '');
			if( data.styleOutput === 'sassModules' ) {
				sassImports += `@import 'node_modules/@gov.au/${ component }/lib/sass/_module.scss';\n`;
				bundle.push( AddGlob( `*.scss`, sassDirectory, `node_modules/@gov.au/${ component }/lib/sass/`, zipFile ) );
			}
		});


		// minifyCss was selected, turn cssImports into a minified css file
		if( data.styleOutput === 'css' ) {
			packageJson.pancake.css.minified = true;
			bundle.push(
				GetMinCss( cssImports )
					.then( cssMin => AddFile( cssMin, `${ SETTINGS.packageJson.pancake.css.location }${ SETTINGS.packageJson.pancake.css.name }`, zipFile ) )
			);
		}


		// sassModules was selected, create the main.scss and add sass-versioning
		if( data.styleOutput === 'sassModules' ) {
			packageJson.pancake.sass.modules = true;
			bundle.push(
				ReadFile( SETTINGS.npm.sassVersioning )
					.then( sassVersioning => AddFile( sassVersioning, `node_modules/sass-versioning/dist/_index.scss`, zipFile ) )
			);

			bundle.push(
				AddFile( sassImports, SETTINGS.packageJson.pancake.sass.name, zipFile )
			);
		}


		// jsMin was selected, create a minified js file
		if( jsMin.length !== 0 ) {
			packageJson.pancake.js.minified = true;
			bundle.push(
				GetMinJs( jsMin )
					.then( jsMinData => AddFile( jsMinData, `${ SETTINGS.packageJson.pancake.js.location }${ SETTINGS.packageJson.pancake.js.name }`, zipFile ) )
			)
		}

		bundle.push(
			AddFile( JSON.stringify( packageJson ), `package.json`, zipFile )
		);

		// Run all of the promises
		Promise.all( bundle )
			.then( () => resolve( zipFile ) )
			.catch( error => reject( error ) );

	})
};

