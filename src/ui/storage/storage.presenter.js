'use strict';

define((require) => {
	const { extension } = require('webextension-polyfill');

	const ScrobbleStorage = require('storage/scrobble-storage');
	const { RESULT_OK } = require('object/service-call-result');
	const { areAllResults } = require('util/util');

	const { webScrobbler } = extension.getBackgroundPage();
	const ScrobbleService = webScrobbler.getScrobbleService();

	class StoragePresenter {
		constructor(view) {
			this.view = view;
			this.loadSongsFromStorage();
		}

		/** Public methods */

		onClearButtonClicked() {
			this.removeAllEntries();
		}

		async onEditButtonClicked(entryId) {
			const { artist, track, album } = await ScrobbleStorage.getEntry(
				entryId
			);

			this.view.fillEditModal(entryId, artist, track, album);
		}

		async onModalOkButtonClicked() {
			const entryId = this.view.getEditedSongId();
			const { artist, track, album } = this.view.getEditedSong();

			await ScrobbleStorage.updateEntry(entryId, { artist, track, album });

			this.view.updateEntry(entryId, artist, track, album);
		}

		async onRemoveButonClicked(entryId) {
			await this.removeEntry(entryId);
		}

		onScrobbleAllButtonCLicked() {
			// Imitate scrobbling with a network delay
			setTimeout(() => {
				this.removeAllEntries();
			}, 1000);
		}

		async onScrobbleButonClicked(entryId) {
			const songInfo = await ScrobbleStorage.getEntry(entryId);
			const results = await ScrobbleService.scrobble(songInfo);

			// TODO Update once results have scrobbler ID attached
			if (areAllResults(results, RESULT_OK)) {
				this.removeEntry(entryId);
			} else {
				// TODO Move textId to view
				this.view.showErrorAlert('unableToScrobble');
			}
		}

		/** Private methods */

		async loadSongsFromStorage() {
			const songCount = await ScrobbleStorage.getSongCount();

			this.view.setDescription({
				hasUnscrobbledTracks: songCount > 0,
			});

			if (songCount === 0) {
				return;
			}

			const entries = await ScrobbleStorage.getEntries();
			for (const entryId in entries) {
				const { artist, track, album, timestamp } = entries[entryId];
				const date = new Date(timestamp * 1000).toLocaleString();

				this.view.addEntry(entryId, artist, track, album, date);
			}
		}

		async removeAllEntries() {
			await ScrobbleStorage.clear();

			this.view.removeEntries();
			this.view.setDescription({ hasUnscrobbled: false });
		}

		async removeEntry(entryId) {
			await ScrobbleStorage.removeEntry(entryId);
			const songCount = await ScrobbleStorage.getSongCount();

			this.view.removeEntry(entryId);
			this.view.setDescription({
				hasUnscrobbledTracks: songCount > 0,
			});
		}
	}

	return StoragePresenter;
});
