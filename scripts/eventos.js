import * as L from 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet-src.esm.js';

const ACCORES_COORDS = {
    "Flores,PT": { lat: 39.4539, lng: -31.1274 },
    "Corvo,PT": { lat: 39.6710, lng: -31.1120 },
    "Faial,PT": { lat: 38.5789, lng: -28.6946 },
    "Pico,PT": { lat: 38.4612, lng: -28.3267 },
    "Sao Jorge,PT": { lat: 38.6472, lng: -28.0167 },
    "Terceira,PT": { lat: 38.7173, lng: -27.2075 },
    "Graciosa,PT": { lat: 39.0526, lng: -27.9947 },
    "Ponta Delgada,PT": { lat: 37.7412, lng: -25.6756 },
    "Santa Maria,PT": { lat: 36.9748, lng: -25.0934 }
};

export class GestaoDeEventos {
    constructor(db) {
        this.db = db;
        this.apiKeyOpenWeather = "ff2ceadd73356260e5f8b9e1093ccc9b";
        this.map = null;
        this.markers = [];

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

        this.initLeaflet();
        this.init();
    }

    init() {
        const form = document.getElementById('event-form');
        const btnWeather = document.getElementById('check-weather');

        if (form) form.addEventListener('submit', (e) => this.saveEvent(e));
        if (btnWeather) btnWeather.addEventListener('click', () => this.getFutureWeather());
        
        this.render();
    }

    initLeaflet() {
        // Create the map centered on the Azores
        this.map = L.map('map').setView([38.5, -28.0], 7);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        this.updateMarkers();
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
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKeyOpenWeather}&units=metric&lang=pt`);
            const data = await response.json();

            if (data.cod !== "200") throw new Error();

            // Encontra a previsão mais próxima da hora escolhida
            const closestWeather = data.list.reduce((prev, curr) => {
                return Math.abs(curr.dt * 1000 - targetDateTime) < Math.abs(prev.dt * 1000 - targetDateTime) ? curr : prev;
            });

            display.style.display = 'block';
            display.innerHTML = `
                <div style="background: #e3f2fd; border-left: 5px solid #2196f3; padding: 10px; margin-top: 10px;">
                    <strong>Previsão para o evento:</strong> ${closestWeather.weather[0].description}, ${Math.round(closestWeather.main.temp)}°C.
                </div>
            `;
        } catch (error) {
            display.style.display = 'block';
            display.innerHTML = `<p style="color: red;">Previsão indisponível para esta data (limite de 5 dias).</p>`;
        }
    }

    async updateMarkers() {
        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];

        const events = await this.db.getAll();

        events.forEach(ev => {
            const pos = ACCORES_COORDS[ev.location];
            if (pos) {
                // Create Leaflet marker
                const marker = L.marker([pos.lat, pos.lng]).addTo(this.map);
                
                // Add Popup
                marker.bindPopup(`
                    <div style="color:#333; padding:5px;">
                        <h4 style="margin:0;">${ev.title}</h4>
                        <p style="margin:5px 0 0;">📅 ${ev.date} | 📍 ${ev.location.split(',')[0]}</p>
                    </div>
                `);

                this.markers.push(marker);
            }
        });
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
            // Se houver ID, estamos a editar
            eventData.id = Number(id);
            await this.db.update(eventData);
            document.getElementById('event-id').value = ""; // Limpa o ID
            document.getElementById('btn-save-event').innerText = "Guardar Evento";
        } else {
            // Se não houver ID, é um novo registo
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
                <div class="card-header"><h3 class="card-title">${ev.title}</h3></div>
                <p><strong>📅 ${ev.date} às ${ev.time}</strong></p>
                <p>📍 ${ev.location.split(',')[0]}</p>
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
        
        this.updateMarkers();
    }
}