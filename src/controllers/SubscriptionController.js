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

    async handleRegistration(e) {
        e.preventDefault();

        try {
            const emailInput = document.getElementById('news-email');
            const feedback = document.getElementById('newsletter-feedback');

            if (!emailInput) {
                console.error("Erro: Campo de email não encontrado no DOM.");
                return;
            }

            if (!this.validarEmail(emailInput.value)) {
                if (feedback) {
                    feedback.textContent = "Por favor, insira um endereço de e-mail válido.";
                    feedback.className = "newsletter-new-disclaimer error";
                } else {
                    alert("Por favor, insira um endereço de e-mail válido.");
                }
                emailInput.focus();
                return;
            }

            const inscricao = {
                nome: 'Subscritor',
                email: emailInput.value,
                dataInscricao: new Date().toISOString()
            };

            await this.db.create(inscricao);

            if (feedback) {
                feedback.textContent = "Inscrição confirmada com sucesso! ✓";
                feedback.className = "newsletter-new-disclaimer success";
            } else {
                alert(`Obrigado! Inscrição confirmada.`);
            }

            e.target.reset();

        } catch (error) {
            console.error("Erro ao processar inscrição:", error);
            const feedback = document.getElementById('newsletter-feedback');
            if (feedback) {
                feedback.textContent = "Ocorreu um erro. Tente novamente.";
                feedback.className = "newsletter-new-disclaimer error";
            } else {
                alert("Ocorreu um erro ao guardar a sua inscrição.");
            }
        }
    }
}