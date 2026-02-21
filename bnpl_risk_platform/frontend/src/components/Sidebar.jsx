import React from 'react';
import { LayoutGrid, PieChart, CreditCard, Users, Settings, Bell, X } from 'lucide-react';

const Sidebar = ({ activeTab, onNavigate, isOpen, onClose }) => {
    return (
        <>
            {/* Overlay for mobile/when open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <div className={`fixed left-0 top-0 bottom-0 w-[280px] bg-[#1a1d1f] border-r border-[#272b30] p-6 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex items-center justify-between mb-12 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c3fb5c] flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">RiskOS</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg lg:hidden text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-8">
                    <div className="text-xs font-bold text-[#6f767e] mb-4 uppercase tracking-wider px-2">Menu</div>
                    <nav className="space-y-1">
                        <NavItem
                            icon={<LayoutGrid size={20} />}
                            label="Overview"
                            active={activeTab === 'overview'}
                            onClick={() => { onNavigate('overview'); onClose(); }}
                        />
                        <NavItem
                            icon={<Settings size={20} />}
                            label="Settings"
                            active={activeTab === 'settings'}
                            onClick={() => { onNavigate('settings'); onClose(); }}
                        />
                    </nav>
                </div>

                <div>
                    <div className="text-xs font-bold text-[#6f767e] mb-4 uppercase tracking-wider px-2">General</div>
                    <nav className="space-y-1">

                    </nav>
                </div>

                <div className="mt-auto pt-6 border-t border-[#272b30]">
                    <div className="flex items-center gap-3 px-2">
                        <img src="https://ui-avatars.com/api/?name=Jay+Salot&background=c3fb5c&color=000" className="w-10 h-10 rounded-full" alt="User" />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-white truncate">Jay Salot</div>
                            <div className="text-xs text-[#6f767e] truncate">Lead Risk Officer</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const NavItem = ({ icon, label, active, badge, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all group ${active
            ? 'bg-[#c3fb5c] text-black'
            : 'text-[#6f767e] hover:bg-[#202326] hover:text-white'
            }`}>
        <div className="flex items-center gap-3">
            {icon}
            <span className="text-sm font-semibold">{label}</span>
        </div>
        {badge && (
            <span className="bg-[#ff6e6e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
        )}
    </button>
);

export default Sidebar;
