import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Plus, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface JournalEntry {
  id: string;
  date: string;
  symptoms: string;
  notes: string;
  analysisId?: string;
}

const JournalPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkedAnalysisId = searchParams.get('analysisId');

  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('journal_entries') || '[]');
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(!!linkedAnalysisId);
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');

  const saveEntry = () => {
    if (!symptoms.trim() && !notes.trim()) {
      toast.error('Please enter symptoms or notes');
      return;
    }
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      symptoms: symptoms.trim(),
      notes: notes.trim(),
      analysisId: linkedAnalysisId || undefined,
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('journal_entries', JSON.stringify(updated));
    toast.success('Journal entry saved');
    setShowForm(false);
    setSymptoms('');
    setNotes('');
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem('journal_entries', JSON.stringify(updated));
    toast.success('Entry deleted');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            <Plus size={16} /> New Entry
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={24} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Health Journal</h1>
        </div>

        {linkedAnalysisId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
            Linked to analysis <span className="font-mono font-semibold">{linkedAnalysisId.slice(0, 8)}...</span>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">New Journal Entry</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                <input
                  type="text"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. stomach pain, fatigue, nausea"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional observations..."
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={saveEntry}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Save Entry
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {entries.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No journal entries yet</p>
            <p className="text-sm mt-1">Start tracking your symptoms and observations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    {new Date(entry.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
                {entry.symptoms && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Symptoms</span>
                    <p className="text-sm text-gray-800 mt-1">{entry.symptoms}</p>
                  </div>
                )}
                {entry.notes && (
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</span>
                    <p className="text-sm text-gray-800 mt-1">{entry.notes}</p>
                  </div>
                )}
                {entry.analysisId && (
                  <button
                    onClick={() => navigate(`/analysis/${entry.analysisId}`)}
                    className="mt-3 text-xs text-blue-500 hover:underline"
                  >
                    View linked analysis
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
