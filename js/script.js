// js/script.js

/**
 * Carrega um componente HTML de um arquivo e o insere em um placeholder.
 */
async function loadComponent(componentPath, placeholderId) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            console.error(`Erro ao carregar componente: ${componentPath}, Status: ${response.status}`);
            throw new Error(`Erro ao carregar componente: ${componentPath}, Status: ${response.status}`);
        }
        const html = await response.text();
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = html;
        } else {
            // console.warn(`Placeholder com ID '${placeholderId}' não encontrado na página: ${window.location.pathname}`); // Exemplo de log que pode ser mantido se desejado para desenvolvimento
        }
    } catch (error) {
        console.error(`Falha ao carregar componente HTML '${componentPath}':`, error);
    }
}

/**
 * Define o link de navegação ativo baseado na URL da página atual.
 */
function setActiveNavLink() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return;

    const navLinks = navPlaceholder.querySelectorAll('.nav-link'); 
    if (navLinks.length === 0) return; 

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

/**
 * Ajusta o padding do topo do elemento <main> e a posição do <nav>
 */
function adjustMainPadding() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!headerPlaceholder || !navPlaceholder) return;

    const headerElement = headerPlaceholder.querySelector('header');
    const navElement = navPlaceholder.querySelector('nav');
    const mainElement = document.querySelector('main');

    if (headerElement && navElement && mainElement) {
        const headerHeight = headerElement.offsetHeight;
        const navHeight = navElement.offsetHeight;
        
        navElement.style.top = `${headerHeight}px`;
        mainElement.style.paddingTop = `${headerHeight + navHeight}px`;
    }
}

/**
 * Configura o menu hambúrguer para dispositivos móveis.
 */
function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation(); 
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') ?
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    } else {
        // Este console.error pode ser útil manter, ou remover se tiver certeza que nav.html sempre carregará
        console.error("ERRO: Botão #menu-toggle ou lista #nav-menu NÃO foram encontrados. Verifique o carregamento de nav.html.");
    }
}

/**
 * Atualiza o tema (claro/escuro) baseado no horário do dia.
 */
function updateTheme() {
    const hour = new Date().getHours();
    const body = document.body;
    const htmlElement = document.documentElement;

    if (hour >= 18 || hour < 6) {
        body.classList.add('dark');
        htmlElement.classList.add('dark');
    } else {
        body.classList.remove('dark');
        htmlElement.classList.remove('dark');
    }
}

/**
 * Atualiza o ano no elemento com ID 'currentYear'.
 */
function updateCurrentYear() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;
    const yearElement = footerPlaceholder.querySelector('#currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Abre o link do WhatsApp com uma mensagem personalizada.
 */
function sendWhatsApp(productOrContext = "") {
    const phoneNumber = "551231331600"; 
    let message = "Olá! Gostaria de mais informações.";
    if (productOrContext) {
        message = ` ${productOrContext}.`;
    }
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}
window.sendWhatsApp = sendWhatsApp;

/**
 * Inicializa o carrossel de imagens.
 */
function initCarousel() {
    let currentSlideIndex = 0;
    const carouselItems = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.carousel-indicator');
    let carouselInterval;

    if (carouselItems.length === 0) return;

    function showCarouselSlide(index) {
        carouselItems.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        currentSlideIndex = (index + carouselItems.length) % carouselItems.length;
        if (carouselItems[currentSlideIndex]) carouselItems[currentSlideIndex].classList.add('active');
        if (indicators[currentSlideIndex]) indicators[currentSlideIndex].classList.add('active');
    }

    window.changeSlide = function(direction) {
        showCarouselSlide(currentSlideIndex + direction);
        resetCarouselInterval();
    }
    window.showSlide = function(index) {
        showCarouselSlide(index);
        resetCarouselInterval();
    }

    function startCarouselAuto() {
        clearInterval(carouselInterval);
        carouselInterval = setInterval(() => {
            showCarouselSlide(currentSlideIndex + 1);
        }, 5000);
    }
    
    function resetCarouselInterval() {
        clearInterval(carouselInterval);
        startCarouselAuto();
    }

    const carouselContainer = document.querySelector('.carousel');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselInterval));
        carouselContainer.addEventListener('mouseleave', startCarouselAuto);
        document.querySelectorAll('[onclick*="changeSlide"], [onclick*="showSlide"]').forEach(el => {
            el.addEventListener('mouseenter', () => clearInterval(carouselInterval));
            el.addEventListener('mouseleave', startCarouselAuto);
        });
    }
    
    if (carouselItems.length > 0) {
        showCarouselSlide(0);
        startCarouselAuto();
    }
}

/**
 * Configura o filtro de produtos na página de produtos (versão refinada).
 */
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card[class*="category-"]');

    if (filterButtons.length === 0 || productCards.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            filterButtons.forEach(b => b.classList.remove('active-filter'));
            btn.classList.add('active-filter');
            productCards.forEach(card => {
                card.style.display = (category === 'all' || card.classList.contains(`category-${category}`)) ? 'block' : 'none';
            });
        });
    });
    
    const initialFilter = document.querySelector('.filter-btn[data-category="all"]');
    if (initialFilter) {
        initialFilter.click();
    }
}

/**
 * Função principal de inicialização de scripts específicos da página.
 */
function initializePageSpecificScripts() {
    setupMobileMenu();
    setActiveNavLink();
    adjustMainPadding();
    updateCurrentYear();

    if (document.querySelector('.carousel')) {
        initCarousel();
    }
    if (document.querySelector('.filter-btn')) {
        setupProductFilters();
    }
    
    window.addEventListener('resize', adjustMainPadding);
}

// --- Ponto de Entrada Principal do Script ---
document.addEventListener('DOMContentLoaded', async () => {
    updateTheme();
    setInterval(updateTheme, 60000);

    try {
        await Promise.all([
            loadComponent('templates/header.html', 'header-placeholder'),
            loadComponent('templates/nav.html', 'nav-placeholder'),
            loadComponent('templates/footer.html', 'footer-placeholder')
        ]);
    } catch (error) {
        console.error("ERRO CRÍTICO ao carregar componentes principais durante DOMContentLoaded:", error);
    }
    
    initializePageSpecificScripts();
});