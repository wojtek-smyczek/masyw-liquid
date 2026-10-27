// Slow-motion background video — replaces the useEffect/useRef from Hero.tsx
class MasywVideo extends HTMLElement {
  connectedCallback() {
    const video = this.querySelector('video');
    // Section setting is a percentage (20–100)
    const rate = (parseInt(this.dataset.playbackRate, 10) || 100) / 100;
    if (!video) return;

    // defaultPlaybackRate survives the source (re)loading; playbackRate applies now
    video.defaultPlaybackRate = rate;
    video.playbackRate = rate;
  }
}

customElements.define('masyw-video', MasywVideo);
