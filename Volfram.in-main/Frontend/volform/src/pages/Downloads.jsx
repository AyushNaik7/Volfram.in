import { useState } from "react";

const downloads = [
  { title: "Volfram Products", url: "https://drive.google.com/file/d/1UjsZr32FG9rkn0lI4elbboEGSrCJ7ZSs/view?usp=drive_link" },
  { title: "Volfram Products", url: "https://drive.google.com/file/d/1-2NJu7lHr4rHOGYcZGo752tg9WS_G694/view?usp=drive_link" },
  { title: "Volfram Condensate Recovery System", url: "https://drive.google.com/file/d/1h799FBdtJEx9LowwfnrEjk0GNKW3W3n3/view?usp=drive_link" },
  { title: "Volfram Condensate Recovery System", url: "https://drive.google.com/file/d/1Ed29gbNX1SJdNTUaoi0-fc7t1zyiHAbt/view?usp=drive_link" },
  { title: "Volfram Pressure Reducing Station", url: "https://drive.google.com/file/d/1BcgXsXY_sTvydiIPDFwgEjVAcDYPEWtk/view?usp=drive_link" },
  { title: "Condensate Contamination Monitoring and Control System", url: "https://drive.google.com/file/d/1BUtxRGtRsgVCfr-yzBjohWYpWlB8hI_M/view?usp=drive_link" },
  { title: "Volfram Vapour Pump", url: "https://drive.google.com/file/d/1wMzwKnvmpAZ6qEBhnzW1bfgdLhShJQ6P/view?usp=drive_link" },
  { title: "Variable Orifice Float Trap", url: "https://drive.google.com/file/d/17vpMwpWTSsAvLDRYMuyttpYRpTZPX82C/view?usp=drive_link" },
  { title: "Moisture Separator", url: "https://drive.google.com/file/d/1KRk9jSzG3_YbN63UfrSVJJTTHSU-aiZS/view?usp=drive_link" },
  { title: "Fixed Orifice Ball Float Trap", url: "https://drive.google.com/file/d/1tyMI1mlkDTUDlckGiv0sMdANU7nbPvY4/view?usp=drive_link" },
  { title: "Thermal De-aerator Head", url: "https://drive.google.com/file/d/1Rv52DhlNDktyjjD8Q3p12Wp3gwmQgJL3/view?usp=drive_link" },
  { title: "Steam Injector (STI30)", url: "https://drive.google.com/file/d/1PCTLKIqO6OzsFT8tMBatRh1FQMymtKoU/view?usp=drive_link" },
  { title: "Vacuum Breaker", url: "https://drive.google.com/file/d/1Xwae8qSj0Fa8U3nP31PgHuaty4x2Zv1H/view?usp=drive_link" },
  { title: "Disc Check Valve (DCV 30)", url: "https://drive.google.com/file/d/1cOp03ljDTVzDrf_ArlOd_WLaTNq4PEV7/view?usp=drive_link" },
  { title: "Stainless Steel Safety Valve", url: "https://drive.google.com/file/d/1t9R2IiJ5JzAiAnXFCf4eXdR-hnaRd0Ca/view?usp=drive_link" },
  { title: "Compact Thermodynamic Steam Trap", url: "https://drive.google.com/file/d/1GpaWV8eHb3YyYkOXiLhktZhdRbvFi6Jb/view?usp=sharing" },
  { title: "Thermostatic Steam Trap", url: "https://drive.google.com/file/d/1eF5Zgh2FWwka1Ov7TtYsVmF4pnAaQArd/view?usp=drive_link" },
  { title: "Vent Head", url: "https://drive.google.com/file/d/1wEzMINWPQTm0Z4_HgfsfsiV998YhrXGE/view?usp=drive_link" },
  { title: "Air Vent (VV 30)", url: "https://drive.google.com/file/d/1xESQKg7xxK2dQ6y1461OIpr8Drcv4LIZ/view?usp=drive_link" },
  { title: "Air Vent (VAV 10)", url: "https://drive.google.com/file/d/1CO5FVTjP_maNkVBkyAA297uY5AoN6NxB/view?usp=drive_link" },
  { title: "Piston Actuated Valve", url: "https://drive.google.com/file/d/1wuYIpG4coHWuEUvDPXMr7QifE8C5s0mu/view?usp=drive_link" },
  { title: "Steam and Water Mixing Battery with Hose Station", url: "https://drive.google.com/file/d/1UEAcPsU_ayMkSNu6F_p3aFoNYVeX-pFc/view?usp=drive_link" },
  { title: "Thermostatic Clean Steam Trap", url: "https://drive.google.com/file/d/1CTYLkjoWZdgtXUdeIb4j328pQLzAW9b8/view?usp=drive_link" },
  { title: "Y-Type Strainer (STR-10)", url: "https://drive.google.com/file/d/1TgdT6WA4_LaNlmU2Qpn8o1VngmYttUa0/view?usp=drive_link" },
  { title: "Y-Type Strainer (STR-11)", url: "https://drive.google.com/file/d/1LS7Ilia-VWemDzUsyzrElG3LDPd6iT3B/view?usp=drive_link" },
  { title: "Y-Type Strainer (STR-10)", url: "https://drive.google.com/file/d/1fyWRf2ars-_jxSDwU1lSXZJjuR04Xhlm/view?usp=drive_link" },
  { title: "Thermodynamic Steam Trap", url: "https://drive.google.com/file/d/1CWpMeJXu4I3v0fqQzf_7EyAXibdSUePm/view?usp=drive_link" },
  { title: "Fabricated Moisture Separator", url: "https://drive.google.com/file/d/1z6e21nCs2qY23Li1jyWotZTuxslA78KA/view?usp=drive_link" },
  { title: "Fabricated Moisture Separator 150", url: "https://drive.google.com/file/d/1Ys0cVkKdV_kCXOtncnCYLmv1x6kddE4R/view?usp=drive_link" },
  { title: "Boiler Controller V-Wise", url: "https://drive.google.com/file/d/178rXPMRPXdY8w7hNvsLMtMHr_fhWmH49/view?usp=drive_link" },
  { title: "V-Wise", url: "https://drive.google.com/file/d/1dWNLh--8PYrEgCa4XXyO1exEjETym0io/view?usp=drive_link" },
  { title: "Volfram ABDS - Intermittent", url: "https://drive.google.com/file/d/1W27r8BnJahR5sMuuc-P-rEsE6dLqhjem/view?usp=sharing" },
  { title: "Conductivity Sensor", url: "https://drive.google.com/file/d/1-76_jtWsCmLsDGNVtyLk2neHR_YBYUGG/view?usp=drive_link" },
  { title: "Fixed Orifice Ball Float Steam Trap (FOFT-20H)", url: "https://drive.google.com/file/d/1sdxX8ohv39XypnCGwARvV9pa4o0cIAce/view?usp=drive_link" },
  { title: "Air Eliminator (FOFT-20B)", url: "https://drive.google.com/file/d/1h0ox8r6h8Y5ztIUBggC30emZL_RKgIC5/view?usp=drive_link" },
  { title: "Orifice Flow Meter", url: "https://drive.google.com/file/d/1JXMzE7bowVqcOZJFrHDjLD4Yfjs8OMs7/view?usp=drive_link" },
  { title: "Mechanical Pressure Controller (MPC-50)", url: "https://drive.google.com/file/d/1Kw8TF5BABA1st0_V1fpb48qt2r2qz4b_/view?usp=drive_link" },
  { title: "Forged Gate Valve", url: "https://drive.google.com/file/d/1Na79-XNdnmi4mGgNcm_vMxhLlyhWxKdr/view?usp=drive_link" },
  { title: "Globe Valve", url: "https://drive.google.com/file/d/1yDfVrgbk9mR-b0gJLSkWTWE43N711_w5/view?usp=drive_link" },
  { title: "Gate Valve", url: "https://drive.google.com/file/d/1C8jbStDLAFBnu51EdcNOHxEOlFFNYg2x/view?usp=drive_link" },
  { title: "Automatic Pumping Trap", url: "https://drive.google.com/file/d/1Bd-IHUdLa1aob25-fxN2VSxx53BDHUbX/view?usp=drive_link" },
  { title: "Pressure Gauge", url: "https://drive.google.com/file/d/1r9LMKQ6FtW8P82xiOmfF3wvAeIx4LP3E/view?usp=drive_link" },
  { title: "Venturi Trap", url: "https://drive.google.com/file/d/1OLjzhMFp4gkHCUWbEklEW54M4j7jtXjv/view?usp=drive_link" },
  { title: "Globe Valve (GLV 11)", url: "https://drive.google.com/file/d/1E-xUz3lNSIeVBzKE3YK2weu1JHsmR3fh/view?usp=drive_link" },
  { title: "Sight Glass", url: "https://drive.google.com/file/d/1wfHkOGfNSaWZkAxB-04MQ3HPThr8Z4WP/view?usp=drive_link" },
  { title: "Compact Thermodynamic Steam Trap", url: "https://drive.google.com/file/d/1GpaWV8eHb3YyYkOXiLhktZhdRbvFi6Jb/view?usp=drive_link" },
  { title: "Duplex Condensate Recovery System", url: "https://drive.google.com/file/d/1SX4JoGXAzS3uFN5eTKzzQxbeIfDTs7cz/view?usp=drive_link" },
  { title: "Y-Type Strainer (STR 30)", url: "https://drive.google.com/file/d/1Za7EydLdXm3L3omSKubuwk2jj-cWaBLD/view?usp=drive_link" },
  { title: "Control Valve", url: "https://drive.google.com/file/d/14ooNYdZzKskwdnFNazmMRILKaQLb7h26/view?usp=drive_link" },
  { title: "Compressed Air Liquid Drain Trap (FOFT-20A)", url: "https://drive.google.com/file/d/1M-xfu9BCEI1RQoklL2XGCdq_jdAYX13B/view?usp=drive_link" },
  { title: "Globe Valve (GLV 11)", url: "https://drive.google.com/file/d/14lE5zN_E6TsgBgh4MdUY5t0ikgsyLLzE/view?usp=drive_link" },
  { title: "Piston Valve (PTV 10)", url: "https://drive.google.com/file/d/1Ttg1V1Mq9fJ2h7NXTPGDkVnAmomzsDhL/view?usp=drive_link" },
  { title: "Piston Valve (PTV 10)", url: "https://drive.google.com/file/d/1xcKzsKw3D156NnzBU2YNu8iw5JyZ_QU9/view?usp=drive_link" },
  { title: "Pressure Sensors", url: "https://drive.google.com/file/d/1YyiOAcucM8Do-J44fIdTpTs-ya_uRF-U/view?usp=drive_link" },
  { title: "Ball Valve (BLV)", url: "https://drive.google.com/file/d/1ZNo-6rT8CgUtflqqN31dYPWTo8YNQ-AH/view?usp=drive_link" },
  { title: "Sample Cooler", url: "https://drive.google.com/file/d/1Sx7fb87ks7DnbFFqAzWmSn0oqlI3C9BY/view?usp=drive_link" },
  { title: "Digitally Operated System", url: "https://drive.google.com/file/d/1NKtT2GnR8OEKl8r2lwboGlpnE5gmnyTk/view?usp=sharing" },
  { title: "Fixed Orifice Ball Float Steam Trap (FOFT-10)", url: "https://drive.google.com/file/d/1TLNHW_lUOI5yMALlgiYoYUFq2VEauodM/view?usp=drive_link" },
];

function DownloadPreview({ fileId, title }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-white text-slate-500" aria-hidden="true">
        <svg viewBox="0 0 72 88" className="h-24 w-20" fill="none">
          <path d="M14 3h29l17 17v62a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="3" />
          <path d="M43 4v17h17" stroke="currentColor" strokeWidth="3" />
          <path d="M20 37h32M20 48h32" stroke="currentColor" strokeWidth="3" />
          <rect x="4" y="57" width="42" height="20" rx="4" fill="#d93025" />
          <text x="25" y="72" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">PDF</text>
        </svg>
        <span className="text-xs">Preview unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={`/downloads/previews/${fileId}.png`}
      alt={`${title} preview`}
      loading="lazy"
      className="h-full w-full bg-white object-contain"
      onError={() => setFailed(true)}
    />
  );
}

export default function Downloads() {
  return (
    <div className="page-shell">
      <section className="hero-section py-20 md:py-24">
        <div className="container-custom relative z-10">
          <span className="badge-industrial mb-4">Downloads</span>
          <h1 className="max-w-4xl text-4xl leading-tight text-white md:text-6xl md:leading-tight">Product Downloads</h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-100">
            Browse Volfram product documents and open a file in Google Drive.
          </p>
        </div>
      </section>

      <section className="section-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {downloads.map((item, index) => (
              <a
                key={`${item.url}-${index}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block min-w-0 text-primary"
                aria-label={`Open ${item.title} in Google Drive`}
              >
                <div className="aspect-[1/1.08] overflow-hidden border border-slate-300 bg-white transition group-hover:border-secondary group-hover:shadow-md">
                  <DownloadPreview fileId={item.url.match(/\/d\/([^/]+)/)?.[1]} title={item.title} />
                </div>
                <h2 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug group-hover:text-secondary">
                  {item.title}
                </h2>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
