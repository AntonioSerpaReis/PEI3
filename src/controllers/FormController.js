/**
 * Gestão, validação e submissão do formulário de contacto.
 */
export class FormController {
    constructor() {
        this.form = document.querySelector('.c-form');
        this.firstNameEl = document.getElementById('first-name');
        this.lastNameEl = document.getElementById('last-name');
        this.emailEl = document.getElementById('email');
        this.phoneEl = document.getElementById('phone');
        this.messageEl = document.getElementById('message');
        this.charCountEl = document.querySelector('.c-form__char-count');
        this.submitBtn = document.querySelector('.c-form__submit');

        this.campos = [this.firstNameEl, this.lastNameEl, this.emailEl, this.phoneEl, this.messageEl].filter(Boolean);
        this.touched = new Set();
    }

    iniciar() {
        if (!this.form) return;

        this.campos.forEach(campo => {
            campo.addEventListener('input', () => {
                if (this.touched.has(campo.id)) {
                    this.validarCampoVisual(campo);
                }
            });

            campo.addEventListener('blur', () => {
                this.touched.add(campo.id);
                this.validarCampoVisual(campo);
            });
        });

        if (this.messageEl && this.charCountEl) {
            this.messageEl.addEventListener('input', () => {
                const len = this.messageEl.value.length;
                const max = this.messageEl.maxLength || 120;
                this.charCountEl.textContent = `${len}/${max}`;
            });
        }

        this.form.addEventListener('submit', (e) => this.validarSubmissao(e));
    }

    obterValidacao(elemento) {
        const valor = elemento.value.trim();

        if (valor === "") {
            return { valido: false, mensagem: "Este campo é obrigatório." };
        }

        if (elemento.id === 'first-name' || elemento.id === 'last-name') {
            if (valor.length < 2) return { valido: false, mensagem: "Mínimo de 2 caracteres." };
            if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(valor)) return { valido: false, mensagem: "Utilize apenas letras." };
            return { valido: true, mensagem: "" };
        }

        if (elemento.id === 'email') {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(valor)) return { valido: false, mensagem: "Endereço de e-mail inválido." };
            return { valido: true, mensagem: "" };
        }

        if (elemento.id === 'phone') {
            const indicativo = document.getElementById('country-code')?.value || '+351';
            if (!/^\d+$/.test(valor)) return { valido: false, mensagem: "Utilize apenas dígitos." };

            if (indicativo === '+351') {
                if (!valor.startsWith('9') || valor.length !== 9) {
                    return { valido: false, mensagem: "Nº português: 9 dígitos, começa por 9." };
                }
            } else {
                if (valor.length < 8 || valor.length > 15) {
                    return { valido: false, mensagem: "O número deve ter entre 8 e 15 dígitos." };
                }
            }
            return { valido: true, mensagem: "" };
        }

        if (elemento.id === 'message') {
            if (valor.length < 10) return { valido: false, mensagem: "A mensagem deve ter pelo menos 10 caracteres." };
            return { valido: true, mensagem: "" };
        }

        return { valido: elemento.checkValidity(), mensagem: "" };
    }

    obterWrapper(elemento) {
        if (elemento.id === 'phone') {
            return elemento.closest('.c-form__phone-row') || elemento.closest('.c-form__group');
        }
        if (elemento.id === 'message') {
            return elemento.closest('.c-form__textarea-wrap') || elemento.closest('.c-form__group');
        }
        return elemento.closest('.c-form__input-wrap') || elemento.closest('.c-form__group');
    }

    definirMensagemErro(elemento, mensagem) {
        const grupo = elemento.closest('.c-form__group');
        if (!grupo) return;

        let errorEl = grupo.querySelector('.c-form__error-msg');

        if (mensagem) {
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'c-form__error-msg';
                errorEl.setAttribute('role', 'alert');
                errorEl.setAttribute('aria-live', 'polite');
                grupo.appendChild(errorEl);
            }
            errorEl.textContent = mensagem;
        } else {
            if (errorEl) errorEl.remove();
        }
    }

    validarCampoVisual(elemento) {
        const { valido, mensagem } = this.obterValidacao(elemento);
        const wrapper = this.obterWrapper(elemento);
        const grupo = elemento.closest('.c-form__group');

        if (!wrapper || !grupo) return valido;

        wrapper.classList.remove('c-form__input-wrap--valid', 'c-form__input-wrap--invalid');
        grupo.classList.remove('c-form__group--valid', 'c-form__group--invalid');

        if (elemento.value.trim() === '' && !this.touched.has(elemento.id)) {
            this.definirMensagemErro(elemento, '');
            return valido;
        }

        if (valido) {
            wrapper.classList.add('c-form__input-wrap--valid');
            grupo.classList.add('c-form__group--valid');
            this.definirMensagemErro(elemento, '');
        } else {
            wrapper.classList.add('c-form__input-wrap--invalid');
            grupo.classList.add('c-form__group--invalid');
            this.definirMensagemErro(elemento, mensagem);
        }

        return valido;
    }

    mostrarBannerFeedback(tipo, mensagem) {
        const bannerAnterior = this.form.querySelector('.c-form__feedback-banner');
        if (bannerAnterior) bannerAnterior.remove();

        const banner = document.createElement('div');
        banner.className = `c-form__feedback-banner c-form__feedback-banner--${tipo}`;
        banner.setAttribute('role', 'status');
        banner.setAttribute('aria-live', 'polite');

        const icon = tipo === 'success' ? '✓' : '✕';
        banner.innerHTML = `<span class="c-form__feedback-icon">${icon}</span> ${mensagem}`;

        this.submitBtn.insertAdjacentElement('afterend', banner);

        requestAnimationFrame(() => banner.classList.add('c-form__feedback-banner--visible'));

        if (tipo === 'success') {
            setTimeout(() => {
                banner.classList.remove('c-form__feedback-banner--visible');
                setTimeout(() => banner.remove(), 300);
            }, 5000);
        }
    }

    validarSubmissao(e) {
        e.preventDefault();

        this.campos.forEach(campo => this.touched.add(campo.id));

        let primeiroInvalido = null;
        let todosValidos = true;

        this.campos.forEach(campo => {
            const valido = this.validarCampoVisual(campo);
            if (!valido && !primeiroInvalido) {
                primeiroInvalido = campo;
                todosValidos = false;
            } else if (!valido) {
                todosValidos = false;
            }
        });

        if (!todosValidos) {
            if (primeiroInvalido) {
                primeiroInvalido.focus();
                primeiroInvalido.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            this.mostrarBannerFeedback('error', 'Por favor, corrija os campos assinalados.');
            return;
        }

        this.mostrarBannerFeedback('success', 'Mensagem enviada com sucesso!');
        this.form.reset();
        if (this.charCountEl) this.charCountEl.textContent = '0/120';

        this.touched.clear();
        this.campos.forEach(campo => {
            const wrapper = this.obterWrapper(campo);
            const grupo = campo.closest('.c-form__group');
            if (wrapper) wrapper.classList.remove('c-form__input-wrap--valid', 'c-form__input-wrap--invalid');
            if (grupo) {
                grupo.classList.remove('c-form__group--valid', 'c-form__group--invalid');
                const errorEl = grupo.querySelector('.c-form__error-msg');
                if (errorEl) errorEl.remove();
            }
        });
    }
}
