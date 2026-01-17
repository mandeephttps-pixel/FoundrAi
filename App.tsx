
import React, { useState, useEffect } from 'react';
import { 
  Rocket, Search, Settings2, Bookmark, RefreshCw, 
  Lightbulb, CheckCircle2, AlertCircle, Menu, X, 
  Sparkles, BrainCircuit, MessageCircle, Crown, ChevronRight, Lock, User,
  Mail, Calendar, LogOut, ChevronLeft, CreditCard,
  Brain, Cloud, Wallet, ShoppingBag, HeartPulse, GraduationCap, Leaf,
  Home, Utensils, Sprout, Truck, Gamepad2, Telescope, Globe, Cpu, Tag, Wrench, Dog,
  Laptop, Store, Briefcase, Factory, FileBadge, Ship, Zap, Smartphone, Layers, Settings, FileText, Video, Target,
  Coins, FastForward, Gem, Repeat, RefreshCcw, TrendingUp, Clock, BookOpen, UserPlus, Users, Heart, MapPin,
  Activity, Building, Plane, Sparkles as SparklesIcon, Sun, Eye, Bot, Landmark, UserCheck, Tv, Music, Clapperboard, Wind, Share2,
  Flag, Globe2, Languages, ArrowUpRight, Shuffle
} from 'lucide-react';
import { UserPreferences, BusinessIdea, UserStatus, User as UserType, CategoryItem, CategoryGroup } from './types';
import { 
  BUSINESS_CATEGORIES, BUDGET_OPTIONS, SKILL_OPTIONS, 
  TIME_OPTIONS 
} from './constants';
import { generateBusinessIdeas } from './services/geminiService';
import IdeaCard from './components/IdeaCard';

// Comprehensive Icon Mapping for all sectors
const IconMap: Record<string, any> = {
  Brain, Cloud, Wallet, ShoppingBag, HeartPulse, GraduationCap, Leaf,
  Home, Utensils, Sprout, Truck, Gamepad2, Telescope, Globe, Cpu, Tag, Wrench, Dog,
  Laptop, Store, Briefcase, Factory, FileBadge, Ship, Zap, Smartphone, Layers, Settings, FileText, Video, Target,
  Coins, FastForward, Gem, Repeat, RefreshCcw, TrendingUp, Clock, BookOpen, UserPlus, Users, Heart, MapPin,
  Activity, Building, Plane, Sparkles: SparklesIcon, Sun, Eye, Bot, Landmark, UserCheck, Tv, Music, Clapperboard, Wind, Share2,
  Flag, Globe2, Languages, ArrowUpRight, Shuffle, User
};

const App: React.FC = () => {
  const [prefs, setPrefs] = useState<UserPreferences>({
    budget: 'Medium',
    skillLevel: 'Beginner',
    timeAvailability: 'Full-Time',
    geography: 'India',
    preference: 'Hybrid',
    riskTolerance: 'Medium',
  });

  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  const [dailyGens, setDailyGens] = useState(0);
  const FREE_DAILY_LIMIT = 100; // Updated limit as requested

  const [selectedCats, setSelectedCats] = useState<string[]>(["AI & Machine Learning"]);
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<BusinessIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'generate' | 'results' | 'saved' | 'pricing' | 'mentor' | 'profile'>('generate');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('foundr_saved_ideas');
    if (saved) setSavedIdeas(JSON.parse(saved));
    const userJson = localStorage.getItem('foundr_user');
    if (userJson) setCurrentUser(JSON.parse(userJson));
    const gens = localStorage.getItem('foundr_daily_gens');
    const lastGenDate = localStorage.getItem('foundr_last_gen_date');
    const today = new Date().toDateString();
    if (lastGenDate !== today) {
      setDailyGens(0);
    } else if (gens) {
      setDailyGens(parseInt(gens));
    }
  }, []);

  const handleToggleCategory = (catName: string) => {
    setSelectedCats(prev => 
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  const getUserStatus = (): UserStatus => currentUser?.status || 'guest';

  const handleGenerate = async () => {
    const status = getUserStatus();
    if (status !== 'pro' && dailyGens >= FREE_DAILY_LIMIT) {
      setView('pricing');
      return;
    }
    if (selectedCats.length === 0) {
      setError("Pick at least one sector");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const result = await generateBusinessIdeas(prefs, selectedCats, status);
      setIdeas(result);
      const newDailyGens = dailyGens + 1;
      setDailyGens(newDailyGens);
      localStorage.setItem('foundr_daily_gens', newDailyGens.toString());
      localStorage.setItem('foundr_last_gen_date', new Date().toDateString());
      setView('results');
    } catch (err) {
      setError("AI engine busy. Retrying...");
      setTimeout(handleGenerate, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserType = {
      id: Math.random().toString(36).substr(2, 9),
      name: authForm.name || authForm.email.split('@')[0],
      email: authForm.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authForm.email}`,
      joinedDate: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      status: 'logged_in_free'
    };
    setCurrentUser(newUser);
    localStorage.setItem('foundr_user', JSON.stringify(newUser));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('foundr_user');
    setView('generate');
  };

  const handleUpgrade = () => {
    if (!currentUser) { setShowAuthModal(true); return; }
    const updated = { ...currentUser, status: 'pro' as UserStatus };
    setCurrentUser(updated);
    localStorage.setItem('foundr_user', JSON.stringify(updated));
    setView('generate');
  };

  const toggleSaveIdea = (idea: BusinessIdea) => {
    const status = getUserStatus();
    const isAlreadySaved = savedIdeas.find(i => i.id === idea.id);
    if (!isAlreadySaved && status === 'logged_in_free' && savedIdeas.length >= 100) {
      alert("You have reached your save limit. Upgrade for unlimited access!");
      setView('pricing');
      return;
    }
    if (!isAlreadySaved && status === 'guest') { setShowAuthModal(true); return; }
    let updated = isAlreadySaved ? savedIdeas.filter(i => i.id !== idea.id) : [...savedIdeas, idea];
    setSavedIdeas(updated);
    localStorage.setItem('foundr_saved_ideas', JSON.stringify(updated));
  };

  const NavItem = ({ id, label, icon: Icon, pro = false }: { id: any, label: string, icon: any, pro?: boolean }) => (
    <button 
      onClick={() => { setView(id); setSidebarOpen(false); }}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all ${
        view === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
      }`}
    >
      <Icon size={20} />
      {label}
      {pro && getUserStatus() !== 'pro' && <Lock size={12} className="ml-auto opacity-50" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans">
      {/* Mobile Top Header */}
      <header className="fixed top-0 inset-x-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-50 flex items-center justify-between px-6 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-sm"><Rocket size={18} /></div>
          <span className="font-black text-lg tracking-tight">FoundrAI</span>
        </div>
        <div className="flex items-center gap-3">
          {currentUser && (
            <button onClick={() => setView('profile')} className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-100">
              <img src={currentUser.avatar} alt="Profile" />
            </button>
          )}
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600"><Menu size={24} /></button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100"><Rocket size={24} /></div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">FoundrAI</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400"><X size={20} /></button>
          </div>

          <nav className="flex-1 space-y-1">
            <NavItem id="generate" label="Idea Engine" icon={Lightbulb} />
            <NavItem id="results" label="My Analysis" icon={Search} />
            <NavItem id="saved" label="Saved Plans" icon={Bookmark} />
            <NavItem id="mentor" label="AI Mentor" icon={MessageCircle} pro />
            <NavItem id="pricing" label="Upgrade Pro" icon={Crown} />
            <div className="pt-4 border-t border-slate-50 mt-4">
              <NavItem id="profile" label="My Account" icon={User} />
            </div>
          </nav>

          <div className="mt-auto">
            {!currentUser ? (
              <button onClick={() => setShowAuthModal(true)} className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs mb-4 active:scale-95 transition-all">
                <User size={16} /> Login / Sign Up
              </button>
            ) : getUserStatus() !== 'pro' ? (
              <div onClick={() => setView('pricing')} className="cursor-pointer bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-5 text-white shadow-xl shadow-indigo-100 group">
                <div className="flex items-center gap-2 mb-2">
                  <Crown size={16} className="text-yellow-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Upgrade to Pro</span>
                </div>
                <p className="text-[10px] font-medium opacity-80 leading-relaxed mb-4">Unlock 20 ideas & execution roadmaps.</p>
                <div className="w-full py-2 bg-white text-indigo-600 text-[10px] font-black rounded-xl text-center shadow-md group-active:scale-95 transition-all">₹199 / Month</div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5">
                <div className="flex items-center gap-2 text-emerald-700 mb-1">
                  <Crown size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Founder Pro</span>
                </div>
                <p className="text-[10px] font-bold text-emerald-600 opacity-80">Full ecosystem access.</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`lg:pl-72 pt-16 lg:pt-0 min-h-screen transition-all`}>
        <div className="max-w-2xl mx-auto px-6 py-10 lg:py-20">
          
          {view === 'generate' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">Startup <span className="text-indigo-600">Architect</span>.</h2>
                <p className="text-slate-500 font-medium text-lg">Generate your {getUserStatus() === 'pro' ? '20' : '10'} personalized business blueprints for 2025.</p>
              </div>

              <div className="space-y-10">
                <section className="bg-white p-6 lg:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                    <Settings2 size={18} className="text-indigo-600" /> Parameters
                  </h3>
                  
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Capital Available</label>
                      <div className="flex flex-wrap gap-2">
                        {BUDGET_OPTIONS.map(opt => (
                          <button
                            key={opt}
                            onClick={() => setPrefs({...prefs, budget: opt})}
                            className={`px-5 py-2.5 text-xs font-black rounded-2xl border transition-all ${prefs.budget === opt ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Skill Level</label>
                        <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                          value={prefs.skillLevel} onChange={(e) => setPrefs({...prefs, skillLevel: e.target.value})}>
                          {SKILL_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time availability</label>
                        <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                          value={prefs.timeAvailability} onChange={(e) => setPrefs({...prefs, timeAvailability: e.target.value})}>
                          {TIME_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="space-y-12">
                  {BUSINESS_CATEGORIES.map((group: CategoryGroup) => (
                    <section key={group.label}>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                        {group.label}
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {group.categories.map((cat: CategoryItem) => {
                          const IconComp = IconMap[cat.iconName] || Globe;
                          const isSelected = selectedCats.includes(cat.name);
                          return (
                            <button
                              key={cat.name}
                              onClick={() => handleToggleCategory(cat.name)}
                              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all aspect-square text-center ${
                                isSelected 
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105 z-10' 
                                  : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'
                              }`}
                            >
                              <IconComp size={20} strokeWidth={isSelected ? 2.5 : 2} className="mb-2" />
                              <span className={`text-[8px] font-black uppercase leading-tight ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                                {cat.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>

                <div className="pt-10 sticky bottom-4 z-20">
                  <button 
                    disabled={isLoading || selectedCats.length === 0}
                    onClick={handleGenerate}
                    className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-[2rem] font-black text-lg shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] border-4 border-white"
                  >
                    {isLoading ? <RefreshCw className="animate-spin" size={24} /> : <Sparkles size={24} />}
                    {isLoading ? "Analyzing Gaps..." : `Engineer ${getUserStatus() === 'pro' ? '20' : '10'} Ideas`}
                  </button>
                  {error && <p className="text-center text-rose-500 font-bold text-sm mt-4 bg-rose-50 p-2 rounded-xl">{error}</p>}
                </div>
              </div>
            </div>
          )}

          {view === 'results' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <header className="flex items-center justify-between mb-10">
                <button onClick={() => setView('generate')} className="p-2 text-slate-400 hover:text-indigo-600"><ChevronLeft size={24}/></button>
                <div className="text-center">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Market Analysis.</h2>
                  <p className="text-xs text-slate-500 font-medium">Found {ideas.length} opportunities</p>
                </div>
                <div className="w-10"></div>
              </header>

              <div className="space-y-4">
                {ideas.map((idea, idx) => (
                  <React.Fragment key={idea.id}>
                    <IdeaCard 
                      idea={idea} 
                      userPlan={getUserStatus() === 'pro' ? 'Pro' : 'Free'}
                      onUpgrade={() => setView('pricing')} 
                      onSave={toggleSaveIdea} 
                      isSaved={!!savedIdeas.find(i => i.id === idea.id)} 
                      index={idx + 1}
                      total={getUserStatus() === 'pro' ? 20 : 10}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {view === 'profile' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <header className="text-center mb-12">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl mx-auto">
                    <img src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'} alt="User" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-2xl shadow-lg border-4 border-[#FDFDFF]">
                    <Settings2 size={16} />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-slate-900">{currentUser?.name || 'Guest Explorer'}</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Joined {currentUser?.joinedDate || 'Today'}</p>
              </header>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Mail size={20}/></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                      <p className="text-sm font-bold text-slate-700">{currentUser?.email || 'Not logged in'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><CreditCard size={20}/></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Plan</p>
                      <p className="text-sm font-black text-indigo-600 uppercase">{getUserStatus()}</p>
                    </div>
                  </div>
                  {getUserStatus() !== 'pro' && (
                    <button onClick={() => setView('pricing')} className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest active:scale-95 transition-all">Upgrade</button>
                  )}
                </div>

                {currentUser && (
                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-6 text-rose-500 font-black text-sm uppercase tracking-widest border-2 border-dashed border-rose-100 rounded-[2rem] mt-4 hover:bg-rose-50 transition-all">
                    <LogOut size={18}/> Sign Out
                  </button>
                )}
              </div>
            </div>
          )}

          {view === 'pricing' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="text-center">
                <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Idea → <span className="text-indigo-600 underline">Execution</span>.</h2>
                <p className="text-slate-500 font-medium text-lg">Join 5,000+ founders using AI execution roadmaps.</p>
              </div>

              <div className="bg-white rounded-[3rem] p-10 border-2 border-slate-100 text-center relative overflow-hidden group shadow-2xl">
                <div className="absolute top-10 right-10 bg-indigo-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Founder Pack</div>
                <h3 className="text-3xl font-black text-slate-900 mb-6">Launch Pro</h3>
                <div className="flex items-baseline justify-center gap-1 mb-10">
                  <span className="text-6xl font-black text-indigo-600">₹199</span>
                  <span className="text-slate-400 font-black text-lg">/ mo</span>
                </div>
                <ul className="space-y-4 mb-12 text-left max-w-xs mx-auto">
                  {["20 ideas per generation", "30-60-90 Day Roadmaps", "Full Business Model Canvas", "Local Pricing Strategies", "AI Mentor Support"].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={handleUpgrade}
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  Start Execution Now
                </button>
              </div>
            </div>
          )}

          {view === 'saved' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <header className="text-center mb-10">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Saved <span className="text-indigo-600">Vault</span>.</h2>
                <p className="text-slate-500 font-medium mt-2">
                  {savedIdeas.length} plans secured.
                </p>
              </header>
              {savedIdeas.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                  <Bookmark className="text-slate-100 mx-auto mb-6" size={80} />
                  <h3 className="text-xl font-black text-slate-900 mb-2">Vault is Empty</h3>
                  <p className="text-slate-400 text-sm px-10">Save high-potential ideas to track your future empire.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedIdeas.map((idea, idx) => (
                    <IdeaCard 
                      key={idea.id} idea={idea} 
                      userPlan={getUserStatus() === 'pro' ? 'Pro' : 'Free'} 
                      onUpgrade={() => setView('pricing')} 
                      onSave={toggleSaveIdea} isSaved={true} 
                      index={idx+1} total={savedIdeas.length}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 lg:p-10 relative shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={20}/></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 mx-auto mb-6">
                <Rocket size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">{authMode === 'signup' ? 'Create Account' : 'Welcome Back'}</h3>
              <p className="text-xs text-slate-400 font-medium mt-2">Access your saved blueprints from any device.</p>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})}/>
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input required type="email" placeholder="john@example.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})}/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <input required type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})}/>
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-xl hover:bg-indigo-700 active:scale-95 transition-all mt-4">
                {authMode === 'signup' ? 'Create Foundation' : 'Access Vault'}
              </button>
            </form>
            <div className="mt-8 text-center">
              <button onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')} className="text-[10px] font-black text-indigo-500 uppercase tracking-widest border-b-2 border-indigo-50 pb-1">
                {authMode === 'signup' ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL LOADING OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-8">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl flex flex-col items-center max-w-sm w-full animate-in zoom-in-95">
            <div className="w-24 h-24 border-[6px] border-indigo-50 rounded-full relative mb-12">
              <div className="w-full h-full border-[6px] border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-[-6px] left-[-6px]"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-600"><BrainCircuit size={40} /></div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3 text-center leading-tight">Engineering Blueprints</h2>
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mt-6">Scanning market gaps for 2025...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
