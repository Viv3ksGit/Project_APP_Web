// Short benefit line per deity, shown on library cards (per the design mockup).
const BENEFITS: Record<string, string> = {
  Ganesh: "Removes obstacles and brings success",
  Shiva: "Brings peace, protection and strength",
  Vishnu: "Attracts positivity, harmony and abundance",
  Muruga: "Enhances courage, focus and wisdom",
  Lakshmi: "Invites prosperity, wealth and well-being",
  Durga: "Provides protection, power and courage",
  Hanuman: "Grants strength, devotion and fearlessness",
  Krishna: "Fills life with joy, love and wisdom",
  Saraswati: "Blesses learning, arts and clarity",
  Rama: "Inspires virtue, duty and inner calm",
  Amman: "Showers grace, healing and motherly care",
  Venkateshwara: "Bestows fortune and divine blessings",
  Guruvayurappan: "Brings devotion, health and harmony",
  Ayyappa: "Strengthens discipline and self-mastery",
};

export function benefitOf(category: string): string {
  return BENEFITS[category] ?? "Daily chants for inner calm";
}
