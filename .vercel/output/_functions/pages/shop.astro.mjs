import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_ZLr-TQHs.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_D_of_jR6.mjs';
export { renderers } from '../renderers.mjs';

const $$Shop = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Shop - Eko Leventi\u0107" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ShopContent", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/mnt/c/Ubuntu/home/orisnik/projects/Leventic/src/components/ShopContent", "client:component-export": "default" })} ` })}`;
}, "/mnt/c/Ubuntu/home/orisnik/projects/Leventic/src/pages/shop.astro", void 0);

const $$file = "/mnt/c/Ubuntu/home/orisnik/projects/Leventic/src/pages/shop.astro";
const $$url = "/shop";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Shop,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
