import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Clients", href: "/clients" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "Downloads", href: "/downloads" },
  { label: "Contact Us", href: "/contact" },
  { label: "Login", href: "/login" }
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        .nav-link-line::after {
          content: '';
          display: block;
          height: 2px;
          background: #d9732d;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
          margin-top: 2px;
        }
        .nav-link-line:hover::after,
        .nav-link-line.active::after {
          transform: scaleX(1);
        }
        .mobile-menu-enter {
          animation: slideDown 0.3s ease forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .logo-plate {
          background: linear-gradient(135deg, #0f2d4d, #146c8a);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 16px rgba(15, 45, 77, 0.25);
        }
        .top-steam-strip {
          background: linear-gradient(90deg, #081f36, #103f62);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>

      <div className="top-steam-strip text-xs text-slate-200">
        <div className="container-custom flex items-center justify-between py-2">
          <p className="hidden md:block text-slate-200">Engineering Solutions for a Changing World</p>
          <div className="flex gap-4">
            <a href="mailto:steam@volfram.in" className="hover:text-white transition-colors">steam@volfram.in</a>
            <span className="hidden sm:inline">+91 9309534688</span>
          </div>
        </div>
      </div>

      <header
        className={`navbar left-0 w-full transition-all duration-300 font-body ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
            : "bg-white/92 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container-custom flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="logo-plate inline-flex pl-0  items-center justify-center rounded-md text-base font-bold text-white">
              <img src="/Clients/logo.png" alt="Volfram Systems" />
            </span>
            <span>
              <span className="block font-heading font-bold text-primary text-xl tracking-wide group-hover:text-primary-dark transition-colors duration-200">
                Volfram Systems
              </span>
              <span className="hidden sm:block text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Steam Technology Partner
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden flex-1 justify-center lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  `nav-link-line text-sm font-medium tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-primary active"
                      : "text-text-primary hover:text-primary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA Button — desktop */}
          <Link to="/contact" className="hidden lg:inline-flex btn-cta">
            Request Consultation
            <svg className="w-3.5 h-3.5 ml-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col justify-center items-center gap-1.5 w-9 h-9 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 bg-text-primary transition-all duration-300 ${menuOpen ? "w-6 rotate-45 translate-y-2" : "w-6"}`} />
            <span className={`block h-0.5 bg-text-primary transition-all duration-300 ${menuOpen ? "opacity-0 w-4" : "w-4"}`} />
            <span className={`block h-0.5 bg-text-primary transition-all duration-300 ${menuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-6"}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden mobile-menu-enter bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 pb-6 pt-4 shadow-lg absolute w-full left-0 top-[100%]">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-2.5 text-sm font-medium tracking-wide border-b border-gray-100 transition-colors duration-150 ${
                        isActive
                          ? "text-primary"
                          : "text-text-primary hover:text-primary"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-5 w-full btn-cta"
            >
              Request Consultation
            </Link>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
