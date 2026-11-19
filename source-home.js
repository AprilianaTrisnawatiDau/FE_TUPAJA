document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. SISTEM KERANJANG (LOCAL STORAGE)
    // ==========================================
    let cart = JSON.parse(localStorage.getItem('warungTupaja_cart')) || [];
    
    const updateCartBadge = () => {
        const badges = document.querySelectorAll('.cart-badge');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        badges.forEach(badge => {
            if (totalItems > 0) {
                badge.innerText = totalItems;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
    };
    updateCartBadge();

    const addButtons = document.querySelectorAll('.btn-add');
    addButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const card = this.closest('.menu-card-grid') || this.closest('.menu-card-hz');
            const name = card.querySelector('h4').innerText;
            const priceText = card.querySelector('.price').innerText;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            const image = card.querySelector('img').src; 
            
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++; 
            } else {
                cart.push({ name, price, quantity: 1, image: image }); 
            }

            localStorage.setItem('warungTupaja_cart', JSON.stringify(cart));
            updateCartBadge();
        });
    });

    // ==========================================
    // 2. LOGIKA FILTER KATEGORI
    // ==========================================
    const categoryCards = document.querySelectorAll('.horizontal-menu .menu-card-hz[data-kategori]');
    const menuGrids = document.querySelectorAll('.grid-menu');

    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const targetId = 'kategori-' + this.getAttribute('data-kategori');
            menuGrids.forEach(grid => grid.classList.add('hidden'));

            const targetGrid = document.getElementById(targetId);
            if (targetGrid) {
                targetGrid.classList.remove('hidden');
            }
        });
    });

    // ==========================================
    // 3. FITUR PENCARIAN (SEARCH BAR)
    // ==========================================
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const keyword = this.value.toLowerCase().trim();
            const allMenuCards = document.querySelectorAll('.menu-card-grid, .menu-card-hz');
            
            if (keyword === '') {
                const activeCategory = document.querySelector('.category-menu-container .menu-card-hz.active');
                menuGrids.forEach(grid => grid.classList.add('hidden'));
                if (activeCategory) {
                    const targetId = 'kategori-' + activeCategory.getAttribute('data-kategori');
                    document.getElementById(targetId).classList.remove('hidden');
                }
                allMenuCards.forEach(card => card.style.display = '');
                return;
            }

            menuGrids.forEach(grid => grid.classList.add('hidden'));

            allMenuCards.forEach(card => {
                const title = card.querySelector('h4').innerText.toLowerCase();
                
                if (title.includes(keyword)) {
                    card.style.display = '';
                    const parentGrid = card.closest('.grid-menu');
                    if (parentGrid) {
                        parentGrid.classList.remove('hidden');
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

});