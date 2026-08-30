import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Facebook,
  Instagram,
  MapPin,
  Menu as MenuIcon,
  MessageCircle,
  Music2,
  Phone,
  Send,
  Star,
  X,
  Youtube,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type MenuCategory = 'Starters' | 'Steaks' | 'Chicken' | 'Seafood' | 'Pasta' | 'Sandwiches';
type MenuItem = { id: string; name: string; category: MenuCategory; description: string; image: string };
type GalleryItem = { id: string; title: string; image: string; className?: string };
type ReservationData = { name: string; phone: string; date: string; time: string; guests: string; request: string };

const menuItems: MenuItem[] = [
  { id: 'bistro-house-special-steak', name: 'Bistro House Special Steak', category: 'Steaks', description: 'A generous cut, finished the Rosati way.', image: '/images/tagliatelle.jpg' },
  { id: 'dynamite-prawns', name: 'Dynamite Prawns', category: 'Starters', description: 'Crisp prawns, a lively house dressing.', image: '/images/burrata.jpg' },
  { id: 'crunchy-club-sandwich', name: 'Crunchy Club Sandwich', category: 'Sandwiches', description: 'Layered, toasted, and made for sharing.', image: '/images/dining.jpg' },
  { id: 'chicken-lasagna', name: 'Chicken Lasagna', category: 'Pasta', description: 'Comfort in slow-baked layers.', image: '/images/tagliatelle.jpg' },
  { id: 'beef-sizzling-fajita', name: 'Beef Sizzling Fajita', category: 'Steaks', description: 'The table-side sizzle, with all the good bits.', image: '/images/hero-risotto.jpg' },
  { id: 'tarragon-grilled-chicken', name: 'Tarragon Grilled Chicken', category: 'Chicken', description: 'Charred edges, fragrant herbs, bright finish.', image: '/images/dining.jpg' },
  { id: 'moroccan-chicken', name: 'Moroccan Chicken', category: 'Chicken', description: 'Warm spice, tender chicken, a little wanderlust.', image: '/images/interior.jpg' },
  { id: 'fish-and-chips', name: 'Fish & Chips', category: 'Seafood', description: 'Golden, familiar, precisely done.', image: '/images/burrata.jpg' },
  { id: 'rosati-signature-grilled-chicken', name: 'Rosati Signature Grilled Chicken', category: 'Chicken', description: 'Our signature, built around the grill.', image: '/images/hero-risotto.jpg' },
  { id: 'prawn-cocktail', name: 'Prawn Cocktail', category: 'Starters', description: 'A classic opener, served with a Rosati touch.', image: '/images/burrata.jpg' },
];

const galleryItems: GalleryItem[] = [
  { id: 'hero-table', title: 'At the table', image: '/images/hero-risotto.jpg', className: 'gallery-hero' },
  { id: 'burrata-detail', title: 'The first bite', image: '/images/burrata.jpg' },
  { id: 'tagliatelle-detail', title: 'Made to linger', image: '/images/tagliatelle.jpg' },
  { id: 'warm-room', title: 'The room after dark', image: '/images/interior.jpg', className: 'gallery-wide' },
];

const categories = ['All', 'Starters', 'Steaks', 'Chicken', 'Seafood', 'Pasta', 'Sandwiches', 'Drinks'];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function SaleBanner() {
  return (
    <div className="promo-banner" aria-label="Rosati Bistro seasonal offer" data-testid="promo-banner">
      <div className="promo-track">
        <span>Weekend table special</span><i aria-hidden="true" />
        <span>Ask our team for today’s offer</span><i aria-hidden="true" />
        <span>Good food · Great moments</span><i aria-hidden="true" />
        <span>Weekend table special</span><i aria-hidden="true" />
        <span>Ask our team for today’s offer</span><i aria-hidden="true" />
        <span>Good food · Great moments</span><i aria-hidden="true" />
      </div>
    </div>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a className="brand-lockup" href="/" data-testid="link-brand" style={light ? { color: 'hsl(var(--background))' } : undefined}>
      <span className="brand-name">Rosati Bistro</span>
      <span className="brand-sub">Karachi · Since always</span>
    </a>
  );
}

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'About', href: '/about' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 35);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);
  return (
    <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`} data-testid="site-navigation">
      <div className="nav-inner container-wide">
        <Brand light={!scrolled} />
        <nav className="nav-links" aria-label="Primary navigation">
          {links.map((link) => (
            <a key={link.label} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`}>{link.label}</a>
          ))}
        </nav>
        <a className="nav-reserve" href="/#reservation" data-testid="button-nav-reserve">Reserve a Table</a>
        <button className="mobile-trigger" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} data-testid="button-mobile-menu">
          {mobileOpen ? <X size={21} strokeWidth={1.5} /> : <MenuIcon size={21} strokeWidth={1.5} />}
        </button>
      </div>
      {mobileOpen && (
        <nav className="mobile-panel" aria-label="Mobile navigation">
          {links.map((link) => (
            <a key={link.label} href={link.href} onClick={closeMobile} data-testid={`link-mobile-${link.label.toLowerCase()}`}>{link.label}</a>
          ))}
          <a href="/#reservation" onClick={closeMobile} data-testid="button-mobile-reserve">Reserve a Table <ArrowUpRight size={14} /></a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <video className="hero-video" autoPlay muted loop playsInline poster="/images/hero-risotto.jpg" aria-label="Slow close-up video of saffron risotto with roasted mushrooms">
        <source src="/video/rosati-food-loop.mp4" type="video/mp4" />
      </video>
      <div className="hero-content">
        <div className="hero-kicker">Italian-inspired · Karachi</div>
        <h1 className="hero-title" id="hero-title">Good food.<em>Great moments.</em></h1>
        <p className="hero-intro">Experience delicious food, warm hospitality, and memorable moments in the heart of Karachi.</p>
        <div className="hero-actions">
          <a className="button-primary" href="#menu" data-testid="link-hero-menu">Explore Menu <ArrowDownRight size={15} /></a>
          <button className="button-ghost" onClick={() => scrollToId('reservation')} data-testid="button-hero-reserve">Reserve a Table <ArrowUpRight size={15} /></button>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">Scroll to discover</div>
    </section>
  );
}

function PageIntro({ eyebrow, title, emphasis, description }: { eyebrow: string; title: string; emphasis: string; description: string }) {
  return (
    <section className="page-intro" aria-labelledby="page-heading">
      <div className="container-wide page-intro-inner">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="page-heading" id="page-heading">{title}<em>{emphasis}</em></h1>
        <p>{description}</p>
        <a className="button-primary" href="/#reservation" data-testid="link-page-reserve">Reserve a Table <ArrowUpRight size={15} /></a>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-heading">
      <div className="container-wide about-grid">
        <div className="about-feature">
          <img src="/images/interior.jpg" loading="lazy" alt="Warm, intimate Rosati Bistro dining room" />
          <div className="about-stamp" aria-hidden="true"><strong>Rosati</strong>made for<br />long evenings</div>
        </div>
        <div className="about-copy">
          <span className="eyebrow">A seat at our table</span>
          <h2 className="section-heading" id="about-heading">Come as you are.<br /><em>Stay awhile.</em></h2>
          <p className="body-copy">Rosati Bistro is a stylish Karachi restaurant for the moments that deserve more than a quick meal. We bring Italian-inspired dishes, steaks, seafood, sandwiches, and a comfortable dining experience together under one warm roof.</p>
          <p className="body-copy" style={{ marginTop: 15 }}>Good food is the beginning. The rest is candlelight, conversation, and the feeling that there is nowhere else you need to be.</p>
          <div className="about-signoff"><span />Your table is waiting.</div>
        </div>
      </div>
    </section>
  );
}

function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = activeCategory === 'All' ? menuItems : menuItems.filter((item) => item.category === activeCategory);
  return (
    <section className="menu-section" id="menu" aria-labelledby="menu-heading">
      <div className="container-wide">
        <div className="section-top">
          <div>
            <span className="eyebrow">From our kitchen</span>
            <h2 className="section-heading" id="menu-heading">The menu,<br /><em>your way.</em></h2>
          </div>
          <p className="section-note">A table full of old favourites and new reasons to return. Ask us what is fresh today.</p>
        </div>
        <div className="menu-filters" role="group" aria-label="Filter menu by category">
          {categories.map((category) => (
            <button key={category} className={`filter-btn ${activeCategory === category ? 'active' : ''}`} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)} data-testid={`button-filter-${category.toLowerCase()}`}>{category}</button>
          ))}
        </div>
        <div className="menu-grid" data-testid="menu-items">
          {filtered.length > 0 ? filtered.map((item) => (
            <article className="menu-item" key={item.id} data-testid={`card-menu-${item.id}`}>
              <img className="menu-item-image" src={item.image} loading="lazy" alt="" />
              <div><h3>{item.name}</h3><p>{item.description}</p></div>
              <span className="menu-item-price" data-testid={`text-price-${item.id}`}>Price on request</span>
            </article>
          )) : <div className="menu-empty" data-testid="text-menu-empty">Our drinks menu is being poured. Menu price coming soon.</div>}
        </div>
        <div className="menu-footnote">Please let our team know about any dietary requirements.</div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="experience-section" aria-labelledby="experience-heading">
      <img className="experience-image" loading="lazy" src="/images/dining.jpg" alt="Friends sharing a warm dinner at Rosati Bistro" />
      <div className="experience-content">
        <span className="eyebrow">The Rosati feeling</span>
        <h2 className="section-heading" id="experience-heading">More than a meal.<br /><em>Come hungry. Leave happy.</em></h2>
        <p className="experience-intro">There is always another reason to stay for one more course. Make an evening of it, your way.</p>
        <div className="experience-list" aria-label="Dining experiences">
          <span>Outdoor seating</span><span>Private dining</span><span>Live music</span><span>Hi-Tea</span>
        </div>
      </div>
    </section>
  );
}

function Gallery({ onOpen }: { onOpen: (item: GalleryItem) => void }) {
  return (
    <section className="gallery-section" id="gallery" aria-labelledby="gallery-heading">
      <div className="container-wide">
        <div className="section-top">
          <div><span className="eyebrow">A little atmosphere</span><h2 className="section-heading" id="gallery-heading">Look around.<br /><em>Stay longer.</em></h2></div>
          <p className="section-note">A glimpse of the plates, the room, and the kind of evenings we like best.</p>
        </div>
        <div className="gallery-grid" data-testid="gallery-grid">
          {galleryItems.map((item) => (
            <button key={item.id} className={`gallery-card ${item.className ?? ''}`} onClick={() => onOpen(item)} aria-label={`Open image: ${item.title}`} data-testid={`button-gallery-${item.id}`}>
              <img src={item.image} loading="lazy" alt={item.title} />
              <span className="gallery-overlay"><span>{item.title} <ChevronRight size={12} style={{ verticalAlign: 'middle' }} /></span></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    ['“The kind of place where dinner quietly turns into the whole evening.”', 'A regular guest'],
    ['“Warm hospitality, lovely food, and a table you want to come back to.”', 'A Karachi diner'],
    ['“Rosati has that rare feeling of being both special and completely at ease.”', 'A weekend guest'],
  ];
  return (
    <section className="reviews-section" aria-labelledby="reviews-heading">
      <div className="container-wide">
        <div className="reviews-header">
          <div><span className="eyebrow">A word from the room</span><h2 className="section-heading" id="reviews-heading">Good company<br /><em>speaks up.</em></h2></div>
          <div className="rating" data-testid="rating-summary"><div className="rating-number">4.1</div><div className="rating-stars" aria-label="4.1 out of 5 stars"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></div><small>6,730+ Reviews</small></div>
        </div>
        <div className="review-grid">
          {reviews.map(([quote, author], index) => <figure className="review-card" key={author} data-testid={`card-review-${index}`}><blockquote className="review-quote">{quote}</blockquote><figcaption className="review-author"><span>{author}</span><span>Rosati Bistro</span></figcaption></figure>)}
        </div>
      </div>
    </section>
  );
}

function Reservation() {
  const [form, setForm] = useState<ReservationData>({ name: '', phone: '', date: '', time: '', guests: '2', request: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof ReservationData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const update = (field: keyof ReservationData, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Partial<Record<keyof ReservationData, string>> = {};
    if (!form.name.trim()) next.name = 'Please tell us your name.';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 7) next.phone = 'Please enter a valid phone number.';
    if (!form.date) next.date = 'Choose a date for your visit.';
    if (!form.time) next.time = 'Choose a preferred time.';
    if (!form.guests) next.guests = 'Select the number of guests.';
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  };
  return (
    <section className="reservation-section" id="reservation" aria-labelledby="reservation-heading">
      <div className="container-wide reservation-grid">
        <div className="reservation-copy">
          <span className="eyebrow">Make it an evening</span>
          <h2 className="section-heading" id="reservation-heading">Your table,<br /><em>set aside.</em></h2>
          <p className="body-copy">Tell us when you would like to join us and our team will take care of the rest. For larger gatherings, add a note and we will be in touch.</p>
        </div>
        <div className="form-card">
          {submitted ? (
            <div className="success-card" role="status" data-testid="reservation-success">
              <div className="success-mark"><Check size={22} /></div>
              <h3>We have your request.</h3>
              <p>Thank you, {form.name}. Our team will call {form.phone} shortly to confirm your table.</p>
              <button className="success-reset" onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', date: '', time: '', guests: '2', request: '' }); }} data-testid="button-new-reservation">Make another request</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate data-testid="reservation-form">
              <div className="form-grid">
                <Field label="Name" value={form.name} onChange={(value) => update('name', value)} error={errors.name} placeholder="Your full name" testId="input-reservation-name" />
                <Field label="Phone" type="tel" value={form.phone} onChange={(value) => update('phone', value)} error={errors.phone} placeholder="0300 0884220" testId="input-reservation-phone" />
                <Field label="Date" type="date" value={form.date} onChange={(value) => update('date', value)} error={errors.date} testId="input-reservation-date" />
                <Field label="Time" type="time" value={form.time} onChange={(value) => update('time', value)} error={errors.time} testId="input-reservation-time" />
                <div className="field">
                  <label htmlFor="reservation-guests">Guests</label>
                  <select id="reservation-guests" value={form.guests} onChange={(event) => update('guests', event.target.value)} data-testid="select-reservation-guests">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => <option key={number} value={number}>{number} {number === 1 ? 'guest' : 'guests'}</option>)}
                  </select>
                  {errors.guests && <span className="field-error">{errors.guests}</span>}
                </div>
                <div className="field field-full">
                  <label htmlFor="reservation-request">Special request <span>(optional)</span></label>
                  <textarea id="reservation-request" value={form.request} onChange={(event) => update('request', event.target.value)} placeholder="A birthday, a preference, anything we should know" data-testid="textarea-reservation-request" />
                </div>
              </div>
              <button type="submit" className="button-primary form-submit" data-testid="button-submit-reservation">Request a table <Send size={14} /></button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, error, placeholder, type = 'text', testId }: { label: string; value: string; onChange: (value: string) => void; error?: string; placeholder?: string; type?: string; testId: string }) {
  const id = testId.replace('input-', '');
  return <div className="field"><label htmlFor={id}>{label}</label><input id={id} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} data-testid={testId} />{error && <span className="field-error">{error}</span>}</div>;
}

function Contact() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-heading">
      <div className="container-wide contact-grid">
        <div className="contact-copy">
          <span className="eyebrow">Find your way to us</span>
          <h2 className="section-heading" id="contact-heading">See you<br /><em>at Rosati.</em></h2>
          <div className="contact-info">
            <div className="contact-line"><MapPin size={17} /><div><strong>Visit us</strong><span data-testid="text-address">Main B, 12 Shahra-e-Faisal,<br />Darwaish Colony, Karachi</span></div></div>
            <div className="contact-line"><Phone size={17} /><div><strong>Call us</strong><a href="tel:03000884220" data-testid="link-phone">0300 0884220</a></div></div>
            <div className="contact-line"><Clock3 size={17} /><div><strong>Opening hours</strong><span data-testid="text-opening-hours">Please call for today’s opening hours.</span></div></div>
          </div>
          <div className="contact-actions">
            <a className="button-primary" href="https://www.google.com/maps/search/?api=1&query=Rosati+Bistro+Main+B+12+Shahra-e-Faisal+Karachi" target="_blank" rel="noreferrer" data-testid="link-directions">Get Directions <ArrowUpRight size={14} /></a>
            <a className="button-ghost" href="tel:03000884220" data-testid="link-call">Call Rosati <Phone size={14} /></a>
          </div>
        </div>
        <div className="map-card" role="img" aria-label="Map placeholder showing Rosati Bistro on Shahra-e-Faisal" data-testid="map-placeholder"><div className="map-pin"><MapPin size={18} /></div><div className="map-label">Main B · Shahra-e-Faisal · Karachi</div></div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-wide">
        <div className="footer-top">
          <div className="footer-brand"><Brand light /><p>Delicious food, warm hospitality, and memorable evenings in the heart of Karachi.</p></div>
          <div><div className="footer-heading">Explore</div><nav className="footer-links" aria-label="Footer navigation"><a href="/menu" data-testid="link-footer-menu">Menu</a><a href="/about" data-testid="link-footer-about">About</a><a href="/gallery" data-testid="link-footer-gallery">Gallery</a><a href="/contact" data-testid="link-footer-contact">Contact</a></nav></div>
          <div><div className="footer-heading">Visit</div><div className="footer-hours">Main B, 12 Shahra-e-Faisal<br />Darwaish Colony, Karachi<br /><br />0300 0884220</div></div>
          <div><div className="footer-heading">Follow along</div><div className="footer-socials">
            <a className="social-link" href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" data-testid="link-instagram"><Instagram size={15} /><span>Instagram</span></a>
            <a className="social-link" href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook" data-testid="link-facebook"><Facebook size={15} /><span>Facebook</span></a>
            <a className="social-link" href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube" data-testid="link-youtube"><Youtube size={15} /><span>YouTube</span></a>
            <a className="social-link" href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok" data-testid="link-tiktok"><Music2 size={15} /><span>TikTok</span></a>
            <a className="social-link" href="https://wa.me/923000884220" target="_blank" rel="noreferrer" aria-label="WhatsApp" data-testid="link-whatsapp"><MessageCircle size={15} /><span>WhatsApp</span></a>
          </div></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Rosati Bistro</span><span>Good food. Great moments.</span></div>
      </div>
    </footer>
  );
}

function Lightbox({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Gallery image: ${item.title}`} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} data-testid="gallery-lightbox">
      <button className="lightbox-close" onClick={onClose} aria-label="Close gallery image" data-testid="button-close-lightbox"><X size={20} /></button>
      <figure><img src={item.image} alt={item.title} /><figcaption><span>{item.title}</span><span>Rosati Bistro · Karachi</span></figcaption></figure>
    </div>
  );
}

function SiteFrame({ children }: { children: ReactNode }) {
  return <div className="site-shell"><SaleBanner /><Navigation /><main>{children}</main><Footer /></div>;
}

function MenuPage() {
  return (
    <SiteFrame>
      <PageIntro eyebrow="A table worth gathering around" title="Take a look." emphasis="Stay awhile." description="Explore Rosati Bistro’s Italian-inspired favourites, from generous steaks and seafood to comforting pasta and sandwiches." />
      <MenuSection />
    </SiteFrame>
  );
}

function AboutPage() {
  return (
    <SiteFrame>
      <PageIntro eyebrow="The Rosati feeling" title="Made for" emphasis="lingering." description="A comfortable Karachi dining room where good food is only the beginning of the evening." />
      <About />
      <Experience />
      <Reviews />
    </SiteFrame>
  );
}

function GalleryPage() {
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  return (
    <SiteFrame>
      <PageIntro eyebrow="A little atmosphere" title="Look around." emphasis="Stay longer." description="A closer look at the plates, the room, and the evenings we like best." />
      <Gallery onOpen={setLightboxItem} />
      {lightboxItem && <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />}
    </SiteFrame>
  );
}

function ContactPage() {
  return (
    <SiteFrame>
      <PageIntro eyebrow="Find your way to us" title="See you" emphasis="at Rosati." description="Reserve your table, ask about today’s offer, or find us in Darwaish Colony on Shahra-e-Faisal." />
      <Reservation />
      <Contact />
    </SiteFrame>
  );
}

function Home() {
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  return (
    <SiteFrame>
      <Hero />
      <div className="marquee" aria-label="Rosati Bistro dining experiences"><div className="marquee-track"><span>Italian-inspired</span><span className="marquee-dot" /><span>Karachi hospitality</span><span className="marquee-dot" /><span>Made for lingering</span><span className="marquee-dot" /><span>Italian-inspired</span><span className="marquee-dot" /><span>Karachi hospitality</span></div></div>
      <About /><MenuSection /><Experience /><Gallery onOpen={setLightboxItem} /><Reviews /><Reservation /><Contact />
      {lightboxItem && <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />}
    </SiteFrame>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/menu" component={MenuPage} /><Route path="/about" component={AboutPage} /><Route path="/gallery" component={GalleryPage} /><Route path="/contact" component={ContactPage} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;