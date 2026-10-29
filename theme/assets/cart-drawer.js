// Cart drawer on the Shopify AJAX Cart API — opens on `cart:updated` (from product.js)
// and on clicks of [data-cart-open]; re-renders itself via the Section Rendering API.
class MasywCartDrawer extends HTMLElement {
  connectedCallback() {
    this.drawer = this.querySelector('[data-cart-drawer]');
    this.sectionId = this.dataset.sectionId;

    this.onDocumentClick = (event) => {
      const opener = event.target.closest('[data-cart-open]');
      if (!opener) return;
      event.preventDefault();
      this.open(opener);
    };
    this.onCartUpdated = () => this.refresh().then(() => this.open());
    this.onKeydown = (event) => {
      if (event.key === 'Escape' && !this.drawer.hidden) this.close();
    };

    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('cart:updated', this.onCartUpdated);
    document.addEventListener('keydown', this.onKeydown);

    this.addEventListener('click', (event) => {
      const closer = event.target.closest('[data-cart-close]');
      if (closer) {
        // Links (e.g. "Objects." in the empty cart) still navigate after closing
        if (!closer.href) event.preventDefault();
        this.close();
        return;
      }
      const change = event.target.closest('[data-cart-change]');
      if (change) {
        event.preventDefault();
        this.changeLine(Number(change.dataset.line), Number(change.dataset.quantity));
      }
    });
  }

  // Theme editor re-renders sections, so drop the document-level listeners
  disconnectedCallback() {
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('cart:updated', this.onCartUpdated);
    document.removeEventListener('keydown', this.onKeydown);
  }

  open(opener = document.activeElement) {
    this.opener = opener;
    this.drawer.hidden = false;
    document.body.style.overflow = 'hidden';
    this.querySelector('[role="dialog"] [data-cart-close]')?.focus();
  }

  close() {
    this.drawer.hidden = true;
    document.body.style.overflow = '';
    this.opener?.focus?.();
  }

  async changeLine(line, quantity) {
    this.setBusy(true);
    try {
      const response = await fetch(`${window.Shopify.routes.root}cart/change.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line, quantity, sections: [this.sectionId] }),
      });
      const data = await response.json();

      if (!response.ok) {
        this.showError(data.description || data.message);
        return;
      }
      this.render(data.sections[this.sectionId]);
    } catch {
      this.showError(this.dataset.errorMessage);
    } finally {
      this.setBusy(false);
    }
  }

  async refresh() {
    const response = await fetch(`${window.Shopify.routes.root}?sections=${this.sectionId}`);
    const data = await response.json();
    this.render(data[this.sectionId]);
  }

  // Swap in the freshly rendered [data-cart-contents] and update the header count
  render(html) {
    const fresh = new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector('[data-cart-contents]');
    if (!fresh) return;

    this.querySelector('[data-cart-contents]').replaceWith(fresh);
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = fresh.dataset.itemCount;
    });
  }

  setBusy(busy) {
    this.querySelector('[data-cart-contents]').classList.toggle('opacity-50', busy);
  }

  showError(message) {
    const error = this.querySelector('[data-cart-error]');
    if (error) error.textContent = message;
  }
}

customElements.define('masyw-cart-drawer', MasywCartDrawer);
