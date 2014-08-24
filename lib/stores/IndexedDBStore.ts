class IndexedDBStore {

    open(name: string, version: number){
        return new Promise((resolve, reject) => {
            var openreq = indexedDB.open(name, version);
            openreq.onerror = function() {
                reject(openreq.error);
            };
            openreq.onupgradeneeded = function() {
                // First time setup: create an empty object store
                openreq.result.createObjectStore(dbInfo.storeName);
            };
            openreq.onsuccess = function() {
                db = openreq.result;
                resolve();
            };

        });
    }
}