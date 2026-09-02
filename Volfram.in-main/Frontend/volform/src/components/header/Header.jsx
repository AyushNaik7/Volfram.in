import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { fetchPublicPages } from "../../services/api";

const navLinks = [
  { label: "Home",      href: "/" },
  { label: "About Us",  href: "/about" },
  { label: "Services",  href: "/services" },
  { label: "Products",  href: "/products" },
  { label: "Clients",   href: "/clients" },
  { label: "Gallery",   href: "/gallery" },
  { label: "Events",    href: "/events" },
  { label: "Downloads", href: "/downloads" },
  { label: "Contact Us",href: "/contact" },
  { label: "Login",     href: "/login" },
];

function Header() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [pagesOpen, setPagesOpen]   = useState(false);
  const [pages, setPages]           = useState([]);
  const [pagesLoading, setPagesLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPagesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch pages when dropdown opens
  const handlePagesToggle = async () => {
    if (!pagesOpen && pages.length === 0) {
      setPagesLoading(true);
      try {
        const data = await fetchPublicPages();
        setPages(data);
      } catch {
        setPages([]);
      } finally {
        setPagesLoading(false);
      }
    }
    setPagesOpen(prev => !prev);
  };

  // Refresh pages list (called after opening, so it's always fresh)
  const handleMobilePagesToggle = async () => {
    setPagesLoading(true);
    try {
      const data = await fetchPublicPages();
      setPages(data);
    } catch {
      setPages([]);
    } finally {
      setPagesLoading(false);
    }
  };

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

        /* Pages dropdown */
        .pages-dropdown-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          background: linear-gradient(135deg, #0f2d4d, #146c8a);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'Barlow', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          box-shadow: 0 3px 10px rgba(15,45,77,0.25);
          letter-spacing: 0.2px;
        }
        .pages-dropdown-btn:hover {
          background: linear-gradient(135deg, #146c8a, #0f2d4d);
          box-shadow: 0 5px 16px rgba(15,45,77,0.35);
          transform: translateY(-1px);
        }
        .pages-dropdown-btn .chevron {
          transition: transform 0.25s ease;
        }
        .pages-dropdown-btn.open .chevron {
          transform: rotate(180deg);
        }

        /* Dropdown panel */
        .pages-dropdown-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 240px;
          max-width: 320px;
          background: #fff;
          border: 1px solid #d5dee7;
          border-radius: 12px;
          box-shadow: 0 16px 48px rgba(15,45,77,0.16), 0 4px 12px rgba(15,45,77,0.08);
          overflow: hidden;
          z-index: 1000;
          animation: dropIn 0.2s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .pages-dropdown-header {
          padding: 12px 16px 10px;
          border-bottom: 1px solid #f2f5f8;
          background: linear-gradient(135deg, #0f2d4d, #146c8a);
        }
        .pages-dropdown-header span {
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .pages-dropdown-list {
          max-height: 340px;
          overflow-y: auto;
          padding: 6px 0;
        }
        .pages-dropdown-list::-webkit-scrollbar { width: 4px; }
        .pages-dropdown-list::-webkit-scrollbar-track { background: #f2f5f8; }
        .pages-dropdown-list::-webkit-scrollbar-thumb { background: #d5dee7; border-radius: 4px; }

        .pages-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          text-decoration: none;
          transition: background 0.15s;
          border-bottom: 1px solid #f8fafc;
        }
        .pages-dropdown-item:last-child { border-bottom: none; }
        .pages-dropdown-item:hover { background: #f2f5f8; }

        .pages-dropdown-item-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #d9732d;
          flex-shrink: 0;
        }
        .pages-dropdown-item-text {
          flex: 1;
          min-width: 0;
        }
        .pages-dropdown-item-title {
          display: block;
          font-family: 'Barlow', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #0f2d4d;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pages-dropdown-item-cat {
          display: block;
          font-size: 11px;
          color: #70879b;
          margin-top: 1px;
        }
        .pages-dropdown-arrow {
          color: #a3b5c3;
          flex-shrink: 0;
        }

        .pages-dropdown-empty {
          padding: 24px 16px;
          text-align: center;
          font-size: 13px;
          color: #70879b;
          font-family: 'Barlow', sans-serif;
        }
        .pages-dropdown-loading {
          padding: 20px 16px;
          text-align: center;
          font-size: 13px;
          color: #70879b;
          font-family: 'Barlow', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .pages-spin {
          width: 14px; height: 14px;
          border: 2px solid #d5dee7;
          border-top-color: #146c8a;
          border-radius: 50%;
          animation: pSpin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes pSpin { to { transform: rotate(360deg); } }

        /* Mobile dropdown section */
        .mobile-pages-section {
          border-top: 1px solid #e8edf3;
          margin-top: 8px;
          padding-top: 8px;
        }
        .mobile-pages-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          font-family: 'Barlow', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #0f2d4d;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
        }
        .mobile-pages-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-bottom: 6px;
        }
        .mobile-pages-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 8px;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s;
        }
        .mobile-pages-item:hover { background: #f2f5f8; }
        .mobile-pages-item-title {
          font-size: 13px;
          font-weight: 500;
          color: #112235;
          font-family: 'Barlow', sans-serif;
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
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 8px 16px rgba(15,45,77,0.25);
        }
        .top-steam-strip {
          background: linear-gradient(90deg, #081f36, #103f62);
          border-bottom: 1px solid rgba(255,255,255,0.08);
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
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="logo-plate inline-flex pl-0 items-center justify-center rounded-md text-base font-bold text-white">
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
                    isActive ? "text-primary active" : "text-text-primary hover:text-primary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side — Pages dropdown + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Pages dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                className={`pages-dropdown-btn ${pagesOpen ? 'open' : ''}`}
                onClick={handlePagesToggle}
                aria-label="View all pages"
                aria-expanded={pagesOpen}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                Pages
                <svg className="chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {pagesOpen && (
                <div className="pages-dropdown-panel" role="menu">
                  <div className="pages-dropdown-header">
                    <span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display:'inline', marginRight:6, verticalAlign:'middle' }}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      All Pages
                    </span>
                  </div>

                  <div className="pages-dropdown-list">
                    {pagesLoading ? (
                      <div className="pages-dropdown-loading">
                        <span className="pages-spin" /> Loading…
                      </div>
                    ) : pages.length === 0 ? (
                      <div className="pages-dropdown-empty">No pages created yet</div>
                    ) : (
                      pages.map((pg) => (
                        <Link
                          key={pg._id}
                          to={`/pages/${pg._id}`}
                          className="pages-dropdown-item"
                          onClick={() => setPagesOpen(false)}
                          role="menuitem"
                        >
                          <span className="pages-dropdown-item-dot" />
                          <span className="pages-dropdown-item-text">
                            <span className="pages-dropdown-item-title">{pg.title}</span>
                            {pg.category && (
                              <span className="pages-dropdown-item-cat">{pg.category}</span>
                            )}
                          </span>
                          <span className="pages-dropdown-arrow">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 18l6-6-6-6"/>
                            </svg>
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link to="/contact" className="btn-cta">
              Request Consultation
              <svg className="w-3.5 h-3.5 ml-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

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
                        isActive ? "text-primary" : "text-text-primary hover:text-primary"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Mobile Pages Section */}
            <MobilePagesSection
              pages={pages}
              loading={pagesLoading}
              onOpen={handleMobilePagesToggle}
              onClose={() => setMenuOpen(false)}
            />

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

// Mobile accordion for pages
function MobilePagesSection({ pages, loading, onOpen, onClose }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    if (!open) onOpen();
    setOpen(prev => !prev);
  };

  return (
    <div className="mobile-pages-section">
      <button className="mobile-pages-header" onClick={toggle}>
        <span style={{ display:'flex', alignItems:'center', gap:7 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f2d4d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          Pages
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#455b70"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition:'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="mobile-pages-list">
          {loading ? (
            <div style={{ padding:'12px 8px', fontSize:13, color:'#70879b', display:'flex', alignItems:'center', gap:8 }}>
              <span className="pages-spin" /> Loading…
            </div>
          ) : pages.length === 0 ? (
            <div style={{ padding:'12px 8px', fontSize:13, color:'#70879b' }}>No pages created yet</div>
          ) : (
            pages.map(pg => (
              <Link
                key={pg._id}
                to={`/pages/${pg._id}`}
                className="mobile-pages-item"
                onClick={onClose}
              >
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#d9732d', flexShrink:0 }} />
                <span className="mobile-pages-item-title">{pg.title}</span>
                {pg.category && (
                  <span style={{ fontSize:11, color:'#70879b', marginLeft:'auto' }}>{pg.category}</span>
                )}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
