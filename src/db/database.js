/**
 * Inicializador central da base de dados IndexedDB.
 * Retorna uma promise com a instância da base de dados.
 */
export async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("CACA_DB", 1);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;

            if (!db.objectStoreNames.contains("eventos")) {
                db.createObjectStore("eventos", { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains("inscricoes")) {
                db.createObjectStore("inscricoes", { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (e) => {
            resolve(e.target.result);
        };

        request.onerror = (e) => {
            console.error("Erro ao abrir base de dados IndexedDB:", e.target.error);
            reject(e.target.error);
        };

        request.onblocked = () => {
            console.warn("A base de dados está bloqueada por uma versão antiga aberta.");
            alert("Por favor, feche outras abas deste site para atualizar.");
        };
    });
}
