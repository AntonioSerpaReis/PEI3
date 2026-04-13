# Landing Page - Centro Académico Clínico dos Açores (CACA)

## Identificação do Grupo
**Projeto de Equipa Intermédio 3 (PEI3) - Tecnologias Web 2025/2026 | Grupo 6**

* **Aluno 1:** António Rui Serpa Reis - 2022113330
* **Aluno 2:** Nelson Pacheco Ponte - 2024109237
* **Aluno 3:** Miguel Sousa Cordeiro - 20162547

---

## Novas Funcionalidades e Interatividade (Entrega 2)

Nesta terceira fase do projeto, integrámos JavaScript para adicionar gestão de eventos, IndexedDB e uso de APIs (OpenWeather) assim como um mapa interativo para demonstrar a localização de eventos. O código foi totalmente refatorizado para uma arquitetura profissional sob a pasta `src/`, utilizando padrões modernos como Repositories e Controllers. A separação lógica garante clareza, modularidade e segue rigorosamente os princípios de Clean Code (SOLID).

### Gestão de Eventos
Adicionámos gestão de eventos.
* **Campos Múltiplos:** O formulário contém 5 campos distintos (Título, Data, Hora, Localização, Descrição).
* **Feedback ao Utilizador:** O sistema fornece feedback visual (através de validação visual nas bordas e alertas nativos) sobre o sucesso ou falha da submissão. A submissão simula o envio de dados e limpa os campos automaticamente após a confirmação.

### Gestão de IndexedDB
Integrámos gestão de subscrições à Newsletter e a eventos com a IndexedDB.
*   **Arquitetura Base de Dados:** O sistema utiliza uma única base de dados denominada `CACA_DB` na versão `1`.
*   **Object Stores:** Estão divididas em duas stores:
    *   `eventos`: Armazena os objetos dos eventos contendo `id` (chave primária auto-incrementada), `title`, `date`, `time`, `location`, e `description`.
    *   `inscricoes`: Armazena as subscrições da newsletter contendo `id`, `nome`, `email`, e `dataInscricao`.

### Mapa Interativo
O mapa guarda a localização de múltiplos eventos distintos

### Uso e Integração de APIs Web
Para tornar a landing page dinâmica e rica em dados, integramos 3 serviços externos:
* **OpenWeatherMap:** Consome o endpoint `/2.5/forecast` para apresentar a previsão meteorológica de 5 dias. O utilizador indica a localização e a data/hora para o evento, e a aplicação simula o clima nesse momento esperado.
* **NewsAPI:** Utiliza o endpoint `/v2/everything` via servidor remoto para puxar artigos de "saúde/medicina", preenchendo a secção de feed noticioso de forma assíncrona.
* **Leaflet & OpenStreetMap:** Usamos a biblioteca de visualização Leaflet acopolada com os dados geográficos open-source do OpenStreetMap para desenhar dinamicamente os pingos (markers) baseando-nos nos registos lidos do IndexedDB.

### Segurança e Decisões de Arquitetura
Como parte do aprofundamento das competências em desenvolvimento web, foram aplicadas camadas de proteção cruciais de segurança front-end:
* **Proteção XSS (`escapeHTML`):** Para proteger o sistema de injeções maliciosas via inputs nos formulários ou dados providenciados por APIs de terceiros, toda a informação exportada para o DOM recorre à função sanitizadora implementada em `src/utils/security.js`.
* **Content-Security-Policy (CSP):** Incluímos uma metatag em `index.html` limitando a leitura e a submissão a determinados domínios oficiais estipulados, o que nega ativamente ataques man-in-the-middle e remote execution.
* **Obfuscação de API Keys:** Adotamos o bundler Node.js **Vite** para construir a aplicação localmente de modo a assegurar que as chaves de API secretas residem exclusivamente no ficheiro de ambiente estrito (`.env`) e providenciadas ao cliente mascaradas pela engine (em `import.meta.env.*`).
* **Arquitetura de Software Profissional:** 
    *   **Controllers (`src/controllers/`):** Gerem a orquestração entre a UI e a lógica de negócio.
    *   **Repositories (`src/db/`):** Camada de abstração para acesso à IndexedDB, isolando as queries da lógica da aplicação.
    *   **Services (`src/services/`):** Módulos dedicados à comunicação com APIs externas.
    *   **Singleton IndexedDB (`src/db/database.js`):** Inicialização centralizada da base de dados.

---

## Executar a Aplicação Localmente

Como a aplicação implementa proteção local com variáveis de ambiente (ficheiro `.env`), foi adotado o **Node.js** com a ferramenta de bundling **Vite** para construir o frontend. As chaves das APIs são assim servidas do backend em desenvolvimento e não do frontend solto.

**Para visualizar o projeto corretamente:**
1. Deverá ter o **Node.js** instalado na sua máquina.
2. Certifique-se que possui o ficheiro `.env` na raiz do projeto (como enviado), ou crie-o usando o `.env.example` caso se aplique.
3. Abra a linha de comandos na raiz do projeto (onde se encontra o `package.json`) e corra `npm install` para instalar as dependências de desenvolvimento.
4. Para iniciar o servidor local carregue o comando `npm run dev`.
5. Abra o browser no link indicado pelo Vite (normalmente `http://localhost:5173`).

---

## Identidade Visual e Layout (Entrega 1)
A identidade visual do **CACA** foi concebida para transmitir profissionalismo académico e confiança na área da saúde, integrando elementos regionais dos Açores.

### Paleta de Cores
* **Azul primário (#1976D2 / #003882):** Representa confiança, saúde e o oceano Atlântico que rodeia as ilhas.
* **Verde secundário (#43A047 / #FFD100):** Simboliza a area da saúde.
* **Cores de destaque (laranja, roxo, vermelho):** Utilizadas para diferenciar áreas de investigação.

### Tipografia
* **Display:** Playfair Display (usada em títulos institucionais).
* **Corpo:** Source Sans 3 (otimizada para leitura de conteúdo).

### Acessibilidade e Responsividade (WCAG)
* **Contraste de cores:** Testado para garantir ratio mínimo 4.5:1 (texto normal) e 3:1 (texto grande).
* **Responsividade (Mobile-first):** Layout adaptável com `CSS Grid` e `Flexbox`. Breakpoints definidos em 480px, 768px e 1024px.
* **Hierarquia semântica:** Uso rigoroso de tags HTML5 apropriadas (header, nav, section, article, footer).
* **Atributos alt:** Incluídos em todas as imagens relevantes.

---
*Este projeto foi desenvolvido para a disciplina de Tecnologias Web 2025/2026.*
