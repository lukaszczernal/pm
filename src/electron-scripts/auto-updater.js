const autoUpdater = require('electron-updater').autoUpdater;
const dialog = require('electron-updater').dialog;
const axios = require('axios');
const semver = require('semver');
const { version } = require('../package.json');

const isWindows = process.platform === 'win32';

// const updateURL = 'http://kzgpr.pl/apps' + (isWindows ? '' : '/latest-mac.json');
const updateUrlManifest = 'http://localhost:8080' + (isWindows ? '' : '/latest-mac.json');
const updateURL = 'http://localhost:8080';

// Check for flag passed to process. --dev is passed in the npm start script.
const isDev = process.argv.some(str => str === '--dev');

module.exports = {
	init
};

function init() {
	// Can't run this in development because there's no code sign in dev.
	if(isDev) {
		return;
	}

	// Do some logging on each of the events
	logEvents();

	autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl) => {
		promptUpdate();
	});
	
	autoUpdater.setFeedURL(updateURL); //this also "starts" the autoUpdater
	checkForUpdate();
}

function logEvents() {
	autoUpdater.on('checking-for-update', () => {
		console.log('checking-for-update');
	});
	
	autoUpdater.on('update-available', () => {
		console.log('update-available');
	});
	
	autoUpdater.on('update-not-available', () => {
		console.log('update-not-available');
	});
	
	autoUpdater.on('update-downloaded', () => {
		console.log('update-downloaded');
	});
	
	autoUpdater.on('error', () => {
		console.error('error');
	});
}

function checkForUpdate() {
  if (isWindows) {
    autoUpdater.checkForUpdates();
  } else {
		// For Mac, manually check if there's a version available to download. Because we're using
		// a simple file server for mac updates, not the HTTP 200 status = update, 204 = no update thing,
		// which requires some server side configuration.
		checkForMacUpdate()
			.then(hasUpdate => {
      			if(hasUpdate)
        			autoUpdater.checkForUpdates()
			});
  }
}

function checkForMacUpdate() {
	return axios
		.get(updateUrlManifest)
		.then(response =>
			response.status === 200 &&
			semver.gt(response.data.version, version)
		)
		.catch(console.error)
}

function promptUpdate() {
	dialog.showMessageBox({
		type: 'info',
		message: 'Dostępna jest nowa wersja aplikacji',
		buttons: ['Aktualizuj', 'Pomiń'],
		defaultId: 0
	}, (clickedIndex) => {
		if(clickedIndex === 0) {
			autoUpdater.quitAndInstall();
		}
	});
}