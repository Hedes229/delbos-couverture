import { useState, useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────
   STYLES GLOBAUX
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cream:   #F7F3ED;
      --charcoal:#151412;
      --brick:   #A84A28;
      --brick-d: #8a3d20;
      --cream-d: #EDE7DC;
      --ink:     #2d2a27;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--cream);
      color: var(--charcoal);
      font-family: 'DM Sans', sans-serif;
      font-weight: 300;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar       { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--cream); }
    ::-webkit-scrollbar-thumb { background: var(--brick); border-radius: 2px; }
    ::selection { background: var(--brick); color: var(--cream); }

    /* Fade-up animation */
    .fu {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity .75s cubic-bezier(.16,1,.3,1), transform .75s cubic-bezier(.16,1,.3,1);
    }
    .fu.in { opacity: 1; transform: translateY(0); }
    .fu-d1 { transition-delay: .1s; }
    .fu-d2 { transition-delay: .2s; }
    .fu-d3 { transition-delay: .3s; }

    /* Nav */
    .desktop-nav { display: flex; gap: 2.5rem; list-style: none; }
    .nav-cta     { display: flex; }
    .hamburger   { display: none; flex-direction: column; gap: 5px; cursor: pointer;
                   background: none; border: none; padding: 4px; }
    .hamburger span {
      display: block; width: 24px; height: 1.5px;
      background: #F7F3ED;
      transition: transform .3s, opacity .3s;
    }
    .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

    /* Mobile menu */
    .mobile-menu {
      position: fixed; inset: 0; z-index: 90;
      background: rgba(21,20,18,.97);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 2.5rem;
      transform: translateX(100%);
      transition: transform .45s cubic-bezier(.16,1,.3,1);
    }
    .mobile-menu.open { transform: translateX(0); }
    .mobile-menu a {
      font-family: 'Cormorant Garamond'; font-size: 2.2rem; font-weight: 400;
      color: #F7F3ED; text-decoration: none; letter-spacing: .02em;
      transition: color .2s;
    }
    .mobile-menu a:hover { color: #A84A28; }

    /* Grid helpers */
    .g2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%,420px),1fr)); }
    .g3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); }
    .g6 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr)); }

    /* Input reset */
    input, textarea, select {
      font-family: 'DM Sans'; font-weight: 300;
      background: transparent; outline: none;
    }
    input::placeholder, textarea::placeholder { color: rgba(21,20,18,.38); }

    /* Focus ring */
    input:focus, textarea:focus, select:focus { outline: none; }

    /* Hover states for prestation cards */
    .pcard:hover .pcard-img  { transform: scale(1.06); filter: brightness(.28); }
    .pcard:hover .pcard-title { transform: translateY(-6px); }
    .pcard:hover .pcard-desc  { opacity: 1; transform: translateY(0); }

    /* Responsive */
    @media (max-width: 900px) {
      .desktop-nav, .nav-cta { display: none !important; }
      .hamburger { display: flex !important; }
    }
    @media (max-width: 640px) {
      .stat-bar { display: none; }
      .q-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
)

/* ─────────────────────────────────────────────
   HOOK : INTERSECTION OBSERVER (fade-up)
───────────────────────────────────────────── */
const useFadeUp = (threshold = 0.12) => {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('in'); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const links = [
    ['Savoir-faire', '#savoir-faire'],
    ['Prestations',  '#prestations'],
    ['Engagements',  '#engagements'],
    ['Témoignages',  '#temoignages'],
    ['Devis',        '#devis'],
  ]

  const close = () => setOpen(false)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 72, padding: '0 2.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(21,20,18,.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(168,74,40,.2)' : 'none',
        transition: 'background .4s ease, backdrop-filter .4s ease, border-color .4s ease',
      }}>
        {/* Logo */}
        <a href="#" onClick={close} style={{ textDecoration: 'none' }}>
          <div style={{
            fontFamily: 'Cormorant Garamond', fontSize: '1.35rem', fontWeight: 600,
            color: '#F7F3ED', letterSpacing: '.06em', lineHeight: 1,
          }}>DELBOS</div>
          <div style={{
            fontFamily: 'DM Sans', fontSize: '.58rem', fontWeight: 400,
            color: '#A84A28', letterSpacing: '.22em', textTransform: 'uppercase',
            marginTop: 3,
          }}>Couverture · Gironde</div>
        </a>

        {/* Desktop links */}
        <ul className="desktop-nav" style={{ margin: 0, padding: 0 }}>
          {links.map(([label, href]) => (
            <li key={href}>
              <a href={href} style={{
                fontFamily: 'DM Sans', fontSize: '.78rem', fontWeight: 400,
                color: 'rgba(247,243,237,.82)', textDecoration: 'none',
                letterSpacing: '.13em', textTransform: 'uppercase',
                transition: 'color .2s',
              }}
                onMouseEnter={e => e.target.style.color = '#A84A28'}
                onMouseLeave={e => e.target.style.color = 'rgba(247,243,237,.82)'}
              >{label}</a>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="#rappel" className="nav-cta" style={{
            background: '#A84A28', color: '#F7F3ED',
            fontFamily: 'DM Sans', fontSize: '.73rem', fontWeight: 500,
            letterSpacing: '.13em', textTransform: 'uppercase',
            padding: '.6rem 1.4rem', textDecoration: 'none',
            border: '1px solid #A84A28',
            transition: 'background .22s, color .22s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A84A28' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#A84A28'; e.currentTarget.style.color = '#F7F3ED' }}
          >Rappel gratuit</a>

          <button
            className={`hamburger${open ? ' open' : ''}`}
            onClick={() => setOpen(v => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={close}>{label}</a>
        ))}
        <a href="#rappel" onClick={close} style={{
          marginTop: '1rem',
          background: '#A84A28', color: '#F7F3ED',
          fontFamily: 'DM Sans', fontSize: '.8rem', fontWeight: 500,
          letterSpacing: '.15em', textTransform: 'uppercase',
          padding: '.85rem 2rem', textDecoration: 'none',
          fontStyle: 'normal',
        }}>Rappel gratuit</a>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  const ref = useFadeUp(.1)
  return (
    <section style={{
      position: 'relative', height: '100vh', minHeight: 680,
      display: 'flex', alignItems: 'flex-end', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center 40%',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(21,20,18,.92) 25%, rgba(21,20,18,.45) 65%, rgba(21,20,18,.25) 100%)',
      }} />

      {/* Content */}
      <div ref={ref} className="fu" style={{
        position: 'relative', zIndex: 2,
        padding: '0 2.5rem 6rem',
        maxWidth: 860,
      }}>
        <p style={{
          fontFamily: 'DM Sans', fontSize: '.73rem', fontWeight: 400,
          color: '#A84A28', letterSpacing: '.28em', textTransform: 'uppercase',
          marginBottom: '1.3rem',
        }}>Artisan couvreur · Gironde depuis 1987</p>

        <h1 style={{
          fontFamily: 'Cormorant Garamond', fontWeight: 600,
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          color: '#F7F3ED', lineHeight: 1.04,
          letterSpacing: '-.015em', marginBottom: '1.8rem',
        }}>
          L'art de la toiture,<br />
          <em style={{ fontStyle: 'italic', fontWeight: 300 }}>
            transmis de génération<br />en génération.
          </em>
        </h1>

        <p style={{
          fontFamily: 'DM Sans', fontWeight: 300, fontSize: '1rem',
          color: 'rgba(247,243,237,.68)', maxWidth: 480,
          lineHeight: 1.75, marginBottom: '2.8rem',
        }}>
          Rénovation, isolation, zinguerie — nous protégeons les toits des Girondins
          avec le soin et le savoir-faire de l'artisanat français.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#devis" style={{
            background: '#A84A28', color: '#F7F3ED',
            padding: '1rem 2.3rem', textDecoration: 'none',
            fontFamily: 'DM Sans', fontSize: '.82rem', fontWeight: 500,
            letterSpacing: '.12em', textTransform: 'uppercase',
            transition: 'background .22s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#8a3d20'}
            onMouseLeave={e => e.currentTarget.style.background = '#A84A28'}
          >Demander un devis</a>

          <a href="#savoir-faire" style={{
            border: '1px solid rgba(247,243,237,.35)', color: '#F7F3ED',
            padding: '1rem 2.3rem', textDecoration: 'none',
            fontFamily: 'DM Sans', fontSize: '.82rem', fontWeight: 400,
            letterSpacing: '.12em', textTransform: 'uppercase',
            transition: 'border-color .22s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#A84A28'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(247,243,237,.35)'}
          >Notre savoir-faire</a>
        </div>
      </div>

      {/* Stat bar */}
      <div className="stat-bar" style={{
        position: 'absolute', bottom: 0, right: 0, zIndex: 2,
        display: 'flex',
      }}>
        {[
          { n: '35+',   label: "ans d'expérience" },
          { n: '1 200', label: 'chantiers réalisés', accent: true },
          { n: '100%',  label: 'garantie décennale' },
        ].map((s, i) => (
          <div key={i} style={{
            background: s.accent ? '#A84A28' : 'rgba(21,20,18,.72)',
            backdropFilter: 'blur(10px)',
            padding: '1.6rem 2rem',
            borderTop: '1px solid rgba(247,243,237,.1)',
            textAlign: 'center', minWidth: 148,
          }}>
            <div style={{
              fontFamily: 'Cormorant Garamond', fontSize: '2.3rem',
              fontWeight: 600, color: '#F7F3ED', lineHeight: 1,
            }}>{s.n}</div>
            <div style={{
              fontFamily: 'DM Sans', fontSize: '.68rem', fontWeight: 300,
              color: 'rgba(247,243,237,.7)', letterSpacing: '.04em', marginTop: 5,
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        zIndex: 2,
      }}>
        <div style={{
          width: 1, height: 48,
          background: 'linear-gradient(to bottom, rgba(247,243,237,.5), transparent)',
        }} />
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   SAVOIR-FAIRE
───────────────────────────────────────────── */
function SavoirFaire() {
  const rText = useFadeUp()
  const rImg  = useFadeUp()
  const tags  = ['Couverture', 'Zinguerie', 'Charpente', 'Isolation', 'Ardoise', 'Tuile terre cuite']

  return (
    <section id="savoir-faire" style={{ padding: '10rem 2.5rem', maxWidth: 1200, margin: '0 auto' }}>
      <div className="g2" style={{ gap: '5rem', alignItems: 'center' }}>

        {/* Text */}
        <div ref={rText} className="fu">
          <p style={s.eyebrow}>Savoir-faire</p>
          <h2 style={s.h2black}>
            Trois décennies<br />
            <em style={s.italic}>d'excellence artisanale</em>
          </h2>
          <p style={{ ...s.body, marginBottom: '1.3rem' }}>
            Fondée en 1987, l'entreprise Delbos Couverture perpétue un savoir-faire transmis dans
            les règles de l'art. Chaque intervention — qu'il s'agisse d'une tuile manquante ou
            d'une réfection complète — mobilise la même exigence.
          </p>
          <p style={{ ...s.body, marginBottom: '2.8rem' }}>
            Notre équipe de compagnons qualifiés maîtrise l'ensemble des techniques de couverture :
            tuiles mécaniques, ardoises naturelles, zinc, charpente traditionnelle et isolation
            thermique par l'extérieur.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {tags.map(t => (
              <span key={t} style={{
                border: '1px solid rgba(21,20,18,.35)', color: '#151412',
                fontFamily: 'DM Sans', fontSize: '.7rem', fontWeight: 400,
                letterSpacing: '.1em', textTransform: 'uppercase',
                padding: '.4rem .85rem',
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Image */}
        <div ref={rImg} className="fu fu-d1" style={{ position: 'relative' }}>
          <div style={{ position: 'relative', width: '100%', paddingBottom: '118%', overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
              alt="Artisan couvreur au travail"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {/* Badge superposé */}
          <div style={{
            position: 'absolute', bottom: '-2.2rem', left: '-2rem',
            background: '#A84A28', color: '#F7F3ED',
            padding: '2rem', width: 170, textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'Cormorant Garamond', fontSize: '3rem',
              fontWeight: 600, lineHeight: 1,
            }}>35</div>
            <div style={{
              fontFamily: 'DM Sans', fontSize: '.62rem', fontWeight: 400,
              letterSpacing: '.12em', textTransform: 'uppercase',
              opacity: .88, marginTop: 5,
            }}>ans d'expérience</div>
          </div>
          {/* Ligne décorative */}
          <div style={{
            position: 'absolute', top: '2.5rem', right: '-1.5rem',
            width: 1, height: '55%',
            background: 'linear-gradient(to bottom, #A84A28 0%, transparent 100%)',
          }} />
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   MISSION / VISION / VALEURS
───────────────────────────────────────────── */
function Mission() {
  const ref = useFadeUp()
  const items = [
    {
      n: '01', label: 'Mission',
      title: 'Protéger ce qui compte',
      text: "Chaque toit que nous posons ou rénovons abrite une famille, une histoire. Notre mission est d'offrir une protection durable, dans les règles de l'art.",
    },
    {
      n: '02', label: 'Vision',
      title: "L'artisanat à l'ère de demain",
      text: "Concilier les techniques ancestrales et les exigences contemporaines d'efficacité énergétique. Un toit beau, solide et performant.",
    },
    {
      n: '03', label: 'Valeurs',
      title: 'Rigueur, honnêteté, durabilité',
      text: "Devis transparent, délais respectés, matériaux sélectionnés. Nous travaillons comme si c'était notre propre maison.",
    },
  ]

  return (
    <section style={{ background: '#151412', padding: '9rem 2.5rem' }}>
      <div ref={ref} className="fu" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <p style={s.eyebrowLight}>Qui sommes-nous</p>
        <h2 style={{ ...s.h2light, marginBottom: '5rem' }}>
          Ce qui nous anime,<br />
          <em style={s.italic}>chaque jour sur le chantier.</em>
        </h2>

        <div className="g3" style={{ gap: 0 }}>
          {items.map((item, i) => (
            <div key={i} style={{
              borderLeft: '1px solid rgba(247,243,237,.1)',
              borderRight: i === 2 ? '1px solid rgba(247,243,237,.1)' : 'none',
              padding: '2.8rem 2.5rem',
              position: 'relative',
            }}>
              <span style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem',
                fontFamily: 'Cormorant Garamond', fontSize: '4.5rem',
                fontWeight: 300, color: 'rgba(168,74,40,.12)', lineHeight: 1,
                userSelect: 'none',
              }}>{item.n}</span>
              <p style={s.eyebrowBrick}>{item.label}</p>
              <h3 style={{
                fontFamily: 'Cormorant Garamond', fontSize: '1.65rem',
                fontWeight: 500, color: '#F7F3ED', lineHeight: 1.2, marginBottom: '1rem',
              }}>{item.title}</h3>
              <p style={{
                fontFamily: 'DM Sans', fontWeight: 300, fontSize: '.88rem',
                color: 'rgba(247,243,237,.58)', lineHeight: 1.82,
              }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   RAPPEL TÉLÉPHONIQUE
───────────────────────────────────────────── */
function Rappel() {
  const ref = useFadeUp()
  const [form, setForm] = useState({ name: '', phone: '', time: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent]     = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = true
    if (!/^[\d\s\+\-\.]{7,}$/.test(form.phone)) e.phone = true
    if (!form.time) e.time = true
    return e
  }

  const handleSubmit = ev => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setSent(true)
  }

  const inp = field => ({
    width: '100%', padding: '.8rem 0',
    background: 'transparent', border: 'none',
    borderBottom: `1px solid ${errors[field] ? '#A84A28' : 'rgba(247,243,237,.25)'}`,
    fontFamily: 'DM Sans', fontSize: '.9rem', fontWeight: 300,
    color: '#F7F3ED', transition: 'border-color .2s',
  })

  return (
    <section id="rappel" style={{ background: '#1b1916', padding: '8rem 2.5rem' }}>
      <div ref={ref} className="fu g2" style={{ gap: '5rem', maxWidth: 920, margin: '0 auto', alignItems: 'center' }}>
        <div>
          <p style={s.eyebrowBrick}>Rappel gratuit</p>
          <h2 style={{ ...s.h2light, marginBottom: '1.4rem' }}>
            On vous rappelle<br />
            <em style={s.italic}>quand vous voulez.</em>
          </h2>
          <p style={{
            fontFamily: 'DM Sans', fontWeight: 300, fontSize: '.9rem',
            color: 'rgba(247,243,237,.55)', lineHeight: 1.8,
          }}>
            Laissez-nous vos coordonnées et le créneau qui vous convient.
            Notre équipe vous contacte sous 2 heures en jours ouvrables.
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{
              fontFamily: 'Cormorant Garamond', fontSize: '3.5rem',
              color: '#A84A28', marginBottom: '1.2rem',
            }}>✓</div>
            <p style={{
              fontFamily: 'DM Sans', fontWeight: 300, fontSize: '.95rem',
              color: 'rgba(247,243,237,.75)', lineHeight: 1.75,
            }}>
              Votre demande a bien été reçue.<br />
              Nous vous rappelons très prochainement.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <input
                type="text" placeholder="Votre prénom et nom"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                style={inp('name')}
              />
              {errors.name && <Err>Champ requis</Err>}
            </div>
            <div>
              <input
                type="tel" placeholder="Téléphone"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                style={inp('phone')}
              />
              {errors.phone && <Err>Numéro invalide</Err>}
            </div>
            <div>
              <select
                value={form.time}
                onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                style={{
                  ...inp('time'),
                  appearance: 'none', cursor: 'pointer',
                  color: form.time ? '#F7F3ED' : 'rgba(247,243,237,.38)',
                }}
              >
                <option value=""     style={{ background: '#1b1916' }}>Créneau préféré</option>
                <option value="matin"      style={{ background: '#1b1916' }}>Matin (8h – 12h)</option>
                <option value="aprem"      style={{ background: '#1b1916' }}>Après-midi (13h – 17h)</option>
                <option value="soir"       style={{ background: '#1b1916' }}>En soirée (17h – 19h)</option>
              </select>
              {errors.time && <Err>Créneau requis</Err>}
            </div>
            <button type="submit" style={{
              alignSelf: 'flex-start',
              background: '#A84A28', color: '#F7F3ED', border: 'none',
              padding: '1rem 2.2rem',
              fontFamily: 'DM Sans', fontSize: '.78rem', fontWeight: 500,
              letterSpacing: '.13em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'background .22s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#8a3d20'}
              onMouseLeave={e => e.currentTarget.style.background = '#A84A28'}
            >Être rappelé →</button>
          </form>
        )}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   PRESTATIONS
───────────────────────────────────────────── */
const PRESTATIONS = [
  {
    title: 'Couverture tuile',
    desc: 'Pose, réfection et entretien de couvertures en tuile mécanique ou terre cuite, dans le respect des traditions constructives girondines.',
    img: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Ardoise naturelle',
    desc: "Maîtrise des techniques de pose à la française et à l'anglaise. Ardoises d'Angers ou galiciennes sélectionnées avec soin.",
    img: 'https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Zinguerie',
    desc: 'Noues, faîtages, chéneaux et gouttières en zinc naturel ou prélaqué. Étanchéité parfaite, finitions soignées au millimètre.',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Isolation toiture',
    desc: "Isolation thermique par l'extérieur (ITE) ou par l'intérieur. Amélioration du DPE et réduction significative de la facture énergétique.",
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Charpente',
    desc: 'Rénovation et remplacement de charpentes traditionnelles. Traitement préventif et curatif contre les insectes xylophages.',
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Urgences & réparations',
    desc: "Intervention rapide après tempête ou dégât des eaux. Bâchage, sécurisation et réparation dans les 24 à 48 heures.",
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=700&q=80',
  },
]

function PrestationCard({ title, desc, img }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className="pcard"
      style={{ position: 'relative', overflow: 'hidden', background: '#151412', aspectRatio: '4/3', cursor: 'default' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <img
        className="pcard-img"
        src={img} alt={title}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          filter: hov ? 'brightness(.28)' : 'brightness(.58)',
          transform: hov ? 'scale(1.06)' : 'scale(1)',
          transition: 'filter .6s ease, transform .6s ease',
        }}
      />
      <div style={{
        position: 'absolute', top: '1.5rem', left: '1.5rem',
        width: 28, height: 2, background: '#A84A28',
        transition: 'width .3s ease',
        ...(hov && { width: 48 }),
      }} />
      <div style={{
        position: 'absolute', inset: 0, padding: '2rem',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <h3
          className="pcard-title"
          style={{
            fontFamily: 'Cormorant Garamond', fontSize: '1.6rem', fontWeight: 500,
            color: '#F7F3ED', lineHeight: 1.2, marginBottom: '0.8rem',
            transform: hov ? 'translateY(-6px)' : 'translateY(0)',
            transition: 'transform .4s ease',
          }}
        >{title}</h3>
        <p
          className="pcard-desc"
          style={{
            fontFamily: 'DM Sans', fontWeight: 300, fontSize: '.83rem',
            color: 'rgba(247,243,237,.85)', lineHeight: 1.72,
            opacity: hov ? 1 : 0,
            transform: hov ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity .4s ease .06s, transform .4s ease .06s',
          }}
        >{desc}</p>
      </div>
    </div>
  )
}

function Prestations() {
  const ref = useFadeUp()
  return (
    <section id="prestations" style={{ padding: '9rem 2.5rem', background: '#F7F3ED' }}>
      <div ref={ref} className="fu" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem',
        }}>
          <div>
            <p style={s.eyebrow}>Nos prestations</p>
            <h2 style={s.h2black}>
              Six domaines d'expertise,<br />
              <em style={s.italic}>une seule adresse.</em>
            </h2>
          </div>
          <a href="#devis" style={{
            fontFamily: 'DM Sans', fontSize: '.78rem', fontWeight: 500,
            color: '#A84A28', textDecoration: 'none',
            letterSpacing: '.1em', textTransform: 'uppercase',
            borderBottom: '1px solid #A84A28', paddingBottom: 2,
            whiteSpace: 'nowrap',
          }}>Demander un devis →</a>
        </div>

        <div className="g6" style={{ gap: '1.5px', background: '#D8D2C8' }}>
          {PRESTATIONS.map((p, i) => <PrestationCard key={i} {...p} />)}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   ENGAGEMENTS
───────────────────────────────────────────── */
function Engagements() {
  const ref = useFadeUp()
  const items = [
    {
      sym: '◆',
      title: 'Matériaux certifiés',
      text: 'Nous sélectionnons exclusivement des matériaux labellisés NF ou équivalent, auprès de fournisseurs français et européens de confiance.',
    },
    {
      sym: '▲',
      title: 'Délais garantis',
      text: 'Un planning établi dès la signature du devis, des jalons respectés. Nous vous informons proactivement de chaque étape du chantier.',
    },
    {
      sym: '●',
      title: 'Service après-chantier',
      text: "Notre engagement ne s'arrête pas à la fin du chantier. Nous assurons un suivi et restons disponibles pour toute question ou intervention.",
    },
  ]

  return (
    <section id="engagements" style={{ background: '#A84A28', padding: '9rem 2.5rem' }}>
      <div ref={ref} className="fu" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <p style={s.eyebrowLightMuted}>Nos engagements</p>
        <h2 style={{ ...s.h2light, marginBottom: '5rem' }}>
          Des promesses tenues,<br />
          <em style={s.italic}>un artisanat qui honore sa parole.</em>
        </h2>

        <div className="g3" style={{ gap: '3rem' }}>
          {items.map((item, i) => (
            <div key={i} style={{ borderTop: '1px solid rgba(247,243,237,.3)', paddingTop: '2rem' }}>
              <div style={{
                fontFamily: 'DM Sans', fontSize: '.72rem', fontWeight: 400,
                color: 'rgba(247,243,237,.35)', marginBottom: '1.8rem',
                letterSpacing: '.1em',
              }}>{item.sym}</div>
              <h3 style={{
                fontFamily: 'Cormorant Garamond', fontSize: '1.65rem',
                fontWeight: 500, color: '#F7F3ED',
                marginBottom: '1rem', lineHeight: 1.2,
              }}>{item.title}</h3>
              <p style={{
                fontFamily: 'DM Sans', fontWeight: 300, fontSize: '.88rem',
                color: 'rgba(247,243,237,.7)', lineHeight: 1.82,
              }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   TÉMOIGNAGES
───────────────────────────────────────────── */
const TEMOIGNAGES = [
  {
    name: 'Marie-Claire F.',
    loc: 'Bordeaux · 33',
    detail: 'Réfection complète · Déc. 2024',
    stars: 5,
    text: "Intervention rapide après la tempête de décembre. L'équipe a sécurisé ma toiture en moins de 24h. Devis clair, prix honnête, travail impeccable.",
  },
  {
    name: 'Bertrand & Isabelle M.',
    loc: 'Mérignac · 33',
    detail: 'Ardoise + isolation · Sep. 2024',
    stars: 5,
    text: "Nous avons fait appel à Delbos pour l'isolation et la réfection des ardoises de notre maison des années 50. Résultat magnifique et facturation dans les clous du devis.",
  },
  {
    name: 'Philippe D.',
    loc: 'Libourne · 33',
    detail: 'Zinguerie & chéneaux · Juin 2024',
    stars: 5,
    text: "Professionnalisme exemplaire. Équipe ponctuelle, chantier propre, finitions soignées. La garantie décennale était un critère important pour nous — et ils l'ont.",
  },
]

function Temoignages() {
  const ref = useFadeUp()
  return (
    <section id="temoignages" style={{ padding: '9rem 2.5rem', background: '#F7F3ED' }}>
      <div ref={ref} className="fu" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <p style={s.eyebrow}>Témoignages</p>
        <h2 style={{ ...s.h2black, marginBottom: '4rem' }}>
          Ils nous ont fait confiance,<br />
          <em style={s.italic}>ils en parlent mieux que nous.</em>
        </h2>

        <div className="g3" style={{ gap: '1.5px', background: '#D8D2C8' }}>
          {TEMOIGNAGES.map((t, i) => (
            <div key={i} style={{
              background: '#F7F3ED', padding: '2.8rem 2.5rem',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: '1.6rem' }}>
                {Array.from({ length: t.stars }).map((_, j) => (
                  <span key={j} style={{ color: '#A84A28', fontSize: '.82rem' }}>★</span>
                ))}
              </div>
              <p style={{
                fontFamily: 'Cormorant Garamond', fontSize: '1.18rem',
                fontWeight: 400, fontStyle: 'italic',
                color: '#151412', lineHeight: 1.75,
                marginBottom: '2rem', flexGrow: 1,
              }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ borderTop: '1px solid #E5E0D8', paddingTop: '1.3rem' }}>
                <p style={{
                  fontFamily: 'DM Sans', fontSize: '.85rem', fontWeight: 500,
                  color: '#151412',
                }}>{t.name}</p>
                <p style={{
                  fontFamily: 'DM Sans', fontSize: '.73rem', fontWeight: 300,
                  color: '#8a7e74', marginTop: 3,
                }}>{t.loc} · {t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   QUALITÉ / GARANTIE DÉCENNALE
───────────────────────────────────────────── */
function Qualite() {
  const rImg  = useFadeUp()
  const rText = useFadeUp()
  const items = [
    'Assurance décennale RC Pro en vigueur',
    'Qualibat RGE — Éco-artisan certifié',
    'Certifié PROBAT couverture',
    'Adhérent CAPEB Gironde',
    'Devis détaillé gratuit sous 48h',
    'Fiches techniques matériaux remises en main propre',
  ]

  return (
    <section style={{ background: '#151412', padding: '9rem 2.5rem', overflow: 'hidden' }}>
      <div className="g2 q-grid" style={{ maxWidth: 1200, margin: '0 auto', gap: '6rem', alignItems: 'center' }}>

        {/* Image */}
        <div ref={rImg} className="fu" style={{ position: 'relative' }}>
          <img
            src="https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80"
            alt="Toiture rénovée"
            style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute', top: '2.5rem', right: '-2rem',
            background: '#A84A28', padding: '2rem', minWidth: 180, textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'Cormorant Garamond', fontSize: '2.2rem',
              fontWeight: 600, color: '#F7F3ED', lineHeight: 1,
            }}>10 ans</div>
            <div style={{
              fontFamily: 'DM Sans', fontSize: '.62rem', fontWeight: 400,
              color: 'rgba(247,243,237,.82)', letterSpacing: '.12em',
              textTransform: 'uppercase', marginTop: 6,
            }}>Garantie décennale</div>
          </div>
        </div>

        {/* Text */}
        <div ref={rText} className="fu fu-d1">
          <p style={s.eyebrowBrick}>Qualité & garanties</p>
          <h2 style={{ ...s.h2light, marginBottom: '1.8rem' }}>
            Votre investissement<br />
            <em style={s.italic}>protégé sur le long terme.</em>
          </h2>
          <p style={{
            fontFamily: 'DM Sans', fontWeight: 300, fontSize: '.88rem',
            color: 'rgba(247,243,237,.58)', lineHeight: 1.82, marginBottom: '2.5rem',
          }}>
            Tous nos travaux de couverture sont couverts par notre assurance décennale,
            conformément à la loi Spinetta. Nos qualifications RGE Qualibat vous ouvrent
            droit aux aides de l'État (MaPrimeRénov', CEE).
          </p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{
                  display: 'inline-block', minWidth: 18, height: 18,
                  border: '1px solid #A84A28', marginTop: 2, position: 'relative', flexShrink: 0,
                }}>
                  <span style={{
                    position: 'absolute', inset: 4, background: '#A84A28',
                  }} />
                </span>
                <span style={{
                  fontFamily: 'DM Sans', fontWeight: 300, fontSize: '.88rem',
                  color: 'rgba(247,243,237,.8)', lineHeight: 1.6,
                }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   DEVIS COMPLET
───────────────────────────────────────────── */
const TRAVAUX_OPTS = [
  'Réfection complète', 'Réparation localisée',
  'Isolation', 'Zinguerie',
  'Charpente', 'Nettoyage / traitement',
]

function Devis() {
  const ref = useFadeUp()

  const [form, setForm] = useState({
    civilite: '', nom: '', prenom: '',
    email: '', telephone: '', codePostal: '', ville: '',
    typeToiture: '', surface: '', typeTravaux: [],
    description: '', urgence: '', budget: '',
  })
  const [errors, setErrors] = useState({})
  const [sent, setSent]     = useState(false)

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const toggleTravaux = val => setForm(p => ({
    ...p,
    typeTravaux: p.typeTravaux.includes(val)
      ? p.typeTravaux.filter(v => v !== val)
      : [...p.typeTravaux, val],
  }))

  const validate = () => {
    const e = {}
    if (!form.civilite)                         e.civilite  = true
    if (!form.nom.trim())                       e.nom       = true
    if (!form.prenom.trim())                    e.prenom    = true
    if (!/\S+@\S+\.\S+/.test(form.email))      e.email     = true
    if (!/^[\d\s\+\-\.]{7,}$/.test(form.telephone)) e.telephone = true
    if (!form.codePostal.trim())               e.codePostal = true
    if (!form.typeToiture)                      e.typeToiture = true
    if (!form.typeTravaux.length)               e.typeTravaux = true
    return e
  }

  const handleSubmit = ev => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setSent(true)
  }

  const inpLight = field => ({
    width: '100%', padding: '.82rem 0',
    background: 'transparent', border: 'none',
    borderBottom: `1px solid ${errors[field] ? '#A84A28' : 'rgba(21,20,18,.2)'}`,
    fontFamily: 'DM Sans', fontSize: '.9rem', fontWeight: 300,
    color: '#151412', transition: 'border-color .2s',
  })

  const selLight = field => ({
    ...inpLight(field),
    appearance: 'none', cursor: 'pointer',
    color: form[field] ? '#151412' : 'rgba(21,20,18,.38)',
  })

  return (
    <section id="devis" style={{ padding: '9rem 2.5rem', background: '#F7F3ED' }}>
      <div ref={ref} className="fu" style={{ maxWidth: 820, margin: '0 auto' }}>
        <p style={s.eyebrow}>Formulaire de devis</p>
        <h2 style={{ ...s.h2black, marginBottom: '.8rem' }}>
          Votre projet mérite<br />
          <em style={s.italic}>une réponse à la hauteur.</em>
        </h2>
        <p style={{ ...s.body, marginBottom: '3.5rem' }}>
          Renseignez ce formulaire pour recevoir une estimation personnalisée.
          Réponse garantie sous 48h ouvrables.
        </p>

        {sent ? (
          <div style={{ background: '#151412', padding: '4.5rem 3rem', textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Cormorant Garamond', fontSize: '4rem',
              color: '#A84A28', marginBottom: '1.4rem',
            }}>✓</div>
            <h3 style={{
              fontFamily: 'Cormorant Garamond', fontSize: '1.9rem',
              color: '#F7F3ED', marginBottom: '1rem',
            }}>Demande bien reçue</h3>
            <p style={{
              fontFamily: 'DM Sans', fontWeight: 300, fontSize: '.9rem',
              color: 'rgba(247,243,237,.65)', lineHeight: 1.8,
            }}>
              Nous étudions votre projet avec attention et vous contacterons
              sous 48h ouvrables avec une estimation détaillée.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>

            {/* Civilité */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={s.label(errors.civilite)}>Civilité *</p>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.7rem' }}>
                {['M.', 'Mme'].map(c => (
                  <label key={c} style={{
                    display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer',
                    fontFamily: 'DM Sans', fontSize: '.9rem', fontWeight: 300,
                    color: form.civilite === c ? '#151412' : 'rgba(21,20,18,.45)',
                    transition: 'color .2s',
                  }}>
                    <input
                      type="radio" name="civilite" value={c}
                      checked={form.civilite === c}
                      onChange={e => set('civilite', e.target.value)}
                      style={{ accentColor: '#A84A28', cursor: 'pointer' }}
                    />{c}
                  </label>
                ))}
              </div>
            </div>

            {/* Nom / Prénom */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <input placeholder="Nom de famille *" type="text" value={form.nom}
                  onChange={e => set('nom', e.target.value)} style={inpLight('nom')} />
                {errors.nom && <Err>Requis</Err>}
              </div>
              <div>
                <input placeholder="Prénom *" type="text" value={form.prenom}
                  onChange={e => set('prenom', e.target.value)} style={inpLight('prenom')} />
                {errors.prenom && <Err>Requis</Err>}
              </div>
            </div>

            {/* Email / Téléphone */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <input placeholder="Adresse e-mail *" type="email" value={form.email}
                  onChange={e => set('email', e.target.value)} style={inpLight('email')} />
                {errors.email && <Err>Email invalide</Err>}
              </div>
              <div>
                <input placeholder="Téléphone *" type="tel" value={form.telephone}
                  onChange={e => set('telephone', e.target.value)} style={inpLight('telephone')} />
                {errors.telephone && <Err>Numéro invalide</Err>}
              </div>
            </div>

            {/* Code postal / Ville */}
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <input placeholder="Code postal *" type="text" value={form.codePostal}
                  onChange={e => set('codePostal', e.target.value)} style={inpLight('codePostal')} />
                {errors.codePostal && <Err>Requis</Err>}
              </div>
              <div>
                <input placeholder="Ville" type="text" value={form.ville}
                  onChange={e => set('ville', e.target.value)} style={inpLight('ville')} />
              </div>
            </div>

            {/* Type toiture */}
            <div style={{ marginBottom: '2rem' }}>
              <select value={form.typeToiture} onChange={e => set('typeToiture', e.target.value)} style={selLight('typeToiture')}>
                <option value="">Type de couverture actuelle *</option>
                <option value="tuile">Tuile mécanique</option>
                <option value="tuile-tce">Tuile terre cuite</option>
                <option value="ardoise">Ardoise</option>
                <option value="zinc">Zinc / Bac acier</option>
                <option value="autre">Autre / Je ne sais pas</option>
              </select>
              {errors.typeToiture && <Err>Requis</Err>}
            </div>

            {/* Surface */}
            <div style={{ marginBottom: '2rem' }}>
              <select value={form.surface} onChange={e => set('surface', e.target.value)} style={selLight('surface')}>
                <option value="">Surface approximative</option>
                <option value="lt50">Moins de 50 m²</option>
                <option value="50-100">50 à 100 m²</option>
                <option value="100-200">100 à 200 m²</option>
                <option value="gt200">Plus de 200 m²</option>
              </select>
            </div>

            {/* Type de travaux */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={s.label(errors.typeTravaux)}>Type de travaux * (plusieurs choix)</p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
                gap: '.2rem', marginTop: '.8rem',
              }}>
                {TRAVAUX_OPTS.map(opt => (
                  <label key={opt} style={{
                    display: 'flex', alignItems: 'center', gap: '.6rem',
                    cursor: 'pointer', padding: '.6rem .2rem',
                    borderBottom: '1px solid rgba(21,20,18,.07)',
                    fontFamily: 'DM Sans', fontSize: '.85rem', fontWeight: 300,
                    color: form.typeTravaux.includes(opt) ? '#151412' : 'rgba(21,20,18,.52)',
                    transition: 'color .2s',
                  }}>
                    <input
                      type="checkbox"
                      checked={form.typeTravaux.includes(opt)}
                      onChange={() => toggleTravaux(opt)}
                      style={{ accentColor: '#A84A28', cursor: 'pointer' }}
                    />{opt}
                  </label>
                ))}
              </div>
              {errors.typeTravaux && <Err>Veuillez sélectionner au moins un type de travaux</Err>}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <textarea
                placeholder="Décrivez votre projet en quelques mots (optionnel)"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={4}
                style={{
                  ...inpLight('description'),
                  borderBottom: 'none',
                  border: '1px solid rgba(21,20,18,.15)',
                  padding: '1rem', resize: 'vertical', minHeight: 100,
                }}
              />
            </div>

            {/* Urgence */}
            <div style={{ marginBottom: '2rem' }}>
              <select value={form.urgence} onChange={e => set('urgence', e.target.value)} style={selLight('urgence')}>
                <option value="">Niveau d'urgence</option>
                <option value="urgent">Urgent — intervention sous 48h</option>
                <option value="court">Court terme — dans le mois</option>
                <option value="moyen">Moyen terme — dans les 3 mois</option>
                <option value="planifie">Planifié — plus de 3 mois</option>
              </select>
            </div>

            {/* Budget */}
            <div style={{ marginBottom: '3.5rem' }}>
              <select value={form.budget} onChange={e => set('budget', e.target.value)} style={selLight('budget')}>
                <option value="">Enveloppe budgétaire (optionnel)</option>
                <option value="lt5k">Moins de 5 000 €</option>
                <option value="5-15k">5 000 à 15 000 €</option>
                <option value="15-30k">15 000 à 30 000 €</option>
                <option value="gt30k">Plus de 30 000 €</option>
              </select>
            </div>

            {/* Submit row */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem',
            }}>
              <p style={{
                fontFamily: 'DM Sans', fontSize: '.72rem', fontWeight: 300,
                color: 'rgba(21,20,18,.4)', maxWidth: 380, lineHeight: 1.65,
              }}>
                Vos données sont utilisées uniquement pour le traitement de votre demande.
                Aucun démarchage. Conformément au RGPD.
              </p>
              <button type="submit" style={{
                background: '#151412', color: '#F7F3ED', border: 'none',
                padding: '1.1rem 2.6rem',
                fontFamily: 'DM Sans', fontSize: '.78rem', fontWeight: 500,
                letterSpacing: '.14em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'background .22s',
                whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#A84A28'}
                onMouseLeave={e => e.currentTarget.style.background = '#151412'}
              >Envoyer ma demande</button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  const navLinks = [
    ['Savoir-faire', '#savoir-faire'],
    ['Prestations',  '#prestations'],
    ['Engagements',  '#engagements'],
    ['Témoignages',  '#temoignages'],
    ['Devis gratuit','#devis'],
  ]
  const services = ['Couverture tuile', 'Ardoise naturelle', 'Zinguerie', 'Isolation toiture', 'Charpente', 'Urgences 24/48h']
  const contact  = [
    ['Téléphone', '05 56 XX XX XX'],
    ['Email',     'contact@delbos-couverture.fr'],
    ['Zone',      'Gironde & Bordeaux Métropole'],
    ['Horaires',  'Lun – Ven · 8h – 18h'],
  ]

  return (
    <footer style={{ background: '#0d0c0a', padding: '6rem 2.5rem 3rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
          gap: '3rem', marginBottom: '4.5rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '1.4rem' }}>
              <div style={{
                fontFamily: 'Cormorant Garamond', fontSize: '1.55rem', fontWeight: 600,
                color: '#F7F3ED', letterSpacing: '.06em', lineHeight: 1,
              }}>DELBOS</div>
              <div style={{
                fontFamily: 'DM Sans', fontSize: '.58rem', fontWeight: 400,
                color: '#A84A28', letterSpacing: '.22em', textTransform: 'uppercase', marginTop: 4,
              }}>Couverture · Gironde</div>
            </div>
            <p style={{
              fontFamily: 'DM Sans', fontWeight: 300, fontSize: '.82rem',
              color: 'rgba(247,243,237,.4)', lineHeight: 1.75,
            }}>
              Artisans couvreurs depuis 1987. Qualité, durabilité et honnêteté sur chaque chantier.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p style={s.footerTitle}>Navigation</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
              {navLinks.map(([label, href]) => (
                <li key={href}>
                  <a href={href} style={{
                    fontFamily: 'DM Sans', fontSize: '.82rem', fontWeight: 300,
                    color: 'rgba(247,243,237,.48)', textDecoration: 'none', transition: 'color .2s',
                  }}
                    onMouseEnter={e => e.target.style.color = '#F7F3ED'}
                    onMouseLeave={e => e.target.style.color = 'rgba(247,243,237,.48)'}
                  >{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p style={s.footerTitle}>Nos services</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
              {services.map(sv => (
                <li key={sv} style={{
                  fontFamily: 'DM Sans', fontSize: '.82rem', fontWeight: 300,
                  color: 'rgba(247,243,237,.42)',
                }}>{sv}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={s.footerTitle}>Contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {contact.map(([lbl, val]) => (
                <div key={lbl}>
                  <p style={{
                    fontFamily: 'DM Sans', fontSize: '.62rem', fontWeight: 400,
                    color: 'rgba(247,243,237,.28)', letterSpacing: '.06em',
                    textTransform: 'uppercase', marginBottom: 2,
                  }}>{lbl}</p>
                  <p style={{
                    fontFamily: 'DM Sans', fontSize: '.82rem', fontWeight: 300,
                    color: 'rgba(247,243,237,.65)',
                  }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(247,243,237,.08)',
          paddingTop: '2rem',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{
            fontFamily: 'DM Sans', fontSize: '.72rem', fontWeight: 300,
            color: 'rgba(247,243,237,.28)',
          }}>
            © 2025 Delbos Couverture · SIRET 000 000 000 00000 · Tous droits réservés
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {['Mentions légales', 'Confidentialité'].map(l => (
              <a key={l} href="#" style={{
                fontFamily: 'DM Sans', fontSize: '.72rem', fontWeight: 300,
                color: 'rgba(247,243,237,.28)', textDecoration: 'none', transition: 'color .2s',
              }}
                onMouseEnter={e => e.target.style.color = 'rgba(247,243,237,.65)'}
                onMouseLeave={e => e.target.style.color = 'rgba(247,243,237,.28)'}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────
   SHARED STYLE TOKENS
───────────────────────────────────────────── */
const s = {
  eyebrow: {
    fontFamily: 'DM Sans', fontSize: '.73rem', fontWeight: 400,
    color: '#A84A28', letterSpacing: '.26em', textTransform: 'uppercase',
    marginBottom: '1.2rem',
  },
  eyebrowLight: {
    fontFamily: 'DM Sans', fontSize: '.73rem', fontWeight: 400,
    color: '#A84A28', letterSpacing: '.26em', textTransform: 'uppercase',
    marginBottom: '1.2rem',
  },
  eyebrowBrick: {
    fontFamily: 'DM Sans', fontSize: '.73rem', fontWeight: 400,
    color: '#A84A28', letterSpacing: '.26em', textTransform: 'uppercase',
    marginBottom: '1.2rem',
  },
  eyebrowLightMuted: {
    fontFamily: 'DM Sans', fontSize: '.73rem', fontWeight: 400,
    color: 'rgba(247,243,237,.6)', letterSpacing: '.26em', textTransform: 'uppercase',
    marginBottom: '1.2rem',
  },
  h2black: {
    fontFamily: 'Cormorant Garamond', fontWeight: 600,
    fontSize: 'clamp(2.1rem, 3.8vw, 3.1rem)',
    color: '#151412', lineHeight: 1.08, letterSpacing: '-.01em',
  },
  h2light: {
    fontFamily: 'Cormorant Garamond', fontWeight: 600,
    fontSize: 'clamp(2.1rem, 3.8vw, 3.1rem)',
    color: '#F7F3ED', lineHeight: 1.08, letterSpacing: '-.01em',
  },
  italic: { fontStyle: 'italic', fontWeight: 300 },
  body: {
    fontFamily: 'DM Sans', fontWeight: 300, fontSize: '.9rem',
    color: '#3d3831', lineHeight: 1.82,
  },
  label: (err) => ({
    fontFamily: 'DM Sans', fontSize: '.7rem', fontWeight: 400,
    color: err ? '#A84A28' : 'rgba(21,20,18,.45)',
    letterSpacing: '.1em', textTransform: 'uppercase',
  }),
  footerTitle: {
    fontFamily: 'DM Sans', fontSize: '.68rem', fontWeight: 500,
    color: '#A84A28', letterSpacing: '.2em', textTransform: 'uppercase',
    marginBottom: '1.5rem',
  },
}

/* ─────────────────────────────────────────────
   HELPER : message d'erreur
───────────────────────────────────────────── */
function Err({ children }) {
  return (
    <p style={{
      fontFamily: 'DM Sans', fontSize: '.7rem', fontWeight: 400,
      color: '#A84A28', marginTop: '.3rem',
    }}>{children}</p>
  )
}

/* ─────────────────────────────────────────────
   APP
───────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <GlobalStyles />
      <Nav />
      <main>
        <Hero />
        <SavoirFaire />
        <Mission />
        <Rappel />
        <Prestations />
        <Engagements />
        <Temoignages />
        <Qualite />
        <Devis />
      </main>
      <Footer />
    </>
  )
}
