# Landing Page - Centro Académico Clínico dos Açores (CACA)

## Identificação do Grupo
**Projeto de Equipa Intermédio 3 (PEI3) - Tecnologias Web 2025/2026 | Grupo 6**

* **Aluno 1:** António Rui Serpa Reis - 2022113330
* **Aluno 2:** Nelson Pacheco Ponte - 2024109237
* **Aluno 3:** Miguel Sousa Cordeiro - 20162547

---

## Novas Funcionalidades e Interatividade (Entrega 2)

Nesta terceira fase do projeto, integrámos JavaScript para adicionar gestão de eventos, IndexedDB e uso de APIs (OpenWeather) assim como um mapa interativo para demonstrar a localização de eventos. O código foi estruturado de forma modular e incluído em vários ficheiros externos (com a separação de ficheiros CSS e módulos JS documentados com JSDoc), garantindo a sua clareza, legibilidade e adoção de boas práticas de desenvolvimento.

### Gestão de Eventos
Adicionámos gestão de eventos.
* **Campos Múltiplos:** O formulário contém 5 campos distintos (Título, Data, Hora, Localização, Descrição).
* **Feedback ao Utilizador:** O sistema fornece feedback visual (através de validação visual nas bordas e alertas nativos) sobre o sucesso ou falha da submissão. A submissão simula o envio de dados e limpa os campos automaticamente após a confirmação.

### Gestão de IndexedDB
Integrámos gestão de subscrições à Newsletter e a eventos com a IndexedDB.

### Mapa Interativo
O mapa guarda a localização de múltiplos eventos distintos

### Uso de APIs
* **OpenWeather:** Fazemos uso da OpenWeatherAPI para fazer uma previsão metereológica na data, hora e localização escolhida pelo utilizador antes de submeter o evento

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
