"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Phone, LogOut, Calendar, Send, User, CheckCircle, 
  X, Hash, MessageSquare, Clock, PhoneOff, Shield, Mail,
  XCircle, MapPin, Coffee, Utensils, Activity, Delete, AlertCircle, Headphones,
  ChevronDown, ChevronUp, Settings, Sun, Moon, Volume2, Bell
} from 'lucide-react';

// --- TYPES ---
interface Lead {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  birth_date?: string;
  address?: string;
  zip_code?: string;
  city?: string;
  last_note?: string;
  status?: string;
  agent_id?: string;
  created_at?: string;
  [key: string]: any; 
}

// --- DICTIONNAIRE DE TRADUCTION ---
const COLUMN_MAPPING: Record<string, string[]> = {
  first_name: ['prénom', 'prenom', 'first name', 'fname', 'pnom'],
  last_name: ['nom', 'last name', 'lname', 'client', 'nom du client'],
  phone: ['téléphone', 'telephone', 'tel', 'phone', 'portable', 'mobile', 'numero'],
  email: ['email', 'e-mail', 'mail', 'courriel', 'adresse mail'],
  city: ['ville', 'city', 'commune', 'localité', 'localite'],
  zip_code: ['cp', 'code postal', 'zip', 'zipcode' ],
  address: ['adresse', 'address', 'rue', 'adresse complète'],
  birth_date: ['date de naissance', 'naissance', 'dob', 'birthdate', 'né le'],
  product: ['produit', 'product', 'offre', 'service']
};

// Convertit les dates Supabase vers le format attendu par <input type="date">
// - "MM-DD-YY" (ex: 08-23-67) => "YYYY-MM-DD"
// - "YYYY-MM-DD" => inchangé
const formatToInputDate = (value: unknown): string => {
  if (value === null || value === undefined) return '';

  // Dans certains cas, Supabase peut retourner un Date.
  if (value instanceof Date) {
    const yyyy = value.getFullYear();
    const mm = String(value.getMonth() + 1).padStart(2, '0');
    const dd = String(value.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  const s = String(value).trim();
  if (!s) return '';

  // Format ISO (parfois avec "T...") : YYYY-MM-DD...
  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  // Format US : MM-DD-YY (avec ou sans zéros initiaux)
  const mdYMatch = s.match(/^(\d{1,2})-(\d{1,2})-(\d{2})$/);
  if (mdYMatch) {
    const mm = Number(mdYMatch[1]);
    const dd = Number(mdYMatch[2]);
    const yy = Number(mdYMatch[3]);

    // Heuristique : 00-30 => 2000-2030, sinon => 1900-1999
    const yyyy = yy <= 30 ? 2000 + yy : 1900 + yy;

    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return '';
    return `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
  }

  return '';
};

export default function AgentPage() {
  const router = useRouter();
  
  // --- ÉTATS ---
  const [agentId, setAgentId] = useState<string>(""); 
  const [agentName, setAgentName] = useState<string>("CHARGEMENT...");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [showDialer, setShowDialer] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // NOUVEAU
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [darkMode, setDarkMode] = useState(true); 
  const [leftTab, setLeftTab] = useState<'nouveaux' | 'rappel'>('nouveaux');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState<any>(null);
  const [presenceStatus, setPresenceStatus] = useState("disponible");

  // --- IA (GEMINI) ---
  const [aiScript, setAiScript] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string>('');

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', phone: '', email: '',
    birth_date: '', address: '', zip_code: '', city: '',
    product: '',
    notes: '', status: 'nouveau'
  });

  // Calcul du nombre de rappels pour la cloche
  const rappelLeads = leads.filter(l => l.status === 'rappel');

  // --- FONCTION DE NORMALISATION ---
  const normalizeLeadData = useCallback((rawLead: any) => {
    const normalized: any = {};
    const entryKeys = Object.keys(rawLead);

    Object.keys(COLUMN_MAPPING).forEach(targetField => {
      const aliases = COLUMN_MAPPING[targetField];
      const matches = entryKeys.filter(key => {
        const lk = key.toLowerCase().trim();
        return aliases.includes(lk) || lk === targetField.toLowerCase();
      });

      // Plusieurs colonnes peuvent matcher (ex. city vide + ville renseignée) : prioriser une valeur non vide.
      const nonEmptyKey = matches.find(k => {
        const v = rawLead[k];
        return v != null && String(v).trim() !== '';
      });
      if (nonEmptyKey) {
        normalized[targetField] = rawLead[nonEmptyKey];
        return;
      }
      if (matches.length > 0) {
        const v = rawLead[matches[0]];
        normalized[targetField] = v != null ? v : '';
        return;
      }
      const fallback = rawLead[targetField];
      normalized[targetField] = fallback != null ? fallback : '';
    });

    return normalized;
  }, []);

  const selectLead = useCallback((lead: Lead) => {
    // 1. On normalise les données pour faire correspondre les noms de colonnes
    const cleanLead = normalizeLeadData(lead);

    // 2. On définit le lead actuel pour l'UI
    setCurrentLead(lead);

    // 3. On met à jour le numéro pour le dialer
    setPhoneNumber(cleanLead.phone || "");

    // 4. MISE À JOUR CRUCIALE DU FORMULAIRE
    // On s'assure que birth_date et city sont explicitement récupérés
    setFormData({
      first_name: cleanLead.first_name || '', 
      last_name: cleanLead.last_name || '',
      phone: cleanLead.phone || '', 
      email: cleanLead.email || '',
      birth_date: formatToInputDate(cleanLead.birth_date) || '',
      address: cleanLead.address || '',
      zip_code: cleanLead.zip_code || '', 
      city: cleanLead.city || '',
      product: cleanLead.product || '',
      notes: lead.last_note || '', 
      status: lead.status || 'nouveau'
    });
  }, [normalizeLeadData]);

  // --- RÉCUPÉRATION DES DONNÉES ---
  const fetchData = useCallback(async (forcedId?: string) => {
    const activeId = forcedId || agentId;
    if (!activeId) return;

    const { data: l } = await supabase.from('leads').select('*')
      .or(`agent_id.eq.${activeId},agent_id.eq.STOCK`)
      .order('created_at', { ascending: false });
    
    const { data: m } = await supabase.from('messages').select('*').order('created_at', { ascending: true });

    if (l) {
      setLeads(l);
      if (!currentLead && l.length > 0) {
        const activeLead = l.find((lead: Lead) => lead.status === 'nouveau') || l[0];
        if (activeLead) selectLead(activeLead);
      }
    }
    if (m) setMessages(m);
    setLoading(false);
  }, [agentId, currentLead, selectLead]);

  // --- INITIALISATION VOIP ---
  const initVOIP = useCallback(async () => {
    if (device || typeof window === 'undefined') return;
    try {
      const res = await fetch('/api/voip/token');
      const data = await res.json();
      if (data.token) {
        const { Device } = await import('@twilio/voice-sdk');
        const newDevice = new Device(data.token, {
          codecPreferences: ['opus', 'pcmu'] as any,
          edge: ['dublin', 'frankfurt'], 
          maxCallSignalingTimeoutMs: 10000, 
          enableIceRestart: true,
        } as any);
        await newDevice.register();
        setDevice(newDevice);
      }
    } catch (err) {
      console.error("Erreur Twilio Token", err);
    }
  }, [device]);

  // --- INITIALISATION SESSION ---
  useEffect(() => {
    const initProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).maybeSingle();
        if (profile?.full_name) {
          setAgentName(profile.full_name.toUpperCase());
        } else {
          setAgentName(session.user.email?.split('@')[0].toUpperCase() || "AGENT");
        }
        
        setAgentId(session.user.id);
        fetchData(session.user.id);
        initVOIP();
      } else {
        router.push('/login');
      }
    };

    initProfile();
  }, [router, fetchData, initVOIP]);

  // --- TEMPS RÉEL ---
  useEffect(() => {
    const channel = supabase.channel('agent_realtime')
      .on('postgres_changes' as any, { event: '*', table: 'leads', schema: 'public' }, () => fetchData())
      .on('postgres_changes' as any, { event: '*', table: 'messages', schema: 'public' }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchData]);

  // --- ACTIONS ---
  const handleCall = async (number?: string) => {
    const targetNumber = number || formData.phone;
    if (!targetNumber) {
      alert("Pas de numéro de téléphone");
      return;
    }
    if (!device) {
      window.open(`tel:${targetNumber}`);
      return;
    }
    try {
      if (isCalling) {
        device.disconnectAll();
        setIsCalling(false);
        return;
      }
      const params = { To: targetNumber };
      const call = await device.connect({ params });
      setIsCalling(true);
      call.on('disconnect', () => setIsCalling(false));
    } catch (err) {
      setIsCalling(false);
      alert("Erreur de connexion micro.");
    }
  };

  const handleUpdateLead = async (newStatus?: string) => {
    if (!currentLead) return;
    const statusToUpdate = newStatus || formData.status;
    
    const { error } = await supabase.from('leads').update({
        first_name: formData.first_name, 
        last_name: formData.last_name,
        phone: formData.phone,
        email: formData.email, 
        birth_date: formData.birth_date || null,
        address: formData.address, 
        zip_code: formData.zip_code,
        city: formData.city, 
        last_note: formData.notes, 
        status: statusToUpdate
      }).eq('id', currentLead.id);

    if (error) {
      alert("Erreur de mise à jour");
    } else { 
      if (statusToUpdate === 'rappel') setShowCalendarModal(true);
      alert(`✅ Lead mis à jour : ${statusToUpdate.toUpperCase()}`); 
      fetchData(); 
    }
  };

  const sendMessage = async () => {
    if(!newMessage.trim()) return;
    await supabase.from('messages').insert([{ content: newMessage, sender_id: agentId }]);
    setNewMessage("");
  };

  const generateAiScript = async (clientFirstName?: string, produit?: string, notes?: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error(
        "[Gemini] Clé API absente : ajoutez NEXT_PUBLIC_GEMINI_API_KEY dans .env.local (racine du projet), puis redémarrez npm run dev."
      );
      setAiError("Clé Gemini manquante : définissez NEXT_PUBLIC_GEMINI_API_KEY dans votre environnement.");
      return;
    }

    const firstName = (clientFirstName || '').trim();
    const product = (produit || '').trim();
    const commercialNotes = (notes || '').trim();

    console.log("Données envoyées à l'IA:", { firstName, product });

    if (!product) {
      setAiError("Veuillez sélectionner un produit pour ce lead.");
      return;
    }

    setAiLoading(true);
    setAiError('');
    setAiScript('');

    try {
      const genAI = new GoogleGenerativeAI(apiKey as string);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
Tu es un coach commercial senior de Casablanca Elite Services.
Objectif : aider un agent à convaincre le client avec un ton professionnel, chaleureux et premium.

Contexte :
- Prénom du client : ${firstName}
- Produit / service : ${product}
- Notes commerciales : ${commercialNotes || "Aucune note fournie"}

Instructions :
- Réponds en français.
- Donne un script prêt à dire au téléphone (style conversation).
- Structure :
  1) Accroche + personnalisation
  2) 2 questions de découverte (courtes)
  3) Proposition de valeur (3 bénéfices concrets)
  4) 2 réponses à objections courantes (prix, besoin/temps)
  5) Closing (prochaine étape claire + prise de rendez-vous)
- Reste concis, impactant, sans blabla.
`.trim();

      console.log('Connexion établie avec Gemini 2.5 Flash...');
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setAiScript(text.trim());
    } catch (e: any) {
      console.error(e);
      setAiError("Impossible de générer le script pour le moment. Réessayez dans quelques secondes.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="h-screen bg-slate-950 flex items-center justify-center text-cyan-500 font-black animate-pulse uppercase tracking-[0.5em]">PRO-CRM : CHARGEMENT...</div>;

  return (
    <div className={`h-screen flex flex-col font-sans overflow-hidden relative transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <header className={`h-20 border-b flex items-center justify-between px-8 shrink-0 shadow-xl z-10 transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <div className="bg-cyan-600 p-2 rounded-xl text-white font-black text-[10px] shadow-lg shadow-cyan-900/20">ELITE</div>
          <div>
            <h2 className={`text-sm font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>{agentName}</h2>
            <div className="text-[9px] text-emerald-500 font-bold uppercase flex items-center gap-1">
              <Activity size={10}/> {presenceStatus}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex gap-2">
          {["disponible", "déjeuner", "café"].map((status) => (
            <button key={status} onClick={() => setPresenceStatus(status)} className={`px-4 py-2 rounded-lg text-[10px] font-black flex items-center gap-2 transition-all uppercase ${presenceStatus === status ? (status === 'disponible' ? 'bg-emerald-600 text-white' : status === 'déjeuner' ? 'bg-amber-600 text-white' : 'bg-orange-600 text-white') : (darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}`}>{status}</button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* BOUTON CLOCHE (RAPPELS) */}
          <button onClick={() => setShowNotifications(true)} className={`relative ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'} p-3 rounded-xl hover:bg-amber-500 hover:text-white transition-all`}>
            <Bell size={18}/>
            {rappelLeads.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-slate-900 animate-bounce">
                {rappelLeads.length}
              </span>
            )}
          </button>

          <button onClick={() => setShowChatDrawer(true)} className={`${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'} p-3 rounded-xl hover:bg-cyan-600 hover:text-white transition-all flex items-center gap-2`}>
              <MessageSquare size={18}/>
              <span className="text-[10px] font-bold hidden sm:inline">CHAT</span>
          </button>
          <button onClick={() => setShowDialer(true)} className={`${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'} p-3 rounded-xl hover:bg-cyan-600 hover:text-white transition-all`}><Hash size={18}/></button>
          <button onClick={() => setShowSettingsModal(true)} className={`${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'} p-3 rounded-xl hover:bg-slate-700 transition-all`}><Settings size={18}/></button>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }} className="text-rose-500 p-3 hover:bg-rose-100 rounded-xl transition-all"><LogOut size={18}/></button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0 overflow-hidden p-6 gap-6">
        {/* COLONNE GAUCHE - LISTE DES LEADS */}
        <aside className="w-72 flex min-h-0 max-h-full flex-col gap-4 shrink-0 overflow-hidden">
          <div className={`flex min-h-0 flex-col rounded-[2rem] border transition-all duration-300 ${leftTab === 'nouveaux' ? `flex-1 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-lg'}` : `h-14 shrink-0 ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}`}>
            <button type="button" onClick={() => setLeftTab('nouveaux')} className={`shrink-0 p-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="flex items-center gap-2"><User size={14}/> Nouveaux Leads</span>
              {leftTab === 'nouveaux' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
            {leftTab === 'nouveaux' && (
              <div className="min-h-0 flex-1 max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden px-4 pb-4 space-y-2 scrollbar-hide">
                {leads.filter(l => l.status === 'nouveau').map((l, i) => {
                  const displayData = normalizeLeadData(l);
                  return (
                    <div key={i} onClick={() => selectLead(l)} className={`p-3 rounded-xl cursor-pointer transition-all ${currentLead?.id === l.id ? 'bg-cyan-600 text-white' : (darkMode ? 'bg-slate-800/50 hover:bg-slate-800 text-slate-300' : 'bg-slate-50 hover:bg-slate-100 text-slate-700')}`}>
                      <p className="text-[10px] font-bold uppercase truncate">{displayData.first_name} {displayData.last_name}</p>
                      <p className="text-[8px] opacity-60 font-mono mt-1">{displayData.phone}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className={`flex min-h-0 flex-col rounded-[2rem] border transition-all duration-300 ${leftTab === 'rappel' ? `flex-1 ${darkMode ? 'bg-cyan-950/20 border-cyan-900/50' : 'bg-amber-50 border-amber-200 shadow-lg'}` : `h-14 shrink-0 ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}`}>
            <button type="button" onClick={() => setLeftTab('rappel')} className={`shrink-0 p-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-amber-500`}>
              <span className="flex items-center gap-2"><Clock size={14}/> Rappels</span>
              {leftTab === 'rappel' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
            {leftTab === 'rappel' && (
              <div className="min-h-0 flex-1 max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden px-4 pb-4 space-y-2 scrollbar-hide">
                {leads.filter(l => l.status === 'rappel').map((r, i) => {
                  const displayData = normalizeLeadData(r);
                  return (
                    <div key={i} onClick={() => selectLead(r)} className={`p-3 rounded-xl cursor-pointer transition-all ${currentLead?.id === r.id ? 'bg-cyan-600 text-white' : (darkMode ? 'bg-slate-900 border-slate-800 hover:border-cyan-700' : 'bg-white border-slate-200 hover:border-amber-400')}`}>
                      <p className="text-[10px] font-black uppercase truncate">{displayData.first_name} {displayData.last_name}</p>
                      <p className="text-[9px] font-mono mt-1">{displayData.phone}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* MAIN SECTION - FICHE PROSPECT */}
        <main className="flex-1 flex min-h-0 flex-col gap-6 overflow-y-auto scrollbar-hide">
          {currentLead ? (
            <div className="grid grid-cols-12 gap-6 min-h-full">
              <div className="col-span-12 xl:col-span-9 space-y-6">
                <div className={`rounded-[3rem] p-8 border shadow-2xl transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                  <h2 className="text-3xl font-black mb-6 tracking-tighter uppercase italic text-cyan-500 flex items-center gap-3">
                    <User size={28}/> Fiche Prospect
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(Object.entries({
                      first_name: "Prénom", 
                      last_name: "Nom", 
                      phone: "Téléphone", 
                      email: "Email", 
                      birth_date: "Date de naissance",
                      address: "Adresse complète", 
                      zip_code: "Code Postal", 
                      city: "Ville"
                    }) as [keyof typeof formData, string][]).map(([key, label]) => (
                      <div key={key} className={`space-y-1 ${key === 'address' ? 'col-span-2' : ''}`}>
                        <label className={`text-[9px] font-black uppercase ml-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</label>
                        <input 
                          type={key === 'birth_date' ? 'date' : 'text'} 
                          value={formData[key] || ''} 
                          onChange={e => setFormData({...formData, [key]: e.target.value})} 
                          className={`w-full border p-4 rounded-2xl text-sm outline-none focus:border-cyan-500 transition-all ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200 [color-scheme:dark]' : 'bg-slate-50 border-slate-200 text-slate-800'}`} 
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <label className={`text-[9px] font-black uppercase block mb-2 ml-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Notes Commerciales</label>
                    <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className={`w-full rounded-3xl p-6 h-40 text-xs outline-none focus:border-cyan-500 resize-none shadow-inner transition-colors ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`} />
                  </div>
                  <button onClick={() => handleUpdateLead()} className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-2xl shadow-lg uppercase text-xs tracking-widest">Enregistrer la fiche</button>
                </div>

                {/* ASSISTANT IA ✨ */}
                <div className={`rounded-[3rem] p-8 border shadow-2xl transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-widest text-cyan-500">Assistant IA ✨</h3>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-[11px] font-bold mt-1`}>
                        Génère un script personnalisé (style coach) pour aider à convaincre le client.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const cleanLead = normalizeLeadData(currentLead);
                        if (!String(cleanLead.product || '').trim()) {
                          setAiError("Veuillez sélectionner un produit pour ce lead.");
                          return;
                        }
                        generateAiScript(cleanLead.first_name, cleanLead.product, formData.notes);
                      }}
                      disabled={aiLoading}
                      className={`shrink-0 px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg
                        ${aiLoading ? 'bg-slate-700 text-slate-300 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}
                      `}
                    >
                      ✨ Générer Script IA
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-5 space-y-3">
                      <div className="space-y-1">
                        <label className={`text-[9px] font-black uppercase ml-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Prénom client</label>
                        <input
                          value={normalizeLeadData(currentLead).first_name || ''}
                          readOnly
                          className={`w-full border p-4 rounded-2xl text-sm outline-none ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`text-[9px] font-black uppercase ml-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Produit / service</label>
                        <input
                          value={normalizeLeadData(currentLead).product || ''}
                          readOnly
                          placeholder="(vide) — à renseigner dans la fiche du lead"
                          className={`w-full border p-4 rounded-2xl text-sm outline-none ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                        />
                      </div>

                      <p className={`${darkMode ? 'text-slate-500' : 'text-slate-400'} text-[10px] font-bold leading-relaxed`}>
                        Astuce : renseignez le champ <span className="text-cyan-500">product</span> sur le lead (Supabase) pour une génération plus précise.
                      </p>
                    </div>

                    <div className="lg:col-span-7">
                      {aiError ? (
                        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6">
                          <p className="text-rose-400 text-xs font-black uppercase tracking-widest">Erreur IA</p>
                          <p className="text-rose-200 text-sm font-bold mt-2">{aiError}</p>
                        </div>
                      ) : aiLoading ? (
                        <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <p className="text-xs font-black uppercase tracking-widest text-cyan-500">Préparation du script…</p>
                          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-sm font-bold mt-2`}>
                            L’assistant construit une proposition adaptée à Casablanca Elite Services.
                          </p>
                        </div>
                      ) : aiScript ? (
                        <div className={`rounded-3xl border p-6 relative overflow-hidden ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: 'radial-gradient(circle at top left, rgba(34,211,238,0.25), transparent 55%)' }} />
                          <div className="relative">
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Conseil de coach</p>
                                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-[11px] font-bold`}>
                                  Script prêt à utiliser (personnalisé).
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => navigator.clipboard?.writeText(aiScript)}
                                className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                              >
                                Copier
                              </button>
                            </div>

                            <div className="border-l-4 border-cyan-500 pl-4">
                              <pre className={`whitespace-pre-wrap text-sm font-semibold leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                {aiScript}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <p className="text-xs font-black uppercase tracking-widest text-slate-500">Prêt</p>
                          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-sm font-bold mt-2`}>
                            Sélectionnez un produit/service puis cliquez sur “Générer Script IA”.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* BARRE D'ACTIONS RAPIDES */}
              <div className="col-span-12 xl:col-span-3 flex flex-col gap-4">
                <div className={`rounded-[2.5rem] p-5 border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                  <label className={`text-[9px] font-black uppercase ml-2 mb-2 block ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Composition Manuelle
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="tel" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="06XXXXXXXX"
                      className={`flex-1 p-3 rounded-xl font-mono text-sm border outline-none focus:border-cyan-500 ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                    <button onClick={() => handleCall(phoneNumber)} className="bg-emerald-600 p-3 rounded-xl text-white hover:bg-emerald-500 transition-colors">
                      <Phone size={18} fill="white"/>
                    </button>
                  </div>
                </div>

                <button onClick={() => handleCall()} className={`w-full h-32 rounded-[2.5rem] flex flex-col items-center justify-center transition-all shadow-2xl ${isCalling ? 'bg-rose-600 animate-pulse text-white' : 'bg-cyan-600 hover:scale-[1.02] text-white shadow-cyan-900/40'}`}>
                  {isCalling ? (
                    <>
                      <PhoneOff size={32} />
                      <span className="mt-2 font-black text-[10px] uppercase tracking-widest">Raccrocher</span>
                    </>
                  ) : (
                    <>
                      <Phone size={32} fill="white"/>
                      <span className="mt-2 font-black text-[10px] uppercase tracking-widest text-center">Appeler : {formData.first_name || 'Prospect'}</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => handleUpdateLead('vente')} className="w-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 p-5 rounded-[1.5rem] font-black text-[10px] uppercase flex items-center justify-center gap-3 hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle size={18} /> Vente validée</button>
                  <button onClick={() => handleUpdateLead('rappel')} className="w-full bg-amber-500/10 text-amber-500 border border-amber-500/20 p-5 rounded-[1.5rem] font-black text-[10px] uppercase flex items-center justify-center gap-3 hover:bg-amber-600 hover:text-white transition-all"><Clock size={18} /> Rappel</button>
                  <button onClick={() => handleUpdateLead('nrp')} className="w-full bg-rose-500/10 text-rose-500 border border-rose-500/20 p-5 rounded-[1.5rem] font-black text-[10px] uppercase flex items-center justify-center gap-3 hover:bg-rose-600 hover:text-white transition-all"><PhoneOff size={18} /> NRP</button>
                  <button onClick={() => handleUpdateLead('refus')} className={`w-full border p-5 rounded-[1.5rem] font-black text-[10px] uppercase flex items-center justify-center gap-3 hover:bg-slate-700 hover:text-white transition-all ${darkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'}`}><AlertCircle size={18} /> Refus / KO</button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`flex-1 flex flex-col items-center justify-center rounded-[4rem] border-4 border-dashed ${darkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-slate-200'}`}>
                <User size={60} className={darkMode ? 'text-slate-700' : 'text-slate-200'} />
                <p className="mt-4 text-slate-500 font-black text-sm uppercase tracking-widest">Sélectionnez un lead dans la table</p>
            </div>
          )}
        </main>
      </div>

      {/* --- MODALS --- */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-10 rounded-[3rem] border shadow-2xl animate-in zoom-in-95 duration-200 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase text-cyan-500 flex items-center gap-3"><Settings size={24}/> Paramètres</h2>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-rose-500"><X size={24}/></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2"><Headphones size={14}/> Sortie Audio</label>
                <select className={`w-full p-4 rounded-xl text-xs font-bold border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}>
                  <option>Dublin (Edge optimal)</option>
                  <option>Haut-parleurs système</option>
                </select>
                <button className="text-[10px] font-bold text-cyan-500 flex items-center gap-2"><Volume2 size={12}/> Tester le volume</button>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2"><Sun size={14}/> Apparence</label>
                <div className="flex gap-2">
                  <button onClick={() => setDarkMode(false)} className={`flex-1 p-4 rounded-xl text-[10px] font-black transition-all ${!darkMode ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-500'}`}>CLAIR</button>
                  <button onClick={() => setDarkMode(true)} className={`flex-1 p-4 rounded-xl text-[10px] font-black transition-all ${darkMode ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-500'}`}>SOMBRE</button>
                </div>
              </div>
            </div>
            <button onClick={() => setShowSettingsModal(false)} className="w-full mt-8 bg-slate-800 text-white py-4 rounded-2xl font-black text-[10px] uppercase">Fermer</button>
          </div>
        </div>
      )}

      {/* TIROIR DES NOTIFICATIONS (RAPPELS) */}
      {showNotifications && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" onClick={() => setShowNotifications(false)}></div>
          <aside className={`fixed right-0 top-0 h-full w-96 border-l shadow-2xl z-[201] flex flex-col animate-in slide-in-from-right duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
             <div className={`p-6 border-b flex items-center justify-between ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-amber-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-amber-500">Rappels en attente ({rappelLeads.length})</span>
                </div>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-rose-500"><X size={24}/></button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {rappelLeads.length > 0 ? (
                  rappelLeads.map((r, i) => {
                    const d = normalizeLeadData(r);
                    return (
                      <div 
                        key={i} 
                        onClick={() => { selectLead(r); setShowNotifications(false); }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-amber-500' : 'bg-slate-50 border-slate-200 hover:border-amber-500'}`}
                      >
                        <p className="text-[10px] font-black uppercase">{d.first_name} {d.last_name}</p>
                        <p className="text-[9px] font-mono text-cyan-500 mt-1">{d.phone}</p>
                        <div className="flex items-center gap-2 mt-2 opacity-60">
                          <Clock size={10} />
                          <span className="text-[8px] font-bold">À rappeler rapidement</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                    <CheckCircle size={40} className="mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase">Aucun rappel pour le moment</p>
                  </div>
                )}
             </div>
          </aside>
        </>
      )}

      {showChatDrawer && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setShowChatDrawer(false)}></div>
          <aside className={`fixed right-0 top-0 h-full w-96 border-l shadow-2xl z-[101] flex flex-col animate-in slide-in-from-right duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
             <div className={`p-6 border-b flex items-center justify-between ${darkMode ? 'bg-slate-800/30' : 'bg-slate-50'}`}>
                <span className="text-xs font-black uppercase tracking-widest">Chat Superviseur</span>
                <button onClick={() => setShowChatDrawer(false)} className="text-slate-400 hover:text-rose-500"><X size={24}/></button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.sender_id === 'Admin' ? 'items-start' : 'items-end'}`}>
                    <div className={`p-4 rounded-2xl text-xs font-bold max-w-[85%] ${m.sender_id === 'Admin' ? (darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600') : 'bg-cyan-600 text-white'}`}>{m.content}</div>
                  </div>
                ))}
             </div>
             <div className="p-6 border-t">
                <div className={`flex gap-2 p-3 rounded-2xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <input value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Tapez..." className="flex-1 bg-transparent px-3 text-xs outline-none" />
                  <button onClick={sendMessage} className="bg-cyan-600 p-3 rounded-xl text-white shadow-lg"><Send size={18}/></button>
                </div>
             </div>
          </aside>
        </>
      )}

      {showDialer && (
        <div className="fixed inset-0 bg-slate-950/90 z-[9999] flex items-center justify-center p-4 backdrop-blur-md">
          <div className={`p-8 rounded-[4rem] border w-full max-w-xs shadow-2xl relative ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <button onClick={() => {setShowDialer(false); setPhoneNumber("");}} className="absolute top-8 right-8 text-slate-500"><X size={28}/></button>
            <div className="text-center mb-8">
              <div className={`p-8 rounded-[2.5rem] border min-h-[100px] flex items-center justify-center ${darkMode ? 'bg-slate-950 border-slate-800 text-cyan-500' : 'bg-slate-50 border-slate-200 text-cyan-600'}`}>
                <span className="text-3xl font-black font-mono">{phoneNumber || "---"}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((n) => (
                <button key={n} onClick={() => setPhoneNumber(prev => prev + String(n))} className={`h-16 rounded-[1.5rem] text-xl font-black transition-all ${darkMode ? 'bg-slate-800 hover:bg-cyan-600' : 'bg-slate-100 hover:bg-cyan-600 hover:text-white'}`}>{n}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setPhoneNumber(p => p.slice(0, -1))} className="bg-slate-200 dark:bg-slate-800 h-16 rounded-[1.5rem] flex items-center justify-center text-rose-500"><Delete size={24}/></button>
              <button onClick={() => { handleCall(phoneNumber); setShowDialer(false); }} className="bg-emerald-500 h-16 rounded-[1.5rem] flex items-center justify-center text-white"><Phone size={24}/></button>
              <button onClick={() => { setPhoneNumber(""); setShowDialer(false); if(isCalling) handleCall(); }} className="col-span-2 bg-rose-600 h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase text-white">RACCROCHER</button>
            </div>
          </div>
        </div>
      )}

      {showCalendarModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-md">
          <div className={`p-10 rounded-[3rem] border w-full max-w-md shadow-2xl relative ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-xl font-black uppercase text-cyan-500 mb-6 flex items-center gap-3"><Clock size={20}/> Planifier un rappel</h2>
              <input type="datetime-local" className={`w-full p-5 border rounded-2xl mb-8 outline-none ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200 [color-scheme:dark]' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
              <div className="flex gap-4">
                 <button onClick={() => setShowCalendarModal(false)} className="flex-1 bg-slate-200 dark:bg-slate-800 py-5 rounded-2xl font-black text-[10px] uppercase">Annuler</button>
                 <button onClick={() => {setShowCalendarModal(false); alert("Rappel programmé !");}} className="flex-1 bg-cyan-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase">Confirmer</button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}