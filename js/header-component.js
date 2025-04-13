class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <header class="header">
                <div class="hero-body has-text-centered">
                    <h1 class="title is-size-1-desktop is-size-2-tablet is-size-3-mobile">Top War Movies</h1>
                    <p class="box subtitle is-size-4-desktop is-size-5-tablet is-size-6-mobile">When Words Fail, War Speaks</p>
                    <div class="is-flex is-justify-content-space-between p-1">
                        <button type="button" id="home" class="my-button button is-primary is-size-3-desktop is-size-4-tablet">Home</button>
                        <a href="login-register.html" id="login-register" class="my-button button is-primary is-size-4-tablet">Login/Register</a>
                    </div>
                </div>
            </header>
        `;

        const bulmaStylesheet = document.querySelector('link[href="bulma.min.css"]').cloneNode();
        const customStylesheet = document.querySelector('link[href="styles.css"]').cloneNode();

        shadowRoot.appendChild(bulmaStylesheet);
        shadowRoot.appendChild(customStylesheet);
    }
}

customElements.define('header-component', HeaderComponent);