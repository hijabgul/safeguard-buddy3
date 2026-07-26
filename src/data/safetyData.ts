import { TouchScenario, StrangerScenario, SecretItem, HelplineInfo, SafetyWord } from '../types';

export const TOUCH_SCENARIOS: TouchScenario[] = [
  {
    id: 'touch-1',
    titleUrdu: 'امی کا پیار سے گلے لگانا',
    titleEnglish: 'Mom giving a loving hug',
    descriptionUrdu: 'جب امی یا ابو پیار سے گلے لگائیں اور آپ کو اچھا لگے۔',
    descriptionEnglish: 'When mom or dad hugs you with love and you feel comfortable.',
    icon: '🤗',
    isSafe: true,
    explanationUrdu: 'یہ محفوظ چھونا (Safe Touch) ہے! امی اور ابو کے پیار سے ہمیں خوشی اور تحفظ ملتا ہے۔',
    explanationEnglish: 'This is a Safe Touch! Parent hugs make us feel safe and happy.',
    category: 'family'
  },
  {
    id: 'touch-2',
    titleUrdu: 'ڈاکٹر صاحب کا امی ابو کی موجودگی میں معائنہ',
    titleEnglish: 'Doctor checking you with parents present',
    descriptionUrdu: 'جب آپ بیمار ہوں اور ڈاکٹر صاحب امی یا ابو کے سامنے معائنہ کریں۔',
    descriptionEnglish: 'When you are sick and a doctor checks you while parents are in the room.',
    icon: '🩺',
    isSafe: true,
    explanationUrdu: 'یہ محفوظ چھونا ہے! ڈاکٹر صاحب ہمیں صحت مند بنانے کے لیے امی ابو کے سامنے معائنہ کرتے ہیں۔',
    explanationEnglish: 'This is a Safe Touch! Doctors check us to keep us healthy with parents present.',
    category: 'doctor'
  },
  {
    id: 'touch-3',
    titleUrdu: 'کپڑوں کے اندر چھونا',
    titleEnglish: 'Someone touching under clothes',
    descriptionUrdu: 'اگر کوئی آپ کے سوٹ سوئم سوٹ والے حصے (کپڑوں کے اندر) چھوئے۔',
    descriptionEnglish: 'If someone touches your private swimsuit area under clothing.',
    icon: '🛑',
    isSafe: false,
    explanationUrdu: 'یہ غیر محفوظ چھونا (Unsafe Touch) ہے! سوٹ سوئم پارٹس صرف آپ کے اپنے ہیں۔ کوئی یہاں نہیں چھو سکتا۔ فوراً "نہیں!" کہیں اور امی ابو کو بتائیں۔',
    explanationEnglish: 'This is an Unsafe Touch! Your private areas belong ONLY to you. Say NO loudly and tell mom or dad!',
    category: 'stranger'
  },
  {
    id: 'touch-4',
    titleUrdu: 'کسی بات پر ڈر محسوس ہونا یا درد ہونا',
    titleEnglish: 'Touch that makes you feel scared or hurt',
    descriptionUrdu: 'کوئی آپ کو ایسے چھوئے جس سے آپ کو ڈر، شرم یا عجیب محسوس ہو۔',
    descriptionEnglish: 'Any touch that makes you feel scared, uncomfortable, or confused.',
    icon: '⚠️',
    isSafe: false,
    explanationUrdu: 'یہ غیر محفوظ چھونا ہے! اگر آپ کو ڈر محسوس ہو تو یاد رکھیں آپ کی کوئی غلطی نہیں ہے۔ فوراً اپنے بھروسہ مند بالغ کو بتائیں۔',
    explanationEnglish: 'This is Unsafe Touch! If you feel scared, it is NOT your fault. Tell a trusted adult right away.',
    category: 'secret'
  },
  {
    id: 'touch-5',
    titleUrdu: 'ٹیچر کا شاباشی دینا',
    titleEnglish: 'Teacher patting your shoulder for good work',
    descriptionUrdu: 'ٹیچر کا اچھے کام پر کندھے پر شاباشی دینا۔',
    descriptionEnglish: 'Teacher patting your shoulder kindly after you do good work.',
    icon: '⭐',
    isSafe: true,
    explanationUrdu: 'یہ محفوظ چھونا ہے! کندھے پر شاباشی دینا احترام اور حوصلہ افزائی کا طریقہ ہے۔',
    explanationEnglish: 'This is a Safe Touch! A gentle pat on the shoulder encourages your learning.',
    category: 'family'
  },
  {
    id: 'touch-6',
    titleUrdu: 'کسی کا کہنا کہ "یہ ہمارا راز ہے، کسی کو مت بتانا"',
    titleEnglish: 'Someone saying "Keep this a secret from parents"',
    descriptionUrdu: 'اگر کوئی آپ کو چھوئے اور کہے کہ امی ابو سے یہ راز رکھنا۔',
    descriptionEnglish: 'If someone touches you and demands you keep it secret from parents.',
    icon: '🤫',
    isSafe: false,
    explanationUrdu: 'یہ بالکل غیر محفوظ چھونا ہے! برا راز کبھی نہیں چھپانا چاہیے۔ اپنے امی یا ابو کو فوراً بتائیں!',
    explanationEnglish: 'This is completely Unsafe Touch! Bad secrets should NEVER be kept. Tell parents immediately!',
    category: 'secret'
  }
];

export const STRANGER_SCENARIOS: StrangerScenario[] = [
  {
    id: 'stranger-1',
    titleUrdu: 'پارک میں اجنبی کا چاکلیٹ دینا',
    titleEnglish: 'A stranger offering chocolates at the park',
    situationUrdu: 'آپ پارک میں کھیل رہے ہیں اور ایک ناواقف انکل آپ کو میٹھی چاکلیٹ اور کھلونے دیتے ہیں اور کہتے ہیں میرے ساتھ چلو۔',
    situationEnglish: 'You are playing at the park and an unfamiliar person offers you candy and asks you to go with them.',
    options: [
      {
        id: 'opt-1a',
        textUrdu: 'زور سے "نہیں!" کہیں، دور بھاگیں اور امی ابو یا ٹیچر کو بتائیں۔',
        textEnglish: 'Say "NO!" loudly, run away to mom/dad or a guard/teacher.',
        isCorrect: true,
        feedbackUrdu: 'شاباش! تم بہت سمجھدار ہو! اجنبی سے چیزیں نہیں لینی چاہئیں اور فوراً بھروسہ مند بالغ کو بتانا چاہیے۔'
      },
      {
        id: 'opt-1b',
        textUrdu: 'چاکلیٹ لے لیں اور ان کے ساتھ چلے جائیں۔',
        textEnglish: 'Take the chocolate and walk with them.',
        isCorrect: false,
        feedbackUrdu: 'اوہ نہیں! اجنبی چاہے جتنا بھی اچھا لگے، ان کی دی ہوئی چیز نہیں لینی اور نہ ساتھ جانا ہے۔'
      },
      {
        id: 'opt-1c',
        textUrdu: 'خاموش رہیں اور سوچتے رہیں۔',
        textEnglish: 'Stay silent and keep standing there.',
        isCorrect: false,
        feedbackUrdu: 'خاموش نہیں رہنا! ہمیشہ زور سے "نہیں!" بول کر فوراً دور بھاگنا ہے۔'
      }
    ]
  },
  {
    id: 'stranger-2',
    titleUrdu: 'اسکول کے باہر گاڑی والے کا بولنا',
    titleEnglish: 'Someone in a car outside school claiming parents sent them',
    situationUrdu: 'اسکول کی چھٹی پر ایک اجنبی گاڑی روک کر کہتا ہے "آپ کی امی نے مجھے آپ کو لینے بھیجا ہے، بیٹھ جاؤ"۔',
    situationEnglish: 'After school, someone in a car claims your mom sent them to pick you up.',
    options: [
      {
        id: 'opt-2a',
        textUrdu: 'گاڑی میں بالکل نہ بیٹھیں، واپس اسکول کے اندر جا کر ٹیچر کو بتائیں۔',
        textEnglish: 'Do NOT get in the car. Go back inside school and tell your teacher.',
        isCorrect: true,
        feedbackUrdu: 'زبردست! اگر امی ابو نے پہلے سے نہ بتایا ہو تو کسی اجنبی کی گاڑی میں کبھی نہ بیٹھیں۔'
      },
      {
        id: 'opt-2b',
        textUrdu: 'فوراً گاڑی کا دروازہ کھول کر بیٹھ جائیں۔',
        textEnglish: 'Get into the car immediately.',
        isCorrect: false,
        feedbackUrdu: 'غلط! پہلے اپنی ٹیچر یا اسکول سیکیورٹی سے امی ابو کو فون کروائیں۔'
      }
    ]
  },
  {
    id: 'stranger-3',
    titleUrdu: 'فون پر ذاتی معلومات مانگنا',
    titleEnglish: 'Someone on phone asking for home address',
    situationUrdu: 'فون پر کوئی اجنبی پوچھے "آپ کے امی ابو کہاں ہیں؟ گھر کا پتہ بتاؤ"۔',
    situationEnglish: 'A stranger on the phone asks for your home address or if parents are away.',
    options: [
      {
        id: 'opt-3a',
        textUrdu: 'کچھ نہ بتائیں، فون کاٹ کر امی یا ابو کو دیں۔',
        textEnglish: 'Give no details, hand phone to parents immediately.',
        isCorrect: true,
        feedbackUrdu: 'بہت اچھے! اپنے گھر کا پتہ، نام یا فون نمبر اجنبی کو کبھی نہیں بتاتے۔'
      },
      {
        id: 'opt-3b',
        textUrdu: 'اپنا پورا نام اور گھر کا پتہ بتا دیں۔',
        textEnglish: 'Tell them your full name and address.',
        isCorrect: false,
        feedbackUrdu: 'نہیں! یہ ذاتی معلومات ہیں، اجنبی کو بتانا محفوظ نہیں ہے۔'
      }
    ]
  }
];

export const SECRETS_ITEMS: SecretItem[] = [
  {
    id: 'sec-1',
    titleUrdu: 'سرپرائز برتھ ڈے پارٹی',
    titleEnglish: 'Surprise Birthday Party',
    descriptionUrdu: 'ابو کے لیے برتھ ڈے کا سرپرائز کیک تیار کرنا تاکہ شام کو سب خوش ہوں۔',
    descriptionEnglish: 'Preparing a surprise birthday cake for Dad so everyone is happy in the evening.',
    isGoodSecret: true,
    explanationUrdu: 'یہ ایک "اچھا راز" (Good Surprise) ہے! اس سے خوشی ملتی ہے اور یہ نقصان دہ نہیں ہوتا۔',
    explanationEnglish: 'This is a Good Surprise! It brings joy and is completely safe.',
    icon: '🎂'
  },
  {
    id: 'sec-2',
    titleUrdu: 'کسی کا ڈرانا اور کہنا "امی کو بتایا تو برا ہوگا"',
    titleEnglish: 'Someone scaring you and demanding secrecy',
    descriptionUrdu: 'کسی کا آپ کو پریشان کرنا یا چھونا اور کہنا کہ امی کو مت بتانا۔',
    descriptionEnglish: 'Someone making you uncomfortable or touching you and saying "Don\'t tell Mom".',
    isGoodSecret: false,
    explanationUrdu: 'یہ ایک "برا راز" (Bad Secret) ہے! کوئی بھی راز جو آپ کو ڈرائے، شرمندہ کرے یا پریشان کرے — اسے کبھی نہیں چھپانا۔ فوراً امی ابو کو بتائیں!',
    explanationEnglish: 'This is a Bad Secret! Any secret that makes you feel scared or uncomfortable must NEVER be kept. Tell your parents immediately!',
    icon: '🤐'
  },
  {
    id: 'sec-3',
    titleUrdu: 'امی کے لیے تحفہ چھپانا',
    titleEnglish: 'Hiding a Mother\'s Day card',
    descriptionUrdu: 'امی کے لیے مدرز ڈے کا گفٹ بنا کر الماری میں رکھنا تاکہ کل سرپرائز دیں۔',
    descriptionEnglish: 'Making a gift card for Mom and keeping it in the closet to surprise her tomorrow.',
    isGoodSecret: true,
    explanationUrdu: 'یہ اچھا سرپرائز ہے! خوشی دینے والے راز جلد ہی سب کو معلوم ہو جاتے ہیں۔',
    explanationEnglish: 'This is a good surprise! Happy secrets are shared soon and bring smiles.',
    icon: '🎁'
  },
  {
    id: 'sec-4',
    titleUrdu: 'چوٹ یا تکلیف دہ واقعہ چھپانا',
    titleEnglish: 'Hiding an injury or uncomfortable event',
    descriptionUrdu: 'کھیل میں چوٹ لگنا یا کسی کا آپ کے ساتھ برا رویہ رکھنا اور ڈر کی وجہ سے نہ بتانا۔',
    descriptionEnglish: 'Getting hurt while playing or experiencing bad behavior and hiding it out of fear.',
    isGoodSecret: false,
    explanationUrdu: 'یہ راز نہیں رکھنا! امی اور ابو آپ کے سب سے بڑے محافظ ہیں، انہیں سچ بتانے سے ہی مدد ملتی ہے۔',
    explanationEnglish: 'Do NOT keep this a secret! Parents are your guardians, telling them the truth keeps you safe.',
    icon: '🩹'
  },
  {
    id: 'sec-5',
    titleUrdu: 'دادی جان کے لیے سرپرائز پینٹنگ',
    titleEnglish: 'Surprise Drawing for Grandma',
    descriptionUrdu: 'دادی کے لیے پیاری سی پینٹنگ بنا کر کمبل کے نیچے چھپانا تاکہ شام کو تحفہ دیں۔',
    descriptionEnglish: 'Making a sweet drawing for Grandma and hiding it until dinner time to make her happy.',
    isGoodSecret: true,
    explanationUrdu: 'یہ ایک "اچھا سرپرائز" (Good Surprise) ہے! اس سے کسی کو تکلیف نہیں ہوتی بلکہ خوشی ملتی ہے۔',
    explanationEnglish: 'This is a Good Surprise! It makes Grandma smile and brings pure happiness.',
    icon: '🎨'
  },
  {
    id: 'sec-6',
    titleUrdu: 'اجنبی کا کھلونے دینا اور بولنا "کسی کو نہ بتانا"',
    titleEnglish: 'Stranger offering toys in secret',
    descriptionUrdu: 'گلی یا پارک میں کسی ناواقف شخص کا آپ کو کھلونے دینا اور کہنا کہ امی ابو سے یہ راز رکھنا۔',
    descriptionEnglish: 'An unfamiliar person giving you toys or treats and insisting you keep it a secret from parents.',
    isGoodSecret: false,
    explanationUrdu: 'یہ ایک "برا راز" (Bad Secret) ہے! اجنبی سے تحفہ لینا اور چھپانا خطرناک ہے۔ فوراً امی یا ابو کو بتائیں!',
    explanationEnglish: 'This is a Bad Secret! Taking gifts from strangers and hiding it is unsafe. Tell parents immediately!',
    icon: '🍭'
  },
  {
    id: 'sec-7',
    titleUrdu: 'دوست کے ساتھ مل کر سرپرائز کارڈ بنانا',
    titleEnglish: 'Planning a surprise card with a friend',
    descriptionUrdu: 'اسکول میں دوست کے ساتھ مل کر کلاس میٹ کے لیے سرپرائز مبارکباد کا کارڈ بنانا۔',
    descriptionEnglish: 'Working with a friend to make a secret congratulations card for a classmate.',
    isGoodSecret: true,
    explanationUrdu: 'یہ اچھا سرپرائز ہے! خوشی پھیلانے والے راز محفوظ اور خوبصورت ہوتے ہیں۔',
    explanationEnglish: 'This is a Good Surprise! Friendly surprises build love and bonding.',
    icon: '🎉'
  },
  {
    id: 'sec-8',
    titleUrdu: 'آن لائن گیم میں راز رکھنا اور فوٹو مانگنا',
    titleEnglish: 'Online game stranger asking for secret photo',
    descriptionUrdu: 'آن لائن گیم میں کوئی آپ سے گھر کی یا اپنی تصویر مانگے اور کہے کہ امی ابو کو مت بتانا۔',
    descriptionEnglish: 'Someone in an online game asking for private pictures and telling you to hide it from family.',
    isGoodSecret: false,
    explanationUrdu: 'یہ بالکل "برا راز" (Bad Secret) ہے! آن لائن کسی کو تصویریں بھیجنا یا راز رکھنا غلط ہے۔ فوراً امی ابو کو بتائیں!',
    explanationEnglish: 'This is a dangerous Bad Secret! Never send photos or keep secrets for online strangers. Tell Mom or Dad right away!',
    icon: '📱'
  },
  {
    id: 'sec-9',
    titleUrdu: 'کھلونا توڑ کر دھمکی دینا',
    titleEnglish: 'Threatened to keep quiet about damage',
    descriptionUrdu: 'کسی کا آپ کا کھلونا توڑ دینا اور کہنا "اگر امی کو بتایا تو میں تمھیں ماروں گا"۔',
    descriptionEnglish: 'Someone breaking your toy and threatening: "If you tell your parents, I will hurt you!"',
    isGoodSecret: false,
    explanationUrdu: 'یہ "برا راز" ہے! ڈرانے والی کوئی بھی بات چھپانی نہیں ہے۔ امی ابو ہمیشہ آپ کو محفوظ رکھیں گے!',
    explanationEnglish: 'This is a Bad Secret! Never stay silent when someone threatens or scares you. Parents will always protect you!',
    icon: '🤖'
  },
  {
    id: 'sec-10',
    titleUrdu: 'سرپرائز پکنک کی تیاری',
    titleEnglish: 'Secret weekend picnic setup',
    descriptionUrdu: 'اتوار کو امی ابو کے لیے بھائی بہن کا مل کر پکنک کی ٹوکری اور جوس سجانا۔',
    descriptionEnglish: 'Siblings setting up a surprise picnic basket for Mom and Dad on Sunday morning.',
    isGoodSecret: true,
    explanationUrdu: 'یہ اچھا سرپرائز ہے! خاندان کے ساتھ مل کر خوشی منانا محفوظ اور پیارا ہے۔',
    explanationEnglish: 'This is a Good Surprise! Family surprises bring warmth and togetherness.',
    icon: '🧺'
  }
];

export const TRUSTED_ADULT_OPTIONS = [
  { id: 'ammi', nameUrdu: 'امی (Ammi / Mom)', nameEnglish: 'Mom (Ammi)', icon: '👩‍👧', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { id: 'abbu', nameUrdu: 'ابو (Abbu / Dad)', nameEnglish: 'Dad (Abbu)', icon: '👨‍👦', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'teacher', nameUrdu: 'اسکول کی ٹیچر (Teacher)', nameEnglish: 'School Teacher', icon: '👩‍🏫', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'dadi_nani', nameUrdu: 'دادی / نانی (Dadi / Nani)', nameEnglish: 'Grandmother (Dadi / Nani)', icon: '👵', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'dada_nana', nameUrdu: 'دادا / نانا (Dada / Nana)', nameEnglish: 'Grandfather (Dada / Nana)', icon: '👴', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'helpline', nameUrdu: 'بچوں کی ہیلپ لائن 1121 / 1099', nameEnglish: 'Child Helpline 1121 / 1099', icon: '📞', color: 'bg-sky-100 text-sky-800 border-sky-300' }
];

export const PAKISTANI_HELPLINES: HelplineInfo[] = [
  {
    nameUrdu: 'زینب الرٹ / وزارت انسانی حقوق',
    nameEnglish: 'Zainab Alert / Ministry of Human Rights',
    number: '1099',
    descriptionUrdu: 'بچوں کے حقوق اور تحفظ کے لیے 24 گھنٹے مفت قومی ہیلپ لائن۔',
    descriptionEnglish: '24/7 National Free Toll Helpline for Child Protection and Rights.',
    category: 'child',
    badgeColor: 'bg-rose-600 text-white'
  },
  {
    nameUrdu: 'چائلڈ پروٹیکشن اینڈ ویلفیئر بیورو (CPWB)',
    nameEnglish: 'Child Protection & Welfare Bureau',
    number: '1121',
    descriptionUrdu: 'مفت چائلڈ ہیلپ لائن — تشدد یا خطرے میں فوراً مدد کریں۔',
    descriptionEnglish: 'Child Helpline for direct protection against violence, abuse, and neglect.',
    category: 'child',
    badgeColor: 'bg-indigo-600 text-white'
  },
  {
    nameUrdu: 'پاک پولیس ایمرجنسی',
    nameEnglish: 'Pakistan Police Emergency',
    number: '15',
    descriptionUrdu: 'کسی بھی ہنگامی صورتحال یا خطرے کی صورت میں فوری امداد۔',
    descriptionEnglish: 'Immediate Police dispatch for emergency situations.',
    category: 'police',
    badgeColor: 'bg-blue-700 text-white'
  },
  {
    nameUrdu: 'ایدھی ایمرجنسی سروس',
    nameEnglish: 'Edhi Ambulance & Welfare',
    number: '115',
    descriptionUrdu: 'پاکستان کی سب سے بڑی مفت ایمبولینس اور ویلفیئر ایمرجنسی۔',
    descriptionEnglish: 'Nationwide Edhi emergency ambulance and relief service.',
    category: 'rescue',
    badgeColor: 'bg-emerald-600 text-white'
  },
  {
    nameUrdu: 'ریسکیو 1122',
    nameEnglish: 'Rescue 1122',
    number: '1122',
    descriptionUrdu: 'میڈیکل اور ایمرجنسی ریسکیو سروس۔',
    descriptionEnglish: 'Disaster, medical emergency and rescue service.',
    category: 'rescue',
    badgeColor: 'bg-amber-600 text-white'
  },
  {
    nameUrdu: 'ایف آئی اے سائبر کرائم پرائم ہیلپ لائن',
    nameEnglish: 'FIA Cyber Crime Reporting',
    number: '1991',
    descriptionUrdu: 'آن لائن ہراسانی یا ڈیجیٹل بلیک میلنگ کی شکایت کے لیے۔',
    descriptionEnglish: 'Federal Investigation Agency Cyber Crime reporting for online harassment.',
    category: 'cyber',
    badgeColor: 'bg-purple-700 text-white'
  }
];

export const SAFETY_WORDS: SafetyWord[] = [
  {
    id: 'word-1',
    wordUrdu: 'محفوظ چھونا (Safe Touch)',
    wordRoman: 'Mahfooz Chhoona',
    wordEnglish: 'Safe Touch',
    meaningUrdu: 'ایسا چھونا جس سے آپ کو سکون، پیار اور خوشی محسوس ہو — جیسے امی ابو کا گلے لگانا یا ٹیچر کا شاباشی دینا۔',
    meaningEnglish: 'A touch that makes you feel safe, loved, and comfortable.',
    icon: '🤗',
    category: 'touch',
    badgeColor: 'bg-[#55EFC4] text-[#2D3436] border-[#00B894]'
  },
  {
    id: 'word-2',
    wordUrdu: 'غیر محفوظ چھونا (Unsafe Touch)',
    wordRoman: 'Ghair Mahfooz Chhoona',
    wordEnglish: 'Unsafe Touch',
    meaningUrdu: 'ایسا چھونا جو آپ کے کپڑوں کے اندر ہو، یا جس سے آپ کو ڈر، شرم، چوٹ یا تکلیف محسوس ہو۔',
    meaningEnglish: 'A touch under clothing or any touch that makes you feel scared or hurt.',
    icon: '🛑',
    category: 'touch',
    badgeColor: 'bg-[#FF4757] text-white border-[#B33900]'
  },
  {
    id: 'word-3',
    wordUrdu: 'اجنبی (Stranger)',
    wordRoman: 'Ajnabi',
    wordEnglish: 'Stranger',
    meaningUrdu: 'کوئی بھی ایسا شخص جسے آپ یا آپ کے امی ابو اچھی طرح نہیں جانتے۔ اجنبی سے تحفہ یا ٹافی کبھی نہ لیں۔',
    meaningEnglish: 'Anyone that you or your parents do not know well.',
    icon: '👤',
    category: 'boundaries',
    badgeColor: 'bg-[#74B9FF] text-white border-[#0984E3]'
  },
  {
    id: 'word-4',
    wordUrdu: 'بھروسہ مند بالغ (Trusted Adult)',
    wordRoman: 'Bharosa-mand Baaligh',
    wordEnglish: 'Trusted Adult',
    meaningUrdu: 'وہ خاص بڑے جن پر آپ پورا بھروسہ کرتے ہیں — جیسے امی، ابو، نانی، دادا یا اسکول کی ٹیچر، جو ہمیشہ آپ کی مدد کرتے ہیں۔',
    meaningEnglish: 'Grown-ups you trust completely like parents, grandparents, or teachers.',
    icon: '🛡️',
    category: 'trusted',
    badgeColor: 'bg-[#FFD93D] text-[#2D3436] border-[#FF8E3C]'
  },
  {
    id: 'word-5',
    wordUrdu: 'برا راز (Bad Secret)',
    wordRoman: 'Bura Raaz',
    wordEnglish: 'Bad Secret',
    meaningUrdu: 'کوئی بھی ایسی بات یا واقعہ جو آپ کو ڈرائے یا پریشان کرے اور کوئی کہے "کسی کو نہ بتانا"۔ اسے فوراً امی ابو کو بتائیں۔',
    meaningEnglish: 'A secret that makes you feel scared, confused, or unsafe.',
    icon: '🤐',
    category: 'feelings',
    badgeColor: 'bg-[#A29BFE] text-white border-[#6C5CE7]'
  },
  {
    id: 'word-6',
    wordUrdu: 'حد بندی (Personal Space)',
    wordRoman: 'Had Bandi',
    wordEnglish: 'Personal Space / Boundaries',
    meaningUrdu: 'آپ کے جسم کے ارد گرد وہ محفوظ جگہ جہاں آپ کی اجازت کے بغیر کوئی داخل نہیں ہو سکتا۔ آپ کا جسم صرف آپ کا ہے۔',
    meaningEnglish: 'The safe space around your body that belongs only to you.',
    icon: '⭕',
    category: 'boundaries',
    badgeColor: 'bg-[#FF8E3C] text-white border-[#B33900]'
  }
];

/* ==========================================
   TODDLER (2-5) & JUNIOR (5-8) SPECIFIC DATA
   ========================================== */

// 1. STRANGER AWARENESS

export const TODDLER_STRANGER_SCENARIOS = [
  {
    id: 'tod-stranger-1',
    characterIcon: '🐤',
    characterNameUrdu: 'پپو چڑیا (Pip the Bird)',
    characterNameEnglish: 'Pip the Little Bird',
    titleUrdu: 'شالامار باغ میں چمکیلا غبارہ',
    titleEnglish: 'Bright Balloon at Shalimar Gardens',
    storyUrdu: 'پپو چڑیا شالامار باغ میں کھیل رہا ہے۔ ایک ناواقف بلی چمکیلا غبارہ دکھا کر کہتی ہے: "امی کو چھوڑو، میرے ساتھ چلو!" پپو کیا کرے؟',
    storyEnglish: 'Pip the little bird is playing in Shalimar Gardens. An unfamiliar cat holds a shiny balloon and says: "Leave Mom, come with me!" What should Pip do?',
    options: [
      {
        id: 'opt-t1-a',
        icon: '🛑',
        textUrdu: 'امی چڑیا کے پاس بھاگ جاؤ! (Stay with Mama)',
        textEnglish: 'Run to Mama Bird! 🛑',
        isSafe: true,
        feedbackUrdu: 'واہ! زبردست! پپو امی کے پاس بھاگ گیا اور بالکل محفوظ رہا! 🌟',
        feedbackEnglish: 'Yay! Super job! Pip ran straight to Mama Bird and stayed safe! 🌟'
      },
      {
        id: 'opt-t1-b',
        icon: '🎈',
        textUrdu: 'اجنبی کے ساتھ جاؤ (Follow Stranger)',
        textEnglish: 'Follow Stranger 🎈',
        isSafe: false,
        feedbackUrdu: 'اوہ نہیں! اجنبی کے ساتھ کبھی نہیں جانا! ہمیشہ امی کے ساتھ رہنا ہے۔',
        feedbackEnglish: 'Oh no! Never follow strangers! Always stay close to Mama.'
      }
    ]
  },
  {
    id: 'tod-stranger-2',
    characterIcon: '🐅',
    characterNameUrdu: 'شیرو شیر (Sheru Tiger Cub)',
    characterNameEnglish: 'Sheru the Tiger Cub',
    titleUrdu: 'کھلونے کی دکان کے باہر چاکلیٹ',
    titleEnglish: 'Chocolate Outside Toy Shop',
    storyUrdu: 'شیرو دکان کے باہر کھڑا ہے۔ ایک ناواقف انکل شیرو کو لال چاکلیٹ دے کر کہتے ہیں "میرے ساتھ گاڑی میں بیٹھو"۔ شیرو کو کیا کرنا چاہیے؟',
    storyEnglish: 'Sheru is standing outside a shop. An unfamiliar person offers a sweet red chocolate and says "Hop in my car". What should Sheru do?',
    options: [
      {
        id: 'opt-t2-a',
        icon: '🫂',
        textUrdu: 'زور سے نہیں بولو اور امی سے لپٹ جاؤ! (Say NO & Hug Mama)',
        textEnglish: 'Say NO & Hug Mama! 🫂',
        isSafe: true,
        feedbackUrdu: 'شاباش شیرو! آپ بہت بہادر بچے ہو! اجنبی کی چاکلیٹ نہیں لینی! ⭐',
        feedbackEnglish: 'Bravo Sheru! You are a brave tiger! Never take candy from strangers! ⭐'
      },
      {
        id: 'opt-t2-b',
        icon: '🍫',
        textUrdu: 'چاکلیٹ لے لو (Take Chocolate)',
        textEnglish: 'Take Chocolate 🍫',
        isSafe: false,
        feedbackUrdu: 'نہیں نہیں! اجنبی کی دی ہوئی چاکلیٹ بالکل نہیں لینی! امی کو بتائیں!',
        feedbackEnglish: 'No no! Never accept candy from people you do not know!'
      }
    ]
  },
  {
    id: 'tod-stranger-3',
    characterIcon: '🐰',
    characterNameUrdu: 'سونو خرگوش (Sonu Bunny)',
    characterNameEnglish: 'Sonu Bunny',
    titleUrdu: 'گھر کے دروازے پر آواز',
    titleEnglish: 'Knock on Front Gate',
    storyUrdu: 'سونو خرگوش صحن میں کھیل رہا ہے۔ باہر ایک ناواقف کتا کہتا ہے: "دروازہ کھولو، میں کھلونے لایا ہوں!" سونو کو کیا کرنا چاہیے؟',
    storyEnglish: 'Sonu Bunny is playing in the yard. An unknown dog calls through the gate: "Open up, I brought toys!" What should Sonu do?',
    options: [
      {
        id: 'opt-t3-a',
        icon: '🏃',
        textUrdu: 'ابو خرگوش کے پاس بھاگ جاؤ! (Run to Papa Bunny)',
        textEnglish: 'Run to Papa Bunny! 🏃',
        isSafe: true,
        feedbackUrdu: 'زبردست! سونو نے دروازہ نہیں کھولا اور ابو کو بلا لیا! آپ بہت ہوشیار ہو! 🎉',
        feedbackEnglish: 'Awesome! Sonu did not open the gate and ran to Papa! You are so smart! 🎉'
      },
      {
        id: 'opt-t3-b',
        icon: '🚪',
        textUrdu: 'دروازہ کھول دو (Open Gate)',
        textEnglish: 'Open Gate 🚪',
        isSafe: false,
        feedbackUrdu: 'غلط! چھوٹے بچے کبھی اکیلے دروازہ نہیں کھولتے!',
        feedbackEnglish: 'Incorrect! Toddlers should never open the door to anyone alone!'
      }
    ]
  }
];

export const JUNIOR_STRANGER_SCENARIOS = [
  {
    id: 'jun-stranger-1',
    titleUrdu: 'اسکول گیٹ پر جھوٹا پیغام',
    titleEnglish: 'School Gate Fake Emergency',
    storyArc: [
      {
        step: 1,
        promptUrdu: 'اسکول کی چھٹی کے وقت گاڑی میں بیٹھا ایک اجنبی انکل کہتا ہے: "آپ کی امی کی طبعیت خراب ہے، جلدی گاڑی میں بیٹھو!" آپ کیا کریں گے؟',
        promptEnglish: 'After school, a stranger in a car says: "Your mom is sick in the hospital! Get in quickly!" What do you do first?',
        options: [
          {
            id: 'j1-s1-a',
            textUrdu: 'گاڑی میں بالکل نہ بیٹھیں، واپس اسکول کے اندر جا کر ٹیچر کو بتائیں۔',
            textEnglish: 'Do NOT get in. Go back inside school and tell your teacher.',
            isCorrect: true,
            feedbackUrdu: 'بہت خوب! آپ نے بالکل صحیح فیصلہ کیا۔ کبھی کسی اجنبی کے ساتھ نہ جائیں۔',
            feedbackEnglish: 'Great choice! Never get into a stranger’s car under any emergency claim.'
          },
          {
            id: 'j1-s1-b',
            textUrdu: 'پریشان ہو کر جلدی سے گاڑی کا دروازہ کھول کر بیٹھ جائیں۔',
            textEnglish: 'Get scared and jump into the car immediately.',
            isCorrect: false,
            feedbackUrdu: 'اوہ نہیں! اجنبی اکثر جھوٹ بول کر ڈراتے ہیں۔ پہلے اپنی ٹیچر سے تصدیق کروائیں۔',
            feedbackEnglish: 'Oh no! Strangers often trick children using fake emergencies. Check with your teacher first.'
          }
        ]
      },
      {
        step: 2,
        promptUrdu: 'ٹیچر نے امی کو فون کیا اور معلوم ہوا کہ امی بالکل ٹھیک ہیں! اب آپ اس اجنبی کو کیا کہیں گے؟',
        promptEnglish: 'Teacher called your Mom and confirmed she is safe at home! What do you practice saying now?',
        options: [
          {
            id: 'j1-s2-a',
            textUrdu: 'زور سے کہیں: "میں آپ کے ساتھ ہرگز نہیں جاؤں گا!" اور سیکیورٹی گارڈ کے پاس کھڑے رہیں۔',
            textEnglish: 'Say out loud: "I will NEVER go with you!" and stand near the guard.',
            isCorrect: true,
            feedbackUrdu: 'شاباش! زور سے "نہیں" بولنے سے اجنبی ڈر کر بھاگ جاتا ہے! ⭐',
            feedbackEnglish: 'Superb! Speaking up firmly keeps you totally protected! ⭐'
          },
          {
            id: 'j1-s2-b',
            textUrdu: 'خاموش کھڑے رہیں اور کچھ نہ کہیں۔',
            textEnglish: 'Stay silent and say nothing.',
            isCorrect: false,
            feedbackUrdu: 'خاموش نہیں رہنا! اپنی آواز کا استعمال کر کے "نہیں" بولنا سیکھیں۔',
            feedbackEnglish: 'Do not stay quiet! Always use your loud clear voice.'
          }
        ]
      }
    ]
  },
  {
    id: 'jun-stranger-2',
    titleUrdu: 'لبرٹی مارکیٹ میں مفت کلفی کی پیشکش',
    titleEnglish: 'Free Kulfi Offer at Liberty Market',
    storyArc: [
      {
        step: 1,
        promptUrdu: 'مارکیٹ میں ایک ناواقف آدمی کہتا ہے: "میری گاڑی کے پیچھے آؤ، میں تمہیں مفت شاہی کلفی دوں گا!" آپ کیا جواب دیں گے؟',
        promptEnglish: 'At the market, a stranger offers free ice cream behind his truck. What do you do?',
        options: [
          {
            id: 'j2-s1-a',
            textUrdu: 'زور سے کہیں: "نہیں! میں اجنبی سے کچھ نہیں لیتا!" اور امی کا ہاتھ پکڑ لیں۔',
            textEnglish: 'Say loudly: "NO! I do not take treats from strangers!" and grab Mom’s hand.',
            isCorrect: true,
            feedbackUrdu: 'زبردست! آپ نے اجنبی کی لالچ کو ٹھکرا کر اپنی حفاظت کی! 🍦',
            feedbackEnglish: 'Awesome! Rejecting treats from strangers keeps you completely safe! 🍦'
          },
          {
            id: 'j2-s1-b',
            textUrdu: 'امی کو بغیر بتائے چپکے سے کلفی لینے چلے جائیں۔',
            textEnglish: 'Walk secretly behind the truck to get ice cream.',
            isCorrect: false,
            feedbackUrdu: 'خطرناک! امی کو بتائے بغیر کہیں جانا بہت غیر محفوظ ہے۔',
            feedbackEnglish: 'Dangerous! Going anywhere without your parents is unsafe.'
          }
        ]
      }
    ]
  }
];

// 2. SAYING NO

export const TODDLER_SAYING_NO_SCENARIOS = [
  {
    id: 'tod-no-1',
    characterIcon: '🦓',
    titleUrdu: 'چیکو زیبرا کو زور سے گلے لگانا',
    titleEnglish: 'Uncomfortable Hug to Chiku Zebra',
    storyUrdu: 'ایک ناواقف مہمان چیکو زیبرا کو بہت کس کے گلے لگا رہا ہے جس سے چیکو کو گھٹن ہو رہی ہے۔ چیکو کونسا بٹن دبائے؟',
    storyEnglish: 'An unfamiliar visitor hugs Chiku Zebra too tightly, making Chiku uncomfortable. Which button should Chiku tap?',
    options: [
      {
        id: 'opt-no1-a',
        icon: '🛑',
        textUrdu: 'بڑا "نہیں!" کا بٹن دبائیں! (Tap BIG NO!)',
        textEnglish: 'Tap BIG NO! 🛑',
        isCorrect: true,
        feedbackUrdu: 'شاباش! آپ نے "نہیں" کا بٹن دبا دیا! آپ کا جسم صرف آپ کا ہے! 🌟',
        feedbackEnglish: 'Yay! You tapped NO! Your body belongs only to you! 🌟'
      },
      {
        id: 'opt-no1-b',
        icon: '🤐',
        textUrdu: 'خاموش رہیں (Stay Quiet)',
        textEnglish: 'Stay Quiet 🤐',
        isCorrect: false,
        feedbackUrdu: 'خاموش نہیں رہنا! جب بھی اچھا نہ لگے، فوراً "نہیں" بولنا ہے!',
        feedbackEnglish: 'Never stay silent! Tap NO whenever you feel uncomfortable!'
      }
    ]
  },
  {
    id: 'tod-no-2',
    characterIcon: '🐘',
    titleUrdu: 'سونو ہاتھی کو چمکیلی ٹافی دینا',
    titleEnglish: 'Stranger Offering Candy to Sonu Elephant',
    storyUrdu: 'پارک میں ایک اجنبی سونو ہاتھی کو میٹھی ٹافی دے کر ہاتھ پکڑنے کی کوشش کر رہا ہے۔ سونو کیا کرے؟',
    storyEnglish: 'A stranger tries to hold Sonu Elephant’s hand while offering candy. What should Sonu do?',
    options: [
      {
        id: 'opt-no2-a',
        icon: '📢',
        textUrdu: 'زور سے "نہیں!" بول کر امی کے پاس بھاگیں! (Tap NO & Run!)',
        textEnglish: 'Tap NO & Run! 📢',
        isCorrect: true,
        feedbackUrdu: 'بہت بہادر بچے ہو! اپ نے زور سے نہیں بول کر امی کا ہاتھ تھام لیا! 🐘',
        feedbackEnglish: 'Super brave! You tapped NO and ran to Mom! 🐘'
      }
    ]
  }
];

export const JUNIOR_SAYING_NO_SCENARIOS = [
  {
    id: 'jun-no-1',
    titleUrdu: 'اندھیرے اسٹور روم میں بلانا',
    titleEnglish: 'Asked to Enter Dark Store Room',
    storyArc: [
      {
        step: 1,
        promptUrdu: 'پڑوس کا ایک بڑا لڑکا آپ کو اکیلے اندھیرے اسٹور روم میں آنے کا کہتا ہے اور کہتا ہے "یہاں آئس کریم چھپی ہے"۔ آپ کیا کریں گے؟',
        promptEnglish: 'An older neighbor asks you to enter a dark store room alone, claiming there are toys inside. What do you say?',
        options: [
          {
            id: 'jn1-s1-a',
            textUrdu: 'زور سے کہیں: "نہیں! میں اکیلے اندھیرے کمرے میں نہیں آؤں گا!"',
            textEnglish: 'Say loudly: "NO! I will not enter a dark room alone!"',
            isCorrect: true,
            feedbackUrdu: 'زبردست! آپ نے اپنی حفاظت کے لیے فوراً "نہیں" کہہ دیا۔',
            feedbackEnglish: 'Excellent! You set a clear boundary right away.'
          },
          {
            id: 'jn1-s1-b',
            textUrdu: 'ڈر کر چپکے سے اسٹور روم کے اندر چلے جائیں۔',
            textEnglish: 'Feel nervous but walk inside anyway.',
            isCorrect: false,
            feedbackUrdu: 'غلط! کسی بھی الگ تھلگ اندھیرے کمرے میں اکیلے کبھی نہ جائیں۔',
            feedbackEnglish: 'Unsafe! Never enter isolated dark rooms with anyone.'
          }
        ]
      },
      {
        step: 2,
        promptUrdu: 'وہ کہتا ہے: "اگر نہیں آئے تو میں تم سے دوبارہ نہیں کھیلوں گا!" اب آپ اپنی آواز بلند کر کے کیا کہیں گے؟',
        promptEnglish: 'He threatens: "If you say NO, I won’t play with you again!" How do you respond out loud?',
        options: [
          {
            id: 'jn1-s2-a',
            textUrdu: 'کہیں: "مجھے پرواہ نہیں! میرا جسم، میری مرضی!" اور فوراً امی کو بتائیں۔',
            textEnglish: 'Say: "I don’t care! My body, my rules!" and run to Mom.',
            isCorrect: true,
            feedbackUrdu: 'شاباش! سچے دوست کبھی آپ کو غیر محفوظ کام پر مجبور نہیں کرتے! ⭐',
            feedbackEnglish: 'Bravo! True friends never force you into unsafe situations! ⭐'
          },
          {
            id: 'jn1-s2-b',
            textUrdu: 'رو کر ان کی بات مان لیں۔',
            textEnglish: 'Cry and agree to go inside.',
            isCorrect: false,
            feedbackUrdu: 'کبھی مجبور نہ ہوں! آپ کا "نہیں" آپ کی طاقت ہے۔',
            feedbackEnglish: 'Never give in! Your "NO" is your strength.'
          }
        ]
      }
    ]
  }
];

// 3. TRUSTED TREE

export const TODDLER_TRUSTED_TREE = [
  {
    id: 'tod-tree-1',
    questionUrdu: 'پپو چڑیا کو جب ڈر لگے یا مدد چاہیے ہو، تو سب سے پہلے کس کے پاس جانا چاہیے؟',
    questionEnglish: 'When Pip the Bird feels scared or needs help, who should Pip run to first?',
    options: [
      {
        id: 'tree-t1-a',
        nameUrdu: 'امی چڑیا (Ammi Bird)',
        nameEnglish: 'Ammi / Mom 👩‍👧',
        icon: '👩‍👧',
        isTrusted: true,
        feedbackUrdu: 'بالکل صحیح! امی سب سے پہلی اور سب سے پیاری بھروسہ مند بالغ ہیں! ❤️',
        feedbackEnglish: 'Correct! Mom is your number one trusted adult! ❤️'
      },
      {
        id: 'tree-t1-b',
        nameUrdu: 'ابو چڑیا (Abbu Bird)',
        nameEnglish: 'Abbu / Dad 👨‍👦',
        icon: '👨‍👦',
        isTrusted: true,
        feedbackUrdu: 'زبردست! ابو ہمیشہ آپ کی حفاظت کے لیے تیار ہوتے ہیں! 🛡️',
        feedbackEnglish: 'Awesome! Dad is always there to keep you safe! 🛡️'
      },
      {
        id: 'tree-t1-c',
        nameUrdu: 'اجنبی لومڑی (Stranger Fox)',
        nameEnglish: 'Stranger Fox 🦊',
        icon: '🦊',
        isTrusted: false,
        feedbackUrdu: 'نہیں نہیں! اجنبی پر کبھی بھروسہ نہیں کرنا!',
        feedbackEnglish: 'No no! Strangers are not trusted adults!'
      }
    ]
  }
];

export const TODDLER_TRUSTED_ADULTS = [
  { id: 'mama', nameUrdu: 'امی جان (Mom)', nameEnglish: 'Mommy 👩‍👧', icon: '👩‍👧', role: 'Mom' },
  { id: 'baba', nameUrdu: 'ابو جان (Dad)', nameEnglish: 'Daddy 👨‍👦', icon: '👨‍👦', role: 'Dad' },
  { id: 'dadi', nameUrdu: 'دادی / نانی (Grandma)', nameEnglish: 'Grandma 👵', icon: '👵', role: 'Grandma' },
  { id: 'teacher', nameUrdu: 'اسکول کی استاد (Teacher)', nameEnglish: 'Teacher 👩‍🏫', icon: '👩‍🏫', role: 'Teacher' },
];

export const JUNIOR_TRUSTED_ADULTS = [
  { id: 'mom', nameUrdu: 'والدہ (Mother)', nameEnglish: 'Mother 👩‍👧', icon: '👩‍👧', role: 'Mother' },
  { id: 'dad', nameUrdu: 'والد (Father)', nameEnglish: 'Father 👨‍👦', icon: '👨‍👦', role: 'Father' },
  { id: 'teacher', nameUrdu: 'ٹیچر (Teacher)', nameEnglish: 'Teacher 👩‍🏫', icon: '👩‍🏫', role: 'Teacher' },
  { id: 'police', nameUrdu: 'پولیس / گارڈ (Guard)', nameEnglish: 'Security Guard 👮‍♂️', icon: '👮‍♂️', role: 'Guard' },
];

export const JUNIOR_TRUSTED_TREE = [
  {
    id: 'jun-tree-1',
    scenarioUrdu: 'پیکجز مال میں شاپنگ کے دوران امی کا ہاتھ چھوٹ جاتا ہے اور آپ گم ہو جاتے ہیں۔ آپ کس کے پاس جائیں گے؟',
    scenarioEnglish: 'You get separated from Mom at Packages Mall while shopping. Who do you look for?',
    options: [
      {
        id: 'jtree-1-a',
        titleUrdu: 'وردی والا سیکیورٹی گارڈ یا کاؤنٹر انکل',
        titleEnglish: 'Uniformed Security Guard or Mall Help Desk Staff',
        icon: '👮‍♂️',
        isCorrect: true,
        feedbackUrdu: 'شاباش! سیکیورٹی گارڈ اور پولیس کیپٹن بھروسہ مند ہوتے ہیں جو امی سے رابطہ کروائیں گے!',
        feedbackEnglish: 'Correct! Uniformed guards and help desk staff are trained trusted personnel!'
      },
      {
        id: 'jtree-1-b',
        titleUrdu: 'کوئی بھی اجنبی جو کھلونے دکھا کر باہر چلنے کو کہے۔',
        titleEnglish: 'An unknown shopper offering to take you out to his car.',
        icon: '👤',
        isCorrect: false,
        feedbackUrdu: 'غلط! کسی اجنبی کے ساتھ مال سے باہر ہرگز نہ جائیں۔',
        feedbackEnglish: 'Incorrect! Never leave the building with an unknown visitor.'
      }
    ]
  }
];

// 4. SECRETS (Good vs Bad Secrets)

export const TODDLER_SECRETS = [
  {
    id: 'tod-sec-1',
    characterIcon: '🦜',
    titleUrdu: 'ابو کے لیے سرپرائز کیک 🎂',
    titleEnglish: 'Surprise Birthday Cake for Dad 🎂',
    storyUrdu: 'مٹھو طوطا اور امی مل کر ابو کے لیے سرپرائز کیک بنا رہے ہیں۔ کیا یہ خوشی کا سرپرائز ہے؟',
    storyEnglish: 'Mithu Parrot and Mom are making a surprise cake for Dad. Is this a happy surprise?',
    options: [
      {
        id: 'ts1-a',
        icon: '🎂',
        textUrdu: 'ہاں! پیارا سرپرائز (Happy Surprise)',
        textEnglish: 'Yes! Happy Surprise 🎂',
        isSafe: true,
        feedbackUrdu: 'شاباش! سالگرہ کا کیک یا تحفہ ایک پیارا سرپرائز ہوتا ہے! 🎂',
        feedbackEnglish: 'Yay! Birthday cake or gifts are safe happy surprises! 🎂'
      },
      {
        id: 'ts1-b',
        icon: '🤐',
        textUrdu: 'خوفناک راز (Scary Secret)',
        textEnglish: 'Scary Secret 🤐',
        isSafe: false,
        feedbackUrdu: 'یہ ڈرانے والا راز نہیں، بلکہ پیارا سرپرائز ہے!',
        feedbackEnglish: 'This is not scary, it is a happy birthday surprise!'
      }
    ]
  },
  {
    id: 'tod-sec-2',
    characterIcon: '🐱',
    titleUrdu: 'ڈرانے والا راز 🤐',
    titleEnglish: 'Scary Secret 🤐',
    storyUrdu: 'ایک اجنبی بلّی پپو چڑیا کو ڈراتی ہے اور کہتی ہے: "امی کو کچھ نہ بتانا!" پپو کو کیا کرنا چاہیے؟',
    storyEnglish: 'A stranger cat frightens Pip and says "Do not tell Mom!" What should Pip do?',
    options: [
      {
        id: 'ts2-a',
        icon: '🏃',
        textUrdu: 'امی کے پاس بھاگ کر سچ بتا دیں (Tell Mom)',
        textEnglish: 'Run & Tell Mom 🏃',
        isSafe: true,
        feedbackUrdu: 'زبردست! ڈرانے والا برا راز ہمیشہ امی ابو کو بتاتے ہیں! 🌟',
        feedbackEnglish: 'Superb! Always tell Mom and Dad about scary secrets! 🌟'
      },
      {
        id: 'ts2-b',
        icon: '🤐',
        textUrdu: 'راز چھپا لیں (Keep Secret)',
        textEnglish: 'Keep Secret 🤐',
        isSafe: false,
        feedbackUrdu: 'برا راز کبھی نہیں چھپاتے! امی کو بتائیں!',
        feedbackEnglish: 'Never keep bad secrets! Tell Mom!'
      }
    ]
  }
];

export const JUNIOR_SECRETS = [
  {
    id: 'jun-sec-1',
    titleUrdu: 'گیم زون میں پیسوں کا راز',
    titleEnglish: 'The Game Zone Money Secret',
    storyArc: [
      {
        step: 1,
        promptUrdu: 'گیم زون میں ایک آدمی آپ کو 500 روپے دیتا ہے اور کہتا ہے: "یہ پیسے رکھو اور امی ابو کو مت بتانا کہ ہم نے یہ گیم کھیلی"۔ یہ کیا ہے؟',
        promptEnglish: 'A supervisor at a game arcade gives you money and says: "Keep this cash and hide it from your parents". What is this?',
        options: [
          {
            id: 'js1-1-a',
            textUrdu: 'برا راز (Bad Secret) 🛑 — کیونکہ یہ امی ابو سے بات چھپانے کو کہہ رہا ہے۔',
            textEnglish: 'Bad Secret 🛑 — because it asks you to hide things from parents.',
            isCorrect: true,
            feedbackUrdu: 'بالکل صحیح! کوئی بھی راز جو والدین سے چھپایا جائے وہ برا راز ہوتا ہے۔',
            feedbackEnglish: 'Correct! Any secret that isolates you from parents is a Bad Secret.'
          },
          {
            id: 'js1-1-b',
            textUrdu: 'اچھا تحفہ (Good Gift) 🎁',
            textEnglish: 'Good Gift 🎁',
            isCorrect: false,
            feedbackUrdu: 'غلط! اجنبی کا پیسہ اور راز دونوں خطرناک ہیں۔',
            feedbackEnglish: 'Incorrect! Secrets tied to money from strangers are dangerous.'
          }
        ]
      },
      {
        step: 2,
        promptUrdu: 'وہ آدمی دھمکی دیتا ہے: "اگر امی کو بتایا تو میں پیسے واپس لے لوں گا!" آپ کیا کریں گے؟',
        promptEnglish: 'He threatens: "If you tell your parents, I will take it back!" What do you do?',
        options: [
          {
            id: 'js1-2-a',
            textUrdu: 'پیسے وہیں چھوڑیں اور سیدھا بھاگ کر اپنے ابو کو سچ بتا دیں۔',
            textEnglish: 'Leave the cash behind and run straight to tell Dad the whole truth.',
            isCorrect: true,
            feedbackUrdu: 'زبردست! سچ بتانے سے ابو آپ کو شاباشی دیں گے اور محفوظ رکھیں گے! ⭐',
            feedbackEnglish: 'Superb! Telling Dad keeps you protected and safe! ⭐'
          }
        ]
      }
    ]
  }
];

// 5. GOOD VS BAD SURPRISES

export const TODDLER_SURPRISES = [
  {
    id: 'tod-surp-1',
    titleUrdu: 'دادی جان کے لیے خوبصورت پھول 🌸',
    titleEnglish: 'Surprise Flower for Grandma 🌸',
    isGoodSurprise: true,
    feedbackUrdu: 'یہ پیارا سا "اچھا سرپرائز" ہے! اس سے خوشی ملتی ہے! 😊',
    feedbackEnglish: 'This is a happy Good Surprise! It brings joy! 😊',
    icon: '🌸'
  },
  {
    id: 'tod-surp-2',
    titleUrdu: 'اجنبی کا کہنا: "یہ ڈبہ چھپا کر رکھو، کسی کو نہ دکھاؤ" 📦',
    titleEnglish: 'Stranger saying: "Hide this box, show no one" 📦',
    isGoodSurprise: false,
    feedbackUrdu: 'یہ "برا راز" ہے! اجنبی کی کوئی چیز نہیں چھپانی! 🛑',
    feedbackEnglish: 'This is a Bad Secret! Never hide things for strangers! 🛑',
    icon: '📦'
  }
];

export const JUNIOR_SURPRISES = [
  {
    id: 'jun-surp-1',
    titleUrdu: 'پیٹ میں بوجھ بمقابلہ پیٹ میں خوشی',
    titleEnglish: 'Heavy Tummy Secret vs Happy Smile',
    storyArc: [
      {
        step: 1,
        promptUrdu: 'جب کوئی راز آپ کے پیٹ میں ڈر، پریشانی یا بوجھ محسوس کروائے، تو وہ کیا ہوتا ہے؟',
        promptEnglish: 'When a secret makes your tummy feel heavy, scared, or nervous, what is it?',
        options: [
          {
            id: 'jsur-1-a',
            textUrdu: 'برا راز (Bad Secret) 🛑 — فوراً اپنے بھروسہ مند بالغ کو بتائیں۔',
            textEnglish: 'Bad Secret 🛑 — tell your trusted adult immediately.',
            isCorrect: true,
            feedbackUrdu: 'بالکل درست! آپ کے پیٹ کا ڈر آپ کو بتاتا ہے کہ سچ امی ابو کو بتانے کا وقت آ گیا ہے۔',
            feedbackEnglish: 'Correct! Your gut feeling alerts you that it is time to tell parents.'
          }
        ]
      }
    ]
  }
];

// 6. SAFETY WORDS / VOCABULARY

export const TODDLER_SAFETY_WORDS = [
  {
    id: 'tod-w1',
    wordUrdu: 'محفوظ چھونا (Safe Touch)',
    wordEnglish: 'Safe Touch',
    meaningUrdu: 'امی ابو کا پیار سے گلے لگانا 🤗',
    meaningEnglish: 'Loving hug from Mom & Dad 🤗',
    icon: '🤗',
    color: 'bg-emerald-100 text-emerald-950 border-emerald-400'
  },
  {
    id: 'tod-w2',
    wordUrdu: 'غیر محفوظ چھونا (Unsafe Touch)',
    wordEnglish: 'Unsafe Touch',
    meaningUrdu: 'کپڑوں کے اندر چھونا یا تکلیف دینا 🛑',
    meaningEnglish: 'Touch under clothes or touch that hurts 🛑',
    icon: '🛑',
    color: 'bg-rose-100 text-rose-950 border-rose-400'
  },
  {
    id: 'tod-w3',
    wordUrdu: 'اجنبی (Stranger)',
    wordEnglish: 'Stranger',
    meaningUrdu: 'جسے آپ کے امی ابو نہیں جانتے 👤',
    meaningEnglish: 'Someone you & parents do not know 👤',
    icon: '👤',
    color: 'bg-sky-100 text-sky-950 border-sky-400'
  }
];

export const JUNIOR_SAFETY_WORDS = [
  {
    id: 'jun-w1',
    wordUrdu: 'حد بندی (Personal Space / Had Bandi)',
    wordEnglish: 'Personal Space / Boundaries',
    questionUrdu: 'آپ کے جسم کے ارد گرد وہ محفوظ داؤرہ جس میں آپ کی اجازت کے بغیر کوئی داخل نہیں ہو سکتا، اسے کیا کہتے ہیں؟',
    questionEnglish: 'What do we call the safe invisible bubble around your body?',
    options: [
      { id: 'jw1-a', textUrdu: 'حد بندی (Personal Space) ⭕', isCorrect: true },
      { id: 'jw1-b', textUrdu: 'کھیل کی جگہ (Playground)', isCorrect: false }
    ],
    icon: '⭕'
  },
  {
    id: 'jun-w2',
    wordUrdu: 'بھروسہ مند بالغ (Trusted Adult)',
    wordEnglish: 'Trusted Adult',
    questionUrdu: 'وہ خاص بڑے جو ہمیشہ آپ کی بات سنتے ہیں اور آپ کو محفوظ رکھتے ہیں، انہیں کیا کہتے ہیں؟',
    questionEnglish: 'What do we call grown-ups who always listen and protect us?',
    options: [
      { id: 'jw2-a', textUrdu: 'بھروسہ مند بالغ (Trusted Adult) 🛡️', isCorrect: true },
      { id: 'jw2-b', textUrdu: 'اجنبی پڑوسی (Stranger)', isCorrect: false }
    ],
    icon: '🛡️'
  }
];

