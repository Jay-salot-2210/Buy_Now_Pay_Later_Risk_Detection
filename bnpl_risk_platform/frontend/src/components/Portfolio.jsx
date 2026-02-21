import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';

const Portfolio = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const transactions = [
        { id: 'TXN-001', amount: 15000, fico: 745, status: 'Approved', profit: 245.50, date: '2024-01-15' },
        { id: 'TXN-002', amount: 8500, fico: 680, status: 'Approved', profit: 156.30, date: '2024-01-14' },
        { id: 'TXN-003', amount: 22000, fico: 590, status: 'Rejected', profit: 0, date: '2024-01-14' },
        { id: 'TXN-004', amount: 12000, fico: 720, status: 'Approved', profit: 198.00, date: '2024-01-13' },
        { id: 'TXN-005', amount: 6000, fico: 650, status: 'Approved', profit: 102.40, date: '2024-01-13' },
        { id: 'TXN-006', amount: 18500, fico: 540, status: 'Rejected', profit: 0, date: '2024-01-12' },
        { id: 'TXN-007', amount: 9500, fico: 695, status: 'Approved', profit: 167.20, date: '2024-01-12' },
        { id: 'TXN-008', amount: 14200, fico: 760, status: 'Approved', profit: 223.10, date: '2024-01-11' },
        { id: 'TXN-009', amount: 25000, fico: 580, status: 'Rejected', profit: 0, date: '2024-01-11' },
        { id: 'TXN-010', amount: 11000, fico: 710, status: 'Approved', profit: 189.50, date: '2024-01-10' },
    ];

    const filteredTransactions = transactions.filter(txn => {
        const matchesSearch = txn.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || txn.status.toLowerCase() === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6f767e]" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Transaction ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-12"
                    />
                </div>

                <div className="flex gap-3">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="input-field w-40"
                    >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <button className="flex items-center gap-2 bg-[#1a1d1f] px-4 py-3 rounded-xl border border-[#272b30] hover:border-[#c3fb5c] transition-colors">
                        <Download size={20} />
                        <span className="hidden md:inline font-semibold">Export</span>
                    </button>
                </div>
            </div>

            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#111315] border-b border-[#272b30]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6f767e] uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6f767e] uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6f767e] uppercase tracking-wider">FICO Score</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6f767e] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6f767e] uppercase tracking-wider">Profit</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-[#6f767e] uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#272b30]">
                            {filteredTransactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-[#111315] transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold">
                                        {txn.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                                        ${txn.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${txn.fico >= 700 ? 'bg-[#c3fb5c]/20 text-[#c3fb5c]' :
                                                txn.fico >= 650 ? 'bg-[#fbbf24]/20 text-[#fbbf24]' :
                                                    'bg-[#ff6e6e]/20 text-[#ff6e6e]'
                                            }`}>
                                            {txn.fico}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${txn.status === 'Approved' ? 'bg-[#c3fb5c]/20 text-[#c3fb5c]' : 'bg-[#ff6e6e]/20 text-[#ff6e6e]'
                                            }`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#c3fb5c]">
                                        {txn.profit > 0 ? `+$${txn.profit.toFixed(2)}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-[#6f767e]">
                                        {txn.date}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredTransactions.length === 0 && (
                    <div className="text-center py-12 text-[#6f767e]">
                        <Filter size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="font-semibold">No transactions found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Portfolio;
