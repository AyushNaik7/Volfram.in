import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./Home.css";

export default function Home() {
  const observerRef = useRef(null);

  useEffect(() => {
    // Scroll animation observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="home-page">
      {/* Hero + Volfram Intro Combined Section */}
      <section className="hero-volfram-combined">
        <img
          src="/Clients/homepage.png"
          alt="Industrial Steam Engineering"
          className="hero-combined-image"
        />
        
        <div className="hero-combined-overlay"></div>
        
        <div className="hero-combined-content">
          <div className="container-custom">
            <div className="hero-copy scroll-animate">
              <h1 className="hero-title">We are Volfram</h1>
              <p className="hero-tagline">
                Engineering smarter steam systems for a more efficient industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Solutions */}
      <section className="engineering-section scroll-animate">
        <div className="container-custom text-center">
          <h2 className="big-title">Engineering Solutions for a Changing World</h2>
          <Link to="/about" className="learn-more-btn">About us</Link>
        </div>
      </section>

      {/* Video Gallery */}
      <section className="video-gallery scroll-animate">
        <div className="container-custom">
          <div className="video-grid">
            <div className="video-card scroll-animate">
              <div className="video-thumbnail">
                <img src="/Clients/homepage2.png" alt="Video" />
                <div className="play-overlay">
                  <div className="play-button">▶</div>
                  <span className="duration">01:13</span>
                </div>
              </div>
              <h3>Fully Automatic Industrial Autoclave</h3>
              <p>Engineered for Safe and Uniform Curing Process</p>
            </div>

            <div className="video-card scroll-animate">
              <div className="video-thumbnail">
                <img src="/Clients/homepage3.png" alt="Video" />
                <div className="play-overlay">
                  <div className="play-button">▶</div>
                  <span className="duration">00:57</span>
                </div>
              </div>
              <h3>Volfram Auto Blow Down System</h3>
              <p>Reliable TDS-based automatic blowdown control</p>
            </div>

            <div className="video-card scroll-animate">
              <div className="video-thumbnail">
                <img src="/Clients/homepage.png" alt="Video" />
                <div className="play-overlay">
                  <div className="play-button">▶</div>
                  <span className="duration">02:14</span>
                </div>
              </div>
              <h3>Boiler India Exhibition 2022</h3>
              <p>Global networking and innovation showcase</p>
            </div>

            <div className="video-card scroll-animate">
              <div className="video-thumbnail">
                <img src="/Clients/homepage2.png" alt="Video" />
                <div className="play-overlay">
                  <div className="play-button">▶</div>
                  <span className="duration">01:46</span>
                </div>
              </div>
              <h3>Boiler India Expo 2024</h3>
              <p>Launch of Smart Boiler Controller</p>
            </div>
          </div>
        </div>
      </section>

      {/* Together Section */}
      <section className="together-section scroll-animate">
        <div className="container-custom text-center">
          <h2 className="section-title white">Together We Can Make Industry Efficient and Safe</h2>
          
          <div className="distributor-info">
            <h3>Principal Distributor for India, Bangladesh and Srilanka</h3>
            <div className="partner-logos">
              <img
                src="/Clients/walchem_iwaki_america_inc-275%20logo.avif"
                alt="Walchem, an Iwaki America company"
              />
              <img src="/Clients/Pyxis%20logo.avif" alt="Pyxis Lab" />
            </div>
          </div>
        </div>
      </section>

      {/* Industry Sectors */}
      <section className="sectors-section scroll-animate">
        <div className="container-custom">
          <div className="sectors-grid">
            <div className="sector-card scroll-animate" style={{backgroundImage: 'url("/Clients/volfram pharmaceutical_edited.avif")'}}>
              <h3>Pharmaceutical<br/>& Chemical</h3>
            </div>
            <div className="sector-card scroll-animate" style={{backgroundImage: 'url("/Clients/Volfram food and beverages_edited.avif")'}}>
              <h3>Food &<br/>Beverage</h3>
            </div>
            <div className="sector-card scroll-animate" style={{backgroundImage: 'url("/Clients/Volfram Textile and Paper  Projects.avif")'}}>
              <h3>Textile & Paper</h3>
            </div>
            <div className="sector-card scroll-animate" style={{backgroundImage: 'url("/Clients/volfram Oil and Gas.avif")'}}>
              <h3>Oil & Gas</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Steam Services */}
      <section className="services-section scroll-animate">
        <div className="container-custom">
          <h2 className="section-title">Engineering Steam</h2>
          
          <div className="services-grid">
            <Link to="/products" className="service-card scroll-animate">
              <div className="service-image">
                <img src="/Clients/homepage.png" alt="Steam Distribution" />
              </div>
              <h3>Steam Distribution</h3>
              <p>Distribution of Steam efficiently by controlling pressure and temperature</p>
            </Link>

            <Link to="/products" className="service-card scroll-animate">
              <div className="service-image">
                <img src="/Clients/homepage2.png" alt="Customized Solutions" />
              </div>
              <h3>Customized Package Solutions</h3>
              <p>Customized Products Build for Specific requirement of the Client.</p>
            </Link>

            <Link to="/products" className="service-card scroll-animate">
              <div className="service-image">
                <img src="/Clients/homepage3.png" alt="Steam Generation" />
              </div>
              <h3>Steam Generation</h3>
              <p>Reliable and Efficient Steam Boiler</p>
            </Link>

            <Link to="/products" className="service-card scroll-animate">
              <div className="service-image">
                <img src="/Clients/homepage.png" alt="Boiler Accessories" />
              </div>
              <h3>Boiler House Accessories</h3>
              <p>Feed Tank to Boiler Automatic Blow Down System</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Pharmaceutical Solutions */}
      <section className="pharma-section scroll-animate">
        <div className="container-custom">
          <div className="pharma-grid">
            <div className="pharma-content scroll-animate">
              <h2>Single fluid system for precise heating and cooling application for pharmaceutical Industry</h2>
              <h3 className="pharma-subtitle">Customized Solution For Pharmaceutical Company</h3>
            </div>
            <div className="pharma-image scroll-animate">
              <img src="/Clients/homepage3.png" alt="Pharmaceutical Solutions" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section scroll-animate">
        <div className="container-custom text-center">
          <h2 className="section-title">Products For Every Steam System</h2>
          <Link to="/products" className="view-all-btn">View All Products</Link>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta scroll-animate">
        <div className="container-custom">
          <div className="cta-grid">
            <div className="cta-info">
              <h2>Volfram Systems India Pvt. Ltd.</h2>
              <div className="office-info">
                <div>
                  <h4>Corporate Office / Admin Office</h4>
                  <p>402, Rutuvihar, Waranasi Society,<br/>Warje, Pune - 411058, Maharashtra, India</p>
                </div>
                <div>
                  <h4>Manufacturing Unit</h4>
                  <p>Akurdi Industrial Estate, Plot No. 3B+3 Part / 32,<br/>D-1 Block, MIDC, Chinchwad, Pune - 411019, Maharashtra, India</p>
                </div>
              </div>
            </div>
            
            <div className="cta-contact">
              <h3>Let's Connect.</h3>
              <div className="contact-methods">
                <a href="mailto:steam@volfram.in" className="contact-link">
                  📧 steam@volfram.in
                </a>
                <div className="phone-group">
                  <h4>Sales Dept.</h4>
                  <a href="tel:+919309534688">+91 9309534688</a>
                  <a href="https://wa.link/ye9d49" className="whatsapp">+91 7798156167 WhatsApp</a>
                </div>
                <div className="phone-group">
                  <h4>Purchase Dept.</h4>
                  <a href="https://wa.link/nsrge1" className="whatsapp">+91 9172033598 WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
