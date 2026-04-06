import React, { useState, useEffect } from 'react';
import { ResourceBar } from './ResourceBar';
import { PopulationChart } from './PopulationChart';
import { ResearchPanel } from './ResearchPanel';
import { EventLog } from './EventLog';
import { CareLogChart } from './CareLogChart';
import { VoiceScanner } from './VoiceScanner';
import { CivilizationState, ResearchItem, SystemEvent, CareLog } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { User, db, doc, onSnapshot, setDoc, getDoc, updateDoc } from '../firebase';
import { LogOut } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null, user: User) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      tenantId: user.tenantId,
      providerInfo: user.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const INITIAL_STATE: Omit<CivilizationState, 'uid'> = {
  resources: {
    energy: 1250,
    food: 840,
    materials: 450,
    knowledge: 120,
  },
  population: {
    total: 12400,
    growthRate: 1.2,
    happiness: 88,
  },
  research: [
    { id: '1', name: 'Fusion Reactors', description: 'Harness the power of the stars.', cost: 500, progress: 45, isCompleted: false, category: 'energy' },
    { id: '2', name: 'Hydroponic Farms', description: 'Efficient food production.', cost: 300, progress: 0, isCompleted: false, category: 'food' },
    { id: '3', name: 'Nano-materials', description: 'Stronger and lighter materials.', cost: 400, progress: 0, isCompleted: false, category: 'materials' },
    { id: '4', name: 'AI Governance', description: 'Optimize civilization management.', cost: 1000, progress: 0, isCompleted: false, category: 'knowledge' },
    { id: '5', name: 'Basic Medicine', description: 'Improve population health.', cost: 200, progress: 0, isCompleted: true, category: 'knowledge' },
  ],
  events: [
    { id: '1', timestamp: Date.now() - 100000, message: 'Civilization OS initialized successfully.', type: 'success' },
    { id: '2', timestamp: Date.now() - 50000, message: 'Energy production stabilized at 1.2 GW.', type: 'info' },
    { id: '3', timestamp: Date.now() - 20000, message: 'Population reached 12,000 threshold.', type: 'success' },
  ],
  careLogs: [
    { id: 'c1', timestamp: Date.now() - 3600000, category: 'health', value: 45, description: 'Community health checkup completed.' },
    { id: 'c2', timestamp: Date.now() - 7200000, category: 'education', value: 30, description: 'New literacy program launched.' },
  ],
  lastUpdate: Date.now(),
};

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [state, setState] = useState<CivilizationState | null>(null);
  const [history, setHistory] = useState<{ time: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'civilizations', user.uid);
    
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setState(snapshot.data() as CivilizationState);
      } else {
        // Initialize if doesn't exist
        const newState = { ...INITIAL_STATE, uid: user.uid };
        setDoc(docRef, newState).catch(err => handleFirestoreError(err, OperationType.WRITE, `civilizations/${user.uid}`, user));
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `civilizations/${user.uid}`, user);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    // Simulate population history
    const now = new Date();
    const mockHistory = Array.from({ length: 12 }).map((_, i) => {
      const d = new Date(now.getTime() - (11 - i) * 3600000);
      return {
        time: `${d.getHours()}:${d.getMinutes()}`,
        total: 10000 + i * 200 + Math.random() * 100,
      };
    });
    setHistory(mockHistory);

    // Simulation loop (only if state exists)
    const interval = setInterval(() => {
      if (!state) return;

      const docRef = doc(db, 'civilizations', user.uid);
      
      const newResources = {
        energy: state.resources.energy + 5 + Math.floor(Math.random() * 3),
        food: state.resources.food + 3 + Math.floor(Math.random() * 2),
        materials: state.resources.materials + 2 + Math.floor(Math.random() * 2),
        knowledge: state.resources.knowledge + 1 + Math.floor(Math.random() * 1.5),
      };

      const newPopulation = {
        ...state.population,
        total: state.population.total + Math.floor(Math.random() * 5),
      };

      const newResearch = (state.research || []).map(r => {
        if (r.progress > 0 && r.progress < 100) {
          const nextProgress = Math.min(100, r.progress + 0.5);
          return {
            ...r,
            progress: nextProgress,
            isCompleted: nextProgress === 100,
          };
        }
        return r;
      });

      let newEvents = [...(state.events || [])];
      if (Math.random() > 0.98) {
        const eventMessages = [
          { message: 'New technological breakthrough detected.', type: 'success' as const },
          { message: 'Energy grid fluctuation in Sector 7.', type: 'warning' as const },
          { message: 'Population happiness increasing.', type: 'info' as const },
          { message: 'Resource delivery delayed.', type: 'error' as const },
        ];
        const randomEvent = eventMessages[Math.floor(Math.random() * eventMessages.length)];
        newEvents = [{ id: Date.now().toString(), timestamp: Date.now(), ...randomEvent }, ...newEvents].slice(0, 20);
      }

      // Simulate HAIS Care Log update
      let newCareLogs = [...(state.careLogs || [])];
      if (Math.random() > 0.95) {
        const careCategories: CareLog['category'][] = ['health', 'education', 'social', 'environment'];
        const randomCat = careCategories[Math.floor(Math.random() * careCategories.length)];
        const newCareLog: CareLog = {
          id: `c-${Date.now()}`,
          timestamp: Date.now(),
          category: randomCat,
          value: 10 + Math.floor(Math.random() * 50),
          description: `HAIS detected ${randomCat} activity in Sector ${Math.floor(Math.random() * 10)}.`
        };
        newCareLogs = [...newCareLogs, newCareLog].slice(-50); // Keep last 50
      }

      updateDoc(docRef, {
        resources: newResources,
        population: newPopulation,
        research: newResearch,
        events: newEvents,
        careLogs: newCareLogs,
        lastUpdate: Date.now(),
      }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `civilizations/${user.uid}`, user));

    }, 5000); // Slower update for Firestore

    return () => clearInterval(interval);
  }, [state, user]);

  const handleStartResearch = (id: string) => {
    if (!state) return;

    const item = (state.research || []).find(r => r.id === id);
    if (!item || state.resources.knowledge < item.cost) return;

    const docRef = doc(db, 'civilizations', user.uid);
    
    updateDoc(docRef, {
      resources: {
        ...state.resources,
        knowledge: state.resources.knowledge - item.cost,
      },
      research: (state.research || []).map(r => r.id === id ? { ...r, progress: 1 } : r),
      events: [
        { id: Date.now().toString(), timestamp: Date.now(), message: `Research started: ${item.name}`, type: 'info' },
        ...(state.events || [])
      ].slice(0, 20),
    }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `civilizations/${user.uid}`, user));
  };

  const handleSeedData = async () => {
    const targetId = 'hideki_tamae_01';
    const docRef = doc(db, 'civilizations', targetId);
    const testData: CivilizationState = {
      uid: targetId,
      resources: {
        energy: 8916,
        food: 5293,
        materials: 3630,
        knowledge: 1815
      },
      population: {
        total: 14952,
        growthRate: 1.2,
        happiness: 88
      },
      research: [],
      events: [
        { id: 'seed-1', timestamp: Date.now(), message: 'System Genesis: Data injected for hideki_tamae_01', type: 'success' }
      ],
      careLogs: [
        { id: '1', timestamp: 1712383392000, category: 'health', value: 75, description: 'System Genesis' }
      ],
      lastUpdate: 1712383392000,
    };

    try {
      console.log('Attempting to seed data for:', targetId);
      await setDoc(docRef, testData);
      alert(`Successfully seeded data for ${targetId}`);
    } catch (err) {
      console.error('Seed failed:', err);
      handleFirestoreError(err, OperationType.WRITE, `civilizations/${targetId}`, user);
    }
  };

  if (loading || !state) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30">
      <ResourceBar resources={state.resources} />

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <PopulationChart population={state.population} history={history} />
          <CareLogChart logs={state.careLogs} />
          <ResearchPanel research={state.research} onStartResearch={handleStartResearch} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="h-full flex flex-col gap-6"
        >
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full border border-slate-700" referrerPolicy="no-referrer" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-200">{user.displayName}</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Administrator</span>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-rose-400"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600">Session ID</span>
              <span className="text-[10px] font-mono text-slate-400 truncate">{user.uid}</span>
            </div>
            <button 
              onClick={handleSeedData}
              className="mt-4 w-full py-2 px-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-[10px] font-mono uppercase tracking-widest text-cyan-400 hover:bg-cyan-500/20 transition-all"
            >
              Seed Test Data (hideki_tamae_01)
            </button>
          </div>
          <VoiceScanner userId={user.uid} />
          <EventLog events={state.events} />
        </motion.div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-900 flex items-center justify-between opacity-50">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-widest">System Architecture</span>
          <span className="text-xs font-mono">Quantum-Neural Hybrid OS v1.0.42</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest">Uptime: 142:54:12</span>
        </div>
      </footer>
    </div>
  );
};
