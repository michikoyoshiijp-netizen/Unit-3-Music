import { WordBankItem, IdeaCard, RoleItem, MindMapAnswers } from '../types';

export const READING_PASSAGE = {
  title: "Chau Van Singing - Global Success 10 (Unit 3: Music)",
  vietnameseTitle: "Hát Chầu Văn - Tiếng Anh 10 Global Success",
  englishText: `Chau van singing is an ancient form of Vietnamese performance art which combines singing and dancing. It started in the Northern Delta region of Viet Nam around the 16th century, and later spread to all parts of the country. It is used to praise the gods or national heroes.

There are several types of chau van singing. One typical type is hat tho or worship singing – the slow chanting including an act of worship. Another type is hat hau – the singing and dancing of a psychic.

The main musical instruments used in chau van performance are the moon-shaped lute, bamboo clappers, drum, and gong.

The costumes of chau van performances are very important. The style of clothes, hats, and belts depends on the rank of the gods or saints the performers worship. It has changed over time, but the rules about the colours have stayed the same.

As a form of traditional performance art, chau van singing was recognized as part of Vietnamese national culture.`,
  vietnameseText: `Hát chầu văn là một loại hình nghệ thuật biểu diễn cổ truyền của Việt Nam kết hợp giữa ca hát và vũ đạo. Nghệ thuật này bắt đầu ở vùng đồng bằng Bắc Bộ Việt Nam vào khoảng thế kỷ 16, và sau đó lan rộng ra khắp mọi miền đất nước. Chầu văn được dùng để ca ngợi các vị thần hoặc các anh hùng dân tộc.

Có một số loại hình hát chầu văn. Một loại hình tiêu biểu là hát thờ hay hát cúng (worship singing) – lối tụng niệm chậm rãi bao gồm hành động thờ cúng. Một loại hình khác là hát hầu – lối vừa hát vừa múa của người hành lễ (thanh đồng).

Các nhạc cụ chính được sử dụng trong biểu diễn chầu văn là đàn nguyệt (moon-shaped lute), phách tre (bamboo clappers), trống (drum) và chiêng (gong).

Trang phục biểu diễn chầu văn rất quan trọng. Kiểu dáng của áo (clothes), mũ (hats) và đai lưng (belts) phụ thuộc vào phẩm hàm của các vị thần hoặc vị thánh mà người biểu diễn phụng thờ. Trang phục đã thay đổi theo thời gian, nhưng các quy tắc về màu sắc vẫn được giữ nguyên.

Là một hình thức nghệ thuật biểu diễn truyền thống, hát chầu văn đã được công nhận là một phần của văn hóa dân tộc Việt Nam.`
};

export const WORD_BANK: WordBankItem[] = [
  { 
    word: "performance art", 
    mean: "nghệ thuật biểu diễn", 
    phonetic: "/pəˈfɔː.məns ɑːt/",
    ex: "Chau van is an ancient form of Vietnamese performance art." 
  },
  { 
    word: "origin", 
    mean: "nguồn gốc, khởi nguồn", 
    phonetic: "/ˈɒr.ɪ.dʒɪn/",
    ex: "Its origin started in the 16th century in the Northern Delta." 
  },
  { 
    word: "musical instruments", 
    mean: "nhạc cụ biểu diễn", 
    phonetic: "/ˈmjuː.zɪ.kəl ˈɪn.strə.mənts/",
    ex: "Musicians play traditional musical instruments like the moon-shaped lute." 
  },
  { 
    word: "moon-shaped lute", 
    mean: "đàn nguyệt", 
    phonetic: "/muːn ʃeɪpt luːt/",
    ex: "The moon-shaped lute produces enchanting melodic tones." 
  },
  { 
    word: "bamboo clappers", 
    mean: "phách tre", 
    phonetic: "/bæmˈbuː ˈklæp.əz/",
    ex: "The bamboo clappers keep the energetic rhythm of the song." 
  },
  { 
    word: "costumes", 
    mean: "trang phục truyền thống", 
    phonetic: "/ˈkɒs.tjuːmz/",
    ex: "Performers wear colorful costumes with beautiful hats and belts." 
  },
  { 
    word: "cultural heritage", 
    mean: "di sản văn hóa", 
    phonetic: "/ˈkʌl.tʃər.əl ˈher.ɪ.tɪdʒ/",
    ex: "Chau van is recognized as an invaluable national cultural heritage." 
  },
  { 
    word: "rituals", 
    mean: "nghi thức / nghi lễ thờ Mẫu", 
    phonetic: "/ˈrɪtʃ.u.əlz/",
    ex: "Hat hau singing is performed during sacred temple rituals." 
  }
];

export const IDEA_CARDS: IdeaCard[] = [
  {
    id: 1,
    title: "The traditional musical instruments",
    vnTitle: "Nhạc cụ truyền thống độc đáo",
    detail: "Đàn nguyệt, phách tre, trống, chiêng hòa quyện tạo nên nhịp điệu rộn ràng.",
    starter: "What I find most fascinating about chau van singing is the traditional musical instruments..."
  },
  {
    id: 2,
    title: "The beautiful costumes",
    vnTitle: "Trang phục biểu diễn lộng lẫy",
    detail: "Màu sắc rực rỡ của áo the, mũ cánh chuồn, thắt lưng đại diện cho các giá chầu.",
    starter: "In my opinion, the most impressive feature of chau van singing is the beautiful costumes..."
  },
  {
    id: 3,
    title: "The special singing style",
    vnTitle: "Phong cách hát tụng đặc biệt",
    detail: "Cách luyến láy, ngân nga huyền bí từ hát thờ trang nghiêm đến hát hầu linh hoạt.",
    starter: "I am really amazed by the special singing style of chau van vocalists..."
  },
  {
    id: 4,
    title: "The lively music and rhythm",
    vnTitle: "Giai điệu và nhịp phách sôi động",
    detail: "Nhịp phách biến hóa lúc chậm rãi trang nghiêm, lúc dồn dập khiến người nghe say mê.",
    starter: "To me, the most exciting element is the lively music and catchy rhythm..."
  },
  {
    id: 5,
    title: "The traditional spiritual dances",
    vnTitle: "Vũ đạo múa mồi, múa quạt, múa kiếm",
    detail: "Những điệu múa uyển chuyển thể hiện thần thái linh thiêng và bản sắc văn hóa Việt.",
    starter: "My partner and I are especially attracted to the traditional spiritual dances..."
  }
];

export const ROLES: RoleItem[] = [
  { id: "singer", name: "Lead Singer", icon: "🎤", duty: "Thuyết trình chính bài viết trước sân khấu" },
  { id: "lyricist", name: "Chief Lyricist", icon: "✍️", duty: "Kiểm tra cấu trúc câu, từ vựng và ngữ pháp" },
  { id: "producer", name: "Music Producer", icon: "🎧", duty: "Điều phối nhịp điệu và thời gian hoàn thành" },
  { id: "factchecker", name: "Fact-checker", icon: "🔎", duty: "Đối chiếu sự chính xác lịch sử và văn hóa" },
  { id: "backup", name: "Instrumentalist / Backup", icon: "🎸", duty: "Phụ trách phần tạo poster và hiệu ứng hình ảnh" },
  { id: "stagemc", name: "Stage MC", icon: "🎙️", duty: "Giới thiệu tiết mục và khơi gợi năng lượng" }
];

export const SCRAMBLED_KEYWORDS: string[] = [
  "drum",
  "hat tho",
  "16th century",
  "clothes",
  "bamboo clappers",
  "northern delta",
  "gong",
  "belts",
  "moon-shaped lute",
  "hats",
  "hat hau"
];

export const MINDMAP_ACCEPTED_ANSWERS: MindMapAnswers = {
  origin: ["16th century", "northern delta"],
  types: ["hat tho", "worship singing", "hat hau"],
  instruments: ["moon-shaped lute", "bamboo clappers", "drum", "gong"],
  costumes: ["clothes", "hats", "belts"]
};

export const STEP_TIMERS: Record<string, number> = {
  step1: 180, // 3 mins
  step2: 300, // 5 mins
  step3: 120, // 2 mins
  step4: 0    // speaking room has its own flow
};

export const SAMPLE_STUDENT_ESSAY = `Chau van singing is an ancient form of Vietnamese performance art which combines singing and dancing. It started in the Northern Delta around the 16th century and spread to all parts of the country. Among all its elements, what I find most interesting is the traditional musical instruments. The combination of the moon-shaped lute, bamboo clappers, drum, and gong creates a uniquely lively rhythm. I love this performance because the melody of the moon-shaped lute is so emotional and captivating. Furthermore, the energetic beats of the bamboo clappers make audiences want to clap and dance along. The performers also wear special costumes with colorful clothes, hats, and belts. Chau van singing is deeply respected because it is used to praise the gods and national heroes. In conclusion, chau van singing is a precious treasure of Vietnamese national culture.`;
