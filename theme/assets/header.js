// Mobile menu toggle — replaces useState(isOpen) from Navbar.tsx
class MasywHeader extends HTMLElement {
  connectedCallback() {
    this.button = this.querySelector('[data-menu-toggle]');
    this.panel = this.querySelector('[data-menu-panel]');

    this.button.addEventListener('click', () => this.toggle());
    // Close after picking a link (matters for same-page links like /#products)
    this.panel.addEventListener('click', (event) => {
      if (event.target.closest('a')) this.toggle(false);
    });
  }

  toggle(open = this.panel.hidden) {
    this.panel.hidden = !open;
    this.button.setAttribute('aria-expanded', open);
    this.button.textContent = open
      ? this.button.dataset.labelClose
      : this.button.dataset.labelOpen;
  }
}

customElements.define('masyw-header', MasywHeader);
