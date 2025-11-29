import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_C9UL1CEt.mjs';
import { manifest } from './manifest_T_o1sH_j.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/send-contact-form.astro.mjs');
const _page2 = () => import('./pages/api/send-order-confirmation.astro.mjs');
const _page3 = () => import('./pages/checkout.astro.mjs');
const _page4 = () => import('./pages/contact.astro.mjs');
const _page5 = () => import('./pages/order-confirmation.astro.mjs');
const _page6 = () => import('./pages/shop.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/send-contact-form.ts", _page1],
    ["src/pages/api/send-order-confirmation.ts", _page2],
    ["src/pages/checkout.astro", _page3],
    ["src/pages/contact.astro", _page4],
    ["src/pages/order-confirmation.astro", _page5],
    ["src/pages/shop.astro", _page6],
    ["src/pages/index.astro", _page7]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "d0bfb316-ec06-4ad2-ae75-c8ea0f7dd048",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
