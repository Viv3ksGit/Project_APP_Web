import type { Sloka, SlokaSummary } from "./types";

const SLOKAS: Sloka[] = [
  {
    id: "lingashtakam",
    title: "Lingashtakam",
    titleTamil: "Lingashtakam (long form)",
    category: "Shiva",
    duration: "12 min",
    icon: "LI",
    lines: [
      {
        tamil: "Brahma Murari Surarchita Lingam",
        english: "Brahma Murari Surarchita Lingam",
        meaning: "The Lingam worshipped by Brahma, Vishnu, and the devas.",
      },
      {
        tamil: "Nirmala Bhashita Shobhita Lingam",
        english: "Nirmala Bhashita Shobhita Lingam",
        meaning: "The pure and radiant Lingam.",
      },
      {
        tamil: "Janmaja Dukha Vinashaka Lingam",
        english: "Janmaja Dukha Vinashaka Lingam",
        meaning: "The Lingam that removes sorrow born of worldly life.",
      },
      {
        tamil: "Tat Pranamami Sadashiva Lingam",
        english: "Tat Pranamami Sadashiva Lingam",
        meaning: "I bow to that Sadashiva Lingam.",
      },
      {
        tamil: "Deva Muni Pravaraarchita Lingam",
        english: "Deva Muni Pravaraarchita Lingam",
        meaning: "Worshipped by exalted sages and celestial beings.",
      },
      {
        tamil: "Kama Dahana Karunakara Lingam",
        english: "Kama Dahana Karunakara Lingam",
        meaning: "Compassionate Lingam, destroyer of desire-born bondage.",
      },
      {
        tamil: "Ravana Darpa Vinashaka Lingam",
        english: "Ravana Darpa Vinashaka Lingam",
        meaning: "The Lingam that destroys arrogance and ego.",
      },
      {
        tamil: "Tat Pranamami Sadashiva Lingam",
        english: "Tat Pranamami Sadashiva Lingam",
        meaning: "I bow to that Sadashiva Lingam.",
      },
      {
        tamil: "Sarva Sugandhi Sulepita Lingam",
        english: "Sarva Sugandhi Sulepita Lingam",
        meaning: "Anointed with all sacred fragrances.",
      },
      {
        tamil: "Buddhi Vivardhana Kaarana Lingam",
        english: "Buddhi Vivardhana Kaarana Lingam",
        meaning: "The Lingam that expands inner wisdom.",
      },
      {
        tamil: "Siddha Suraasura Vandita Lingam",
        english: "Siddha Suraasura Vandita Lingam",
        meaning: "Revered by siddhas, devas, and all beings.",
      },
      {
        tamil: "Tat Pranamami Sadashiva Lingam",
        english: "Tat Pranamami Sadashiva Lingam",
        meaning: "I bow to that Sadashiva Lingam.",
      },
      {
        tamil: "Kanaka Maha Mani Bhushita Lingam",
        english: "Kanaka Maha Mani Bhushita Lingam",
        meaning: "Adorned with gold and precious gems.",
      },
      {
        tamil: "Phanipati Veshtita Shobhita Lingam",
        english: "Phanipati Veshtita Shobhita Lingam",
        meaning: "Encircled by the serpent, shining brilliantly.",
      },
      {
        tamil: "Daksha Suyajna Vinashaka Lingam",
        english: "Daksha Suyajna Vinashaka Lingam",
        meaning: "Destroyer of egoistic sacrifice and pride.",
      },
      {
        tamil: "Tat Pranamami Sadashiva Lingam",
        english: "Tat Pranamami Sadashiva Lingam",
        meaning: "I bow to that Sadashiva Lingam.",
      },
    ],
  },
  {
    id: "shiva-panchakshara-stotram",
    title: "Shiva Panchakshara Stotram",
    titleTamil: "Shiva Panchakshara Stotram",
    category: "Shiva",
    duration: "9 min",
    icon: "OM",
    lines: [
      {
        tamil: "Nagendra Haraya Trilochanaya",
        english: "Nagendra Haraya Trilochanaya",
        meaning: "Salutations to the three-eyed Lord adorned with serpents.",
      },
      {
        tamil: "Bhasmanga Ragaya Maheshvaraya",
        english: "Bhasmanga Ragaya Maheshvaraya",
        meaning: "To Maheshvara whose body is adorned with sacred ash.",
      },
      {
        tamil: "Nityaya Shuddhaya Digambaraya",
        english: "Nityaya Shuddhaya Digambaraya",
        meaning: "The eternal, pure, sky-clad one.",
      },
      {
        tamil: "Tasmai Nakaaraya Namah Shivaya",
        english: "Tasmai Nakaaraya Namah Shivaya",
        meaning: "Salutations to Shiva through the syllable Na.",
      },
      {
        tamil: "Mandakini Salila Chandana Charchitaya",
        english: "Mandakini Salila Chandana Charchitaya",
        meaning: "Anointed with Ganga water and sandal paste.",
      },
      {
        tamil: "Nandeeshvara Pramathanatha Maheshvaraya",
        english: "Nandeeshvara Pramathanatha Maheshvaraya",
        meaning: "Lord of Nandi and all attendants.",
      },
      {
        tamil: "Mandara Pushpa Bahu Pushpa Supoojitaya",
        english: "Mandara Pushpa Bahu Pushpa Supoojitaya",
        meaning: "Worshipped with celestial flowers.",
      },
      {
        tamil: "Tasmai Makaaraya Namah Shivaya",
        english: "Tasmai Makaaraya Namah Shivaya",
        meaning: "Salutations to Shiva through the syllable Ma.",
      },
      {
        tamil: "Shivaya Gauri Vadanabja Vrinda",
        english: "Shivaya Gauri Vadanabja Vrinda",
        meaning: "Beloved of Gauri, lotus-faced and auspicious.",
      },
      {
        tamil: "Suryaya Dakshaadhvara Naashakaya",
        english: "Suryaya Dakshaadhvara Naashakaya",
        meaning: "Destroyer of arrogance and false sacrifice.",
      },
      {
        tamil: "Sri Neelakanthaya Vrishadhvajaya",
        english: "Sri Neelakanthaya Vrishadhvajaya",
        meaning: "Blue-throated Lord whose emblem is the bull.",
      },
      {
        tamil: "Tasmai Shikaaraya Namah Shivaya",
        english: "Tasmai Shikaaraya Namah Shivaya",
        meaning: "Salutations to Shiva through the syllable Shi.",
      },
    ],
  },
  {
    id: "shantakaram-bhujagashayanam",
    title: "Shantakaram Bhujagashayanam",
    titleTamil: "Shantakaram Bhujagashayanam",
    category: "Vishnu",
    duration: "6 min",
    icon: "VI",
    lines: [
      {
        tamil: "Shantakaram Bhujagashayanam",
        english: "Shantakaram Bhujagashayanam",
        meaning: "The serene one reclining on the cosmic serpent.",
      },
      {
        tamil: "Padmanabham Suresham",
        english: "Padmanabham Suresham",
        meaning: "Lotus-naveled Lord of the devas.",
      },
      {
        tamil: "Vishvadharam Gaganasadrisham",
        english: "Vishvadharam Gaganasadrisham",
        meaning: "Support of the universe, vast as the sky.",
      },
      {
        tamil: "Meghavarnam Shubhangam",
        english: "Meghavarnam Shubhangam",
        meaning: "Cloud-hued and auspicious in form.",
      },
      {
        tamil: "Lakshmikantam Kamalanayanam",
        english: "Lakshmikantam Kamalanayanam",
        meaning: "Beloved of Lakshmi, lotus-eyed.",
      },
      {
        tamil: "Yogibhirdhyanagamyam",
        english: "Yogibhirdhyanagamyam",
        meaning: "Attained by yogis through meditation.",
      },
      {
        tamil: "Vande Vishnum Bhava Bhayaharam",
        english: "Vande Vishnum Bhava Bhayaharam",
        meaning: "I bow to Vishnu who removes worldly fear.",
      },
      {
        tamil: "Sarva Lokaika Naatham",
        english: "Sarva Lokaika Naatham",
        meaning: "The one Lord of all worlds.",
      },
    ],
  },
  {
    id: "ya-devi-sarva-bhuteshu",
    title: "Ya Devi Sarva Bhuteshu",
    titleTamil: "Ya Devi Sarva Bhuteshu",
    category: "Durga",
    duration: "8 min",
    icon: "DU",
    lines: [
      {
        tamil: "Ya Devi Sarva Bhuteshu Vishnumayeti Shabdita",
        english: "Ya Devi Sarva Bhuteshu Vishnumayeti Shabdita",
        meaning: "The Devi present in all beings as cosmic consciousness.",
      },
      {
        tamil: "Namastasyai Namastasyai Namastasyai Namo Namah",
        english: "Namastasyai Namastasyai Namastasyai Namo Namah",
        meaning: "Repeated salutations to Her.",
      },
      {
        tamil: "Ya Devi Sarva Bhuteshu Chetanetyabhidhiyate",
        english: "Ya Devi Sarva Bhuteshu Chetanetyabhidhiyate",
        meaning: "The Devi present as life-force in all beings.",
      },
      {
        tamil: "Namastasyai Namastasyai Namastasyai Namo Namah",
        english: "Namastasyai Namastasyai Namastasyai Namo Namah",
        meaning: "Repeated salutations to Her.",
      },
      {
        tamil: "Ya Devi Sarva Bhuteshu Buddhi Rupena Samsthita",
        english: "Ya Devi Sarva Bhuteshu Buddhi Rupena Samsthita",
        meaning: "The Devi present as wisdom in all beings.",
      },
      {
        tamil: "Namastasyai Namastasyai Namastasyai Namo Namah",
        english: "Namastasyai Namastasyai Namastasyai Namo Namah",
        meaning: "Repeated salutations to Her.",
      },
      {
        tamil: "Ya Devi Sarva Bhuteshu Shakti Rupena Samsthita",
        english: "Ya Devi Sarva Bhuteshu Shakti Rupena Samsthita",
        meaning: "The Devi present as strength in all beings.",
      },
      {
        tamil: "Namastasyai Namastasyai Namastasyai Namo Namah",
        english: "Namastasyai Namastasyai Namastasyai Namo Namah",
        meaning: "Repeated salutations to Her.",
      },
    ],
  },
  {
    id: "hanuman-chalisa",
    title: "Hanuman Chalisa",
    titleTamil: "Hanuman Chalisa (full)",
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
        meaning: "Messenger of Rama, abode of incomparable strength, son of Anjani and Vayu.",
      },
      {
        tamil: "மஹாவீர் விக்ரம் பஜரங்கி, குமதி நிவார் சுமதி கே சங்கி",
        english: "Mahabir Vikram Bajrangi, Kumati Nivar Sumati Ke Sangi",
        pronunciation: "Ma-ha-beer Vi-kram Baj-ran-gi, Ku-ma-ti Ni-var Su-ma-ti Ke San-gi",
        meaning: "Great hero with thunderbolt strength, remover of wrong thinking, companion of wisdom.",
      },
      {
        tamil: "காஞ்சன வரண் விராஜ் சுவேசா, காணன் குண்டல் குஞ்சித் கேசா",
        english: "Kanchan Varan Viraj Suvesa, Kanan Kundal Kunchit Kesa",
        pronunciation: "Kan-chan Va-ran Vi-raj Su-ve-sa, Ka-nan Kun-dal Kun-chit Ke-sa",
        meaning: "Golden-hued and beautifully adorned, wearing earrings and curly hair.",
      },
      {
        tamil: "ஹாத் வஜ்ர அவுர் த்வஜா விராஜே, காண்தே மூஞ்ச் ஜனேயூ சாஜை",
        english: "Hath Vajra Aur Dhvaja Viraje, Kandhe Moonj Janeu Sajai",
        pronunciation: "Haath Vaj-ra Aur Dhva-ja Vi-ra-je, Kan-dhe Moonj Ja-ne-u Sa-jai",
        meaning: "Holding the thunderbolt and flag, with sacred thread across your shoulder.",
      },
      {
        tamil: "சங்கர் சுவன் கேசரி நந்தன், தேஜ் பிரதாப மஹா ஜக் வந்தன்",
        english: "Shankar Suvan Kesari Nandan, Tej Pratap Maha Jag Vandan",
        pronunciation: "Shan-kar Su-van Ke-sa-ri Nan-dan, Tej Pra-tap Ma-ha Jag Van-dan",
        meaning: "Born of Shiva's grace and Kesari's line, your radiance is revered by the world.",
      },
      {
        tamil: "வித்யாவான் குணி அதி சதுர், ராம் காஜ் கரிபே கோ ஆத்துர்",
        english: "Vidyavan Guni Ati Chatur, Ram Kaj Karibe Ko Atur",
        pronunciation: "Vid-ya-van Gu-ni A-ti Cha-tur, Ram Kaj Ka-ri-be Ko A-tur",
        meaning: "Learned, virtuous, and wise, always eager to serve Rama's work.",
      },
      {
        tamil: "ப்ரபு சரித்ர சுனிபே கோ ரஸியா, ராம் லகன் சீதா மன பஸியா",
        english: "Prabhu Charitra Sunibe Ko Rasiya, Ram Lakhan Sita Man Basiya",
        pronunciation: "Pra-bhu Cha-rit-ra Su-ni-be Ko Ra-si-ya, Ram La-khan Si-ta Man Ba-si-ya",
        meaning: "Delighted by the Lord's stories, with Rama, Lakshmana, and Sita dwelling in your heart.",
      },
      {
        tamil: "சூக்ஷ்ம ரூப் தரி சியாஹி திகாவா, விகட் ரூப் தரி லங்கா ஜராவா",
        english: "Sukshma Roop Dhari Siyahi Dikhava, Vikat Roop Dhari Lanka Jarava",
        pronunciation: "Sooksh-ma Roop Dha-ri Si-ya-hi Dik-ha-va, Vi-kat Roop Dha-ri Lan-ka Ja-ra-va",
        meaning: "You took a subtle form before Sita and a fierce form to burn Lanka.",
      },
      {
        tamil: "பீம் ரூப் தரி அசுர் சன்ஹாரே, ராமச்சந்திர கே காஜ் சவாரே",
        english: "Bhim Roop Dhari Asur Sanhare, Ramchandra Ke Kaj Savare",
        pronunciation: "Bheem Roop Dha-ri A-sur San-ha-re, Ram-chan-dra Ke Kaj Sa-va-re",
        meaning: "In mighty form you destroyed demons and fulfilled Rama's mission.",
      },
      {
        tamil: "லாயே சஞ்சீவன் லகன் ஜியாயே, ஸ்ரீ ரகுபீர் ஹரஷி உர் லாயே",
        english: "Laye Sanjivan Lakhan Jiyaye, Shri Raghubir Harashi Ur Laye",
        pronunciation: "La-ye San-ji-van La-khan Ji-ya-ye, Shree Ra-ghu-beer Ha-ra-shi Ur La-ye",
        meaning: "You brought the life-restoring herb and revived Lakshmana; Rama embraced you with joy.",
      },
      {
        tamil: "ரகுபதி கீன்ஹி பகுத் பதாய், தும் மம பிரிய பரத்-ஹி-சம் பாய்",
        english: "Raghupati Kinhi Bahut Badai, Tum Mama Priya Bharat-Hi-Sam Bhai",
        pronunciation: "Ra-ghu-pa-ti Kin-hi Ba-hut Ba-dai, Tum Ma-ma Pri-ya Bha-rat-Hi-Sam Bhai",
        meaning: "Rama praised you greatly, saying you are as dear as Bharata.",
      },
      {
        tamil: "ஸஹஸ் பதன் தும்ஹரோ யஸ் காவே, அஸ கஹி ஸ்ரீபதி கந்த் லகாவே",
        english: "Sahas Badan Tumharo Jas Gaave, Asa Kahi Shripati Kanth Lagaave",
        pronunciation: "Sa-has Ba-dan Tum-ha-ro Jas Gaa-ve, A-sa Ka-hi Shree-pa-ti Kanth La-ga-ve",
        meaning: "A thousand mouths sing your glory; saying this, Lord Vishnu embraced you.",
      },
      {
        tamil: "சங்காதிக் பிரமாதி முனீசா, நாரத் சாரத் ஸஹித் அஹீசா",
        english: "Sankadik Brahmadi Muneesa, Narad Sarad Sahit Aheesa",
        pronunciation: "San-ka-dik Brah-ma-di Mu-nee-sa, Na-rad Sa-rad Sa-hit A-hee-sa",
        meaning: "Sanaka sages, Brahma, Narada, Saraswati, and serpent lords praise you.",
      },
      {
        tamil: "யம் குபேர் திக்பால் ஜஹான் தே, கவி கோவித் கஹி சகே கஹான் தே",
        english: "Yam Kuber Digpal Jahan Te, Kavi Kovid Kahi Sake Kahan Te",
        pronunciation: "Yam Ku-ber Dig-pal Ja-han Te, Ka-vi Ko-vid Ka-hi Sa-ke Ka-han Te",
        meaning: "Even Yama, Kubera, and great poets cannot fully describe your glory.",
      },
      {
        tamil: "தும் உப்கார் சுக்ரீவஹி கீன்ஹா, ராம் மிலாயே ராஜ்பத் தீன்ஹா",
        english: "Tum Upkar Sugrivahi Keenha, Ram Milaye Rajpad Deenha",
        pronunciation: "Tum Up-kar Su-gree-va-hi Keen-ha, Ram Mi-la-ye Raj-pad Deen-ha",
        meaning: "You helped Sugriva unite with Rama and regain his kingdom.",
      },
      {
        tamil: "தும்ஹரோ மந்திர விபீஷண் மானா, லங்கேஸ்வர் பயே சப் ஜக் ஜானா",
        english: "Tumharo Mantra Vibhishan Mana, Lankeshwar Bhaye Sab Jag Jana",
        pronunciation: "Tum-ha-ro Man-tra Vi-bhee-shan Ma-na, Lan-kesh-war Bha-ye Sab Jag Ja-na",
        meaning: "Vibhishana followed your counsel and became king of Lanka.",
      },
      {
        tamil: "யுக் ஸஹஸ்ர யோஜன் பர பானு, லீல்யோ தாஹி மதுர் பல ஜானு",
        english: "Yug Sahasra Yojan Par Bhanu, Leelyo Tahi Madhur Phal Janu",
        pronunciation: "Yug Sa-has-ra Yo-jan Par Bha-nu, Lee-lyo Ta-hi Ma-dhur Phal Ja-nu",
        meaning: "You leapt to the distant sun, thinking it a sweet fruit.",
      },
      {
        tamil: "ப்ரபு முத்ரிகா மேலி முக் மாஹி, ஜலதி லாங்ஹி கயே அச்சரஜ் நாஹி",
        english: "Prabhu Mudrika Meli Mukh Mahi, Jaladhi Langhi Gaye Achraj Nahi",
        pronunciation: "Pra-bhu Mud-ri-ka Me-li Mukh Ma-hi, Ja-la-dhi Lan-ghi Ga-ye Ach-raj Na-hi",
        meaning: "Holding Rama's ring in your mouth, crossing the ocean was no wonder.",
      },
      {
        tamil: "துர்கம் காஜ் ஜகத் கே ஜேதே, சுகம் அனுக்ரஹ தும்ஹரே தேதே",
        english: "Durgam Kaj Jagat Ke Jete, Sugam Anugrah Tumhare Tete",
        pronunciation: "Dur-gam Kaj Ja-gat Ke Je-te, Su-gam A-nu-grah Tum-ha-re Te-te",
        meaning: "Difficult tasks become easy through your grace.",
      },
      {
        tamil: "ராம் துவாரே தும் ரக்வாரே, ஹோத் ந ஆக்யா பினு பைசாரே",
        english: "Ram Duare Tum Rakhvare, Hot Na Aagya Binu Paisare",
        pronunciation: "Ram Du-a-re Tum Rakh-va-re, Hot Na Aag-ya Bi-nu Pai-sa-re",
        meaning: "You guard Rama's doorway; none enter without your permission.",
      },
      {
        tamil: "சப் ஸுக் லஹை தும்ஹாரி சர்ணா, தும் ரக்ஷக் காஹூ கோ டர்னா",
        english: "Sab Sukh Lahai Tumhari Sarna, Tum Rakshak Kahu Ko Darna",
        pronunciation: "Sab Sukh La-hai Tum-ha-ri Sar-na, Tum Rak-shak Ka-hu Ko Dar-na",
        meaning: "Those who seek your refuge gain peace; with you as protector, fear fades.",
      },
      {
        tamil: "ஆபன் தேஜ் சம்ஹாரோ ஆபை, தீனோன் லோக் ஹாங்க் தே காம்பை",
        english: "Aapan Tej Samharo Aapai, Teenon Lok Hank Te Kanpai",
        pronunciation: "Aa-pan Tej Sam-ha-ro Aa-pai, Tee-non Lok Hank Te Kan-pai",
        meaning: "You alone can contain your power, before which all three worlds tremble.",
      },
      {
        tamil: "பூத் பிசாச் நிகட் நஹின் ஆவை, மஹாவீர் ஜப் நாம் சுனாவை",
        english: "Bhoot Pishach Nikat Nahin Aavai, Mahavir Jab Naam Sunavai",
        pronunciation: "Bhoot Pi-shaach Ni-kat Na-hin Aa-vai, Ma-ha-veer Jab Naam Su-na-vai",
        meaning: "Negative forces cannot come near where your name is recited.",
      },
      {
        tamil: "நாசே ரோக் ஹரை சப் பீரா, ஜபத் நிரந்தர் ஹனுமத் பீரா",
        english: "Nase Rog Harai Sab Peera, Japat Nirantar Hanumat Beera",
        pronunciation: "Na-se Rog Ha-rai Sab Pee-ra, Ja-pat Ni-ran-tar Ha-nu-mat Bee-ra",
        meaning: "Diseases and suffering are removed by constant chanting of Hanuman's name.",
      },
      {
        tamil: "சங்கட் சே ஹனுமான் சுடாவை, மன் கரம் வசன் த்யான் ஜோ லாவை",
        english: "Sankat Se Hanuman Chudavai, Man Kram Vachan Dhyan Jo Lavai",
        pronunciation: "San-kat Se Ha-nu-man Chu-da-vai, Man Kram Va-chan Dhyan Jo La-vai",
        meaning: "Hanuman frees devotees from distress when mind, action, and speech stay devoted.",
      },
      {
        tamil: "சப் பர ராம் தபஸ்வி ராஜா, தின் கே காஜ் ஸகல் தும் சாஜா",
        english: "Sab Par Ram Tapasvi Raja, Tin Ke Kaj Sakal Tum Saja",
        pronunciation: "Sab Par Ram Ta-pas-vi Ra-ja, Tin Ke Kaj Sa-kal Tum Sa-ja",
        meaning: "Rama is supreme among ascetics, and you complete all his works.",
      },
      {
        tamil: "ஔர் மனோரத் ஜோ கொயி லாவை, சொயி அமித் ஜீவன் பல பாவை",
        english: "Aur Manorath Jo Koi Lavai, Soi Amit Jeevan Phal Pavai",
        pronunciation: "Aur Ma-no-rath Jo Ko-i La-vai, So-i A-mit Jee-van Phal Pa-vai",
        meaning: "Whoever brings sincere wishes to you receives abundant blessings.",
      },
      {
        tamil: "சாரோன் யுக் பிரதாப் தும்ஹாரா, ஹை பரசித்த் ஜகத் உஜியாரா",
        english: "Charon Yug Partap Tumhara, Hai Parsiddh Jagat Ujiyara",
        pronunciation: "Cha-ron Yug Par-tap Tum-ha-ra, Hai Par-sid-dh Ja-gat U-ji-ya-ra",
        meaning: "Your glory shines through all four ages and throughout the world.",
      },
      {
        tamil: "சாது சந்து கே தும் ரக்வாரே, அசுர் நிகந்தன் ராம் துலாரே",
        english: "Sadhu Sant Ke Tum Rakhvare, Asur Nikandan Ram Dulare",
        pronunciation: "Sa-dhu Sant Ke Tum Rakh-va-re, A-sur Ni-kan-dan Ram Du-la-re",
        meaning: "Protector of saints, destroyer of evil, beloved of Rama.",
      },
      {
        tamil: "அஷ்ட சித்தி நவ நிதி கே தாதா, அஸ் வர தீன் ஜானகி மாதா",
        english: "Ashta Siddhi Nav Nidhi Ke Data, As Var Deen Janaki Mata",
        pronunciation: "Ash-ta Sid-dhi Nav Ni-dhi Ke Da-ta, As Var Deen Ja-na-ki Ma-ta",
        meaning: "Bestower of the eight powers and nine treasures, by Sita's blessing.",
      },
      {
        tamil: "ராம் ரஸாயன் தும்ஹரே பாசா, சதா ரஹோ ரகுபதி கே தாசா",
        english: "Ram Rasayan Tumhare Pasa, Sada Raho Raghupati Ke Dasa",
        pronunciation: "Ram Ra-sa-yan Tum-ha-re Pa-sa, Sa-da Ra-ho Ra-ghu-pa-ti Ke Da-sa",
        meaning: "You hold the nectar of Rama's devotion and remain forever his servant.",
      },
      {
        tamil: "தும்ஹரே பஜன் ராம் கோ பாவை, ஜனம் ஜனம் கே துக் பிஸ்ராவை",
        english: "Tumhare Bhajan Ram Ko Pavai, Janam Janam Ke Dukh Bisravai",
        pronunciation: "Tum-ha-re Bha-jan Ram Ko Pa-vai, Ja-nam Ja-nam Ke Dukh Bis-ra-vai",
        meaning: "Through your worship one reaches Rama and forgets sorrows of many births.",
      },
      {
        tamil: "அந்த் கால ரகுபர் பூர் ஜாய், ஜஹான் ஜன்ம ஹரி பக்த் கஹாய்",
        english: "Ant Kaal Raghubar Pur Jai, Jahan Janma Hari Bhakt Kahai",
        pronunciation: "Ant Kaal Ra-ghu-bar Pur Jai, Ja-han Jan-ma Ha-ri Bhakt Ka-hai",
        meaning: "At life's end devotees reach Rama's abode and are reborn as devotees of Hari.",
      },
      {
        tamil: "ஔர் தேவதா சித்த் ந தரை, ஹனுமத் சேயி ஸர்வ ஸுக் கரை",
        english: "Aur Devta Chitt Na Dharai, Hanumat Sei Sarva Sukh Karai",
        pronunciation: "Aur Dev-ta Chitt Na Dha-rai, Ha-nu-mat Se-i Sar-va Sukh Ka-rai",
        meaning: "No need to focus elsewhere; devotion to Hanuman grants complete well-being.",
      },
      {
        tamil: "சங்கட் கட்டே மிடே சப் பீரா, ஜோ சுமிரை ஹனுமத் பல்பீரா",
        english: "Sankat Kate Mite Sab Peera, Jo Sumirai Hanumat Balbeera",
        pronunciation: "San-kat Ka-te Mi-te Sab Pee-ra, Jo Su-mi-rai Ha-nu-mat Bal-bee-ra",
        meaning: "All troubles and pain end for those who remember mighty Hanuman.",
      },
      {
        tamil: "ஜெய் ஜெய் ஜெய் ஹனுமான் கோசாய், கிருபா கரஹு குருதேவ் கி நாய்",
        english: "Jai Jai Jai Hanuman Gosai, Kripa Karahu Gurudev Ki Nai",
        pronunciation: "Jai Jai Jai Ha-nu-man Go-sa-i, Kri-pa Ka-ra-hu Gu-ru-dev Ki Na-i",
        meaning: "Victory to Hanuman; please bless us with the grace of a true guru.",
      },
      {
        tamil: "ஜோ ஸத் பார் பாத் கரே கொயி, சூடேஹி பந்தி மஹா ஸுக் ஹோயி",
        english: "Jo Sat Bar Path Kare Koi, Chhutehi Bandi Maha Sukh Hoi",
        pronunciation: "Jo Sat Bar Paath Ka-re Ko-i, Chhoo-te-hi Ban-di Ma-ha Sukh Ho-i",
        meaning: "Whoever recites this regularly is freed from bondage and gains deep joy.",
      },
      {
        tamil: "ஜோ யஹ் படே ஹனுமான் சாலிசா, ஹோயே சித்தி சாகி கௌரிசா",
        english: "Jo Yah Padhe Hanuman Chalisa, Hoye Siddhi Sakhi Gaurisa",
        pronunciation: "Jo Yah Pa-dhe Ha-nu-man Cha-li-sa, Ho-ye Sid-dhi Sa-khi Gau-ri-sa",
        meaning: "One who recites this Chalisa attains success; Shiva himself is witness.",
      },
      {
        tamil: "துல்ஸிதாஸ் சதா ஹரி சேரா, கீஜை நாத் ஹ்ரிதயே மஹ் தேரா",
        english: "Tulsidas Sada Hari Chera, Keejai Nath Hridaye Mah Dera",
        pronunciation: "Tul-si-das Sa-da Ha-ri Che-ra, Kee-jai Nath Hri-da-ye Mah De-ra",
        meaning: "Tulsidas, servant of Hari, prays that you dwell in his heart forever.",
      },
      {
        tamil: "பவன தனய் சங்கட் ஹரண், மங்கள மூர்த்தி ரூப்; ராம் லகன் சீதா ஸஹித், ஹ்ரிதய பஸஹு சுர் பூப்",
        english: "Pavan Tanay Sankat Haran, Mangal Murti Roop; Ram Lakhan Sita Sahit, Hriday Basahu Sur Bhoop",
        pronunciation:
          "Pa-van Ta-nay San-kat Ha-ran, Man-gal Mur-ti Roop; Ram La-khan Si-ta Sa-hit, Hri-day Ba-sa-hu Sur Bhoop",
        meaning: "O son of the Wind, remover of troubles, dwell in my heart along with Rama, Lakshmana, and Sita.",
      },
    ],
  },
  {
    id: "hanuman-dhyanam",
    title: "Hanuman Dhyanam",
    titleTamil: "Hanuman Dhyanam",
    category: "Hanuman",
    duration: "5 min",
    icon: "HA",
    lines: [
      {
        tamil: "Manojavam Maruta Tulya Vegam",
        english: "Manojavam Maruta Tulya Vegam",
        meaning: "Swift as mind and wind.",
      },
      {
        tamil: "Jitendriyam Buddhimatam Varishtham",
        english: "Jitendriyam Buddhimatam Varishtham",
        meaning: "Master of senses, foremost among the wise.",
      },
      {
        tamil: "Vatatmajam Vanarayutha Mukhyam",
        english: "Vatatmajam Vanarayutha Mukhyam",
        meaning: "Son of Vayu and chief among vanaras.",
      },
      {
        tamil: "Sri Rama Dutam Shirasa Namami",
        english: "Sri Rama Dutam Shirasa Namami",
        meaning: "I bow to the messenger of Shri Rama.",
      },
      {
        tamil: "Anjaneyam Ati Patalananam",
        english: "Anjaneyam Ati Patalananam",
        meaning: "I meditate on radiant Hanuman.",
      },
      {
        tamil: "Kanchanadri Kamaneeya Vigraham",
        english: "Kanchanadri Kamaneeya Vigraham",
        meaning: "Golden and majestic in form.",
      },
      {
        tamil: "Parijata Taru Moola Vasinam",
        english: "Parijata Taru Moola Vasinam",
        meaning: "Dwelling beneath the celestial tree.",
      },
      {
        tamil: "Bhavayami Pavamana Nandanam",
        english: "Bhavayami Pavamana Nandanam",
        meaning: "I contemplate the son of the Wind God.",
      },
    ],
  },
  {
    id: "guru-brahma-guru-vishnu",
    title: "Guru Brahma Guru Vishnu",
    titleTamil: "Guru Brahma Guru Vishnu",
    category: "Guru",
    duration: "4 min",
    icon: "GU",
    lines: [
      {
        tamil: "Guru Brahma Guru Vishnu",
        english: "Guru Brahma Guru Vishnu",
        meaning: "Guru is Brahma and Vishnu.",
      },
      {
        tamil: "Guru Devo Maheshwara",
        english: "Guru Devo Maheshwara",
        meaning: "Guru is indeed Maheshwara.",
      },
      {
        tamil: "Guru Sakshat Parabrahma",
        english: "Guru Sakshat Parabrahma",
        meaning: "Guru is the Supreme Reality itself.",
      },
      {
        tamil: "Tasmai Shri Gurave Namah",
        english: "Tasmai Shri Gurave Namah",
        meaning: "Salutations to that revered Guru.",
      },
      {
        tamil: "Akhanda Mandalakaram",
        english: "Akhanda Mandalakaram",
        meaning: "That which pervades all creation.",
      },
      {
        tamil: "Vyaptam Yena Characharam",
        english: "Vyaptam Yena Characharam",
        meaning: "The moving and unmoving universe is pervaded by That.",
      },
      {
        tamil: "Tatpadam Darshitam Yena",
        english: "Tatpadam Darshitam Yena",
        meaning: "By whom the Supreme state is shown.",
      },
      {
        tamil: "Tasmai Shri Gurave Namah",
        english: "Tasmai Shri Gurave Namah",
        meaning: "Salutations to that revered Guru.",
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
