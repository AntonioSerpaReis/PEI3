import { escapeHTML } from '../utils/security.js';

export class NewsService {
    constructor() {
        this.apiKey = import.meta.env.VITE_NEWS_API_KEY;
        this.container = document.getElementById('news-container');
        this.baseUrl = 'https://newsapi.org/v2/everything';
    }

    /**
     * Procura notícias baseadas em termos específicos
     * @param {string} query - O termo de pesquisa (ex: 'saúde Açores')
     * @param {number} pageSize - Quantidade de notícias a exibir
     */
    async render(query = 'saúde medicina', pageSize = 4) {

        try {
            const url = `${this.baseUrl}?q=${encodeURIComponent(query)}&language=pt&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${this.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === "ok" && data.articles.length > 0) {
                this._displayArticles(data.articles);
            } else {
                this.container.innerHTML = '<p>Sem notícias recentes de momento.</p>';
            }
        } catch (error) {
            this.container.innerHTML = '<p>Erro ao carregar o feed de notícias.</p>';
        }
    }

    _displayArticles(articles) {
        this.container.innerHTML = ''; // Limpa o loading

        articles.forEach(article => {
            const card = document.createElement('article');
            card.className = 'news__card';
            card.tabIndex = 0;

            const dateStr = new Date(article.publishedAt).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });
            
            const safeTitle = escapeHTML(article.title || 'notícia');
            const imageHtml = article.urlToImage 
                ? `<div class="news__image-wrapper">
                       <img src="${article.urlToImage}" alt="Imagem de notícias" class="news__image" loading="lazy" onerror="this.style.display='none'">
                   </div>`
                : '';

            card.innerHTML = `
                ${imageHtml}
                <div class="news__content-wrapper">
                    <div class="news__date">
                        <i class="fi fi-rr-calendar"></i> ${escapeHTML(dateStr)}
                    </div>
                    <div class="news__content">
                        <span class="news__tag news__tag--noticia">Notícia</span>
                        <h3 class="news__title">
                            ${safeTitle}
                        </h3>
                        <p class="news__excerpt">
                            ${escapeHTML(article.description || 'Clique no botão abaixo para ler os detalhes da notícia na íntegra.')}
                        </p>
                    </div>
                    <div style="margin-top: 24px;">
                        <a href="${escapeHTML(article.url)}" target="_blank" rel="noopener" class="btn btn--primary"
                           aria-label="Ler notícia: ${safeTitle}"
                           style="padding: 8px 16px; font-size: 0.8rem; border-radius: var(--radius-full);">
                            Ler Notícia &rarr;
                        </a>
                    </div>
                </div>
            `;
            this.container.appendChild(card);
        });
    }
}