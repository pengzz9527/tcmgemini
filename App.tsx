import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ConstitutionSelector } from './components/ConstitutionSelector';
import { RecommendationDisplay } from './components/RecommendationDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ConstitutionTestModal } from './components/ConstitutionTestModal';
import type { DietaryPlan, Constitution, Season } from './types';
import { generateDietaryPlan } from './services/geminiService';
import { CONSTITUTIONS, SEASONS } from './constants';

const App: React.FC = () => {
  const [selectedConstitution, setSelectedConstitution] = useState<Constitution>(CONSTITUTIONS[0]);
  const [selectedSeason, setSelectedSeason] = useState<Season>(SEASONS[0]);
  const [recommendation, setRecommendation] = useState<DietaryPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // Load from localStorage on initial render
  useEffect(() => {
    try {
      const savedDataJSON = localStorage.getItem('tcmDietaryPlan');
      if (savedDataJSON) {
        const savedData = JSON.parse(savedDataJSON);
        if (savedData.plan && savedData.constitution && savedData.season) {
          setRecommendation(savedData.plan);
          setSelectedConstitution(savedData.constitution);
          setSelectedSeason(savedData.season);
        }
      }
    } catch (e) {
      console.error("Could not load or parse data from localStorage", e);
      localStorage.removeItem('tcmDietaryPlan'); // Clear corrupted data
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const plan = await generateDietaryPlan(selectedConstitution, selectedSeason);
      setRecommendation(plan);
      // Save to localStorage on success
      const dataToStore = {
        plan,
        constitution: selectedConstitution,
        season: selectedSeason,
      };
      localStorage.setItem('tcmDietaryPlan', JSON.stringify(dataToStore));
    } catch (err) {
      console.error("Error generating dietary plan:", err);
      setError('生成饮食建议时出错，请稍后重试。可能是网络问题或API密钥无效。');
    } finally {
      setIsLoading(false);
    }
  }, [selectedConstitution, selectedSeason]);

  // Function to clear the recommendation and localStorage
  const handleClear = useCallback(() => {
    setRecommendation(null);
    setError(null);
    localStorage.removeItem('tcmDietaryPlan');
    // Reset selectors to default for a fresh start
    setSelectedConstitution(CONSTITUTIONS[0]);
    setSelectedSeason(SEASONS[0]);
  }, []);

  // Handlers for the constitution test modal
  const handleOpenTest = () => setIsTestModalOpen(true);
  const handleCloseTest = () => setIsTestModalOpen(false);
  const handleTestComplete = useCallback((constitution: Constitution) => {
    if (CONSTITUTIONS.includes(constitution)) {
      setSelectedConstitution(constitution);
    }
    setIsTestModalOpen(false);
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-green-50/50 text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">个性化中医养生方案</h2>
          <p className="text-gray-600 mb-8">
            选择您的体质和当前季节，AI 将为您量身定制一份详细的饮食调理建议。
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 border border-green-100">
          <ConstitutionSelector
            selectedConstitution={selectedConstitution}
            setSelectedConstitution={setSelectedConstitution}
            selectedSeason={selectedSeason}
            setSelectedSeason={setSelectedSeason}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            onOpenTest={handleOpenTest}
          />
        </div>

        <div className="mt-10 max-w-4xl mx-auto">
          {isLoading && <LoadingSpinner />}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
              <p className="font-bold">发生错误</p>
              <p>{error}</p>
            </div>
          )}
          {recommendation && !isLoading && (
             <div className="animate-fade-in">
              <RecommendationDisplay plan={recommendation} />
              <div className="mt-8 text-center">
                <button
                  onClick={handleClear}
                  className="px-6 py-2 border border-red-400 text-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-all duration-200 ease-in-out"
                  aria-label="清除当前方案并开始新的选择"
                >
                  清除方案并重新开始
                </button>
              </div>
            </div>
          )}
          {!recommendation && !isLoading && !error && (
             <div className="text-center text-gray-500 py-12 px-6 bg-white rounded-xl shadow-md border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">等待您的选择</h3>
                <p className="mt-1 text-sm text-gray-500">完成上方选择后，点击“生成建议”即可查看您的专属养生方案。</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ConstitutionTestModal
        isOpen={isTestModalOpen}
        onClose={handleCloseTest}
        onTestComplete={handleTestComplete}
      />
    </div>
  );
};

export default App;
