export class EventsRepository {
    constructor(db, storeName = "eventos") {
        this.storeName = storeName;
        this.db = db;
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