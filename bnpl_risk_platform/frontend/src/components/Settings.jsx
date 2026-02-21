import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Shield, Sliders } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
    const [threshold, setThreshold] = useState(0.15);
    const [minFico, setMinFico] = useState(600);
    const [maxDti, setMaxDti] = useState(40);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/settings');
                setThreshold(response.data.threshold);
                setMinFico(response.data.min_fico);
                setMaxDti(response.data.max_dti);
            } catch (err) {
                console.error('Failed to fetch settings:', err);
                const localSettings = localStorage.getItem('riskSettings');
                if (localSettings) {
                    const parsed = JSON.parse(localSettings);
                    setThreshold(parsed.threshold || 0.15);
                    setMinFico(parsed.min_fico || 600);
                    setMaxDti(parsed.max_dti || 40);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaved(true);
        try {
            await axios.post('http://127.0.0.1:8000/settings', {
                threshold,
                min_fico: minFico,
                max_dti: maxDti
            });

            localStorage.setItem('riskSettings', JSON.stringify({
                threshold,
                min_fico: minFico,
                max_dti: maxDti
            }));

            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error('Failed to save settings:', err);
            setSaved(false);
        }
    };

    const handleReset = () => {
        setThreshold(0.15);
        setMinFico(600);
        setMaxDti(40);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="animate-spin text-[#c3fb5c]" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="glass-panel p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="text-[#c3fb5c]" size={28} />
                    <h2 className="text-2xl font-bold">Risk Model Configuration</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[#6f767e] mb-3 uppercase tracking-wide">
                            Default Probability Threshold
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0.05"
                                max="0.30"
                                step="0.01"
                                value={threshold}
                                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                                className="flex-1 h-2 bg-[#1a1d1f] rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, #c3fb5c 0%, #c3fb5c ${(threshold - 0.05) / 0.25 * 100}%, #1a1d1f ${(threshold - 0.05) / 0.25 * 100}%, #1a1d1f 100%)`
                                }}
                            />
                            <span className="text-2xl font-bold text-[#c3fb5c] w-20 text-right">
                                {(threshold * 100).toFixed(1)}%
                            </span>
                        </div>
                        <p className="text-xs text-[#6f767e] mt-2">
                            Applications with default probability above this threshold will be rejected
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#6f767e] mb-3 uppercase tracking-wide">
                            Minimum FICO Score
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="550"
                                max="750"
                                step="5"
                                value={minFico}
                                onChange={(e) => setMinFico(parseInt(e.target.value))}
                                className="flex-1 h-2 bg-[#1a1d1f] rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-2xl font-bold text-[#c3fb5c] w-20 text-right">
                                {minFico}
                            </span>
                        </div>
                        <p className="text-xs text-[#6f767e] mt-2">
                            Applicants with FICO score below this will be auto-rejected
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#6f767e] mb-3 uppercase tracking-wide">
                            Maximum DTI Ratio
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="20"
                                max="60"
                                step="1"
                                value={maxDti}
                                onChange={(e) => setMaxDti(parseInt(e.target.value))}
                                className="flex-1 h-2 bg-[#1a1d1f] rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-2xl font-bold text-[#c3fb5c] w-20 text-right">
                                {maxDti}%
                            </span>
                        </div>
                        <p className="text-xs text-[#6f767e] mt-2">
                            Applications with Debt-to-Income ratio above this will be rejected
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleSave}
                    className="btn-primary flex items-center justify-center gap-2"
                >
                    {saved ? (
                        <>
                            <RefreshCw size={20} className="animate-spin" />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Save Changes
                        </>
                    )}
                </button>

                <button
                    onClick={handleReset}
                    className="bg-[#1a1d1f] text-white font-bold py-4 px-8 rounded-2xl border border-[#272b30] hover:border-[#c3fb5c] transition-colors"
                >
                    Reset to Defaults
                </button>
            </div>
        </div>
    );
};

export default Settings;
