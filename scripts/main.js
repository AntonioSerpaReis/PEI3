import { initAnimacao3D } from './logo-3d.js';
import { GraficoOportunidades } from './grafico.js';
import { initCarrossel } from './carrossel.js';
import { ValidacaoFormulario } from './formulario.js';
import { initMenuNav } from './menu-nav.js';
import { initSaberMais } from './saber-mais.js';
import { initScrollToTop } from './scroll-to-top.js';
import { EventsIndexedDB } from './eventsindexeddb.js';
import { GestaoDeEventos } from './eventos.js';
import { InscricaoIndexedDB } from './subscricaoindexeddb.js';
import { Inscricoes } from './subscricao.js';
/**
 * Conjunto de dados base para o gráfico de oportunidades.
 * @type {Array<Object>}
 */
const dadosOportunidades = [
    { ano: "2015", valor: 10 }, { ano: "2016", valor: 20 },
    { ano: "2017", valor: 35 }, { ano: "2018", valor: 50 },
    { ano: "2019", valor: 45 }, { ano: "2020", valor: 70 },
    { ano: "2021", valor: 85 }, { ano: "2022", valor: 90 },
    { ano: "2023", valor: 100 }
];


/**
 * Event Listener principal. Inicializa todos os módulos e scripts
 * assim que o DOM estiver completamente carregado.
 */
document.addEventListener('DOMContentLoaded', async () => {
    
    initAnimacao3D();
    initCarrossel();
    initMenuNav();
    initSaberMais();
    initScrollToTop();
    
    const meuGrafico = new GraficoOportunidades(dadosOportunidades);
    meuGrafico.analisarDados(); 
    meuGrafico.mostrarGrafico();

    const meuFormulario = new ValidacaoFormulario();
    meuFormulario.iniciar();

    window.addEventListener('resize', () => {
        meuGrafico.mostrarGrafico(); 
    });

    const dbInscricoes = new InscricaoIndexedDB();
    await dbInscricoes.init();
    new Inscricoes(dbInscricoes);

    const db = new EventsIndexedDB();
    await db.init();
    const gestor = new GestaoDeEventos(db);

    
    window.addEventListener('deleteEvent', async (e) => {
        if(confirm("Deseja remover este evento?")) {
            await db.delete(e.detail);
            gestor.renderEvents();
        }
    });
});
