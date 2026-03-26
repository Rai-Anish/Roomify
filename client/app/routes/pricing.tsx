import { useState } from "react";
import { useNavigate } from "react-router";
import { PricingCard } from "~/components/ui/PricingCard";
import { Accordion } from "../components/ui/Accordion";
import { PRICING_PLANS, PRICING_FAQ } from "../lib/constants";
import { motion } from "framer-motion";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-serif font-bold text-zinc-900 mb-4">Simple, honest pricing</h1>
        <p className="text-xl text-zinc-600">Transform your blueprints into reality, at any scale.</p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={!isYearly ? "text-zinc-900 font-bold" : "text-zinc-400"}>Monthly</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-12 h-6 bg-zinc-200 rounded-full relative transition-colors"
          >
            <motion.div 
              animate={{ x: isYearly ? 24 : 4 }}
              className="absolute top-1 w-4 h-4 bg-orange-600 rounded-full" 
            />
          </button>
          <span className={isYearly ? "text-zinc-900 font-bold" : "text-zinc-400"}>Yearly</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {PRICING_PLANS.map(plan => (
          <PricingCard 
            key={plan.name} 
            plan={plan} 
            isYearly={isYearly} 
            onSelect={() => navigate("/signup")} 
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">Frequently Asked</h2>
        <Accordion items={PRICING_FAQ} />
      </div>
    </div>
  );
}