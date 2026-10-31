import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { MindMapState } from '../types';
import { SCRAMBLED_KEYWORDS } from '../data/curriculumData';
import { evaluateMindMap, EvaluationResult } from '../utils/textAnalysis';
import { playDing, playFanfare } from '../utils/audio';
import { CheckCircle2, XCircle, RotateCcw, HelpCircle, Eye, Printer, BookOpen, Sparkles, Copy, Check } from 'lucide-react';

interface Step1MindMapProps {
  onOpenReadingPassage: () => void;
  onProceedToStep2: () => void;
}

export const Step1MindMap: React.FC<Step1MindMapProps> = ({ onOpenReadingPassage, onProceedToStep2 }) => {
  const [inputs, setInputs] = useState<MindMapState>({
    originWhen: '',
    originWhere: '',
    type1: '',
    type2: '',
    inst1: '',
    inst2: '',
    inst3: '',
    inst4: '',
    costume1: '',
    costume2: '',
    costume3: '',
  });

  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [activeInputKey, setActiveInputKey] = useState<keyof MindMapState | null>(null);

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleInputChange = (field: keyof MindMapState, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckAnswers = () => {
    playDing();
    const result = evaluateMindMap(inputs);
    setEvaluation(result);

    if (result.score === 11) {
      playFanfare();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    playDing();
    setInputs({
      originWhen: '',
      originWhere: '',
      type1: '',
      type2: '',
      inst1: '',
      inst2: '',
      inst3: '',
      inst4: '',
      costume1: '',
      costume2: '',
      costume3: '',
    });
    setEvaluation(null);
    setShowAnswerKey(false);
  };

  const handleFillAnswerKey = () => {
    playDing();
    setInputs({
      originWhen: '16th century',
      originWhere: 'Northern Delta',
      type1: 'hat tho (worship singing)',
      type2: 'hat hau',
      inst1: 'moon-shaped lute',
      inst2: 'bamboo clappers',
      inst3: 'drum',
      inst4: 'gong',
      costume1: 'clothes',
      costume2: 'hats',
      costume3: 'belts',
    });
    const result = evaluateMindMap({
      originWhen: '16th century',
      originWhere: 'Northern Delta',
      type1: 'hat tho (worship singing)',
      type2: 'hat hau',
      inst1: 'moon-shaped lute',
      inst2: 'bamboo clappers',
      inst3: 'drum',
      inst4: 'gong',
      costume1: 'clothes',
      costume2: 'hats',
      costume3: 'belts',
    });
    setEvaluation(result);
    setShowAnswerKey(true);
  };

  const handleKeywordClick = (kw: string) => {
    playDing();
    // If an input is currently active, fill it!
    if (activeInputKey) {
      handleInputChange(activeInputKey, kw);
    } else {
      // Find the first empty input
      const emptyKey = (Object.keys(inputs) as (keyof MindMapState)[]).find(k => !inputs[k].trim());
      if (emptyKey) {
        handleInputChange(emptyKey, kw);
      }
    }

    // Also copy to clipboard for convenience
    try {
      navigator.clipboard.writeText(kw);
      setCopiedKeyword(kw);
      setTimeout(() => setCopiedKeyword(null), 1500);
    } catch {
      // Ignore
    }
  };

  const getInputClass = (field: keyof MindMapState, defaultBg: string, defaultBorder: string) => {
    if (!evaluation) {
      return `w-full ${defaultBg} border-2 ${defaultBorder} rounded-xl p-2.5 text-sm text-gray-900 font-extrabold text-center transition focus:scale-105 focus:ring-2 focus:ring-yellow-400 outline-none`;
    }
    const isCorrect = evaluation.fieldResults[field];
    if (isCorrect) {
      return 'w-full bg-emerald-50 border-2 border-emerald-500 text-emerald-900 rounded-xl p-2.5 text-sm font-black text-center shadow-sm';
    }
    return 'w-full bg-rose-50 border-2 border-rose-400 text-rose-900 rounded-xl p-2.5 text-sm font-black text-center shadow-sm';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 p-4 md:p-6 rounded-3xl border border-pink-200 glass-panel">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-pink-500 text-white text-xs font-black rounded-full uppercase tracking-wider">
              Kỹ năng Đọc Hiểu
            </span>
            <span className="text-xs font-bold text-gray-500">Global Success 10 • Unit 3</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-pink-600 mt-1">
            BƯỚC 1: Sơ đồ tư duy (Mind map) 🧠
          </h2>
          <p className="text-sm font-semibold text-gray-600 mt-1">
            Đọc bài khóa về Chau van singing và điền các thông tin vào 4 nhánh. (Thứ tự trong cùng một nhánh là tự do!)
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenReadingPassage}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Mở Bài Đọc SGK</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition shadow-sm no-print"
          >
            <Printer className="w-4 h-4" />
            <span>In Phiếu Học Tập</span>
          </button>
        </div>
      </div>

      {/* Scrambled Keyword Hint Bar */}
      <div className="glass-panel p-5 rounded-3xl bg-amber-50/90 border-2 border-amber-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <h3 className="font-black text-amber-900 text-sm md:text-base">
              GỢI Ý TỪ KHÓA ĐIỀN VÀO SƠ ĐỒ (Xếp lộn xộn để tăng thử thách):
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-700">
            {copiedKeyword ? `✓ Đã chọn: "${copiedKeyword}"` : "Mẹo: Bấm vào từ để tự động điền ô trống!"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {SCRAMBLED_KEYWORDS.map((kw, idx) => (
            <button
              key={idx}
              onClick={() => handleKeywordClick(kw)}
              className="group bg-white hover:bg-amber-100 active:scale-95 text-gray-800 px-3.5 py-2 rounded-xl border-2 border-amber-300 text-xs md:text-sm font-black transition-all shadow-sm flex items-center gap-1.5 hover:shadow-md cursor-pointer"
            >
              <span>{kw}</span>
              <span className="text-amber-500 opacity-60 group-hover:opacity-100 text-xs">＋</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Mind Map Canvas */}
      <div className="relative w-full glass-panel rounded-3xl p-6 md:p-10 flex flex-col items-center gap-10 md:gap-14 border-4 border-white/90 shadow-xl overflow-hidden">
        
        {/* Background Stage Light Effects */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Central Core Topic Node */}
        <div className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 text-gray-900 p-6 rounded-3xl shadow-xl border-4 border-amber-400 z-10 w-full max-w-md text-center transform hover:scale-105 transition-transform duration-300">
          <div className="inline-block bg-white/70 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-900 mb-1">
            Central Topic
          </div>
          <h3 className="font-black italic text-2xl md:text-3xl text-gray-950">
            Chau van singing
          </h3>
          <p className="text-xs md:text-sm font-bold mt-1 text-amber-900">
            an ancient form of Vietnamese performance art
          </p>
        </div>

        {/* 4 Radial Branches */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* BRANCH 1: ORIGIN */}
          <div className="flex flex-col items-center gap-4 bg-white/60 p-4 rounded-3xl border-2 border-emerald-200/80 shadow-sm hover:shadow-md transition">
            <div className="diamond-badge bg-gradient-to-br from-emerald-400 to-teal-500 text-emerald-950 w-28 h-28 shadow-lg shadow-emerald-500/20">
              <span className="text-lg font-black tracking-wide">Origin</span>
            </div>
            
            <div className="flex flex-col gap-3 w-full px-1">
              <div className="flex items-center gap-2 bg-emerald-50 p-2 rounded-2xl border border-emerald-200">
                <span className="text-xs font-black text-emerald-800 w-14 text-right">When:</span>
                <input
                  type="text"
                  value={inputs.originWhen}
                  onFocus={() => setActiveInputKey('originWhen')}
                  onChange={(e) => handleInputChange('originWhen', e.target.value)}
                  className={getInputClass('originWhen', 'bg-white', 'border-emerald-300')}
                />
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 p-2 rounded-2xl border border-emerald-200">
                <span className="text-xs font-black text-emerald-800 w-14 text-right">Where:</span>
                <input
                  type="text"
                  value={inputs.originWhere}
                  onFocus={() => setActiveInputKey('originWhere')}
                  onChange={(e) => handleInputChange('originWhere', e.target.value)}
                  className={getInputClass('originWhere', 'bg-white', 'border-emerald-300')}
                />
              </div>
            </div>

            {evaluation && (
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Đúng: {evaluation.groupResults.origin.correct}/{evaluation.groupResults.origin.total}
              </span>
            )}
          </div>

          {/* BRANCH 2: TYPES */}
          <div className="flex flex-col items-center gap-4 bg-white/60 p-4 rounded-3xl border-2 border-cyan-200/80 shadow-sm hover:shadow-md transition">
            <div className="diamond-badge bg-gradient-to-br from-cyan-400 to-sky-500 text-cyan-950 w-28 h-28 shadow-lg shadow-cyan-500/20">
              <span className="text-lg font-black tracking-wide">Types</span>
            </div>
            
            <div className="flex flex-col gap-3 w-full px-1">
              <div className="relative">
                <input
                  type="text"
                  value={inputs.type1}
                  onFocus={() => setActiveInputKey('type1')}
                  onChange={(e) => handleInputChange('type1', e.target.value)}
                  className={getInputClass('type1', 'bg-cyan-50', 'border-cyan-300')}
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={inputs.type2}
                  onFocus={() => setActiveInputKey('type2')}
                  onChange={(e) => handleInputChange('type2', e.target.value)}
                  className={getInputClass('type2', 'bg-cyan-50', 'border-cyan-300')}
                />
              </div>
            </div>

            {evaluation && (
              <span className="text-xs font-black text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full">
                Đúng: {evaluation.groupResults.types.correct}/{evaluation.groupResults.types.total}
              </span>
            )}
          </div>

          {/* BRANCH 3: INSTRUMENTS */}
          <div className="flex flex-col items-center gap-4 bg-white/60 p-4 rounded-3xl border-2 border-blue-200/80 shadow-sm hover:shadow-md transition">
            <div className="diamond-badge bg-gradient-to-br from-blue-400 to-indigo-500 text-blue-950 w-28 h-28 shadow-lg shadow-blue-500/20">
              <span className="leading-tight font-black text-base">Main<br />Instruments</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2.5 w-full px-1">
              <input
                type="text"
                value={inputs.inst1}
                onFocus={() => setActiveInputKey('inst1')}
                onChange={(e) => handleInputChange('inst1', e.target.value)}
                className={getInputClass('inst1', 'bg-blue-50', 'border-blue-300')}
              />
              <input
                type="text"
                value={inputs.inst2}
                onFocus={() => setActiveInputKey('inst2')}
                onChange={(e) => handleInputChange('inst2', e.target.value)}
                className={getInputClass('inst2', 'bg-blue-50', 'border-blue-300')}
              />
              <input
                type="text"
                value={inputs.inst3}
                onFocus={() => setActiveInputKey('inst3')}
                onChange={(e) => handleInputChange('inst3', e.target.value)}
                className={getInputClass('inst3', 'bg-blue-50', 'border-blue-300')}
              />
              <input
                type="text"
                value={inputs.inst4}
                onFocus={() => setActiveInputKey('inst4')}
                onChange={(e) => handleInputChange('inst4', e.target.value)}
                className={getInputClass('inst4', 'bg-blue-50', 'border-blue-300')}
              />
            </div>

            {evaluation && (
              <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                Đúng: {evaluation.groupResults.instruments.correct}/{evaluation.groupResults.instruments.total}
              </span>
            )}
          </div>

          {/* BRANCH 4: COSTUMES */}
          <div className="flex flex-col items-center gap-4 bg-white/60 p-4 rounded-3xl border-2 border-rose-200/80 shadow-sm hover:shadow-md transition">
            <div className="diamond-badge bg-gradient-to-br from-rose-400 to-pink-500 text-rose-950 w-28 h-28 shadow-lg shadow-rose-500/20">
              <span className="text-lg font-black tracking-wide">Costumes</span>
            </div>
            
            <div className="flex flex-col gap-2.5 w-full px-1">
              <input
                type="text"
                value={inputs.costume1}
                onFocus={() => setActiveInputKey('costume1')}
                onChange={(e) => handleInputChange('costume1', e.target.value)}
                className={getInputClass('costume1', 'bg-rose-50', 'border-rose-300')}
              />
              <input
                type="text"
                value={inputs.costume2}
                onFocus={() => setActiveInputKey('costume2')}
                onChange={(e) => handleInputChange('costume2', e.target.value)}
                className={getInputClass('costume2', 'bg-rose-50', 'border-rose-300')}
              />
              <input
                type="text"
                value={inputs.costume3}
                onFocus={() => setActiveInputKey('costume3')}
                onChange={(e) => handleInputChange('costume3', e.target.value)}
                className={getInputClass('costume3', 'bg-rose-50', 'border-rose-300')}
              />
            </div>

            {evaluation && (
              <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                Đúng: {evaluation.groupResults.costumes.correct}/{evaluation.groupResults.costumes.total}
              </span>
            )}
          </div>

        </div>

      </div>

      {/* Control Buttons & Result Badge */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={handleCheckAnswers}
          className="w-full sm:w-auto bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black py-4 px-10 rounded-2xl text-lg shadow-xl shadow-pink-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>🚀</span>
          <span>KIỂM TRA ĐÁP ÁN</span>
        </button>

        {evaluation && (
          <div className="flex items-center gap-3">
            <div className={`px-6 py-3 rounded-2xl text-2xl font-black border-2 shadow-md animate-bounce ${
              evaluation.score === 11 
                ? 'bg-emerald-500 text-white border-emerald-400' 
                : evaluation.score >= 8 
                ? 'bg-amber-400 text-amber-950 border-amber-300' 
                : 'bg-rose-50 text-rose-600 border-rose-300'
            }`}>
              {evaluation.score}/11 Điểm
            </div>

            {evaluation.score === 11 && (
              <button
                onClick={onProceedToStep2}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg transition flex items-center gap-2"
              >
                <span>Sang Bước 2</span>
                <span>👉</span>
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={handleFillAnswerKey}
            className="px-4 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-2xl border border-gray-200 text-sm transition shadow-sm flex items-center gap-1.5"
            title="Xem đáp án tham khảo"
          >
            <Eye className="w-4 h-4 text-indigo-500" />
            <span>Xem Đáp Án</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3 bg-white hover:bg-gray-100 text-gray-600 rounded-2xl border border-gray-200 transition shadow-sm"
            title="Làm lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
