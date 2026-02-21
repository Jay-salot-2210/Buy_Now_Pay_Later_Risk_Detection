import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TransactionForm = ({ onSimulate, loading }) => {
    const [formData, setFormData] = useState({
        annual_inc: 85000,
        loan_amnt: 12000,
        fico_range_low: 720,
        dti: 12.5,
        int_rate: 10.5,
        grade: 'A',
        term_months: 36,
        purpose: 'credit_card',
        home_ownership: 'MORTGAGE',
        verification_status: 'Source Verified',
        revol_util: 30.0,
        total_acc: 25,
        open_acc: 12,
        pub_rec: 0
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['annual_inc', 'loan_amnt', 'fico_range_low', 'dti', 'int_rate', 'revol_util', 'total_acc', 'open_acc'].includes(name)
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Calculate Installment (PMT)
        const P = Number(formData.loan_amnt);
        const r = Number(formData.int_rate) / 100 / 12;
        const n = Number(formData.term_months);

        let installment = 0;
        if (r === 0) {
            installment = P / n;
        } else {
            installment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        onSimulate({
            ...formData,
            installment: parseFloat(installment.toFixed(2))
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8"
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-xl font-bold text-white">Loan Simulator</h2>
                    <p className="text-muted text-sm mt-1">Enter applicant details to predict default probability.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <FormGroup label="Annual Income ($)">
                    <input
                        type="number"
                        name="annual_inc"
                        value={formData.annual_inc}
                        onChange={handleChange}
                        className="input-field"
                        min="0"
                        max="10000000"
                        required
                    />
                </FormGroup>

                <FormGroup label="Loan Amount ($)">
                    <input
                        type="number"
                        name="loan_amnt"
                        value={formData.loan_amnt}
                        onChange={handleChange}
                        className="input-field"
                        min="500"
                        max="50000"
                        required
                    />
                </FormGroup>

                <div className="md:col-span-2">
                    <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold text-muted uppercase">FICO Score</label>
                        <span className="text-xs font-bold text-[#c3fb5c]">{formData.fico_range_low}</span>
                    </div>
                    <input
                        type="range"
                        name="fico_range_low"
                        min="300"
                        max="850"
                        value={formData.fico_range_low}
                        onChange={handleChange}
                        className="w-full h-2 bg-[#272b30] rounded-lg appearance-none cursor-pointer accent-[#c3fb5c]"
                    />
                    <div className="flex justify-between mt-1 text-[10px] text-muted">
                        <span>Poor (300)</span>
                        <span>Excellent (850)</span>
                    </div>
                </div>

                <FormGroup label="DTI Ratio (%)">
                    <input
                        type="number"
                        name="dti"
                        step="0.1"
                        value={formData.dti}
                        onChange={handleChange}
                        className="input-field"
                        min="0"
                        max="100"
                        required
                    />
                </FormGroup>

                <FormGroup label="Grade">
                    <select name="grade" value={formData.grade} onChange={handleChange} className="input-field">
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </FormGroup>

                <FormGroup label="Term">
                    <select name="term_months" value={formData.term_months} onChange={handleChange} className="input-field">
                        <option value={36}>36 Months</option>
                        <option value={60}>60 Months</option>
                    </select>
                </FormGroup>

                <FormGroup label="Verification">
                    <select name="verification_status" value={formData.verification_status} onChange={handleChange} className="input-field">
                        {['Verified', 'Source Verified', 'Not Verified'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </FormGroup>

                <div className="md:col-span-2">
                    <FormGroup label="Purpose">
                        <select name="purpose" value={formData.purpose} onChange={handleChange} className="input-field">
                            {['debt_consolidation', 'credit_card', 'home_improvement', 'major_purchase', 'small_business', 'medical', 'car', 'vacation', 'moving', 'house', 'wedding', 'renewable_energy', 'educational'].map(p => (
                                <option key={p} value={p}>{p.replace('_', ' ').toUpperCase()}</option>
                            ))}
                        </select>
                    </FormGroup>
                </div>

                <div className="md:col-span-2 mt-2">
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Analyzing...' : 'Run Prediction'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

const FormGroup = ({ label, children }) => (
    <label className="block">
        <span className="text-xs font-bold text-muted uppercase mb-2 block">{label}</span>
        {children}
    </label>
);

export default TransactionForm;
