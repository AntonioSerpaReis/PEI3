export class SubscriptionRepository {
    constructor(db, storeName = "inscricoes") {
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

    async getAll() {
        const tx = this.db.transaction([this.storeName], "readonly");
        const store = tx.objectStore(this.storeName);
        return new Promise(res => {
            const req = store.getAll();
            req.onsuccess = () => res(req.result);
        });
    }
}