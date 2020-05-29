'use strict';

define((require) => {
	const ScrobbleStorage = require('storage/scrobble-storage');

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

			await ScrobbleStorage.updateEntry(entryId, artist, track, album);

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

		onScrobbleButonClicked(entryId) {
			// Imitate scrobbling with a network delay
			setTimeout(() => {
				this.removeEntry(entryId);
			}, 500);
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
