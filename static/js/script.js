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
        alert(data.message);
        updateCartCount(); // Обновляем счетчик после добавления товара в корзину
        location.reload();
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
        location.reload();
    });
}

// Функция переключения языка
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
        document.getElementById('header-title').textContent = data.header.title;
        document.querySelector('.language-switch').textContent = lang.toUpperCase();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'ru';
    loadLanguage(savedLang);
    updateCartCount(); // Обновляем счетчик товаров при загрузке страницы
});

function showCollectionInfo(category_id) {
    fetch(`/category/${category_id}`)
    .then(response => response.json())
    .then(data => {
        const collectionInfo = document.getElementById('collection-info');
        collectionInfo.innerHTML = `
            <h2>${data.category_name}</h2>
            <div class="product-cards">
                ${data.products.map(product => `
                    <div class="product-card">
                        <img src="/static/images/${product.image}" alt="${product.name}">
                        <p>${product.name}</p>
                        <p>${product.price} ₽</p>
                        <button onclick="addToCart(${product.id})">Добавить в корзину</button>
                    </div>
                `).join('')}
            </div>
        `;
    });
}

// Обновляем счетчик товаров в корзине
function updateCartCount() {
    fetch('/cart_count')
    .then(response => response.json())
    .then(data => {
        document.getElementById('cart-count').textContent = data.count;
    });
}
