import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { escapeHTML } from '../utils/security.js';

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

/**
 * Serviço responsável por desenhar o Mapa com a framework externa Leaflet.
 */
export class MapService {
    constructor(containerId) {
        this.map = L.map(containerId).setView([38.5, -28.0], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);
        this.markers = [];
    }

    /**
     * Limpa os marcadores existentes e injeta novamente os Eventos Ativos no Mapa.
     * @param {Array} events - Lista de eventos do sistema IndexedDB.
     */
    updateMarkers(events) {
        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];

        events.forEach(ev => {
            const pos = ACCORES_COORDS[ev.location];
            if (pos) {
                const marker = L.marker([pos.lat, pos.lng]).addTo(this.map);
                marker.bindPopup(`
                    <div class="map-popup-marker">
                        <h4 style="margin:0;">${escapeHTML(ev.title)}</h4>
                        <p style="margin:5px 0 0;">📅 ${escapeHTML(ev.date)} | 📍 ${escapeHTML(ev.location.split(',')[0])}</p>
                    </div>
                `);
                this.markers.push(marker);
            }
        });
    }
}
