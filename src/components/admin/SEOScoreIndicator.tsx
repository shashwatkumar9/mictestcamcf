'use client';

interface SEOScoreIndicatorProps {
  score: number;
  message: string;
  label: string;
}

export function SEOScoreIndicator({ score, message, label }: SEOScoreIndicatorProps) {
  const getColorClass = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColorClass = () => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBgColorClass = () => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 50) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${getBgColorClass()}`}>
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${getColorClass()}`} />
        <span className="text-gray-300 text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-sm ${getTextColorClass()}`}>{message}</span>
        <span className={`text-sm font-bold ${getTextColorClass()}`}>{score}/100</span>
      </div>
    </div>
  );
}

interface OverallSEOScoreProps {
  score: number;
}

export function OverallSEOScore({ score }: OverallSEOScoreProps) {
  const getColorClass = () => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getTextColorClass = () => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMessage = () => {
    if (score >= 80) return 'Great SEO! Ready to publish.';
    if (score >= 50) return 'Good progress. Improve highlighted areas.';
    return 'Needs improvement. Check issues below.';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">SEO Score</h3>
        <div className={`text-3xl font-bold ${getTextColorClass()}`}>{score}%</div>
      </div>
      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full bg-gradient-to-r ${getColorClass()} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className={`text-sm ${getTextColorClass()}`}>{getMessage()}</p>
    </div>
  );
}
