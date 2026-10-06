import type { InterestId, Lang, SkillId, SwotQuadrant, TrilingualText } from '../types';

export interface InterestQuestion extends TrilingualText {
  id: InterestId;
}

export interface SwotQuestion extends TrilingualText {
  id: string;
}

export interface SkillDimension {
  id: SkillId;
  name: TrilingualText;
  questions: TrilingualText[];
}

export type SectionId = 'interests' | 'swot' | 'skills';

export const INTEREST_QUESTIONS: InterestQuestion[] = [
  {
    id: 'numbers',
    en: 'I enjoy working with numbers, financial data, and calculations.',
    hi: 'मुझे संख्याओं, वित्तीय डेटा और गणनाओं के साथ काम करना पसंद है।',
    mr: 'मला संख्या, वित्तीय डेटा आणि गणिते करायला आवडते.',
  },
  {
    id: 'sales',
    en: 'I like selling ideas, products, or convincing people.',
    hi: 'मुझे विचार या उत्पाद बेचना और लोगों को समझाना पसंद है।',
    mr: 'मला कल्पना किंवा उत्पादने विकायला आणि लोकांना पटवायला आवडते.',
  },
  {
    id: 'technology',
    en: 'I\'m curious about new technologies, tools, and software.',
    hi: 'मुझे नई तकनीकों, टूल और सॉफ़्टवेयर के बारे में जानने की उत्सुकता है।',
    mr: 'मला नवीन तंत्रज्ञान, टूल्स आणि सॉफ्टवेअरबद्दल जाणून घ्यायची उत्सुकता आहे.',
  },
  {
    id: 'data',
    en: 'I love analyzing data to find patterns and insights.',
    hi: 'मुझे डेटा का विश्लेषण करके पैटर्न और अंतर्दृष्टि निकालना पसंद है।',
    mr: 'मला डेटाचे विश्लेषण करून नमुने आणि अंतर्दृष्टी शोधायला आवडते.',
  },
  {
    id: 'peopleMgmt',
    en: 'I enjoy managing, mentoring, and helping people grow.',
    hi: 'मुझे लोगों को प्रबंधित करना, मार्गदर्शन देना और उनकी वृद्धि में मदद करना पसंद है।',
    mr: 'मला लोकांचे व्यवस्थापन, मार्गदर्शन आणि त्यांच्या वाढीस मदत करायला आवडते.',
  },
  {
    id: 'logistics',
    en: 'I like planning, organizing, and optimizing processes.',
    hi: 'मुझे योजना बनाना, व्यवस्थित करना और प्रक्रियाओं को अनुकूलित करना पसंद है।',
    mr: 'मला नियोजन करणे, संघटित करणे आणि प्रक्रिया सुधारणे आवडते.',
  },
  {
    id: 'strategy',
    en: 'I enjoy big-picture thinking and long-term planning.',
    hi: 'मुझे व्यापक स्तर पर सोचना और दीर्घकालिक योजना बनाना पसंद है।',
    mr: 'मला मोठ्या चित्राचा विचार करणे आणि दीर्घकालीन नियोजन करायला आवडते.',
  },
  {
    id: 'entrepreneurship',
    en: 'I\'m interested in starting or running my own venture someday.',
    hi: 'मैं भविष्य में अपना खुद का व्यवसाय शुरू करने में रुचि रखता/रखती हूँ।',
    mr: 'मला भविष्यात स्वतःचा व्यवसाय सुरू करायला आवडेल.',
  },
];

export const SWOT_QUESTIONS: Record<SwotQuadrant, SwotQuestion[]> = {
  S: [
    {
      id: 's1',
      en: 'I learn new concepts and tools quickly.',
      hi: 'मैं नई अवधारणाएँ और टूल जल्दी सीख लेता/लेती हूँ।',
      mr: 'मी नवीन संकल्पना आणि साधने लवकर शिकतो/शिकते.',
    },
    {
      id: 's2',
      en: 'I communicate my ideas clearly and confidently.',
      hi: 'मैं अपने विचार स्पष्ट और आत्मविश्वास से व्यक्त करता/करती हूँ।',
      mr: 'मी माझे विचार स्पष्ट आणि आत्मविश्वासाने मांडतो/मांडते.',
    },
    {
      id: 's3',
      en: 'I\'m good at solving problems under pressure.',
      hi: 'मैं दबाव में भी समस्याओं को अच्छे से हल करता/करती हूँ।',
      mr: 'मी दबावाखालीही समस्या चांगल्या प्रकारे सोडवतो/सोडवते.',
    },
    {
      id: 's4',
      en: 'I have strong academic fundamentals.',
      hi: 'मेरी शैक्षणिक बुनियाद मजबूत है।',
      mr: 'माझा शैक्षणिक पाया भक्कम आहे.',
    },
  ],
  W: [
    {
      id: 'w1',
      en: 'I struggle with public speaking or presentations.',
      hi: 'मुझे सार्वजनिक बोलने या प्रस्तुतीकरण में कठिनाई होती है।',
      mr: 'मला सार्वजनिक बोलणे किंवा सादरीकरण करणे अवघड जाते.',
    },
    {
      id: 'w2',
      en: 'I procrastinate on complex tasks.',
      hi: 'मैं जटिल कार्यों को टाल देता/देती हूँ।',
      mr: 'मी क्लिष्ट कामे पुढे ढकलतो/ढकलते.',
    },
    {
      id: 'w3',
      en: 'I find it hard to make decisions with incomplete information.',
      hi: 'अधूरी जानकारी में निर्णय लेना मुझे कठिन लगता है।',
      mr: 'अपुरी माहिती असताना निर्णय घेणे मला कठीण जाते.',
    },
    {
      id: 'w4',
      en: 'I get overwhelmed when handling multiple priorities.',
      hi: 'कई कार्य एक साथ करने पर मैं घबरा जाता/जाती हूँ।',
      mr: 'अनेक कामे एकाच वेळी करताना मी गोंधळून जातो/जाते.',
    },
  ],
  O: [
    {
      id: 'o1',
      en: 'I have access to industry mentors or networks.',
      hi: 'मेरे पास उद्योग जगत के मार्गदर्शक या नेटवर्क हैं।',
      mr: 'माझ्याकडे उद्योगातील मार्गदर्शक किंवा नेटवर्क आहे.',
    },
    {
      id: 'o2',
      en: 'There are strong placement opportunities in my target field.',
      hi: 'मेरे लक्षित क्षेत्र में अच्छे प्लेसमेंट अवसर हैं।',
      mr: 'माझ्या लक्षित क्षेत्रात चांगल्या प्लेसमेंट संधी आहेत.',
    },
    {
      id: 'o3',
      en: 'My city has growing industries I can work in.',
      hi: 'मेरे शहर में बढ़ते उद्योग हैं जिनमें मैं काम कर सकता/सकती हूँ।',
      mr: 'माझ्या शहरात वाढते उद्योग आहेत ज्यात मी काम करू शकतो/शकते.',
    },
    {
      id: 'o4',
      en: 'I can access online certifications to build new skills.',
      hi: 'मैं नए कौशल सीखने के लिए ऑनलाइन प्रमाणपत्र प्राप्त कर सकता/सकती हूँ।',
      mr: 'मी नवीन कौशल्ये शिकण्यासाठी ऑनलाइन प्रमाणपत्रे मिळवू शकतो/शकते.',
    },
  ],
  T: [
    {
      id: 't1',
      en: 'Competition in my field is very high.',
      hi: 'मेरे क्षेत्र में प्रतिस्पर्धा बहुत अधिक है।',
      mr: 'माझ्या क्षेत्रात स्पर्धा खूप जास्त आहे.',
    },
    {
      id: 't2',
      en: 'The job market is uncertain in my preferred area.',
      hi: 'मेरे पसंदीदा क्षेत्र में नौकरी का बाज़ार अनिश्चित है।',
      mr: 'माझ्या आवडत्या क्षेत्रात नोकरीचे बाजार अनिश्चित आहे.',
    },
    {
      id: 't3',
      en: 'AI/automation might replace some roles I\'m targeting.',
      hi: 'AI/ऑटोमेशन से मेरे लक्षित कुछ पद प्रभावित हो सकते हैं।',
      mr: 'AI/ऑटोमेशनमुळे माझ्या लक्षित काही पदांवर परिणाम होऊ शकतो.',
    },
    {
      id: 't4',
      en: 'I have limited financial/time resources for upskilling.',
      hi: 'नए कौशल सीखने के लिए मेरे पास सीमित वित्तीय/समय संसाधन हैं।',
      mr: 'नवीन कौशल्ये शिकण्यासाठी माझ्याकडे मर्यादित आर्थिक/वेळ संसाधने आहेत.',
    },
  ],
};

export const SWOT_ORDER: SwotQuadrant[] = ['S', 'W', 'O', 'T'];

export const SWOT_LABELS: Record<SwotQuadrant, TrilingualText> = {
  S: { en: 'Strengths', hi: 'ताकत (Strengths)', mr: 'सामर्थ्य (Strengths)' },
  W: { en: 'Weaknesses', hi: 'कमजोरियाँ (Weaknesses)', mr: 'उणीवा (Weaknesses)' },
  O: { en: 'Opportunities', hi: 'अवसर (Opportunities)', mr: 'संधी (Opportunities)' },
  T: { en: 'Threats', hi: 'खतरे (Threats)', mr: 'धोके (Threats)' },
};

export const SKILL_DIMENSIONS: SkillDimension[] = [
  {
    id: 'analytical',
    name: { en: 'Analytical Thinking', hi: 'विश्लेषणात्मक सोच', mr: 'विश्लेषणात्मक विचार' },
    questions: [
      {
        en: 'I break down complex problems into smaller parts.',
        hi: 'मैं जटिल समस्याओं को छोटे भागों में तोड़ता/तोड़ती हूँ।',
        mr: 'मी क्लिष्ट समस्यांचे छोट्या भागांत विभाजन करतो/करते.',
      },
      {
        en: 'I\'m comfortable reading charts, data, and reports.',
        hi: 'मैं चार्ट, डेटा और रिपोर्ट पढ़ने में सहज महसूस करता/करती हूँ।',
        mr: 'मला चार्ट, डेटा आणि अहवाल वाचायला सोपे जाते.',
      },
    ],
  },
  {
    id: 'leadership',
    name: { en: 'Leadership', hi: 'नेतृत्व', mr: 'नेतृत्व' },
    questions: [
      {
        en: 'I naturally take charge in group situations.',
        hi: 'मैं समूह में स्वाभाविक रूप से नेतृत्व लेता/लेती हूँ।',
        mr: 'मी समूहात नैसर्गिकपणे नेतृत्व घेतो/घेते.',
      },
      {
        en: 'People look up to me for direction.',
        hi: 'लोग मार्गदर्शन के लिए मेरी ओर देखते हैं।',
        mr: 'लोक मार्गदर्शनासाठी माझ्याकडे पाहतात.',
      },
    ],
  },
  {
    id: 'communication',
    name: { en: 'Communication', hi: 'संचार कौशल', mr: 'संवाद कौशल्य' },
    questions: [
      {
        en: 'I express myself clearly in writing and speech.',
        hi: 'मैं लेखन और बोलने में अपनी बात स्पष्ट रखता/रखती हूँ।',
        mr: 'मी लेखन आणि बोलण्यात स्वतःला स्पष्टपणे मांडतो/मांडते.',
      },
      {
        en: 'I\'m a good listener and understand others well.',
        hi: 'मैं एक अच्छा श्रोता/श्रोता हूँ और दूसरों को अच्छी तरह समझता/समझती हूँ।',
        mr: 'मी चांगला श्रोता आहे आणि इतरांना चांगल्या प्रकारे समजतो/समजते.',
      },
    ],
  },
  {
    id: 'creativity',
    name: { en: 'Creativity', hi: 'रचनात्मकता', mr: 'सर्जनशीलता' },
    questions: [
      {
        en: 'I often come up with fresh ideas or approaches.',
        hi: 'मैं अक्सर नए विचार या तरीके सोचता/सोचती हूँ।',
        mr: 'मी अनेकदा नवीन कल्पना किंवा दृष्टिकोन सुचवतो/सुचवते.',
      },
      {
        en: 'I enjoy design, writing, or creative hobbies.',
        hi: 'मुझे डिज़ाइन, लेखन या रचनात्मक शौक पसंद हैं।',
        mr: 'मला डिझाइन, लेखन किंवा सर्जनशील छंद आवडतात.',
      },
    ],
  },
  {
    id: 'decision',
    name: { en: 'Decision Making', hi: 'निर्णय लेने की क्षमता', mr: 'निर्णयक्षमता' },
    questions: [
      {
        en: 'I make confident decisions even with limited data.',
        hi: 'सीमित जानकारी में भी मैं आत्मविश्वास से निर्णय लेता/लेती हूँ।',
        mr: 'मर्यादित माहितीतही मी आत्मविश्वासाने निर्णय घेतो/घेते.',
      },
      {
        en: 'I weigh pros and cons systematically.',
        hi: 'मैं फायदे-नुकसान को व्यवस्थित रूप से तौलता/तौलती हूँ।',
        mr: 'मी फायदे-तोटे पद्धतशीरपणे मोजतो/मोजते.',
      },
    ],
  },
  {
    id: 'teamwork',
    name: { en: 'Team Management', hi: 'टीम प्रबंधन', mr: 'संघ व्यवस्थापन' },
    questions: [
      {
        en: 'I enjoy coordinating team efforts.',
        hi: 'मुझे टीम के प्रयासों का समन्वय करना पसंद है।',
        mr: 'मला संघाच्या प्रयत्नांचे समन्वय करायला आवडते.',
      },
      {
        en: 'I can resolve disagreements in a group.',
        hi: 'मैं समूह में मतभेद सुलझा सकता/सकती हूँ।',
        mr: 'मी समूहातील मतभेद सोडवू शकतो/शकते.',
      },
    ],
  },
  {
    id: 'problemSolving',
    name: { en: 'Problem Solving', hi: 'समस्या समाधान', mr: 'समस्या निराकरण' },
    questions: [
      {
        en: 'I enjoy solving puzzles and real-world problems.',
        hi: 'मुझे पहेलियाँ और वास्तविक समस्याएँ हल करना पसंद है।',
        mr: 'मला कोडी आणि वास्तविक समस्या सोडवायला आवडतात.',
      },
      {
        en: 'I persist until I find a solution.',
        hi: 'मैं समाधान मिलने तक प्रयास करता/करती रहता/रहती हूँ।',
        mr: 'उपाय सापडेपर्यंत मी प्रयत्न करत राहतो/राहते.',
      },
    ],
  },
  {
    id: 'data',
    name: { en: 'Data Orientation', hi: 'डेटा अभिविन्यास', mr: 'डेटा अभिमुखता' },
    questions: [
      {
        en: 'I enjoy working with spreadsheets and data.',
        hi: 'मुझे स्प्रेडशीट और डेटा के साथ काम करना पसंद है।',
        mr: 'मला स्प्रेडशीट आणि डेटासोबत काम करायला आवडते.',
      },
      {
        en: 'I trust data more than gut feeling.',
        hi: 'मैं सहज ज्ञान से अधिक डेटा पर भरोसा करता/करती हूँ।',
        mr: 'मी अंदाजापेक्षा डेटावर अधिक विश्वास ठेवतो/ठेवते.',
      },
    ],
  },
  {
    id: 'customer',
    name: { en: 'Customer Orientation', hi: 'ग्राहक अभिविन्यास', mr: 'ग्राहकाभिमुखता' },
    questions: [
      {
        en: 'I love understanding what customers want.',
        hi: 'मुझे ग्राहकों की आवश्यकताएँ समझना पसंद है।',
        mr: 'मला ग्राहकांच्या गरजा समजून घ्यायला आवडतात.',
      },
      {
        en: 'I empathize with users/consumers.',
        hi: 'मैं उपयोगकर्ताओं/ग्राहकों के प्रति संवेदनशील हूँ।',
        mr: 'मी वापरकर्ते/ग्राहक यांच्याशी सहानुभूती दाखवतो/दाखवते.',
      },
    ],
  },
  {
    id: 'process',
    name: { en: 'Process Orientation', hi: 'प्रक्रिया अभिविन्यास', mr: 'प्रक्रिया अभिमुखता' },
    questions: [
      {
        en: 'I like creating checklists and systems.',
        hi: 'मुझे चेकलिस्ट और सिस्टम बनाना पसंद है।',
        mr: 'मला चेकलिस्ट आणि प्रणाली तयार करायला आवडतात.',
      },
      {
        en: 'I notice inefficiencies and want to fix them.',
        hi: 'मैं अक्षमताओं को देखकर उन्हें सुधारना चाहता/चाहती हूँ।',
        mr: 'मला अकार्यक्षमता लक्षात येते आणि ती दुरुस्त करायची इच्छा होते.',
      },
    ],
  },
];

export const SECTIONS: { id: SectionId; label: TrilingualText }[] = [
  { id: 'interests', label: { en: 'Career Interests', hi: 'करियर रुचियाँ', mr: 'करिअर आवडी' } },
  { id: 'swot', label: { en: 'SWOT Analysis', hi: 'SWOT विश्लेषण', mr: 'SWOT विश्लेषण' } },
  {
    id: 'skills',
    label: { en: 'Aptitude & Personality', hi: 'अभिरुचि और व्यक्तित्व', mr: 'कौशल्य आणि व्यक्तिमत्व' },
  },
];

export const LANG_NAMES: Record<Lang, string> = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' };

export const INTRO_COPY: Record<Lang, { title: string; desc: string; rate: string; tip: string }> = {
  en: {
    title: 'Your Assessment',
    desc: 'Rate each statement on a 1–5 scale. All questions are shown in English, Hindi and Marathi.',
    rate: '1 = Strongly Disagree,  5 = Strongly Agree',
    tip: 'Choose the option that best reflects your honest opinion.',
  },
  hi: {
    title: 'आपका मूल्यांकन',
    desc: 'प्रत्येक कथन को 1–5 पैमाने पर रेट करें। सभी प्रश्न अंग्रेज़ी, हिन्दी और मराठी में दिए गए हैं।',
    rate: '1 = पूर्ण असहमत,  5 = पूर्ण सहमत',
    tip: 'वह विकल्प चुनें जो आपकी ईमानदार राय को सबसे बेहतर तरीके से दर्शाता हो।',
  },
  mr: {
    title: 'तुमचे मूल्यांकन',
    desc: 'प्रत्येक विधानाला १–५ च्या प्रमाणात रेट करा. सर्व प्रश्न इंग्रजी, हिन्दी आणि मराठीत दिले आहेत.',
    rate: '१ = पूर्ण असहमत,  ५ = पूर्ण सहमत',
    tip: 'तुमच्या प्रामाणिक मताचे प्रतिनिधित्व करणारा पर्याय निवडा.',
  },
};

export const UI_COPY: Record<
  Lang,
  { interests: string; swot: string; skills: string; progress: string; next: string; prev: string; generate: string }
> = {
  en: {
    interests: 'Career Interest Assessment',
    swot: 'SWOT Analysis',
    skills: 'Aptitude & Personality',
    progress: 'Progress',
    next: 'Next',
    prev: 'Previous',
    generate: 'Generate Recommendation',
  },
  hi: {
    interests: 'करियर रुचि मूल्यांकन',
    swot: 'SWOT विश्लेषण',
    skills: 'अभिरुचि एवं व्यक्तित्व',
    progress: 'प्रगति',
    next: 'अगला',
    prev: 'पिछला',
    generate: 'सिफ़ारिश देखें',
  },
  mr: {
    interests: 'करिअर रुची मूल्यांकन',
    swot: 'SWOT विश्लेषण',
    skills: 'कौशल्य आणि व्यक्तिमत्व',
    progress: 'प्रगती',
    next: 'पुढे',
    prev: 'मागे',
    generate: 'शिफारस मिळवा',
  },
};

export const SECTION_HINTS: Record<SectionId, TrilingualText> = {
  interests: {
    en: 'How much do you enjoy these activities?',
    hi: 'इन गतिविधियों को आप कितना पसंद करते/करती हैं?',
    mr: 'या उपक्रम तुम्हाला किती आवडतात?',
  },
  swot: {
    en: 'Rate yourself honestly — this drives your personal recommendations.',
    hi: 'स्वयं का ईमानदारी से मूल्यांकन करें — यही आपकी सिफ़ारिशें तय करेगा।',
    mr: 'स्वतःचे प्रामाणिकपणे मूल्यांकन करा — हेच तुमच्या शिफारसी ठरवेल.',
  },
  skills: {
    en: 'Rate yourself on each skill dimension based on the prompts.',
    hi: 'प्रत्येक कौशल आयाम पर स्वयं को रेट करें।',
    mr: 'प्रत्येक कौशल्यावर स्वतःला रेट करा.',
  },
};

export interface ScalePoint {
  n: 1 | 2 | 3 | 4 | 5;
  color: string;
  label: TrilingualText;
}

export const RATING_SCALE: ScalePoint[] = [
  { n: 1, color: '#dc2626', label: { en: 'Strongly Disagree', hi: 'पूर्ण असहमत', mr: 'पूर्ण असहमत' } },
  { n: 2, color: '#f59e0b', label: { en: 'Disagree', hi: 'असहमत', mr: 'असहमत' } },
  { n: 3, color: '#94a3b8', label: { en: 'Neutral', hi: 'तटस्थ', mr: 'तटस्थ' } },
  { n: 4, color: '#10b981', label: { en: 'Agree', hi: 'सहमत', mr: 'सहमत' } },
  { n: 5, color: '#4f46e5', label: { en: 'Strongly Agree', hi: 'पूर्ण सहमत', mr: 'पूर्ण सहमत' } },
];
