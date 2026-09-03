// ==========================================================
// UPRSA DISTRICT CODES & REGISTRATION NUMBER GENERATOR
// Format: UPRSA-[DIST]-2026-XXXXX (e.g. UPRSA-GBN-2026-00008)
// ==========================================================

export const DISTRICT_CODE_MAP: Record<string, string> = {
  'Lucknow': 'LKO',
  'Gautam Buddha Nagar': 'GBN',
  'Gautam Buddha Nagar (Noida)': 'GBN',
  'Ghaziabad': 'GZB',
  'Varanasi': 'VAR',
  'Kanpur Nagar': 'KAN',
  'Kanpur Dehat': 'KND',
  'Agra': 'AGR',
  'Prayagraj': 'PRY',
  'Prayagraj (Allahabad)': 'PRY',
  'Meerut': 'MRT',
  'Gorakhpur': 'GOR',
  'Bareilly': 'BLY',
  'Aligarh': 'ALI',
  'Ayodhya': 'AYD',
  'Ayodhya (Faizabad)': 'AYD',
  'Jhansi': 'JHS',
  'Moradabad': 'MBD',
  'Saharanpur': 'SRE',
  'Mathura': 'MTR',
  'Muzaffarnagar': 'MZF',
  'Firozabad': 'FRZ',
  'Budaun': 'BDN',
  'Bulandshahr': 'BLS',
  'Shahjahanpur': 'SJP',
  'Mainpuri': 'MPR',
  'Etawah': 'ETW',
  'Farrukhabad': 'FKD',
  'Mirzapur': 'MZP',
  'Azamgarh': 'AZM',
  'Ballia': 'BAL',
  'Deoria': 'DEO',
  'Basti': 'BST',
  'Gonda': 'GND',
  'Sultanpur': 'SLT',
  'Rae Bareli': 'RBL',
  'Sitapur': 'STP',
  'Hardoi': 'HRD',
  'Unnao': 'UNA',
  'Lakhimpur Kheri': 'LKP',
  'Bijnor': 'BJN',
  'Rampur': 'RMP',
  'Sambhal': 'SMB',
  'Amroha': 'AMR',
  'Hapur': 'HPR',
  'Baghpat': 'BGP',
  'Shamli': 'SML',
  'Hathras': 'HTR',
  'Kasganj': 'KSG',
  'Etah': 'ETH',
  'Pilibhit': 'PLB',
  'Barabanki': 'BBK',
  'Amethi': 'AMT',
  'Bahraich': 'BHR',
  'Shravasti': 'SRV',
  'Balrampur': 'BLP',
  'Siddharthnagar': 'SDN',
  'Sant Kabir Nagar': 'SKN',
  'Maharajganj': 'MHG',
  'Kushinagar': 'KSH',
  'Mau': 'MAU',
  'Jaunpur': 'JNP',
  'Ghazipur': 'GZP',
  'Chandauli': 'CHD',
  'Sonbhadra': 'SND',
  'Bhadohi': 'BDH',
  'Kaushambi': 'KSH',
  'Fatehpur': 'FTP',
  'Pratapgarh': 'PTG',
  'Jalaun': 'JLN',
  'Hamirpur': 'HMP',
  'Mahoba': 'MHB',
  'Banda': 'BND',
  'Chitrakoot': 'CKT',
  'Lalitpur': 'LLP',
  'Kannauj': 'KNJ',
  'Auraiya': 'AUR'
};

export function getDistrictCode(districtName: string): string {
  if (!districtName) return 'UP';
  if (DISTRICT_CODE_MAP[districtName]) {
    return DISTRICT_CODE_MAP[districtName];
  }
  // Try clean lookup
  const clean = districtName.replace(/\s*\(.*?\)\s*/g, '').trim();
  if (DISTRICT_CODE_MAP[clean]) {
    return DISTRICT_CODE_MAP[clean];
  }
  // Fallback 3 uppercase letters
  return clean.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase() || 'UPR';
}

export function generateRegistrationNumber(districtName: string, sequenceNumber: number): string {
  const code = getDistrictCode(districtName);
  const paddedSeq = sequenceNumber.toString().padStart(5, '0');
  return `UPRSA-${code}-2026-${paddedSeq}`;
}

export function getMandalForDistrict(districtName: string): string {
  const clean = districtName.replace(/\s*\(.*?\)\s*/g, '').trim();
  const mandalMap: Record<string, string> = {
    'Lucknow': 'Lucknow',
    'Hardoi': 'Lucknow',
    'Lakhimpur Kheri': 'Lucknow',
    'Rae Bareli': 'Lucknow',
    'Sitapur': 'Lucknow',
    'Unnao': 'Lucknow',
    'Kanpur Nagar': 'Kanpur',
    'Kanpur Dehat': 'Kanpur',
    'Etawah': 'Kanpur',
    'Farrukhabad': 'Kanpur',
    'Kannauj': 'Kanpur',
    'Auraiya': 'Kanpur',
    'Meerut': 'Meerut',
    'Baghpat': 'Meerut',
    'Bulandshahr': 'Meerut',
    'Gautam Buddha Nagar': 'Meerut',
    'Ghaziabad': 'Meerut',
    'Hapur': 'Meerut',
    'Agra': 'Agra',
    'Firozabad': 'Agra',
    'Mainpuri': 'Agra',
    'Mathura': 'Agra',
    'Varanasi': 'Varanasi',
    'Chandauli': 'Varanasi',
    'Ghazipur': 'Varanasi',
    'Jaunpur': 'Varanasi',
    'Prayagraj': 'Prayagraj',
    'Fatehpur': 'Prayagraj',
    'Kaushambi': 'Prayagraj',
    'Pratapgarh': 'Prayagraj',
    'Gorakhpur': 'Gorakhpur',
    'Deoria': 'Gorakhpur',
    'Kushinagar': 'Gorakhpur',
    'Maharajganj': 'Gorakhpur',
    'Bareilly': 'Bareilly',
    'Budaun': 'Bareilly',
    'Pilibhit': 'Bareilly',
    'Shahjahanpur': 'Bareilly',
    'Aligarh': 'Aligarh',
    'Etah': 'Aligarh',
    'Hathras': 'Aligarh',
    'Kasganj': 'Aligarh',
    'Ayodhya': 'Ayodhya',
    'Ambedkar Nagar': 'Ayodhya',
    'Amethi': 'Ayodhya',
    'Barabanki': 'Ayodhya',
    'Sultanpur': 'Ayodhya',
    'Jhansi': 'Jhansi',
    'Jalaun': 'Jhansi',
    'Lalitpur': 'Jhansi',
    'Moradabad': 'Moradabad',
    'Bijnor': 'Moradabad',
    'Amroha': 'Moradabad',
    'Rampur': 'Moradabad',
    'Sambhal': 'Moradabad',
    'Saharanpur': 'Saharanpur',
    'Muzaffarnagar': 'Saharanpur',
    'Shamli': 'Saharanpur',
    'Mirzapur': 'Mirzapur',
    'Bhadohi': 'Mirzapur',
    'Sonbhadra': 'Mirzapur',
    'Azamgarh': 'Azamgarh',
    'Ballia': 'Azamgarh',
    'Mau': 'Azamgarh',
    'Basti': 'Basti',
    'Sant Kabir Nagar': 'Basti',
    'Siddharthnagar': 'Basti',
    'Chitrakoot': 'Chitrakoot',
    'Banda': 'Chitrakoot',
    'Hamirpur': 'Chitrakoot',
    'Mahoba': 'Chitrakoot',
    'Devipatan': 'Devipatan',
    'Bahraich': 'Devipatan',
    'Balrampur': 'Devipatan',
    'Gonda': 'Devipatan',
    'Shravasti': 'Devipatan'
  };

  return mandalMap[clean] || 'Lucknow';
}
