import React, { useState, useEffect, useRef } from "react";
import {
  Phone, Mail, MapPin, Check, Clock, ShieldCheck,
  Camera, Truck, PawPrint, MessageCircle, ArrowRight, Dog, Footprints, Home, Star,
} from "lucide-react";
import { config, YARD, WALKS } from "./config.js";

/**
 * The Yard Keepers — single-file landing page.
 * All business details (name, phone, prices, service area) live in src/config.js.
 * Colors: Beaver Orange #D73F09 + warm near-black + white.
 */

const SERVICES = [
  {
    id: "waste",
    icon: PawPrint,
    name: "Dog Waste Removal",
    tag: "Most popular",
    price: "from $80/mo",
    cadence: "4 visits · weekly",
    blurb:
      "I scoop every corner, fence line, and under the bushes — then haul it away so it never sits in your bin. You get your backyard back.",
    cta: "Start weekly service",
  },
  {
    id: "sitting",
    icon: Home,
    name: "Dog Sitting & House Sitting",
    tag: null,
    price: "from $55/night",
    cadence: "In your home · overnight or drop-in",
    blurb:
      "Going out of town? I care for your dog in your own home — overnight stays, or drop-in visits for feeding, potty breaks, and playtime. In-home only; overnight has a two-night minimum.",
    cta: "Ask about sitting",
  },
  {
    id: "walking",
    icon: Footprints,
    name: "Dog Walking",
    tag: null,
    price: "from $18",
    cadence: "By request",
    blurb:
      "Midday walks or a daily routine — your dog gets exercise, fresh air, and attention while you're busy or at work.",
    cta: "Ask about walks",
  },
];

const STEPS = [
  { icon: MessageCircle, title: "I text on the way", body: "You get a heads-up before I arrive — no surprises at the gate." },
  { icon: Check, title: "I clean every inch", body: "Corners, fence lines, under bushes. I walk the whole yard twice." },
  { icon: Camera, title: "Gate closed, photo sent", body: "I latch up and send a photo so you know it's done and secure." },
  { icon: Truck, title: "Waste hauled away", body: "It leaves with me. Nothing left to fester in your trash bin." },
];

const PROMISES = [
  { icon: Clock, label: "I respond within hours" },
  { icon: ShieldCheck, label: "100% satisfaction guarantee" },
  { icon: Check, label: "No contracts — cancel anytime" },
  { icon: MapPin, label: "Locally owned" },
];

const FAQ = [
  {
    q: "How does billing work?",
    a: "The weekly plan starts at $80/month for four visits (one dog); more dogs or twice-weekly visits cost a bit more. No contracts — pause or cancel anytime with a heads-up.",
  },
  {
    q: "Do I need to be home?",
    a: "Nope. As long as I have safe access to the yard, you don't have to be there. I'll text on the way and send a gate-closed photo when I'm done.",
  },
  {
    q: "What if my yard is overgrown or snowed in?",
    a: "If I genuinely can't see the waste, I can't get all of it — but I'll tell you straight and we'll sort out a plan. Honesty over excuses.",
  },
  {
    q: "How does pet sitting work?",
    a: "It all happens in your home, where your dog is most comfortable. Two options: overnight house sitting (from $55/night, two-night minimum) where I stay over, or drop-in visits (from $20) where I come by to feed, walk, and check on your dog. We sort out the details at a free meet-and-greet.",
  },
  {
    q: "What about a nervous or protective dog?",
    a: "Just let me know ahead of time. I'm happy to work around feeding or nap times, or have you secure your dog during the visit.",
  },
];

const DOGS = [
  { img: "/dogs/dog-small.jpg", name: "Biscuit", breed: "Corgi", size: "Small", pos: "center 22%" },
  { img: "/dogs/dog-medium.jpg", name: "Scout", breed: "Border Collie", size: "Medium", pos: "30% center" },
  { img: "/dogs/dog-large.jpg", name: "Ranger", breed: "Golden Retriever", size: "Medium–large", pos: "center 32%" },
  { img: "/dogs/dog-greatdane.jpg", name: "Duke", breed: "Great Dane", size: "Extra-large", pos: "center 18%" },
];

const TEL = `tel:${config.phoneE164}`;

export default function TheYardKeepers() {
  const [service, setService] = useState({ waste: false, sitting: false, walking: false, unsure: false });
  const [form, setForm] = useState({ name: "", phone: "", email: "", area: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [freq, setFreq] = useState("weekly");
  const [dogs, setDogs] = useState(1);
  const yardPrice = YARD.prices[freq][dogs];
  const perVisit = freq === "weekly" ? yardPrice / 4 : freq === "twice" ? yardPrice / 8 : yardPrice / 2;
  const formRef = useRef(null);

  const scrollToForm = (preselect) => {
    if (preselect) setService((s) => ({ ...s, [preselect]: true }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleService = (key) => setService((s) => ({ ...s, [key]: !s[key] }));
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const selectedServiceLabels = [
    service.waste && "Weekly waste removal",
    service.sitting && "Pet sitting",
    service.walking && "Dog walking",
    service.unsure && "Not sure yet",
  ].filter(Boolean);

  // Fallback when no form endpoint is configured: open a pre-filled email.
  const sendViaEmail = () => {
    const subject = encodeURIComponent(`Quote request — ${form.name || "new lead"}`);
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
        `Email: ${form.email || "—"}`,
        `Neighborhood/address: ${form.area || "—"}`,
        `Services: ${selectedServiceLabels.join(", ") || "—"}`,
        "",
        `Message: ${form.message || "—"}`,
      ].join("\n")
    );
    window.location.href = `mailto:${config.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async () => {
    const anyService = Object.values(service).some(Boolean);
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please add your name and phone so I can reach you.");
      return;
    }
    if (!anyService) {
      setError("Pick at least one service you're interested in.");
      return;
    }
    setError("");

    const payload = {
      ...form,
      services: selectedServiceLabels.join(", "),
      source: "theyardkeepers.pet",
    };

    // If a form endpoint is configured (Formspree / Web3Forms), POST to it for
    // instant email/SMS notification. Otherwise fall back to a pre-filled email.
    if (config.formEndpoint) {
      setSubmitting(true);
      try {
        const res = await fetch(config.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Bad response");
        setSubmitted(true);
      } catch {
        setError("Something went wrong sending that. Please call or text me instead — I'd love to help.");
      } finally {
        setSubmitting(false);
      }
    } else {
      sendViaEmail();
      setSubmitted(true);
    }
  };

  // light scroll-reveal
  useEffect(() => {
    const els = document.querySelectorAll(".yk-reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("yk-in")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const cityLine = `${config.primaryCity}, ${config.primaryState}`;

  return (
    <div className="yk-root">
      <style>{`
        .yk-root{
          --orange:#D73F09; --orange-deep:#B23206; --orange-soft:#FBE3D7;
          --ink:#181310; --ink-2:#221A14; --ink-soft:#4b423b;
          --paper:#FBF8F4; --white:#ffffff; --line:rgba(24,19,16,.12);
          font-family:'Plus Jakarta Sans',system-ui,sans-serif; color:var(--ink);
          background:var(--paper); line-height:1.55; -webkit-font-smoothing:antialiased;
        }
        .yk-root *{box-sizing:border-box;}
        .yk-root h1,.yk-root h2,.yk-root h3,.yk-root .yk-display{
          font-family:'Plus Jakarta Sans',sans-serif; line-height:1.04;
          letter-spacing:-.02em; margin:0;
        }
        .yk-wrap{max-width:1080px;margin:0 auto;padding:0 22px;}
        .yk-orange{color:var(--orange);}

        /* nav */
        .yk-nav{position:sticky;top:0;z-index:40;background:rgba(251,248,244,.86);
          backdrop-filter:blur(10px);border-bottom:1px solid var(--line);}
        .yk-nav-in{display:flex;align-items:center;justify-content:space-between;height:64px;}
        .yk-logo{display:flex;align-items:center;gap:9px;font-family:'Plus Jakarta Sans',sans-serif;
          font-weight:800;font-size:18px;letter-spacing:-.02em;}
        .yk-logo-mark{width:30px;height:30px;border-radius:8px;background:var(--orange);
          display:grid;place-items:center;color:#fff;flex:none;}
        .yk-nav-actions{display:flex;align-items:center;gap:10px;}
        .yk-nav-call{display:inline-flex;align-items:center;gap:7px;font-weight:600;font-size:15px;
          color:var(--ink);text-decoration:none;padding:9px 14px;border-radius:999px;}
        .yk-nav-call:hover{color:var(--orange);}
        .yk-btn{font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:15px;border:none;
          cursor:pointer;border-radius:999px;padding:12px 20px;display:inline-flex;
          align-items:center;gap:8px;transition:transform .15s ease,background .15s ease;text-decoration:none;}
        .yk-btn:hover{transform:translateY(-1px);}
        .yk-btn:focus-visible{outline:3px solid var(--orange);outline-offset:2px;}
        .yk-btn-primary{background:var(--orange);color:#fff;}
        .yk-btn-primary:hover{background:var(--orange-deep);}
        .yk-btn-ghost{background:transparent;color:var(--ink);border:1.5px solid var(--line);}
        .yk-btn-ghost:hover{border-color:var(--ink);}
        .yk-nav .yk-btn{padding:9px 16px;}

        /* hero */
        .yk-hero{padding:54px 0 30px;}
        .yk-hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:40px;align-items:center;}
        .yk-eyebrow{display:inline-flex;align-items:center;gap:7px;font-weight:600;font-size:13px;
          text-transform:uppercase;letter-spacing:.08em;color:var(--orange);
          background:var(--orange-soft);padding:6px 13px;border-radius:999px;margin-bottom:20px;}
        .yk-hero h1{font-size:clamp(38px,6vw,62px);font-weight:800;}
        .yk-hero p.lead{font-size:18px;color:var(--ink-soft);margin:18px 0 8px;max-width:34ch;}
        .yk-price-chip{display:inline-flex;align-items:baseline;gap:8px;margin:18px 0 24px;
          background:var(--ink);color:#fff;border-radius:14px;padding:12px 18px;}
        .yk-price-chip b{font-family:'Plus Jakarta Sans',sans-serif;font-size:24px;}
        .yk-price-chip span{font-size:13px;color:#d8cfc7;}
        .yk-hero-cta{display:flex;gap:12px;flex-wrap:wrap;}
        .yk-hero-art{position:relative;}
        .yk-hero-art svg{width:100%;height:auto;display:block;
          filter:drop-shadow(0 24px 40px rgba(24,19,16,.14));}
        .yk-hero-art img{width:100%;height:auto;display:block;border-radius:26px;
          object-fit:cover;aspect-ratio:12/11;box-shadow:0 24px 44px rgba(24,19,16,.18);}

        /* promise strip */
        .yk-strip{background:var(--ink);color:#fff;}
        .yk-strip-in{display:flex;flex-wrap:wrap;gap:10px 30px;justify-content:center;padding:16px 22px;}
        .yk-strip-item{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:500;}
        .yk-strip-item svg{color:var(--orange);flex:none;}

        /* section scaffolding */
        .yk-sec{padding:64px 0;}
        .yk-sec-head{max-width:38ch;margin-bottom:36px;}
        .yk-kicker{font-weight:700;font-size:13px;letter-spacing:.1em;text-transform:uppercase;
          color:var(--orange);margin-bottom:12px;}
        .yk-sec h2{font-size:clamp(28px,4vw,40px);font-weight:800;}
        .yk-sec-head p{color:var(--ink-soft);margin-top:14px;font-size:17px;}

        /* services */
        .yk-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
        .yk-card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:26px;
          display:flex;flex-direction:column;transition:transform .18s ease,box-shadow .18s ease;}
        .yk-card:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(24,19,16,.10);}
        .yk-card.hero{border:2px solid var(--orange);box-shadow:0 14px 36px rgba(215,63,9,.12);}
        .yk-card-icon{width:48px;height:48px;border-radius:12px;background:var(--orange-soft);
          color:var(--orange);display:grid;place-items:center;margin-bottom:18px;}
        .yk-card.hero .yk-card-icon{background:var(--orange);color:#fff;}
        .yk-tag{align-self:flex-start;font-size:11px;font-weight:700;letter-spacing:.06em;
          text-transform:uppercase;color:#fff;background:var(--orange);padding:4px 10px;
          border-radius:999px;margin-bottom:14px;}
        .yk-card h3{font-size:21px;font-weight:700;margin-bottom:4px;}
        .yk-card .cad{font-size:13px;color:var(--ink-soft);font-weight:600;margin-bottom:12px;}
        .yk-card .cad b{color:var(--orange);font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;}
        .yk-card p{font-size:15px;color:var(--ink-soft);flex:1;margin-bottom:20px;}
        .yk-card .yk-link{background:none;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;
          font-weight:600;font-size:15px;color:var(--ink);display:inline-flex;align-items:center;
          gap:6px;padding:0;transition:gap .15s ease,color .15s ease;}
        .yk-card .yk-link:hover{gap:10px;color:var(--orange);}
        .yk-card .yk-link:focus-visible{outline:3px solid var(--orange);outline-offset:3px;border-radius:4px;}

        /* dog size gallery */
        .yk-dogs{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
        .yk-dogcard{margin:0;background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden;
          transition:transform .18s ease,box-shadow .18s ease;}
        .yk-dogcard:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(24,19,16,.10);}
        .yk-dogcard img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;}
        .yk-dogcard figcaption{padding:14px 16px;display:flex;flex-direction:column;gap:1px;}
        .yk-dogsize{align-self:flex-start;font-size:11px;font-weight:700;letter-spacing:.05em;
          text-transform:uppercase;color:#fff;background:var(--orange);padding:3px 9px;border-radius:999px;margin-bottom:8px;}
        .yk-dogcard b{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:18px;}
        .yk-dogbreed{font-size:13px;color:var(--ink-soft);}

        /* steps */
        .yk-steps-sec{background:var(--ink);color:#fff;}
        .yk-steps-sec .yk-kicker{color:#ff7a45;}
        .yk-steps-sec h2{color:#fff;}
        .yk-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:8px;}
        .yk-step{background:var(--ink-2);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:24px;}
        .yk-step-n{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:14px;
          color:var(--orange);margin-bottom:14px;letter-spacing:.04em;}
        .yk-step-ico{width:42px;height:42px;border-radius:11px;background:rgba(215,63,9,.18);
          color:#ff8254;display:grid;place-items:center;margin-bottom:14px;}
        .yk-step h3{font-size:17px;font-weight:700;margin-bottom:6px;color:#fff;}
        .yk-step p{font-size:14px;color:#c9bfb6;}

        /* founder */
        .yk-founder{display:grid;grid-template-columns:.8fr 1.2fr;gap:44px;align-items:center;}
        .yk-founder-photo{aspect-ratio:4/5;border-radius:22px;overflow:hidden;background:
          linear-gradient(150deg,var(--orange-soft),#fff);border:1px solid var(--line);
          display:grid;place-items:center;text-align:center;color:var(--orange);position:relative;}
        .yk-founder-photo img{width:100%;height:100%;object-fit:cover;}
        .yk-founder-photo .ph{display:grid;place-items:center;gap:10px;padding:20px;}
        .yk-founder-photo .ph span{font-size:13px;font-weight:600;color:var(--ink-soft);}
        .yk-founder blockquote{font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;
          font-size:clamp(20px,2.6vw,27px);line-height:1.3;margin:0 0 18px;letter-spacing:-.01em;}
        .yk-founder p{color:var(--ink-soft);font-size:16px;margin:0 0 12px;}
        .yk-founder .sig{font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;
          color:var(--ink);font-size:18px;margin-top:8px;}

        /* area */
        .yk-area{display:flex;gap:18px;flex-wrap:wrap;}
        .yk-area-card{flex:1;min-width:220px;background:#fff;border:1px solid var(--line);
          border-radius:18px;padding:24px;display:flex;gap:14px;align-items:flex-start;}
        .yk-area-card.now{border-color:var(--orange);}
        .yk-area-pin{width:42px;height:42px;border-radius:11px;background:var(--orange-soft);
          color:var(--orange);display:grid;place-items:center;flex:none;}
        .yk-area-card.now .yk-area-pin{background:var(--orange);color:#fff;}
        .yk-area-card h3{font-size:18px;font-weight:700;}
        .yk-area-card .when{font-size:13px;font-weight:600;color:var(--orange);text-transform:uppercase;
          letter-spacing:.06em;margin-bottom:4px;}
        .yk-area-card p{font-size:14px;color:var(--ink-soft);margin-top:4px;}
        .yk-area-towns{margin-top:18px;font-size:14px;color:var(--ink-soft);}
        .yk-area-towns b{color:var(--ink);}

        /* pricing */
        .ykx-subhead{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:20px;
          display:flex;align-items:center;gap:9px;margin:0 0 18px;}
        .ykx-subhead svg{color:var(--orange);}
        .ykx-calc{background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden;
          display:grid;grid-template-columns:1.15fr .85fr;}
        .ykx-controls{padding:26px;border-right:1px solid var(--line);}
        .ykx-ctl-label{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;
          color:var(--ink-soft);margin:0 0 11px;}
        .ykx-seg{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px;}
        .ykx-chip{cursor:pointer;border:1.5px solid var(--line);background:var(--paper);border-radius:12px;
          padding:11px 15px;font-weight:600;font-size:14px;display:flex;flex-direction:column;gap:2px;
          position:relative;transition:all .14s ease;font-family:'Plus Jakarta Sans',sans-serif;color:var(--ink);}
        .ykx-chip small{font-weight:500;font-size:11px;color:var(--ink-soft);}
        .ykx-chip.on{border-color:var(--orange);background:var(--orange-soft);}
        .ykx-chip.on small{color:var(--orange-deep);}
        .ykx-chip:focus-visible{outline:3px solid var(--orange);outline-offset:2px;}
        .ykx-pop{position:absolute;top:-9px;right:-7px;background:var(--orange);color:#fff;font-size:9px;
          font-weight:700;letter-spacing:.04em;padding:2px 7px;border-radius:999px;text-transform:uppercase;}
        .ykx-dogrow{display:flex;gap:8px;}
        .ykx-dogbtn{flex:1;cursor:pointer;border:1.5px solid var(--line);background:var(--paper);border-radius:12px;
          padding:13px;font-weight:700;font-size:15px;display:flex;flex-direction:column;align-items:center;gap:4px;
          transition:all .14s ease;font-family:'Plus Jakarta Sans',sans-serif;color:var(--ink);}
        .ykx-dogbtn.on{border-color:var(--orange);background:var(--orange);color:#fff;}
        .ykx-dogbtn:focus-visible{outline:3px solid var(--orange);outline-offset:2px;}
        .ykx-result{padding:26px;display:flex;flex-direction:column;justify-content:center;background:var(--ink);color:#fff;}
        .ykx-amt{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:56px;line-height:1;}
        .ykx-amt small{font-size:19px;color:#cdbfb4;font-weight:600;}
        .ykx-subr{color:#cdbfb4;font-size:14px;margin:8px 0 16px;}
        .ykx-meta{font-size:13px;color:#a99c91;border-top:1px solid rgba(255,255,255,.12);padding-top:13px;}
        .ykx-matrix{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);
          border-radius:16px;overflow:hidden;margin-top:20px;font-size:15px;}
        .ykx-matrix th,.ykx-matrix td{padding:13px 15px;text-align:center;border-bottom:1px solid var(--line);}
        .ykx-matrix thead th{background:var(--ink);color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;}
        .ykx-matrix tbody th{text-align:left;font-weight:700;background:var(--paper);}
        .ykx-matrix td{font-weight:600;}
        .ykx-matrix tr:last-child td,.ykx-matrix tr:last-child th{border-bottom:none;}
        .ykx-matrix .hl{color:var(--orange);}
        .ykx-note{font-size:12px;color:var(--ink-soft);margin-top:14px;max-width:66ch;}
        .ykx-note b{color:var(--orange);}
        .ykx-care{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
        .ykx-carecard{background:#fff;border:1px solid var(--line);border-radius:20px;padding:28px;display:flex;flex-direction:column;}
        .ykx-caretag{align-self:flex-start;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
          color:#fff;background:var(--orange);padding:4px 11px;border-radius:999px;margin-bottom:13px;}
        .ykx-carecard h4{font-family:'Plus Jakarta Sans',sans-serif;font-size:21px;font-weight:800;margin:0 0 7px;}
        .ykx-carecard .cdesc{font-size:14px;color:var(--ink-soft);margin:0 0 16px;}
        .ykx-custom{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:34px;color:var(--ink);line-height:1;margin-bottom:16px;}
        .ykx-custom small{display:block;font-size:13px;color:var(--ink-soft);font-weight:600;margin-top:5px;}
        .ykx-carecard ul{list-style:none;padding:0;margin:0;display:grid;gap:9px;}
        .ykx-carecard li{display:flex;gap:9px;font-size:14px;color:var(--ink-soft);align-items:flex-start;}
        .ykx-carecard li svg{color:var(--orange);flex:none;margin-top:2px;}
        .ykx-walks{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
        .ykx-pcard{background:#fff;border:1px solid var(--line);border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:5px;position:relative;}
        .ykx-pcard.on{border:2px solid var(--orange);}
        .ykx-pcard .len{font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:18px;}
        .ykx-pcard .amt{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:32px;color:var(--ink);}
        .ykx-pcard .desc{font-size:13px;color:var(--ink-soft);}
        .ykx-guarantee{display:flex;align-items:center;gap:18px;background:var(--ink);color:#fff;border-radius:20px;
          padding:26px 30px;margin-top:42px;flex-wrap:wrap;}
        .ykx-guarantee h3{font-size:20px;font-weight:800;color:#fff;margin:0 0 4px;}
        .ykx-guarantee p{color:#cdbfb4;font-size:14px;margin:0;}
        .ykx-guar-txt{flex:1;min-width:200px;}
        .ykx-guar-ico{width:52px;height:52px;border-radius:13px;background:var(--orange);color:#fff;
          display:grid;place-items:center;flex:none;}

        /* faq */
        .yk-faq{max-width:760px;margin:0 auto;}
        .yk-faq-item{border-bottom:1px solid var(--line);}
        .yk-faq-q{width:100%;text-align:left;background:none;border:none;cursor:pointer;
          padding:20px 0;display:flex;justify-content:space-between;align-items:center;gap:16px;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:18px;color:var(--ink);}
        .yk-faq-q:focus-visible{outline:3px solid var(--orange);outline-offset:3px;}
        .yk-faq-plus{color:var(--orange);font-size:24px;flex:none;transition:transform .2s ease;}
        .yk-faq-item.open .yk-faq-plus{transform:rotate(45deg);}
        .yk-faq-a{font-size:15px;color:var(--ink-soft);padding:0 0 20px;max-width:64ch;}

        /* form */
        .yk-form-sec{background:var(--ink);color:#fff;}
        .yk-form-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:48px;align-items:start;}
        .yk-form-sec .yk-kicker{color:#ff7a45;}
        .yk-form-sec h2{color:#fff;font-size:clamp(30px,4vw,44px);}
        .yk-form-sec .lead{color:#ccc3ba;font-size:17px;margin-top:14px;max-width:34ch;}
        .yk-form-promises{margin-top:26px;display:grid;gap:12px;}
        .yk-form-promises div{display:flex;align-items:center;gap:10px;font-size:15px;color:#e9e2da;}
        .yk-form-promises svg{color:var(--orange);flex:none;}
        .yk-form-call{margin-top:24px;display:inline-flex;align-items:center;gap:9px;color:#fff;
          text-decoration:none;font-weight:600;font-size:16px;}
        .yk-form-call svg{color:var(--orange);}
        .yk-form-call:hover{color:#ff8254;}
        .yk-card-form{background:#fff;color:var(--ink);border-radius:22px;padding:30px;}
        .yk-field{margin-bottom:16px;}
        .yk-field label{display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:var(--ink);}
        .yk-input{width:100%;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;padding:12px 14px;
          border:1.5px solid var(--line);border-radius:11px;background:var(--paper);color:var(--ink);}
        .yk-input:focus{outline:none;border-color:var(--orange);background:#fff;}
        textarea.yk-input{resize:vertical;min-height:84px;}
        .yk-checks{display:flex;flex-wrap:wrap;gap:9px;}
        .yk-check{cursor:pointer;font-size:14px;font-weight:600;padding:9px 14px;border-radius:999px;
          border:1.5px solid var(--line);background:var(--paper);user-select:none;transition:all .14s ease;
          position:relative;}
        .yk-check.on{background:var(--orange);border-color:var(--orange);color:#fff;}
        .yk-check:focus-within{outline:3px solid var(--orange);outline-offset:2px;}
        .yk-check input{position:absolute;opacity:0;width:0;height:0;}
        .yk-submit{width:100%;justify-content:center;margin-top:6px;font-size:16px;padding:15px;}
        .yk-submit[disabled]{opacity:.7;cursor:default;}
        .yk-error{background:var(--orange-soft);color:var(--orange-deep);font-size:14px;font-weight:600;
          padding:10px 14px;border-radius:10px;margin-bottom:14px;}
        .yk-success{text-align:center;padding:20px 8px;}
        .yk-success .ok{width:62px;height:62px;border-radius:50%;background:var(--orange);color:#fff;
          display:grid;place-items:center;margin:0 auto 18px;}
        .yk-success h3{font-size:24px;font-weight:800;margin-bottom:8px;}
        .yk-success p{color:var(--ink-soft);font-size:15px;margin-bottom:6px;}
        .yk-success .sel{font-size:14px;color:var(--orange);font-weight:600;margin:10px 0 20px;}

        /* footer */
        .yk-footer{background:var(--paper);border-top:1px solid var(--line);padding:40px 0 30px;}
        .yk-footer-in{display:flex;flex-wrap:wrap;gap:24px;justify-content:space-between;align-items:flex-start;}
        .yk-foot-contact{display:grid;gap:9px;}
        .yk-foot-contact a{color:var(--ink-soft);text-decoration:none;display:flex;align-items:center;
          gap:9px;font-size:15px;}
        .yk-foot-contact a:hover{color:var(--orange);}
        .yk-foot-contact svg{color:var(--orange);}
        .yk-foot-note{font-size:13px;color:var(--ink-soft);margin-top:22px;max-width:46ch;}
        .yk-foot-bottom{margin-top:26px;padding-top:18px;border-top:1px solid var(--line);
          font-size:13px;color:var(--ink-soft);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;}

        /* floating mobile call button */
        .yk-fab{display:none;position:fixed;right:18px;bottom:18px;z-index:50;
          background:var(--orange);color:#fff;border-radius:999px;padding:14px 20px;
          font-weight:700;font-size:15px;align-items:center;gap:9px;text-decoration:none;
          box-shadow:0 10px 30px rgba(215,63,9,.4);}
        .yk-fab:active{transform:scale(.97);}

        /* reveal anim */
        .yk-reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease;}
        .yk-in{opacity:1;transform:none;}

        @media (max-width:880px){
          .ykx-calc{grid-template-columns:1fr;}
          .ykx-controls{border-right:none;border-bottom:1px solid var(--line);}
          .ykx-care{grid-template-columns:1fr;}
          .ykx-walks{grid-template-columns:1fr 1fr;}
          .yk-hero-grid{grid-template-columns:1fr;gap:24px;}
          .yk-hero-art{order:-1;max-width:380px;}
          .yk-cards{grid-template-columns:1fr;}
          .yk-dogs{grid-template-columns:1fr 1fr;}
          .yk-steps{grid-template-columns:1fr 1fr;}
          .yk-founder{grid-template-columns:1fr;gap:26px;}
          .yk-founder-photo{max-width:300px;}
          .yk-form-grid{grid-template-columns:1fr;gap:30px;}
          .yk-nav .yk-hide-sm{display:none;}
          .yk-fab{display:inline-flex;}
        }
        @media (max-width:520px){
          .yk-steps{grid-template-columns:1fr;}
          .ykx-walks{grid-template-columns:1fr;}
          .ykx-matrix{font-size:13px;}
          .ykx-matrix th,.ykx-matrix td{padding:11px 8px;}
        }
        @media (prefers-reduced-motion:reduce){
          .yk-reveal{opacity:1;transform:none;transition:none;}
          .yk-btn:hover,.yk-card:hover{transform:none;}
          *{scroll-behavior:auto !important;}
        }
      `}</style>

      {/* NAV */}
      <nav className="yk-nav">
        <div className="yk-wrap yk-nav-in">
          <div className="yk-logo">
            <span className="yk-logo-mark"><PawPrint size={18} /></span>
            {config.businessName}
          </div>
          <div className="yk-nav-actions">
            <a className="yk-nav-call yk-hide-sm" href={TEL}><Phone size={16} /> {config.phoneDisplay}</a>
            <button className="yk-btn yk-btn-primary" onClick={() => scrollToForm()}>
              Get a free quote
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="yk-hero">
        <div className="yk-wrap yk-hero-grid">
          <div>
            <span className="yk-eyebrow"><MapPin size={14} /> {cityLine}</span>
            <h1>A clean backyard,<br /><span className="yk-orange">handled weekly.</span></h1>
            <p className="lead">Dog waste removal, pet sitting, and dog walking in {config.primaryCity} from someone local you can trust.</p>
            <div className="yk-price-chip">
              <b>from $80/mo</b><span>4 visits · weekly waste removal</span>
            </div>
            <div className="yk-hero-cta">
              <button className="yk-btn yk-btn-primary" onClick={() => scrollToForm("waste")}>
                Get a free quote <ArrowRight size={17} />
              </button>
              <button className="yk-btn yk-btn-ghost" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
                See what I do
              </button>
            </div>
          </div>
          <div className="yk-hero-art">
            <img
              src="/dogs/dog-small.jpg"
              alt={`Biscuit, a happy corgi, in a clean backyard in ${config.primaryCity}, ${config.primaryState}`}
              width="900"
              height="1350"
              loading="eager"
              fetchpriority="high"
              style={{ objectPosition: "center 22%" }}
            />
          </div>
        </div>
      </header>

      {/* PROMISE STRIP */}
      <div className="yk-strip">
        <div className="yk-strip-in">
          {PROMISES.map((p) => (
            <div className="yk-strip-item" key={p.label}><p.icon size={17} /> {p.label}</div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="yk-sec" id="services">
        <div className="yk-wrap">
          <div className="yk-sec-head yk-reveal">
            <div className="yk-kicker">What I do</div>
            <h2>Three ways I keep your pets and yard cared for.</h2>
          </div>
          <div className="yk-cards">
            {SERVICES.map((s) => (
              <div className={`yk-card yk-reveal ${s.id === "waste" ? "hero" : ""}`} key={s.id}>
                {s.tag && <span className="yk-tag">{s.tag}</span>}
                <div className="yk-card-icon"><s.icon size={24} /></div>
                <h3>{s.name}</h3>
                <div className="cad">
                  {s.price ? <><b>{s.price}</b> · {s.cadence}</> : s.cadence}
                </div>
                <p>{s.blurb}</p>
                <button className="yk-link" onClick={() => scrollToForm(s.id)}>
                  {s.cta} <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="yk-sec yk-steps-sec">
        <div className="yk-wrap">
          <div className="yk-sec-head yk-reveal">
            <div className="yk-kicker">Every visit</div>
            <h2>What a weekly visit looks like.</h2>
          </div>
          <div className="yk-steps">
            {STEPS.map((st, i) => (
              <div className="yk-step yk-reveal" key={st.title}>
                <div className="yk-step-n">0{i + 1}</div>
                <div className="yk-step-ico"><st.icon size={20} /></div>
                <h3>{st.title}</h3>
                <p>{st.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOG SIZE GALLERY */}
      <section className="yk-sec" style={{ paddingTop: 0 }}>
        <div className="yk-wrap">
          <div className="yk-sec-head yk-reveal">
            <div className="yk-kicker">Every size welcome</div>
            <h2>From pocket-sized to peak Great Dane.</h2>
            <p>Big or small, every dog gets the same care — and pricing scales fairly with your pack.</p>
          </div>
          <div className="yk-dogs">
            {DOGS.map((d) => (
              <figure className="yk-dogcard yk-reveal" key={d.name}>
                <img src={d.img} alt={`${d.name}, a ${d.size.toLowerCase()} ${d.breed}`} loading="lazy" style={{ objectPosition: d.pos }} />
                <figcaption>
                  <span className="yk-dogsize">{d.size}</span>
                  <b>{d.name}</b>
                  <span className="yk-dogbreed">{d.breed}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="yk-sec" id="pricing">
        <div className="yk-wrap">
          <div className="yk-sec-head yk-reveal">
            <div className="yk-kicker">Pricing</div>
            <h2>Honest, local pricing — no contracts, ever.</h2>
            <p>More dogs means a little more time, so prices scale fairly with your pack. Here's where things start; your final quote depends on yard size and access.</p>
          </div>

          {/* Yard cleanup — interactive */}
          <h3 className="ykx-subhead"><PawPrint size={18} /> Weekly yard cleanup</h3>
          <div className="ykx-calc yk-reveal">
            <div className="ykx-controls">
              <p className="ykx-ctl-label">How often?</p>
              <div className="ykx-seg">
                {YARD.frequencies.map((f) => (
                  <button key={f.id} className={`ykx-chip ${freq === f.id ? "on" : ""}`} onClick={() => setFreq(f.id)} aria-pressed={freq === f.id}>
                    {f.popular && <span className="ykx-pop">Popular</span>}
                    {f.label}<small>{f.sub}</small>
                  </button>
                ))}
              </div>
              <p className="ykx-ctl-label">How many dogs?</p>
              <div className="ykx-dogrow">
                {[1, 2, 3].map((d) => (
                  <button key={d} className={`ykx-dogbtn ${dogs === d ? "on" : ""}`} onClick={() => setDogs(d)} aria-pressed={dogs === d}>
                    <Dog size={20} />{d === 3 ? "3+" : d}
                  </button>
                ))}
              </div>
            </div>
            <div className="ykx-result">
              <div className="ykx-amt">${yardPrice}<small>/mo</small></div>
              <div className="ykx-subr">
                {YARD.frequencies.find((f) => f.id === freq).label} · {dogs === 3 ? "3+ dogs" : dogs === 1 ? "1 dog" : "2 dogs"}
              </div>
              <div className="ykx-meta">≈ ${perVisit.toFixed(0)} per visit · haul-away &amp; gate photo included · cancel anytime</div>
            </div>
          </div>
          <table className="ykx-matrix">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Monthly price</th>
                <th>1 dog</th>
                <th>2 dogs</th>
                <th>3+ dogs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Weekly <span style={{ fontWeight: 400, color: "var(--ink-soft)" }}>(4 visits)</span></th>
                <td className="hl">${YARD.prices.weekly[1]}</td>
                <td>${YARD.prices.weekly[2]}</td>
                <td>${YARD.prices.weekly[3]}</td>
              </tr>
              <tr>
                <th>Twice weekly <span style={{ fontWeight: 400, color: "var(--ink-soft)" }}>(8 visits)</span></th>
                <td>${YARD.prices.twice[1]}</td>
                <td>${YARD.prices.twice[2]}</td>
                <td>${YARD.prices.twice[3]}</td>
              </tr>
              <tr>
                <th>Every other week <span style={{ fontWeight: 400, color: "var(--ink-soft)" }}>(2 visits)</span></th>
                <td>${YARD.prices.biweekly[1]}</td>
                <td>${YARD.prices.biweekly[2]}</td>
                <td>${YARD.prices.biweekly[3]}</td>
              </tr>
            </tbody>
          </table>
          <p className="ykx-note">First-time or overgrown yards: a one-time initial cleanup starts at <b>${YARD.initialCleanup}</b> (priced by how much has built up). The first clean is the heaviest — after that, recurring visits keep it easy.</p>

          {/* Dog care */}
          <h3 className="ykx-subhead" style={{ marginTop: 48 }}><Home size={18} /> Dog care while you're away</h3>
          <div className="ykx-care yk-reveal">
            <div className="ykx-carecard">
              <span className="ykx-caretag">Overnight</span>
              <h4>House &amp; Pet Sitting</h4>
              <p className="cdesc">I stay overnight in your home, so your dog keeps their routine and your house stays lived-in and secure.</p>
              <div className="ykx-custom">from $55<small>/night · 2-night minimum · weekend from $110</small></div>
              <ul>
                <li><Check size={16} /> Overnight stays in your home</li>
                <li><Check size={16} /> Feeding, fresh water, potty breaks &amp; walks</li>
                <li><Check size={16} /> Playtime, company &amp; daily photo updates</li>
                <li><Check size={16} /> Free meet-and-greet before your first stay</li>
              </ul>
            </div>
            <div className="ykx-carecard">
              <span className="ykx-caretag">Drop-in visits</span>
              <h4>Dog Sitting &amp; Check-ins</h4>
              <p className="cdesc">I come by while you're gone to monitor, feed, and care for your dog — no overnight stay needed.</p>
              <div className="ykx-custom">from $20<small>per visit · $25 standard (30 min)</small></div>
              <ul>
                <li><Check size={16} /> Wellness checks &amp; monitoring</li>
                <li><Check size={16} /> Feeding, fresh water &amp; potty breaks</li>
                <li><Check size={16} /> Walks &amp; playtime</li>
                <li><Check size={16} /> Photo &amp; text update every visit</li>
              </ul>
            </div>
          </div>
          <p className="ykx-note">Add-ons: each additional pet <b>+$10/night</b> (sitting) or <b>+$5/visit</b> (drop-ins); holiday nights <b>+$15</b>; puppy, medication, or special care <b>+$10/night</b>. Final price confirmed at a free meet-and-greet.</p>

          {/* Dog walking */}
          <h3 className="ykx-subhead" style={{ marginTop: 48 }}><Footprints size={18} /> Dog walking</h3>
          <div className="ykx-walks yk-reveal">
            {WALKS.map((w) => (
              <div key={w.len} className={`ykx-pcard ${w.popular ? "on" : ""}`}>
                {w.popular && <span className="ykx-pop" style={{ top: -9, right: 14 }}>Popular</span>}
                <div className="len">{w.len}</div>
                <div className="amt">${w.price}</div>
                <div className="desc">{w.desc}</div>
              </div>
            ))}
          </div>
          <p className="ykx-note">Add-ons: <b>+$5</b> per additional dog from the same home · <b>+$5</b> evenings (after 5pm) &amp; weekends. Prefer an hourly number? A full hour is <b>$35</b>.</p>

          {/* Guarantee */}
          <div className="ykx-guarantee yk-reveal">
            <div className="ykx-guar-ico"><ShieldCheck size={26} /></div>
            <div className="ykx-guar-txt">
              <h3>Satisfaction guaranteed</h3>
              <p>If a visit isn't right, tell me and I'll come back and fix it — free.</p>
            </div>
            <button className="yk-btn yk-btn-primary" onClick={() => scrollToForm("waste")}>
              Get my free quote <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="yk-sec">
        <div className="yk-wrap yk-founder yk-reveal">
          <div className="yk-founder-photo">
            {/* ── REPLACE THIS PLACEHOLDER WITH THE OWNER PHOTO ──
                Put a photo at public/owner.jpg and swap the block below for:
                <img src="/owner.jpg" alt="Your Yard Keeper in Florence, OR" /> */}
            <div className="ph">
              <PawPrint size={40} />
              <span>Owner photo coming soon</span>
            </div>
          </div>
          <div>
            <div className="yk-kicker">Meet your Yard Keeper</div>
            <blockquote>
              "My name and my reputation are on every single visit — so your gate gets latched and your yard gets spotless."
            </blockquote>
            <p>
              Hi, I'm <b>{config.ownerName}</b> — the Yard Keeper. I'm a college student working my way
              through school, and I started {config.businessName} to do honest work for my neighbors and
              save for my college fund.
            </p>
            <p>
              This summer I'm serving {config.primaryCity}. Come {config.comingSoonWhen}, I'm bringing the same care to {config.comingSoonCity}.
              Either way, you get a local you can count on — not a faceless service.
            </p>
            <div className="sig">— {config.ownerName}, Owner</div>
          </div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="yk-sec" style={{ paddingTop: 0 }}>
        <div className="yk-wrap">
          <div className="yk-sec-head yk-reveal">
            <div className="yk-kicker">Where I work</div>
            <h2>Serving the Oregon coast — and heading to {config.comingSoonCity}.</h2>
          </div>
          <div className="yk-area yk-reveal">
            <div className="yk-area-card now">
              <div className="yk-area-pin"><MapPin size={20} /></div>
              <div>
                <div className="when">Now serving</div>
                <h3>{config.primaryCity}, Oregon</h3>
                <p>Taking new weekly waste-removal, sitting, and walking clients today.</p>
              </div>
            </div>
            <div className="yk-area-card">
              <div className="yk-area-pin"><MapPin size={20} /></div>
              <div>
                <div className="when">Starting {config.comingSoonWhen}</div>
                <h3>{config.comingSoonCity}, Oregon</h3>
                <p>Bringing the same trusted service to the {config.comingSoonCity} area. Get on the list early.</p>
              </div>
            </div>
          </div>
          {config.nearbyAreas?.length > 0 && (
            <p className="yk-area-towns yk-reveal">
              <b>Also serving nearby:</b> {config.nearbyAreas.join(" · ")} — and the surrounding central Oregon coast.
            </p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="yk-sec" style={{ paddingTop: 0 }}>
        <div className="yk-wrap">
          <div className="yk-sec-head yk-reveal" style={{ margin: "0 auto 30px", textAlign: "center", maxWidth: "100%" }}>
            <div className="yk-kicker">Good to know</div>
            <h2>Questions, answered straight.</h2>
          </div>
          <div className="yk-faq yk-reveal">
            {FAQ.map((f, i) => (
              <div className={`yk-faq-item ${openFaq === i ? "open" : ""}`} key={f.q}>
                <button className="yk-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  {f.q} <span className="yk-faq-plus">+</span>
                </button>
                {openFaq === i && <div className="yk-faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section className="yk-sec yk-form-sec" id="quote" ref={formRef}>
        <div className="yk-wrap yk-form-grid">
          <div className="yk-reveal">
            <div className="yk-kicker">Get started</div>
            <h2>Tell me about your yard.</h2>
            <p className="lead">Send a few details and I'll get back to you within a few hours with a quote.</p>
            <div className="yk-form-promises">
              <div><Clock size={18} /> Quick response — usually within hours</div>
              <div><ShieldCheck size={18} /> 100% satisfaction guarantee</div>
              <div><Check size={18} /> No contracts, no pressure</div>
            </div>
            <a className="yk-form-call" href={TEL}><Phone size={18} /> Prefer to talk? Call or text {config.phoneDisplay}</a>
          </div>

          <div className="yk-card-form yk-reveal">
            {submitted ? (
              <div className="yk-success">
                <div className="ok"><Check size={30} /></div>
                <h3>Thanks, {form.name.split(" ")[0] || "friend"}!</h3>
                <p>I've got your request and I'll reach out within a few hours.</p>
                {selectedServiceLabels.length > 0 && (
                  <div className="sel">You're interested in: {selectedServiceLabels.join(", ")}</div>
                )}
                <button className="yk-btn yk-btn-ghost" onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", area: "", message: "" }); setService({ waste: false, sitting: false, walking: false, unsure: false }); }}>
                  Send another request
                </button>
              </div>
            ) : (
              <div>
                {error && <div className="yk-error">{error}</div>}
                <div className="yk-field">
                  <label>What services are you interested in?</label>
                  <div className="yk-checks">
                    <label className={`yk-check ${service.waste ? "on" : ""}`}>
                      <input type="checkbox" checked={service.waste} onChange={() => toggleService("waste")} /> Waste removal
                    </label>
                    <label className={`yk-check ${service.sitting ? "on" : ""}`}>
                      <input type="checkbox" checked={service.sitting} onChange={() => toggleService("sitting")} /> Pet sitting
                    </label>
                    <label className={`yk-check ${service.walking ? "on" : ""}`}>
                      <input type="checkbox" checked={service.walking} onChange={() => toggleService("walking")} /> Dog walking
                    </label>
                    <label className={`yk-check ${service.unsure ? "on" : ""}`}>
                      <input type="checkbox" checked={service.unsure} onChange={() => toggleService("unsure")} /> Not sure yet
                    </label>
                  </div>
                </div>
                <div className="yk-field">
                  <label>Name</label>
                  <input className="yk-input" value={form.name} onChange={update("name")} placeholder="Your name" />
                </div>
                <div className="yk-field">
                  <label>Phone</label>
                  <input className="yk-input" value={form.phone} onChange={update("phone")} placeholder="(541) 555-0123" inputMode="tel" />
                </div>
                <div className="yk-field">
                  <label>Email <span style={{ color: "var(--ink-soft)", fontWeight: 400 }}>(optional)</span></label>
                  <input className="yk-input" value={form.email} onChange={update("email")} placeholder="you@email.com" inputMode="email" />
                </div>
                <div className="yk-field">
                  <label>Neighborhood or address</label>
                  <input className="yk-input" value={form.area} onChange={update("area")} placeholder={`e.g. ${config.primaryCity} — Greentrees`} />
                </div>
                <div className="yk-field">
                  <label>Anything I should know? <span style={{ color: "var(--ink-soft)", fontWeight: 400 }}>(optional)</span></label>
                  <textarea className="yk-input" value={form.message} onChange={update("message")} placeholder="How many dogs, gate access, a nervous pup, etc." />
                </div>
                <button className="yk-btn yk-btn-primary yk-submit" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Sending…" : <>Send my request <ArrowRight size={17} /></>}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="yk-footer">
        <div className="yk-wrap">
          <div className="yk-footer-in">
            <div>
              <div className="yk-logo" style={{ marginBottom: 14 }}>
                <span className="yk-logo-mark"><PawPrint size={18} /></span>
                {config.businessName}
              </div>
              <p className="yk-foot-note">
                Honest, reliable pet care from a local college student — clean yards, happy pets,
                and a satisfaction guarantee on every visit.
              </p>
            </div>
            <div className="yk-foot-contact">
              <a href={TEL}><Phone size={17} /> {config.phoneDisplay}</a>
              <a href={`mailto:${config.email}`}><Mail size={17} /> {config.email}</a>
              <a href="#services"><MapPin size={17} /> {config.primaryCity}, {config.primaryState} · {config.comingSoonCity} from {config.comingSoonWhen}</a>
            </div>
          </div>
          <div className="yk-foot-bottom">
            <span>© {new Date().getFullYear()} {config.businessName} · {config.domain}</span>
            <span>Built to help put a local student through college 🐾</span>
          </div>
        </div>
      </footer>

      {/* FLOATING CALL BUTTON (mobile) */}
      <a className="yk-fab" href={TEL} aria-label={`Call ${config.businessName}`}>
        <Phone size={18} /> Call now
      </a>
    </div>
  );
}
