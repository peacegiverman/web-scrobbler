'use strict';

class StorageStub {
	constructor() {
		this.storage = {
			id1: {
				artist: 'Artist 1',
				track: 'Track 1',
				timestamp: 1590658424,
			},
			id2: {
				artist: 'Artist 2',
				track: 'Track 2',
				album: 'Album 2',
				timestamp: 1590658178,
			},
			id3: {
				artist: 'Artist 3',
				track: 'Track 3',
				album: 'Album 3',
				timestamp: 1590657173,
			},
		};
	}

	clear() {
		this.storage = {};
	}

	getSongs() {
		return Object.entries(this.storage).map(([entryId, songInfo]) => {
			const song = { entryId };
			return Object.assign(song, songInfo);
		});
	}

	getSong(entryId) {
		return this.storage[entryId];
	}

	getSize() {
		return Object.keys(this.storage).length;
	}

	removeSong(entryId) {
		delete this.storage[entryId];
	}

	updateSong(entryId, artist, track, album) {
		this.storage[entryId] = {
			artist: artist || null,
			track: track || null,
			album: album || null,
		};
	}
}

class StoragePresenter {
	constructor(view) {
		this.view = view;

		this.storage = new StorageStub();
		this.loadSongsFromStorage();
	}

	/** Public methods */

	onClearButtonClicked() {
		this.clearAllEntries();
	}

	onEditButtonClicked(entryId) {
		const { artist, track, album } = this.storage.getSong(entryId);

		this.view.fillEditModal(entryId, artist, track, album);
	}

	onModalOkButtonClicked() {
		const entryId = this.view.getEditedSongId();
		const { artist, track, album } = this.view.getEditedSong();

		this.storage.updateSong(entryId, artist, track, album);

		this.view.updateEntry(entryId, artist, track, album);
	}

	onRemoveButonClicked(entryId) {
		this.removeEntry(entryId);
		this.view.showError(`Unable to remove ${entryId}`);
	}

	onScrobbleAllButtonCLicked() {
		// Imitate scrobbling with a network delay
		setTimeout(() => {
			this.clearAllEntries();
		}, 1000);
	}

	onScrobbleButonClicked(songId) {
		// Imitate scrobbling with a network delay
		setTimeout(() => {
			this.removeEntry(songId);
		}, 500);
	}

	/** Private methods */

	clearAllEntries() {
		this.storage.clear();

		this.view.removeEntries();
		this.view.setDescription({ hasUnscrobbled: false });
	}

	loadSongsFromStorage() {
		const songCount = this.storage.getSize();

		this.view.setDescription({
			hasUnscrobbledTracks: songCount > 0,
		});

		if (songCount === 0) {
			return;
		}

		for (const song of this.storage.getSongs()) {
			const { entryId, artist, track, album, timestamp } = song;
			const date = new Date(timestamp * 1000).toLocaleString();

			this.view.addEntry(entryId, artist, track, album, date);
		}
	}

	removeEntry(entryId) {
		delete this.storage.removeSong(entryId);

		this.view.removeEntry(entryId);
		this.view.setDescription({
			hasUnscrobbledTracks: this.storage.getSize() > 0,
		});
	}
}

define(() => StoragePresenter);
