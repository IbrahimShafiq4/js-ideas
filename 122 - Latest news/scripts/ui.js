
import { CONFIG } from './config.js';

export class NewsUI {
    constructor() {
        this.domElements = {
            newsContainer: document.querySelector('.news-container'),
            hamburgerMenu: document.querySelector('.hamburger-menu'),
            newsHeader: document.querySelector('.news-header'),
            newsArticles: document.querySelector('.news-articles'),
            aside: document.querySelector('aside'),
            categoriesList: document.querySelector('.categories-list .list-details'),
            languagesList: document.querySelector('.languages-list .list-details'),
            loadingAnimation: document.querySelector('.loading-animation')
        };
    }

    initEventListeners(onCategoryChange) {
        this.domElements.hamburgerMenu.addEventListener("click", this.handleHamburgerClicked.bind(this));

        this.setAsideCategories(onCategoryChange);
    }

    handleHamburgerClicked() {
        this.domElements.hamburgerMenu.classList.toggle('hamburger-menu--active');
        this.domElements.newsContainer.classList.toggle('news-container--active');
        this.domElements.aside.classList.toggle('menu--showed');
    }

    setAsideCategories(onClick) {
        this.domElements.categoriesList.innerHTML = '';

        CONFIG.CATEGORIES.forEach((category) => {
            const catElement = document.createElement('span');
            catElement.textContent = category;

            if (category === CONFIG.DEFAULT_SETTINGS.category) {
                catElement.classList.add('active--filtration');
            }

            catElement.addEventListener('click', () => {
                this.updateActiveFilter(this.domElements.categoriesList, catElement);
                onClick(category);
            });

            this.domElements.categoriesList.appendChild(catElement);
        });
    }

    updateActiveFilter(container, activeElement) {
        container.querySelectorAll('span').forEach(span => {
            span.classList.remove('active--filtration');
        });
        activeElement.classList.add('active--filtration');
    }

    async displayNews(articles) {
        this.showLoading();
        this.domElements.newsArticles.innerHTML = '';

        if (!articles || articles.length === 0) {
            this.domElements.newsArticles.innerHTML = '<p class="no-articles">No articles found</p>';
            this.hideLoading();
            return;
        }

        const articleElements = await Promise.all(
            articles.map(article => this.createArticleElement(article))
        );

        articleElements.forEach(element => {
            if (element) this.domElements.newsArticles.appendChild(element);
        });

        this.hideLoading();
    }

    async createArticleElement(article) {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article-div';

        const imageUrl = await this.handleImageLoading(article.urlToImage);

        articleDiv.innerHTML = `
            <figure>
                <img src="${imageUrl}" alt="${article.title || 'News image'}" loading="lazy">
            </figure>
            <div class="article-content">
                <h5>${article.author || 'Unknown author'}</h5>
                <p>${article.description || article.content || 'No description available for this article.'}</p>
                <div class="article-footer">
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read more</a>
                    <p>${article.source?.name || 'Unknown source'}</p>
                </div>
            </div>
        `;

        return articleDiv;
    }

    async handleImageLoading(imageUrl) {
        return new Promise((resolve) => {
            if (!imageUrl) {
                resolve(CONFIG.DEFAULT_IMAGE);
                return;
            }

            const img = new Image();
            img.src = imageUrl;

            img.onload = () => resolve(imageUrl);
            img.onerror = () => resolve(CONFIG.DEFAULT_IMAGE);
        });
    }

    updateHeader(text) {
        this.domElements.newsHeader.textContent = text;
    }

    showLoading() {
        this.domElements.loadingAnimation.classList.remove('hidden');
    }

    hideLoading() {
        this.domElements.loadingAnimation.classList.add('hidden');
    }

    showError(message) {
        this.domElements.newsArticles.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button class="retry-button">Retry</button>
            </div>
        `;
    }
}
