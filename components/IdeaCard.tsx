
import React, { useState } from 'react';
import { BusinessIdea, UserPlan } from '../types';
import { 
  Star, ShieldCheck, Clock, 
  Lock, Layout, Rocket, Wrench, Info, AlertTriangle, 
  CheckCircle2, Zap, ArrowRight, Eye
} from 'lucide-react';

interface IdeaCardProps {
  idea: BusinessIdea;
  onSave: (idea: BusinessIdea) => void;
  isSaved: boolean;
  userPlan: UserPlan;
  onUpgrade: () => void;
  index: number;
  total: number;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onSave, isSaved, userPlan, onUpgrade, index, total }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPro = userPlan === 'Pro';

  const CardSection = ({ title, icon: Icon, children, isLocked = false }: { title: string, icon: any, children?: React.ReactNode, isLocked?: boolean }) => (
    <div className="relative mb-4">
      <div className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all ${isLocked ? 'blur-[4px] select-none opacity-40' : ''}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Icon size={16} />
          </div>
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{title}</h4>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto mb-6 animate-in fade-in slide-in-from-bottom-4">
      {/* 1. OVERVIEW CARD - ALWAYS VISIBLE */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/40 border border-slate-100 mb-3">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-black text-white bg-indigo-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                Idea {index} of {total}
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                {idea.category}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 leading-tight">{idea.businessName}</h3>
          </div>
          <button 
            onClick={() => onSave(idea)}
            className={`p-3 rounded-2xl transition-all ${isSaved ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-300'}`}
          >
            <Star size={20} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-rose-50 text-rose-500 rounded-xl shrink-0"><AlertTriangle size={18} /></div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium pt-1">{idea.problemStatement}</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl shrink-0"><ShieldCheck size={18} /></div>
            <p className="text-sm text-slate-800 leading-relaxed font-bold pt-1">{idea.uniqueValueProposition}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Cap. Required</p>
            <p className="text-sm font-black text-slate-800">{idea.estimatedStartupCost}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Scale Potential</p>
            <p className="text-sm font-black text-slate-800">{idea.scalabilityLevel}</p>
          </div>
        </div>

        {!isExpanded && (
          <button 
            onClick={() => setIsExpanded(true)}
            className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            {isPro ? 'View Execution Engine' : 'Unlock Execution Plan'} <ArrowRight size={18} />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-3 pb-8 relative animate-in fade-in slide-in-from-top-4">
          
          {!isPro && (
            <div className="bg-white rounded-[2rem] p-8 text-center border-2 border-dashed border-indigo-200 my-4 shadow-xl shadow-indigo-50/50">
              <Lock size={32} className="mx-auto mb-4 text-indigo-600" />
              <h4 className="text-lg font-black text-slate-900 mb-4">🔒 Premium Execution Plan Locked</h4>
              <ul className="text-xs text-slate-500 space-y-2 mb-8 font-medium">
                <li>• Business model canvas</li>
                <li>• Go-to-market strategy</li>
                <li>• Pricing & roadmap</li>
                <li>• Tool stack & validation</li>
              </ul>
              <button 
                onClick={onUpgrade}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg active:scale-95"
              >
                💎 Upgrade to Pro — ₹199
              </button>
            </div>
          )}

          {isPro && (
            <>
              <CardSection title="Market Validation" icon={Zap}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase">Demand: {idea.marketDemandScore}/10</div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(idea.marketDemandScore || 0) * 10}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase block">Competition</span>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{idea.competitionLevel}</span>
                  </div>
                </div>
              </CardSection>

              <CardSection title="Business Canvas" icon={Layout}>
                <div className="grid grid-cols-2 gap-2">
                  {idea.businessModelCanvas && Object.entries(idea.businessModelCanvas).slice(0, 4).map(([key, value]) => (
                    <div key={key} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-[10px] font-bold text-slate-700 leading-tight">{value || 'Generating...'}</p>
                    </div>
                  ))}
                </div>
              </CardSection>

              <CardSection title="GTM & Roadmap" icon={Rocket}>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2 size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 font-medium">{idea.gtmStrategy}</p>
                  </div>
                  <div className="pt-2 space-y-3">
                    {idea.roadmap && [
                      { day: '30', text: idea.roadmap.day30 },
                      { day: '90', text: idea.roadmap.day90 }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[9px] font-black shrink-0">{i+1}</div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{step.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardSection>

              <CardSection title="Tool Stack" icon={Wrench}>
                <div className="flex flex-wrap gap-1.5">
                  {(idea.toolStack?.[0]?.tools || ['Tooling Info Incoming']).map((t, i) => (
                    <span key={i} className="text-[9px] font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">{t}</span>
                  ))}
                </div>
              </CardSection>

              <CardSection title="AI Mentor Tip" icon={Info}>
                <div className="bg-indigo-600 rounded-2xl p-4 text-white">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">Growth Shortcut</p>
                  <p className="text-xs font-bold leading-relaxed mb-3">{idea.mentorInsight?.growthLever || 'Focus on hyper-local execution first.'}</p>
                  <div className="pt-3 border-t border-white/20">
                    <p className="text-[9px] font-black uppercase tracking-widest text-rose-300 mb-1">Mistake to avoid</p>
                    <p className="text-xs font-medium italic">"{idea.mentorInsight?.mistakeToAvoid || 'Scaling too early without product-market fit.'}"</p>
                  </div>
                </div>
              </CardSection>
            </>
          )}

          <button 
            onClick={() => setIsExpanded(false)}
            className="w-full py-4 text-slate-400 font-black text-xs flex items-center justify-center gap-2"
          >
            Collapse View <Eye size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default IdeaCard;
