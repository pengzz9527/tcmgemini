
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12 py-6 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center text-gray-500">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} AI 膳食顾问. All Rights Reserved.
        </p>
        <p className="text-xs mt-2">
          免责声明：本工具提供的所有建议仅供参考，不能替代专业医疗意见。如有健康问题，请咨询医生或专业中医师。
        </p>
      </div>
    </footer>
  );
};
