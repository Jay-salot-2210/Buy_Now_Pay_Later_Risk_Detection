import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, CheckCircle, AlertTriangle, Menu, Settings } from 'lucide-react';
import TransactionForm from './components/TransactionForm';
import RiskGauge from './components/RiskGauge';
import Sidebar from './components/Sidebar';
import SettingsPage from './components/Settings';

function App() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/stats');
                setStats(response.data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };
        fetchStats();
    }, []);

    const handleSimulate = async (data) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://127.0.0.1:8000/predict', data);
            setResult(response.data);
        } catch (err) {
            console.error("Connection Failed:", err);
            setError('Failed to connect to Risk Engine (Port 8000). Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1214] text-white">
            <Sidebar
                activeTab={activeTab}
                onNavigate={setActiveTab}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="p-4 lg:p-8 max-w-[1920px] mx-auto transition-all duration-300">
                <header className="flex justify-between items-center mb-10 mt-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 hover:bg-[#1a1d1f] rounded-xl border border-transparent hover:border-[#272b30] transition-all"
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#c3fb5c] to-[#c3fb5c] bg-clip-text text-transparent">
                                {activeTab === 'overview' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                            </h1>
                            <p className="text-[#6f767e] mt-1 font-medium flex items-center gap-2">
                                <Activity size={14} className="text-[#c3fb5c]" />
                                Real-time credit risk assessment
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex gap-4">
                        <div className="flex items-center gap-2 bg-[#1a1d1f] px-4 py-2 rounded-full border border-[#272b30] shadow-lg shadow-[#c3fb5c]/5">
                            <div className="w-2 h-2 rounded-full bg-[#c3fb5c] animate-pulse"></div>
                            <span className="text-sm font-bold">System Live</span>
                        </div>
                    </div>
                </header>

                {activeTab === 'overview' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                icon={<TrendingUp />}
                                label="Total Processed"
                                value={stats ? `$${(stats.total_volume / 1000000).toFixed(1)}M` : 'Loading...'}
                                trend={stats ? `${stats.total_transactions.toLocaleString()} txns` : ''}
                            />
                            <StatCard
                                icon={<CheckCircle />}
                                label="Approval Rate"
                                value={stats ? `${(stats.approval_rate * 100).toFixed(1)}%` : 'Loading...'}
                                trend={stats ? `${(100 - stats.default_rate * 100).toFixed(1)}% approved` : ''}
                            />
                            <StatCard
                                icon={<Activity />}
                                label="Avg. FICO"
                                value={stats ? stats.avg_fico.toString() : 'Loading...'}
                                trend={stats ? 'From dataset' : ''}
                            />
                            <StatCard
                                icon={<AlertTriangle />}
                                label="Risk Alerts"
                                value={stats ? `${(stats.risk_alerts * 100).toFixed(1)}%` : 'Loading...'}
                                trend={stats ? `${(stats.default_rate * 100).toFixed(1)}% default` : ''}
                                isNegative
                            />
                        </div>

                        <main className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                            <div className="xl:col-span-8">
                                <TransactionForm onSimulate={handleSimulate} loading={loading} />
                            </div>

                            <div className="xl:col-span-4 h-full">
                                {result ? (
                                    <RiskGauge
                                        probability={result.probability_of_default}
                                        decision={result.decision}
                                        limit={result.recommended_limit}
                                        profit={result.expected_profit}
                                    />
                                ) : (
                                    <div className="glass-panel p-8 h-full flex flex-col items-center justify-center text-center min-h-[500px] border-dashed">
                                        {error ? (
                                            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20">
                                                <AlertTriangle size={32} className="mx-auto mb-2" />
                                                <div className="font-bold">Connection Error</div>
                                                <div className="text-sm mt-1 opacity-80">{error}</div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-20 h-20 rounded-full bg-[#1a1d1f] flex items-center justify-center mb-6">
                                                    <Activity size={32} className="text-[#6f767e]" />
                                                </div>
                                                <p className="text-[#6f767e] font-medium max-w-[200px]">
                                                    Run a simulation to view the risk assessment gauge.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </main>
                    </>
                ) : activeTab === 'settings' ? (
                    <SettingsPage />
                ) : (
                    <div className="glass-panel p-20 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 rounded-full bg-[#1a1d1f] flex items-center justify-center mb-6">
                            <Settings size={48} className="text-[#c3fb5c]" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Work In Progress</h2>
                        <p className="text-[#6f767e] max-w-md">
                            The {activeTab} module is currently under development. Check back later for updates.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

const StatCard = ({ icon, label, value, trend, isNegative }) => (
    <div className="glass-panel p-6 flex flex-col hover:-translate-y-1 transition-transform">
        <div className="flex justify-between items-start mb-4">
            <div className="text-[#6f767e] p-2 bg-[#111315] rounded-lg">{icon}</div>
        </div>
        <div>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#6f767e]">{label}</span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isNegative ? 'bg-[#ff6e6e]/20 text-[#ff6e6e]' : 'bg-[#c3fb5c]/20 text-[#c3fb5c]'
                    }`}>
                    {trend}
                </span>
            </div>
        </div>
    </div>
);

export default App;
