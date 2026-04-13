/**
 * Serviço responsável pela comunicação com a API do OpenWeatherMap.
 */
export class WeatherService {
    constructor() {
        this.apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    }

    /**
     * Obtém a previsão atmosférica aproximada para a hora e local desejados.
     * @param {string} city - Local (ex: "Ponta Delgada,PT").
     * @param {number} targetDateTime - Timestamp da data desejada.
     * @returns {Promise<Object>} Dados processados de previsão.
     */
    async getForecastForDateTime(city, targetDateTime) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric&lang=pt`);
        const data = await response.json();

        if (data.cod !== "200") throw new Error("Erro de comunicação com API.");

        return data.list.reduce((prev, curr) => {
            return Math.abs(curr.dt * 1000 - targetDateTime) < Math.abs(prev.dt * 1000 - targetDateTime) ? curr : prev;
        });
    }
}
