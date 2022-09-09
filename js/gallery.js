class Gallery {

	// Eléments
	elements = {};

	// Constructeur
	constructor(imageSelector, linksSelector) {
		// Enregistrement des éléments
		this.addElement('image', imageSelector);
		this.addElements('links', linksSelector);

		// Ajout des déclancheurs
		for (let link of this.elements.links) {
			this.addTrigger(link, 'change', link.href);
		}
	}
	
	// Change la source de l'image
	change(src) {
		this.elements.image.src = src;
	}

	// Ajoute un élément
	addElement(name, selector) {
		if (selector) this.elements[name] = document.querySelector(selector);
	}

	// Ajoute plusieurs élément
	addElements(name, selector) {
		if (selector) this.elements[name] = document.querySelectorAll(selector);
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

	// Gestionnaire d'évenement
	handler(event) {
		this._this[this._action](this._params);
		event.preventDefault();
		return false;
	}
}