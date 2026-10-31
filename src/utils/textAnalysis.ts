import { EssayCounters, MindMapAnswers, MindMapState } from '../types';
import { WORD_BANK, MINDMAP_ACCEPTED_ANSWERS } from '../data/curriculumData';

export function analyzeEssay(text: string): EssayCounters {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      sentenceCount: 0,
      wordCount: 0,
      vocabCount: 0,
      foundVocab: [],
      hasBecause: false,
      isValidLength: false
    };
  }

  // Count words
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Count sentences: split by ., !, ?, or newlines that represent ends of sentences
  const sentenceMatches = trimmed.match(/[^.!?\n]+[.!?]+|[^.!?\n]+$/g) || [];
  const validSentences = sentenceMatches.map(s => s.trim()).filter(s => s.length > 5);
  const sentenceCount = validSentences.length;

  // Check because
  const hasBecause = /\bbecause\b/i.test(trimmed);

  // Check topic vocabulary
  const foundVocab: string[] = [];
  WORD_BANK.forEach(item => {
    // Escaped regex for word
    const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(trimmed)) {
      foundVocab.push(item.word);
    }
  });

  // Also check individual terms like 'chau van', 'drum', 'costume', 'instrument', 'lute', 'heroes', 'worship'
  const extraTerms = ['chau van', 'instrument', 'costume', 'lute', 'heritage', 'ritual', 'worship', 'heroes', 'psychic'];
  extraTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(trimmed) && !foundVocab.includes(term)) {
      foundVocab.push(term);
    }
  });

  const vocabCount = foundVocab.length;
  const isValidLength = sentenceCount >= 8 && sentenceCount <= 10;

  return {
    sentenceCount,
    wordCount,
    vocabCount,
    foundVocab,
    hasBecause,
    isValidLength
  };
}

export interface EvaluationResult {
  score: number;
  maxScore: number;
  fieldResults: Record<keyof MindMapState, boolean>;
  groupResults: {
    origin: { correct: number; total: number };
    types: { correct: number; total: number };
    instruments: { correct: number; total: number };
    costumes: { correct: number; total: number };
  };
}

function normalizeStr(str: string): string {
  return str
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function evaluateMindMap(state: MindMapState): EvaluationResult {
  const fieldResults: Record<keyof MindMapState, boolean> = {
    originWhen: false,
    originWhere: false,
    type1: false,
    type2: false,
    inst1: false,
    inst2: false,
    inst3: false,
    inst4: false,
    costume1: false,
    costume2: false,
    costume3: false,
  };

  let score = 0;

  // 1. ORIGIN WHEN (Accept: 16th century, 16th, the 16th century, 16)
  const normWhen = normalizeStr(state.originWhen);
  if (normWhen.includes('16') || normWhen.includes('sixteenth')) {
    fieldResults.originWhen = true;
    score++;
  }

  // 2. ORIGIN WHERE (Accept: northern delta, north delta, northern delta region, viet nam northern delta)
  const normWhere = normalizeStr(state.originWhere);
  if (normWhere.includes('northern delta') || (normWhere.includes('north') && normWhere.includes('delta'))) {
    fieldResults.originWhere = true;
    score++;
  }

  // Helper for flexible set matching (order independent)
  function matchGroup(
    keys: (keyof MindMapState)[],
    targetAnswers: string[],
    groupName: 'types' | 'instruments' | 'costumes'
  ) {
    const usedTargets: string[] = [];

    keys.forEach(k => {
      const val = normalizeStr(state[k]);
      if (!val) return;

      // Find an unmatched target
      const matched = targetAnswers.find(target => {
        const normTarget = normalizeStr(target);
        if (usedTargets.includes(normTarget)) return false;

        // Lenient matching: substring in either direction or specific aliases
        if (val === normTarget || val.includes(normTarget) || normTarget.includes(val)) {
          return true;
        }

        // Aliases
        if (groupName === 'types') {
          if (val.includes('tho') && normTarget.includes('tho')) return true;
          if (val.includes('hau') && normTarget.includes('hau')) return true;
          if (val.includes('worship') && (normTarget.includes('tho') || normTarget.includes('worship'))) return true;
        }

        if (groupName === 'instruments') {
          if (val.includes('lute') && normTarget.includes('lute')) return true;
          if (val.includes('dan nguyet') && normTarget.includes('lute')) return true;
          if (val.includes('clapper') && normTarget.includes('clapper')) return true;
          if (val.includes('drum') && normTarget.includes('drum')) return true;
          if (val.includes('gong') && normTarget.includes('gong')) return true;
        }

        if (groupName === 'costumes') {
          if (val.includes('cloth') && normTarget.includes('cloth')) return true;
          if (val.includes('hat') && normTarget.includes('hat')) return true;
          if (val.includes('belt') && normTarget.includes('belt')) return true;
        }

        return false;
      });

      if (matched) {
        fieldResults[k] = true;
        score++;
        usedTargets.push(normalizeStr(matched));
      }
    });
  }

  // Types: 2 slots from MINDMAP_ACCEPTED_ANSWERS.types
  matchGroup(['type1', 'type2'], MINDMAP_ACCEPTED_ANSWERS.types, 'types');

  // Instruments: 4 slots from MINDMAP_ACCEPTED_ANSWERS.instruments
  matchGroup(['inst1', 'inst2', 'inst3', 'inst4'], MINDMAP_ACCEPTED_ANSWERS.instruments, 'instruments');

  // Costumes: 3 slots from MINDMAP_ACCEPTED_ANSWERS.costumes
  matchGroup(['costume1', 'costume2', 'costume3'], MINDMAP_ACCEPTED_ANSWERS.costumes, 'costumes');

  const originCorrect = (fieldResults.originWhen ? 1 : 0) + (fieldResults.originWhere ? 1 : 0);
  const typesCorrect = (fieldResults.type1 ? 1 : 0) + (fieldResults.type2 ? 1 : 0);
  const instCorrect = (fieldResults.inst1 ? 1 : 0) + (fieldResults.inst2 ? 1 : 0) + (fieldResults.inst3 ? 1 : 0) + (fieldResults.inst4 ? 1 : 0);
  const costumeCorrect = (fieldResults.costume1 ? 1 : 0) + (fieldResults.costume2 ? 1 : 0) + (fieldResults.costume3 ? 1 : 0);

  return {
    score,
    maxScore: 11,
    fieldResults,
    groupResults: {
      origin: { correct: originCorrect, total: 2 },
      types: { correct: typesCorrect, total: 2 },
      instruments: { correct: instCorrect, total: 4 },
      costumes: { correct: costumeCorrect, total: 3 }
    }
  };
}

export interface ExtractedPosterContent {
  title: string;
  subTitle: string;
  keyPhrases: string[];
  visualStyle: string;
  fullPrompt: string;
  vietnameseGuidance: string;
}

export function generatePosterPrompt(
  essayText: string,
  teamName: string,
  selectedIdeaTitle?: string
): ExtractedPosterContent {
  const trimmed = essayText.trim();
  
  // Default values if essay is empty or brief
  let title = "CHAU VAN: ECHOES OF VIETNAMESE HERITAGE";
  const subTitle = teamName ? `By Team: ${teamName} • Unit 3 Music` : "Unit 3 Music • Global Success Grade 10";
  let keyPhrases = [
    "Origin: 16th Century Northern Delta",
    "Traditional Instruments: Lute & Clappers",
    "Spectacular Costumes & Silk Robes",
    "Sacred Spiritual Folk Heritage"
  ];

  if (trimmed) {
    // Extract intelligent title based on ideas found
    if (/instrument|lute|drum|sound|music/i.test(trimmed)) {
      title = "HARMONY OF CHAU VAN: SACRED MELODIES";
    } else if (/costume|hat|cloth|color|robe/i.test(trimmed)) {
      title = "SPLENDID COLORS OF CHAU VAN PERFORMANCE";
    } else if (/dance|ritual|singing style/i.test(trimmed)) {
      title = "SACRED RITUALS & RHYTHMS OF CHAU VAN";
    }

    if (selectedIdeaTitle) {
      if (selectedIdeaTitle.includes("instrument")) {
        title = "SOULFUL TRADITIONAL INSTRUMENTS OF CHAU VAN";
      } else if (selectedIdeaTitle.includes("costume")) {
        title = "DAZZLING TRADITIONAL COSTUMES OF CHAU VAN";
      } else if (selectedIdeaTitle.includes("singing style")) {
        title = "THE CAPTIVATING SINGING STYLE OF CHAU VAN";
      } else if (selectedIdeaTitle.includes("lively music")) {
        title = "ENERGETIC RHYTHMS OF CHAU VAN PERFORMANCE";
      }
    }

    // Extract sentences or clauses to build 4 concise speaking cues
    const extractedCues: string[] = [];
    if (/moon-shaped lute|lute/i.test(trimmed)) extractedCues.push("Moon-shaped lute with resonant tone");
    if (/bamboo clappers/i.test(trimmed)) extractedCues.push("Bamboo clappers driving rhythmic pace");
    if (/16th century|origin/i.test(trimmed)) extractedCues.push("Born in 16th century Northern Delta");
    if (/costume|colorful/i.test(trimmed)) extractedCues.push("Vibrant ceremonial robes & ornate hats");
    if (/because/i.test(trimmed)) extractedCues.push("Enchanting spiritual melody & ritual energy");
    if (/cultural heritage/i.test(trimmed)) extractedCues.push("Preserved national intangible heritage");

    // Ensure we have 4 high quality phrases
    const fallbackCues = [
      "16th Century Northern Delta Origin",
      "Traditional Lute, Drums & Bamboo Clappers",
      "Magnificent Robes, Hats & Silk Belts",
      "Intangible Cultural Heritage of Viet Nam"
    ];

    while (extractedCues.length < 4) {
      const nextFallback = fallbackCues.find(f => !extractedCues.includes(f));
      if (nextFallback) extractedCues.push(nextFallback);
      else break;
    }

    keyPhrases = extractedCues.slice(0, 4);
  }

  const prompt = `Create a flat vector educational presentation poster about "chau van singing" (traditional Vietnamese performance art).

Poster Content:
- Header Title: "${title}"
- Subtitle: "${subTitle}"
- 4 Key Presentation Cue Points arranged clearly on neat graphic ribbon cards:
  1. ${keyPhrases[0]}
  2. ${keyPhrases[1]}
  3. ${keyPhrases[2]}
  4. ${keyPhrases[3]}

Style & Aesthetics:
- Graphic design: Modern flat vector infographic style, clean composition, high contrast.
- Visual elements: Stylized Vietnamese traditional musical instruments (moon-shaped lute 'dan nguyet', bamboo clappers, drum) and subtle decorative folk patterns.
- Color palette: Vibrant 3-color palette (golden yellow, imperial teal/blue, and festival magenta).
- Typography: Large, bold, perfectly legible typography at the top; clear bullet cues for classroom presentation.
- Negative constraints: Clean geometric art, NO realistic human faces, NO distorted text, educational grade 10 presentation quality.`;

  return {
    title,
    subTitle,
    keyPhrases,
    visualStyle: "Modern Flat Vector Presentation Poster",
    fullPrompt: prompt,
    vietnameseGuidance: "Sao chép câu lệnh trên và dán vào Bing Image Creator / Microsoft Copilot, ChatGPT Plus, Canva Magic, hoặc Gemini để sinh tấm Poster thuyết trình chuẩn mực."
  };
}
