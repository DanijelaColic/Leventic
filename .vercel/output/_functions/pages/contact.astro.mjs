import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_ZLr-TQHs.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_D_of_jR6.mjs';
export { renderers } from '../renderers.mjs';

const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Kontakt - Eko Leventi\u0107" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12"> <div class="max-w-6xl mx-auto"> <!-- Hero Section: Image and Text --> <div class="grid md:grid-cols-2 gap-8 mb-12"> <div class="flex items-center justify-center"> <img src="/Kontakt_stranica.jpg" alt="Kontakt" class="w-full h-auto rounded-lg shadow-lg object-cover" loading="lazy"> </div> <div class="flex flex-col justify-center"> <h2 class="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
Pozdrav!
</h2> <p class="text-xl md:text-2xl text-gray-700 mb-6 font-semibold">
Tu smo za sva Vaša pitanja.
</p> <p class="text-gray-700 mb-4 text-lg">
Ako imate pitanje o proizvodima, uslugama ili suradnji, slobodno nas
            kontaktirajte putem obrasca u nastavku.
</p> <p class="text-gray-700 text-lg">
Javit ćemo vam se u najkraćem mogućem roku.
</p> </div> </div> <!-- Contact Form --> <div class="bg-white rounded-lg shadow-lg p-8 mb-12"> <h2 class="text-2xl md:text-3xl font-bold text-primary-900 mb-6 text-center">
Pošaljite nam poruku
</h2> <form id="contact-form" class="max-w-2xl mx-auto space-y-6"> <div> <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
Ime i prezime <span class="text-red-500">*</span> </label> <input type="text" id="name" name="name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" placeholder="Vaše ime i prezime"> </div> <div> <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
Email <span class="text-red-500">*</span> </label> <input type="email" id="email" name="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" placeholder="vas@email.com"> </div> <div> <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
Predmet
</label> <input type="text" id="subject" name="subject" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors" placeholder="Predmet poruke"> </div> <div> <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
Poruka <span class="text-red-500">*</span> </label> <textarea id="message" name="message" required rows="6" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none" placeholder="Vaša poruka..."></textarea> </div> <div id="form-message" class="hidden p-4 rounded-lg"></div> <button type="submit" class="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all">
Pošalji poruku
</button> </form> </div> <!-- Contact Info --> <div class="bg-white rounded-lg shadow-lg p-8 mb-8"> <h2 class="text-2xl font-bold text-primary-900 mb-6">
OPG Mario Leventić
</h2> <div class="space-y-4 text-gray-700"> <p> <strong>Adresa:</strong> Osječka 120, Čepin
</p> <p> <strong>Email:</strong>${" "} <a href="mailto:info@eko-leventic.hr" class="text-primary-600 hover:text-primary-700 underline">
info@eko-leventic.hr
</a> </p> <p> <strong>Br. Mob:</strong>${" "} <a href="tel:+385917369919" class="text-primary-600 hover:text-primary-700 underline">
+385 91 736 9919
</a> </p> </div> </div> <div class="bg-white rounded-lg shadow-lg p-8 mb-8"> <h2 class="text-2xl font-bold text-primary-900 mb-6">Lokacija</h2> <div class="w-full h-96 rounded-lg overflow-hidden"> <iframe src="https://www.google.com/maps?q=Osječka+120,+Čepin&output=embed" width="100%" height="100%" style="border: 0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="OPG Mario Leventić - Osječka 120, Čepin"></iframe> </div> <p class="text-sm text-gray-600 mt-4 text-center"> <a href="https://www.google.com/maps/search/?api=1&query=Osječka+120,+Čepin" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline">
Otvori u Google Maps
</a> </p> </div> </div> </div> ` })} `;
}, "/mnt/c/Ubuntu/home/orisnik/projects/Leventic/src/pages/contact.astro", void 0);

const $$file = "/mnt/c/Ubuntu/home/orisnik/projects/Leventic/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
