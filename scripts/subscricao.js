export class Inscricoes {
    constructor(db) {
        this.db = db;
        this.init();
    }

    async init() {
        const form = document.getElementById('newsletter-form');
        
        // Garante que o form existe antes de adicionar o listener
        if (form) {
            form.addEventListener('submit', (e) => this.handleRegistration(e));
        }

        // Carrega a lista de participantes assim que a classe é instanciada
        await this.renderParticipantes();
    }

    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    validarNome(nome) {
        // Aceita letras (incluindo acentos) e espaços. Mínimo 3 caracteres.
        const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{3,}$/;
        return regex.test(nome.trim());
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

            if (!this.validarNome(nome)) {
                alert("Por favor, insira um nome válido (mínimo 3 caracteres, apenas letras).");
                nomeInput.focus();
                return;
            }

            if (!this.validarEmail(email)) {
                alert("Por favor, insira um endereço de e-mail válido.");
                emailInput.focus();
                return;
            }

            const inscricao = {
                nome: nomeInput.value,
                email: emailInput.value,
                dataInscricao: new Date().toISOString()
            };

            // Aguarda a gravação na IndexedDB
            await this.db.create(inscricao);
            
            alert(`Obrigado, ${inscricao.nome}! Inscrição confirmada.`);
            
            e.target.reset();
            
            // Atualiza a lista visualmente
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