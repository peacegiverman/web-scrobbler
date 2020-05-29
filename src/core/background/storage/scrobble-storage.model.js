'use strict';

define(() => {
	class ScrobbleStorageModel {
		/* Public methods */

		async addSong(song) {
			const entryData = {
				artist: song.getArtist(),
				track: song.getTrack(),
				album: song.getAlbum(),
				timestamp: song.metadata.startTimestamp,
			};

			const entryId = ScrobbleStorageModel.generateEntryId();
			await this.setEntry(entryId, entryData);
		}

		async getEntries() {
			return await this.getDataFromStorage();
		}

		async removeEntry(entryId) {
			const storageData = await this.getDataFromStorage();

			delete storageData[entryId];
			await this.saveDataToStorage(storageData);
		}

		async updateEntry(entryId, artist, track, album) {
			const entryData = { artist, track, album };
			await this.setEntry(entryId, entryData);
		}

		/* Functions must be implemented */

		/**
		 * Remove all data from the storage.
		 */
		async clear() {
			throw new Error('This function must be overridden!');
		}

		/**
		 * Return data of the scrobble storage.
		 *
		 * @return {Object} Storage data
		 */
		async getDataFromStorage() {
			throw new Error('This function must be overridden!');
		}

		/**
		 * Return a number of songs stored in the storage.
		 *
		 * @return {Object} Storage data
		 */
		async getSongCount() {
			throw new Error('This function must be overridden!');
		}

		/**
		 * Save given data to the scrobble storage.
		 *
		 * @return {Object} Storage data
		 */
		async saveDataToStorage(/* data */) {
			throw new Error('This function must be overridden!');
		}

		/* Private methods */

		async setEntry(entryId, entryData) {
			const storageData = await this.getDataFromStorage();

			storageData[entryId] = entryData;
			await this.saveDataToStorage(storageData);
		}

		/* Static methods */

		static generateEntryId() {
			const uniqueNumber = Date.now();
			return `id-${uniqueNumber}`;
		}
	}

	return ScrobbleStorageModel;
});
