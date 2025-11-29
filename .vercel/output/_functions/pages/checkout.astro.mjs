import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_ZLr-TQHs.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_D_of_jR6.mjs';
export { renderers } from '../renderers.mjs';

const $$Checkout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Checkout - Eko Leventi\u0107" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-12"> ${renderComponent($$result2, "CheckoutContent", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/mnt/c/Ubuntu/home/orisnik/projects/Leventic/src/components/CheckoutContent", "client:component-export": "default" })} </main> ` })}`;
}, "/mnt/c/Ubuntu/home/orisnik/projects/Leventic/src/pages/checkout.astro", void 0);

const $$file = "/mnt/c/Ubuntu/home/orisnik/projects/Leventic/src/pages/checkout.astro";
const $$url = "/checkout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Checkout,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
