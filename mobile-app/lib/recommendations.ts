const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const SLOKA_DAYS: Record<string, string[]> = {
  "lingashtakam": ["Monday"],
  "shiva-panchakshara-stotram": ["Monday"],
  "maha-mrityunjaya": ["Monday"],
  "shiva-moola-mantra": ["Monday"],
  "shiva-ashtakam": ["Monday"],
  "shiva-tandava-stotram": ["Monday", "Friday"],
  "shiva-chalisa": ["Monday"],
  "shantakaram-bhujagashayanam": ["Thursday", "Saturday"],
  "vishnu-sahasranama-excerpt": ["Thursday", "Saturday"],
  "venkateshwara-suprabhatam": ["Thursday", "Saturday"],
  "narayaniyam-dhyanam": ["Thursday"],
  "ya-devi-sarva-bhuteshu": ["Friday"],
  "lalitha-sahasranama-excerpt": ["Friday"],
  "mahalakshmi-ashtakam": ["Friday"],
  "hanuman-chalisa": ["Tuesday", "Saturday"],
  "hanuman-dhyanam": ["Tuesday", "Saturday"],
  "kanda-shashti-kavasam-excerpt": ["Tuesday", "Friday"],
  "subramanya-bhujangam": ["Tuesday", "Friday"],
  "thirumurugatrupadai-excerpt": ["Tuesday"],
  "kandar-anoobothi": ["Tuesday", "Friday"],
  "kandar-alangaram": ["Friday"],
  "vel-maral": ["Tuesday"],
  "thirupugazh-arumugam": ["Tuesday", "Friday"],
  "vakratunda-mahakaya": ["Wednesday"],
  "ganesha-pancharatnam": ["Wednesday"],
  "vinayagar-agaval": ["Wednesday"],
  "karya-sidhi-malai": ["Wednesday"],
  "guru-brahma-guru-vishnu": ["Thursday"],
  "saraswati-vandana": ["Friday", "Thursday"],
  "harivarasanam": ["Saturday"],
  "rama-bhadram-bhajeham": ["Tuesday", "Wednesday"],
  "krishna-madhurashtakam": ["Wednesday", "Thursday"],
  "achyutam-keshavam": ["Wednesday", "Thursday"],
};

export function getTodayRecommendedIds(): string[] {
  const today = WEEKDAYS[new Date().getDay()];
  return Object.entries(SLOKA_DAYS)
    .filter(([, days]) => days.includes(today))
    .map(([id]) => id);
}
