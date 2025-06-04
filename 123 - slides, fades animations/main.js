document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('article-container');
    const loader = document.getElementById('loader');
    let isLoading = false;
    let articleCount = 0;

    const sampleContent = {
        title: "Lorem ipsum",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis praesentium saepe consequatur...",
        imageUrl: "https://tse2.mm.bing.net/th/id/OIP.NojPSyw_vE65GmpPmvBz5gHaFF?cb=iwc1&rs=1&pid=ImgDetMain"
    };

    const createArticle = (index) => {
        articleCount++;
        const article = document.createElement('article');
        article.dataset.index = articleCount;
        
        article.innerHTML = `
            <div class="content-bx">
                <h3>${sampleContent.title} ${articleCount}</h3>
                <p>${sampleContent.text}</p>
            </div>
            <div class="img-bx">
                <figure>
                    <img 
                            src="${sampleContent.imageUrl}" 
                            alt="${sampleContent.title} ${articleCount}" 
                            title="${sampleContent.title} ${articleCount}"
                            loading="lazy"> <!-- Lazy loading for images -->
                </figure>
            </div>
        `;

        if (articleCount % 2 === 0) {
            article.classList.add('alternate-layout');
        }

        return article;
    };

    const loadArticles = async (count = 4) => {
        if (isLoading) return;
        
        isLoading = true;
        loader.style.display = 'block';

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < count; i++) {
                const article = createArticle();
                fragment.appendChild(article);
                observer.observe(article);
            }
            container.appendChild(fragment);
        } catch (error) {
            console.error('Error loading articles:', error);
        } finally {
            loader.style.display = 'none';
            isLoading = false;
        }
    };

    const handleScroll = throttle(() => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.body.offsetHeight - 200;
        
        if (scrollPosition >= threshold && !isLoading) {
            loadArticles();
        }
    }, 200);

    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3  ,
        rootMargin: '0px'
    });

    loadArticles();

    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
});