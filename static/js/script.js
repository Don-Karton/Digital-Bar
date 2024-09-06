document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('product-modal');
    const span = document.getElementsByClassName('close')[0];

    function showProductDetails(product) {
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalWeight = document.getElementById('modal-weight');
        const modalPrice = document.getElementById('modal-price');
        const addToCartBtn = document.getElementById('add-to-cart-modal-btn');

        if (modalImage && modalTitle && modalDescription && modalWeight && modalPrice && addToCartBtn) {
            modalImage.src = `/static/images/${product.image}`;
            modalTitle.textContent = product.name;
            modalDescription.textContent = product.description;
            modalWeight.textContent = `Weight: ${product.weight}`;
            modalPrice.textContent = `Price: ${product.price} ₽`;

            addToCartBtn.onclick = () => addToCart(product.id);
            modal.style.display = 'block';
        }
    }

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('pointerdown', function (event) {
            this.setPointerCapture(event.pointerId);  // Захват указателя
            const productId = this.dataset.productId;
            fetch(`/product/${productId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.product) {
                        showProductDetails(data.product);
                    }
                });
        });
    });

    if (span) {
        span.onclick = function () {
            modal.style.display = 'none';
        };
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});

function addToCart(item_id) {
    fetch('/add_to_cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_id: item_id })
    })
    .then(response => response.json())
    .then(data => {
        showToast("Товар добавлен в корзину");
        updateCartCount();
    });
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (toast) {
        toast.textContent = message;
        toast.className = "show";
        setTimeout(() => {
            toast.className = toast.className.replace("show", "");
        }, 3000);
    }
}

function updateCartCount() {
    fetch('/cart_count')
    .then(response => response.json())
    .then(data => {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = data.count;
        }
    });
}

function increaseQuantity(item_id) {
    fetch('/add_to_cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_id: item_id })
    })
    .then(response => response.json())
    .then(data => {
        updateCartCount();
        location.reload();
    });
}

function decreaseQuantity(item_id) {
    fetch('/remove_from_cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_id: item_id, decrease_only: true })
    })
    .then(response => response.json())
    .then(data => {
        updateCartCount();
        location.reload();
    });
}

function removeFromCart(item_id) {
    fetch('/remove_from_cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_id: item_id })
    })
    .then(response => response.json())
    .then(data => {
        updateCartCount();
        location.reload();
    });
}

function clearCart() {
    fetch('/clear_cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        updateCartCount();
        location.reload();
    });
}

function switchLanguage() {
    const currentLang = localStorage.getItem('language') || 'ru';
    const newLang = currentLang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('language', newLang);
    loadLanguage(newLang);
}

function loadLanguage(lang) {
    fetch(`/static/languages/${lang}.json`)
    .then(response => response.json())
    .then(data => {
        const headerTitle = document.getElementById('header-title');
        if (headerTitle) {
            headerTitle.textContent = data.header.title;
        }

        const languageSwitch = document.querySelector('.language-switch');
        if (languageSwitch) {
            languageSwitch.textContent = lang.toUpperCase();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'ru';
    loadLanguage(savedLang);
    updateCartCount();
});

function showCollectionInfo(category_id) {
    fetch(`/category/${category_id}`)
    .then(response => response.json())
    .then(data => {
        const collectionInfo = document.getElementById('collection-info');
        if (collectionInfo) {
            collectionInfo.innerHTML = `
                <h2>${data.category_name}</h2>
                <div class="product-cards">
                    ${data.products.map(product => `
                        <div class="product-card" data-product-id="${product.id}">
                            <img src="/static/images/${product.image}" alt="${product.name}">
                            <p>${product.name}</p>
                            <p>${product.price} ₽</p>
                            <button onclick="addToCart(${product.id})">Add to Cart</button>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    });
}

function showGameInfo(game) {
    const games = {
        "Alias": {
            "description": "Alias - это настольная игра, где игроки объясняют слова без использования однокоренных слов."
        },
        "Monopoly": {
            "description": "Monopoly - это классическая игра, где игроки покупают, продают и обменивают недвижимость."
        },
        "Casino": {
            "description": "Casino - это игра, в которой игроки делают ставки и соревнуются за выигрыш."
        }
    };

    const gameInfo = document.getElementById('game-info');
    if (gameInfo && games[game]) {
        gameInfo.innerHTML = `<h2>${game}</h2><p>${games[game].description}</p>`;
    }
}

function showPartnerInfo(partnerId) {
    fetch(`/partner/${partnerId}`)
    .then(response => response.json())
    .then(data => {
        const horecaInfo = document.getElementById('horeca-info');
        if (horecaInfo) {
            horecaInfo.innerHTML = `<h2>${data.name}</h2><p>${data.description}</p>`;
        }
    });
}

