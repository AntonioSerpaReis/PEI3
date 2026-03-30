export class FeedNoticias {
    constructor() {
        this.apiKey = 'dc8ad4bc280b4eb885f483876909e95a';
        this.container = document.getElementById('news-container');
        this.baseUrl = 'https://newsapi.org/v2/everything';
    }

    /**
     * Procura notícias baseadas em termos específicos
     * @param {string} query - O termo de pesquisa (ex: 'saúde Açores')
     * @param {number} pageSize - Quantidade de notícias a exibir
     */
    async render(query = 'saúde medicina', pageSize = 3) {

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
            console.error("Erro na News API:", error);
            this.container.innerHTML = '<p>Erro ao carregar o feed de notícias.</p>';
        }
    }

    _displayArticles(articles) {
        this.container.innerHTML = ''; // Limpa o loading

        articles.forEach(article => {
            const card = document.createElement('article');
            // Reutilizando as classes do teu CSS atual para consistência visual
            card.className = 'research-card card-blue'; 
            card.style.display = 'flex';
            card.style.flexDirection = 'column';

            card.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title" style="font-size: 1.1rem; line-height: 1.3;">
                        ${article.title}
                    </h3>
                </div>
                <p class="card-description" style="flex-grow: 1;">
                    ${article.description || 'Clique para ler os detalhes desta atualização de saúde.'}
                </p>
                <div style="margin-top: 15px;">
                    <a href="${article.url}" target="_blank" rel="noopener" class="btn" style="font-size: 0.8rem; padding: 8px 15px;">
                        Ler Artigo Completo
                    </a>
                </div>
            `;
            this.container.appendChild(card);
        });
    }
}