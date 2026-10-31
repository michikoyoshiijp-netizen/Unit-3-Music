import React, { useState } from 'react';
import { IdeaCard, RoleItem } from '../types';
import { generatePosterPrompt, ExtractedPosterContent } from '../utils/textAnalysis';
import { playDing, playFanfare } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Copy, Check, ArrowRight, Image as ImageIcon, ExternalLink, Lightbulb, Download, Printer } from 'lucide-react';

interface Step3PosterAIProps {
  essayText: string;
  teamName: string;
  selectedIdea: IdeaCard | null;
  onProceedToStep4: () => void;
  onBackToStep2: () => void;
}

export const Step3PosterAI: React.FC<Step3PosterAIProps> = ({
  essayText,
  teamName,
  selectedIdea,
  onProceedToStep4,
  onBackToStep2,
}) => {
  const [copied, setCopied] = useState(false);
  const [posterData, setPosterData] = useState<ExtractedPosterContent | null>(null);

  const handleGeneratePrompt = () => {
    playDing();
    const data = generatePosterPrompt(essayText, teamName, selectedIdea?.title);
    setPosterData(data);
    playFanfare();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleCopyPrompt = () => {
    if (!posterData) return;
    try {
      navigator.clipboard.writeText(posterData.fullPrompt);
      setCopied(true);
      playDing();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const hasEssay = essayText.trim().length > 20;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title & Intro */}
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 p-4 md:p-6 rounded-3xl border border-purple-200 glass-panel">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-600 text-white text-xs font-black rounded-full uppercase tracking-wider">
                AI Tạo Sinh Có Kiểm Soát
              </span>
              <span className="text-xs font-bold text-gray-500">Global Success 10 • Unit 3</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-purple-700 mt-1">
              BƯỚC 3: Tạo Poster Thuyết Trình Bằng AI 🎨
            </h2>
            <p className="text-sm font-semibold text-gray-600 mt-1">
              Tự động đóng gói bài viết của nhóm thành câu lệnh (Prompt) chuẩn tiếng Anh để tạo Poster thuyết trình trực quan.
            </p>
          </div>

          {!hasEssay && (
            <button
              onClick={onBackToStep2}
              className="text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 px-4 py-2 rounded-xl transition shadow-sm"
            >
              ← Viết bài ở Bước 2 trước
            </button>
          )}
        </div>
      </div>

      {/* Main Generation Action Box */}
      <div className="glass-panel p-6 rounded-3xl border-2 border-purple-300 shadow-xl bg-gradient-to-br from-purple-50 via-white to-pink-50 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <Sparkles className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-xl font-black text-purple-900">
              Trình Tạo Câu Lệnh (Prompt Generator) Thông Minh
            </h3>
            <p className="text-sm text-gray-600 font-semibold mt-1">
              {hasEssay
                ? `Hệ thống sẽ lấy nội dung bài viết (${essayText.trim().split(/\s+/).length} từ) và thông tin Đội "${teamName || 'The Voice 10'}" để xuất bản câu lệnh.`
                : 'Bạn chưa có bài viết ở Bước 2, hệ thống sẽ sử dụng mẫu chuẩn của Unit 3 về Hát Chầu Văn.'}
            </p>
          </div>

          <button
            onClick={handleGeneratePrompt}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-purple-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 mx-auto cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>✨ BẤM VÀO ĐÂY ĐỂ TẠO PROMPT POSTER AI</span>
          </button>
        </div>
      </div>

      {/* Prompt Result & Live Poster Mockup Grid */}
      {posterData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Prompt Box (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="glass-panel p-6 rounded-3xl border-2 border-indigo-200 shadow-lg flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">📝</span>
                  <h4 className="font-black text-sm md:text-base text-indigo-900">
                    Lệnh Prompt Tiếng Anh (Chỉ cần Copy &amp; Paste):
                  </h4>
                </div>
                <button
                  onClick={handleCopyPrompt}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm ${
                    copied
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? '✓ Đã chép vào clipboard' : 'Sao chép Prompt'}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={posterData.fullPrompt}
                className="w-full flex-1 min-h-[300px] bg-slate-900 text-emerald-400 font-mono text-xs md:text-sm p-4 rounded-2xl border border-slate-700 focus:outline-none resize-none leading-relaxed shadow-inner"
              />

              <div className="mt-4 p-3.5 bg-yellow-50 rounded-2xl border border-yellow-200 flex items-start gap-2.5 text-xs text-yellow-900 font-medium">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Cách sử dụng:</strong> Bấm nút <strong>"Sao chép Prompt"</strong>, sau đó mở một trong các công cụ AI (như <em>Microsoft Copilot, Bing Image Creator, ChatGPT Plus, Canva Magic Media</em>) và dán (Ctrl+V) vào để sinh tấm Poster đẹp mắt!
                </p>
              </div>
            </div>
          </div>

          {/* Live Stage Poster Preview Mockup (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="glass-panel p-6 rounded-3xl border-2 border-pink-200 shadow-lg flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🖼️</span>
                  <h4 className="font-black text-sm md:text-base text-pink-900">
                    Bản Xem Trước Poster Trực Quan (Live Stage Mockup):
                  </h4>
                </div>
                <span className="px-2.5 py-1 bg-pink-100 text-pink-800 text-xs font-black rounded-lg">
                  Preview 100%
                </span>
              </div>

              {/* The Live Poster Virtual Canvas */}
              <div className="w-full bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 text-white p-6 rounded-2xl border-4 border-amber-400/80 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
                
                {/* Decorative Stage Lighting & Patterns */}
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute top-2 right-3 text-[10px] font-mono text-amber-300 font-bold tracking-widest uppercase">
                  THE VOICE 10 • UNIT 3: MUSIC
                </div>

                {/* Poster Header */}
                <div className="text-center z-10 space-y-1 mt-2">
                  <div className="inline-block px-3 py-0.5 bg-amber-400/30 border border-amber-400/60 rounded-full text-[10px] font-black tracking-wider text-amber-300 uppercase">
                    Traditional Vietnamese Performance Art
                  </div>
                  <h3 className="text-xl md:text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-pink-300 leading-tight">
                    {posterData.title}
                  </h3>
                  <p className="text-xs text-indigo-200 font-semibold">
                    {posterData.subTitle}
                  </p>
                </div>

                {/* Center Visual: Stylized Chau Van Instruments Illustration */}
                <div className="my-4 py-3 px-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm z-10">
                  <div className="flex items-center justify-around text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl">🪕</span>
                      <span className="text-[10px] font-bold text-amber-200 mt-1">Đàn Nguyệt</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl">🥢</span>
                      <span className="text-[10px] font-bold text-amber-200 mt-1">Phách Tre</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl">🥁</span>
                      <span className="text-[10px] font-bold text-amber-200 mt-1">Trống</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl">🔔</span>
                      <span className="text-[10px] font-bold text-amber-200 mt-1">Chiêng</span>
                    </div>
                  </div>
                </div>

                {/* 4 Presentation Speaking Cues */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 z-10 mb-2">
                  {posterData.keyPhrases.map((phrase, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400/15 to-pink-500/15 border border-amber-300/30 flex items-center gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-gray-950 text-xs font-black flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-gray-100 leading-snug">
                        {phrase}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Tag */}
                <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[10px] text-gray-400 z-10">
                  <span>Grade 10 Global Success • Music</span>
                  <span>National Intangible Cultural Heritage</span>
                </div>
              </div>

              {/* Action Buttons for Poster */}
              <div className="flex items-center justify-between gap-3 mt-4">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Poster này</span>
                </button>

                <button
                  onClick={onProceedToStep4}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs md:text-sm rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <span>Sang Bước 4: Luyện Nói AI</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Suggested AI Tools Guidelines */}
      <div className="glass-panel p-6 rounded-3xl border-2 border-yellow-300 relative bg-white">
        <div className="inline-block bg-yellow-400 text-yellow-950 font-black px-4 py-1 rounded-full text-xs shadow-sm mb-3">
          HƯỚNG DẪN DÀNH CHO HỌC SINH &amp; NHÓM
        </div>
        <p className="text-gray-800 text-base md:text-lg font-bold">
          Sau khi tạo câu lệnh, em hãy <span className="text-pink-600">sao chép (Copy) và dán (Paste) vào chatbot AI</span> (ví dụ: Bing Image Creator / Copilot, ChatGPT, Gemini, Canva...) để AI giúp nhóm tạo Poster hoàn chỉnh nhé! Tấm Poster này sẽ là tài liệu trực quan tuyệt vời cho phần thuyết trình ở Bước 4! 🚀
        </p>
      </div>

    </div>
  );
};
