import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { WORD_BANK } from '../data/curriculumData';
import { playDing, playFanfare, speakEnglishText, stopSpeaking } from '../utils/audio';
import { Mic, MicOff, Volume2, RotateCcw, Award, Star, ArrowLeft, Play, CheckCircle2, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';

interface Step4SpeakingRoomProps {
  essayText: string;
  onSetEssay: (text: string) => void;
  teamName: string;
  onBackToStep2: () => void;
}

export interface StarEvaluation {
  stars: number; // 1 to 5 (0 if not spoken yet)
  label: string;
  subLabel: string;
  comment: string;
  clarityPercent: number;
  recognizedCount: number;
  matchedCount: number;
  totalWords: number;
  detectedTopicWords: string[];
}

export const Step4SpeakingRoom: React.FC<Step4SpeakingRoomProps> = ({
  essayText,
  onSetEssay,
  teamName,
  onBackToStep2,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeakingModel, setIsSpeakingModel] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const recognitionRef = useRef<any>(null);
  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Student's real essay text (no default pre-filled sample text!)
  const studentScript = essayText.trim();
  const hasScript = studentScript.length > 0;

  // Split target words from student's essay (if available)
  const targetWords = hasScript ? studentScript.split(/\s+/).filter(w => w.trim().length > 0) : [];

  // Spoken text processing
  const fullSpoken = `${transcript} ${interimTranscript}`.trim();
  const cleanSpoken = fullSpoken.toLowerCase().replace(/[.,!?;:"]/g, ' ');
  const spokenTokens = cleanSpoken.split(/\s+/).filter(w => w.length > 0);

  // Match spoken tokens with target words (if student wrote an essay)
  const matchedIndices = new Set<number>();
  if (hasScript) {
    const spokenCopy = [...spokenTokens];
    targetWords.forEach((origWord, idx) => {
      const cleanWord = origWord.toLowerCase().replace(/[.,!?;:"]/g, '');
      const foundIdx = spokenCopy.indexOf(cleanWord);
      if (foundIdx !== -1 && cleanWord !== '') {
        matchedIndices.add(idx);
        spokenCopy.splice(foundIdx, 1);
      }
    });
  }

  // Detect Unit 3 Chau Van topic vocabulary in spoken tokens
  const detectedTopicWords: string[] = [];
  const topicKeywordsToCheck = [
    'chau van', 'performance art', 'origin', 'instrument', 'instruments',
    'lute', 'moon-shaped', 'clappers', 'bamboo', 'drum', 'gong',
    'costume', 'costumes', 'clothes', 'hats', 'belts', 'heritage',
    'ritual', 'rituals', 'hat tho', 'hat hau', 'worship', 'gods',
    'national heroes', 'heroes', 'psychic', 'because', 'ancient', 'singing'
  ];

  topicKeywordsToCheck.forEach(keyword => {
    if (cleanSpoken.includes(keyword) && !detectedTopicWords.includes(keyword)) {
      detectedTopicWords.push(keyword);
    }
  });

  // Calculate 1 to 5 Star Rating
  const computeStarRating = (): StarEvaluation => {
    const recognizedCount = spokenTokens.length;

    if (recognizedCount === 0) {
      return {
        stars: 0,
        label: 'Chưa có bài nói',
        subLabel: 'Bật micro để bắt đầu phát âm',
        comment: 'Hãy bấm vào biểu tượng Micro, phát âm to và rõ ràng các từ tiếng Anh nhé!',
        clarityPercent: 0,
        recognizedCount: 0,
        matchedCount: 0,
        totalWords: targetWords.length,
        detectedTopicWords: []
      };
    }

    if (hasScript) {
      const total = targetWords.length;
      const matched = matchedIndices.size;
      const accuracy = total > 0 ? Math.round((matched / total) * 100) : 0;

      let stars = 1;
      let label = '⭐ Khởi Đầu (First Step)';
      let subLabel = 'Cần luyện tập thêm';
      let comment = 'Em đã bắt đầu phát âm! Hãy nói to hơn, chậm rãi và chú ý các âm cuối (ending sounds).';

      if (accuracy >= 85 || (matched >= 30 && detectedTopicWords.length >= 3)) {
        stars = 5;
        label = '⭐⭐⭐⭐⭐ Xuất Sắc (Master Singer)';
        subLabel = 'Phát âm cực kỳ chuẩn xác và trôi chảy';
        comment = 'Tuyệt vời! Em phát âm rất chuẩn xác, giọng vang rõ, làm chủ hoàn toàn bài nói sân khấu!';
      } else if (accuracy >= 70 || (matched >= 20 && detectedTopicWords.length >= 2)) {
        stars = 4;
        label = '⭐⭐⭐⭐ Giỏi (Talented Performer)';
        subLabel = 'Phát âm tốt, ngữ điệu tự nhiên';
        comment = 'Rất tốt! Đa số từ vựng chủ đề được phát âm rõ ràng, nhịp điệu bài nói tự nhiên và tự tin.';
      } else if (accuracy >= 50 || matched >= 12) {
        stars = 3;
        label = '⭐⭐⭐ Khá (Promising Vocalist)';
        subLabel = 'Phát âm tương đối rõ';
        comment = 'Khá tốt! Em đã nói được phần lớn bài viết. Hãy nhấn nhá thêm trọng âm để bài nói hay hơn.';
      } else if (accuracy >= 30 || matched >= 5) {
        stars = 2;
        label = '⭐⭐ Cần Cố Gắng (Rising Star)';
        subLabel = 'Cần luyện phát âm to và rõ hơn';
        comment = 'Đang tiến bộ! Một số từ bị lướt qua hoặc phát âm chưa rõ, hãy thử luyện lại từng câu nhé.';
      }

      return {
        stars,
        label,
        subLabel,
        comment,
        clarityPercent: accuracy,
        recognizedCount,
        matchedCount: matched,
        totalWords: total,
        detectedTopicWords
      };
    } else {
      // Free speaking mode (student didn't pre-write in step 2)
      let stars = 1;
      let label = '⭐ Khởi Đầu (First Step)';
      let subLabel = 'Nhận diện được từ cơ bản';
      let comment = 'Em đã tự tin nói tiếng Anh! Hãy nói thêm các câu hoàn chỉnh về Hát Chầu Văn.';

      if (recognizedCount >= 30 && detectedTopicWords.length >= 2) {
        stars = 5;
        label = '⭐⭐⭐⭐⭐ Xuất Sắc (Master Singer)';
        subLabel = 'Nói tự do lưu loát, giàu từ vựng';
        comment = 'Đỉnh cao! Em nói tự do rất lưu loát và vận dụng nhiều từ vựng chủ đề Unit 3 chuẩn xác!';
      } else if (recognizedCount >= 20 || detectedTopicWords.length >= 2) {
        stars = 4;
        label = '⭐⭐⭐⭐ Giỏi (Talented Performer)';
        subLabel = 'Phát âm tốt, có từ vựng chủ đề';
        comment = 'Rất đáng khen! AI nhận diện được nhiều câu và từ vựng về Chau van singing của em.';
      } else if (recognizedCount >= 12) {
        stars = 3;
        label = '⭐⭐⭐ Khá (Promising Vocalist)';
        subLabel = 'Nói liên tục, AI bắt được từ';
        comment = 'Khá tốt! AI đã nghe được khá nhiều từ. Hãy nói chậm và rõ âm đuôi hơn nhé.';
      } else if (recognizedCount >= 5) {
        stars = 2;
        label = '⭐⭐ Cần Cố Gắng (Rising Star)';
        subLabel = 'Cần nói câu dài và rõ ràng hơn';
        comment = 'AI đã nhận diện được một số từ đầu tiên. Hãy tiếp tục nói thêm các câu tiếp theo nhé!';
      }

      const clarityPercent = Math.min(100, Math.round((recognizedCount / 25) * 100));

      return {
        stars,
        label,
        subLabel,
        comment,
        clarityPercent,
        recognizedCount,
        matchedCount: recognizedCount,
        totalWords: recognizedCount,
        detectedTopicWords
      };
    }
  };

  const evaluation = computeStarRating();

  // Celebrate on high score when recording stops
  const previousRecordingRef = useRef(isRecording);
  useEffect(() => {
    if (previousRecordingRef.current && !isRecording && evaluation.stars >= 4) {
      setHasEvaluated(true);
      playFanfare();
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.6 }
      });
    } else if (previousRecordingRef.current && !isRecording && evaluation.stars > 0) {
      setHasEvaluated(true);
    }
    previousRecordingRef.current = isRecording;
  }, [isRecording, evaluation.stars]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
    };
  }, []);

  const handleToggleRecording = () => {
    playDing();
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    setMicError(null);
    stopSpeaking();
    setIsSpeakingModel(false);

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setMicError('Trình duyệt chưa hỗ trợ Web Speech API. Bạn có thể sử dụng Google Chrome hoặc Edge trên máy tính để micro hoạt động tốt nhất!');
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            currentFinal += res[0].transcript + ' ';
          } else {
            interim += res[0].transcript;
          }
        }

        if (currentFinal) {
          setTranscript(prev => prev + currentFinal);
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicError('Quyền Micro bị chặn. Hãy bấm biểu tượng khóa/micro trên thanh địa chỉ trình duyệt và chọn "Cho phép" (Allow)!');
        } else if (event.error !== 'no-speech') {
          setMicError(`Thông báo Micro: ${event.error}.`);
        }
        stopRecording();
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setMicError('Không thể khởi động micro: ' + err.message);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsRecording(false);
  };

  const handleReset = () => {
    playDing();
    stopRecording();
    stopSpeaking();
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      setSimulating(false);
    }
    setTranscript('');
    setInterimTranscript('');
    setMicError(null);
    setHasEvaluated(false);
  };

  const handlePlayWordPronunciation = (word: string) => {
    speakEnglishText(word);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title & Stage Header */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-pink-500/10 p-4 md:p-6 rounded-3xl border border-orange-200 glass-panel">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black rounded-full uppercase tracking-wider shadow-sm">
                AI Nhận Diện Giọng Nói • Đánh Giá 1 - 5 Sao ⭐
              </span>
              <span className="text-xs font-bold text-gray-500">The Voice 10 Stage</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-orange-600 mt-1 flex items-center gap-2">
              <span>BƯỚC 4: Phòng Luyện Nói AI (AI Speaking Room)</span>
              <span>🎙️</span>
            </h2>
            <p className="text-sm font-semibold text-gray-600 mt-1">
              Học sinh tự nói vào Micro, AI tự động nhận diện từng từ theo thời gian thực và đánh giá phát âm từ <strong>1 đến 5 sao</strong>!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToStep2}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-2xl text-xs md:text-sm border border-gray-200 transition shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Chỉnh sửa bài viết ở Bước 2</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Speaking Stage Card */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border-2 border-orange-200 shadow-xl bg-white space-y-6">
        
        {/* Stage Header Info & Star Badge Preview */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white text-2xl shadow-md">
              <span>🎤</span>
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base md:text-lg">
                Thuyết Trình Sân Khấu {teamName ? `• Đội: ${teamName}` : ''}
              </h3>
              <p className="text-xs text-gray-500 font-semibold">
                Tự tin nói to, rõ ràng trước micro
              </p>
            </div>
          </div>

          {/* 1 - 5 Stars Header Display */}
          <div className="flex flex-col items-center sm:items-end bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 px-5 py-2.5 rounded-2xl shadow-sm">
            <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider mb-0.5">
              Đánh Giá Phát Âm (1 - 5 Sao)
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-6 h-6 transition-all duration-300 ${
                    starIdx <= evaluation.stars
                      ? 'fill-amber-400 text-amber-500 filter drop-shadow scale-110'
                      : 'text-gray-300 fill-gray-100'
                  }`}
                />
              ))}
              <span className="ml-2 font-black text-xl text-amber-950 font-mono">
                {evaluation.stars > 0 ? `${evaluation.stars}/5` : '0/5'}
              </span>
            </div>
          </div>
        </div>

        {/* Central Big Microphone Button */}
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <div className="relative">
            {isRecording && (
              <span className="absolute -inset-4 rounded-full bg-red-500/25 animate-ping pointer-events-none" />
            )}
            <button
              onClick={handleToggleRecording}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-4 ${
                isRecording
                  ? 'bg-gradient-to-br from-red-500 to-rose-600 border-red-300 animate-pulse ring-8 ring-red-100'
                  : 'bg-gradient-to-br from-orange-500 via-amber-500 to-pink-500 border-amber-200 hover:from-orange-600 hover:to-pink-600'
              }`}
            >
              {isRecording ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
              <span className="text-xs font-black uppercase mt-1 tracking-wider">
                {isRecording ? 'Dừng nói' : 'Bật Micro'}
              </span>
            </button>
          </div>

          <p className={`font-black text-base md:text-lg text-center ${
            isRecording ? 'text-red-500 animate-pulse' : 'text-gray-800'
          }`}>
            {isRecording
              ? '🎙️ AI đang lắng nghe... Hãy nói to và phát âm rõ ràng nhé!'
              : 'Bấm vào Micro tròn phía trên để bắt đầu nói'}
          </p>

          {micError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-bold max-w-md text-center flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{micError}</span>
            </div>
          )}
        </div>

        {/* Live Audio Transcript Box (Real-time Word Recognition Stream) */}
        <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 p-5 rounded-3xl border-2 border-blue-200 shadow-sm text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
              <span>🎙️</span>
              <span>Từ vựng AI nhận diện được theo thời gian thực (Live Recognized Speech):</span>
            </span>
            <span className="text-xs font-extrabold text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">
              {spokenTokens.length} từ đã nói
            </span>
          </div>

          {fullSpoken ? (
            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-inner min-h-[70px]">
              <p className="text-base md:text-lg text-gray-800 leading-relaxed font-semibold">
                <span className="text-indigo-950 font-bold">{transcript}</span>
                <span className="text-indigo-500 italic opacity-85 ml-1">{interimTranscript}</span>
                {isRecording && <span className="inline-block w-2.5 h-5 bg-red-500 ml-1.5 animate-pulse rounded-sm" />}
              </p>
            </div>
          ) : (
            <div className="bg-white/80 p-4 rounded-2xl border border-dashed border-blue-200 text-center text-sm text-gray-500 font-semibold italic">
              Chưa có âm thanh. Hãy bấm Bật Micro và nói tiếng Anh để AI nhận diện từng từ của em.
            </div>
          )}

          {/* Detected Unit 3 Topic Keywords Tag Cloud */}
          {detectedTopicWords.length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200/60 flex items-center gap-2 flex-wrap text-xs">
              <span className="font-black text-blue-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Từ vựng chủ đề Unit 3 nhận diện được:</span>
              </span>
              {detectedTopicWords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-black rounded-lg border border-emerald-300 shadow-xs flex items-center gap-1"
                >
                  <span>{kw}</span>
                  <button
                    onClick={() => handlePlayWordPronunciation(kw)}
                    className="hover:text-emerald-950 transition"
                    title="Nghe lại phát âm từ này"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Script Section: Shows student's Step 2 essay if available, or guidance if empty */}
        {hasScript ? (
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 md:p-8 rounded-3xl border-2 border-gray-200 shadow-inner">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
              <span className="text-xs font-black uppercase text-gray-600 tracking-wider flex items-center gap-1.5">
                <span>📖</span>
                <span>Kịch bản đọc từ bài viết Bước 2 của em (Từ đọc đúng sẽ tự động bôi xanh):</span>
              </span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                {matchedIndices.size}/{targetWords.length} từ khớp
              </span>
            </div>

            <div className="text-lg md:text-xl leading-loose font-medium text-gray-800 flex flex-wrap gap-x-2.5 gap-y-3">
              {targetWords.map((word, idx) => {
                const isMatched = matchedIndices.has(idx);
                return (
                  <span
                    key={idx}
                    onClick={() => handlePlayWordPronunciation(word)}
                    className={`transition-all duration-300 rounded px-1.5 py-0.5 inline-block cursor-pointer ${
                      isMatched
                        ? 'text-emerald-800 font-black bg-emerald-200/80 border-b-4 border-emerald-500 transform scale-105 shadow-sm'
                        : 'text-gray-400 font-normal hover:text-indigo-600 hover:bg-gray-100'
                    }`}
                    title="Click để nghe phát âm mẫu từ này"
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-3xl bg-amber-50/80 border-2 border-amber-200 text-center space-y-2">
            <p className="text-sm font-bold text-amber-900">
              💡 <strong>Lưu ý:</strong> Em chưa viết đoạn văn ở Bước 2. Em có thể <strong>nói tự do</strong> bất kỳ câu tiếng Anh nào về Chau van singing (nhạc cụ, trang phục, nguồn gốc...), AI vẫn sẽ nhận diện và chấm điểm từ 1 - 5 sao!
            </p>
            <button
              onClick={onBackToStep2}
              className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 bg-amber-200 hover:bg-amber-300 px-4 py-2 rounded-xl transition shadow-sm"
            >
              <span>← Sang Bước 2 để gõ bài viết kịch bản trước</span>
            </button>
          </div>
        )}

        {/* 1 - 5 STARS PRONUNCIATION EVALUATION CARD */}
        <div className={`p-6 rounded-3xl border-3 transition-all duration-500 shadow-lg ${
          evaluation.stars >= 4
            ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-300 shadow-amber-500/10'
            : evaluation.stars >= 2
            ? 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-200'
            : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 border-gray-200'
        }`}>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Star Rating Display */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                Kết Quả Đánh Giá Phát Âm AI
              </span>
              
              {/* Star Icons */}
              <div className="flex items-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-9 h-9 transition-all duration-300 ${
                      starIdx <= evaluation.stars
                        ? 'fill-amber-400 text-amber-500 filter drop-shadow-md scale-110 animate-bounce'
                        : 'text-gray-300 fill-gray-100'
                    }`}
                    style={{ animationDelay: `${starIdx * 80}ms`, animationIterationCount: isRecording ? 'infinite' : '1' }}
                  />
                ))}
              </div>

              <div>
                <h4 className="text-xl md:text-2xl font-black text-gray-900">
                  {evaluation.label}
                </h4>
                <p className="text-xs md:text-sm font-bold text-amber-700">
                  {evaluation.subLabel}
                </p>
              </div>

              <p className="text-sm font-semibold text-gray-700 max-w-xl bg-white/80 p-3 rounded-2xl border border-amber-200/80 shadow-xs">
                {evaluation.comment}
              </p>
            </div>

            {/* Performance Metrics Breakdown */}
            <div className="w-full lg:w-auto grid grid-cols-3 gap-3 text-center">
              
              <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-sm min-w-[110px]">
                <span className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                  Số Sao Đạt Được
                </span>
                <span className="text-2xl md:text-3xl font-black text-amber-500 font-mono">
                  {evaluation.stars}/5 ⭐
                </span>
                <span className="block text-[10px] font-bold text-gray-600 mt-0.5">
                  Xếp hạng
                </span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-sm min-w-[110px]">
                <span className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                  Độ Khớp Từ
                </span>
                <span className="text-2xl md:text-3xl font-black text-emerald-600 font-mono">
                  {evaluation.clarityPercent}%
                </span>
                <span className="block text-[10px] font-bold text-gray-600 mt-0.5">
                  Độ chính xác
                </span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-sm min-w-[110px]">
                <span className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                  Từ Chủ Đề
                </span>
                <span className="text-2xl md:text-3xl font-black text-indigo-600 font-mono">
                  {evaluation.detectedTopicWords.length}
                </span>
                <span className="block text-[10px] font-bold text-gray-600 mt-0.5">
                  Từ Unit 3
                </span>
              </div>

            </div>

          </div>

          {/* Reset & Try Again Controls */}
          <div className="mt-5 pt-4 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-gray-500 font-semibold italic">
              * Tiêu chí 5 sao: Phát âm rõ ràng, nhịp điệu sân khấu tự tin, sử dụng từ vựng chủ đề Unit 3.
            </span>

            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-200 transition shadow-sm flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Luyện lại từ đầu</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
