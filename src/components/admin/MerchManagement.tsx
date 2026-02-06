'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { MerchForm } from './MerchForm';
import { Star, Trash2, Loader2 } from 'lucide-react';

export function MerchManagement() {
    const [merch, setMerch] = useState<any[]>([]);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadMerch = () => {
        const q = query(collection(db, 'merch'), orderBy('name'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const merchData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMerch(merchData);
        });
        return () => unsubscribe();
    };

    useEffect(() => {
        const unsubscribe = loadMerch();
        return () => unsubscribe();
    }, []);

    const deleteMerch = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        setDeletingId(id);
        try {
            await deleteDoc(doc(db, 'merch', id));
        } catch (error) {
            console.error("Error removing document: ", error);
            alert("Failed to delete merchandise. See console for details.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
                <Star className="text-vibe-pink" />
                <h2 className="text-xl font-black uppercase tracking-widest italic">Merch Manager</h2>
            </div>
            <MerchForm onMerchAdded={loadMerch} />
            <div className="mt-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4 italic">Current Inventory</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {merch.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-[10px] text-white/40 font-mono">£{item.price}</p>
                      </div>
                      <button onClick={() => deleteMerch(item.id)} disabled={deletingId === item.id}>
                        {deletingId === item.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} className="text-white/40 hover:text-vibe-red transition-colors" />}
                      </button>
                    </div>
                  ))}
                </div>
            </div>
        </div>
    );
}
