export class InscricaoIndexedDB {
    constructor(dbName = "CACA_DB", storeName = "inscricoes") {
        this.dbName = dbName;
        this.storeName = storeName;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1); 

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                // Cria todas as tabelas necessárias aqui
                if (!db.objectStoreNames.contains("eventos")) {
                    db.createObjectStore("eventos", { keyPath: "id", autoIncrement: true });
                }
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
                }
            };

            request.onsuccess = (e) => {
                this.db = e.target.result;
                console.log("DB Inscricoes Pronta");
                resolve(this.db);
            };

            request.onerror = (e) => {
                console.error("Erro IDB:", e.target.error);
                reject(e.target.error);
            };
            
            request.onblocked = () => {
                console.warn("A base de dados está bloqueada por uma versão antiga aberta.");
                alert("Por favor, feche outras abas deste site para atualizar.");
            };
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

    async getAll() {
        const tx = this.db.transaction([this.storeName], "readonly");
        const store = tx.objectStore(this.storeName);
        return new Promise(res => {
            const req = store.getAll();
            req.onsuccess = () => res(req.result);
        });
    }
}