import React, { useState, useEffect } from 'react';
import { IDEA_CARDS, WORD_BANK, SAMPLE_STUDENT_ESSAY } from '../data/curriculumData';
import { IdeaCard, ChecklistState } from '../types';
import { analyzeEssay } from '../utils/textAnalysis';
import { playDing, speakEnglishText } from '../utils/audio';
import { Volume2, Sparkles, Check, CheckSquare, Square, ArrowRight, BookOpen, AlertCircle, BookmarkPlus } from 'lucide-react';

interface Step2DraftingProps {
  essayText: string;
  onChangeEssay: (text: string) => void;
  teamName: string;
  onChangeTeamName: (name: string) => void;
  selectedIdea: IdeaCard | null;
  onSelectIdea: (idea: IdeaCard) => void;
  onProceedToStep3: () => void;
}

export const Step2Drafting: React.FC<Step2DraftingProps> = ({
  essayText,
  onChangeEssay,
  teamName,
  onChangeTeamName,
  selectedIdea,
  onSelectIdea,
  onProceedToStep3,
}) => {
  const [activeVocabIdx, setActiveVocabIdx] = useState<number | null>(null);
  const [checklist, setChecklist] = useState<ChecklistState>({
    capitalLetters: false,
    fullStops: false,
    twoVocabWords: false,
    hasBecauseWord: false,
    practicedSpeaking: false,
  });

  const analysis = analyzeEssay(essayText);

  // Auto-sync checklist items based on analysis
  useEffect(() => {
    setChecklist(prev => ({
      ...prev,
      twoVocabWords: analysis.vocabCount >= 2,
      hasBecauseWord: analysis.hasBecause,
      capitalLetters: /[A-Z]/.test(essayText),
      fullStops: /[.!?]/.test(essayText)
    }));
  }, [analysis.vocabCount, analysis.hasBecause, essayText]);

  const handleSelectIdeaCard = (card: IdeaCard) => {
    playDing();
    onSelectIdea(card);
  };

  const handleInsertSentenceStarter = () => {
    if (!selectedIdea) return;
    playDing();
    const starter = selectedIdea.starter;
    if (!essayText.includes(starter)) {
      const newText = essayText ? `${essayText}\n\n${starter}` : starter;
      onChangeEssay(newText);
    }
  };

  const handleLoadSampleEssay = () => {
    playDing();
    onChangeEssay(SAMPLE_STUDENT_ESSAY);
  };

  const handlePlayVocabAudio = (word: string) => {
    speakEnglishText(word);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title & Assignment Prompt */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-4 md:p-6 rounded-3xl border border-indigo-200 glass-panel">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-black rounded-full uppercase tracking-wider">
                Kỹ năng Viết (Drafting)
              </span>
              <span className="text-xs font-bold text-gray-500">Global Success 10 • Unit 3</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-indigo-700 mt-1">
              BƯỚC 2: Chọn &amp; Viết Đoạn Văn ✍️
            </h2>
          </div>

          {/* Quick Sample Button for Demo/Teachers */}
          <button
            onClick={handleLoadSampleEssay}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl transition shadow-sm"
            title="Tải bài viết mẫu chuẩn 10 câu để kiểm thử nhanh"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tải bài viết mẫu (Demo)</span>
          </button>
        </div>

        {/* Textbook Task Quote */}
        <div className="mt-4 p-4 rounded-2xl bg-white/80 border-l-4 border-indigo-600 flex items-start gap-3 shadow-sm">
          <span className="text-2xl">📝</span>
          <div>
            <p className="font-extrabold text-gray-900 text-base">
              Đề bài SGK: <em>"Work in pairs. Tell your partner what you find most interesting about chau van singing."</em>
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Hãy viết một đoạn văn từ <strong>8 đến 10 câu</strong> chia sẻ về nét thú vị nhất của Chau van singing (nhạc cụ, trang phục, điệu múa, nhịp điệu...). Nhớ dùng liên từ <strong>"because"</strong> và ít nhất <strong>2 từ vựng chủ đề</strong>!
            </p>
          </div>
        </div>
      </div>

      {/* Main Drafting Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Team Name & Ideas & Vocab (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Card 1: Team Name */}
          <div className="glass-panel p-5 rounded-3xl border-2 border-purple-200 shadow-sm space-y-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-purple-900 mb-1.5">
                🌟 Tên Đội Thi Của Bạn (Team Name):
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => onChangeTeamName(e.target.value)}
                placeholder="Nhập tên nhóm, ví dụ: The Melody Stars..."
                className="w-full bg-white border-2 border-purple-200 rounded-2xl p-3 text-gray-900 font-extrabold text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>
          </div>

          {/* Card 2: 5 Idea Cards */}
          <div className="glass-panel p-5 rounded-3xl bg-amber-50/70 border-2 border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-amber-900 text-sm flex items-center gap-1.5">
                <span>💡</span>
                <span>5 Thẻ Ý Tưởng (Chọn 1 ý chính):</span>
              </h3>
              {selectedIdea && (
                <button
                  onClick={handleInsertSentenceStarter}
                  className="text-[11px] font-black text-amber-800 bg-amber-200/80 hover:bg-amber-300 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                  title="Chèn câu mở đầu gợi ý vào bài viết"
                >
                  <BookmarkPlus className="w-3 h-3" />
                  <span>Dùng câu mở đầu</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {IDEA_CARDS.map((card) => {
                const isSelected = selectedIdea?.id === card.id;
                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelectIdeaCard(card)}
                    className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-amber-100 border-amber-400 shadow-sm ring-2 ring-amber-300'
                        : 'bg-white hover:bg-amber-50/80 border-amber-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="idea-card"
                      checked={isSelected}
                      onChange={() => handleSelectIdeaCard(card)}
                      className="text-amber-600 focus:ring-amber-400 w-4 h-4 cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-extrabold text-sm text-gray-900 leading-snug">{card.title}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Interactive Word Bank */}
          <div className="glass-panel p-5 rounded-3xl bg-blue-50/80 border-2 border-blue-200 shadow-sm space-y-3">
            <h3 className="font-black text-blue-900 text-sm flex items-center gap-1.5">
              <span>📚</span>
              <span>Ngân Hàng Từ Vựng Chủ Đề (Click xem nghĩa &amp; nghe phát âm):</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {WORD_BANK.map((v, idx) => {
                const isActive = activeVocabIdx === idx;
                const isUsedInEssay = analysis.foundVocab.includes(v.word);
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveVocabIdx(isActive ? null : idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border shadow-sm ${
                      isUsedInEssay
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400'
                        : isActive
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-blue-800 hover:bg-blue-100 border-blue-200'
                    }`}
                  >
                    <span>{v.word}</span>
                    {isUsedInEssay && <Check className="w-3 h-3 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {activeVocabIdx !== null && (
              <div className="mt-3 p-3 bg-white rounded-2xl border-2 border-blue-200 shadow-sm text-xs space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-black text-blue-700">{WORD_BANK[activeVocabIdx].word}</strong>
                    <span className="text-[11px] font-mono text-gray-500">{WORD_BANK[activeVocabIdx].phonetic}</span>
                  </div>
                  <button
                    onClick={() => handlePlayVocabAudio(WORD_BANK[activeVocabIdx].word)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Nghe phát âm từ này"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-800 font-bold">Nghĩa: {WORD_BANK[activeVocabIdx].mean}</p>
                <p className="text-gray-600 italic">Ví dụ: "{WORD_BANK[activeVocabIdx].ex}"</p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Essay Textarea & Smart Counters (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Main Writing Canvas */}
          <div className="glass-panel p-6 rounded-3xl border-2 border-indigo-200 shadow-lg flex-1 flex flex-col relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <span>✍️</span>
                <span>Bài Viết Đoạn Văn Của Học Sinh (8 - 10 câu):</span>
              </span>
              <span className="text-xs font-bold text-gray-500">
                {essayText.trim() ? '✓ Đã tự động lưu nháp' : 'Chưa có nội dung'}
              </span>
            </div>

            <textarea
              value={essayText}
              onChange={(e) => onChangeEssay(e.target.value)}
              placeholder="Học sinh tự gõ bài viết vào đây (mục tiêu 8-10 câu). Ví dụ: Chau van singing is an ancient form of Vietnamese performance art... I love this style because..."
              className="w-full flex-1 min-h-[300px] bg-white border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-2xl p-5 text-gray-900 text-base md:text-lg font-medium leading-relaxed resize-none shadow-inner outline-none transition"
            />

            {/* Real-time Smart Counters */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              
              {/* Counter 1: Sentence Count */}
              <div className={`p-3 rounded-2xl border-2 transition ${
                analysis.isValidLength
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}>
                <span className="block text-[11px] font-black uppercase text-gray-500 mb-0.5">
                  Số câu (Mục tiêu 8-10)
                </span>
                <span className={`text-2xl font-black ${
                  analysis.isValidLength ? 'text-emerald-600' : 'text-gray-800'
                }`}>
                  {analysis.sentenceCount}/10
                </span>
                <span className="block text-[10px] font-bold mt-0.5">
                  {analysis.isValidLength ? '✓ Đạt chuẩn' : analysis.sentenceCount < 8 ? 'Cần thêm câu' : 'Quá 10 câu'}
                </span>
              </div>

              {/* Counter 2: Word Count */}
              <div className="p-3 bg-gray-50 rounded-2xl border-2 border-gray-200 text-gray-700">
                <span className="block text-[11px] font-black uppercase text-gray-500 mb-0.5">
                  Tổng số từ
                </span>
                <span className="text-2xl font-black text-gray-800">
                  {analysis.wordCount}
                </span>
                <span className="block text-[10px] font-bold text-gray-500 mt-0.5">
                  từ tiếng Anh
                </span>
              </div>

              {/* Counter 3: Vocab Count */}
              <div className={`p-3 rounded-2xl border-2 transition ${
                analysis.vocabCount >= 2
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}>
                <span className="block text-[11px] font-black uppercase text-gray-500 mb-0.5">
                  Từ vựng chủ đề
                </span>
                <span className={`text-2xl font-black ${
                  analysis.vocabCount >= 2 ? 'text-emerald-600' : 'text-gray-800'
                }`}>
                  {analysis.vocabCount}/2
                </span>
                <span className="block text-[10px] font-bold mt-0.5">
                  {analysis.vocabCount >= 2 ? '✓ Đạt chuẩn' : 'Cần ít nhất 2 từ'}
                </span>
              </div>

              {/* Counter 4: Conjunction 'because' */}
              <div className={`p-3 rounded-2xl border-2 transition ${
                analysis.hasBecause
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}>
                <span className="block text-[11px] font-black uppercase text-gray-500 mb-0.5">
                  Có "because"
                </span>
                <span className={`text-2xl font-black ${
                  analysis.hasBecause ? 'text-emerald-600' : 'text-rose-500'
                }`}>
                  {analysis.hasBecause ? '✔ Có' : '✘ Chưa có'}
                </span>
                <span className="block text-[10px] font-bold mt-0.5">
                  {analysis.hasBecause ? '✓ Có giải thích lý do' : 'Thêm "because"'}
                </span>
              </div>

            </div>

            {/* Pedagogical Principle Disclaimer */}
            <p className="text-xs text-gray-500 mt-3 text-center italic font-semibold">
              * Nguyên tắc sư phạm: Học sinh tự viết 100%, bộ đếm thông minh chỉ đóng vai trò giàn giáo hỗ trợ.
            </p>
          </div>

          {/* Student Self-Check Checklist */}
          <div className="glass-panel p-5 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 shadow-sm space-y-3">
            <h3 className="font-black text-emerald-900 text-sm flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>Checklist Tự Kiểm Tra Bài Viết (Student Self-Check):</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-bold text-gray-800">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-emerald-100">
                {checklist.capitalLetters ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
                <span className={checklist.capitalLetters ? 'text-emerald-900' : 'text-gray-600'}>
                  Viết hoa chữ cái đầu câu
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-emerald-100">
                {checklist.fullStops ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
                <span className={checklist.fullStops ? 'text-emerald-900' : 'text-gray-600'}>
                  Có dấu chấm kết thúc câu
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-emerald-100">
                {checklist.twoVocabWords ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
                <span className={checklist.twoVocabWords ? 'text-emerald-900' : 'text-gray-600'}>
                  Dùng ít nhất 2 từ vựng chủ đề
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-emerald-100">
                {checklist.hasBecauseWord ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
                <span className={checklist.hasBecauseWord ? 'text-emerald-900' : 'text-gray-600'}>
                  Có liên từ "because" giải thích
                </span>
              </div>
            </div>
          </div>

          {/* Action Button: Proceed to Step 3 */}
          <div className="flex justify-end">
            <button
              onClick={onProceedToStep3}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-4 px-8 rounded-2xl text-base shadow-xl shadow-indigo-500/25 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Tiếp Tục Sang Bước 3: Tạo Poster AI</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
