import type { Sloka, SlokaSummary } from "./types";

const SLOKAS: Sloka[] = [
  {
    id: "lingashtakam",
    title: "Lingashtakam",
    titleTamil: "லிங்காஷ்டகம்",
    category: "Shiva",
    duration: "12 min",
    icon: "LI",
    lines: [
      {
        tamil: "ப்ரஹ்ம முராரி ஸுரார்சித லிங்கம்",
        english: "Brahma Murari Surarchita Lingam",
        meaning: "The Lingam worshipped by Brahma, Vishnu, and the devas.",
      },
      {
        tamil: "நிர்மல பாஷித ஶோபித லிங்கம்",
        english: "Nirmala Bhashita Shobhita Lingam",
        meaning: "The pure and radiant Lingam.",
      },
      {
        tamil: "ஜன்மஜ துக்க விநாஶக லிங்கம்",
        english: "Janmaja Dukha Vinashaka Lingam",
        meaning: "The Lingam that removes sorrow born of worldly life.",
      },
      {
        tamil: "தத் ப்ரணமாமி ஸதாஶிவ லிங்கம்",
        english: "Tat Pranamami Sadashiva Lingam",
        meaning: "I bow to that Sadashiva Lingam.",
      },
      {
        tamil: "தேவ முனி ப்ரவராசித லிங்கம்",
        english: "Deva Muni Pravaraarchita Lingam",
        meaning: "Worshipped by exalted sages and celestial beings.",
      },
      {
        tamil: "காம தஹந கருணாகர லிங்கம்",
        english: "Kama Dahana Karunakara Lingam",
        meaning: "Compassionate Lingam, destroyer of desire-born bondage.",
      },
      {
        tamil: "ராவண தர்ப விநாஶக லிங்கம்",
        english: "Ravana Darpa Vinashaka Lingam",
        meaning: "The Lingam that destroys arrogance and ego.",
      },
      {
        tamil: "தத் ப்ரணமாமி ஸதாஶிவ லிங்கம்",
        english: "Tat Pranamami Sadashiva Lingam",
        meaning: "I bow to that Sadashiva Lingam.",
      },
      {
        tamil: "ஸர்வ ஸுகந்தி ஸுலேபித லிங்கம்",
        english: "Sarva Sugandhi Sulepita Lingam",
        meaning: "Anointed with all sacred fragrances.",
      },
      {
        tamil: "புத்தி விவர்தந காரண லிங்கம்",
        english: "Buddhi Vivardhana Kaarana Lingam",
        meaning: "The Lingam that expands inner wisdom.",
      },
      {
        tamil: "ஸித்த ஸுராஸுர வந்தித லிங்கம்",
        english: "Siddha Suraasura Vandita Lingam",
        meaning: "Revered by siddhas, devas, and all beings.",
      },
      {
        tamil: "தத் ப்ரணமாமி ஸதாஶிவ லிங்கம்",
        english: "Tat Pranamami Sadashiva Lingam",
        meaning: "I bow to that Sadashiva Lingam.",
      },
      {
        tamil: "கனக மஹா மணி பூஷித லிங்கம்",
        english: "Kanaka Maha Mani Bhushita Lingam",
        meaning: "Adorned with gold and precious gems.",
      },
      {
        tamil: "பணிபதி வேஷ்டித ஶோபித லிங்கம்",
        english: "Phanipati Veshtita Shobhita Lingam",
        meaning: "Encircled by the serpent, shining brilliantly.",
      },
      {
        tamil: "தக்ஷ ஸுயக்ஞ விநாஶக லிங்கம்",
        english: "Daksha Suyajna Vinashaka Lingam",
        meaning: "Destroyer of egoistic sacrifice and pride.",
      },
      {
        tamil: "தத் ப்ரணமாமி ஸதாஶிவ லிங்கம்",
        english: "Tat Pranamami Sadashiva Lingam",
        meaning: "I bow to that Sadashiva Lingam.",
      },
    ],
  },
  {
    id: "shiva-panchakshara-stotram",
    title: "Shiva Panchakshara Stotram",
    titleTamil: "ஶிவ பஞ்சாக்ஷர ஸ்தோத்ரம்",
    category: "Shiva",
    duration: "9 min",
    icon: "OM",
    lines: [
      {
        tamil: "நாகேந்த்ர ஹாராய த்ரிலோசனாய",
        english: "Nagendra Haraya Trilochanaya",
        meaning: "Salutations to the three-eyed Lord adorned with serpents.",
      },
      {
        tamil: "பஸ்மாங்க ராகாய மஹேஶ்வராய",
        english: "Bhasmanga Ragaya Maheshvaraya",
        meaning: "To Maheshvara whose body is adorned with sacred ash.",
      },
      {
        tamil: "நித்யாய ஶுத்தாய திகம்பராய",
        english: "Nityaya Shuddhaya Digambaraya",
        meaning: "The eternal, pure, sky-clad one.",
      },
      {
        tamil: "தஸ்மை நகாராய நம: ஶிவாய",
        english: "Tasmai Nakaaraya Namah Shivaya",
        meaning: "Salutations to Shiva through the syllable Na.",
      },
      {
        tamil: "மந்தாகினீ ஸலில சந்தன சர்சிதாய",
        english: "Mandakini Salila Chandana Charchitaya",
        meaning: "Anointed with Ganga water and sandal paste.",
      },
      {
        tamil: "நந்தீஶ்வர ப்ரமதநாத மஹேஶ்வராய",
        english: "Nandeeshvara Pramathanatha Maheshvaraya",
        meaning: "Lord of Nandi and all attendants.",
      },
      {
        tamil: "மந்தார புஷ்ப பஹு புஷ்ப ஸுபூஜிதாய",
        english: "Mandara Pushpa Bahu Pushpa Supoojitaya",
        meaning: "Worshipped with celestial flowers.",
      },
      {
        tamil: "தஸ்மை மகாராய நம: ஶிவாய",
        english: "Tasmai Makaaraya Namah Shivaya",
        meaning: "Salutations to Shiva through the syllable Ma.",
      },
      {
        tamil: "ஶிவாய கௌரீ வதநாப்ஜ வ்ருந்த",
        english: "Shivaya Gauri Vadanabja Vrinda",
        meaning: "Beloved of Gauri, lotus-faced and auspicious.",
      },
      {
        tamil: "ஸூர்யாய தக்ஷாத்வர நாஶகாய",
        english: "Suryaya Dakshaadhvara Naashakaya",
        meaning: "Destroyer of arrogance and false sacrifice.",
      },
      {
        tamil: "ஶ்ரீ நீலகண்டாய வ்ருஷத்வஜாய",
        english: "Sri Neelakanthaya Vrishadhvajaya",
        meaning: "Blue-throated Lord whose emblem is the bull.",
      },
      {
        tamil: "தஸ்மை ஶிகாராய நம: ஶிவாய",
        english: "Tasmai Shikaaraya Namah Shivaya",
        meaning: "Salutations to Shiva through the syllable Shi.",
      },
    ],
  },
  {
    id: "shantakaram-bhujagashayanam",
    title: "Shantakaram Bhujagashayanam",
    titleTamil: "ஶாந்தாகாரம் புஜகஶயனம்",
    category: "Vishnu",
    duration: "6 min",
    icon: "VI",
    lines: [
      {
        tamil: "ஶாந்தாகாரம் புஜகஶயனம்",
        english: "Shantakaram Bhujagashayanam",
        meaning: "The serene one reclining on the cosmic serpent.",
      },
      {
        tamil: "பத்மநாபம் ஸுரேஶம்",
        english: "Padmanabham Suresham",
        meaning: "Lotus-naveled Lord of the devas.",
      },
      {
        tamil: "விஶ்வாதாரம் ககன ஸத்ருஶம்",
        english: "Vishvadharam Gaganasadrisham",
        meaning: "Support of the universe, vast as the sky.",
      },
      {
        tamil: "மேகவர்ணம் ஶுபாங்கம்",
        english: "Meghavarnam Shubhangam",
        meaning: "Cloud-hued and auspicious in form.",
      },
      {
        tamil: "லக்ஷ்மீகாந்தம் கமல நயனம்",
        english: "Lakshmikantam Kamalanayanam",
        meaning: "Beloved of Lakshmi, lotus-eyed.",
      },
      {
        tamil: "யோகிபிர் த்யான கம்யம்",
        english: "Yogibhirdhyanagamyam",
        meaning: "Attained by yogis through meditation.",
      },
      {
        tamil: "வந்தே விஷ்ணும் பவ பய ஹரம்",
        english: "Vande Vishnum Bhava Bhayaharam",
        meaning: "I bow to Vishnu who removes worldly fear.",
      },
      {
        tamil: "ஸர்வ லோகைக நாதம்",
        english: "Sarva Lokaika Naatham",
        meaning: "The one Lord of all worlds.",
      },
    ],
  },
  {
    id: "ya-devi-sarva-bhuteshu",
    title: "Ya Devi Sarva Bhuteshu",
    titleTamil: "யா தேவீ ஸர்வ பூதேஷு",
    category: "Durga",
    duration: "8 min",
    icon: "DU",
    lines: [
      {
        tamil: "யா தேவீ ஸர்வ பூதேஷு விஷ்ணுமாயேதி ஶப்திதா",
        english: "Ya Devi Sarva Bhuteshu Vishnumayeti Shabdita",
        meaning: "The Devi present in all beings as cosmic consciousness.",
      },
      {
        tamil: "நமஸ்தஸ்யை நமஸ்தஸ்யை நமஸ்தஸ்யை நமோ நம:",
        english: "Namastasyai Namastasyai Namastasyai Namo Namah",
        meaning: "Repeated salutations to Her.",
      },
      {
        tamil: "யா தேவீ ஸர்வ பூதேஷு சேதனேத்யபிதீயதே",
        english: "Ya Devi Sarva Bhuteshu Chetanetyabhidhiyate",
        meaning: "The Devi present as life-force in all beings.",
      },
      {
        tamil: "நமஸ்தஸ்யை நமஸ்தஸ்யை நமஸ்தஸ்யை நமோ நம:",
        english: "Namastasyai Namastasyai Namastasyai Namo Namah",
        meaning: "Repeated salutations to Her.",
      },
      {
        tamil: "யா தேவீ ஸர்வ பூதேஷு புத்தி ரூபேண ஸம்ஸ்திதா",
        english: "Ya Devi Sarva Bhuteshu Buddhi Rupena Samsthita",
        meaning: "The Devi present as wisdom in all beings.",
      },
      {
        tamil: "நமஸ்தஸ்யை நமஸ்தஸ்யை நமஸ்தஸ்யை நமோ நம:",
        english: "Namastasyai Namastasyai Namastasyai Namo Namah",
        meaning: "Repeated salutations to Her.",
      },
      {
        tamil: "யா தேவீ ஸர்வ பூதேஷு ஶக்தி ரூபேண ஸம்ஸ்திதா",
        english: "Ya Devi Sarva Bhuteshu Shakti Rupena Samsthita",
        meaning: "The Devi present as strength in all beings.",
      },
      {
        tamil: "நமஸ்தஸ்யை நமஸ்தஸ்யை நமஸ்தஸ்யை நமோ நம:",
        english: "Namastasyai Namastasyai Namastasyai Namo Namah",
        meaning: "Repeated salutations to Her.",
      },
    ],
  },
  {
    id: "hanuman-chalisa",
    title: "Hanuman Chalisa",
    titleTamil: "ஹனுமான் சாலீஸா",
    category: "Hanuman",
    duration: "14 min",
    icon: "HC",
    lines: [
      {
        tamil: "ஸ்ரீ குரு சரண சரோஜ ரஜ், நிஜ மன முகுரு சுதாரி",
        english: "Shri Guru Charan Saroj Raj, Nij Man Mukur Sudhari",
        pronunciation: "Shree Gu-ru Cha-ran Sa-roj Raj, Nij Man Mu-kur Su-dha-ri",
        meaning: "I cleanse my mind by meditating on the dust of the Guru's lotus feet.",
      },
      {
        tamil: "பர்னௌ ரகுபர விமல யசு, ஜோ தயகு பல சாரி",
        english: "Barnau Raghubar Bimal Jasu, Jo Dayaku Phal Chari",
        pronunciation: "Bar-nau Ra-ghu-bar Bi-mal Ja-su, Jo Da-ya-ku Phal Cha-ri",
        meaning: "I sing the pure glory of Rama, which grants the four fruits of life.",
      },
      {
        tamil: "புத்தி ஹீன தனு ஜானிகே, சுமிரௌ பவன குமார்; பல புத்தி வித்யா தேஹு மோஹி, ஹரஹு கலேஷ விகார்",
        english: "Buddhi Heen Tanu Janike, Sumirau Pavan Kumar; Bal Buddhi Vidya Dehu Mohi, Harahu Kalesh Vikar",
        pronunciation:
          "Bud-dhi Heen Ta-nu Ja-ni-ke, Su-mi-rau Pa-van Ku-mar; Bal Bud-dhi Vid-ya De-hu Mo-hi, Ha-ra-hu Ka-lesh Vi-kar",
        meaning: "Knowing my limitations, I pray to Hanuman for strength, wisdom, and freedom from suffering.",
      },
      {
        tamil: "ஜெய் ஹனுமான் ஞான குண சாகர், ஜெய் கபீஸ் திஹூன் லோக உஜாகர்",
        english: "Jai Hanuman Gyan Gun Sagar, Jai Kapis Tihun Lok Ujagar",
        pronunciation: "Jai Ha-nu-man Gyan Gun Sa-gar, Jai Ka-pis Ti-hun Lok U-ja-gar",
        meaning: "Victory to Hanuman, ocean of wisdom and virtue, who illumines all three worlds.",
      },
      {
        tamil: "ராம தூத் அதுலித பல தாமா, அஞ்சனி புத்ர பவன சுத் நாமா",
        english: "Ram Doot Atulit Bal Dhama, Anjani Putra Pavan Sut Nama",
        pronunciation: "Ram Doot A-tu-lit Bal Dha-ma, An-ja-ni Put-ra Pa-van Sut Na-ma",
        meaning: "Messenger of Rama, abode of immeasurable strength, son of Anjana and the Wind God.",
      },
      {
        tamil: "மஹாவீர் விக்ரம பஜ்ரங்கீ, குமதி நிவார் சுமதி கே ஸங்கீ",
        english: "Mahaveer Vikram Bajrangi, Kumati Nivar Sumati Ke Sangi",
        pronunciation: "Ma-ha-veer Vik-ram Baj-ran-gi, Ku-ma-ti Ni-var Su-ma-ti Ke San-gi",
        meaning: "Mighty hero with a body like a thunderbolt, dispeller of evil thoughts, friend of the wise.",
      },
      {
        tamil: "கஞ்சன பரண பிராஜ சுபேசா, கானன குண்டல குஞ்சித கேசா",
        english: "Kanchan Baran Biraj Subesha, Kanan Kundal Kunchit Kesha",
        pronunciation: "Kan-chan Ba-ran Bi-raj Su-be-sha, Ka-nan Kun-dal Kun-chit Ke-sha",
        meaning: "Golden-hued, beautifully adorned, with earrings and curly hair.",
      },
      {
        tamil: "ஹாத் பஜ்ர அவ த்வஜா பிராஜை, காந்தே மூஞ்ஜ ஜனேவ ஸாஜை",
        english: "Hath Vajra Au Dhwaja Birajai, Kandhe Munj Janeu Sajai",
        pronunciation: "Hath Vaj-ra Au Dhwa-ja Bi-ra-jai, Kand-he Munj Ja-neu Sa-jai",
        meaning: "Holding a thunderbolt and flag, wearing the sacred thread on his shoulder.",
      },
      {
        tamil: "ஶங்கர சுவன கேஸரீ நந்தன, தேஜ ப்ரதாப் மஹா ஜக் வந்தன",
        english: "Shankar Suvan Kesari Nandan, Tej Pratap Maha Jag Vandan",
        pronunciation: "Shan-kar Su-van Ke-sa-ri Nan-dan, Tej Pra-tap Ma-ha Jag Van-dan",
        meaning: "Beloved of Shankara, son of Kesari, your splendor is revered by all.",
      },
      {
        tamil: "வித்யாவான் குணீ அதி சாதுர், ராம காஜ கரிபே கோ ஆதுர்",
        english: "Vidyavan Guni Ati Chatur, Ram Kaj Karibe Ko Atur",
        pronunciation: "Vid-ya-van Gu-ni A-ti Cha-tur, Ram Kaj Ka-ri-be Ko A-tur",
        meaning: "Learned, virtuous, and ever ready to do Rama's work.",
      },
      {
        tamil: "ப்ரபு சரித்ர சுனிபே கோ ரஸியா, ராம லகன ஸீதா மன பஸியா",
        english: "Prabhu Charitra Sunibe Ko Rasiya, Ram Lakhan Sita Man Basiya",
        pronunciation: "Pra-bhu Cha-rit-ra Su-ni-be Ko Ra-si-ya, Ram La-khan Si-ta Man Ba-si-ya",
        meaning: "You delight in hearing the Lord's stories, with Rama, Lakshman, and Sita living in your heart.",
      },
      {
        tamil: "ஸூக்ஷ்ம ரூப தரி ஸியஹி திகாவா, பிகட ரூப தரி லங்க ஜராவா",
        english: "Sukshma Roop Dhari Siyahi Dikhava, Vikat Roop Dhari Lank Jarava",
        pronunciation: "Sook-shma Roop Dha-ri Si-ya-hi Dik-ha-va, Vi-kat Roop Dha-ri Lank Ja-ra-va",
        meaning: "You took a tiny form to meet Sita, and a fierce form to burn Lanka.",
      },
      {
        tamil: "பீம ரூப தரி அஸுர ஸம்ஹாரே, ராமசந்த்ர கே காஜ ஸம்வாரே",
        english: "Bheem Roop Dhari Asur Sanghare, Ramchandra Ke Kaj Sanvare",
        pronunciation: "Bheem Roop Dha-ri A-sur San-gha-re, Ram-chan-dra Ke Kaj San-va-re",
        meaning: "Taking a fierce form, you destroyed demons and accomplished Rama's mission.",
      },
      {
        tamil: "லாய ஸஞ்ஜீவன லகன ஜியாயே, ஸ்ரீ ரகுபீர ஹரஷி உரலாயே",
        english: "Laye Sanjivan Lakhan Jiyaye, Shri Raghuveer Harashi Ur Laye",
        pronunciation: "La-ye San-ji-van La-khan Ji-ya-ye, Shree Ra-ghu-veer Ha-ra-shi Ur La-ye",
        meaning: "You brought Sanjivani and revived Lakshman, filling Rama's heart with joy.",
      },
      {
        tamil: "ரகுபதி கீன்ஹீ பஹுத படாயீ, தும மம ப்ரிய பரத ஸம பாயீ",
        english: "Raghupati Kinhi Bahut Badai, Tum Mam Priya Bharat Sam Bhai",
        pronunciation: "Ra-ghu-pa-ti Kin-hi Ba-hut Ba-dai, Tum Mam Pri-ya Bha-rat Sam Bhai",
        meaning: "Lord Rama praised you greatly, calling you as dear to him as his brother Bharat.",
      },
      {
        tamil: "ஸஹஸ வதன தும்ஹரோ யஶ காவை, அஸ கஹி ஶ்ரீபதி கண்ட லகாவை",
        english: "Sahas Vadan Tumharo Yash Gavai, As Kahi Shripati Kanth Lagavai",
        pronunciation: "Sa-has Va-dan Tum-ha-ro Yash Ga-vai, As Ka-hi Shri-pa-ti Kanth La-ga-vai",
        meaning: "Even the thousand-headed serpent praises your glory, and Lord Rama embraced you.",
      },
      {
        tamil: "ஸனகாதிக ப்ரஹ்மாதி முனீஶா, நாரத ஶாரத ஸஹித அஹீஶா",
        english: "Sanakadik Brahmadi Munisha, Narad Sharad Sahit Ahisha",
        pronunciation: "Sa-na-ka-dik Brah-ma-di Mu-ni-sha, Na-rad Sha-rad Sa-hit A-hi-sha",
        meaning: "Sages like Sanaka, Brahma, Narada, Saraswati, and Sheshnag praise you.",
      },
      {
        tamil: "ஜம் குபேர திகபால ஜஹாம் தே, கபி கபி கோபித கஹி ஸகே கஹாம் தே",
        english: "Yam Kuber Digpal Jahan Te, Kavi Kovid Kahi Sake Kahan Te",
        pronunciation: "Yam Ku-ber Dig-pal Ja-han Te, Ka-vi Ko-vid Ka-hi Sa-ke Ka-han Te",
        meaning: "Yama, Kubera, the guardians, even poets and scholars cannot fully describe your glory.",
      },
      {
        tamil: "தும் உபகார ஸுக்ரீவஹிம் கீன்ஹா, ராம மிலாய ராஜபத தீன்ஹா",
        english: "Tum Upkar Sugreevahin Keenha, Ram Milay Raj Pad Deenha",
        pronunciation: "Tum Up-kar Su-gree-va-hin Keen-ha, Ram Mi-lay Raj Pad Deen-ha",
        meaning: "You helped Sugriva, uniting him with Rama and restoring his kingdom.",
      },
      {
        tamil: "தும்ஹரோ மந்த்ர விபீஷண மானா, லங்கேஶ்வர பாயே ஸப ஜக ஜானா",
        english: "Tumharo Mantra Vibhishan Mana, Lankeshwar Bhaye Sab Jag Jana",
        pronunciation: "Tum-ha-ro Man-tra Vi-bhi-shan Ma-na, Lan-kesh-war Bha-ye Sab Jag Ja-na",
        meaning: "Vibhishan accepted your counsel and became king of Lanka, as the world knows.",
      },
    ],
  },
  {
    id: "hanuman-dhyanam",
    title: "Hanuman Dhyanam",
    titleTamil: "ஹனுமான் த்யானம்",
    category: "Hanuman",
    duration: "5 min",
    icon: "HD",
    lines: [
      {
        tamil: "மனோஜவம் மாருத துல்ய வேகம்",
        english: "Manojavam Maruta Tulya Vegam",
        meaning: "Swift as the mind, fast as the wind.",
      },
      {
        tamil: "ஜிதேந்த்ரியம் புத்திமதாம் வரிஷ்டம்",
        english: "Jitendriyam Buddhimataam Varishtham",
        meaning: "Master of senses, foremost among the wise.",
      },
      {
        tamil: "வாதாத்மஜம் வானராயூத முக்யம்",
        english: "Vatatmajam Vanarayutha Mukhyam",
        meaning: "Son of Vayu and chief among vanaras.",
      },
      {
        tamil: "ஶ்ரீ ராம தூதம் ஶிரஸா நமாமி",
        english: "Sri Rama Dutam Shirasa Namami",
        meaning: "I bow to the messenger of Shri Rama.",
      },
      {
        tamil: "ஆஞ்ஜனேயம் அதி பாடலானநம்",
        english: "Anjaneyam Ati Patalananam",
        meaning: "I meditate on radiant Hanuman.",
      },
      {
        tamil: "காஞ்சநாத்ரி கமனீய விக்ரஹம்",
        english: "Kanchanadri Kamaneeya Vigraham",
        meaning: "Golden and majestic in form.",
      },
      {
        tamil: "பாரிஜாத தரு மூல வாஸினம்",
        english: "Parijata Taru Moola Vasinam",
        meaning: "Dwelling beneath the celestial tree.",
      },
      {
        tamil: "பாவயாமி பவமான நந்தனம்",
        english: "Bhavayami Pavamana Nandanam",
        meaning: "I contemplate the son of the Wind God.",
      },
    ],
  },
  {
    id: "guru-brahma-guru-vishnu",
    title: "Guru Brahma Guru Vishnu",
    titleTamil: "குரு ப்ரஹ்மா குரு விஷ்ணு",
    category: "Guru",
    duration: "4 min",
    icon: "GU",
    lines: [
      {
        tamil: "குரு ப்ரஹ்மா குரு விஷ்ணு",
        english: "Guru Brahma Guru Vishnu",
        meaning: "Guru is Brahma and Vishnu.",
      },
      {
        tamil: "குரு தேவோ மஹேஶ்வர:",
        english: "Guru Devo Maheshwara",
        meaning: "Guru is indeed Maheshwara.",
      },
      {
        tamil: "குரு: ஸாக்ஷாத் பரப்ரஹ்ம",
        english: "Guru Sakshat Parabrahma",
        meaning: "Guru is the Supreme Reality itself.",
      },
      {
        tamil: "தஸ்மை ஶ்ரீ குரவே நம:",
        english: "Tasmai Shri Gurave Namah",
        meaning: "Salutations to that revered Guru.",
      },
      {
        tamil: "அகண்ட மண்டலாகாரம்",
        english: "Akhanda Mandalakaram",
        meaning: "That which pervades all creation.",
      },
      {
        tamil: "வ்யாப்தம் யேன சராசரம்",
        english: "Vyaptam Yena Characharam",
        meaning: "The moving and unmoving universe is pervaded by That.",
      },
      {
        tamil: "தத்பதம் தர்ஶிதம் யேன",
        english: "Tatpadam Darshitam Yena",
        meaning: "By whom the Supreme state is shown.",
      },
      {
        tamil: "தஸ்மை ஶ்ரீ குரவே நம:",
        english: "Tasmai Shri Gurave Namah",
        meaning: "Salutations to that revered Guru.",
      },
    ],
  },
  {
    id: "vakratunda-mahakaya",
    title: "Vakratunda Mahakaya",
    titleTamil: "வக்ரதுண்ட மஹாகாய",
    category: "Ganesh",
    duration: "3 min",
    icon: "GA",
    lines: [
      {
        tamil: "வக்ரதுண்ட மஹாகாய",
        english: "Vakratunda Mahakaya",
        meaning: "O Lord with the curved trunk and mighty body.",
      },
      {
        tamil: "ஸூர்ய கோடி ஸமப்ரப",
        english: "Surya Koti Samaprabha",
        meaning: "Whose splendour equals a million suns.",
      },
      {
        tamil: "நிர்விக்நம் குரு மே தேவ",
        english: "Nirvighnam Kuru Me Deva",
        meaning: "Please make all my works free from obstacles.",
      },
      {
        tamil: "ஸர்வ கார்யேஷு ஸர்வதா",
        english: "Sarva Karyeshu Sarvada",
        meaning: "In all undertakings, always.",
      },
      {
        tamil: "ஶுக்லாம்பர தரம் விஷ்ணும்",
        english: "Shuklambara Dharam Vishnum",
        meaning: "Robed in white, all-pervading.",
      },
      {
        tamil: "ஶஶி வர்ணம் சதுர்புஜம்",
        english: "Shashi Varnam Chatur Bhujam",
        meaning: "Moon-hued and four-armed.",
      },
      {
        tamil: "ப்ரஸன்ன வதநம் த்யாயேத்",
        english: "Prasanna Vadanam Dhyayet",
        meaning: "I meditate on the serene-faced Lord.",
      },
      {
        tamil: "ஸர்வ விக்நோப ஶாந்தயே",
        english: "Sarva Vighnopa Shantaye",
        meaning: "For the removal of all obstacles.",
      },
    ],
  },
  {
    id: "ganesha-pancharatnam",
    title: "Ganesha Pancharatnam",
    titleTamil: "கணேஶ பஞ்சரத்னம்",
    category: "Ganesh",
    duration: "8 min",
    icon: "GP",
    lines: [
      {
        tamil: "முதாகராத்த மோதகம் ஸதா விமுக்தி ஸாதகம்",
        english: "Mudaakaraatta Modakam Sadaa Vimukti Saadhakam",
        meaning: "He who holds modaka and grants liberation.",
      },
      {
        tamil: "கலாதராவதம்ஸகம் விலாஸி லோக ரக்ஷகம்",
        english: "Kalaadharaavatamsakam Vilaasi Loka Rakshakam",
        meaning: "Adorned with the crescent, protector of the worlds.",
      },
      {
        tamil: "அநாயகைக நாயகம் விநாஶிதேப தைத்யகம்",
        english: "Anaayakaika Naayakam Vinaashitebha Daityakam",
        meaning: "Leader of the leaderless, destroyer of the elephant demon.",
      },
      {
        tamil: "நதாஶுபாஶு நாஶகம் நமாமி தம் விநாயகம்",
        english: "Nataashubhaashu Naashakam Namaami Tam Vinaayakam",
        meaning: "I bow to that Vinayaka who removes all inauspiciousness.",
      },
      {
        tamil: "நதேதராதி பீகரம் நவோதிதார்க பாஸ்வரம்",
        english: "Natetaraati Bhikaram Navoditaarka Bhasvaram",
        meaning: "Terror of the unbowed, radiant as the rising sun.",
      },
      {
        tamil: "நமத் ஸுராரி நிர்ஜனம் நதாதிகாபதுத்தரம்",
        english: "Namat Suraari Nirjanam Nataadhikaapaduddharam",
        meaning: "Worshipped by devas; lifter of devotees from danger.",
      },
      {
        tamil: "ஸுரேஶ்வரம் நிதீஶ்வரம் கஜேஶ்வரம் கணேஶ்வரம்",
        english: "Suresvaram Nidhisvaram Gajesvaram Ganesvaram",
        meaning: "Lord of devas, of treasures, of elephants, of the ganas.",
      },
      {
        tamil: "மஹேஶ்வரம் தம் ஆஶ்ரயே பராத்பரம் நிரந்தரம்",
        english: "Mahesvaram Tam Aashraye Paraatparam Nirantaram",
        meaning: "I take refuge in that Mahesvara, supreme of the supreme.",
      },
    ],
  },
  {
    id: "krishna-madhurashtakam",
    title: "Madhurashtakam",
    titleTamil: "மதுராஷ்டகம்",
    category: "Krishna",
    duration: "7 min",
    icon: "KR",
    lines: [
      {
        tamil: "அதரம் மதுரம் வதனம் மதுரம்",
        english: "Adharam Madhuram Vadanam Madhuram",
        meaning: "Sweet are His lips, sweet is His face.",
      },
      {
        tamil: "நயனம் மதுரம் ஹஸிதம் மதுரம்",
        english: "Nayanam Madhuram Hasitam Madhuram",
        meaning: "Sweet are His eyes, sweet is His smile.",
      },
      {
        tamil: "ஹ்ருதயம் மதுரம் கமனம் மதுரம்",
        english: "Hridayam Madhuram Gamanam Madhuram",
        meaning: "Sweet is His heart, sweet is His gait.",
      },
      {
        tamil: "மதுராதிபதேர் அகிலம் மதுரம்",
        english: "Madhuraadhipater Akhilam Madhuram",
        meaning: "Everything is sweet about the Lord of Sweetness.",
      },
      {
        tamil: "வசனம் மதுரம் சரிதம் மதுரம்",
        english: "Vachanam Madhuram Charitam Madhuram",
        meaning: "Sweet are His words, sweet are His deeds.",
      },
      {
        tamil: "வஸனம் மதுரம் வலிதம் மதுரம்",
        english: "Vasanam Madhuram Valitam Madhuram",
        meaning: "Sweet is His attire, sweet His every gesture.",
      },
      {
        tamil: "சலிதம் மதுரம் ப்ரமிதம் மதுரம்",
        english: "Chalitam Madhuram Bhramitam Madhuram",
        meaning: "Sweet His movement, sweet His wandering.",
      },
      {
        tamil: "மதுராதிபதேர் அகிலம் மதுரம்",
        english: "Madhuraadhipater Akhilam Madhuram",
        meaning: "Everything is sweet about the Lord of Sweetness.",
      },
    ],
  },
  {
    id: "achyutam-keshavam",
    title: "Achyutam Keshavam",
    titleTamil: "அச்யுதம் கேஶவம்",
    category: "Krishna",
    duration: "5 min",
    icon: "AK",
    lines: [
      {
        tamil: "அச்யுதம் கேஶவம் க்ருஷ்ண தாமோதரம்",
        english: "Achyutam Keshavam Krishna Damodaram",
        meaning: "Salutations to the imperishable Krishna, Damodara.",
      },
      {
        tamil: "ராம நாராயணம் ஜானகீ வல்லபம்",
        english: "Rama Narayanam Janaki Vallabham",
        meaning: "Rama, Narayana, beloved of Sita.",
      },
      {
        tamil: "கௌந்தேயம் வாஸுதேவம் ஹரிம் ஶ்ரீ தரம்",
        english: "Kaunteyam Vasudevam Hareem Shri Dharam",
        meaning: "Son of Vasudeva, bearer of Lakshmi.",
      },
      {
        tamil: "தேவகீ நந்தனம் நந்தஜம் ஸுந்தரம்",
        english: "Devaki Nandanam Nandajam Sundaram",
        meaning: "Beloved son of Devaki and Nanda, the beautiful one.",
      },
      {
        tamil: "விஷ்ணவே ஜிஷ்ணவே ஶங்கினே சக்ரிணே",
        english: "Vishnave Jishnave Shankhine Chakrine",
        meaning: "To Vishnu, the victorious, bearer of conch and discus.",
      },
      {
        tamil: "ருக்மிணீ ராகிணே ஜானகீ ஜன்மனே",
        english: "Rukmini Raaginee Janaki Janmane",
        meaning: "Beloved of Rukmini and Janaki.",
      },
      {
        tamil: "பல்லவீ வல்லபாயார்சிதாயாத்மனே",
        english: "Ballavi Vallabhayaarchitaayatmane",
        meaning: "To the Self adored by the gopis.",
      },
      {
        tamil: "க்ருஷ்ண கோவிந்த ஹே முராரே ஹே நாத நாராயண வாஸுதேவ",
        english: "Krishna Govinda He Murare He Naatha Narayana Vasudeva",
        meaning: "Krishna, Govinda, slayer of Mura — O Lord, Narayana, Vasudeva.",
      },
    ],
  },
  {
    id: "mahalakshmi-ashtakam",
    title: "Mahalakshmi Ashtakam",
    titleTamil: "மஹாலக்ஷ்மீ அஷ்டகம்",
    category: "Lakshmi",
    duration: "10 min",
    icon: "LA",
    lines: [
      {
        tamil: "நமஸ்தே'ஸ்து மஹாமாயே ஶ்ரீ பீடே ஸுர பூஜிதே",
        english: "Namaste'stu Mahaamaaye Shree Peethe Sura Pujite",
        meaning: "Salutations to the great Mother seated on the throne, worshipped by devas.",
      },
      {
        tamil: "ஶங்க சக்ர கதா ஹஸ்தே மஹா லக்ஷ்மீ நமோஸ்துதே",
        english: "Shankha Chakra Gadaa Haste Mahaa Lakshmi Namostute",
        meaning: "Bearing conch, discus and mace — salutations, Mahalakshmi.",
      },
      {
        tamil: "நமஸ்தே கருடாரூடே கோலாஸுர பயங்கரி",
        english: "Namaste Garudaaroodhe Kolaasura Bhayankari",
        meaning: "Salutations to Her seated on Garuda, terror of the demon Kolasura.",
      },
      {
        tamil: "ஸர்வ பாப ஹரே தேவி மஹா லக்ஷ்மீ நமோஸ்துதே",
        english: "Sarva Paapa Hare Devi Mahaa Lakshmi Namostute",
        meaning: "Devi who removes all sin — salutations, Mahalakshmi.",
      },
      {
        tamil: "ஸர்வஜ்ஞே ஸர்வ வரதே ஸர்வ துஷ்ட பயங்கரி",
        english: "Sarvajne Sarva Varade Sarva Dushta Bhayankari",
        meaning: "All-knowing giver of boons, terror of the wicked.",
      },
      {
        tamil: "ஸர்வ து:க ஹரே தேவி மஹா லக்ஷ்மீ நமோஸ்துதே",
        english: "Sarva Duhkha Hare Devi Mahaa Lakshmi Namostute",
        meaning: "Remover of all sorrow — salutations, Mahalakshmi.",
      },
      {
        tamil: "ஸித்தி புத்தி ப்ரதே தேவி புக்தி முக்தி ப்ரதாயினி",
        english: "Siddhi Buddhi Prade Devi Bhukti Mukti Pradaayini",
        meaning: "Bestower of attainment, wisdom, enjoyment, and liberation.",
      },
      {
        tamil: "மந்த்ர மூர்தே ஸதா தேவி மஹா லக்ஷ்மீ நமோஸ்துதே",
        english: "Mantra Moorte Sadaa Devi Mahaa Lakshmi Namostute",
        meaning: "Embodiment of the sacred mantra — salutations, Mahalakshmi.",
      },
    ],
  },
  {
    id: "saraswati-vandana",
    title: "Saraswati Vandana",
    titleTamil: "ஸரஸ்வதீ வந்தனா",
    category: "Saraswati",
    duration: "5 min",
    icon: "SA",
    lines: [
      {
        tamil: "யா குந்தேந்து துஷாரஹார தவளா",
        english: "Yaa Kundendu Tushaara Haaradhavalaa",
        meaning: "She who is white as jasmine, the moon, snow, and pearls.",
      },
      {
        tamil: "யா ஶுப்ர வஸ்த்ராவ்ருதா",
        english: "Yaa Shubhra Vastraavritaa",
        meaning: "She who is robed in pure white garments.",
      },
      {
        tamil: "யா வீணா வரதண்ட மண்டிதகரா",
        english: "Yaa Veenaa Varadanda Manditakaraa",
        meaning: "She whose hand is graced by the veena and boon-giving rod.",
      },
      {
        tamil: "யா ஶ்வேத பத்மாஸனா",
        english: "Yaa Shveta Padmaasanaa",
        meaning: "She who sits upon the white lotus.",
      },
      {
        tamil: "யா ப்ரஹ்மாச்யுத ஶங்கர ப்ரப்ருதிபிர்",
        english: "Yaa Brahmaachyuta Shankara Prabhrutibhir",
        meaning: "She who is praised by Brahma, Vishnu, and Shiva.",
      },
      {
        tamil: "தேவை: ஸதா வந்திதா",
        english: "Devaih Sadaa Vanditaa",
        meaning: "Adored eternally by all the devas.",
      },
      {
        tamil: "ஸா மாம் பாது ஸரஸ்வதீ பகவதீ",
        english: "Saa Maam Paatu Saraswatee Bhagavatee",
        meaning: "May Goddess Saraswati protect me.",
      },
      {
        tamil: "நி: ஶேஷ ஜாட்யாபஹா",
        english: "Nih Shesha Jaadyaapahaa",
        meaning: "Who removes all dullness of mind without remainder.",
      },
    ],
  },
  {
    id: "subramanya-bhujangam",
    title: "Subramanya Bhujangam",
    titleTamil: "ஸுப்ரஹ்மண்ய புஜங்கம்",
    category: "Muruga",
    duration: "9 min",
    icon: "MU",
    lines: [
      {
        tamil: "ஸதா பாலரூபாபி விக்நாத்ரி ஹந்த்ரீ",
        english: "Sadaa Baalaroopaapi Vighnaadri Hantree",
        meaning: "Ever youthful in form, destroyer of the mountain of obstacles.",
      },
      {
        tamil: "மஹா தாந்த தைத்யாதி பேதக்ஷமா ச",
        english: "Mahaa Daanta Daityaadi Bhedakshamaa Cha",
        meaning: "Capable of subduing demons of great pride.",
      },
      {
        tamil: "முதாங்குஷ்ட மாத்ராபி மூகே'பி வாக்யா",
        english: "Muda'angushtha Maatraapi Mooke'pi Vaakyaa",
        meaning: "Even a touch from His thumb gives the mute speech.",
      },
      {
        tamil: "ப்ரதாத்ரீ நமஸ்தே குரோர்வேலா வதம்ஸே",
        english: "Pradaatree Namastey Gurorvelaa Vatamse",
        meaning: "Salutations to You, the resplendent guru, gem of the universe.",
      },
      {
        tamil: "ஜய ஜய ஹே மஹிஷாஸுர மர்தினி",
        english: "Jaya Jaya He Mahisaasura Mardini",
        meaning: "Victory to You, slayer of all darkness.",
      },
      {
        tamil: "ஶ்ரீ ஸுப்ரஹ்மண்யாய நமஸ்தே நமஸ்தே",
        english: "Shri Subrahmanyaaya Namaste Namaste",
        meaning: "Salutations again and again to Sri Subrahmanya.",
      },
      {
        tamil: "ஷண்முகாய நம:",
        english: "Shanmukhaaya Namaha",
        meaning: "Salutations to the six-faced Lord.",
      },
      {
        tamil: "ஶரவணபவாய நம:",
        english: "Sharavanabhavaaya Namaha",
        meaning: "Salutations to the One born of the reed forest.",
      },
    ],
  },
  {
    id: "kanda-shashti-kavasam-excerpt",
    title: "Kanda Shashti Kavasam",
    titleTamil: "கந்த ஷஷ்டி கவசம்",
    category: "Muruga",
    duration: "11 min",
    icon: "KS",
    lines: [
      {
        tamil: "துதிப்போர்க்கு வல் வினை போம் துன்பம் போம்",
        english: "Thuthiporkku val vinai pom thunbam pom",
        meaning: "For those who chant this, all troubles flee.",
      },
      {
        tamil: "நெடுநாள் வினையும் தூரும்",
        english: "Nedunaal vinaiyum thurum",
        meaning: "Even age-old karma is washed away.",
      },
      {
        tamil: "காலன் அடி நழுவுக் கைவிடுவார்",
        english: "Kaalan adi nazhuvuk kaividuvar",
        meaning: "The grip of death itself loosens.",
      },
      {
        tamil: "கந்த ஷஷ்டி கவசம் தனை",
        english: "Kanda Shashti Kavasam thanai",
        meaning: "By the protection of Kanda Shashti Kavasam.",
      },
      {
        tamil: "அமரர் இடர் தீர அமரம் புரியும்",
        english: "Amarar idar theera amaram puriyum",
        meaning: "He who removed the sufferings of the celestials in battle.",
      },
      {
        tamil: "குமரனடி நெஞ்சே குறி",
        english: "Kumaranadi nenjeh kuri",
        meaning: "O heart, remember the feet of Kumara.",
      },
      {
        tamil: "ஷஷ்டி நாள் நேச கவசம்",
        english: "Sashti naal nesa kavasam",
        meaning: "The loving armour of the sixth day.",
      },
      {
        tamil: "கௌரி அருள் புத்ரன் கந்த கவசம்",
        english: "Gowri arul putran kanda kavasam",
        meaning: "The protective armour of Gauri's son, Kanda.",
      },
    ],
  },
  {
    id: "lalitha-sahasranama-excerpt",
    title: "Lalitha Sahasranama",
    titleTamil: "லலிதா ஸஹஸ்ரநாமம்",
    category: "Amman",
    duration: "12 min",
    icon: "LS",
    lines: [
      {
        tamil: "ஶ்ரீ மாதா ஶ்ரீ மஹா ராஜ்ஞீ ஶ்ரீமத் ஸிம்ஹாஸனேஶ்வரி",
        english: "Sri Mata Sri Maha Rajni Srimat Simhasaneshwari",
        meaning: "The auspicious Mother, great Queen, seated on the lion throne.",
      },
      {
        tamil: "சித் அக்னி குண்ட ஸம்பூதா தேவகார்ய ஸமுத்யதா",
        english: "Chid Agni Kunda Sambhuta Devakarya Samudyata",
        meaning: "Born from the fire-pit of consciousness, ready for the work of the devas.",
      },
      {
        tamil: "உத்யத் பானு ஸஹஸ்ராபா சதுர்பாஹு ஸமன்விதா",
        english: "Udyad Bhanu Sahasrabha Chaturbahu Samanvita",
        meaning: "Radiant as a thousand rising suns, four-armed.",
      },
      {
        tamil: "ராக ஸ்வரூப பாஶாட்யா க்ரோதகாராங்குஶோஜ்ஜ்வலா",
        english: "Raga Swarupa Pashadhya Krodhakarankushojjvala",
        meaning: "Holding the noose of love and the goad of dispassion.",
      },
      {
        tamil: "மனோரூபேக்ஷு கோதண்ட பஞ்ச தன்மாத்ர ஸாயகா",
        english: "Manorupekshu Kodanda Pancha Tanmatra Sayaka",
        meaning: "Bow of sugarcane (mind) and five sense-element arrows.",
      },
      {
        tamil: "நிஜாருண ப்ரபாபூர மஜ்ஜத் ப்ரஹ்மாண்ட மண்டலா",
        english: "Nijaruna Prabhapura Majjat Brahmanda Mandala",
        meaning: "Whose ruddy radiance bathes the entire cosmos.",
      },
      {
        tamil: "சம்பகாஶோக புன்னாக ஸௌகந்திக லஸத் கசா",
        english: "Champakashoka Punnaga Saugandhika Lasat Kacha",
        meaning: "Whose tresses are fragrant with champaka, ashoka and saugandhika flowers.",
      },
      {
        tamil: "குரு விந்த மணி ஶ்ரேணீ கனத் கோடீர மண்டிதா",
        english: "Kuru Vinda Mani Shreni Kanat Kotira Mandita",
        meaning: "Crowned with diadems of ruby gems.",
      },
    ],
  },
  {
    id: "rama-bhadram-bhajeham",
    title: "Sri Rama Stuti",
    titleTamil: "ஶ்ரீ ராம ஸ்துதி",
    category: "Rama",
    duration: "6 min",
    icon: "RA",
    lines: [
      {
        tamil: "ஶ்ரீ ராகவம் தஶரதாத்மஜம் அப்ரமேயம்",
        english: "Sri Raghavam Dasharathaatmajam Aprameyam",
        meaning: "Sri Rama, son of Dasharatha, immeasurable.",
      },
      {
        tamil: "ஸீதா பதிம் ரகு குலான்வய ரத்ன தீபம்",
        english: "Sita Patim Raghu Kulaanvaya Ratna Deepam",
        meaning: "Beloved of Sita, the jewel-lamp of Raghu's lineage.",
      },
      {
        tamil: "ஆஜானு பாஹும் அரவிந்த தளாயதாக்ஷம்",
        english: "Aajaanu Baahum Aravinda Dalaayataaksham",
        meaning: "Whose arms reach His knees, with eyes like lotus petals.",
      },
      {
        tamil: "ராமம் நிஶாசர விநாஶகரம் நமாமி",
        english: "Raamam Nishaachara Vinaashakaram Namaami",
        meaning: "I bow to Rama, destroyer of the night-wandering demons.",
      },
      {
        tamil: "ராமாய ராமபத்ராய ராமசந்த்ராய வேதஸே",
        english: "Raamaaya Raamabhadraaya Raamachandraaya Vedhase",
        meaning: "To Rama, auspicious Rama, moon-like Rama, the all-knowing.",
      },
      {
        tamil: "ரகுநாதாய நாதாய ஸீதாயா: பதயே நம:",
        english: "Raghunaathaaya Naathaaya Seetaayaah Pataye Namaha",
        meaning: "Salutations to the Lord of the Raghus, the Lord of Sita.",
      },
      {
        tamil: "ஶ்ரீ ராம ராம ராமேதி ரமே ராமே மனோரமே",
        english: "Sri Rama Rama Rameti Rame Raame Manorame",
        meaning: "Chanting Rama, Rama, my mind delights in Rama.",
      },
      {
        tamil: "ஸஹஸ்ர நாம தத் துல்யம் ராம நாம வராநனே",
        english: "Sahasra Naama Tat Tulyam Rama Naama Varaanane",
        meaning: "The name of Rama equals a thousand names of the Lord.",
      },
    ],
  },
  {
    id: "venkateshwara-suprabhatam",
    title: "Venkateshwara Suprabhatam",
    titleTamil: "வேங்கடேஶ்வர ஸுப்ரபாதம்",
    category: "Venkateshwara",
    duration: "10 min",
    icon: "VS",
    lines: [
      {
        tamil: "கௌஸல்யா ஸுப்ரஜா ராம பூர்வா ஸந்த்யா ப்ரவர்ததே",
        english: "Kausalya Suprajaa Raama Poorvaa Sandhyaa Pravartate",
        meaning: "O Rama, son of Kausalya, the eastern dawn approaches.",
      },
      {
        tamil: "உத்திஷ்ட நரஶார்தூல கர்தவ்யம் தைவம் ஆஹ்னிகம்",
        english: "Uttishtha Narashaardoola Kartavyam Daivam Aahnikam",
        meaning: "Arise, O lion among men; perform the sacred morning duties.",
      },
      {
        tamil: "உத்திஷ்டோ த்திஷ்ட கோவிந்த உத்திஷ்ட கருடத்வஜ",
        english: "Uttishtho Tishtha Govinda Uttishtha Garudadhwaja",
        meaning: "Arise, arise Govinda, arise O Lord whose banner is Garuda.",
      },
      {
        tamil: "உத்திஷ்ட கமலா காந்த த்ரைலோக்யம் மங்களம் குரு",
        english: "Uttishtha Kamala Kaanta Trailokyam Mangalam Kuru",
        meaning: "Arise, beloved of Lakshmi, bless the three worlds.",
      },
      {
        tamil: "மாதஸ் ஸமஸ்த ஜகதாம் மதுகைடபாரே:",
        english: "Maatas Samasta Jagataam Madhukaitabhaareh",
        meaning: "O Mother of all worlds, consort of the slayer of Madhu and Kaitabha.",
      },
      {
        tamil: "வக்ஷோ விஹாரிணி மனோஹர திவ்ய மூர்தே",
        english: "Vakshovihaarini Manohara Divya Moorte",
        meaning: "Resident of Vishnu's heart, of enchanting divine form.",
      },
      {
        tamil: "ஶ்ரீ ஸ்வாமின் ஜகத் ஏக நாத",
        english: "Shri Swaamin Jagad Eka Naatha",
        meaning: "O Lord, sole master of the universe.",
      },
      {
        tamil: "ஶ்ரீ வேங்கட நிலயனாத தவ ஸுப்ரபாதம்",
        english: "Shri Venkata Nilayanaatha Tava Suprabhaatam",
        meaning: "May this be an auspicious dawn for You, Lord of Venkata Hill.",
      },
    ],
  },
  {
    id: "narayaniyam-dhyanam",
    title: "Narayaniyam Dhyanam",
    titleTamil: "நாராயணீயம் த்யானம்",
    category: "Guruvayurappan",
    duration: "8 min",
    icon: "NA",
    lines: [
      {
        tamil: "ஸாந்த்ராநந்த அவபோதாத்மகம் அநுபமிதம்",
        english: "Saandraananda Avabodhaatmakam Anupamitam",
        meaning: "The dense bliss of pure consciousness, beyond comparison.",
      },
      {
        tamil: "காலதேஶ அவதிப்யாம் நிர்முக்தம்",
        english: "Kaala Desha Avadhibhyaam Nirmuktam",
        meaning: "Free from the limits of time and space.",
      },
      {
        tamil: "நித்யமுக்தம் நிகமஶத ஸஹஸ்ரேண நிர்பாஸ்யமாநம்",
        english: "Nityamuktam Nigamashata Sahasrena Nirbhaasyamaanam",
        meaning: "Eternally free, illumined by hundreds of thousands of scriptures.",
      },
      {
        tamil: "அஸ்பஷ்டம் த்ருஷ்டம் ஏவ அக்ருதகம் வ்யவஹாரகம்",
        english: "Aspashtam Drishtam Eva Akritakam Vyavahaarakam",
        meaning: "Subtle, yet ever experienced; uncreated, beyond worldly action.",
      },
      {
        tamil: "இத்தம் தத் வத் புனஸ்த பவனபுரபதே கிம் விதத்தே விதாதா",
        english: "Ittham Tat Vat Punasta Pavanapurapate Kim Vidhatte Vidhaata",
        meaning: "Such are You, O Lord of Guruvayur — what more can the seeker say?",
      },
      {
        tamil: "க்ருஷ்ண க்ருஷ்ண முகுந்த ஜனார்தன",
        english: "Krishna Krishna Mukunda Janaardana",
        meaning: "Krishna, Krishna, Mukunda, Janardana.",
      },
      {
        tamil: "க்ருஷ்ண கோவிந்த ராம ஶ்ரீ மதுஸூதன",
        english: "Krishna Govinda Raama Sri Madhusoodana",
        meaning: "Krishna, Govinda, Rama, blessed slayer of Madhu.",
      },
      {
        tamil: "நாராயணாய நம:",
        english: "Naaraayanaaya Namaha",
        meaning: "Salutations to Narayana.",
      },
    ],
  },
  {
    id: "harivarasanam",
    title: "Harivarasanam",
    titleTamil: "ஹரிவராஸனம்",
    category: "Ayyappa",
    duration: "9 min",
    icon: "HA",
    lines: [
      {
        tamil: "ஹரிவராஸனம் விஶ்வமோஹனம்",
        english: "Harivaraasanam Vishwamohanam",
        meaning: "Seated on Vishnu's lap, enchanter of the universe.",
      },
      {
        tamil: "ஹரிததீஶ்வரம் ஆராத்ய பாதுகம்",
        english: "Haridadhishwaram Aaraadhya Paadukam",
        meaning: "Lord of Hari's residence, whose holy feet I adore.",
      },
      {
        tamil: "அரிவிமர்தனம் நித்யநர்த்தனம்",
        english: "Arivimardanam Nityanartanam",
        meaning: "Crusher of enemies, the eternal dancer.",
      },
      {
        tamil: "ஹரிஹராத்மஜம் தேவமாஶ்ரயே",
        english: "Hariharaatmajam Devamaashraye",
        meaning: "I take refuge in Ayyappa, son of Hari and Hara.",
      },
      {
        tamil: "ஶரணம் ஐயப்பா ஸ்வாமி ஶரணம் ஐயப்பா",
        english: "Sharanam Ayyappa Swamy Sharanam Ayyappa",
        meaning: "I take refuge in Lord Ayyappa.",
      },
      {
        tamil: "ஸ்வாமியே ஶரணம் ஐயப்பா",
        english: "Swamiye Sharanam Ayyappa",
        meaning: "Lord, I surrender to You, Ayyappa.",
      },
      {
        tamil: "ப்ராணநதஸ்திதம் ப்ராணஶாயினம்",
        english: "Praananatasthitam Praanashaayinam",
        meaning: "Resting in the very breath of life.",
      },
      {
        tamil: "ஹரிஹராத்மஜம் தேவமாஶ்ரயே",
        english: "Hariharaatmajam Devamaashraye",
        meaning: "I take refuge in Ayyappa, son of Hari and Hara.",
      },
    ],
  },
  {
    id: "maha-mrityunjaya",
    title: "Maha Mrityunjaya Mantra",
    titleTamil: "மஹா ம்ருத்யுஞ்ஜய மந்த்ரம்",
    category: "Shiva",
    duration: "5 min",
    icon: "MM",
    lines: [
      {
        tamil: "ஓம் த்ர்யம்பகம் யஜாமஹே",
        english: "Om Tryambakam Yajaamahe",
        meaning: "We worship the three-eyed Lord.",
      },
      {
        tamil: "ஸுகந்திம் புஷ்டி வர்தனம்",
        english: "Sugandhim Pushtivardhanam",
        meaning: "Fragrant, who increases nourishment.",
      },
      {
        tamil: "உர்வாருகம் இவ பந்தநாத்",
        english: "Urvaarukam Iva Bandhanaan",
        meaning: "Like a ripe cucumber from its stalk.",
      },
      {
        tamil: "ம்ருத்யோர் முக்ஷீய மாம்ருதாத்",
        english: "Mrityor Muksheeya Maamritaat",
        meaning: "May we be liberated from death, not from immortality.",
      },
      {
        tamil: "ஓம் நம: ஶிவாய",
        english: "Om Namah Shivaaya",
        meaning: "Salutations to Shiva.",
      },
      {
        tamil: "ஓம் த்ர்யம்பகம் யஜாமஹே",
        english: "Om Tryambakam Yajaamahe",
        meaning: "We worship the three-eyed Lord.",
      },
      {
        tamil: "ஸுகந்திம் புஷ்டி வர்தனம்",
        english: "Sugandhim Pushtivardhanam",
        meaning: "Fragrant, who increases nourishment.",
      },
      {
        tamil: "ம்ருத்யோர் முக்ஷீய மாம்ருதாத்",
        english: "Mrityor Muksheeya Maamritaat",
        meaning: "May we be liberated from death, not from immortality.",
      },
    ],
  },
  {
    id: "shiva-tandava-stotram",
    title: "Shiva Tandava Stotram",
    titleTamil: "ஶிவ தாண்டவ ஸ்தோத்ரம்",
    category: "Shiva",
    duration: "10 min",
    icon: "ST",
    lines: [
      {
        tamil: "ஜடா தவீ களஜ்ஜல ப்ரவாஹ பாவித ஸ்தலே",
        english: "Jataavi Galajjala Pravaha Pavita Sthale",
        meaning: "Where the cascading Ganga purifies the forest of matted locks.",
      },
      {
        tamil: "கலே அவலம்ப்ய லம்பிதாம் புஜங்க துங்க மாலிகாம்",
        english: "Gale Avalambya Lambitaam Bhujanga Tunga Malikaam",
        meaning: "Wearing a long garland of great serpents around His neck.",
      },
      {
        tamil: "டமட்டமட்டமட்டமன்னிநாத வட்டமர்வயம்",
        english: "Damadd Damadd Damadd Dadannina Vadda Marvayam",
        meaning: "To the beat of the damaru — dam dam dam dam.",
      },
      {
        tamil: "சகார சண்ட தாண்டவம் தனோது ந: ஶிவ: ஶிவம்",
        english: "Chakara Chanda Tandavam Tanotu Nah Shivah Shivam",
        meaning: "Lord Shiva performed His fierce Tandava dance — may He grant us auspiciousness.",
      },
      {
        tamil: "ஜடா கடா ஹஸம்ப ப்ரமத் புஜங்க மஸ்வன",
        english: "Jata Kata Hasambha Pramat Bhujanga Masvana",
        meaning: "From His matted hair resound the movements of serpents.",
      },
      {
        tamil: "நிஷேவிதே நிதாந்தஶே நடீஶ நட்டனாயக:",
        english: "Nishevite Nitantashe Nateesha Nattanayakah",
        meaning: "Lord of all dancers, ceaselessly adored.",
      },
      {
        tamil: "ஸ்புரத்தகீல தேஷ்வி தேஜஸி ப்ரவ்ருத்த நர்தனம்",
        english: "Spurad Dagila Teshvite Jaasi Pravruddha Nartanam",
        meaning: "His dance blazes with intense, brilliant fire.",
      },
      {
        tamil: "ஜனஸ்து ஹர்ஷமேதுலேன ஹர்ஷயம் நம: ஶிவாய",
        english: "Janastu Harsha Metulena Harshayam Namah Shivaya",
        meaning: "The people rejoice — salutations to Shiva.",
      },
    ],
  },
  {
    id: "shiva-moola-mantra",
    title: "Shiva Moola Mantra",
    titleTamil: "ஶிவ மூல மந்த்ரம்",
    category: "Shiva",
    duration: "4 min",
    icon: "SM",
    lines: [
      {
        tamil: "ஓம் நம: ஶிவாய",
        english: "Om Namah Shivaya",
        meaning: "I bow to Shiva, the auspicious one.",
      },
      {
        tamil: "ஓம் நம: ஶிவாய ஓம் நம: ஶிவாய",
        english: "Om Namah Shivaya Om Namah Shivaya",
        meaning: "Repeated salutations to Shiva.",
      },
      {
        tamil: "நமஶ்சந்த்ராய ஶேகாராய நமஶ்சண்ட இஶாய ச",
        english: "Namash Chandraya Shekharaya Namash Chanda Ishaya Cha",
        meaning: "Salutations to the one with the crescent moon, the fierce Lord.",
      },
      {
        tamil: "நமஸ்ஶர்வாய தேவாய நம: ஶிவாய தே நம:",
        english: "Namas Sharvaya Devaya Namah Shivaya Te Namah",
        meaning: "Salutations to Sharva, the Divine — bow to Shiva.",
      },
      {
        tamil: "ஓம் நம: ஶிவாய ஓம் நம: ஶிவாய",
        english: "Om Namah Shivaya Om Namah Shivaya",
        meaning: "Salutations to Shiva, again and again.",
      },
      {
        tamil: "ஶிவ ஶிவ ஶிவ ஶிவ ஶிவ ஶிவ ஜெய ஶிவ",
        english: "Shiva Shiva Shiva Shiva Shiva Shiva Jaya Shiva",
        meaning: "Shiva, Shiva — victory to Shiva.",
      },
      {
        tamil: "ஶம்போ மஹாதேவ ஶம்போ ஶம்போ",
        english: "Shambho Mahadeva Shambho Shambho",
        meaning: "O Shambhu, great God — Shambhu, Shambhu.",
      },
      {
        tamil: "ஓம் நம: ஶிவாய",
        english: "Om Namah Shivaya",
        meaning: "I bow to Shiva, the auspicious one.",
      },
    ],
  },
  {
    id: "shiva-ashtakam",
    title: "Shiva Ashtakam",
    titleTamil: "ஶிவ அஷ்டகம்",
    category: "Shiva",
    duration: "8 min",
    icon: "SA",
    lines: [
      {
        tamil: "ப்ரபும் ப்ராண நாதம் விபும் விஶ்வநாதம்",
        english: "Prabhum Prana Natham Vibhum Vishwanatham",
        meaning: "The supreme Lord, master of life, all-pervading world-lord.",
      },
      {
        tamil: "ஜகன்னாத நாதம் ஸதாநந்த பூதம்",
        english: "Jagannatha Natham Sadananda Bhutam",
        meaning: "Lord of the universe, ever blissful being.",
      },
      {
        tamil: "புவன் பூதி நாதம் சிவம் ஶங்கராத்யம்",
        english: "Bhuvan Bhuti Natham Shivam Shankaradyam",
        meaning: "Lord of all worlds, Shiva, primal Shankara.",
      },
      {
        tamil: "ஶரண்யம் கீயாமி ஶிவம் ஶங்கரம்",
        english: "Sharanyam Gayami Shivam Shankaram",
        meaning: "I take refuge in Shiva, the auspicious Shankara.",
      },
      {
        tamil: "மதீயம் வதந்தி ஶிவம் ஶங்கரம்",
        english: "Madeeyam Vadanti Shivam Shankaram",
        meaning: "What my heart speaks — Shiva, Shankara.",
      },
      {
        tamil: "ஶிவம் ஶங்கரம் ஶம்பு மீஶானம் ஈட்யம்",
        english: "Shivam Shankaram Shambhu Meeshanam Eedyam",
        meaning: "Shiva, Shankara, Shambhu — the worthy Ishana.",
      },
      {
        tamil: "ஶிவேத்யேகமக்ஷரம் தயான் ஶிவோஹம்",
        english: "Shivetyeka Maksharam Dhayan Shivoham",
        meaning: "Meditating on the single syllable Shiva — I am Shiva.",
      },
      {
        tamil: "ஶரண்யம் ஶரணம் நித்யம் நமாமி ஶிவம்",
        english: "Sharanyam Sharanam Nityam Namami Shivam",
        meaning: "Taking eternal refuge — I ever bow to Shiva.",
      },
    ],
  },
  {
    id: "vishnu-sahasranama-excerpt",
    title: "Vishnu Sahasranama",
    titleTamil: "விஷ்ணு ஸஹஸ்ரநாமம்",
    category: "Vishnu",
    duration: "14 min",
    icon: "VN",
    lines: [
      {
        tamil: "ஶுக்லாம்பர தரம் விஷ்ணும் ஶஶி வர்ணம் சதுர்புஜம்",
        english: "Shuklambara Dharam Vishnum Shashi Varnam Chaturbhujam",
        meaning: "Vishnu, robed in white, moon-hued and four-armed.",
      },
      {
        tamil: "ப்ரஸன்ன வதநம் த்யாயேத் ஸர்வ விக்நோப ஶாந்தயே",
        english: "Prasanna Vadanam Dhyayet Sarva Vighnopa Shantaye",
        meaning: "I meditate on the serene-faced Lord to remove all obstacles.",
      },
      {
        tamil: "விஶ்வம் விஷ்ணுர்வஷட்காரோ பூத புவன பவ்ய பவத்",
        english: "Vishvam Vishnur Vashatkaaro Bhoota Bhuvana Bhavya Bhavat",
        meaning: "He is the universe, Vishnu, the sacrificial call, past present and future.",
      },
      {
        tamil: "பூதக்ருத் பூதப்ருத் பாவோ பூதாத்மா பூத பாவன:",
        english: "Bhutakrit Bhutabhrit Bhavo Bhootatma Bhoota Bhavanah",
        meaning: "Creator, sustainer, the very being, soul, and nourisher of all creatures.",
      },
      {
        tamil: "பூதாத்மா பரமாத்மா ச முக்தானாம் பரமா கதி:",
        english: "Bhootatma Paramatma Cha Muktanam Parama Gatih",
        meaning: "The soul, the Supreme Self, the highest goal of the liberated.",
      },
      {
        tamil: "அவ்யயம் புருஷம் ஸாக்ஷி க்ஷேத்ரஜ்ஞம் அக்ஷரம் பரம்",
        english: "Avyayam Purusham Sakshi Kshetragnam Aksharam Param",
        meaning: "Imperishable Purusha, witness, knower of the field, supreme Akshara.",
      },
      {
        tamil: "யோகம் யோகவிதாம் நேதா ப்ரதாந புருஷேஶ்வர:",
        english: "Yogam Yogavidam Neta Pradhana Purusheshvarah",
        meaning: "Master of yoga among its knowers, Lord of primordial nature and souls.",
      },
      {
        tamil: "நாராயண: பரம் ப்ரஹ்ம தத்வம் நாராயண: பர:",
        english: "Narayanah Param Brahma Tatvam Narayanah Parah",
        meaning: "Narayana is the supreme Brahman, the supreme truth is Narayana.",
      },
    ],
  },
  {
    id: "vinayagar-agaval",
    title: "Vinayagar Agaval",
    titleTamil: "விநாயகர் அகவல்",
    category: "Ganesh",
    duration: "10 min",
    icon: "VA",
    lines: [
      {
        tamil: "ஐந்து கரத்தனை யானை முகத்தனை",
        english: "Aindhu Karaththanai Yaanai Mukaththanai",
        meaning: "The one with five hands and the face of an elephant.",
      },
      {
        tamil: "இந்தின் இளம்பிறை போல் எயிறுடையானை",
        english: "Indhin Ilampirai Pol Eyirudaiyaanai",
        meaning: "Whose tusk shines like the young crescent moon.",
      },
      {
        tamil: "நந்தி யிடத்தினில் நவில்தரு கோட்டினை",
        english: "Nanthi Idaththinil Navilidaru Kottinai",
        meaning: "Whom Nandi praises at His side.",
      },
      {
        tamil: "இந்திரன் முதலா ஏத்தும் பாதத்தை",
        english: "Indhiran Mudhalaa Eththum Paathaththai",
        meaning: "Whose feet Indra and all devas worship.",
      },
      {
        tamil: "ஐவர்க்கு அணங்கனை அன்பர் சித்தத்தை",
        english: "Aivarkku Ananganai Anbar Siththaththai",
        meaning: "Who enchants the five senses and lives in devotees' hearts.",
      },
      {
        tamil: "கொம்பனை யானையின் கோட்டினை யார்க்கும்",
        english: "Kombanai Yaanaiyin Kottinai Yaarkum",
        meaning: "The graceful Lord with the elephant tusk for all.",
      },
      {
        tamil: "எம்பொருள் தீர்க்க இணையடி வாழ்த்தி",
        english: "Emporudal Theerkka Inaiadi Vaazhththi",
        meaning: "Praising His twin feet to resolve all our purposes.",
      },
      {
        tamil: "உம்பர் கோன் தன்னை ஒப்பிலா மணியை",
        english: "Umbar Kon Thannai Oppilaa Maniyai",
        meaning: "Lord of the celestials, the peerless gem.",
      },
    ],
  },
  {
    id: "karya-sidhi-malai",
    title: "Karya Sidhi Malai",
    titleTamil: "கார்ய ஸித்தி மாலை",
    category: "Ganesh",
    duration: "6 min",
    icon: "KM",
    lines: [
      {
        tamil: "கார்ய ஸித்தி தந்திடும் கணபதி போற்றி",
        english: "Karya Sidhi Thantidum Ganapati Potri",
        meaning: "Salutations to Ganapati who grants success in all undertakings.",
      },
      {
        tamil: "ஆதி முதல்வனே அருள் புரிவோனே",
        english: "Aadhi Mudhalvane Arul Purivone",
        meaning: "Primal Lord who showers grace.",
      },
      {
        tamil: "ஒற்றைக் கொம்பனே உலகம் காப்பவனே",
        english: "Ottrai Kombane Ulagam Kaapavane",
        meaning: "Single-tusked Lord who protects the world.",
      },
      {
        tamil: "எத்திசையும் கோலோச்சும் விநாயகனே",
        english: "Eththisaiyum Kolochum Vinaayagane",
        meaning: "Vinayaka who rules in all directions.",
      },
      {
        tamil: "மும்மலம் தவிர்க்கும் முதுமொழி மேலோனே",
        english: "Mummalum Thavirkum Muthumozhi Melone",
        meaning: "Supreme one who removes the three impurities through the ancient wisdom.",
      },
      {
        tamil: "பரிமள பூ மாலை பணிந்தோர்க்கு அருளே",
        english: "Parimala Poo Maalai Panindhorku Arule",
        meaning: "Grant your grace to those who offer fragrant garlands.",
      },
      {
        tamil: "தும்பிக்கை யானை முகப்பெரும் தெய்வமே",
        english: "Thumbikkai Yaanai Mugaperung Deivame",
        meaning: "Great deity with the elephant trunk.",
      },
      {
        tamil: "கார்ய ஸித்தி தந்திடும் கணபதியே",
        english: "Karya Sidhi Thantidum Ganapatiye",
        meaning: "O Ganapati, grant success in all our endeavors.",
      },
    ],
  },
  {
    id: "vel-maral",
    title: "Vel Maral",
    titleTamil: "வேல் மறல்",
    category: "Muruga",
    duration: "5 min",
    icon: "VM",
    lines: [
      {
        tamil: "வேல் வேல் வேல் வேல் வேல் வேல் வேல் வேல்",
        english: "Vel Vel Vel Vel Vel Vel Vel Vel",
        meaning: "The vel (spear) of Muruga — victory, victory!",
      },
      {
        tamil: "வேலவனே போற்றி முருகவனே போற்றி",
        english: "Velavanae Potri Murugavanae Potri",
        meaning: "Praise to the one with the vel, praise to Muruga.",
      },
      {
        tamil: "கந்தா போற்றி குமரா போற்றி",
        english: "Kantha Potri Kumara Potri",
        meaning: "Praise to Kanda, praise to Kumara.",
      },
      {
        tamil: "ஆறுமுகா போற்றி சரவணா போற்றி",
        english: "Aarumukhaa Potri Saravanaa Potri",
        meaning: "Praise to the six-faced Lord, praise to Saravana.",
      },
      {
        tamil: "நெஞ்சை அலைக்கும் நினைவை அகற்றும்",
        english: "Nenjhai Alaikkum Ninaivahai Agatrum",
        meaning: "He calms the restless heart and removes wavering thoughts.",
      },
      {
        tamil: "வேல் கொண்டு வந்து விலக்கும் குமரனே",
        english: "Vel Kondu Vandhu Vilakkum Kumaranae",
        meaning: "Kumara who comes with the vel and drives away all darkness.",
      },
      {
        tamil: "முருகா முருகா முருகா முருகா",
        english: "Muruga Muruga Muruga Muruga",
        meaning: "Muruga, Muruga — the divine name chanted repeatedly.",
      },
      {
        tamil: "வேல் வேல் வேல் வேல் வேல் வேல் வேல் வேல்",
        english: "Vel Vel Vel Vel Vel Vel Vel Vel",
        meaning: "The vel of Muruga — victory, victory!",
      },
    ],
  },
  {
    id: "kandar-anoobothi",
    title: "Kandar Anubhuti",
    titleTamil: "கந்தர் அநுபூதி",
    category: "Muruga",
    duration: "9 min",
    icon: "KA",
    lines: [
      {
        tamil: "அமரர் பகை தீர்த்து அமுதம் அளித்தாய்",
        english: "Amarar Pagai Theerthu Amudham Aliththaai",
        meaning: "You freed the celestials from their enemy and bestowed nectar.",
      },
      {
        tamil: "குமர குருபர கோவே குகனே",
        english: "Kumara Gurupara Kove Guhanae",
        meaning: "O Kumara, supreme Guru, King, the hidden one.",
      },
      {
        tamil: "அனுபவம் இல்லா அடியேன் தனக்கு",
        english: "Anubhavam Illaa Adiyaen Thanakku",
        meaning: "To this servant who has no spiritual experience.",
      },
      {
        tamil: "தனிமை தவிர்த்து தாள் தர வேண்டும்",
        english: "Thanimai Thavirththu Thaal Thara Vaendum",
        meaning: "Please remove my loneliness and grant me Your feet.",
      },
      {
        tamil: "ஒளி மணி வேலா உயர் கதிர் வேலா",
        english: "Oli Mani Velaa Uyar Kathir Velaa",
        meaning: "O Lord of the radiant gem-vel, the high-shining vel.",
      },
      {
        tamil: "மலர் பொழில் வேலூர் வளர் கதிர் வேலா",
        english: "Malar Pozhil Velur Valar Kathir Velaa",
        meaning: "O Lord of the flowering Vellore, the ever-growing vel.",
      },
      {
        tamil: "கந்தா கதிர்வேல் கரும்புக் கழுத்தா",
        english: "Kantha Kathirvel Karumbu Kazhuththaa",
        meaning: "O Kanda of the radiant vel, whose neck is like sugarcane.",
      },
      {
        tamil: "நந்தா நலமுற நாளும் அருள்வாய்",
        english: "Nanthaa Nalamutra Naalum Arulyaai",
        meaning: "O eternal one, bless me with goodness every day.",
      },
    ],
  },
  {
    id: "kandar-alangaram",
    title: "Kandar Alangaram",
    titleTamil: "கந்தர் அலங்காரம்",
    category: "Muruga",
    duration: "8 min",
    icon: "KL",
    lines: [
      {
        tamil: "திருவுற்ற செந்தில் திகழ்ஒற்றி யூரர்",
        english: "Thiruvutra Senthil Thigazhottri Yuurar",
        meaning: "The auspicious Lord of Thiruchendur, the radiant Lord of Otriyur.",
      },
      {
        tamil: "மருவுற்ற சோலை வயலூரர் வள்ளி",
        english: "Maruvutra Cholai Vayaluurar Valli",
        meaning: "Lord of the grove-full Vayalur, beloved of Valli.",
      },
      {
        tamil: "உருவுற்ற தேவர் உயர்முது குன்றர்",
        english: "Uruvutra Devar Uyar Mudhu Kundrar",
        meaning: "The manifested deity of the ancient sacred hills.",
      },
      {
        tamil: "தருவுற்ற வேங்கை தடவரை யோனே",
        english: "Tharuvutra Vengai Thatavaraiyone",
        meaning: "Born from the mountain-side where the vengai tree grows.",
      },
      {
        tamil: "பொருவற்ற செம்மல் புனிதன் திருமால்",
        english: "Poruvatra Semmal Punidhan Thirumal",
        meaning: "Matchless noble one, the holy one, son of Thirumal.",
      },
      {
        tamil: "ஒருவற்ற காரோடு உலவும் சினத்தோன்",
        english: "Oruvatra Karodu Ulavum Sinaththon",
        meaning: "The wrathful one who wanders with dark clouds.",
      },
      {
        tamil: "அரிமுக்கட் செம்மல் அமரர் பெருமால்",
        english: "Arimukkat Semmal Amarar Perumaal",
        meaning: "Noble one with the lion countenance, great Lord of the celestials.",
      },
      {
        tamil: "திருமுக்கண் அப்பன் திருந்தடி போற்றி",
        english: "Thirumukkan Appan Thirundadi Potri",
        meaning: "Praise to the holy feet of the three-eyed Father.",
      },
    ],
  },
  {
    id: "thirumurugatrupadai-excerpt",
    title: "Thirumurugatrupadai",
    titleTamil: "திருமுருகாற்றுப்படை",
    category: "Muruga",
    duration: "12 min",
    icon: "TP",
    lines: [
      {
        tamil: "உலகம் உவப்ப வலன் ஏர்பு திரிதரு",
        english: "Ulagam Uvappa Valan Erpu Thiridaru",
        meaning: "As the world rejoices, He moves rightward across it.",
      },
      {
        tamil: "பலர் புகழ் ஞாயிறு கடல் கடல் ஓடி",
        english: "Palar Pukozh Nyaairu Kadal Kadal Odi",
        meaning: "The sun praised by many races across the oceans.",
      },
      {
        tamil: "இமிழ் இசை முழவத்தொடு இன்துணை புணர்ந்த",
        english: "Imizh Isai Muzhavathu Inthunai Punarntha",
        meaning: "Joined with the sweet companion to the sound of the drum.",
      },
      {
        tamil: "குறிஞ்சிக் கிழவன் நறும் பல் கேண்மை",
        english: "Kurinjik Kizhavan Narum Pal Kenmai",
        meaning: "The lord of the mountain land, richly fragrant and beautiful.",
      },
      {
        tamil: "மால் வரை அண்ணல் மயிலேறி வருவோன்",
        english: "Maal Varai Annal Mayileri Varuvon",
        meaning: "The great Lord of mountains, who comes riding the peacock.",
      },
      {
        tamil: "வேல் கொண்டு வேட்கை யுற்றோர்க்கு அருளும்",
        english: "Vel Kondu Vetkkai Yutrorku Arulum",
        meaning: "The vel-bearing one who showers grace on those who yearn.",
      },
      {
        tamil: "ஆற்ற லாண்மை உண்மையோடு உணர்ந்தோர்",
        english: "Aatra Laanmai Unmaiyodu Unarnthoor",
        meaning: "Those who have truly understood His grace and power.",
      },
      {
        tamil: "முருகன் அடி போற்றி முருகன் வாழ்க",
        english: "Murugan Adi Potri Murugan Vaazhka",
        meaning: "Praise to Murugan's feet — long live Murugan.",
      },
    ],
  },
  {
    id: "thirupugazh-arumugam",
    title: "Thirupugazh",
    titleTamil: "திருப்புகழ்",
    category: "Muruga",
    duration: "8 min",
    icon: "TG",
    lines: [
      {
        tamil: "முத்தைத் தரு பத்தித் திருநகை",
        english: "Muththaith Tharu Paththith Thirunahai",
        meaning: "O Lord who grants the pearl-like sacred smile.",
      },
      {
        tamil: "அத்தத் திரு மைத்துன் வினை தனை",
        english: "Aththath Thiru Maithun Vinai Thanai",
        meaning: "Destroy the karmic bondage that clings to this devotee.",
      },
      {
        tamil: "முத்தித் திரு நிர்த்தர் பிரிவுறும்",
        english: "Muththith Thiru Nirththar Pirivurum",
        meaning: "Grant the liberation that the great saints have attained.",
      },
      {
        tamil: "வித்துக் குரு பத்மப் பதமலர்",
        english: "Viththuk Kuru Pathmap Pathamalr",
        meaning: "I bow at the lotus feet of the seed-Guru.",
      },
      {
        tamil: "சக்தி கிரி பொர்ப்பத் தழல் வழி",
        english: "Sakthi Giri Porrpath Thazhay Vazhi",
        meaning: "The path of Shakti, mountain, and divine fire.",
      },
      {
        tamil: "முருகா அருளாலே பிழைப்பேன்",
        english: "Murugaa Arulaale Pizhaippaen",
        meaning: "Muruga, I survive only by Your grace.",
      },
      {
        tamil: "சரவண பவனே ஓம் சரவண பவனே",
        english: "Saravana Bhavane Om Saravana Bhavane",
        meaning: "Om Saravana Bhava — the mantra of Muruga's birth.",
      },
      {
        tamil: "திருப்புகழ் ஓதும் அடியார் தமக்கு அருள்வாய்",
        english: "Thirupugazh Odhum Adiyaar Thamakku Arulyaai",
        meaning: "Shower grace on the devotees who recite Thirupugazh.",
      },
    ],
  },
  {
    id: "shiva-chalisa",
    title: "Shiva Chalisa",
    titleTamil: "ஶிவ சாலீஸா",
    category: "Shiva",
    duration: "12 min",
    icon: "SC",
    lines: [
      {
        tamil: "ஜெய் கணேஶ கிரிஜா ஸுவன, மங்கல மூல ஸுஜான",
        english: "Jai Ganesh Girija Suvan, Mangal Mool Sujaan",
        meaning: "Victory to Ganesha, son of Girija, the auspicious and wise.",
      },
      {
        tamil: "கஹத் அயோத்யா தாஸ தும், தேவோ அபி ஶ்ரீ மான்",
        english: "Kahat Ayodhya Das Tum, Devo Abhi Shri Maan",
        meaning: "Ayodhya Das says — You are the glorious Lord of the devas.",
      },
      {
        tamil: "ஜெய் கிரிஜா பதி தீன தயாலா, ஸதா கரத் ஸந்தன் ப்ரதிபாலா",
        english: "Jai Girija Pati Deen Dayala, Sada Karat Santan Pratipala",
        meaning: "Victory to Shiva, husband of Girija, compassionate to the humble, eternal protector of the good.",
      },
      {
        tamil: "பால சந்த்ர ஶம்பு ஶுல பானீ, ஜக் வந்தித ஜக தீப பவானீ",
        english: "Bhal Chandra Shambhu Shool Pani, Jag Vandit Jag Deep Bhawani",
        meaning: "Moon-crested Shambhu, trident-bearer, worshipped by all, the light of the world with Bhavani.",
      },
      {
        tamil: "அன்னபூர்ணா ஸமேத ஶங்கர், நிவ ஸந்தோ நித்ய மங்கலகர",
        english: "Annapurna Sameta Shankar, Nij Santho Nitya Mangalakar",
        meaning: "Shankara with Annapurna, ever blissful, eternally auspicious.",
      },
      {
        tamil: "கர்பூர கஔர கமனீய ஶரீர, ஶிவ கங்காதர முனிமன ஹீர",
        english: "Karpoor Gaur Kamaniya Shareer, Shiv Gangadhar Muniman Heer",
        meaning: "Camphor-white, beautiful-bodied Shiva, Gangadhara, jewel of the sages' hearts.",
      },
      {
        tamil: "த்ரிபுவன ரோக் திமிர கே ஸூர்ய, ஸர்வ ஸித்தி ஸர்வ ஸு ப ஸ்தூர்ய",
        english: "Tribhuvan Roga Timir Ke Surya, Sarva Siddhi Sarva Shubha Sturya",
        meaning: "Sun that dispels the darkness of illness in the three worlds, source of all attainments and good fortune.",
      },
      {
        tamil: "ஜெய் ஶம்பு ஜெய் ஜகத் ப்ரகாஶ, ஶோக நாஶ, ஸுக விலாஸ",
        english: "Jai Shambhu Jai Jagat Prakash, Shokh Naash, Sukh Vilasa",
        meaning: "Victory to Shambhu, light of the universe — destroyer of sorrow, realm of joy.",
      },
    ],
  },
];

export function getSlokaSummaries(): SlokaSummary[] {
  return SLOKAS.map((sloka) => ({
    id: sloka.id,
    title: sloka.title,
    titleTamil: sloka.titleTamil,
    category: sloka.category,
    duration: sloka.duration,
    icon: sloka.icon,
    lineCount: sloka.lines.length,
  }));
}

export function getSlokaById(id: string): Sloka | null {
  return SLOKAS.find((sloka) => sloka.id === id) ?? null;
}
