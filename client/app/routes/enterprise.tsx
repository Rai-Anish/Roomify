import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Accordion } from "../components/ui/Accordion";
import { ENTERPRISE_FEATURES, ENTERPRISE_FAQ, TESTIMONIALS } from "../lib/constants";

export async function loader() { return {}; }

export default function Enterprise() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-50 pt-24 pb-20 font-sans">
            <div className="max-w-6xl mx-auto px-4 mb-24">
                <div className="max-w-3xl">
                    <span className="inline-flex px-3 py-1 rounded-md bg-white border border-zinc-200 text-xs font-bold uppercase tracking-widest text-zinc-600 mb-6">Enterprise Solutions</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-zinc-900 leading-tight mb-6">Built for teams that move fast</h1>
                    <p className="text-zinc-500 text-lg max-w-xl mb-8">Dedicated infrastructure, custom contracts, and white-glove support for scale.</p>
                    <div className="flex gap-3">
                        <Button variant="primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Talk to sales</Button>
                    </div>
                </div>
            </div>

            <div className="bg-white border-y border-zinc-200 py-24 mb-24">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {ENTERPRISE_FEATURES.map((f, i) => (
                        <div key={i} className="p-8 rounded-2xl border border-zinc-100 bg-zinc-50">
                            <f.icon size={24} className="text-orange-600 mb-6" />
                            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 mb-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                {TESTIMONIALS.map((t, i) => (
                    <div key={i} className="bg-white p-8 rounded-2xl border border-zinc-200">
                        <p className="text-zinc-600 italic mb-8">"{t.quote}"</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs">{t.avatar}</div>
                            <div><h4 className="text-sm font-bold">{t.author}</h4><p className="text-xs text-zinc-400">{t.role} @ {t.company}</p></div>
                        </div>
                    </div>
                ))}
            </div>

            <div id="contact" className="max-w-6xl mx-auto px-4 scroll-mt-24">
                <div className="bg-zinc-900 rounded-[2.5rem] p-8 md:p-16 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-white">
                        <h2 className="text-5xl font-serif font-bold mb-6">Scale your vision.</h2>
                        <ul className="space-y-4">
                            {["Custom SLAs", "Bulk Credits", "API Support"].map(item => (
                                <li key={item} className="flex items-center gap-3"><CheckCircle2 size={20} className="text-orange-500" /> {item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white rounded-3xl p-8">
                        {submitted ? <div className="text-center py-12"><h3 className="text-2xl font-bold">Request Received</h3></div> : (
                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                                <input required placeholder="Full Name" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" />
                                <input required type="email" placeholder="Work Email" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl outline-none" />
                                <select className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl outline-none">
                                    <option>10-50 Employees</option><option>50-200 Employees</option><option>200+ Employees</option>
                                </select>
                                <textarea placeholder="How can we help?" rows={4} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl outline-none resize-none" />
                                <Button variant="primary" fullWidth type="submit">Submit Request</Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto mt-32 px-4">
                <h2 className="text-3xl font-serif font-bold text-center mb-12">Frequently Asked</h2>
                <Accordion items={ENTERPRISE_FAQ} />
            </div>
        </div>
    );
}