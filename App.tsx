
import React, { useState, useEffect } from 'react';
import { 
  Rocket, Search, Settings2, Bookmark, RefreshCw, 
  Lightbulb, CheckCircle2, AlertCircle, Menu, X, 
  Sparkles, BrainCircuit, MessageCircle, Crown, ChevronRight, Lock, User,
  Mail, Calendar, LogOut, ChevronLeft, CreditCard, ExternalLink,
  Brain, Cloud, Wallet, ShoppingBag, HeartPulse, GraduationCap, Leaf,
  Home, Utensils, Sprout, Truck, Gamepad2, Telescope, Globe, Cpu, Tag, Wrench, Dog,
  Laptop, Store, Briefcase, Factory, FileBadge, Ship, Zap, Smartphone, Layers, Settings, FileText, Video, Target,
  Coins, FastForward, Gem, Repeat, RefreshCcw, TrendingUp, Clock, BookOpen, UserPlus, Users, Heart, MapPin,
  Activity, Building, Plane, Sparkles as SparklesIcon, Sun, Eye, Bot, Landmark, UserCheck, Tv, Music, Clapperboard, Wind, Share2,
  Flag, Globe2, Languages, ArrowUpRight, Shuffle
} from 'lucide-react';
import { UserPreferences, BusinessIdea, UserStatus, User as UserType } from './types';
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
  const FREE_DAILY_LIMIT = 100;

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
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400"><X size={20} /></button>
          </div>

          <div className="flex-1 space-y-1">
            <NavItem id="generate" label="Idea Generator" icon={Sparkles} />
            <NavItem id="results" label="Market Feed" icon={Search} />
            <NavItem id="saved" label="Saved Lab" icon={Bookmark} />
            <NavItem id="mentor" label="AI Advisor" icon={BrainCircuit} pro />
            <NavItem id="pricing" label="Foundr Pro" icon={Crown} />
          </div>

          <div className="mt-auto pt-6 border-t border-slate-50">
            {currentUser ? (
              <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-rose-500 transition-colors text-sm font-black">
                <LogOut size={20} />
                Sign Out
              </button>
            ) : (
              <button onClick={() => { setShowAuthModal(true); setSidebarOpen(false); }} className="w-full flex items-center gap-4 px-5 py-4 text-indigo-600 bg-indigo-50 rounded-2xl text-sm font-black">
                <User size={20} />
                Join Foundr
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 pt-16 lg:pt-0 min-h-screen">
        <div className="max-w-4xl mx-auto p-6 lg:p-12">
          {view === 'generate' && (
            <div className="animate-in fade-in slide-in-from-bottom-8">
              <div className="mb-10">
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">What are we building?</h2>
                <p className="text-lg text-slate-500 font-medium">Pick your sectors. Our AI finds the gaps.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-pulse">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-3 block tracking-wider">Capital Budget</label>
                      <div className="flex flex-wrap gap-2">
                        {BUDGET_OPTIONS.map(opt => (
                          <button key={opt} onClick={() => setPrefs({...prefs, budget: opt})} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${prefs.budget === opt ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-3 block tracking-wider">Skill Level</label>
                      <div className="flex flex-wrap gap-2">
                        {SKILL_OPTIONS.map(opt => (
                          <button key={opt} onClick={() => setPrefs({...prefs, skillLevel: opt})} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${prefs.skillLevel === opt ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-3 block tracking-wider">Time Availability</label>
                      <div className="flex flex-wrap gap-2">
                        {TIME_OPTIONS.map(opt => (
                          <button key={opt} onClick={() => setPrefs({...prefs, timeAvailability: opt})} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${prefs.timeAvailability === opt ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Sectors</h3>
                  <div className="h-[400px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                    {BUSINESS_CATEGORIES.map(group => (
                      <div key={group.label}>
                        <h4 className="text-[10px] font-black text-slate-300 uppercase mb-3 tracking-widest">{group.label}</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {group.categories.map(cat => {
                            const Icon = IconMap[cat.iconName] || Tag;
                            const isSelected = selectedCats.includes(cat.name);
                            return (
                              <button key={cat.name} onClick={() => handleToggleCategory(cat.name)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                                <Icon size={16} className={isSelected ? 'text-indigo-600' : 'text-slate-400'} />
                                <span className="text-xs font-bold">{cat.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-indigo-600 transition-all disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                {isLoading ? 'Scanning Market Gaps...' : 'Generate 2025 Blueprint'}
              </button>
            </div>
          )}

          {view === 'results' && (
            <div className="animate-in fade-in slide-in-from-right-8">
              <div className="flex items-center justify-between mb-8">
                <button onClick={() => setView('generate')} className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-indigo-600">
                  <ChevronLeft size={16} /> New Search
                </button>
                <div className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">
                  {ideas.length} Ideas Generated
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {ideas.map((idea, i) => (
                  <IdeaCard 
                    key={idea.id} 
                    idea={idea} 
                    index={i + 1} 
                    total={ideas.length}
                    userPlan={getUserStatus() === 'pro' ? 'Pro' : 'Free'}
                    onSave={toggleSaveIdea}
                    isSaved={!!savedIdeas.find(s => s.id === idea.id)}
                    onUpgrade={() => setView('pricing')}
                  />
                ))}
              </div>
            </div>
          )}

          {view === 'saved' && (
            <div className="animate-in fade-in slide-in-from-left-8">
              <div className="mb-10">
                <h2 className="text-4xl font-black text-slate-900 mb-4">Saved Ideas</h2>
                <p className="text-lg text-slate-500 font-medium">Your portfolio of high-potential ventures.</p>
              </div>
              {savedIdeas.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                  <Bookmark size={48} className="mx-auto mb-4 text-slate-200" />
                  <p className="text-slate-400 font-bold">No ideas saved yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {savedIdeas.map((idea, i) => (
                    <IdeaCard 
                      key={idea.id} 
                      idea={idea} 
                      index={i + 1} 
                      total={savedIdeas.length}
                      userPlan={getUserStatus() === 'pro' ? 'Pro' : 'Free'}
                      onSave={toggleSaveIdea}
                      isSaved={true}
                      onUpgrade={() => setView('pricing')}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'pricing' && (
            <div className="animate-in fade-in zoom-in-95">
              <div className="text-center mb-12">
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Pro Access</span>
                <h2 className="text-4xl font-black text-slate-900 mb-4">Go From Idea to Execution</h2>
                <p className="text-slate-500 font-medium">Unlock the full power of our AI Execution Engine.</p>
              </div>
              <div className="max-w-md mx-auto bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Crown size={120} /></div>
                <div className="relative z-10">
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-black">₹199</span>
                    <span className="text-slate-400 font-bold">/ lifetime</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {['Unlimited Idea Generation', 'Complete Execution Plans', 'GTM & Pricing Strategies', '30-60-90 Day Roadmaps', 'AI Mentor Insights'].map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm font-bold">
                        <CheckCircle2 size={18} className="text-indigo-400" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={handleUpgrade} className="w-full py-5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95">
                    Upgrade to Foundr Pro
                  </button>
                </div>
              </div>
            </div>
          )}

          {view === 'mentor' && (
            <div className="animate-in fade-in slide-in-from-bottom-8">
              <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-xl shadow-slate-200/40">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl w-fit mx-auto mb-6"><BrainCircuit size={48} /></div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">AI Business Advisor</h2>
                <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">Get personalized advice on how to scale your chosen business model.</p>
                {getUserStatus() !== 'pro' ? (
                  <button onClick={() => setView('pricing')} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center gap-2 mx-auto">
                    <Lock size={16} /> Unlock Advisor
                  </button>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-2xl text-slate-400 font-bold">
                    Advisor interface coming soon. Pick an idea to start a conversation.
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'profile' && currentUser && (
            <div className="animate-in fade-in slide-in-from-top-8">
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 text-center">
                <div className="w-24 h-24 rounded-full border-4 border-indigo-50 mx-auto mb-6 overflow-hidden">
                  <img src={currentUser.avatar} alt="Avatar" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">{currentUser.name}</h2>
                <p className="text-slate-400 font-bold mb-8">{currentUser.email}</p>
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                    <p className={`text-sm font-black ${currentUser.status === 'pro' ? 'text-indigo-600' : 'text-slate-600'}`}>
                      {currentUser.status.toUpperCase()}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Joined</p>
                    <p className="text-sm font-black text-slate-600">{currentUser.joinedDate}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-rose-500 font-black text-sm flex items-center justify-center gap-2 mx-auto hover:text-rose-600 transition-colors">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">{authMode === 'login' ? 'Welcome Back' : 'Create Founder Account'}</h2>
              <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <input type="text" placeholder="Full Name" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} />
              )}
              <input type="email" placeholder="Email Address" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} />
              <input type="password" placeholder="Password" required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 mt-4 active:scale-95 transition-all">
                {authMode === 'login' ? 'Login' : 'Start My Journey'}
              </button>
            </form>
            <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="w-full mt-6 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
              {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
