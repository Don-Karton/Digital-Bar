from flask import Flask, render_template, request, redirect, url_for, jsonify, session
import json

app = Flask(__name__)
app.secret_key = 'your_secret_key'


def load_categories():
    with open('data/categories.json', 'r') as f:
        return json.load(f)


def load_products():
    with open('data/products.json', 'r') as f:
        return json.load(f)


def load_horeca():
    with open('data/horeca.json', 'r') as f:
        return json.load(f)


def get_cart():
    return session.get('cart', [])


def save_cart(cart):
    session['cart'] = cart


@app.route('/')
def home():
    categories = load_categories()
    return render_template('index.html', categories=categories)


@app.route('/category/<int:category_id>')
def category(category_id):
    categories = load_categories()
    category_name = next((cat['name'] for cat in categories if cat['id'] == category_id), None)
    if not category_name:
        return jsonify({'error': 'Category not found'}), 404

    products = [product for product in load_products() if product['category_id'] == category_id]

    return jsonify({'category_name': category_name, 'products': products})


@app.route('/product/<int:product_id>')
def product(product_id):
    products = load_products()
    product = next((prod for prod in products if prod['id'] == product_id), None)
    if not product:
        return redirect(url_for('home'))

    cart = get_cart()
    is_in_cart = any(item['id'] == product_id for item in cart)
    quantity = next((item['quantity'] for item in cart if item['id'] == product_id), 0)

    return render_template('product.html', product=product, is_in_cart=is_in_cart, quantity=quantity)


@app.route('/cart')
def cart():
    cart_items = get_cart()
    products = load_products()

    cart_products = []
    total = 0
    for item in cart_items:
        product = next((prod for prod in products if prod['id'] == item['id']), None)
        if product:
            product_data = {
                'id': product['id'],
                'name': product['name'],
                'image': product['image'],
                'price': product['price'],
                'quantity': item['quantity'],
                'total_price': product['price'] * item['quantity']
            }
            cart_products.append(product_data)
            total += product_data['total_price']

    return render_template('cart.html', cart_items=cart_products, cart_total=total)


@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    data = request.json
    product_id = data.get('item_id')

    cart = get_cart()
    for item in cart:
        if item['id'] == int(product_id):
            item['quantity'] += 1
            save_cart(cart)
            return jsonify({'message': 'Товар добавлен в корзину'})

    cart.append({'id': int(product_id), 'quantity': 1})
    save_cart(cart)
    return jsonify({'message': 'Товар добавлен в корзину'})


@app.route('/remove_from_cart', methods=['POST'])
def remove_from_cart():
    data = request.json
    product_id = data.get('item_id')
    decrease_only = data.get('decrease_only', False)

    cart = get_cart()

    if decrease_only:
        for item in cart:
            if item['id'] == int(product_id):
                if item['quantity'] > 1:
                    item['quantity'] -= 1
                else:
                    cart.remove(item)
                break
    else:
        cart = [item for item in cart if item['id'] != int(product_id)]

    save_cart(cart)
    return jsonify({'message': 'Товар удален из корзины'})


@app.route('/clear_cart', methods=['POST'])
def clear_cart():
    session.pop('cart', None)
    return jsonify({'message': 'Корзина очищена'})


@app.route('/entertainment')
def entertainment():
    return render_template('entertainment.html')


@app.route('/horeca')
def horeca():
    horeca_partners = load_horeca()
    return render_template('horeca.html', horeca_partners=horeca_partners)


@app.route('/game_profile')
def game_profile():
    return render_template('game_profile.html')


@app.route('/cart_count')
def cart_count():
    return jsonify({'count': len(get_cart())})


if __name__ == '__main__':
    app.run(debug=True)
