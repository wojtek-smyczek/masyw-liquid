// Variant picking + add to cart — replaces useState(showForm) and the contact form from ProductDetails.tsx
class MasywProduct extends HTMLElement {
  connectedCallback() {
    this.variants = JSON.parse(this.querySelector('[data-variants]').textContent);
    this.form = this.querySelector('[data-product-form]');
    this.idInput = this.form.querySelector('input[name="id"]');
    this.button = this.form.querySelector('[type="submit"]');
    this.price = this.querySelector('[data-price]');
    this.error = this.querySelector('[data-error]');
    this.comingSoon = this.dataset.comingSoon === 'true';

    this.addEventListener('change', (event) => {
      if (event.target.closest('[data-option-index]')) this.onOptionChange();
    });
    this.form.addEventListener('submit', (event) => this.onSubmit(event));
  }

  selectedOptions() {
    return [...this.querySelectorAll('[data-option-index]')].map(
      (fieldset) => fieldset.querySelector('input:checked')?.value,
    );
  }

  onOptionChange() {
    const options = this.selectedOptions();
    const variant = this.variants.find((v) =>
      v.options.every((option, i) => option === options[i]),
    );

    this.error.textContent = '';
    if (!variant) {
      this.setButton(false, this.dataset.labelUnavailable);
      return;
    }

    this.idInput.value = variant.id;
    this.price.textContent = variant.price;
    this.setButton(
      variant.available && !this.comingSoon,
      variant.available && !this.comingSoon
        ? this.dataset.labelAdd
        : this.dataset.labelSoldOut,
    );
    history.replaceState(null, '', `${location.pathname}?variant=${variant.id}`);
  }

  setButton(enabled, label) {
    this.button.disabled = !enabled;
    this.button.textContent = label;
  }

  async onSubmit(event) {
    event.preventDefault();
    this.error.textContent = '';
    this.setButton(false, this.dataset.labelAdding);

    try {
      const response = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(this.form),
      });
      const data = await response.json();

      if (!response.ok) {
        this.error.textContent = data.description || data.message;
        this.setButton(true, this.dataset.labelAdd);
        return;
      }

      // The cart drawer (step 5) listens for this
      document.dispatchEvent(new CustomEvent('cart:updated', { detail: data }));
      this.setButton(false, this.dataset.labelAdded);
      setTimeout(() => this.setButton(true, this.dataset.labelAdd), 2000);
    } catch {
      this.error.textContent = 'Something went wrong. Please try again.';
      this.setButton(true, this.dataset.labelAdd);
    }
  }
}

customElements.define('masyw-product', MasywProduct);
