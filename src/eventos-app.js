import { initMenuNav } from './ui/menu-nav.js';
import { initScrollToTop } from './ui/scroll-to-top.js';

import { EventsController } from './controllers/EventsController.js';

import { initDB } from './db/database.js';
import { EventsRepository } from './db/EventsRepository.js';

/**
 * Inicializador da página de Eventos.
 */
document.addEventListener('DOMContentLoaded', async () => {

    initMenuNav();
    initScrollToTop();

    try {
        const idb = await initDB();

        const dbEventos = new EventsRepository(idb);
        const gestor = new EventsController(dbEventos);
    } catch (e) {
        console.error("Failed to initialize database", e);
    }
});
