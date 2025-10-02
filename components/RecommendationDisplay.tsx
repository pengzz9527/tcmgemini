import React, { useState } from 'react';
import type { DietaryPlan, Recipe } from '../types';

interface RecommendationDisplayProps {
  plan: DietaryPlan;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-full mr-4">{icon}</div>
            <h3 className="text-xl font-semibold text-green-800">{title}</h3>
        </div>
        {children}
    </div>
);

const RecipeCard: React.FC<{ recipe: Recipe; index: number }> = ({ recipe, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
      >
        <h4 className="font-semibold text-gray-800">{recipe.name}</h4>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4">
          <div className="mb-4">
            <h5 className="font-semibold text-sm text-gray-600 mb-2">食材:</h5>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-sm text-gray-600 mb-2">做法:</h5>
            <p className="text-gray-700 text-sm whitespace-pre-line">{recipe.instructions}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({ plan }) => {
  return (
    <div className="space-y-8 animate-fade-in">
        <InfoCard title="总体建议" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
            <p className="text-gray-600">{plan.generalAdvice}</p>
        </InfoCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoCard title="推荐食材" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}>
                 <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-600">
                    {plan.recommendedFoods.map((food, i) => (
                      <li key={i} className="flex items-center">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {food}
                      </li>
                    ))}
                </ul>
            </InfoCard>
             <InfoCard title="饮食禁忌" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-600">
                    {plan.avoidFoods.map((food, i) => <li key={i} className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{food}</li>)}
                </ul>
            </InfoCard>
        </div>

        <InfoCard title="推荐菜谱" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}>
            <div className="space-y-4">
                {plan.sampleRecipes.map((recipe, i) => (
                    <RecipeCard key={i} recipe={recipe} index={i} />
                ))}
            </div>
        </InfoCard>
    </div>
  );
};

// Add a simple fade-in animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
