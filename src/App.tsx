import React, { useState, useEffect, useRef } from 'react';
import { StepId, IdeaCard } from './types';
import { Header } from './components/Header';
import { Step1MindMap } from './components/Step1MindMap';
import { Step2Drafting } from './components/Step2Drafting';
import { Step3PosterAI } from './components/Step3PosterAI';
import { Step4SpeakingRoom } from './components/Step4SpeakingRoom';
import { ReadingPassageModal } from './components/ReadingPassageModal';
import { STEP_TIMERS, IDEA_CARDS } from './data/curriculumData';
import { playDing, playTimerAlert, getMuteState, toggleMute } from './utils/audio';

export default function App() {
  const [currentStep, setCurrentStep] = useState<StepId>('step1');
  const [essayText, setEssayText] = useState<string>(() => {
    try {
      return localStorage.getItem('thevoice10_essay') || '';
    } catch {
      return '';
    }
  });

  const [teamName, setTeamName] = useState<string>(() => {
    try {
      return localStorage.getItem('thevoice10_team') || '';
    } catch {
      return '';
    }
  });

  const [selectedIdea, setSelectedIdea] = useState<IdeaCard | null>(IDEA_CARDS[0]);

  // Global Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(STEP_TIMERS.step1);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sound Mute State
  const [isMuted, setIsMuted] = useState<boolean>(getMuteState());

  // Modals
  const [isReadingOpen, setIsReadingOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('thevoice10_essay', essayText);
    } catch {}
  }, [essayText]);

  useEffect(() => {
    try {
      localStorage.setItem('thevoice10_team', teamName);
    } catch {}
  }, [teamName]);

  // Timer interval handling
  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            playTimerAlert();
            return 0;
          }
          if (prev === 60) {
            playTimerAlert();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerSeconds]);

  const handleSelectStep = (step: StepId) => {
    playDing();
    setCurrentStep(step);
    // Set timer according to step
    const stepDuration = STEP_TIMERS[step] || 0;
    setTimerSeconds(stepDuration);
    setIsTimerRunning(false);
  };

  const handleStartTimer = () => {
    playDing();
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    playDing();
    setIsTimerRunning(false);
    setTimerSeconds(STEP_TIMERS[currentStep] || 0);
  };

  const handleToggleMute = () => {
    const nextState = toggleMute();
    setIsMuted(nextState);
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-pink-300 selection:text-pink-900">
      
      {/* Decorative Stage Lighting Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-pink-400/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-purple-400/15 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-10 w-96 h-96 bg-blue-400/15 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Header */}
      <Header
        currentStep={currentStep}
        onSelectStep={handleSelectStep}
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        onStartTimer={handleStartTimer}
        onPauseTimer={handlePauseTimer}
        onResetTimer={handleResetTimer}
        onOpenReadingPassage={() => setIsReadingOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        teamName={teamName}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 z-10">
        {currentStep === 'step1' && (
          <Step1MindMap
            onOpenReadingPassage={() => setIsReadingOpen(true)}
            onProceedToStep2={() => handleSelectStep('step2')}
          />
        )}

        {currentStep === 'step2' && (
          <Step2Drafting
            essayText={essayText}
            onChangeEssay={setEssayText}
            teamName={teamName}
            onChangeTeamName={setTeamName}
            selectedIdea={selectedIdea}
            onSelectIdea={setSelectedIdea}
            onProceedToStep3={() => handleSelectStep('step3')}
          />
        )}

        {currentStep === 'step3' && (
          <Step3PosterAI
            essayText={essayText}
            teamName={teamName}
            selectedIdea={selectedIdea}
            onProceedToStep4={() => handleSelectStep('step4')}
            onBackToStep2={() => handleSelectStep('step2')}
          />
        )}

        {currentStep === 'step4' && (
          <Step4SpeakingRoom
            essayText={essayText}
            onSetEssay={setEssayText}
            teamName={teamName}
            onBackToStep2={() => handleSelectStep('step2')}
          />
        )}
      </main>

      {/* Stage Footer */}
      <footer className="mt-auto py-6 border-t border-white/60 bg-white/70 backdrop-blur-md text-center text-xs font-semibold text-gray-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <span>🎤</span>
            <span className="font-extrabold text-gray-800">THE VOICE 10</span>
            <span>• Học liệu số Tiếng Anh 10 (Global Success - Unit 3: Music)</span>
          </p>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
            <button onClick={() => setIsReadingOpen(true)} className="hover:text-indigo-600 transition">
              Bài đọc SGK
            </button>
            <span>•</span>
            <span className="text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              100% Offline / Client-Side
            </span>
          </div>
        </div>
      </footer>

      {/* Printable Worksheet (Rendered only during print) */}
      <div className="hidden print-only p-8 text-black bg-white">
        <div className="text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-2xl font-black uppercase">THE VOICE 10</h1>
          <p className="text-sm font-bold">PHIẾU HỌC TẬP: UNIT 3 - MUSIC</p>
          <div className="flex justify-between text-xs mt-3">
            <span>Họ và tên: ................................................................</span>
            <span>Lớp: 10A.......</span>
            <span>Đội: ................................................................</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-bold text-base mb-2">PHẦN 1: SƠ ĐỒ TƯ DUY (MIND MAP)</h2>
          <p className="text-xs italic mb-4">Điền thông tin: Origin (When, Where), Types (2), Main Instruments (4), Costumes (3)</p>
          <div className="border border-black p-6 rounded-lg text-center space-y-4">
            <div className="font-bold border border-black p-2 inline-block">Chau Van Singing</div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="border border-black p-2">
                <strong>Origin</strong><br />When: .............<br />Where: .............
              </div>
              <div className="border border-black p-2">
                <strong>Types</strong><br />1. .............<br />2. .............
              </div>
              <div className="border border-black p-2">
                <strong>Instruments</strong><br />1. .............<br />2. .............<br />3. .............<br />4. .............
              </div>
              <div className="border border-black p-2">
                <strong>Costumes</strong><br />1. .............<br />2. .............<br />3. .............
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-base mb-2">PHẦN 2: ĐOẠN VĂN (8 - 10 CÂU)</h2>
          <p className="text-xs italic mb-2">Yêu cầu: Có dùng từ vựng chủ đề và liên từ "because".</p>
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="border-b border-gray-400 h-6 flex items-end text-xs">
                {i + 1}.
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReadingPassageModal
        isOpen={isReadingOpen}
        onClose={() => setIsReadingOpen(false)}
      />

    </div>
  );
}
