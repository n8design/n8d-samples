// Shared renderer for TokenCollisionA / TokenCollisionB.
// Put both web parts on one page to show that CSS modules hash class names
// and @keyframes - but NOT custom properties, @property or :root.

export interface ICollisionClasses {
  root: string;
  swatch: string;
}

export interface ICollisionOptions {
  label: string;
  intended: string;   // the colour this web part *wants*
  token: string;      // the custom property it reads
  prefixed: boolean;
}

export function renderCollisionDemo(host: HTMLElement, classes: ICollisionClasses, options: ICollisionOptions): void {
  host.innerHTML = `
    <section class="${classes.root}">
      <h3>${options.label} - ${options.prefixed ? 'prefixed tokens' : 'shared token names'}</h3>
      <div class="${classes.swatch}" style="block-size:3rem;border-radius:4px"></div>
      <dl style="display:grid;grid-template-columns:auto 1fr;gap:.25rem .75rem;margin:.75rem 0">
        <dt>Wants</dt><dd style="margin:0"><code>${options.intended}</code></dd>
        <dt>Reads</dt><dd style="margin:0"><code>${options.token}</code></dd>
        <dt>Got</dt><dd style="margin:0"><code data-result></code></dd>
        <dt>Registered?</dt><dd style="margin:0"><code data-registered></code></dd>
      </dl>
      <p style="font-size:.75rem;opacity:.75">Stylesheets cannot be unloaded: reload the page after switching modes.</p>
    </section>`;

  // Read after layout so the result reflects every stylesheet on the page.
  requestAnimationFrame(() => {
    const swatch = host.querySelector(`.${classes.swatch}`) as HTMLElement;
    const computed = getComputedStyle(swatch);
    (host.querySelector('[data-result]') as HTMLElement).textContent =
      `${computed.backgroundColor} (${options.token}: ${computed.getPropertyValue(options.token).trim() || 'unset'})`;
    (host.querySelector('[data-registered]') as HTMLElement).textContent = isRegisteredColor(options.token);
  });
}

// A property registered as <color> computes `red` to `rgb(255, 0, 0)`;
// an unregistered custom property keeps the raw token text.
export function isRegisteredColor(token: string): string {
  const probe = document.createElement('span');
  probe.style.setProperty(token, 'red');
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).getPropertyValue(token).trim();
  probe.remove();
  return value === 'red' ? 'no (untyped)' : `yes (computes to ${value})`;
}
