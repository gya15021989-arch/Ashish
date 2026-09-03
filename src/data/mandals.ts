// Uttar Pradesh 18 Administrative Divisions (Mandals) and 75 Districts Centralized Mapping

export interface MandalInfo {
  id: string;
  name: string;
  hindiName: string;
  headquarters: string;
  districts: string[];
}

export const UP_MANDALS_DATA: MandalInfo[] = [
  {
    id: 'mandal-lucknow',
    name: 'Lucknow Mandal',
    hindiName: 'लखनऊ मंडल',
    headquarters: 'Lucknow',
    districts: ['Lucknow', 'Hardoi', 'Lakhimpur Kheri', 'Raebareli', 'Sitapur', 'Unnao']
  },
  {
    id: 'mandal-meerut',
    name: 'Meerut Mandal',
    hindiName: 'मेरठ मंडल',
    headquarters: 'Meerut',
    districts: ['Meerut', 'Gautam Buddha Nagar (Noida)', 'Ghaziabad', 'Bulandshahr', 'Hapur', 'Baghpat']
  },
  {
    id: 'mandal-varanasi',
    name: 'Varanasi Mandal',
    hindiName: 'वाराणसी मंडल',
    headquarters: 'Varanasi',
    districts: ['Varanasi', 'Chandauli', 'Ghazipur', 'Jaunpur']
  },
  {
    id: 'mandal-agra',
    name: 'Agra Mandal',
    hindiName: 'आगरा मंडल',
    headquarters: 'Agra',
    districts: ['Agra', 'Mathura', 'Firozabad', 'Mainpuri']
  },
  {
    id: 'mandal-prayagraj',
    name: 'Prayagraj Mandal',
    hindiName: 'प्रयागराज मंडल',
    headquarters: 'Prayagraj',
    districts: ['Prayagraj', 'Fatehpur', 'Kaushambi', 'Pratapgarh']
  },
  {
    id: 'mandal-kanpur',
    name: 'Kanpur Mandal',
    hindiName: 'कानपुर मंडल',
    headquarters: 'Kanpur',
    districts: ['Kanpur Nagar', 'Kanpur Dehat', 'Auraiya', 'Etawah', 'Farrukhabad', 'Kannauj']
  },
  {
    id: 'mandal-gorakhpur',
    name: 'Gorakhpur Mandal',
    hindiName: 'गोरखपुर मंडल',
    headquarters: 'Gorakhpur',
    districts: ['Gorakhpur', 'Deoria', 'Kushinagar', 'Maharajganj']
  },
  {
    id: 'mandal-bareilly',
    name: 'Bareilly Mandal',
    hindiName: 'बरेली मंडल',
    headquarters: 'Bareilly',
    districts: ['Bareilly', 'Budaun', 'Pilibhit', 'Shahjahanpur']
  },
  {
    id: 'mandal-ayodhya',
    name: 'Ayodhya Mandal',
    hindiName: 'अयोध्या मंडल',
    headquarters: 'Ayodhya',
    districts: ['Ayodhya', 'Ambedkar Nagar', 'Amethi', 'Barabanki', 'Sultanpur']
  },
  {
    id: 'mandal-moradabad',
    name: 'Moradabad Mandal',
    hindiName: 'मुरादाबाद मंडल',
    headquarters: 'Moradabad',
    districts: ['Moradabad', 'Amroha', 'Bijnor', 'Rampur', 'Sambhal']
  },
  {
    id: 'mandal-saharanpur',
    name: 'Saharanpur Mandal',
    hindiName: 'सहारनपुर मंडल',
    headquarters: 'Saharanpur',
    districts: ['Saharanpur', 'Muzaffarnagar', 'Shamli']
  },
  {
    id: 'mandal-aligarh',
    name: 'Aligarh Mandal',
    hindiName: 'अलीगढ़ मंडल',
    headquarters: 'Aligarh',
    districts: ['Aligarh', 'Etah', 'Hathras', 'Kasganj']
  },
  {
    id: 'mandal-azamgarh',
    name: 'Azamgarh Mandal',
    hindiName: 'आजमगढ़ मंडल',
    headquarters: 'Azamgarh',
    districts: ['Azamgarh', 'Ballia', 'Mau']
  },
  {
    id: 'mandal-basti',
    name: 'Basti Mandal',
    hindiName: 'बस्ती मंडल',
    headquarters: 'Basti',
    districts: ['Basti', 'Sant Kabir Nagar', 'Siddharthnagar']
  },
  {
    id: 'mandal-chitrakoot',
    name: 'Chitrakoot Mandal',
    hindiName: 'चित्रकूट मंडल',
    headquarters: 'Banda',
    districts: ['Banda', 'Chitrakoot', 'Hamirpur', 'Mahoba']
  },
  {
    id: 'mandal-devipatan',
    name: 'Devipatan Mandal',
    hindiName: 'देवीपाटन मंडल',
    headquarters: 'Gonda',
    districts: ['Bahraich', 'Balrampur', 'Gonda', 'Shravasti']
  },
  {
    id: 'mandal-jhansi',
    name: 'Jhansi Mandal',
    hindiName: 'झांसी मंडल',
    headquarters: 'Jhansi',
    districts: ['Jalaun', 'Jhansi', 'Lalitpur']
  },
  {
    id: 'mandal-mirzapur',
    name: 'Mirzapur Mandal',
    hindiName: 'मिर्ज़ापुर मंडल',
    headquarters: 'Mirzapur',
    districts: ['Mirzapur', 'Bhadohi', 'Sonbhadra']
  }
];

export const MANDAL_NAMES = UP_MANDALS_DATA.map(m => m.name);

// Direct district to mandal lookup dictionary (with aliases & normalized variations)
export const DISTRICT_TO_MANDAL_MAP: Record<string, string> = {
  // Lucknow Mandal
  'lucknow': 'Lucknow Mandal',
  'hardoi': 'Lucknow Mandal',
  'lakhimpur kheri': 'Lucknow Mandal',
  'kheri': 'Lucknow Mandal',
  'raebareli': 'Lucknow Mandal',
  'rae bareli': 'Lucknow Mandal',
  'sitapur': 'Lucknow Mandal',
  'unnao': 'Lucknow Mandal',

  // Meerut Mandal
  'meerut': 'Meerut Mandal',
  'gautam buddha nagar': 'Meerut Mandal',
  'gautam buddha nagar (noida)': 'Meerut Mandal',
  'gautam budh nagar': 'Meerut Mandal',
  'noida': 'Meerut Mandal',
  'greater noida': 'Meerut Mandal',
  'ghaziabad': 'Meerut Mandal',
  'bulandshahr': 'Meerut Mandal',
  'bulandshahar': 'Meerut Mandal',
  'hapur': 'Meerut Mandal',
  'panchsheel nagar': 'Meerut Mandal',
  'baghpat': 'Meerut Mandal',

  // Varanasi Mandal
  'varanasi': 'Varanasi Mandal',
  'banaras': 'Varanasi Mandal',
  'kashi': 'Varanasi Mandal',
  'chandauli': 'Varanasi Mandal',
  'ghazipur': 'Varanasi Mandal',
  'jaunpur': 'Varanasi Mandal',

  // Agra Mandal
  'agra': 'Agra Mandal',
  'mathura': 'Agra Mandal',
  'firozabad': 'Agra Mandal',
  'mainpuri': 'Agra Mandal',

  // Prayagraj Mandal
  'prayagraj': 'Prayagraj Mandal',
  'allahabad': 'Prayagraj Mandal',
  'prayagraj (allahabad)': 'Prayagraj Mandal',
  'fatehpur': 'Prayagraj Mandal',
  'kaushambi': 'Prayagraj Mandal',
  'pratapgarh': 'Prayagraj Mandal',

  // Kanpur Mandal
  'kanpur': 'Kanpur Mandal',
  'kanpur nagar': 'Kanpur Mandal',
  'kanpur dehat': 'Kanpur Mandal',
  'ramabai nagar': 'Kanpur Mandal',
  'auraiya': 'Kanpur Mandal',
  'etawah': 'Kanpur Mandal',
  'farrukhabad': 'Kanpur Mandal',
  'kannauj': 'Kanpur Mandal',

  // Gorakhpur Mandal
  'gorakhpur': 'Gorakhpur Mandal',
  'deoria': 'Gorakhpur Mandal',
  'kushinagar': 'Gorakhpur Mandal',
  'maharajganj': 'Gorakhpur Mandal',
  'mahrajganj': 'Gorakhpur Mandal',

  // Bareilly Mandal
  'bareilly': 'Bareilly Mandal',
  'budaun': 'Bareilly Mandal',
  'badaun': 'Bareilly Mandal',
  'pilibhit': 'Bareilly Mandal',
  'shahjahanpur': 'Bareilly Mandal',

  // Ayodhya Mandal
  'ayodhya': 'Ayodhya Mandal',
  'faizabad': 'Ayodhya Mandal',
  'ayodhya (faizabad)': 'Ayodhya Mandal',
  'ambedkar nagar': 'Ayodhya Mandal',
  'amethi': 'Ayodhya Mandal',
  'barabanki': 'Ayodhya Mandal',
  'sultanpur': 'Ayodhya Mandal',

  // Moradabad Mandal
  'moradabad': 'Moradabad Mandal',
  'amroha': 'Moradabad Mandal',
  'jyotiba phule nagar': 'Moradabad Mandal',
  'bijnor': 'Moradabad Mandal',
  'rampur': 'Moradabad Mandal',
  'sambhal': 'Moradabad Mandal',
  'bhim nagar': 'Moradabad Mandal',

  // Saharanpur Mandal
  'saharanpur': 'Saharanpur Mandal',
  'muzaffarnagar': 'Saharanpur Mandal',
  'shamli': 'Saharanpur Mandal',
  'prabuddh nagar': 'Saharanpur Mandal',

  // Aligarh Mandal
  'aligarh': 'Aligarh Mandal',
  'etah': 'Aligarh Mandal',
  'hathras': 'Aligarh Mandal',
  'mahamaya nagar': 'Aligarh Mandal',
  'kasganj': 'Aligarh Mandal',
  'kanshiram nagar': 'Aligarh Mandal',

  // Azamgarh Mandal
  'azamgarh': 'Azamgarh Mandal',
  'ballia': 'Azamgarh Mandal',
  'mau': 'Azamgarh Mandal',

  // Basti Mandal
  'basti': 'Basti Mandal',
  'sant kabir nagar': 'Basti Mandal',
  'siddharthnagar': 'Basti Mandal',
  'siddharth nagar': 'Basti Mandal',

  // Chitrakoot Mandal
  'banda': 'Chitrakoot Mandal',
  'chitrakoot': 'Chitrakoot Mandal',
  'hamirpur': 'Chitrakoot Mandal',
  'mahoba': 'Chitrakoot Mandal',

  // Devipatan Mandal
  'bahraich': 'Devipatan Mandal',
  'balrampur': 'Devipatan Mandal',
  'gonda': 'Devipatan Mandal',
  'shravasti': 'Devipatan Mandal',

  // Jhansi Mandal
  'jalaun': 'Jhansi Mandal',
  'orai': 'Jhansi Mandal',
  'jhansi': 'Jhansi Mandal',
  'lalitpur': 'Jhansi Mandal',

  // Mirzapur Mandal
  'mirzapur': 'Mirzapur Mandal',
  'bhadohi': 'Mirzapur Mandal',
  'sant ravidas nagar': 'Mirzapur Mandal',
  'sant ravidas nagar (bhadohi)': 'Mirzapur Mandal',
  'sonbhadra': 'Mirzapur Mandal'
};

/**
 * Derives the administrative Mandal for any given Uttar Pradesh District name
 */
export function getMandalForDistrict(districtName?: string | null): string {
  if (!districtName) return 'Uttar Pradesh';
  const clean = districtName.toLowerCase().trim();
  
  if (DISTRICT_TO_MANDAL_MAP[clean]) {
    return DISTRICT_TO_MANDAL_MAP[clean];
  }

  // Substring / partial lookup
  for (const [key, mandal] of Object.entries(DISTRICT_TO_MANDAL_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return mandal;
    }
  }

  return `${districtName} Mandal`;
}

/**
 * Returns list of districts belonging to a specific Mandal
 */
export function getDistrictsForMandal(mandalName: string): string[] {
  if (!mandalName || mandalName === 'All' || mandalName === 'All Mandals') {
    return [];
  }
  const match = UP_MANDALS_DATA.find(
    m => m.name.toLowerCase() === mandalName.toLowerCase() || m.id.toLowerCase() === mandalName.toLowerCase()
  );
  return match ? match.districts : [];
}
