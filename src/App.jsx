import React, { useEffect, useState } from "react";
import {
  Phone, MapPin, Check, Camera, PawPrint, ArrowRight, Menu, X,
} from "lucide-react";
import { config, PLANS, FIRST_CLEANUP, estimateQuote } from "./config.js";
import { trackEvent } from "./analytics.js";

const TEL = `tel:${config.phoneE164}`;
const TOWNS = [config.primaryCity, ...config.nearbyAreas];

const DOGS = [
  { img: "/dogs/dog-poodle.jpg", name: "Coco", breed: "Teacup poodle", size: "Small", pos: "center 30%" },
  { img: "/dogs/dog-medium.jpg", name: "Scout", breed: "Border collie", size: "Medium", pos: "30% center" },
  { img: "/dogs/dog-large.jpg", name: "Ranger", breed: "Golden retriever", size: "Medium–large", pos: "center 32%" },
  { img: "/dogs/dog-greatdane.jpg", name: "Duke", breed: "Great Dane", size: "Extra-large", pos: "center 18%" },
];

const STEPS = [
  {
    n: "01",
    title: "See the price",
    body: "Choose the dogs, how often, and whether you want walks. The number updates on this page before you send anything.",
  },
  {
    n: "02",
    title: "Nyte confirms the visit",
    body: "He texts before he arrives, checks the gate, and does the work whether or not you are home.",
  },
  {
    n: "03",
    title: "The yard is yours again",
    body: "Waste leaves with him. You get a photo when the gate is closed. Pause or cancel whenever you need to.",
  },
];

const TRUST = [
  {
    title: "One person, in Corvallis",
    body: `${config.ownerName} studies pre-med at ${config.school} and does the visits himself. The Yard Keepers is his business. It is not a university service, and the school does not sponsor it.`,
  },
  {
    title: "A photo when he leaves",
    body: "He latches the gate and sends a picture, so you can see the visit happened. You do not have to take his word for a closed gate.",
  },
  {
    title: "Careful, because he is trained for it",
    body: "Nyte is a licensed CNA. The habits from that work — show up, pay attention, do the careful thing — are how he looks after your dog.",
  },
  {
    title: "Haul-away is part of the plan",
    body: "The waste does not sit in your bin. It leaves with him on every yard visit that is part of a recurring plan.",
  },
];

function faqItems() {
  const weekly = PLANS.weekly;
  const walks = PLANS.weeklyWalks;
  const twice = PLANS.twice;
  const towns = config.nearbyAreas.join(", ");
  return [
    {
      q: `How much does dog poop scooping cost in ${config.primaryCity}?`,
      a: `${weekly.name} is $${weekly.prices[1]}/month for one dog and $${weekly.prices[2]}/month for two, with ${weekly.visitsPerMonth} visits. ${twice.name} is $${twice.prices[1]}/month for one dog, with ${twice.visitsPerMonth} visits. ${walks.name} is a $${walks.prices[1]}/month launch offer for one dog: the weekly scoop plus ${walks.walksPerMonth} walks of ${walks.walkMinutes} minutes. ${FIRST_CLEANUP.label}. Three or more dogs, two dogs on a twice-weekly plan, and pet sitting are quoted individually.`,
    },
    {
      q: "What happens on a yard visit?",
      a: "Nyte texts before he arrives, scoops the yard, hauls the waste away, latches the gate, and sends a photo. You do not need to be home if he can get into the yard safely.",
    },
    {
      q: "Is the first cleanup free?",
      a: FIRST_CLEANUP.terms,
    },
    {
      q: "Do you walk dogs and pet sit in Corvallis, OR?",
      a: `Yes. Dog walking in ${config.primaryCity} is part of the ${walks.name} launch offer, or you can ask for walks on their own. In-home pet sitting — overnight or drop-in — is quoted after a meet-and-greet. There is no published sitting price.`,
    },
    {
      q: "Which towns do you cover?",
      a: `${config.primaryCity}, ${config.primaryStateName} is the home route. Nearby towns on the current list are ${towns}. If you are just outside that list, send a request and Nyte will say whether he can take the street.`,
    },
    {
      q: "What if my gate is locked, or my dog is nervous?",
      a: "Tell him when you request the quote. He can use a code you share, or you can put a protective dog inside for the visit. He would rather know ahead than guess at the gate.",
    },
    {
      q: "What if the yard is overgrown or the weather is bad?",
      a: "If he cannot see the waste, he cannot pretend he got all of it. He will tell you, and you will sort out a plan. He works in ordinary Oregon rain. If a visit has to move, he will say so the same day.",
    },
    {
      q: "Can I cancel?",
      a: "Yes. There is no contract. Give him a heads-up and the recurring plan stops. He would rather you leave cleanly than stay stuck.",
    },
  ];
}

const FAQ = faqItems();

function money(amount) {
  return `$${amount}`;
}

const EMPTY_FORM = { name: "", phone: "", email: "", area: "", message: "" };

export default function TheYardKeepers() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quote, setQuote] = useState({
    dogs: 1,
    frequency: "weekly",
    addWalks: false,
    service: "yard",
  });
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const yardEstimate = estimateQuote(quote);
  const isSitting = quote.service === "sitting";
  const estimate = isSitting
    ? {
        priced: false,
        name: PLANS.sitting.name,
        note: "In-home sitting is quoted after Nyte knows the dogs, the dates, and whether you need an overnight stay.",
      }
    : yardEstimate;

  useEffect(() => {
    const nodes = document.querySelectorAll(".yk-fade");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("yk-in");
      }),
      { threshold: 0.12 }
    );
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  const go = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectPlan = (planId) => {
    if (planId === "sitting") {
      setQuote((q) => ({ ...q, service: "sitting" }));
      go("contact");
      return;
    }
    if (planId === "weekly-walks") {
      setQuote({ dogs: 1, frequency: "weekly", addWalks: true, service: "yard" });
    } else if (planId === "twice") {
      setQuote({ dogs: 1, frequency: "twice", addWalks: false, service: "yard" });
    } else {
      setQuote({ dogs: 1, frequency: "weekly", addWalks: false, service: "yard" });
    }
    go("quote");
  };

  const setDogs = (dogs, service) => setQuote((q) => ({ ...q, dogs, ...(service ? { service } : {}) }));
  const setFrequency = (frequency, service) => setQuote((q) => ({ ...q, frequency, ...(service ? { service } : {}) }));
  const setWalks = (addWalks, service) => setQuote((q) => ({ ...q, addWalks, ...(service ? { service } : {}) }));

  const quoteSummary = () => {
    if (isSitting) return `${PLANS.sitting.name} — ask for a quote`;
    if (!estimate.priced) return `${estimate.name} — ask for a quote`;
    const dogs = quote.dogs === 1 ? "1 dog" : "2 dogs";
    const walks = quote.addWalks ? " · two 30-minute walks" : "";
    return `${estimate.name} · ${dogs}${walks} · ${money(estimate.amount)}/month`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Add your name and phone so Nyte can reach you.");
      return;
    }
    setError("");

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      area: form.area.trim(),
      message: form.message.trim(),
      services: isSitting ? "In-home pet sitting" : quoteSummary(),
      service: isSitting ? "sitting" : "yard",
      plan: estimate.name,
      dogs: String(quote.dogs === 3 ? "3+" : quote.dogs),
      frequency: quote.frequency,
      addWalks: quote.addWalks ? "yes" : "no",
      quotedMonthly: !isSitting && estimate.priced ? String(estimate.amount) : "custom",
      quoteDetail: quoteSummary(),
      source: "theyardkeepers.pet",
    };

    if (config.formEndpoint) {
      setSubmitting(true);
      try {
        const res = await fetch(config.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Bad response");
        trackEvent("quote_submitted", { services: payload.services });
        setSubmitted(true);
      } catch {
        setError(`Something went wrong sending that. Call or text ${config.phoneDisplay} and Nyte will help.`);
      } finally {
        setSubmitting(false);
      }
    } else {
      setError(`Call or text ${config.phoneDisplay} and Nyte will get you a quote right away.`);
    }
  };

  const perVisitLabel = estimate.priced && estimate.perVisit && Number.isInteger(estimate.perVisit)
    ? `${money(estimate.perVisit)}/visit · ${estimate.visits} visits/month`
    : estimate.priced
      ? `${estimate.visits} visits/month`
      : null;

  return (
    <div className="yk">
      <style>{`
        .yk{
          --orange:#D73F09; --black:#000; --paper:#F6F4F0; --white:#fff;
          --muted:rgba(0,0,0,.64); --line:rgba(0,0,0,.12); --soft:rgba(255,255,255,.72);
          font-family:Outfit,system-ui,sans-serif; color:var(--black); background:var(--paper);
          line-height:1.55; -webkit-font-smoothing:antialiased;
        }
        .yk *{box-sizing:border-box;}
        .yk h1,.yk h2,.yk h3,.yk .serif{font-family:"Source Serif 4",Georgia,serif; font-weight:560; letter-spacing:-.02em; margin:0;}
        .yk a{color:inherit;}
        .yk-wrap{max-width:1120px; margin:0 auto; padding:0 24px;}
        .yk-kicker{font-size:12px; font-weight:650; letter-spacing:.16em; text-transform:uppercase; color:var(--orange); margin:0 0 12px;}
        .yk-skip{position:absolute; left:12px; top:-40px; background:var(--black); color:#fff; padding:8px 12px; z-index:80;}
        .yk-skip:focus{top:12px;}

        .yk-header{position:sticky; top:0; z-index:40; background:rgba(246,244,240,.94); backdrop-filter:blur(10px); border-bottom:1px solid var(--line);}
        .yk-nav{display:flex; align-items:center; justify-content:space-between; min-height:72px; gap:16px;}
        .yk-brand{display:flex; align-items:center; gap:10px; text-decoration:none; font-weight:700; letter-spacing:-.02em;}
        .yk-mark{width:32px; height:32px; border-radius:8px; background:var(--orange); color:#fff; display:grid; place-items:center; flex:none;}
        .yk-links{display:flex; align-items:center; gap:28px; list-style:none; margin:0; padding:0; font-size:14px; font-weight:550;}
        .yk-links a{text-decoration:none;}
        .yk-links a:hover{color:var(--orange);}
        .yk-phone{display:inline-flex; align-items:center; gap:8px; text-decoration:none; font-size:14px; font-weight:650; color:var(--orange);}
        .yk-phone:hover{color:var(--black);}
        .yk-menu-btn{display:none; border:0; background:transparent; padding:8px; cursor:pointer;}
        .yk-drawer{display:none;}

        .yk-hero{padding:72px 0 28px;}
        .yk-hero-grid{display:grid; grid-template-columns:1.05fr .95fr; gap:48px; align-items:center;}
        .yk-hero h1{font-size:clamp(46px,6vw,76px); line-height:1.02; margin-bottom:22px;}
        .yk-hero h1 span{color:var(--orange);}
        .yk-lead{font-size:18px; color:var(--muted); max-width:42ch; margin:0 0 28px;}
        .yk-actions{display:flex; flex-wrap:wrap; gap:12px;}
        .yk-btn{display:inline-flex; align-items:center; justify-content:center; gap:8px; border-radius:12px; border:1.5px solid transparent; font-family:inherit; font-weight:650; font-size:15px; padding:14px 22px; cursor:pointer; text-decoration:none; transition:transform .15s ease, background .15s ease;}
        .yk-btn:hover{transform:translateY(-1px);}
        .yk-btn:focus-visible,.yk-chip:focus-visible,.yk-menu-btn:focus-visible,summary:focus-visible,.yk-input:focus-visible{outline:3px solid var(--orange); outline-offset:2px;}
        .yk-btn-orange{background:var(--orange); color:#fff;}
        .yk-btn-orange:hover{background:#b83408;}
        .yk-btn-black{background:var(--black); color:#fff;}
        .yk-btn-ghost{background:transparent; color:var(--black); border-color:rgba(0,0,0,.22);}
        .yk-btn-ghost:hover{border-color:var(--black);}
        .yk-btn[disabled]{opacity:.65; cursor:default; transform:none;}
        .yk-fine{display:flex; align-items:center; gap:8px; margin:16px 0 0; font-size:13px; color:rgba(0,0,0,.55);}
        .yk-hero-photo{position:relative; border-radius:16px; overflow:hidden; aspect-ratio:4/3; background:#ddd;}
        .yk-hero-photo img{width:100%; height:100%; object-fit:cover; display:block;}
        .yk-hero-cap{position:absolute; left:0; right:0; bottom:0; background:rgba(0,0,0,.9); color:#fff; padding:14px 18px; font-size:14px; font-weight:550;}

        .yk-section{padding:88px 0;}
        .yk-section h2{font-size:clamp(36px,4.5vw,52px); line-height:1.08;}
        .yk-white{background:var(--white);}
        .yk-black{background:var(--black); color:#fff;}
        .yk-black .yk-kicker{color:#ffb088;}
        .yk-steps{display:grid; grid-template-columns:repeat(3,1fr); gap:36px; margin-top:48px;}
        .yk-step-top{display:flex; align-items:center; gap:14px; margin-bottom:14px;}
        .yk-num{font-family:"Source Serif 4",Georgia,serif; font-size:40px; font-weight:450; color:rgba(0,0,0,.28);}
        .yk-step h3{font-size:28px; margin-bottom:10px;}
        .yk-step p,.yk-trust p,.yk-area-copy{color:var(--muted); margin:0;}

        .yk-why-head{display:grid; grid-template-columns:1.4fr .6fr; gap:36px; align-items:end; margin-bottom:48px;}
        .yk-why-head p{color:var(--soft); max-width:46ch; margin:16px 0 0;}
        .yk-owner{border-radius:16px; overflow:hidden; aspect-ratio:4/5; background:#222;}
        .yk-owner img{width:100%; height:100%; object-fit:cover; object-position:center 18%; display:block;}
        .yk-trust{display:grid; grid-template-columns:repeat(4,1fr); gap:28px;}
        .yk-trust article{border-top:1px solid rgba(255,255,255,.2); padding-top:22px;}
        .yk-trust h3{font-size:26px; color:#fff; margin-bottom:10px;}
        .yk-trust p{color:rgba(255,255,255,.72);}
        .yk-trust svg{color:var(--orange); margin-bottom:14px;}

        .yk-plans{display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-top:40px;}
        .yk-plan{position:relative; background:var(--white); border-radius:16px; padding:28px 22px; display:flex; flex-direction:column; gap:18px; border:1px solid transparent;}
        .yk-plan.pop{background:var(--black); color:#fff;}
        .yk-tag{position:absolute; top:-11px; left:20px; background:var(--orange); color:#fff; font-size:11px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; border-radius:999px; padding:4px 10px;}
        .yk-plan-name{font-size:13px; font-weight:650; letter-spacing:.04em; text-transform:uppercase; opacity:.62; margin:0 0 8px;}
        .yk-price{font-family:"Source Serif 4",Georgia,serif; font-size:44px; line-height:1; display:flex; align-items:baseline; flex-wrap:wrap; gap:8px;}
        .yk-price small{font-family:Outfit,sans-serif; font-size:14px; font-weight:500; opacity:.6;}
        .yk-subprice{color:var(--orange); font-size:14px; font-weight:650; margin:8px 0 0;}
        .yk-plan.pop .yk-subprice{color:#ffb088;}
        .yk-plan ul{list-style:none; margin:0; padding:0; display:grid; gap:10px;}
        .yk-plan li{display:flex; gap:8px; align-items:flex-start; font-size:14px;}
        .yk-plan li svg{flex:none; margin-top:2px; color:var(--orange);}
        .yk-plan .yk-btn{margin-top:auto; width:100%;}
        .yk-note{margin:22px 0 0; text-align:center; color:var(--muted); font-size:14px;}

        .yk-quote{max-width:680px; margin:0 auto; text-align:center;}
        .yk-calc{text-align:left; background:#fff; border:1px solid var(--line); border-radius:16px; padding:28px; margin-top:28px;}
        .yk-field-label{display:block; font-size:12px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:rgba(0,0,0,.5); margin:0 0 10px;}
        .yk-chips{display:flex; flex-wrap:wrap; gap:10px; margin-bottom:22px;}
        .yk-chip{min-width:108px; border-radius:12px; border:1.5px solid rgba(0,0,0,.16); background:var(--paper); color:var(--black); font-family:inherit; font-weight:600; font-size:14px; padding:12px 14px; cursor:pointer;}
        .yk-chip small{display:block; font-weight:500; font-size:11px; color:rgba(0,0,0,.5); margin-top:2px;}
        .yk-chip.on{background:var(--black); color:#fff; border-color:var(--black);}
        .yk-chip.on small{color:rgba(255,255,255,.7);}
        .yk-result{border-top:1px solid var(--line); padding-top:22px; display:flex; justify-content:space-between; gap:18px; align-items:flex-end; flex-wrap:wrap;}
        .yk-result-price{font-family:"Source Serif 4",Georgia,serif; font-size:56px; line-height:.95;}
        .yk-result-price small{font-family:Outfit,sans-serif; font-size:14px; margin-left:8px; color:var(--muted);}
        .yk-result p{margin:6px 0 0; color:var(--orange); font-weight:650; font-size:14px;}
        .yk-legal{margin:12px 0 0; font-size:12px; color:rgba(0,0,0,.48);}

        .yk-towns{display:flex; flex-wrap:wrap; gap:10px; margin:22px 0;}
        .yk-town{background:var(--paper); border-radius:12px; padding:12px 16px; font-size:14px; font-weight:650;}
        .yk-town.home{background:var(--black); color:#fff;}
        .yk-dogs{display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:28px;}
        .yk-dog{margin:0; background:#fff; border-radius:14px; overflow:hidden; border:1px solid var(--line);}
        .yk-dog img{width:100%; aspect-ratio:1; object-fit:cover; display:block;}
        .yk-dog figcaption{padding:12px 14px;}
        .yk-dog b{display:block;}
        .yk-dog span{color:var(--muted); font-size:13px;}

        .yk-faq{max-width:760px;}
        .yk-faq details{border-bottom:1px solid var(--line); padding:18px 0;}
        .yk-faq summary{display:flex; justify-content:space-between; gap:16px; align-items:center; cursor:pointer; font-weight:650; list-style:none;}
        .yk-faq summary::-webkit-details-marker{display:none;}
        .yk-faq summary svg{flex:none; color:var(--orange); transition:transform .2s ease;}
        .yk-faq details[open] summary svg{transform:rotate(45deg);}
        .yk-faq details p{margin:12px 0 0; color:var(--muted); max-width:68ch;}

        .yk-contact{display:grid; grid-template-columns:.9fr 1.1fr; gap:48px; align-items:start;}
        .yk-contact-side p{color:var(--muted); max-width:36ch;}
        .yk-contact-list{display:grid; gap:14px; margin-top:28px;}
        .yk-contact-list a,.yk-contact-list p{display:flex; align-items:center; gap:10px; text-decoration:none; margin:0; color:var(--black); font-weight:600;}
        .yk-contact-list svg{color:var(--orange);}
        .yk-banner{display:flex; justify-content:space-between; gap:12px; background:#fff4ef; border:1px solid rgba(215,63,9,.25); border-radius:12px; padding:14px 16px; margin-bottom:16px;}
        .yk-banner strong{display:block;}
        .yk-banner a{color:var(--orange); font-size:13px; font-weight:700; white-space:nowrap;}
        .yk-form{display:grid; gap:14px;}
        .yk-row{display:grid; grid-template-columns:1fr 1fr; gap:12px;}
        .yk-row-3{display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;}
        .yk-input,.yk-form select,.yk-form textarea{width:100%; font:inherit; font-size:15px; padding:12px 14px; border-radius:12px; border:1.5px solid var(--line); background:var(--paper); color:var(--black);}
        .yk-form textarea{min-height:96px; resize:vertical;}
        .yk-error{background:#fff1ec; color:#8a2806; font-weight:650; font-size:14px; padding:10px 12px; border-radius:10px;}
        .yk-success{background:#fff; border-radius:16px; padding:28px; text-align:center;}
        .yk-success h3{font-size:32px; margin:8px 0;}

        .yk-footer{background:var(--black); color:rgba(255,255,255,.72); padding:64px 0 28px;}
        .yk-foot-grid{display:grid; grid-template-columns:1.4fr .8fr .8fr; gap:32px;}
        .yk-footer h2{color:#fff; font-family:Outfit,sans-serif; font-size:22px; letter-spacing:-.03em;}
        .yk-footer a{color:inherit; text-decoration:none;}
        .yk-footer a:hover{color:#fff;}
        .yk-foot-label{font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.45); margin:0 0 12px;}
        .yk-foot-bottom{border-top:1px solid rgba(255,255,255,.12); margin-top:32px; padding-top:16px; display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; font-size:13px; color:rgba(255,255,255,.45);}

        .yk-sticky{display:none;}
        .yk-sticky.yk-hide{display:none !important;}
        .yk-fade{opacity:0; transform:translateY(16px); transition:opacity .6s ease, transform .6s ease;}
        .yk-in{opacity:1; transform:none;}
        section, #quote, #contact{scroll-margin-top:84px;}

        @media (max-width:900px){
          .yk-links,.yk-nav .yk-phone{display:none;}
          .yk-menu-btn{display:inline-flex;}
          .yk-drawer{display:block; border-top:1px solid var(--line); padding:8px 24px 18px;}
          .yk-drawer a,.yk-drawer button{display:block; width:100%; text-align:left; background:none; border:0; font:inherit; font-weight:600; padding:12px 0; cursor:pointer; text-decoration:none;}
          .yk-hero{padding:36px 0 8px;}
          .yk-hero-grid,.yk-why-head,.yk-contact,.yk-foot-grid,.yk-plans,.yk-steps,.yk-trust,.yk-dogs{grid-template-columns:1fr;}
          .yk-plans{grid-template-columns:1fr 1fr;}
          .yk-dogs{grid-template-columns:1fr 1fr;}
          .yk-owner{max-width:240px;}
          .yk-row-3{grid-template-columns:1fr;}
          .yk-sticky{display:flex; position:fixed; left:0; right:0; bottom:0; z-index:50; gap:8px; padding:10px 12px calc(10px + env(safe-area-inset-bottom)); background:#fff; border-top:1px solid var(--line);}
          .yk-sticky .yk-btn{flex:1;}
          .yk-sticky .yk-call{flex:0 0 auto; padding-inline:16px;}
          .yk{padding-bottom:76px;}
        }
        @media (max-width:560px){
          .yk-plans,.yk-row{grid-template-columns:1fr;}
          .yk-wrap{padding:0 16px;}
          .yk-section{padding:64px 0;}
        }
        @media (prefers-reduced-motion:reduce){
          .yk-fade{opacity:1; transform:none; transition:none;}
          .yk-btn:hover{transform:none;}
          *{scroll-behavior:auto !important;}
        }
      `}</style>

      <a className="yk-skip" href="#quote">Skip to the free quote</a>

      <header className="yk-header">
        <div className="yk-wrap yk-nav">
          <a className="yk-brand" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <span className="yk-mark" aria-hidden="true"><PawPrint size={18} /></span>
            {config.businessName}
          </a>
          <ul className="yk-links">
            <li><a href="#how-it-works">How it works</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a className="yk-phone" href={TEL} onClick={() => trackEvent("call_click", { location: "nav" })}>
            <Phone size={15} aria-hidden="true" /> {config.phoneDisplay}
          </a>
          <button className="yk-menu-btn" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="yk-drawer" id="mobile-menu">
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            <a href={TEL} onClick={() => trackEvent("call_click", { location: "nav" })}>{config.phoneDisplay}</a>
          </div>
        )}
      </header>

      <main id="top">
        <section className="yk-hero" aria-labelledby="hero-title">
          <div className="yk-wrap yk-hero-grid">
            <div>
              <p className="yk-kicker">{TOWNS.join(" · ")}</p>
              <h1 id="hero-title">Dog waste removal<br />in <span>{config.primaryCity}</span></h1>
              <p className="yk-lead">
                Weekly scooping for homes in {config.primaryCity}, plus walks and in-home sitting when you need them.
                {" "}{PLANS.weekly.name} is {money(PLANS.weekly.prices[1])}/month for one dog and {money(PLANS.weekly.prices[2])}/month for two.
                {" "}Haul-away is included. {FIRST_CLEANUP.label}. No contracts.
              </p>
              <div className="yk-actions">
                <button className="yk-btn yk-btn-orange" type="button" onClick={() => go("quote")}>
                  Get a free quote <ArrowRight size={16} aria-hidden="true" />
                </button>
                <a className="yk-btn yk-btn-ghost" href={TEL} onClick={() => trackEvent("call_click", { location: "hero" })}>
                  <Phone size={15} aria-hidden="true" /> {config.phoneDisplay}
                </a>
              </div>
              <p className="yk-fine"><Check size={14} aria-hidden="true" /> Licensed CNA · replies within a few hours</p>
            </div>
            <div className="yk-hero-photo">
              <img
                src="/dogs/dog-poodle.jpg"
                alt="Coco, a small apricot poodle, sitting in the grass"
                width="900"
                height="675"
                fetchPriority="high"
              />
              <p className="yk-hero-cap">A photo when the gate is closed, sent after every yard visit.</p>
            </div>
          </div>
        </section>

        <section className="yk-section yk-white" id="how-it-works">
          <div className="yk-wrap">
            <div className="yk-fade">
              <p className="yk-kicker">Simple process</p>
              <h2>How it works</h2>
            </div>
            <div className="yk-steps">
              {STEPS.map((step) => (
                <article className="yk-step yk-fade" key={step.n}>
                  <div className="yk-step-top">
                    <span className="yk-num">{step.n}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="yk-section yk-black" id="why-nyte">
          <div className="yk-wrap">
            <div className="yk-why-head yk-fade">
              <div>
                <p className="yk-kicker">Why Nyte</p>
                <h2>A local student who treats your dog carefully.</h2>
                <p>
                  {config.ownerName} is the person who shows up. He is a pre-med student at {config.school} and a licensed CNA.
                  He is careful, he is reliable, and the visit is his name on the line.
                </p>
              </div>
              <figure className="yk-owner">
                <img
                  src="/owner.jpg"
                  alt={`${config.ownerName}, owner of ${config.businessName} in ${config.primaryCity}, ${config.primaryStateName}`}
                  width="640"
                  height="800"
                />
              </figure>
            </div>
            <div className="yk-trust">
              {TRUST.map((item) => (
                <article className="yk-fade" key={item.title}>
                  <Check size={26} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="yk-section" id="pricing">
          <div className="yk-wrap">
            <div className="yk-fade">
              <p className="yk-kicker">Transparent pricing</p>
              <h2>Simple monthly prices.</h2>
              <p className="yk-lead" style={{ marginTop: 14 }}>
                What is printed here is the price. Use the quote below if you have a different number of dogs or want walks added.
              </p>
            </div>
            <div className="yk-plans">
              <PlanCard plan={PLANS.weekly} popular priceNote={`${money(PLANS.weekly.prices[1] / PLANS.weekly.visitsPerMonth)} a visit · 1 dog. 2 dogs ${money(PLANS.weekly.prices[2])}/month.`} onSelect={() => selectPlan("weekly")} />
              <PlanCard plan={PLANS.weeklyWalks} priceNote="Weekly scoop plus two 30-minute walks. Launch price for 1 dog." onSelect={() => selectPlan("weekly-walks")} />
              <PlanCard plan={PLANS.twice} priceNote={`${PLANS.twice.visitsPerMonth} visits a month · published for 1 dog.`} onSelect={() => selectPlan("twice")} />
              <PlanCard plan={PLANS.sitting} priceNote="Overnight or drop-in, in your home." onSelect={() => selectPlan("sitting")} cta="Ask for a quote" />
            </div>
            <p className="yk-note">{FIRST_CLEANUP.label}. {FIRST_CLEANUP.terms}</p>
          </div>
        </section>

        <section className="yk-section" id="quote" style={{ paddingTop: 0 }}>
          <div className="yk-wrap">
            <div className="yk-quote yk-fade">
              <p className="yk-kicker">Free quote</p>
              <h2>Get your price.</h2>
              <p className="yk-lead" style={{ marginLeft: "auto", marginRight: "auto" }}>
                Three choices. The price updates immediately, then it rides along when you send the request.
              </p>
            </div>
            <div className="yk-calc yk-fade" role="group" aria-label="Instant price estimate">
              <span className="yk-field-label" id="dogs-label">Number of dogs</span>
              <div className="yk-chips" role="radiogroup" aria-labelledby="dogs-label">
                {[1, 2, 3].map((n) => (
                  <button key={n} type="button" className={`yk-chip ${quote.dogs === n && !isSitting ? "on" : ""}`} aria-pressed={quote.dogs === n && !isSitting} onClick={() => setDogs(n, "yard")}>
                    {n === 3 ? "3+ dogs" : `${n} ${n === 1 ? "dog" : "dogs"}`}
                  </button>
                ))}
              </div>
              <span className="yk-field-label" id="freq-label">How often</span>
              <div className="yk-chips" role="radiogroup" aria-labelledby="freq-label">
                <button type="button" className={`yk-chip ${quote.frequency === "weekly" && !isSitting ? "on" : ""}`} aria-pressed={quote.frequency === "weekly" && !isSitting} onClick={() => setFrequency("weekly", "yard")}>
                  Weekly<small>4 visits / month</small>
                </button>
                <button type="button" className={`yk-chip ${quote.frequency === "twice" && !isSitting ? "on" : ""}`} aria-pressed={quote.frequency === "twice" && !isSitting} onClick={() => setFrequency("twice", "yard")}>
                  Twice a week<small>8 visits / month</small>
                </button>
              </div>
              <span className="yk-field-label" id="walks-label">Walks</span>
              <div className="yk-chips" role="radiogroup" aria-labelledby="walks-label">
                <button type="button" className={`yk-chip ${!quote.addWalks && !isSitting ? "on" : ""}`} aria-pressed={!quote.addWalks && !isSitting} onClick={() => setWalks(false, "yard")}>
                  Yard only
                </button>
                <button type="button" className={`yk-chip ${quote.addWalks && !isSitting ? "on" : ""}`} aria-pressed={quote.addWalks && !isSitting} onClick={() => setWalks(true, "yard")}>
                  Add two walks<small>30 minutes each</small>
                </button>
              </div>
              <div className="yk-result">
                <div>
                  <p className="yk-field-label">Your estimate</p>
                  {estimate.priced ? (
                    <>
                      <div className="yk-result-price">{money(estimate.amount)}<small>per month</small></div>
                      <p>{perVisitLabel}{estimate.detail ? ` · ${estimate.detail}` : ""}</p>
                    </>
                  ) : (
                    <>
                      <div className="yk-result-price" style={{ fontSize: 40 }}>Ask for a quote</div>
                      <p style={{ color: "rgba(0,0,0,.64)", fontWeight: 500 }}>{estimate.note}</p>
                    </>
                  )}
                </div>
                <button className="yk-btn yk-btn-orange" type="button" onClick={() => go("contact")}>
                  {estimate.priced ? "Request this quote" : "Ask for a quote"} <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
              <p className="yk-legal">{FIRST_CLEANUP.label}. {FIRST_CLEANUP.terms} Nyte confirms the final price before the first visit.</p>
            </div>
          </div>
        </section>

        <section className="yk-section yk-white" id="service-area">
          <div className="yk-wrap">
            <div className="yk-fade">
              <p className="yk-kicker">Where he works</p>
              <h2>Serving {config.primaryCity}</h2>
              <p className="yk-area-copy" style={{ maxWidth: "62ch", marginTop: 14 }}>
                The route is {config.primaryCity}. Nyte also lists nearby {config.nearbyAreas.join(", ")} as towns he can reach.
                He knows these as a student who lives in the valley, not as a stop on a statewide schedule.
              </p>
            </div>
            <div className="yk-towns yk-fade" aria-label="Service towns">
              {TOWNS.map((town) => (
                <span className={`yk-town ${town === config.primaryCity ? "home" : ""}`} key={town}>{town}</span>
              ))}
            </div>
            <p className="yk-area-copy">
              Just outside this list? Send a request anyway. He will tell you yes or no before anyone makes the drive.
            </p>
            <div className="yk-dogs">
              {DOGS.map((dog) => (
                <figure className="yk-dog yk-fade" key={dog.name}>
                  <img src={dog.img} alt={`${dog.name}, a ${dog.size.toLowerCase()} ${dog.breed}`} style={{ objectPosition: dog.pos }} />
                  <figcaption>
                    <b>{dog.name}</b>
                    <span>{dog.size} · {dog.breed}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="yk-section" id="faq">
          <div className="yk-wrap yk-faq">
            <div className="yk-fade">
              <p className="yk-kicker">Questions</p>
              <h2>Frequently asked</h2>
            </div>
            <div className="yk-fade">
              {FAQ.map((item) => (
                <details key={item.q}>
                  <summary>
                    {item.q}
                    <Plus />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="yk-section yk-white" id="contact">
          <div className="yk-wrap yk-contact">
            <div className="yk-fade">
              <p className="yk-kicker">Get started</p>
              <h2>Ready for a cleaner yard?</h2>
              <p>
                Send the quote you just built. Nyte reads it himself and replies within a few hours to set the first visit.
              </p>
              <div className="yk-contact-list">
                <a href={TEL} onClick={() => trackEvent("call_click", { location: "form" })}>
                  <Phone size={18} aria-hidden="true" /> {config.phoneDisplay}
                </a>
                <p><MapPin size={18} aria-hidden="true" /> {config.primaryCity}, {config.primaryState}</p>
                <p>{config.hours.label}</p>
              </div>
            </div>

            <div className="yk-fade">
              {/*
                SWEEPANDGO EMBED POINT
                When config.booking.enabled is true, mount the Sweep&Go widget
                in #sweepandgo-booking. Nothing is loaded while that flag is false.
              */}
              {config.booking.enabled && (
                <div id="sweepandgo-booking" data-provider={config.booking.provider} />
              )}

              {submitted ? (
                <div className="yk-success" role="status">
                  <Check size={28} color="#D73F09" aria-hidden="true" />
                  <h3>Thanks, {form.name.split(" ")[0] || "there"}.</h3>
                  <p>Nyte has the request and will reach out within a few hours.</p>
                  <p style={{ color: "#D73F09", fontWeight: 700 }}>{quoteSummary()}</p>
                  <button className="yk-btn yk-btn-ghost" type="button" onClick={() => { setSubmitted(false); setForm(EMPTY_FORM); }}>
                    Send another request
                  </button>
                </div>
              ) : (
                <form className="yk-form" onSubmit={handleSubmit} noValidate>
                  <div className="yk-banner">
                    <div>
                      <span className="yk-field-label">Selected plan</span>
                      <strong>{estimate.name}</strong>
                      <span>{estimate.priced ? `${money(estimate.amount)} per month` : "Ask for a quote"}</span>
                    </div>
                    <a href="#quote">Edit plan</a>
                  </div>
                  {error && <div className="yk-error" role="alert">{error}</div>}
                  <div className="yk-row">
                    <label>
                      <span className="yk-field-label">Name</span>
                      <input className="yk-input" name="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </label>
                    <label>
                      <span className="yk-field-label">Phone</span>
                      <input className="yk-input" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                    </label>
                  </div>
                  <label>
                    <span className="yk-field-label">Email (optional)</span>
                    <input className="yk-input" name="email" type="email" autoComplete="email" inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </label>
                  <label>
                    <span className="yk-field-label">Neighborhood or address</span>
                    <input className="yk-input" name="area" autoComplete="street-address" placeholder={`${config.primaryCity}, or a nearby town`} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
                  </label>
                  <div className="yk-row-3">
                    <label>
                      <span className="yk-field-label">Need</span>
                      <select className="yk-input" value={quote.service} onChange={(e) => setQuote((q) => ({ ...q, service: e.target.value }))}>
                        <option value="yard">Yard plan</option>
                        <option value="sitting">In-home pet sitting</option>
                      </select>
                    </label>
                    <label>
                      <span className="yk-field-label">Dogs</span>
                      <select className="yk-input" value={String(quote.dogs)} onChange={(e) => setDogs(Number(e.target.value))}>
                        <option value="1">1 dog</option>
                        <option value="2">2 dogs</option>
                        <option value="3">3+ dogs</option>
                      </select>
                    </label>
                    <label>
                      <span className="yk-field-label">Frequency</span>
                      <select className="yk-input" value={quote.frequency} onChange={(e) => setFrequency(e.target.value)}>
                        <option value="weekly">Weekly</option>
                        <option value="twice">Twice a week</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    <span className="yk-field-label">Walks</span>
                    <select className="yk-input" value={quote.addWalks ? "yes" : "no"} onChange={(e) => setWalks(e.target.value === "yes")}>
                      <option value="no">Yard only</option>
                      <option value="yes">Add two 30-minute walks</option>
                    </select>
                  </label>
                  <label>
                    <span className="yk-field-label">Notes (optional)</span>
                    <textarea className="yk-input" name="message" placeholder="Gate code, a nervous dog, dates you need sitting..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </label>
                  <button className="yk-btn yk-btn-orange" type="submit" disabled={submitting}>
                    {submitting ? "Sending…" : "Send my free quote request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="yk-footer">
        <div className="yk-wrap">
          <div className="yk-foot-grid">
            <div>
              <h2>{config.businessName}</h2>
              <p>
                Dog waste removal, dog walking, and in-home pet sitting in {config.primaryCity}, {config.primaryStateName}.
                Owned by {config.ownerName}.
              </p>
            </div>
            <div>
              <p className="yk-foot-label">Contact</p>
              <p><a href={TEL} onClick={() => trackEvent("call_click", { location: "footer" })}>{config.phoneDisplay}</a></p>
              <p>{config.hours.label}</p>
              <p><a href="#quote">Get a free quote</a></p>
            </div>
            <div>
              <p className="yk-foot-label">Towns</p>
              {TOWNS.map((town) => <p key={town}>{town}</p>)}
            </div>
          </div>
          <div className="yk-foot-bottom">
            <span>© {new Date().getFullYear()} {config.businessName} · {config.domain}</span>
            <span>{config.primaryCity}, {config.primaryState} · independent, locally run</span>
          </div>
        </div>
      </footer>

      <div className={`yk-sticky ${menuOpen ? "yk-hide" : ""}`}>
        <button className="yk-btn yk-btn-orange" type="button" onClick={() => go("quote")}>Get a free quote</button>
        <a className="yk-btn yk-btn-black yk-call" href={TEL} aria-label={`Call ${config.phoneDisplay}`} onClick={() => trackEvent("call_click", { location: "mobile" })}>
          <Phone size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

function PlanCard({ plan, popular, priceNote, onSelect, cta = "Get a free quote" }) {
  const amount = plan.prices ? plan.prices[1] : null;
  return (
    <article className={`yk-plan yk-fade ${popular ? "pop" : ""}`}>
      {plan.tag && <span className="yk-tag">{plan.tag}</span>}
      <div>
        <p className="yk-plan-name">{plan.name}</p>
        <div className="yk-price">
          {amount != null ? money(amount) : "Ask"}
          <small>{amount != null ? "per month" : "for a quote"}</small>
        </div>
        <p className="yk-subprice">{priceNote}</p>
      </div>
      <ul>
        {plan.includes.map((item) => (
          <li key={item}><Check size={16} aria-hidden="true" /> {item}</li>
        ))}
      </ul>
      <button className={`yk-btn ${popular ? "yk-btn-orange" : "yk-btn-black"}`} type="button" onClick={onSelect}>
        {cta}
      </button>
    </article>
  );
}

function Plus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
