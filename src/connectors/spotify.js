'use strict';

const playerBar = '.Root__now-playing-bar';
const connectBar = '.ConnectBar';

const artistSelector = `${playerBar} [dir="auto"]:last-child a`;
const deviceNameSelector = '.ConnectBar__device-name';

Connector.useMediaSessionApi();

Connector.playerSelector = playerBar;

Connector.artistSelector = artistSelector;

Connector.trackSelector = `${playerBar} [dir="auto"]:first-child a`;

Connector.trackArtSelector = '.NavBarFooter .cover-art-image';

Connector.playButtonSelector = `${playerBar} .control-button[class*="spoticon-play-"]`;

Connector.currentTimeSelector = `${playerBar} .playback-bar__progress-time:first-child`;

Connector.durationSelector = `${playerBar} .playback-bar__progress-time:last-child`;

Connector.applyFilter(MetadataFilter.getSpotifyFilter());

Connector.isScrobblingAllowed = () => isMusicPlaying() && isMainTab();

Connector.isPodcast = () => artistUrlIncludes('/show/');

function isMusicPlaying() {
	return artistUrlIncludes('/artist/', '/show/');
}

function artistUrlIncludes(...strings) {
	const artistUrl = Util.getAttrFromSelectors(artistSelector, 'href');

	if (artistUrl) {
		for (const str of strings) {
			if (artistUrl.includes(str)) {
				return true;
			}
		}
	}

	return false;
}

function isMainTab() {
	const multipleSources = document.querySelector(connectBar) !== null;
	if (multipleSources) {
		const deviceName = Util.getTextFromSelectors(deviceNameSelector);
		return !deviceName.includes('Web Player');
	}

	return true;
}
