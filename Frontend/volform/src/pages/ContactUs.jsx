import { useState } from "react";

const services = [
  "Steam Generation",
  "Boiler House Accessories",
  "Steam Distribution",
  "Customized Package Solutions",
  "Condensate Recovery",
  "Smart Boiler Controller",
  "Maintenance & Support",
  "Other",
];


export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    service: "",
  });
    const  [loading,setloading] = useState(false);
  const [status, setStatus] = useState("");



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submit clicked");
  setloading(true);
  setStatus("");

  try {
    const response = await fetch("http://localhost:7000/api/enquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname: formData.name,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.company,
        serviceOfInterest: formData.service,
        subject: formData.subject,
        message: formData.message,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit form");
    }
    setStatus("success");

    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
      service: "",
    });

  } catch (error) {
    console.error("Form submission error:", error);
    alert("Error submitting form");
    setStatus("error");
  }
  finally{
    setloading(false);
  }
};

  return (
    <div className="page-shell">
      <section className="hero-section py-18 md:py-22">
        <div className="container-custom relative z-10">
          <span className="badge-industrial mb-4">Let's Connect</span>
          <h1 className="max-w-3xl text-4xl leading-tight text-white md:text-6xl md:leading-tight">Contact Volfram Systems</h1>
          <p className="mt-5 max-w-3xl text-lg text-slate-100">
            Share your requirement and our engineering team will respond with practical, industry-ready guidance.
          </p>
        </div>
      </section>

      <section className="section-white">
        <div className="container-custom grid grid-cols-1 gap-8 lg:grid-cols-3">
          <article className="card lg:col-span-2">
            <h2 className="text-3xl">Send Us Your Requirement</h2>
            <p className="mt-2">We usually respond within one business day for all technical and commercial inquiries.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-text-secondary">Full Name *</label>
                  <input id="name" name="name" value={formData.name} onChange={handleInputChange} className="form-input" placeholder="Your full name" required />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-secondary">Email Address *</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="form-input" placeholder="you@company.com" required />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-text-secondary">Phone Number</label>
                  <input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <label htmlFor="company" className="mb-2 block text-sm font-medium text-text-secondary">Company Name</label>
                  <input id="company" name="company" value={formData.company} onChange={handleInputChange} className="form-input" placeholder="Company name" />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="mb-2 block text-sm font-medium text-text-secondary">Service Of Interest</label>
                <select id="service" name="service" value={formData.service} onChange={handleInputChange} className="form-input">
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-text-secondary">Subject *</label>
                <input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className="form-input" placeholder="Inquiry subject" required />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-text-secondary">Message *</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} className="form-input min-h-36 resize-y" placeholder="Share your process requirement, capacity and challenge..." required />
              </div>

              <button type="submit" className="btn-cta w-full" disabled={loading}>
  {loading ? "Submitting..." : "Submit Enquiry"}
</button>
            </form>
          </article>

          <div className="space-y-5">
            <article className="card">
              <h3 className="text-xl text-primary">Direct Contacts</h3>
              <div className="mt-4 space-y-3 text-sm text-text-secondary">
                <p><span className="font-semibold text-text-primary">General Enquiry:</span> +91 9309534688</p>
                <p><span className="font-semibold text-text-primary">Sales Dept:</span> +91 7798156167</p>
                <p><span className="font-semibold text-text-primary">Purchase Dept:</span> +91 9172033598</p>
                <p><span className="font-semibold text-text-primary">Email:</span> steam@volfram.in</p>
              </div>
            </article>

            <article className="card">
              <h3 className="text-xl text-primary">Office Locations</h3>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-text-primary">Corporate / Admin Office</p>
                  <p className="mt-1">402, Rutuvihar, Waranasi Society, Warje, Pune - 411058</p>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Manufacturing Unit</p>
                  <p className="mt-1">Akurdi Industrial Estate, D-1 Block, MIDC, Chinchwad, Pune - 411019</p>
                </div>
              </div>
            </article>

            <article className="section-dark rounded-xl px-6 py-6">
              <h3 className="text-xl text-white">Why Teams Trust Us</h3>
              <p className="subtext mt-2">600+ customers, 422+ installations and 12+ years of proven support across industries.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
