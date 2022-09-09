class Modal {

	// Eléments
	elements = {};

	// Classes CSS
	activeClass = 'active';

	// Constructeur
	constructor(dialogSelector, backdropSelector) {
		// Enregistrement des éléments
		this.addElement('dialog', dialogSelector);
		this.addElement('close', dialogSelector + ' .close');
		this.addElement('backdrop', backdropSelector);
	}
	
	// Ouvrir la fenêtre et l'arrière plan
	open() {
		if (this.elements.dialog) {
			this.elements.dialog.classList.add(this.activeClass);
			this.elements.close.focus();
		}
		if (this.elements.backdrop) this.elements.backdrop.classList.add(this.activeClass);
	}
	
	// Fermer la fenêtre et l'arrière plan
	close() {
		if (this.elements.dialog) this.elements.dialog.classList.remove(this.activeClass);
		if (this.elements.backdrop) this.elements.backdrop.classList.remove(this.activeClass);
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

	// Gestionnaire d'évenement
	handler(event) {
		this._this[this._action](this._params);
		event.preventDefault();
		return false;
	}
}