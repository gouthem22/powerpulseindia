import React, { useState } from 'react';
import { generateInsights } from '../services/geminiService';
import { Sparkles, RefreshCw, CheckCircle } from 'lucide-react';

interface AiInsightProps {
  contextData: string;
  title?: string;
}

const AiInsight: React.FC<AiInsightProps> = ({ contextData, title = "AI-Powered Insights" }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `
        Analyze this electricity data summary:
        ${contextData.substring(0, 2000)}... (truncated for brevity)
        
        Provide 3 key trends or insights.
      `;
      const result = await generateInsights(prompt);
      setInsights(result.summary);
      setConfidence(result.confidence);
      setGenerated(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-orange-500/30 shadow-lg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-500/10 rounded-full blur-xl"></div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-orange-400" size={20} />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded border border-orange-500/30">
          Gemini 2.5 Flash
        </span>
      </div>

      {!generated ? (
        <div className="text-center py-8">
          <p className="text-slate-400 mb-4">Generate smart insights based on the current data view.</p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {loading ? 'Analyzing...' : 'Generate Insights'}
          </button>
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="mt-1 min-w-[20px]">
                <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-orange-400">
                  {idx + 1}
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle size={12} className="text-emerald-500" />
              <span>Confidence Score: {(confidence * 100).toFixed(0)}%</span>
            </div>
            <button 
              onClick={handleGenerate}
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <RefreshCw size={10} /> Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiInsight;