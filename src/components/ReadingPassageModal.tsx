import React, { useState } from 'react';
import { X, BookOpen, Volume2, Globe, Sparkles } from 'lucide-react';
import { READING_PASSAGE } from '../data/curriculumData';
import { speakEnglishText, stopSpeaking } from '../utils/audio';

interface ReadingPassageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadingPassageModal: React.FC<ReadingPassageModalProps> = ({ isOpen, onClose }) => {
  const [showBilingual, setShowBilingual] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const handleTogglePlayAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakEnglishText(READING_PASSAGE.englishText, () => setIsPlayingAudio(false), 0.85);
    }
  };

  const handleClose = () => {
    stopSpeaking();
    setIsPlayingAudio(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-yellow-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-500 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-yellow-100">Global Success 10 • Unit 3: Music</span>
              <h2 className="text-xl font-black">{READING_PASSAGE.title}</h2>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-full transition text-white"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 flex flex-wrap items-center justify-between gap-3 text-sm">
          <button
            onClick={handleTogglePlayAudio}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition shadow-sm ${
              isPlayingAudio ? 'bg-red-500 text-white animate-pulse' : 'bg-white hover:bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudio ? 'Dừng đọc mẫu' : 'Nghe phát âm chuẩn (Audio)'}</span>
          </button>

          <button
            onClick={() => setShowBilingual(!showBilingual)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold transition shadow-sm"
          >
            <Globe className="w-4 h-4" />
            <span>{showBilingual ? 'Ẩn bản dịch tiếng Việt' : 'Hiện song ngữ Anh - Việt'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-gray-800 text-base leading-relaxed">
          <div className="bg-gradient-to-br from-pink-50/70 to-blue-50/70 p-5 rounded-2xl border border-pink-100">
            <h3 className="font-black text-pink-700 text-lg mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              English Reading Passage (Global Success 10)
            </h3>
            <p className="whitespace-pre-line text-gray-800 font-medium text-lg leading-relaxed">
              {READING_PASSAGE.englishText}
            </p>
          </div>

          {showBilingual && (
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 animate-fadeIn">
              <h3 className="font-bold text-amber-900 text-sm uppercase tracking-wider mb-2">
                Bản dịch tham khảo Tiếng Việt:
              </h3>
              <p className="whitespace-pre-line text-gray-700 font-normal leading-relaxed">
                {READING_PASSAGE.vietnameseText}
              </p>
            </div>
          )}

          {/* Quick Vocab Highlights */}
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <h4 className="font-black text-blue-800 text-sm mb-2">📌 Từ khóa trọng tâm cần chú ý:</h4>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="bg-white text-blue-700 px-3 py-1 rounded-lg border border-blue-200">16th century (thế kỷ 16)</span>
              <span className="bg-white text-blue-700 px-3 py-1 rounded-lg border border-blue-200">Northern Delta (đồng bằng Bắc Bộ)</span>
              <span className="bg-white text-blue-700 px-3 py-1 rounded-lg border border-blue-200">hat tho &amp; hat hau</span>
              <span className="bg-white text-blue-700 px-3 py-1 rounded-lg border border-blue-200">praise the gods or national heroes</span>
              <span className="bg-white text-blue-700 px-3 py-1 rounded-lg border border-blue-200">moon-shaped lute (đàn nguyệt)</span>
              <span className="bg-white text-blue-700 px-3 py-1 rounded-lg border border-blue-200">bamboo clappers (phách)</span>
              <span className="bg-white text-blue-700 px-3 py-1 rounded-lg border border-blue-200">drum &amp; gong (trống &amp; chiêng)</span>
              <span className="bg-white text-blue-700 px-3 py-1 rounded-lg border border-blue-200">clothes, hats, belts</span>
              <span className="bg-white text-blue-700 px-3 py-1 rounded-lg border border-blue-200">singing and dancing of a psychic</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl transition"
          >
            Đóng bài đọc
          </button>
        </div>
      </div>
    </div>
  );
};
