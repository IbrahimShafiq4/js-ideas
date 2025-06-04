
import { NewsAPI } from './api.js';
import { NewsUI } from './ui.js';

class NewsApp {
    constructor() {
        this.api = new NewsAPI();
        this.ui = new NewsUI();
        this.initialize();
    }

    async initialize() {
        this.ui.initEventListeners(
            (category) => this.handleCategoryChange(category)
        );

        try {
            await this.loadNews();
        } catch (error) {
            this.ui.showError('Failed to load news. Please try again later.');
            console.error('Initialization error:', error);
        }
    }

    async loadNews() {
        try {
            this.ui.showLoading();
            const data = await this.api.fetchNews();
            this.ui.displayNews(data.articles);

            const { category } = this.api.getCurrentSettings();
            this.ui.updateHeader(`News of ${category}`);
        } catch (error) {
            this.ui.showError('Failed to fetch news. Please try again.');
            throw error;
        }
    }

    async handleCategoryChange(category) {
        this.api.updateSettings({ category });
        await this.loadNews();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NewsApp();
});
