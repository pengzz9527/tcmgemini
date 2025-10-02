import React from 'react';
import type { Constitution, Season } from '../types';
import { CONSTITUTIONS, SEASONS } from '../constants';

interface ConstitutionSelectorProps {
  selectedConstitution: Constitution;
  setSelectedConstitution: (constitution: Constitution) => void;
  selectedSeason: Season;
  setSelectedSeason: (season: Season) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onOpenTest: () => void;
}

export const ConstitutionSelector: React.FC<ConstitutionSelectorProps> = ({
  selectedConstitution,
  setSelectedConstitution,
  selectedSeason,
  setSelectedSeason,
  onGenerate,
  isLoading,
  onOpenTest,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <div className="flex justify-between items-center mb-2">
            <label htmlFor="constitution-select" className="block text-sm font-medium text-gray-700">
              第一步：选择您的体质
            </label>
            <button
              onClick={onOpenTest}
              className="text-sm text-green-600 hover:text-green-800 hover:underline focus:outline-none"
            >
              不确定？点此测试
            </button>
          </div>
          <select
            id="constitution-select"
            value={selectedConstitution}
            onChange={(e) => setSelectedConstitution(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm"
          >
            {CONSTITUTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="season-select" className="block text-sm font-medium text-gray-700 mb-2">
            第二步：选择当前季节
          </label>
          <select
            id="season-select"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value as Season)}
            className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm"
          >
            {SEASONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在生成...
            </>
          ) : (
            '生成养生建议'
          )}
        </button>
      </div>
    </div>
  );
};
