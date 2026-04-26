import { Link } from "react-router-dom";

const quickLinks = [
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Products", to: "/products" },
  { label: "Clients", to: "/clients" },
  { label: "Gallery", to: "/gallery" },
  { label: "Events", to: "/events" },
  { label: "Downloads", to: "/downloads" },
  { label: "Contact Us", to: "/contact" },
];

const productLinks = [
  { label: "Steam Generation", to: "/products" },
  { label: "Boiler House Accessories", to: "/products" },
  { label: "Steam Distribution", to: "/products" },
  { label: "Customized Package Solutions", to: "/products" },
  { label: "Pressure Transmitter", to: "/products" },
];

const legalLinks = [
  { label: "Events", to: "/events" },
  { label: "Downloads", to: "/downloads" },
  { label: "Privacy Policy", to: "/" },
];

const contacts = [
  {
    dept: "Sales Dept.",
    phone: "+91 9309534688",
    wa: "https://wa.link/ye9d49",
  },
  {
    dept: "Sales Dept.",
    phone: "+91 7798156167",
    wa: "https://wa.link/y0qc53",
  },
  {
    dept: "Purchase Dept.",
    phone: "+91 9172033598",
    wa: "https://wa.link/nsrge1",
  },
];

const socials = [
  {
    label: "Instagram",
    href: "http://www.instagram.com/volfram_systems",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/volframSystems",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/98843763/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCoxhZn8YgFF2FG_bgBvJPBA",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "600+", label: "Happy Customers" },
  { value: "422+", label: "Condensate Systems" },
  { value: "12+", label: "Years Serving Industry" },
  { value: "24/7", label: "Service Support" },
];

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-link {
          position: relative;
          display: inline-block;
          transition: color 0.2s ease;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -1px;
          width: 0; height: 1px;
          background: var(--color-accent);
          transition: width 0.25s ease;
        }
        .footer-link:hover::after { width: 100%; }
        .footer-link:hover { color: var(--color-accent); }

        .social-btn {
          transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .social-btn:hover {
          transform: translateY(-3px);
          background: var(--color-accent);
          color: #fff;
        }

        .stat-card {
          border-left: 2px solid var(--color-accent);
          transition: background 0.2s ease;
        }
        .stat-card:hover { background: rgba(244,122,32,0.08); }

        .wa-pill {
          transition: background 0.2s, color 0.2s;
        }
        .wa-pill:hover { background: #25D366; color: #fff; }

        .footer-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(244,122,32,0.4), transparent);
        }
        .steam-line {
          background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-secondary) 100%);
          height: 3px;
          border-radius: 2px;
        }
      `}</style>

      <footer className="footer font-body">
        {/* Steam accent line */}
        <div className="steam-line w-full" />

        {/* Stats bar */}
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="stat-card pl-4 py-3 rounded-r-sm">
                <div className="font-heading font-bold text-accent text-3xl leading-none">{s.value}</div>
                <div className="text-xs text-[#CBD5E1] mt-1 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main footer grid */}
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1 — Brand */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <Link to="/" className="group inline-flex items-end gap-1">
              <span className="font-heading font-bold text-white text-4xl tracking-wide group-hover:text-accent transition-colors duration-200">
                Volfram
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mb-2 ml-0.5" />
            </Link>
            <p className="text-sm leading-relaxed text-[#CBD5E1]">
              Together we make industry efficient, safe and future-ready through precision steam engineering.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="social-btn w-9 h-9 rounded-sm border border-white/20 flex items-center justify-center text-[#CBD5E1]"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            <p className="text-xs text-[#94A3B8] italic mt-2">
              Principal Distributor for India, Bangladesh &amp; Sri Lanka — Walchem &amp; Pyxis Lab
            </p>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white text-xl tracking-wide mb-5">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="footer-link text-sm text-[#CBD5E1]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Products */}
          <div>
            <h4 className="font-heading font-semibold text-white text-xl tracking-wide mb-5">
              Products
            </h4>
            <ul className="flex flex-col gap-2.5">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="footer-link text-sm text-[#CBD5E1]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white text-xl tracking-wide mb-5">
              Let's Connect
            </h4>

            {/* Email */}
            <a
              href="mailto:steam@volfram.in"
              className="footer-link text-sm text-accent flex items-center gap-2 mb-5 font-semibold"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              steam@volfram.in
            </a>

            {/* Phone numbers */}
            <div className="flex flex-col gap-3">
              {contacts.map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-[#94A3B8] uppercase tracking-wide">{c.dept}</div>
                    <div className="text-sm text-[#E2E8F0] font-medium">{c.phone}</div>
                  </div>
                  <a
                    href={c.wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wa-pill flex items-center gap-1.5 text-xs border border-white/20 rounded-sm px-2.5 py-1.5 text-[#CBD5E1] shrink-0"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Address band */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h5 className="font-heading font-semibold text-white text-base tracking-wide mb-2">Corporate Office / Admin Office</h5>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                402, Rutuvihar, Waranasi Society,<br />
                Warje, Pune – 411058,<br />
                Maharashtra, India
              </p>
            </div>
            <div>
              <h5 className="font-heading font-semibold text-white text-base tracking-wide mb-2">Manufacturing Unit</h5>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                Akurdi Industrial Estate, Plot No. 3B+3 Part / 32,<br />
                D-1 Block, MIDC, Chinchwad,<br />
                Pune – 411019, Maharashtra, India
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-divider" />
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>© {new Date().getFullYear()} Volfram Systems India Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            {legalLinks.map((l) => (
              <Link key={l.label} to={l.to} className="hover:text-white transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
