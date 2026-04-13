export class SubscriptionController {
    constructor(db) {
        this.db = db;
        this.init();
    }

    async init() {
        const form = document.getElementById('newsletter-form');

        if (form) {
            form.addEventListener('submit', (e) => this.handleRegistration(e));
        }
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
            const nomeInput = document.getElementById('news-name');
            const emailInput = document.getElementById('news-email');

            if (!nomeInput || !emailInput) {
                console.error("Erro: Alguns campos do formulário não foram encontrados no DOM.");
                return;
            }

            if (!this.validarNome(nomeInput.value)) {
                alert("Por favor, insira um nome válido (mínimo 3 caracteres, apenas letras).");
                nomeInput.focus();
                return;
            }

            if (!this.validarEmail(emailInput.value)) {
                alert("Por favor, insira um endereço de e-mail válido.");
                emailInput.focus();
                return;
            }

            const inscricao = {
                nome: nomeInput.value,
                email: emailInput.value,
                dataInscricao: new Date().toISOString()
            };

            await this.db.create(inscricao);

            alert(`Obrigado, ${inscricao.nome}! Inscrição confirmada.`);

            e.target.reset();

        } catch (error) {
            console.error("Erro ao processar inscrição:", error);
            alert("Ocorreu um erro ao guardar a sua inscrição.");
        }
    }
}