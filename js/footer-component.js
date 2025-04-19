// used for testing purposes

class FooterComponent extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <footer class="myFooter align footer has-text-centered">
                <small class="has-background-black has-text-primary p-1">Copyright &copy; 2025 Top War Movies</small>
            </footer>
        `;

        const bulmaStylesheet = document.querySelector('link[href="../css/bulma.min.css"]').cloneNode();
        const customStylesheet = document.querySelector('link[href="../css/styles.css"]').cloneNode();

        shadowRoot.appendChild(bulmaStylesheet);
        shadowRoot.appendChild(customStylesheet);
    }
}

customElements.define('footer-component', FooterComponent);