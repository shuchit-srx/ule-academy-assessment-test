import React, { useState } from 'react';
import axios from 'axios';

const FACTOR_LABELS = {
    factorI: "Planning & Organising",
    factorII: "Social Adjustment",
    factorIII: "Social Effectiveness",
    factorIV: "Dynamic / Emotional Stability"
};

export default function CoachPanel({ result }) {
    const [coachPinInput, setCoachPinInput] = useState('');
    const [isCoachUnlocked, setIsCoachUnlocked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const unlockCoach = async () => {
        if (!coachPinInput) {
            alert('Please enter a PIN.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/assessment/verify-coach`, {
                pin: coachPinInput
            });

            if (response.data.success && response.data.valid) {
                setIsCoachUnlocked(true);
            } else {
                setError('Incorrect PIN.');
            }
        } catch (err) {
            console.error("Coach verification failed:", err);
            setError('Verification failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!result) return null;

    return (
        <div id="coachSection" className="mt-2 pt-2 border-t border-dashed border-gray-200 text-[12px] print:hidden">
            {!isCoachUnlocked ? (
                <div id="coachLockedView">
                    <strong>Coach Panel (ULe Academy use only)</strong><br />
                    <span className="text-gray-500">
                        Detailed OLQ & Factor scores are hidden from candidates. Enter coach PIN to unlock.
                    </span>
                    <div className="mt-1 flex items-center gap-1">
                        <input
                            type="password"
                            placeholder="Coach PIN"
                            value={coachPinInput}
                            onChange={(e) => setCoachPinInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && unlockCoach()}
                            className="px-2 py-1 rounded-full border border-gray-300 text-[12px] w-[120px] outline-none focus:border-[#1f4b99]"
                        />
                        <button
                            className="rounded-full px-3 py-1 text-[12px] font-semibold cursor-pointer inline-flex items-center gap-1 bg-white text-[#1f4b99] border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                            type="button"
                            onClick={unlockCoach}
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : '🔐 Unlock'}
                        </button>
                    </div>
                    {error && <div className="text-red-500 text-[11px] mt-1">{error}</div>}
                    <div className="text-[11px] text-gray-500 mt-1">Default PIN: 1947</div>
                </div>
            ) : (
                <div id="coachUnlockedView" className="mt-1.5">
                    <strong>Detailed OLQ & Factor Breakdown</strong>

                    {/* Factor Scores */}
                    <div id="factorScoresBlock" className="mt-1 mb-1.5 flex flex-wrap gap-1">
                        {['factorI', 'factorII', 'factorIII', 'factorIV'].map(key => (
                            <div key={key} className="inline-flex items-center px-2 py-0.5 rounded-full border border-gray-200 text-[11px] bg-white mr-1">
                                <strong className="mr-1">
                                    F({key.replace('factor', '')})
                                </strong>
                                {FACTOR_LABELS[key]}: {result.factorScores && result.factorScores[key] !== undefined ? result.factorScores[key].toFixed(2) : '—'}
                            </div>
                        ))}
                    </div>

                    {/* OLQ Table */}
                    <div id="olqTableBlock" className="mt-1.5">
                        <table className="w-full border-collapse mt-1.5 text-[11px]">
                            <thead>
                                <tr>
                                    <th className="border border-gray-200 p-1 text-left bg-gray-50 font-semibold">OLQ Name</th>
                                    <th className="border border-gray-200 p-1 text-center bg-gray-50 font-semibold">Factor</th>
                                    <th className="border border-gray-200 p-1 text-center bg-gray-50 font-semibold">Self-Rating (1–5)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.olqScores && result.olqScores.map(o => (
                                    <tr key={o.id}>
                                        <td className="border border-gray-200 p-1 text-left">
                                            {o.id}. {o.name}
                                        </td>
                                        <td className="border border-gray-200 p-1 text-center">{o.factor}</td>
                                        <td className="border border-gray-200 p-1 text-center">{o.score.toFixed(1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}