import { initCarrossel } from './ui/carousel.js';
import { initMenuNav } from './ui/menu-nav.js';
import { initSaberMais } from './ui/saber-mais.js';
import { initScrollToTop } from './ui/scroll-to-top.js';

import { ChartController } from './controllers/ChartController.js';
import { FormController } from './controllers/FormController.js';

import { SubscriptionController } from './controllers/SubscriptionController.js';

import { initDB } from './db/database.js';
import { EventsRepository } from './db/EventsRepository.js';
import { SubscriptionRepository } from './db/SubscriptionRepository.js';
import { MapService } from './services/MapService.js';

import { NewsService } from './services/NewsService.js';
import { dadosOportunidades } from './data/config/chartData.js';

/**
 * Inicializador principal da aplicação.
 */
document.addEventListener('DOMContentLoaded', async () => {

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

        // Initialize map on homepage with event markers
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            const mapService = new MapService('map');
            const dbEventos = new EventsRepository(idb);
            const events = await dbEventos.getAll();
            mapService.updateMarkers(events);
        }

    } catch (e) {
        console.error("Failed to initialize database", e);
    }
});
