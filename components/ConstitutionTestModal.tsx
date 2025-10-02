import React, { useState } from 'react';
import { TEST_QUESTIONS } from '../constants';
import { determineConstitution } from '../services/geminiService';
import type { Constitution } from '../types';

interface ConstitutionTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestComplete: (constitution: Constitution) => void;
}

export const ConstitutionTestModal: React.FC<ConstitutionTestModalProps> = ({ isOpen, onClose, onTestComplete }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Constitution | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const allQuestionsAnswered = Object.keys(answers).length === TEST_QUESTIONS.length;

  const handleSubmit = async () => {
    if (!allQuestionsAnswered) {
      setError('请回答所有问题。');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
        const questionMapping: Record<string, string> = {
            q1: '精力', q2: '冷热偏好', q3: '皮肤状况', q4: '情绪状态',
            q5: '消化情况', q6: '出汗情况', q7: '舌头状况'
        };
        const mappedAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
            acc[questionMapping[key] || key] = value;
            return acc;
        }, {} as Record<string, string>);

        const constitutionResult = await determineConstitution(mappedAnswers);
        setResult(constitutionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生未知错误');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyResult = () => {
    if (result) {
      onTestComplete(result);
      resetState();
    }
  };
  
  const handleClose = () => {
    resetState();
    onClose();
  };

  const resetState = () => {
    setAnswers({});
    setIsLoading(false);
    setResult(null);
    setError(null);
  };

  if (!isOpen) return null;

  // Add a simple fade-in animation for the modal
  const style = document.createElement('style');
  if (!document.getElementById('modal-animation-style')) {
    style.id = 'modal-animation-style';
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
  }
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-green-800">中医体质自助测试</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600" aria-label="关闭">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          {!result && !isLoading && (
            <>
              <p className="text-sm text-gray-600">请根据您最近3个月的身体感受，选择最符合的选项。</p>
              {TEST_QUESTIONS.map((q) => (
                <div key={q.id}>
                  <p className="font-semibold text-gray-800 mb-2">{q.id.replace('q', '')}. {q.text}</p>
                  <div className="space-y-2">
                    {q.options.map(option => (
                      <label key={option} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                        <input
                          type="radio"
                          name={q.id}
                          value={option}
                          checked={answers[q.id] === option}
                          onChange={() => handleAnswerChange(q.id, option)}
                          className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {isLoading && (
            <div className="text-center py-10">
              <svg className="animate-spin h-8 w-8 text-green-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p className="mt-3 text-gray-600">AI正在分析您的体质...</p>
            </div>
          )}

          {result && (
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold text-gray-800">您的测试结果是：</h3>
              <p className="text-3xl font-bold text-green-600 my-4">{result}</p>
              <p className="text-sm text-gray-500 max-w-md mx-auto">此结果已为您自动选中。您可以关闭此窗口，然后点击“生成养生建议”来获取个性化方案。</p>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          {error && <p className="text-sm text-red-600 text-center mb-4">{error}</p>}
          {!result ? (
            <button
              onClick={handleSubmit}
              disabled={isLoading || !allQuestionsAnswered}
              className="w-full py-3 px-4 rounded-md shadow-sm text-white font-medium bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '正在分析...' : '查看分析结果'}
            </button>
          ) : (
            <button
              onClick={handleApplyResult}
              className="w-full py-3 px-4 rounded-md shadow-sm text-white font-medium bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              应用此结果并关闭
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
