import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Diamond, Check, ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react';

interface DiamondShopProps {
    profile: UserProfile;
    onPurchase: (type: 'color' | 'accessory', itemId: string, cost: number) => void;
    onSelect: (type: 'color' | 'accessory', itemId: string) => void;
    onClose: () => void;
}

const COLORS = [
    { id: 'bg-sky-400', name: 'Original Blue', cost: 0 },
    { id: 'bg-pink-400', name: 'Soft Pink', cost: 20 },
    { id: 'bg-emerald-400', name: 'Fresh Green', cost: 20 },
    { id: 'bg-amber-400', name: 'Sunny Gold', cost: 20 },
    { id: 'bg-indigo-400', name: 'Magic Purple', cost: 20 },
    { id: 'bg-rose-500', name: 'Strong Red', cost: 40 },
    { id: 'bg-violet-600', name: 'Deep Violet', cost: 40 },
    { id: 'bg-slate-800', name: 'Midnight', cost: 50 },
    { id: 'bg-orange-500', name: 'Fire Orange', cost: 30 },
];

const ACCESSORIES = [
    { id: '🦸', name: 'Hero', cost: 0 },
    { id: '👑', name: 'Crown', cost: 50 },
    { id: '🎩', name: 'Top Hat', cost: 30 },
    { id: '🍦', name: 'Ice Cream', cost: 20 },
    { id: '🐱', name: 'Cat', cost: 40 },
    { id: '🐲', name: 'Dragon', cost: 100 },
    { id: '🧚', name: 'Fairy', cost: 70 },
    { id: '🦄', name: 'Unicorn', cost: 80 },
    { id: '🚀', name: 'Rocket', cost: 60 },
    { id: '🐼', name: 'Panda', cost: 45 },
    { id: '🦊', name: 'Fox', cost: 45 },
    { id: '🦁', name: 'Lion', cost: 60 },
];

const DiamondShop: React.FC<DiamondShopProps> = ({ profile, onPurchase, onSelect, onClose }) => {
    const [tab, setTab] = useState<'accessories' | 'colors'>('accessories');

    const isPurchased = (type: 'color' | 'accessory', id: string) => {
        return profile.purchasedItems[`${type}-${id}`] === true;
    };

    const isSelected = (type: 'color' | 'accessory', id: string) => {
        return profile.avatar[type] === id;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col" dir="ltr">
            {/* Shop Header */}
            <div className="bg-white px-4 py-8 shadow-sm border-b-4 border-yellow-100 relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 left-4 p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="flex flex-col items-center">
                    <div className="bg-yellow-400 p-3 rounded-2xl shadow-lg mb-4 animate-bounce">
                        <ShoppingBag className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
                        Diamond Shop <Sparkles className="text-yellow-500" size={20} />
                    </h1>

                    {/* Gem Counter */}
                    <div className="mt-4 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full shadow-inner">
                        <Diamond className="text-yellow-400 fill-yellow-400" size={20} />
                        <span className="text-xl font-black">{profile.coins}</span>
                    </div>
                </div>
            </div>

            {/* Shop Navigation */}
            <div className="flex p-2 gap-2 bg-white mx-4 mt-6 rounded-2xl border-2 border-slate-100">
                <button
                    onClick={() => setTab('accessories')}
                    className={`flex-1 py-3 font-bold rounded-xl transition-all ${tab === 'accessories' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                    Accessories
                </button>
                <button
                    onClick={() => setTab('colors')}
                    className={`flex-1 py-3 font-bold rounded-xl transition-all ${tab === 'colors' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                    Colors
                </button>
            </div>

            {/* Current Avatar Preview */}
            <div className="flex flex-col items-center justify-center p-8">
                <div className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">My Character</div>
                <div className={`${profile.avatar.color} w-24 h-24 rounded-full flex items-center justify-center text-6xl shadow-2xl border-4 border-white ring-8 ring-sky-50 animate-pulse`}>
                    {profile.avatar.accessory}
                </div>
            </div>

            {/* Items Grid */}
            <div className="flex-1 overflow-y-auto px-4 pb-12">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {(tab === 'accessories' ? ACCESSORIES : COLORS).map((item) => {
                        const purchased = isPurchased(tab === 'accessories' ? 'accessory' : 'color', item.id);
                        const selected = isSelected(tab === 'accessories' ? 'accessory' : 'color', item.id);
                        const canAfford = profile.coins >= item.cost;

                        return (
                            <button
                                key={item.id}
                                disabled={!purchased && !canAfford}
                                onClick={() => purchased ? onSelect(tab === 'accessories' ? 'accessory' : 'color', item.id) : onPurchase(tab === 'accessories' ? 'accessory' : 'color', item.id, item.cost)}
                                className={`group relative bg-white p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 shadow-sm ${selected
                                        ? 'border-sky-500 bg-sky-50/30'
                                        : purchased
                                            ? 'border-emerald-200 hover:border-emerald-400'
                                            : !canAfford
                                                ? 'opacity-60 grayscale border-slate-100 cursor-not-allowed'
                                                : 'border-slate-100 hover:border-yellow-300'
                                    }`}
                            >
                                {selected && (
                                    <div className="absolute top-2 right-2 bg-sky-500 text-white p-1 rounded-full shadow-sm">
                                        <Check size={12} />
                                    </div>
                                )}

                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${tab === 'colors' ? item.id : 'bg-slate-50'}`}>
                                    {tab === 'accessories' && <span className="text-4xl">{item.id}</span>}
                                </div>

                                <span className="font-bold text-slate-700 text-sm">{item.name}</span>

                                {!purchased ? (
                                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full font-black text-sm ${canAfford ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-400'}`}>
                                        <Diamond size={14} className={canAfford ? 'fill-yellow-600' : 'fill-slate-300'} />
                                        {item.cost}
                                    </div>
                                ) : (
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Owned</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DiamondShop;
