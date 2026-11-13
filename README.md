# AVENTO website

Responsive Uzbek, Russian and English corporate landing page, built with HTML, CSS and vanilla JavaScript. No build step or dependency installation is needed.

## Run locally

Open `index.html` in a modern browser. Or run `python -m http.server 8000` from this directory and visit <http://localhost:8000>.

## Included

- Uzbek Latin (default), Russian and English language switcher, remembered in local storage.
- Light and dark themes: follows the system setting on first visit, toggle in the header, remembered in local storage.
- Insurance Navigator: a dashboard-style panel comparing typical OSAGO / KASKO / corporate coverage, with the documents usually needed and an animated process tracker. Its content is general guidance, not real customer data.
- Extra motion: intro loader (once per session), reading-progress bar, line-by-line heading reveals, side section dots, header that hides on scroll down, card spotlight, 3D tilt on the dashboard, count-up figures and a marquee band.
- Responsive sticky navigation and mobile menu, service cards, four-step process, B2B section, FAQ accordion and contact form validation.
- Locally stored automotive photos, transparent AVENTO logo and provided A-mark favicon, SEO and Open Graph metadata.
- The Absans typeface is bundled locally with its OFL license; service and future-service symbols use the supplied Streamline SVG icon set.
- Motion includes a staged hero intro, scroll reveals with stagger, subtle hero parallax, a slow fleet-image zoom, and small icon/button hover transitions. Reduced-motion preferences are honored.
- Legal copy clarifies AVENTO is not an insurer; future services are labeled as plans.

## Before launch

- Add verified phone, email, office address, Telegram and Instagram details.
- Connect the form to a backend. It currently validates locally and does not send data.
- Confirm partner agreements and legal copy before publication.

## Deploy to avento.uz

Upload this directory's contents to your hosting web root, point `avento.uz` and `www` to the host, enable HTTPS, and set your preferred host redirect. DNS records depend on your hosting provider. Verify the deployed site and form endpoint after publishing.

## Image

`assets/hero-car.jpg` is a locally stored Unsplash CDN photograph. Check Unsplash's current license and image rights for commercial publication. `assets/business-fleet.jpg` is the generated image used in the business fleet section. Photos and the logo mark are colour-graded to the brand palette (Deep Blue #051C2C, Electric Blue #2251FF, Sky Cyan #00A9F4, Silver White #E7EAF0); untouched originals are in `assets/_originals/`, previous CSS/HTML in `_backup/`.
