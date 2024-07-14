/*
 * Simple script for running emcc on ARToolKit
 * @author zz85 github.com/zz85
 */

var
	exec = require('child_process').exec,
	path = require('path'),
	fs = require('fs'),
	child;

var EMSCRIPTEN_ROOT = "/Users/danielfernandes/Desktop/Lab/emsdk/upstream/emscripten/";

var EMCC = EMSCRIPTEN_ROOT ? path.resolve(EMSCRIPTEN_ROOT, 'emcc') : 'emcc';
var EMPP = EMSCRIPTEN_ROOT ? path.resolve(EMSCRIPTEN_ROOT, 'em++') : 'em++';
var OPTIMIZE_FLAGS = ' -Oz '; // -Oz for smallest size
var MEM = (256 *1024 * 1024) ; // 64MB


var SOURCE_PATH = path.resolve(__dirname, './source/') + '/';
var OUTPUT_PATH = path.resolve(__dirname, './build/') + '/';

var BUILD_DEBUG_FILE = 'em_testing.debug.js';
var BUILD_WASM_FILE = 'em_testing.js';
var BUILD_MIN_FILE = 'em_testing.min.js';

var MAIN_SOURCES = [
	'main.cpp',
];

MAIN_SOURCES = MAIN_SOURCES.map(function(src) {
	return path.resolve(SOURCE_PATH, src);
}).join(' ');

var DEFINES = ' ';

var PRE_FLAGS = '';

var FLAGS = '' + OPTIMIZE_FLAGS;
// var FLAGS = '';
FLAGS += ' --no-entry ';
FLAGS += ' -Wno-warn-absolute-paths ';
FLAGS += ' -sTOTAL_MEMORY=' + MEM + ' ';
FLAGS += ' -sALLOW_MEMORY_GROWTH=1 ';
FLAGS += ' -sASSERTIONS=1';
FLAGS += ' -sFORCE_FILESYSTEM=1';

//ONLY ENABLE FOR USAGE IN WEB FRAMEWORKS(REACT, VUE, ANGULAR) !IMPORTANT FLAGS
FLAGS += ' -sMODULARIZE'; 
FLAGS += ' -sEXPORT_ES6=1';
FLAGS += ' -sENVIRONMENT="web"';
FLAGS += ' -sUSE_ES6_IMPORT_META=0';

var WASM_FLAGS = '';

var EXPORTED_FUNCTIONS = ' -sEXPORTED_FUNCTIONS=["_myFunction"] -sEXPORTED_RUNTIME_METHODS=["ccall, cwrap, FS, stringToUTF8"] ';

/* DEBUG FLAGS */
var DEBUG_FLAGS = ' -g ';
// DEBUG_FLAGS += ' -s ASSERTIONS=2 '
DEBUG_FLAGS += ' -sASSERTIONS=1 '
DEBUG_FLAGS += ' --profiling '
// DEBUG_FLAGS += ' -s EMTERPRETIFY_ADVISE=1 '
DEBUG_FLAGS += ' -sALLOW_MEMORY_GROWTH=1';
DEBUG_FLAGS += '  -sDEMANGLE_SUPPORT=1 ';

var INCLUDES = [
	OUTPUT_PATH,
	SOURCE_PATH,
].map(function(s) { return '-I' + s }).join(' ');

function format(str) {
	for (var f = 1; f < arguments.length; f++) {
		str = str.replace(/{\w*}/, arguments[f]);
	}
	return str;
}

function clean_builds() {
	try {
		var stats = fs.statSync(OUTPUT_PATH);
	} catch (e) {
		fs.mkdirSync(OUTPUT_PATH);
	}

	try {
		var files = fs.readdirSync(OUTPUT_PATH);
		if (files.length > 0)
		for (var i = 0; i < files.length; i++) {
			var filePath = OUTPUT_PATH + '/' + files[i];
			if (fs.statSync(filePath).isFile())
				fs.unlinkSync(filePath);
		}
	}
	catch(e) { return console.log(e); }
}




var compile_combine = format(EMCC + ' ' + INCLUDES + ' '
	+ MAIN_SOURCES
	+ FLAGS + ' -s WASM=0' + ' '  + DEBUG_FLAGS + DEFINES + ' -o {OUTPUT_PATH}{BUILD_FILE} ',
	  OUTPUT_PATH, BUILD_DEBUG_FILE);

var compile_combine_min = format(EMCC + ' '  + INCLUDES + ' '
	+ MAIN_SOURCES + EXPORTED_FUNCTIONS
	+ FLAGS + ' -s WASM=0' + ' ' + DEFINES  + ' -o {OUTPUT_PATH}{BUILD_FILE} ',
 	 OUTPUT_PATH, BUILD_MIN_FILE);

var compile_wasm = format(EMCC + ' ' + INCLUDES + ' '
	+ MAIN_SOURCES + EXPORTED_FUNCTIONS
	+ FLAGS + WASM_FLAGS + DEFINES + PRE_FLAGS + ' -o {OUTPUT_PATH}{BUILD_FILE} ',
	  OUTPUT_PATH, BUILD_WASM_FILE);

	  
/*
 * Run commands
 */

function onExec(error, stdout, stderr) {
	if (stdout) console.log('stdout: ' + stdout);
	if (stderr) console.log('stderr: ' + stderr);
	if (error !== null) {
		console.log('exec error: ' + error.code);
		process.exit(error.code);
	} else {
		runJob();
	}
}

function runJob() {
	if (!jobs.length) {
		console.log('Jobs completed');
		return;
	}
	var cmd = jobs.shift();

	if (typeof cmd === 'function') {
		cmd();
		runJob();
		return;
	}

	console.log('\nRunning command: ' + cmd + '\n');
	exec(cmd, onExec);
}

var jobs = [];

function addJob(job) {
	jobs.push(job);
}

addJob(clean_builds);
addJob(compile_wasm);
addJob(compile_combine_min);
// addJob(test_wasm);
runJob();