'use strict';

define(() => {
	class ScrobbleStorageModel {
		/* Public methods */

		async addSong(song) {
			const storageData = await this.getDataFromStorage();
			const entryId = ScrobbleStorageModel.generateEntryId();

			storageData[entryId] = {
				artist: song.getArtist(),
				track: song.getTrack(),
				album: song.getAlbum(),
				timestamp: song.metadata.startTimestamp,
			};
			await this.saveDataToStorage(storageData);
		}

		async getEntry(entryId) {
			const storageData = await this.getDataFromStorage();
			return storageData[entryId];
		}

		async getEntries() {
			return await this.getDataFromStorage();
		}

		async removeEntry(entryId) {
			const storageData = await this.getDataFromStorage();

			delete storageData[entryId];
			await this.saveDataToStorage(storageData);
		}

		async updateEntry(entryId, entryData) {
			const storageData = await this.getDataFromStorage();

			for (const key in entryData) {
				storageData[entryId][key] = entryData[key];
			}

			await this.saveDataToStorage(storageData);
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

		/* Static methods */

		static generateEntryId() {
			const uniqueNumber = Date.now();
			return `id-${uniqueNumber}`;
		}
	}

	return ScrobbleStorageModel;
});
