import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Diamond, Check, ArrowLeft, ShoppingBag, Sparkles, Palette, Crown, Image as ImageIcon, Zap } from 'lucide-react';

interface DiamondShopProps {
    profile: UserProfile;
    onPurchase: (type: 'color' | 'accessory' | 'background' | 'aura', itemId: string, cost: number) => void;
    onSelect: (type: 'color' | 'accessory' | 'background' | 'aura', itemId: string) => void;
    onClose: () => void;
}

const COLORS = [
    { id: 'bg-sky-400', name: 'Original Blue', cost: 0 },
    { id: 'bg-pink-400', name: 'Soft Pink', cost: 350 },
    { id: 'bg-emerald-400', name: 'Fresh Green', cost: 500 },
    { id: 'bg-amber-400', name: 'Sunny Gold', cost: 750 },
    { id: 'bg-indigo-400', name: 'Magic Purple', cost: 1000 },
    { id: 'bg-rose-500', name: 'Strong Red', cost: 1500 },
    { id: 'bg-violet-600', name: 'Deep Violet', cost: 2000 },
    { id: 'bg-slate-800', name: 'Midnight', cost: 3000 },
    { id: 'bg-orange-500', name: 'Fire Orange', cost: 1200 },
    { id: 'bg-zinc-900', name: 'Dark Void', cost: 5000 },
    { id: 'bg-lime-400', name: 'Neon Lime', cost: 1800 },
    { id: 'bg-fuchsia-500', name: 'Fuchsia', cost: 2200 },
];

const ACCESSORIES = [
    { id: '🦸', name: 'Hero', cost: 0 },
    { id: '👑', name: 'Crown', cost: 2500 },
    { id: '🎩', name: 'Top Hat', cost: 1200 },
    { id: '🍦', name: 'Ice Cream', cost: 500 },
    { id: '🐱', name: 'Cat', cost: 1800 },
    { id: '🐲', name: 'Dragon', cost: 10000 },
    { id: '🧚', name: 'Fairy', cost: 5500 },
    { id: '🦄', name: 'Unicorn', cost: 7500 },
    { id: '🚀', name: 'Rocket', cost: 4500 },
    { id: '🐼', name: 'Panda', cost: 2200 },
    { id: '🦊', name: 'Fox', cost: 2200 },
    { id: '🦁', name: 'Lion', cost: 3800 },
    { id: '👽', name: 'Alien', cost: 6000 },
    { id: '🤖', name: 'Robot', cost: 6000 },
    { id: '💎', name: 'Diamond', cost: 15000 },
    { id: '🔥', name: 'Fire', cost: 8000 },
];

const BACKGROUNDS = [
    { id: 'bg-slate-50', name: 'Clean White', cost: 0 },
    { id: 'bg-gradient-to-tr from-yellow-200 to-orange-200', name: 'Sunrise', cost: 2000 },
    { id: 'bg-gradient-to-tr from-sky-200 to-indigo-200', name: 'Ocean', cost: 2500 },
    { id: 'bg-gradient-to-tr from-emerald-100 to-teal-200', name: 'Forest', cost: 3000 },
    { id: 'bg-gradient-to-tr from-rose-200 to-purple-200', name: 'Cosmic', cost: 4500 },
    { id: 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900', name: 'Deep Space', cost: 12000 },
    { id: 'bg-[radial-gradient(circle,at_center,_var(--tw-gradient-stops))] from-yellow-300 via-orange-400 to-red-500', name: 'Supernova', cost: 25000 },
];

const AURAS = [
    { id: 'none', name: 'None', cost: 0 },
    { id: 'ring-4 ring-sky-300', name: 'Chill Glow', cost: 3500 },
    { id: 'ring-4 ring-yellow-400', name: 'Gold Shine', cost: 7000 },
    { id: 'ring-4 ring-purple-500 ring-offset-4', name: 'Mystic Halo', cost: 12000 },
    { id: 'ring-4 ring-rose-500 animate-pulse', name: 'Heartbeat', cost: 18000 },
    { id: 'ring-4 ring-teal-400 ring-offset-2 shadow-[0_0_25px_rgba(45,212,191,0.8)]', name: 'Cyber Pulse', cost: 40000 },
    { id: 'ring-4 ring-white animate-spin ring-offset-2', name: 'Time Vortex', cost: 75000 },
];

type TabType = 'accessories' | 'colors' | 'backgrounds' | 'auras';

const DiamondShop: React.FC<DiamondShopProps> = ({ profile, onPurchase, onSelect, onClose }) => {
    const [tab, setTab] = useState<TabType>('accessories');

    const isPurchased = (type: TabType, id: string) => {
        const internalId = type === 'accessories' ? 'accessory' : type === 'colors' ? 'color' : type === 'backgrounds' ? 'background' : 'aura';
        return profile.purchasedItems[`${internalId}-${id}`] === true;
    };

    const isSelected = (type: TabType, id: string) => {
        const internalId = type === 'accessories' ? 'accessory' : type === 'colors' ? 'color' : type === 'backgrounds' ? 'background' : 'aura';
        return profile.avatar[internalId] === id;
    };

    const getItems = () => {
        switch (tab) {
            case 'accessories': return ACCESSORIES;
            case 'colors': return COLORS;
            case 'backgrounds': return BACKGROUNDS;
            case 'auras': return AURAS;
        }
    };

    const getInternalType = (t: TabType): 'color' | 'accessory' | 'background' | 'aura' => {
        if (t === 'accessories') return 'accessory';
        if (t === 'colors') return 'color';
        if (t === 'backgrounds') return 'background';
        return 'aura';
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col" dir="ltr">
            {/* Shop Header */}
            <div className="bg-white px-4 py-6 shadow-sm border-b-4 border-yellow-100 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 p-3 rounded-2xl shadow-lg mb-2 animate-bounce">
                        <ShoppingBag className="text-white" size={28} />
                    </div>
                    <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
                        Luxury Boutique <Sparkles className="text-yellow-500" size={18} />
                    </h1>

                    {/* Gem Counter */}
                    <div className="mt-2 flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full shadow-xl">
                        <Diamond className="text-yellow-400 fill-yellow-400" size={18} />
                        <span className="text-lg font-black">{profile.coins}</span>
                    </div>
                </div>
            </div>

            {/* Shop Navigation - Tabs */}
            <div className="flex p-1.5 gap-1.5 bg-white mx-4 mt-6 rounded-2xl border-2 border-slate-100 overflow-x-auto no-scrollbar">
                {[
                    { id: 'accessories', icon: Crown, label: 'Items' },
                    { id: 'colors', icon: Palette, label: 'Skin' },
                    { id: 'backgrounds', icon: ImageIcon, label: 'Stage' },
                    { id: 'auras', icon: Zap, label: 'Aura' }
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id as TabType)}
                        className={`flex items-center justify-center gap-2 flex-1 min-w-[90px] py-2.5 font-bold rounded-xl transition-all ${tab === t.id ? 'bg-sky-500 text-white shadow-md scale-105 z-10' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <t.icon size={16} />
                        <span className="text-sm">{t.label}</span>
                    </button>
                ))}
            </div>

            {/* Current Avatar Preview */}
            <div className={`mt-8 mb-4 mx-auto p-12 rounded-[3rem] transition-all duration-500 ${profile.avatar.background || 'bg-slate-50'} shadow-inner border-2 border-white/50 relative overflow-hidden`}>
                <div className="text-[10px] font-black text-slate-400 absolute top-4 left-0 w-full text-center uppercase tracking-[0.2em] opacity-50">Profile Preview</div>

                {/* Aura effect if any */}
                <div className={`relative ${profile.avatar.aura && profile.avatar.aura !== 'none' ? profile.avatar.aura : ''} rounded-full transition-all duration-500`}>
                    <div className={`${profile.avatar.color} w-24 h-24 rounded-full flex items-center justify-center text-6xl shadow-2xl border-4 border-white transition-all`}>
                        {profile.avatar.accessory}
                    </div>
                </div>
            </div>

            {/* Items Grid */}
            <div className="flex-1 overflow-y-auto px-4 pb-12 pt-2">
                <div className="grid grid-cols-2 gap-4">
                    {getItems().map((item) => {
                        const purchased = isPurchased(tab, item.id);
                        const selected = isSelected(tab, item.id);
                        const canAfford = profile.coins >= item.cost;

                        return (
                            <button
                                key={item.id}
                                disabled={!purchased && !canAfford}
                                onClick={() => purchased ? onSelect(getInternalType(tab), item.id) : onPurchase(getInternalType(tab), item.id, item.cost)}
                                className={`group relative bg-white p-4 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 shadow-sm ${selected
                                    ? 'border-sky-500 bg-sky-50/30 ring-4 ring-sky-100'
                                    : purchased
                                        ? 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/10'
                                        : 'border-slate-100 hover:border-yellow-300 hover:shadow-md'
                                    }`}
                            >
                                {selected && (
                                    <div className="absolute top-3 right-3 bg-sky-500 text-white p-1 rounded-full shadow-sm z-20">
                                        <Check size={12} />
                                    </div>
                                )}

                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner 
                                    ${tab === 'colors' ? item.id : tab === 'backgrounds' ? item.id : 'bg-slate-50'}
                                    ${tab === 'auras' ? 'relative' : ''}
                                `}>
                                    {tab === 'accessories' && <span className="text-4xl">{item.id}</span>}
                                    {tab === 'auras' && (
                                        <div className={`w-12 h-12 rounded-full bg-slate-200 ${item.id !== 'none' ? item.id : ''}`} />
                                    )}
                                </div>

                                <div className="flex flex-col items-center">
                                    <span className="font-bold text-slate-800 text-sm">{item.name}</span>

                                    {!purchased ? (
                                        <div className={`mt-1 flex items-center gap-1 px-3 py-1 rounded-full font-black text-[12px] ${canAfford ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-50 text-slate-400'}`}>
                                            <Diamond size={12} className={canAfford ? 'fill-yellow-600 font-bold' : 'fill-slate-300'} />
                                            {item.cost.toLocaleString()}
                                        </div>
                                    ) : (
                                        <span className="mt-1 text-[10px] font-black text-emerald-600 uppercase tracking-wider">Unlocked</span>
                                    )}
                                </div>

                                {!purchased && !canAfford && (
                                    <div className="absolute top-2 left-2">
                                        <div className="bg-slate-100 text-slate-400 p-1 rounded-full">
                                            <Check size={10} className="opacity-0" />
                                        </div>
                                    </div>
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
