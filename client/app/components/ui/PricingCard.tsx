import { Check } from "lucide-react";
import { Button } from "../ui/Button";

export const PricingCard = ({ plan, isYearly, onSelect }: any) => {
    const price = isYearly ? plan.yearly : plan.monthly;
    return (
        <div className={`relative bg-white rounded-2xl border p-7 flex flex-col ${plan.popular ? "border-orange-600 shadow-xl scale-[1.02]" : "border-zinc-200"}`}>
            {plan.popular && <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most popular</span>}
            <div className="mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${plan.popular ? "bg-orange-100 text-orange-600" : "bg-zinc-100 text-zinc-600"}`}><plan.icon size={18} /></div>
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
            </div>
            <div className="mb-6">
                <div className="flex items-end gap-1"><span className="text-4xl font-bold">${price}</span><span className="text-zinc-400 text-sm mb-1">/month</span></div>
                {isYearly && price > 0 && <p className="text-xs text-zinc-400 mt-1">Billed ${price * 12}/year</p>}
            </div>
            <Button variant={plan.popular ? "primary" : "outline"} fullWidth onClick={onSelect} className="mb-6">{plan.cta}</Button>
            <div className="flex flex-col gap-2.5">
                {plan.features.map((f: string) => (
                    <div key={f} className="flex items-start gap-2.5"><Check size={14} className="text-orange-600 mt-1 shrink-0" /><span className="text-sm text-zinc-600">{f}</span></div>
                ))}
                {plan.missing.map((f: string) => (
                    <div key={f} className="flex items-start gap-2.5 opacity-30"><Check size={14} className="text-zinc-400 mt-1 shrink-0" /><span className="text-sm text-zinc-400 line-through">{f}</span></div>
                ))}
            </div>
        </div>
    );
};