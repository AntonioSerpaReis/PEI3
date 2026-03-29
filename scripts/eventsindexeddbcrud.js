export class EventsIndexedDBCRUD {
    constructor(dbName = "CACA_DB", storeName = "eventos") {
        this.dbName = dbName;
        this.storeName = storeName;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
                }
            };
            request.onsuccess = (e) => { this.db = e.target.result; resolve(this.db); };
            request.onerror = (e) => reject("Erro IDB: " + e.target.error);
        });
    }

    async create(data) {
        const tx = this.db.transaction([this.storeName], "readwrite");
        const store = tx.objectStore(this.storeName);
        return new Promise(res => {
            const req = store.add(data);
            req.onsuccess = () => res(req.result);
        });
    }

    async update(data) {
    const tx = this.db.transaction([this.storeName], "readwrite");
    const store = tx.objectStore(this.storeName);
    return new Promise((resolve, reject) => {
        // O .put() atualiza se o ID existir ou cria se não existir
        const req = store.put(data); 
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

    async getAll() {
        const tx = this.db.transaction([this.storeName], "readonly");
        const store = tx.objectStore(this.storeName);
        return new Promise(res => {
            const req = store.getAll();
            req.onsuccess = () => res(req.result);
        });
    }

    async delete(id) {
        const tx = this.db.transaction([this.storeName], "readwrite");
        const store = tx.objectStore(this.storeName);
        return new Promise((resolve, reject) => {
            const req = store.delete(Number(id));
            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(false);
        });
    }
}