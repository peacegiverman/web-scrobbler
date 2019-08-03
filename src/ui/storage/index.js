'use strict';

const modulesPaths = [
	'ui/storage/storage.presenter',
	'ui/storage/storage.view',
	'bootstrap',
];

require(modulesPaths, (StoragePresenter, StorageView) => {
	function main() {
		new StorageViewImpl();
	}

	class StorageViewImpl extends StorageView {
		getPresenter() {
			return new StoragePresenter(this);
		}
	}

	main();
});
