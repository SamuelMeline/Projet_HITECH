class Cart {

	// Elements
	elements = {};
	triggers = [];

	// Templates
	templates = {
		item: '<li><span>{name}</span><span>{count}</span><strong>{price}</strong><button type="button" class="button remove" id="{ref}">&times;</button></li>',
		items: '<ul class="unstyled">{items}'
			+ '<li class="total"><span>TOTAL</span><span>{count}</span><strong>{total}</strong></li>'
			+ '</ul>'
			+ '<a href="#" class="button">Valider la commande</a>',
	};

	// Data
	data = {
		products: {},
		cartList: [],
		wishList: [],
	};

	// Base de donnée locale
	storageName = 'cart';

	// Devise
	currency = '€';

	// Classes CSS
	hiddenClass = 'hidden';

	// Constructeur
	constructor(badgeSelector, tableSelector, emptySelector) {
		// Enregistrement des éléments
		this.addElement('badge', badgeSelector);
		this.addElement('table', tableSelector);
		this.addElement('empty', emptySelector);
	}

	// Récupère les données depuis la base de données locale
	restore() {
		let data = localStorage.getItem(this.storageName);
		if (data) this.data = JSON.parse(data);
	};

	// Enregistre les données dans la base de données locale
	save() {
		localStorage.setItem(this.storageName, JSON.stringify(this.data));
	}

	// Ajoute un produit
	addProduct(ref, name, price) {
		this.data.products[ref] = {
			ref: ref,
			name: name,
			price: price,
		};
	}
	
	// Ajouter un produit au panier
	addToCart(ref) {
		this.data.cartList.push(ref);
		this.update();
		this.save();
	}
	
	// Enlever un produit du panier
	removeFromCart(ref) {
		this.data.cartList.splice(this.data.cartList.indexOf(ref), 1);
		this.update();
		this.save();
	}
	
	// Ajouter un produit à la liste de souhaits
	addToWish(ref) {
		if (this.data.wishList.indexOf(ref) < 0) this.data.wishList.push(ref);
		this.save();
	}
	
	// Enlever un produit de la liste de souhaits
	removeFromWish(ref) {
		this.data.wishList.splice(this.data.wishList.indexOf(ref), 1);
		this.save();
	}
	
	// Mise a jour des informations produits
	update() {
		// Variables
		let count = 0;
		let total = 0.0;
		let products = {};
		let items = '';

		// On compte les articles et on additionne les prix
		for (let ref of this.data.cartList) {
			if (this.data.products.hasOwnProperty(ref)) {
				count++;
				total += this.data.products[ref].price;
				if (products.hasOwnProperty(ref)) {
					products[ref].count++;
				} else {
					products[ref] = {
						ref: ref,
						name: this.data.products[ref].name,
						price: this.data.products[ref].price + this.currency,
						count: 1,
					};
				}
			}
		}

		// Mise à jour des attributs du badge
		if (this.elements.badge) {
			this.elements.badge.dataset.badge = count ? count : '';
			this.elements.badge.dataset.total = total ? total.toFixed(2) + this.currency : '';
		}

		// Retour si aucune table défini
		if (!this.elements.table) return;

		// Supprime les gestionnaires existants
		this.removeTriggers();

		// Ajout des items
		for (let ref in products) {
			items += this.template('item', products[ref]);
		}

		// Ajout du HTML
		this.elements.table.innerHTML = this.template('items', {
			items: items,
			count: count,
			total: total.toFixed(2) + this.currency,
		});

		// Ajout des triggers
		for (let ref in products) {
			let trigger = this.addTrigger('#'+ref, 'removeFromCart', ref);
			this.triggers.push(trigger);
		}

		// Affiche ou cache la table en fonction du nombre d'articles
		if (count > 0) {
			this.elements.empty.classList.add(this.hiddenClass);
			this.elements.table.classList.remove(this.hiddenClass);
		} else {
			this.elements.empty.classList.remove(this.hiddenClass);
			this.elements.table.classList.add(this.hiddenClass);
		}
	}

	// Retourne un template
	template(name, values) {
		let template = this.templates[name];
		for (let prop in values) {
			template = template.replace('{'+prop+'}', values[prop]);
		}
		return template;
	}

	// Ajoute un élément
	addElement(name, selector) {
		if (selector) this.elements[name] = document.querySelector(selector);
	}
	
	// Ajouter un déclancheur
	addTrigger(element, action, params=null, eventType='click') {
		// Element
		element = (typeof element === 'string') ? document.querySelector(element) : element;
		
		// Ajout de variables à l'élément pour les retrouver facilement dans le gestionnaire (handler)
		element._this = this;
		element._action = action;
		element._params = params;
		element._eventType = eventType;

		// Ajout de l'écouteur d'évenement à l'élément
		element.addEventListener(eventType, this.handler, false);

		// Return
		return element;
	}
	
	// Supprime les écouteurs d'évenement
	removeTriggers() {
		while (this.triggers.length > 0) {
			let trigger = this.triggers.shift();
			trigger.removeEventListener(trigger._eventType, this.handler, false);
		}
	}

	// Gestionnaire d'évenement
	handler(event) {
		this._this[this._action](this._params);
		event.preventDefault();
		return false;
	}
}
