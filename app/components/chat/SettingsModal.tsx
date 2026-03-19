type SettingsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    uiScale: number;
    onScaleChange: (scale: number) => void;
};

export function SettingsModal({
    isOpen,
    onClose,
    uiScale,
    onScaleChange,
}: SettingsModalProps) {
    if (!isOpen) return null;

    const scales = [
        { label: "Small", value: 0.85, icon: "S" },
        { label: "Normal", value: 1.0, icon: "M" },
        { label: "Large", value: 1.15, icon: "L" },
        { label: "Elite", value: 1.3, icon: "XL" },
    ];

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200">
                <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <div>
                        <h2 className="font-black text-zinc-900 text-xl uppercase tracking-tighter">Settings</h2>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Personalize your Workspace</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 transition-all active:scale-90"
                    >
                        X
                    </button>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                    {/* UI Scale */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-[11px] font-black text-zinc-400 tracking-wider uppercase">Interface Scale</label>
                            <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                                {(uiScale * 100).toFixed(0)}%
                            </span>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {scales.map((s) => (
                                <button
                                    key={s.value}
                                    onClick={() => onScaleChange(s.value)}
                                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all group ${uiScale === s.value
                                        ? "border-indigo-600 bg-indigo-50 shadow-inner"
                                        : "border-zinc-50 bg-zinc-50/50 hover:border-zinc-100"
                                        }`}
                                >
                                    <span className={`text-sm font-black transition-transform group-hover:scale-110 ${uiScale === s.value ? "text-indigo-600" : "text-zinc-400"
                                        }`}>
                                        {s.icon}
                                    </span>
                                    <span className={`text-[8px] font-bold uppercase tracking-tighter ${uiScale === s.value ? "text-indigo-700" : "text-zinc-400"
                                        }`}>
                                        {s.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Scale Preview</p>
                        <p className="text-xs font-medium leading-relaxed">
                            This adjusts the size of text and layout for better visibility.
                        </p>
                    </section>
                </div>

                <div className="p-6 bg-zinc-50 border-t border-zinc-100">
                    <button
                        onClick={onClose}
                        className="w-full bg-zinc-900 text-white rounded-2xl py-4 text-sm font-black shadow-lg hover:bg-black transition-all active:scale-[0.98] uppercase tracking-widest"
                    >
                        Save & Close
                    </button>
                </div>
            </div>
        </div>
    );
}

