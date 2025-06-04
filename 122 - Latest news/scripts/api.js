
import { CONFIG } from './config.js';

export class NewsAPI {
    constructor() {
        this.settings = { ...CONFIG.DEFAULT_SETTINGS };
    }

    async fetchNews() {
        try {
            const url = this.buildURL();
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching news:", error);
            throw error;
        }
    }

    buildURL() {
        const { country, category } = this.settings;
        return `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${CONFIG.API_KEY}&pageSize=${CONFIG.PAGE_SIZE}`;
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }

    getCurrentSettings() {
        return { ...this.settings };
    }
}
