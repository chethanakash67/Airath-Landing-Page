import { useEffect, useRef, useState } from 'react';
import "./LandingPage.css";

// Import images - adjust paths as needed
import motorImg from "../assets/motor.png";
import filterImg from "../assets/filter.png";
import lightImg from "../assets/light.png";
import chipImg from "../assets/chip.png";

const LandingPage = () => {
  const [loaderHidden, setLoaderHidden] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [activeTech, setActiveTech] = useState('motor');
  
  const magneticTargetRef = useRef(null);
  const specBlocksRef = useRef([]);
  const storyNodesRef = useRef([]);

  // Tech content mapping
  const techContent = {
    motor: { img: motorImg, label: "SYSTEM: BLDC MOTOR" },
    filter: { img: filterImg, label: "SYSTEM: HEPA FILTRATION" },
    light: { img: lightImg, label: "SYSTEM: SMART LED" },
    chip: { img: chipImg, label: "SYSTEM: IOT SENSORS" },
    fragrance: { img: motorImg, label: "SYSTEM: DIFFUSION" }
  };

  // Loader sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaderHidden(true);
      document.body.style.overflow = "visible";
      document.body.style.overflowX = "hidden";
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Magnetic tilt effect
  useEffect(() => {
    if (!magneticTargetRef.current) return;

    let mouseX = 0, mouseY = 0;
    let isMoving = false;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isMoving) {
        requestAnimationFrame(() => {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const deltaX = mouseX - centerX;
          const deltaY = mouseY - centerY;

          const moveX = deltaX * 0.02;
          const moveY = deltaY * 0.02;
          const rotateX = -deltaY * 0.01;
          const rotateY = deltaX * 0.01;

          if (magneticTargetRef.current) {
            magneticTargetRef.current.style.transform = 
              `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          }
          isMoving = false;
        });
        isMoving = true;
      }
    };

    const handleMouseLeave = () => {
      if (magneticTargetRef.current) {
        magneticTargetRef.current.style.transform = 
          `translate3d(0, 0, 0) rotateX(0) rotateY(0)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Tech specs intersection observer
  useEffect(() => {
    const techObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const techType = entry.target.getAttribute('data-tech');
          setActiveTech(techType);
        }
      });
    }, {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    });

    specBlocksRef.current.forEach(block => {
      if (block) techObserver.observe(block);
    });

    return () => techObserver.disconnect();
  }, []);

  // Story nodes reveal
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }
      });
    }, { threshold: 0.2 });

    storyNodesRef.current.forEach(node => {
      if (node) {
        node.style.opacity = '0';
        node.style.transform = 'translateX(-20px)';
        node.style.transition = 'all 0.6s ease-out';
        revealObserver.observe(node);
      }
    });

    return () => revealObserver.disconnect();
  }, []);

  return (
    <>
      {/* Loader */}
      <div id="loader" style={{ transform: loaderHidden ? 'translateY(-100%)' : 'translateY(0)' }}>
        <div className="loader-content">
          <span className="intro-word">Integrated.</span>
          <span className="intro-word">Intelligent.</span>
          <span className="intro-word">Invisible.</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`glass-nav ${navScrolled ? 'scrolled' : ''}`} aria-label="Main Navigation">
        <div className="nav-container">
          <div className="logo">AIRATH</div>
          <ul className="nav-links">
            <li><a href="#tech-deep-dive">Technology</a></li>
            <li><a href="#how-it-works">How it works</a></li>
            <li><a href="#about">About</a></li>
          </ul>
          <div className="nav-cta">
            <a href="tel:1111111" className="btn-primary">Inquire Now</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="hero">
        <div className="container magnetic-wrap">
          <p className="badge">Where Innovation meets inhalation.</p>
          <h1 ref={magneticTargetRef} className="magnetic-target">
            The World's First<br />
            <span className="text-gradient">Integrated 5-in-1</span><br />
            Ceiling Hub
          </h1>
          <p className="description">
            AIRATH is the only ceiling device that does it all. It packs a medical-grade air purifier, high-velocity circulation, and smart LED lights into one compact unit. Its smart sensors "breathe" with you—automatically cleaning the air and freshening the room whenever needed.
          </p>
          <div className="air-quality-pill">
            <span className="status-dot"></span>
            Air Quality: 99%
          </div>
        </div>
      </main>

      {/* Tech Deep Dive */}
      <section id="tech-deep-dive" className="tech-deep-dive">
        <div className="deep-dive-container">
          <div className="tech-specs-column">
            <div className="specs-header">
              <p className="badge">Internal Engineering</p>
              <h2 className="section-title">A closer look at the 5-in-1 technology within the <span className="text-gradient">AIRATH Hub.</span></h2>
            </div>

            <div 
              className={`spec-block ${activeTech === 'motor' ? 'active' : ''}`}
              data-tech="motor"
              ref={el => specBlocksRef.current[0] = el}
            >
              <div className="spec-index">01</div>
              <h3>High-Velocity BLDC Motor</h3>
              <p>Engineered with Brushless DC (BLDC) technology, our motor delivers powerful, high-velocity air circulation.</p>
              <div className="edge-box"><strong>The Edge:</strong> Consumes up to 50% less energy than induction motors.</div>
            </div>

            <div 
              className={`spec-block ${activeTech === 'filter' ? 'active' : ''}`}
              data-tech="filter"
              ref={el => specBlocksRef.current[1] = el}
            >
              <div className="spec-index">02</div>
              <h3>Medical-Grade HEPA H13 Filtration</h3>
              <p>Equipped with an advanced HEPA H13 filter, AIRATH captures 99.9% of airborne particles.</p>
              <div className="edge-box"><strong>The Edge:</strong> Effectively eliminates PM2.5, pollen, and smoke.</div>
            </div>

            <div 
              className={`spec-block ${activeTech === 'light' ? 'active' : ''}`}
              data-tech="light"
              ref={el => specBlocksRef.current[2] = el}
            >
              <div className="spec-index">03</div>
              <h3>Adaptive Smart LED Lighting</h3>
              <p>Fully dimmable and color-tunable via the AIRATH App to improve your circadian rhythm.</p>
              <div className="edge-box"><strong>The Edge:</strong> Switch from Cool White (6500K) to Warm Amber (2700K).</div>
            </div>

            <div 
              className={`spec-block ${activeTech === 'chip' ? 'active' : ''}`}
              data-tech="chip"
              ref={el => specBlocksRef.current[3] = el}
            >
              <div className="spec-index">04</div>
              <h3>Intelligent Sensory Suite (IoT)</h3>
              <p>High-precision IoT sensors constantly scan your environment for VOCs and PM2.5 levels.</p>
              <div className="edge-box"><strong>The Edge:</strong> In Auto-Mode, the device thinks for you, adjusting speed instantly.</div>
            </div>

            <div 
              className={`spec-block ${activeTech === 'fragrance' ? 'active' : ''}`}
              data-tech="fragrance"
              ref={el => specBlocksRef.current[4] = el}
            >
              <div className="spec-index">05</div>
              <h3>Integrated Fragrance Diffusion</h3>
              <p>A refillable fragrance module that neutralizes odors and releases subtle aromas.</p>
              <div className="edge-box"><strong>The Edge:</strong> Subtle, consistent aroma without any chemical residue.</div>
            </div>
          </div>

          <div className="tech-visual-column">
            <div className="sticky-xray-wrap">
              <div className="xray-hub">
                <img 
                  src={techContent[activeTech]?.img} 
                  id="main-hub-image" 
                  alt="AIRATH Internal Component View"
                />
              </div>
              <div className="tech-label-display">
                <span id="active-label">{techContent[activeTech]?.label}</span>
                <div className="scanning-line"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="hiw-bento-section">
        <div className="bento-container">
          <div className="bento-header">
            <p className="badge">Internal Engineering</p>
            <h2 className="section-title">The 5-in-1 Integration: <span className="text-gradient">How it Works</span></h2>
          </div>

          <div className="bento-grid">
            <div 
              className="bento-card large purification"
              onMouseEnter={() => setActiveCard('purification')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="card-content">
                <span className="card-num">01</span>
                <h3>Advanced Air Purification</h3>
                <p>Our high-density H13 HEPA Filtration system sits at the top of the unit. By pulling air from the ceiling's natural convection currents, it captures 99.9% of dust, allergens, and VOCs before they settle.</p>
              </div>
              <div className="card-visual">
                <div className="filter-mesh"></div>
              </div>
            </div>

            <div 
              className="bento-card medium circulation"
              onMouseEnter={() => setActiveCard('circulation')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="card-content">
                <span className="card-num">02</span>
                <h3>Aero-Dynamic Circulation</h3>
                <p>Custom-engineered fan blades are designed for silent, high-velocity output. The motor is decoupled from the frame to eliminate vibration, providing a consistent 360° breeze that reaches every corner of the room.</p>
              </div>
            </div>

            <div 
              className="bento-card tall brain"
              onMouseEnter={() => setActiveCard('brain')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="card-content">
                <div className="brain-glow"></div>
                <span className="card-num">05</span>
                <h3>AQI Sensor + Auto-Mode</h3>
                <p>The "Brain" of the unit. High-precision PM2.5 sensors monitor your air quality 24/7. In Auto-Mode, AIRATH thinks for you—adjusting fan speeds and purification levels the moment pollutants are detected.</p>
              </div>
            </div>

            <div 
              className="bento-card small led"
              onMouseEnter={() => setActiveCard('led')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="card-content">
                <span className="card-num">03</span>
                <h3>Intelligent LED Matrix</h3>
                <p>We replaced bulky bulbs with a flush-mounted Smart LED Array. Fully dimmable and color-tunable, it provides high-CRI lighting that mimics natural sunlight during the day and warm ambient tones at night.</p>
              </div>
            </div>

            <div 
              className="bento-card small diffusion"
              onMouseEnter={() => setActiveCard('diffusion')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="card-content">
                <span className="card-num">04</span>
                <h3>Micro-Droplet Diffusion</h3>
                <p>The integrated Air Freshener uses the unit's natural airflow to disperse scents evenly. Unlike traditional sprays, our cold-mist tech ensures a consistent, long-lasting fragrance without the chemical "wet" residue.</p>
              </div>
            </div>
          </div>

          <div className="convergence-banner">
            <div className="conv-intro">
              <h3>Why Hardware Convergence Matters</h3>
            </div>
            <div className="conv-details">
              <div className="conv-box">
                <strong>Energy Efficiency:</strong>
                <p>One power source drives five functions, reducing energy consumption by up to 40% compared to five separate devices.</p>
              </div>
              <div className="conv-box">
                <strong>IoT Synchronization:</strong>
                <p>A single app controls your entire environment. Set schedules, monitor air health, and customize lighting from anywhere in the world.</p>
              </div>
              <div className="conv-box">
                <strong>Seamless Installation:</strong>
                <p>Designed to fit standard ceiling mounts, AIRATH transforms your existing electrical point into a total climate command center.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-header">
            <p className="badge">Our Story</p>
            <h2 className="about-title">Breathing New Life into <span className="text-gradient">Indian Homes</span></h2>
          </div>

          <div className="story-timeline">
            <div className="story-node" ref={el => storyNodesRef.current[0] = el}>
              <div className="node-meta">01 / The Challenge</div>
              <div className="node-content">
                <h3>The Problem</h3>
                <p>Urban living in India is getting crowded. Between bulky air purifiers, floor fans, and scattered lighting, our homes are becoming cluttered, while the air we breathe indoors is often <strong>5x more polluted</strong> than the air outside.</p>
              </div>
            </div>

            <div className="story-node" ref={el => storyNodesRef.current[1] = el}>
              <div className="node-meta">02 / The Solution</div>
              <div className="node-content">
                <h3>The Innovation</h3>
                <p>AIRATH was founded to solve this with a single question: <em>Why take up floor space for something the ceiling can do better?</em></p>
                <p>We engineered the world's first integrated ceiling ecosystem—combining medical-grade purification, high-speed circulation, and smart lighting into one <strong>"zero-footprint"</strong> device. We didn't just build a 5-in-1 appliance; we redefined the Indian ceiling.</p>
              </div>
            </div>

            <div className="story-node" ref={el => storyNodesRef.current[2] = el}>
              <div className="node-meta">03 / Our Mission</div>
              <div className="node-content">
                <h3>Invisible & Effortless</h3>
                <p>To make clean air and smart living invisible, effortless, and accessible. We are part of the <strong>Make in India</strong> movement, designing intelligent hardware specifically for the Indian climate—tackling everything from heavy dust to urban pollutants through seamless IoT technology.</p>
              </div>
            </div>
          </div>

          <div className="promise-grid">
            <div className="promise-card">
              <h4>Integrated</h4>
              <p>5 essential devices. 1 power point.</p>
            </div>
            <div className="promise-card">
              <h4>Intelligent</h4>
              <p>IoT-enabled sensors that think for you.</p>
            </div>
            <div className="promise-card">
              <h4>Invisible</h4>
              <p>Zero floor clutter. Maximum impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo">AIRATH</div>
            <p className="brand-statement">
              Redefining the Indian ceiling with integrated 5-in-1 technology. We make clean air and smart living invisible, effortless, and accessible.
            </p>
            <div className="make-in-india-tag">
              <span className="flag-icon">🇮🇳</span> Proudly Make in India
            </div>
          </div>

          <div className="footer-links">
            <h4>Explore</h4>
            <ul>
              <li><a href="#tech-deep-dive">Technology</a></li>
              <li><a href="#how-it-works">How it Works</a></li>
              <li><a href="#about">Our Story</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Inquiries</h4>
            <div className="contact-block">
              <p>Experience AIRATH first-hand</p>
              <a href="mailto:support@airath.in" className="footer-email">support@airath.in</a>
            </div>
            
            <div className="office-block">
              <p className="office-label">Head Office</p>
              <address>
                48/5, Someswara layout, Indiranagar, Bengaluru, 560008
              </address>
              <p className="office-label">Contact us</p>
              <p className="phone-no">+91 9346561315</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="bottom-container">
            <p>&copy; 2026 AIRATH Innovations. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;