'use strict';

Connector.useMediaSessionApi();

Connector.playerSelector = '#player';

Connector.getTrackArt = () => {
	const trackArtUrl = $('#playerBarArt').attr('src');
	if (trackArtUrl) {
		return trackArtUrl.replace('=s90-c-e100', '');
	}

	return null;
};

Connector.artistSelector = '#player-artist';

Connector.trackSelector = '#currently-playing-title';

Connector.albumSelector = '.player-album';

Connector.currentTimeSelector = '#time_container_current';

Connector.durationSelector = '#time_container_duration';

Connector.isPlaying = () => {
	return $('#player *[data-id="play-pause"]').hasClass('playing');
};

Connector.isScrobblingAllowed = () => Connector.getArtist() !== 'Subscribe to go ad-free';

Connector.getMetaInfo = () => {
	const mediaType = getMediaType();
	return { mediaType };
};

function getMediaType() {
	if ($('#player .now-playing-actions').hasClass('podcast')) {
		return 'podcast';
	}

	return 'music';
}
