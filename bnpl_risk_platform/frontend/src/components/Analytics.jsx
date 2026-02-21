import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, AlertCircle } from 'lucide-react';

const Analytics = () => {
    const riskDistribution = [
        { range: '300-500', count: 245, color: '#ff6e6e' },
        { range: '500-600', count: 892, color: '#ff9d76' },
        { range: '600-650', count: 1456, color: '#fbbf24' },
        { range: '650-700', count: 2103, color: '#a5d945' },
        { range: '700-750', count: 2987, color: '#c3fb5c' },
        { range: '750-850', count: 1842, color: '#8fd93c' },
    ];

    const approvalTrend = [
        { month: 'Jan', approved: 4200, rejected: 1100 },
        { month: 'Feb', approved: 4500, rejected: 980 },
        { month: 'Mar', approved: 4800, rejected: 890 },
        { month: 'Apr', approved: 5100, rejected: 950 },
        { month: 'May', approved: 5400, rejected: 870 },
        { month: 'Jun', approved: 5700, rejected: 920 },
    ];

    const modelPerformance = [
        { name: 'Approved & Paid', value: 7843, color: '#c3fb5c' },
        { name: 'Approved & Default', value: 456, color: '#ff6e6e' },
        { name: 'Rejected (Correct)', value: 2103, color: '#fbbf24' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <MetricCard icon={<Users />} label="Total Applications" value="10,402" change="+8.2%" />
                <MetricCard icon={<TrendingUp />} label="Model Accuracy" value="94.3%" change="+1.1%" />
                <MetricCard icon={<DollarSign />} label="Total Profit" value="$2.4M" change="+15.3%" />
                <MetricCard icon={<AlertCircle />} label="False Positives" value="2.1%" change="-0.5%" isNegative />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold mb-6">Credit Score Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={riskDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#272b30" />
                            <XAxis dataKey="range" stroke="#6f767e" />
                            <YAxis stroke="#6f767e" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1d1f', border: '1px solid #272b30', borderRadius: '12px' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                {riskDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold mb-6">Approval Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={approvalTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#272b30" />
                            <XAxis dataKey="month" stroke="#6f767e" />
                            <YAxis stroke="#6f767e" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1d1f', border: '1px solid #272b30', borderRadius: '12px' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="approved" stroke="#c3fb5c" strokeWidth={3} dot={{ fill: '#c3fb5c', r: 5 }} />
                            <Line type="monotone" dataKey="rejected" stroke="#ff6e6e" strokeWidth={3} dot={{ fill: '#ff6e6e', r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-panel p-6">
                <h3 className="text-xl font-bold mb-6">Model Performance Overview</h3>
                <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={modelPerformance}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={140}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                labelLine={true}
                            >
                                {modelPerformance.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1d1f', border: '1px solid #272b30', borderRadius: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ icon, label, value, change, isNegative }) => (
    <div className="glass-panel p-6 hover:-translate-y-1 transition-transform">
        <div className="flex items-center gap-3 mb-3">
            <div className="text-[#c3fb5c] p-2 bg-[#111315] rounded-lg">{icon}</div>
            <span className="text-sm font-semibold text-[#6f767e]">{label}</span>
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <span className={`text-xs font-bold px-2 py-1 rounded ${isNegative ? 'bg-[#ff6e6e]/20 text-[#ff6e6e]' : 'bg-[#c3fb5c]/20 text-[#c3fb5c]'}`}>
            {change}
        </span>
    </div>
);

export default Analytics;
