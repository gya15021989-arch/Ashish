import { District, Club, DisciplineType, AgeCategory } from '../types';

export const UPRSA_INFO = {
  name: 'Uttar Pradesh Roller Sports Association',
  shortName: 'UPRSA',
  hindiName: 'उत्तर प्रदेश रोलर स्पोर्ट्स एसोसिएशन',
  regNumber: 'UP/S/294/1988',
  affiliation: 'Affiliated to Roller Skating Federation of India (RSFI) & UP Olympic Association (UPOA)',
  recognizedBy: 'Ministry of Youth Affairs and Sports, Govt of India & Sports Directorate, UP',
  headOffice: 'UP Roller Sports Arena, Sector-G, LDA Colony, Kanpur Road, Lucknow, Uttar Pradesh - 226012',
  phone: '+91 522 2439812, +91 94150 21989',
  email: 'uprsa.official@gmail.com',
  website: 'https://uprsa.org',
  established: 1988,
  president: 'Dr. Akhilesh Chandra Sharma',
  secretaryGeneral: 'Rajesh Kumar Singh',
  treasurer: 'Vivek Srivastava',
  technicalDirector: 'Arun Kumar Verma',
  executives: [
    { role: 'President', name: 'Dr. Akhilesh Chandra Sharma' },
    { role: 'General Secretary', name: 'Rajesh Kumar Singh' },
    { role: 'Treasurer', name: 'Vivek Srivastava' },
    { role: 'Vice President (Admin)', name: 'Shri Amitabh Saxena' },
    { role: 'Vice President (Technical)', name: 'Shri R. K. Srivastava' }
  ],
  executiveCommittee: [
    { 
      name: 'Dr. Akhilesh Chandra Sharma', 
      role: 'President', 
      district: 'Lucknow (Statewide)',
      roleDescription: 'Apex state leadership presiding over general assembly, state policy formulations, RSFI federation liaisons, and sports infrastructure sanctions.',
      phone: '+91 94150 21989',
      email: 'uprsa.president@gmail.com',
      address: 'UP Roller Sports Arena, Sector-G, LDA Colony, Kanpur Road, Lucknow, UP - 226012'
    },
    { 
      name: 'Rajesh Kumar Singh', 
      role: 'General Secretary', 
      district: 'Varanasi & Eastern UP',
      roleDescription: 'Executive management of state championship operations, skater registrations, district affiliation oversight, and official Team UP national selections.',
      phone: '+91 94152 77665',
      email: 'gs.uprsa@gmail.com',
      address: 'Dr. Sampurnanand Sports Stadium, Sigra, Varanasi, UP - 221002'
    },
    { 
      name: 'Vivek Srivastava', 
      role: 'Treasurer', 
      district: 'Kanpur Nagar & Central Zone',
      roleDescription: 'Financial management, audited state tournament accounts, athlete welfare funds, equipment grant allocations, and statutory compliances.',
      phone: '+91 94501 88990',
      email: 'treasurer.uprsa@gmail.com',
      address: 'Green Park Stadium, Civil Lines, Kanpur Nagar, UP - 208001'
    },
    { 
      name: 'Shri Amitabh Saxena', 
      role: 'Vice President (Admin)', 
      district: 'Gautam Buddha Nagar (Noida)',
      roleDescription: 'Administrative coordination with UP Olympic Association, corporate sports sponsorships, and Western UP district council supervision.',
      phone: '+91 98180 54321',
      email: 'vp.admin@uprsa.org',
      address: 'Noida Sports Complex, Sector 21-A, Gautam Buddha Nagar, UP - 201301'
    },
    { 
      name: 'Shri R. K. Srivastava', 
      role: 'Vice President (Technical)', 
      district: 'Prayagraj & Southern Zone',
      roleDescription: 'Chief coordinator of RSFI technical code compliances, track safety inspections, and high-performance training camps for state athletes.',
      phone: '+91 94150 11223',
      email: 'vp.tech@uprsa.org',
      address: 'Madan Mohan Malviya Stadium, Prayagraj, UP - 211002'
    },
    { 
      name: 'Arun Kumar Verma', 
      role: 'Technical Director', 
      district: 'Ghaziabad & NCR Region',
      roleDescription: 'Head of referee certifications, electronic photo-finish timing operations, and selection trials jury administration.',
      phone: '+91 98112 33445',
      email: 'technical.director@uprsa.org',
      address: 'Mahamaya Sports Stadium, Ghaziabad, UP - 201001'
    },
    { 
      name: 'Smt. Vandana Gupta', 
      role: 'Joint Secretary', 
      district: 'Agra & Braj Zone',
      roleDescription: 'State women skaters initiative director, athlete welfare committee head, and inter-school grassroots roller sports development.',
      phone: '+91 98370 44556',
      email: 'joint.secretary@uprsa.org',
      address: 'Eklavya Sports Stadium, Agra, UP - 282001'
    },
    { 
      name: 'Dr. Praveen Yadav', 
      role: 'Executive Member', 
      district: 'Meerut & Western Zone',
      roleDescription: 'Medical committee supervisor, anti-doping protocol officer, and athlete sports medicine and injury rehabilitation coordinator.',
      phone: '+91 98970 12345',
      email: 'exec.meerut@uprsa.org',
      address: 'Kailash Prakash Stadium, Meerut, UP - 250001'
    }
  ],
  pointsSystem: {
    gold: 5,
    silver: 3,
    bronze: 1,
    description: 'Gold Medal = 5 Points, Silver Medal = 3 Points, Bronze Medal = 1 Point'
  }
};

export const AGE_CATEGORIES_INFO = [
  {
    category: 'Tots (Under 6)' as AgeCategory,
    minAge: 4,
    maxAge: 6,
    cutoffDescription: 'Born on or after 1st Jan 2020',
    disciplines: ['Speed Skating (Quad)', 'Speed Skating (Inline)']
  },
  {
    category: 'Minis (6 to 8)' as AgeCategory,
    minAge: 6,
    maxAge: 8,
    cutoffDescription: 'Born 1st Jan 2018 to 31st Dec 2019',
    disciplines: ['Speed Skating (Quad)', 'Speed Skating (Inline)', 'Inline Freestyle', 'Artistic Skating']
  },
  {
    category: 'Cadet (8 to 10)' as AgeCategory,
    minAge: 8,
    maxAge: 10,
    cutoffDescription: 'Born 1st Jan 2016 to 31st Dec 2017',
    disciplines: ['Speed Skating (Quad)', 'Speed Skating (Inline)', 'Inline Freestyle', 'Artistic Skating', 'Roller Hockey']
  },
  {
    category: 'Cadet (10 to 12)' as AgeCategory,
    minAge: 10,
    maxAge: 12,
    cutoffDescription: 'Born 1st Jan 2014 to 31st Dec 2015',
    disciplines: ['Speed Skating (Quad)', 'Speed Skating (Inline)', 'Inline Freestyle', 'Artistic Skating', 'Roller Hockey', 'Skateboarding']
  },
  {
    category: 'Sub-Junior (12 to 15)' as AgeCategory,
    minAge: 12,
    maxAge: 15,
    cutoffDescription: 'Born 1st Jan 2012 to 31st Dec 2013',
    disciplines: ['Speed Skating (Quad)', 'Speed Skating (Inline)', 'Inline Freestyle', 'Roller Freestyle', 'Artistic Skating', 'Roller Hockey', 'Inline Hockey', 'Skateboarding']
  },
  {
    category: 'Junior (15 to 18)' as AgeCategory,
    minAge: 15,
    maxAge: 18,
    cutoffDescription: 'Born 1st Jan 2009 to 31st Dec 2011',
    disciplines: ['All Official RSFI/UPRSA Disciplines']
  },
  {
    category: 'Senior (Above 18)' as AgeCategory,
    minAge: 18,
    maxAge: 35,
    cutoffDescription: 'Born on or before 31st Dec 2008',
    disciplines: ['All Official RSFI/UPRSA Disciplines']
  },
  {
    category: 'Masters (Above 35)' as AgeCategory,
    minAge: 35,
    maxAge: 99,
    cutoffDescription: 'Skaters aged 35 years and above (Born on or before 31st Dec 1991)',
    disciplines: ['Speed Skating (Quad & Inline)', 'Inline Freestyle', 'Roller Hockey', 'Marathon']
  }
];

export const DISCIPLINES_LIST: { name: DisciplineType; description: string; icon: string; distanceTypes: string[] }[] = [
  {
    name: 'Speed Skating (Quad)',
    description: 'Traditional 4-wheel double-action truck skates competing in short and long distance track and road races.',
    icon: 'zap',
    distanceTypes: ['200m Time Trial', '500m Rink Race', '1000m Rink Race', '1500m Road Race', '3000m Elimination']
  },
  {
    name: 'Speed Skating (Inline)',
    description: 'High-speed inline speed skates (3 or 4 wheels 90mm-125mm) competing in banked tracks, road courses and marathons.',
    icon: 'gauge',
    distanceTypes: ['200m Dual Time Trial', '500m+D Sprint', '1000m Sprint', '10,000m Elimination/Points', '42km Marathon']
  },
  {
    name: 'Inline Freestyle',
    description: 'Technical agility competitions including Classic Slalom, Speed Slalom, Battle Slalom, Free Jump, and Slides.',
    icon: 'sparkles',
    distanceTypes: ['Speed Slalom (KO)', 'Classic Slalom (Music Routine)', 'Battle Slalom', 'Free Jump', 'Slides']
  },
  {
    name: 'Roller Freestyle',
    description: 'Acrobatic street, park, bowl and vert ramp performances showcasing air tricks, grinds, and flips.',
    icon: 'flame',
    distanceTypes: ['Park Runs', 'Street Course', 'Bowl Jam', 'Vert Ramp Best Trick']
  },
  {
    name: 'Artistic Skating',
    description: 'Figure skating on roller skates featuring Figure, Free Skating, Solo Dance, Couple Dance, and Precision Show Groups.',
    icon: 'award',
    distanceTypes: ['Figure Compulsory', 'Free Skating Short & Long Program', 'Solo Dance', 'Show Group Large/Small']
  },
  {
    name: 'Roller Hockey',
    description: 'Traditional quad-skate team sport played with curved wood sticks and hard ball in enclosed rinks.',
    icon: 'shield',
    distanceTypes: ['State Championship League Matches', 'Knockout Tournament']
  },
  {
    name: 'Inline Hockey',
    description: 'Fast-paced inline hockey using puck and hockey gear on sport-court or concrete surfaces.',
    icon: 'activity',
    distanceTypes: ['Inter-District Tournament Matches']
  },
  {
    name: 'Skateboarding',
    description: 'Olympic skate discipline encompassing Street course obstacles (rails, stairs, ledges) and Park bowl terrain.',
    icon: 'compass',
    distanceTypes: ['Street 2-Run + 5-Trick Format', 'Park 3-Run Format']
  },
  {
    name: 'Roller Derby',
    description: 'Contact sport played by two teams of five roller skaters skating in the same direction around a track.',
    icon: 'users',
    distanceTypes: ['Flat Track Invitational Jam Matches']
  },
  {
    name: 'Alpine / Downhill',
    description: 'Gravity-driven downhill racing on asphalt roads and slalom gates testing maximum velocity and precision.',
    icon: 'trending-up',
    distanceTypes: ['Slalom Gates Run', 'Giant Slalom', 'Downhill Speed Trial']
  }
];

export const DISCIPLINES = DISCIPLINES_LIST.map((d, idx) => ({
  id: `disc-${idx + 1}`,
  name: d.name,
  description: d.description,
  icon: d.icon,
  distanceTypes: d.distanceTypes
}));

export const AGE_CATEGORIES_2026 = AGE_CATEGORIES_INFO;

export const UP_DISTRICTS_DATA: District[] = [
  {
    id: 'dist-lko',
    name: 'Lucknow',
    zone: 'Central',
    secretaryName: 'R. K. Srivastava',
    secretaryPhone: '+91 94150 11223',
    secretaryEmail: 'lucknow.roller@gmail.com',
    officeAddress: 'K.D. Singh Babu Stadium, Hazratganj, Lucknow',
    affiliatedYear: 1988,
    clubsCount: 14,
    skatersCount: 340,
    status: 'Active'
  },
  {
    id: 'dist-gbn',
    name: 'Gautam Buddha Nagar (Noida)',
    zone: 'Western',
    secretaryName: 'Amitabh Saxena',
    secretaryPhone: '+91 98180 54321',
    secretaryEmail: 'noida.skating@gmail.com',
    officeAddress: 'Noida Stadium, Sector 21-A, Noida',
    affiliatedYear: 1998,
    clubsCount: 18,
    skatersCount: 520,
    status: 'Active'
  },
  {
    id: 'dist-gzb',
    name: 'Ghaziabad',
    zone: 'Western',
    secretaryName: 'Manish Tyagi',
    secretaryPhone: '+91 98112 33445',
    secretaryEmail: 'ghaziabad.rollersports@gmail.com',
    officeAddress: 'Mahamaya Sports Stadium, Ghaziabad',
    affiliatedYear: 1995,
    clubsCount: 12,
    skatersCount: 410,
    status: 'Active'
  },
  {
    id: 'dist-knp',
    name: 'Kanpur Nagar',
    zone: 'Central',
    secretaryName: 'Sanjay Awasthi',
    secretaryPhone: '+91 94501 88990',
    secretaryEmail: 'kanpur.skating@gmail.com',
    officeAddress: 'Green Park Stadium, Kanpur',
    affiliatedYear: 1989,
    clubsCount: 10,
    skatersCount: 290,
    status: 'Active'
  },
  {
    id: 'dist-vns',
    name: 'Varanasi',
    zone: 'Eastern',
    secretaryName: 'Pradeep Tripathi',
    secretaryPhone: '+91 94152 77665',
    secretaryEmail: 'varanasi.rollersports@gmail.com',
    officeAddress: 'Dr. Sampurnanand Sports Stadium, Sigra, Varanasi',
    affiliatedYear: 1992,
    clubsCount: 8,
    skatersCount: 215,
    status: 'Active'
  },
  {
    id: 'dist-agr',
    name: 'Agra',
    zone: 'Western',
    secretaryName: 'Devendra Yadav',
    secretaryPhone: '+91 98370 44556',
    secretaryEmail: 'agra.rollerskating@gmail.com',
    officeAddress: 'Eklavya Sports Stadium, Agra',
    affiliatedYear: 1991,
    clubsCount: 9,
    skatersCount: 230,
    status: 'Active'
  },
  {
    id: 'dist-pry',
    name: 'Prayagraj',
    zone: 'Eastern',
    secretaryName: 'Anil Kumar Shukla',
    secretaryPhone: '+91 94153 99887',
    secretaryEmail: 'prayagraj.skate@gmail.com',
    officeAddress: 'Madan Mohan Malviya Stadium, Prayagraj',
    affiliatedYear: 1990,
    clubsCount: 7,
    skatersCount: 190,
    status: 'Active'
  },
  {
    id: 'dist-mrt',
    name: 'Meerut',
    zone: 'Western',
    secretaryName: 'Vipin Sirohi',
    secretaryPhone: '+91 98970 12345',
    secretaryEmail: 'meerut.rollersports@gmail.com',
    officeAddress: 'Kailash Prakash Sports Stadium, Meerut',
    affiliatedYear: 1993,
    clubsCount: 11,
    skatersCount: 280,
    status: 'Active'
  },
  {
    id: 'dist-bly',
    name: 'Bareilly',
    zone: 'Western',
    secretaryName: 'Sunil Rastogi',
    secretaryPhone: '+91 94120 66778',
    secretaryEmail: 'bareilly.skate@gmail.com',
    officeAddress: 'Sports Stadium, Civil Lines, Bareilly',
    affiliatedYear: 1996,
    clubsCount: 6,
    skatersCount: 145,
    status: 'Active'
  },
  {
    id: 'dist-gkp',
    name: 'Gorakhpur',
    zone: 'Eastern',
    secretaryName: 'Harish Chandra Roy',
    secretaryPhone: '+91 94158 33221',
    secretaryEmail: 'gorakhpur.roller@gmail.com',
    officeAddress: 'Regional Sports Stadium, Gorakhpur',
    affiliatedYear: 1997,
    clubsCount: 5,
    skatersCount: 130,
    status: 'Active'
  },
  {
    id: 'dist-alg',
    name: 'Aligarh',
    zone: 'Western',
    secretaryName: 'Dr. Mohd. Tariq',
    secretaryPhone: '+91 94122 55667',
    secretaryEmail: 'aligarh.rollersports@gmail.com',
    officeAddress: 'AMU Sports Complex, Aligarh',
    affiliatedYear: 1999,
    clubsCount: 6,
    skatersCount: 160,
    status: 'Active'
  },
  {
    id: 'dist-mbd',
    name: 'Moradabad',
    zone: 'Western',
    secretaryName: 'Ritesh Bhatnagar',
    secretaryPhone: '+91 98371 88223',
    secretaryEmail: 'moradabad.skating@gmail.com',
    officeAddress: 'Sonakpur Stadium, Moradabad',
    affiliatedYear: 2001,
    clubsCount: 5,
    skatersCount: 120,
    status: 'Active'
  }
];

export const UP_CLUBS_DATA: Club[] = [
  {
    id: 'club-01',
    name: 'Noida Roller Skating Academy',
    district: 'Gautam Buddha Nagar (Noida)',
    headCoach: 'Coach Tarun Sharma (NIS Certified)',
    coachPhone: '+91 98180 11223',
    coachEmail: 'tarun.noidaskate@gmail.com',
    venue: 'Sector 21-A Banked Track, Noida',
    disciplines: ['Speed Skating (Inline)', 'Speed Skating (Quad)', 'Inline Freestyle'],
    establishedYear: 2008,
    skatersCount: 145,
    status: 'Active'
  },
  {
    id: 'club-02',
    name: 'Awadh Roller Sports Club',
    district: 'Lucknow',
    headCoach: 'Coach Rajesh Verma (State Awardee)',
    coachPhone: '+91 94150 99881',
    coachEmail: 'awadh.skaters@gmail.com',
    venue: 'LDA Colony Skating Rink, Kanpur Road, Lucknow',
    disciplines: ['Speed Skating (Inline)', 'Speed Skating (Quad)', 'Artistic Skating', 'Roller Hockey'],
    establishedYear: 2004,
    skatersCount: 120,
    status: 'Active'
  },
  {
    id: 'club-03',
    name: 'Indirapuram Speed Skating Club',
    district: 'Ghaziabad',
    headCoach: 'Coach Deepak Chaudhary',
    coachPhone: '+91 98115 66778',
    coachEmail: 'indirapuram.skate@gmail.com',
    venue: 'Swarn Jayanti Park Rink, Indirapuram',
    disciplines: ['Speed Skating (Inline)', 'Inline Freestyle', 'Skateboarding'],
    establishedYear: 2012,
    skatersCount: 110,
    status: 'Active'
  },
  {
    id: 'club-04',
    name: 'Ganga City Skaters Club',
    district: 'Kanpur Nagar',
    headCoach: 'Coach Vikas Nigam',
    coachPhone: '+91 94503 44556',
    coachEmail: 'ganga.skaters@gmail.com',
    venue: 'Green Park Banked Synthetic Rink, Kanpur',
    disciplines: ['Speed Skating (Quad)', 'Speed Skating (Inline)', 'Roller Hockey'],
    establishedYear: 2006,
    skatersCount: 95,
    status: 'Active'
  },
  {
    id: 'club-05',
    name: 'Kashi Roller Skating Academy',
    district: 'Varanasi',
    headCoach: 'Coach Arvind Singh',
    coachPhone: '+91 94152 11990',
    coachEmail: 'kashi.skaters@gmail.com',
    venue: 'Sampurnanand Stadium Rink, Sigra, Varanasi',
    disciplines: ['Speed Skating (Quad)', 'Inline Freestyle'],
    establishedYear: 2010,
    skatersCount: 80,
    status: 'Active'
  },
  {
    id: 'club-06',
    name: 'Taj City Skating Club',
    district: 'Agra',
    headCoach: 'Coach Sunil Verma',
    coachPhone: '+91 98370 88776',
    coachEmail: 'tajcity.skating@gmail.com',
    venue: 'Eklavya Stadium Rink, Agra',
    disciplines: ['Speed Skating (Inline)', 'Speed Skating (Quad)', 'Artistic Skating'],
    establishedYear: 2009,
    skatersCount: 75,
    status: 'Active'
  }
];

export interface AgeCategoryCalculation {
  category: AgeCategory;
  ageAsOfDec31: number;
  valid: boolean;
  cutoffDescription: string;
}

export const calculate2026AgeCategory = (dobString: string): AgeCategoryCalculation & { toString: () => string } => {
  if (!dobString) {
    return Object.assign(
      {
        category: 'Senior (Above 18)' as AgeCategory,
        ageAsOfDec31: 18,
        valid: false,
        cutoffDescription: 'Please enter Date of Birth'
      },
      { toString: () => 'Senior (Above 18)' }
    );
  }

  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) {
    return Object.assign(
      {
        category: 'Senior (Above 18)' as AgeCategory,
        ageAsOfDec31: 18,
        valid: false,
        cutoffDescription: 'Invalid Date of Birth'
      },
      { toString: () => 'Senior (Above 18)' }
    );
  }

  const birthYear = dob.getFullYear();
  const ageAsOfDec31 = 2026 - birthYear;

  let category: AgeCategory = 'Senior (Above 18)';
  let cutoffDescription = 'Born on or before 31st Dec 2008';

  if (birthYear >= 2020) {
    category = 'Tots (Under 6)';
    cutoffDescription = 'Born on or after 1st Jan 2020';
  } else if (birthYear >= 2018) {
    category = 'Minis (6 to 8)';
    cutoffDescription = 'Born 1st Jan 2018 to 31st Dec 2019';
  } else if (birthYear >= 2016) {
    category = 'Cadet (8 to 10)';
    cutoffDescription = 'Born 1st Jan 2016 to 31st Dec 2017';
  } else if (birthYear >= 2014) {
    category = 'Cadet (10 to 12)';
    cutoffDescription = 'Born 1st Jan 2014 to 31st Dec 2015';
  } else if (birthYear >= 2012) {
    category = 'Sub-Junior (12 to 15)';
    cutoffDescription = 'Born 1st Jan 2012 to 31st Dec 2013';
  } else if (birthYear >= 2009) {
    category = 'Junior (15 to 18)';
    cutoffDescription = 'Born 1st Jan 2009 to 31st Dec 2011';
  } else if (birthYear >= 1992) {
    category = 'Senior (Above 18)';
    cutoffDescription = 'Born on or before 31st Dec 2008';
  } else {
    category = 'Masters (Above 35)';
    cutoffDescription = 'Skaters aged 35 years and above (Born on or before 31st Dec 1991)';
  }

  return Object.assign(
    {
      category,
      ageAsOfDec31: Math.max(0, ageAsOfDec31),
      valid: true,
      cutoffDescription
    },
    { toString: () => category }
  );
};

export const DETERMINISTIC_KNOWLEDGE_RESOLVER = (query: string): string | null => {
  const q = query.toLowerCase().trim();

  if (q.includes('age') || q.includes('category') || q.includes('cutoff') || q.includes('date of birth') || q.includes('dob') || q.includes('born')) {
    return `Official RSFI / UPRSA Age Categories (2026 Competition Year):
• **Tots (Under 6)**: Born on or after 1st Jan 2020
• **Minis (6 to 8)**: Born 1st Jan 2018 to 31st Dec 2019
• **Cadet (8 to 10)**: Born 1st Jan 2016 to 31st Dec 2017
• **Cadet (10 to 12)**: Born 1st Jan 2014 to 31st Dec 2015
• **Sub-Junior (12 to 15)**: Born 1st Jan 2012 to 31st Dec 2013
• **Junior (15 to 18)**: Born 1st Jan 2009 to 31st Dec 2011
• **Senior (Above 18)**: Born on or before 31st Dec 2008
• **Masters (Above 35)**: Skaters aged 35 years and above.

*Note: Age is calculated strictly as per the official birth certificate & Aadhaar verification.*`;
  }

  if (q.includes('point') || q.includes('score') || q.includes('ranking') || q.includes('gold') || q.includes('silver') || q.includes('bronze')) {
    return `Official UPRSA Championship Points System:
- **Gold Medal (1st Place)**: 5 Points
- **Silver Medal (2nd Place)**: 3 Points
- **Bronze Medal (3rd Place)**: 1 Point

These points determine:
1. Individual Skater Rankings
2. District Championship Trophy Standings
3. Affiliated Club Points Table`;
  }

  if (q.includes('register') || q.includes('registration') || q.includes('annual fee') || q.includes('document') || q.includes('aadhaar')) {
    return `UPRSA Skater Registration Process:
1. **Mandatory Documents**:
   - Skater Passport Photo (White background)
   - Date of Birth Certificate (Municipal / Hospital issued)
   - Aadhaar Card
   - Medical Fitness Certificate from registered MBBS Doctor
   - School / Club Affiliation Letter
2. **Annual Affiliation Fee**: ₹500 per competition year (Payable via UPI / Bank Transfer).
3. **Digital ID Card**: Issued immediately upon district and state secretariat approval.
4. **Verification**: All verified skaters can participate in District, State, and RSFI National Championships.`;
  }

  if (q.includes('certificate') || q.includes('verify') || q.includes('qr')) {
    return `UPRSA Certificate Verification:
Every official UPRSA certificate (Merit, Participation, Official) carries a unique QR Code and a secure Verification Code (e.g., UPRSA/CERT/2026/00142).
- You can verify any certificate directly on this portal under **Verify Certificate**.
- It displays recipient name, tournament, event, discipline, position, and validity seal.`;
  }

  if (q.includes('contact') || q.includes('office') || q.includes('secretary') || q.includes('president') || q.includes('helpline')) {
    return `Uttar Pradesh Roller Sports Association (UPRSA) Head Office:
- **Address**: UP Roller Sports Arena, Sector-G, LDA Colony, Kanpur Road, Lucknow, UP - 226012
- **Phone**: +91 522 2439812, +91 94150 21989
- **Email**: uprsa.official@gmail.com
- **President**: Dr. Akhilesh Chandra Sharma
- **Secretary General**: Rajesh Kumar Singh`;
  }

  if (q.includes('discipline') || q.includes('events') || q.includes('speed') || q.includes('freestyle') || q.includes('hockey')) {
    return `Official RSFI / UPRSA Disciplines:
1. Speed Skating (Quad)
2. Speed Skating (Inline)
3. Inline Freestyle (Speed Slalom, Classic, Battle, Slides)
4. Roller Freestyle (Park, Street, Bowl)
5. Artistic Skating (Figure, Solo Dance, Show Group)
6. Roller Hockey (Quad)
7. Inline Hockey
8. Skateboarding (Street & Park)
9. Roller Derby
10. Alpine & Downhill`;
  }

  return null;
};
