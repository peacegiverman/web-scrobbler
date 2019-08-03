'use strict';

const noUnscrobbledDescId = 'no-unscrobbled-tracks-description';

const unscrobbledDescId = 'unscrobbled-tracks-description';
const btnClearId = 'btn-clear';
const btnScrobbleAllId = 'btn-scrobble-all';

class StorageView {
	constructor() {
		this.initControls();

		this.presenter = this.getPresenter();
	}

	getPresenter() {
		throw new Error('This function must be overridden!');
	}

	/** Public methods. */

	addEntry(songId, artist, track, album, date) {
		const entryItem = this.createEntry(songId, artist, track, album, date);
		this.songListContainer.append(entryItem);
	}

	getEditedSong() {
		const modalInputNames = ['artist', 'track', 'album'];
		const modalInputMap = {};

		for (const inputName of modalInputNames) {
			const inputId = `edit-song-${inputName}`;

			modalInputMap[inputName] = document.getElementById(inputId).value;
		}

		return modalInputMap;
	}

	getEditedSongId() {
		const modal = document.getElementById('edit-song');
		return modal.getAttribute('data-song-id');
	}

	fillEditModal(songId, artist, track, album) {
		const modalInputsMap = { artist, track, album };

		for (const inputName in modalInputsMap) {
			const inputValue = modalInputsMap[inputName];
			if (inputValue) {
				const inputId = `edit-song-${inputName}`;

				document.getElementById(inputId).value = inputValue;
			}
		}

		const modal = document.getElementById('edit-song');
		modal.setAttribute('data-song-id', songId);
	}

	removeEntries() {
		this.songListContainer.innerHTML = '';
	}

	removeEntry(songId) {
		document.getElementById(songId).remove();
	}

	// TODO Move logic to presenter
	setDescription({ hasUnscrobbledTracks = false } = {}) {
		const clearBtn = document.getElementById(btnClearId);
		const scrobbleAllBtn = document.getElementById(btnScrobbleAllId);
		const unscrobbledDesc = document.getElementById(unscrobbledDescId);
		const noUnscrobbledDesc = document.getElementById(noUnscrobbledDescId);

		clearBtn.disabled = !hasUnscrobbledTracks;
		scrobbleAllBtn.disabled = !hasUnscrobbledTracks;
		unscrobbledDesc.hidden = !hasUnscrobbledTracks;
		noUnscrobbledDesc.hidden = hasUnscrobbledTracks;
	}

	showErrorAlert(messageId) {
		this.showAlert('alert-danger', messageId);
	}

	showSuccessAlert(messageId) {
		this.showAlert('alert-success', messageId);
	}

	updateEntry(songId, artist, track, album) {
		const trackEntry = document.getElementById(songId);
		trackEntry.querySelector(
			'.artist-track'
		).textContent = `${artist} — ${track}`;
		trackEntry.querySelector('.album').textContent = album;
	}

	/** Private methods. */

	createEntry(songId, artist, track, album, date) {
		const artistTrackItem = document.createElement('div');
		artistTrackItem.className = 'artist-track';
		artistTrackItem.textContent = `${artist} — ${track}`;

		const btnEdit = this.createButton('buttonEdit');
		btnEdit.setAttribute('href', '#edit-song');
		btnEdit.setAttribute('data-toggle', 'modal');
		btnEdit.addEventListener('click', () => {
			this.presenter.onEditButtonClicked(songId);
		});

		const btnScrobble = this.createButton('buttonScrobble');
		btnScrobble.addEventListener('click', () => {
			this.presenter.onScrobbleButonClicked(songId);
		});

		const btnRemove = this.createButton('buttonRemove');
		btnRemove.addEventListener('click', () => {
			this.presenter.onRemoveButonClicked(songId);
		});

		const btnContainer = document.createElement('div');
		btnContainer.append(btnEdit, btnScrobble, btnRemove);

		const trackInfoContainer = document.createElement('div');
		trackInfoContainer.className =
			'mb-2 d-flex justify-content-between align-items-center';
		trackInfoContainer.append(artistTrackItem);

		const albumInfoItem = document.createElement('div');
		albumInfoItem.className = 'album';
		albumInfoItem.textContent = album;

		trackInfoContainer.append(albumInfoItem);

		const dateElement = document.createElement('small');
		dateElement.className = 'text-muted';
		dateElement.textContent = date;

		const controlContainer = document.createElement('div');
		controlContainer.className =
			'd-flex justify-content-between align-items-center';
		controlContainer.append(btnContainer, dateElement);

		const entryContainer = document.createElement('li');
		entryContainer.id = songId;
		entryContainer.className = 'list-group-item';
		entryContainer.append(trackInfoContainer, controlContainer);

		return entryContainer;
	}

	createAlert(alertType, messageId) {
		const alertTextElement = document.createElement('div');
		alertTextElement.setAttribute('data-i18n', messageId);

		const alertCrossElement = document.createElement('span');
		alertCrossElement.setAttribute('aria-hidden', true);
		alertCrossElement.innerHTML = '&times;';

		const alertCloseButton = document.createElement('button');
		alertCloseButton.type = 'button';
		alertCloseButton.className = 'close';
		alertCloseButton.setAttribute('data-dismiss', 'alert');
		alertCloseButton.setAttribute('aria-label', 'Close');

		alertCloseButton.append(alertCrossElement);

		const alertElement = document.createElement('div');
		alertElement.classList.add('alert');
		alertElement.classList.add(alertType);
		alertElement.classList.add('alert-dismissible');
		alertElement.classList.add('fade');
		alertElement.classList.add('show');
		alertElement.setAttribute('role', 'alert');

		alertElement.append(alertTextElement, alertCloseButton);

		return alertElement;
	}

	createButton(nameId) {
		const button = document.createElement('a');
		button.className = 'card-link';
		button.href = '#';
		button.setAttribute('data-i18n', nameId);

		return button;
	}

	initControls() {
		this.rootContainer = document.getElementById('root');
		this.songListContainer = document.getElementById('song-list');

		const clearBtn = document.getElementById(btnClearId);
		clearBtn.addEventListener('click', () => {
			this.presenter.onClearButtonClicked();
		});

		const scrobbleAllBtn = document.getElementById(btnScrobbleAllId);
		scrobbleAllBtn.addEventListener('click', () => {
			this.presenter.onScrobbleAllButtonCLicked();
		});

		const modalBtnOk = document.getElementById('edit-song-btn-ok');
		modalBtnOk.addEventListener('click', () => {
			this.presenter.onModalOkButtonClicked();
		});
	}

	showAlert(alertType, messageId) {
		const alertElement = this.createAlert(alertType, messageId);
		this.rootContainer.append(alertElement);
	}
}

define(() => StorageView);
