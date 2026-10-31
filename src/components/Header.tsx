import React from 'react';
import { StepId } from '../types';
import { BookOpen, Volume2, VolumeX, Play, Pause, RotateCcw, Clock, Sparkles } from 'lucide-react';
import { getMuteState, toggleMute } from '../utils/audio';

interface HeaderProps {
  currentStep: StepId;
  onSelectStep: (step: StepId) => void;
  timerSeconds: number;
  isTimerRunning: boolean;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResetTimer: () => void;
  onOpenReadingPassage: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  teamName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onSelectStep,
  timerSeconds,
  isTimerRunning,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onOpenReadingPassage,
  isMuted,
  onToggleMute,
  teamName,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isLowTime = timerSeconds > 0 && timerSeconds <= 60;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-pink-200/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Brand Logo & Unit Tag */}
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/25">
                <span className="text-xl">🎤</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-black italic tracking-wide gradient-text uppercase">
                    The Voice 10
                  </h1>
                </div>
                <p className="text-xs font-semibold text-gray-500">
                  Global Success 10 • Unit 3: Music
                  {teamName ? <span className="ml-2 font-bold text-purple-600">| Đội: {teamName}</span> : null}
                </p>
              </div>
            </div>

            {/* Quick Helper Tools (Mobile) */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                onClick={onOpenReadingPassage}
                className="p-2 text-indigo-700 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition"
                title="Bài đọc SGK"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4 Step Navigation Tabs */}
          <nav className="flex items-center gap-1.5 md:gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none font-bold">
            <button
              onClick={() => onSelectStep('step1')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-extrabold transition-all duration-200 flex items-center gap-1.5 ${
                currentStep === 'step1'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30 scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>① Sơ đồ tư duy</span>
              <span className="text-base">🧠</span>
            </button>

            <button
              onClick={() => onSelectStep('step2')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-extrabold transition-all duration-200 flex items-center gap-1.5 ${
                currentStep === 'step2'
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>② Chọn &amp; Viết</span>
              <span className="text-base">✍️</span>
            </button>

            <button
              onClick={() => onSelectStep('step3')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-extrabold transition-all duration-200 flex items-center gap-1.5 ${
                currentStep === 'step3'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/30 scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>③ Tạo Poster AI</span>
              <span className="text-base">🎨</span>
            </button>

            <button
              onClick={() => onSelectStep('step4')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-extrabold transition-all duration-200 flex items-center gap-1.5 ${
                currentStep === 'step4'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30 scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>④ Luyện Nói AI</span>
              <span className="text-base">🎙️</span>
            </button>
          </nav>

          {/* Right Area: Timer + Quick Buttons (Desktop) */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            
            {/* Global Countdown Timer */}
            {timerSeconds > 0 && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/80 rounded-2xl px-3 py-1.5 shadow-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className={`text-lg font-black font-mono tracking-wider ${
                  isLowTime ? 'text-red-500 animate-pulse' : 'text-blue-700'
                }`}>
                  {formatTime(timerSeconds)}
                </span>
                <div className="flex items-center gap-1">
                  {isTimerRunning ? (
                    <button
                      onClick={onPauseTimer}
                      className="w-7 h-7 flex items-center justify-center bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition"
                      title="Tạm dừng"
                    >
                      <Pause className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={onStartTimer}
                      className="w-7 h-7 flex items-center justify-center bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                      title="Bắt đầu đếm ngược"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                  <button
                    onClick={onResetTimer}
                    className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition"
                    title="Đặt lại thời gian"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions (Desktop) */}
            <div className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={onOpenReadingPassage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Bài đọc SGK</span>
              </button>

              <button
                onClick={onToggleMute}
                className={`p-2 rounded-xl transition border text-xs font-bold ${
                  isMuted 
                    ? 'bg-gray-100 text-gray-500 border-gray-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                }`}
                title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
