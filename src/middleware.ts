import type { MiddlewareHandler } from 'astro'

// 301 redirects za stare URL-ove (SEO optimizacija)
// Ovo osigurava da Google i korisnici budu preusmjereni na nove stranice
const redirects: Record<string, string> = {
  '/eko-integralno-pirovo-brasno': '/shop',
  '/eko-integralno-pirovo-brasno/': '/shop',
  '/cijena': '/shop',
  '/cijena/': '/shop',
  '/narudzba': '/shop',
  '/narudzba/': '/shop',
  '/eko-bijelo-pirovo-brasno': '/shop',
  '/eko-bijelo-pirovo-brasno/': '/shop',
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const pathname = context.url.pathname

  // Provjeri da li postoji redirect za ovaj path
  if (redirects[pathname]) {
    return new Response(null, {
      status: 301, // Permanent redirect (SEO friendly)
      headers: {
        Location: redirects[pathname],
      },
    })
  }

  // Nastavi normalno ako nema redirecta
  return next()
}

