export class Inscricoes {
    constructor(db) {
        this.db = db;
        this.init();
    }

    async init() {
        const form = document.getElementById('newsletter-form');
        
        // 1. Garante que o form existe antes de adicionar o listener
        if (form) {
            form.addEventListener('submit', (e) => this.handleRegistration(e));
        }

        // 2. Carrega a lista de participantes assim que a classe é instanciada
        await this.renderParticipantes();
    }

    async handleRegistration(e) {
        e.preventDefault();

        try {
            // Verifica se os campos existem para evitar erros de null
            const nomeInput = document.getElementById('news-name');
            const emailInput = document.getElementById('news-email');

            if (!nomeInput || !emailInput) {
                console.error("Erro: Alguns campos do formulário não foram encontrados no DOM.");
                return;
            }

            const inscricao = {
                nome: nomeInput.value,
                email: emailInput.value,
                dataInscricao: new Date().toISOString()
            };

            // 3. Aguarda a gravação na IndexedDB
            await this.db.create(inscricao);
            
            alert(`Obrigado, ${inscricao.nome}! Inscrição confirmada.`);
            
            e.target.reset();
            
            // 4. Atualiza a lista visualmente
            await this.renderParticipantes(); 

        } catch (error) {
            console.error("Erro ao processar inscrição:", error);
            alert("Ocorreu um erro ao guardar a sua inscrição.");
        }
    }

    async renderParticipantes() {
        await this.db.getAll();
    }
}