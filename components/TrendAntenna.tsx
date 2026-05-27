import React, { useState } from 'react';
import { fetchTrends, Trend } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const TrendAntenna: React.FC = () => {
  const [trends, setTrends] = useState<Trend[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleScanClick = async () => {
    setIsLoading(true);
    setError(null);
    setTrends(null);

    try {
      const fetchedTrends = await fetchTrends();
      setTrends(fetchedTrends);
    } catch (err) {
      setError('Failed to scan trends. The antenna might be down.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 75) return 'bg-brand-mint';
    if (score > 50) return 'bg-light-mint';
    return 'bg-soft-gray/60';
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center space-y-8 text-center">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-light">Trend Antenna</h2>
        <p className="text-deep-purple/70 max-w-2xl">
          Scan the digital ether for emerging aesthetics and predict what's next, before it's everywhere.
        </p>
      </div>

      {!trends && !isLoading && !error && (
        <button
          onClick={handleScanClick}
          disabled={isLoading}
          className="px-8 py-3 bg-deep-purple text-cream rounded-md font-semibold hover:bg-deep-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-purple transition-transform duration-200 transform hover:scale-105 disabled:bg-deep-purple/50"
        >
          {isLoading ? 'Scanning...' : 'Scan for Emerging Trends'}
        </button>
      )}

      <div className="w-full min-h-[10rem] flex items-center justify-center">
        {isLoading && <LoadingSpinner message="Scanning digital trends..." />}
        {error && <p className="text-red-500">{error}</p>}
        {trends && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left w-full">
            {trends.map((trend, index) => (
              <div key={index} className="bg-white/50 p-6 rounded-lg shadow-sm space-y-4 animate-fade-in flex flex-col">
                <div className="flex items-start space-x-4">
                  <div className={`w-14 h-14 ${getScoreColor(trend.predictionScore)} rounded-full flex-shrink-0 flex items-center justify-center`}>
                      <span className="text-xl font-bold text-deep-purple">{trend.predictionScore}</span>
                  </div>
                  <div className='flex-grow'>
                    <h3 className="text-xl font-semibold text-deep-purple">{trend.name}</h3>
                    <p className="text-xs text-deep-purple/60">Mainstream Potential</p>
                  </div>
                </div>
                <p className="text-deep-purple/80 text-sm font-light flex-grow">{trend.description}</p>
                <p className="text-xs text-deep-purple/60 italic border-l-2 border-brand-mint pl-3">
                    <strong>Rationale:</strong> {trend.rationale}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {trend.keywords.map((keyword, kwIndex) => (
                    <span key={kwIndex} className="px-3 py-1 text-xs bg-light-mint text-deep-purple rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendAntenna;