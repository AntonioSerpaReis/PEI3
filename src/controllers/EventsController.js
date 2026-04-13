import { escapeHTML } from '../utils/security.js';
import { WeatherService } from '../services/WeatherService.js';
import { MapService } from '../services/MapService.js';

/**
 * Classe principal encarregue de orquestrar a vista da Gestão de Eventos,
 * comunicando com o Model IndexedDB e acionando Serviços de Mapa e Clima.
 */
export class EventsController {
    constructor(db) {
        this.db = db;
        this.weatherService = new WeatherService();
        this.mapService = new MapService('map');

        window.deleteEvent = async (id) => {
            if (confirm("Eliminar este evento?")) {
                await this.db.delete(id);
                this.render();
            }
        };

        window.editEvent = async (id) => {
            const events = await this.db.getAll();
            const eventToEdit = events.find(ev => ev.id === id);
            if (eventToEdit) this.fillFormForEdit(eventToEdit);
        };

        this.init();
    }

    init() {
        const form = document.getElementById('event-form');
        const btnWeather = document.getElementById('check-weather');

        if (form) form.addEventListener('submit', (e) => this.saveEvent(e));
        if (btnWeather) btnWeather.addEventListener('click', () => this.getFutureWeather());

        this.render();
    }

    fillFormForEdit(event) {
        document.getElementById('event-id').value = event.id;
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-date').value = event.date;
        document.getElementById('event-time').value = event.time;
        document.getElementById('event-location').value = event.location;
        document.getElementById('event-description').value = event.description;

        document.getElementById('btn-save-event').innerText = "Atualizar Evento";

        document.getElementById('event-form').scrollIntoView({ behavior: 'smooth' });
    }

    async getFutureWeather() {
        const city = document.getElementById('event-location').value;
        const dateStr = document.getElementById('event-date').value;
        const timeStr = document.getElementById('event-time').value;
        const display = document.getElementById('weather-display');

        if (!city || !dateStr || !timeStr) {
            alert("Preencha Local, Data e Hora para ver a previsão.");
            return;
        }

        const targetDateTime = new Date(`${dateStr}T${timeStr}`).getTime();

        try {
            const closestWeather = await this.weatherService.getForecastForDateTime(city, targetDateTime);

            display.style.display = 'block';
            display.className = 'weather-info-box weather-success-box';
            display.innerHTML = `
                <div>
                    <strong>Previsão para o evento:</strong> ${escapeHTML(closestWeather.weather[0].description)}, ${Math.round(closestWeather.main.temp)}°C.
                </div>
            `;
        } catch (error) {
            display.style.display = 'block';
            display.className = 'weather-info-box weather-error-box';
            display.innerHTML = `<p>Previsão indisponível para esta data (limite de 5 dias).</p>`;
        }
    }

    async updateMarkers(events) {
        this.mapService.updateMarkers(events);
    }

    async saveEvent(e) {
        e.preventDefault();

        const id = document.getElementById('event-id').value;
        const eventData = {
            title: document.getElementById('event-title').value,
            date: document.getElementById('event-date').value,
            time: document.getElementById('event-time').value,
            location: document.getElementById('event-location').value,
            description: document.getElementById('event-description').value
        };

        if (id) {
            eventData.id = Number(id);
            await this.db.update(eventData);
            document.getElementById('event-id').value = "";
            document.getElementById('btn-save-event').innerText = "Guardar Evento";
        } else {
            await this.db.create(eventData);
        }

        e.target.reset();
        this.render();
    }

    async render() {
        const list = document.getElementById('events-list');
        const events = await this.db.getAll();

        list.innerHTML = events.map(ev => `
            <article class="research-card card-blue">
                <div class="card-header"><h3 class="card-title">${escapeHTML(ev.title)}</h3></div>
                <p><strong>📅 ${escapeHTML(ev.date)} às ${escapeHTML(ev.time)}</strong></p>
                <p>📍 ${escapeHTML(ev.location.split(',')[0])}</p>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button onclick="window.editEvent(${ev.id})" class="btn-edit">
                        Editar
                    </button>
                    <button onclick="window.deleteEvent(${ev.id})" class="btn-delete">
                        Eliminar
                    </button>
                </div>
            </article>
        `).join('');

        this.updateMarkers(events);
    }
}