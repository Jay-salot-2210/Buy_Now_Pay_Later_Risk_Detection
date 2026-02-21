import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const RiskGauge = ({ probability, decision, limit, profit }) => {
    const score = Math.round((1 - probability) * 850);

    // Risk Thresholds aligned with model decision threshold (15%)
    // Low Risk: 0-15% (Green)
    // Medium Risk: 15-30% (Yellow)
    // High Risk: 30-100% (Red)
    const data = [
        { name: 'Safe', value: 15, color: '#c3fb5c' },      // 0-15%
        { name: 'Warning', value: 15, color: '#fbbf24' },   // 15-30%
        { name: 'Risky', value: 70, color: '#ff6e6e' },     // 30-100%
    ];

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel p-8 h-full flex flex-col relative"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-white">Score Analysis</h3>
                <p className="text-sm text-muted">TransUnion • Experian</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] relative">
                {/* Gauge Chart */}
                <div className="relative w-full h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="100%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius="70%"
                                outerRadius="100%"
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={10}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Needle */}
                    <div className="absolute bottom-0 left-1/2 w-0 h-0">
                        <motion.div
                            className="w-[140px] h-[4px] bg-[#fff] origin-left absolute bottom-0 left-0 rounded-full shadow-lg"
                            initial={{ rotate: 180 }}
                            animate={{ rotate: 180 + (probability * 180) }}
                            transition={{ type: "spring", stiffness: 60, damping: 20 }}
                            style={{ transformOrigin: "0 50%" }}
                        />
                        <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-white" />
                    </div>

                    {/* Center Label */}
                    <div className="absolute bottom-[-60px] left-0 w-full text-center">
                        <div className="text-5xl font-bold text-white">{score}</div>
                        <div className="text-sm text-muted mt-1 uppercase tracking-widest font-bold text-[10px]">Credit Score</div>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mt-16">
                <div className="bg-[#111315] p-4 rounded-2xl border border-[#272b30]">
                    <div className="text-[10px] uppercase font-bold text-muted mb-1">Approved Limit</div>
                    <div className="text-xl font-bold text-white">${limit.toLocaleString()}</div>
                </div>
                <div className="bg-[#111315] p-4 rounded-2xl border border-[#272b30]">
                    <div className="text-[10px] uppercase font-bold text-muted mb-1">Exp. Profit</div>
                    <div className="text-xl font-bold text-[#c3fb5c]">+${profit.toFixed(2)}</div>
                </div>
            </div>

            <div className={`mt-4 py-3 text-center rounded-xl font-bold text-sm ${decision === 'APPROVE' ? 'bg-[#c3fb5c] text-black' : 'bg-[#ff6e6e] text-white'
                }`}>
                {decision === 'APPROVE' ? 'APPLICATION APPROVED' : 'APPLICATION REJECTED'}
            </div>

        </motion.div>
    );
};

export default RiskGauge;
