import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_ZLr-TQHs.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_D_of_jR6.mjs';
export { renderers } from '../renderers.mjs';

const $$OrderConfirmation = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Potvrda narud\u017Ebe - Eko Leventi\u0107" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-12"> ${renderComponent($$result2, "OrderConfirmationContent", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/mnt/c/Ubuntu/home/orisnik/projects/Leventic/src/components/OrderConfirmationContent", "client:component-export": "default" })} </main> ` })}`;
}, "/mnt/c/Ubuntu/home/orisnik/projects/Leventic/src/pages/order-confirmation.astro", void 0);

const $$file = "/mnt/c/Ubuntu/home/orisnik/projects/Leventic/src/pages/order-confirmation.astro";
const $$url = "/order-confirmation";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$OrderConfirmation,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
