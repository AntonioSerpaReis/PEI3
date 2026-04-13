import { initAnimacao3D } from './ui/logo-3d.js';
import { initCarrossel } from './ui/carousel.js';
import { initMenuNav } from './ui/menu-nav.js';
import { initSaberMais } from './ui/saber-mais.js';
import { initScrollToTop } from './ui/scroll-to-top.js';

import { ChartController } from './controllers/ChartController.js';
import { FormController } from './controllers/FormController.js';
import { EventsController } from './controllers/EventsController.js';
import { SubscriptionController } from './controllers/SubscriptionController.js';

import { initDB } from './db/database.js';
import { EventsRepository } from './db/EventsRepository.js';
import { SubscriptionRepository } from './db/SubscriptionRepository.js';

import { NewsService } from './services/NewsService.js';
import { dadosOportunidades } from './data/config/chartData.js';

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

    const feed = new NewsService();
    feed.render();

    const meuGrafico = new ChartController(dadosOportunidades);
    meuGrafico.analisarDados();
    meuGrafico.mostrarGrafico();

    const meuFormulario = new FormController();
    meuFormulario.iniciar();

    window.addEventListener('resize', () => {
        meuGrafico.mostrarGrafico();
    });

    try {
        const idb = await initDB();

        const dbInscricoes = new SubscriptionRepository(idb);
        new SubscriptionController(dbInscricoes);

        const dbEventos = new EventsRepository(idb);
        const gestor = new EventsController(dbEventos);

        window.addEventListener('deleteEvent', async (e) => {
            if (confirm("Deseja remover este evento?")) {
                await dbEventos.delete(e.detail);
                gestor.renderEvents();
            }
        });
    } catch (e) {
        console.error("Failed to initialize database", e);
    }
});
