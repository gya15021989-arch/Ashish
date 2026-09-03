export interface DetailedDiscipline {
  id: string;
  number: number;
  name: string;
  hindiName: string;
  recognitionBadge: string;
  imageUrl: string;
  description: string;
  hindiDescription: string;
  equipmentSpecs: string;
  rinkStandard: string;
  events: string[];
  rules: {
    governingBody: string;
    ageCategories: string;
    safetyGear: string;
    scoringFormat: string;
    wheelLimit: string;
  };
}

export const ALL_14_OFFICIAL_DISCIPLINES: DetailedDiscipline[] = [
  // 1. INLINE SPEED
  {
    id: 'inline-speed',
    number: 1,
    name: 'INLINE SPEED',
    hindiName: 'इनलाइन स्पीड स्केटिंग',
    recognitionBadge: 'WORLD SKATE & WORLD GAMES / RSFI RECOGNIZED',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    description: 'Inline Speed Skating is the flagship speed discipline featuring precision-engineered inline skates (3 or 4 wheels, 90mm to 110mm / 125mm). Skaters compete in individual sprints, time trials, relays, and long-distance elimination races on 200m parabolic banked tracks and closed road circuits.',
    hindiDescription: 'इनलाइन स्पीड स्केटिंग फ्लैगशिप गति विधा है जिसमें 90 मिमी से 110/125 मिमी के 3 या 4 पहियों वाले इनलाइन स्केट्स का उपयोग होता है। 200 मीटर बैंक्ड ट्रैक और रोड सर्किट पर स्प्रिंट, टाइम ट्रायल और एलिमिनेशन रेस आयोजित की जाती हैं।',
    equipmentSpecs: 'Carbon fiber speed boots, extruded aluminium/magnesium frame, 3x110mm or 4x100mm/110mm polyurethane speed wheels.',
    rinkStandard: '200m Banked Track with Vesmaco / Synthetic surface or certified asphalt road course.',
    events: [
      '200m Dual Time Trial',
      '500m + D Sprint',
      '1000m Sprint',
      '3000m Relay',
      '10,000m Points & Elimination',
      '42km Marathon'
    ],
    rules: {
      governingBody: 'World Skate Speed Technical Committee & RSFI Speed Board',
      ageCategories: 'Tots (U-6), Minis (6-8), Cadet (8-10, 10-12), Sub-Junior (12-15), Junior (15-18), Senior (18+), Masters (35+)',
      safetyGear: 'Certified Aero Speed Helmet (Mandatory), Skin-tight Aero Race Suit, Wrist Guards (for cadet categories)',
      scoringFormat: 'Electronic Transponder Timing with High-Speed Photo Finish (1/1000th sec precision)',
      wheelLimit: 'Max 90mm for Minis, 100mm for Cadets, 110mm for Juniors/Seniors on track; 125mm for Marathon'
    }
  },

  // 2. INLINE FREESTYLE
  {
    id: 'inline-freestyle',
    number: 2,
    name: 'INLINE FREESTYLE',
    hindiName: 'इनलाइन फ्रीस्टाइल स्केटिंग',
    recognitionBadge: 'WORLD SKATE & ASIAN GAMES / RSFI OFFICIAL',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    description: 'Inline Freestyle includes slalom, pair slalom, speed slalom, slides, jumps and classic slalom. Skaters demonstrate agility, control, rhythm and technical mastery through artistic and competitive routines.',
    hindiDescription: 'इनलाइन फ्रीस्टाइल में स्लैलम, स्पीड स्लैलम, स्लाइड, फ्री जंप और क्लासिक स्लैलम शामिल हैं। स्केटर तकनीकी महारत, चपलता और संतुलन का शानदार प्रदर्शन करते हैं।',
    equipmentSpecs: 'Urban/Slalom boots, rockered or flat frames, 80mm/76mm wheels and performance bearings.',
    rinkStandard: 'Flat smooth surface, minimum 20m × 40m cone-based layout as per RSFI rules.',
    events: [
      'Classic Slalom',
      'Pair Slalom',
      'Speed Slalom',
      'Slide',
      'Jump',
      'Battle Slalom'
    ],
    rules: {
      governingBody: 'World Skate Inline Freestyle Technical Committee & RSFI',
      ageCategories: 'Minis (6-8), Cadet (8-10, 10-12), Sub-Junior (12-15), Junior (15-18), Senior (18+)',
      safetyGear: 'Certified Helmets for Jump and Speed Slalom, Knee and Wrist Guards recommended',
      scoringFormat: 'Official World Skate Slalom Scoring System (Technical Tricks + Artistic Music Sync Score)',
      wheelLimit: 'Rockered 4-wheel setup: 76mm-80mm-80mm-76mm or 3x110mm for specialized Speed Slalom'
    }
  },

  // 3. QUAD SPEED
  {
    id: 'quad-speed',
    number: 3,
    name: 'QUAD SPEED',
    hindiName: 'पारंपरिक क्वॉड स्पीड स्केटिंग',
    recognitionBadge: 'TRADITIONAL RSFI CORE CHAMPIONSHIP',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    description: 'Traditional 4-wheel quad speed skating tests raw torque, cornering technique, and pure leg power on flat and banked circuits across all age divisions from Tots (Under 6) to Masters.',
    hindiDescription: 'पारंपरिक 4-पहिया क्वॉड स्पीड स्केटिंग में सभी आयु वर्गों के स्केटर गति, संतुलन और शक्ति के साथ फ्लैट और बैंक्ड ट्रैक पर रेस करते हैं।',
    equipmentSpecs: 'Low-cut leather/carbon speed quad boots, double-action aluminum alloy precision trucks, 62mm-70mm high-rebound urethane quad wheels.',
    rinkStandard: 'Standard 80m–100m flat oval quad rink or certified 200m banked track.',
    events: [
      '200m Time Trial',
      '500m Rink Race',
      '1000m Rink Race',
      '1500m Road Race',
      '3000m Elimination',
      'Squad Relay'
    ],
    rules: {
      governingBody: 'RSFI Quad Speed Technical Committee & UPRSA Board',
      ageCategories: 'Tots (U-6), Minis (6-8), Cadet (8-10, 10-12), Sub-Junior (12-15), Junior (15-18), Senior (18+), Masters (35+)',
      safetyGear: 'Hard-Shell Crash Helmet (Compulsory), Protective Uniform with District Colorway',
      scoringFormat: 'Electronic Sensor Timing / Photo Finish with False Start Detection',
      wheelLimit: 'Standard 4-wheel quad configuration with maximum wheel diameter of 70mm and width 44mm'
    }
  },

  // 4. SPEED INLINE (TRACK & ROAD)
  {
    id: 'speed-inline-road',
    number: 4,
    name: 'SPEED INLINE (TRACK & ROAD)',
    hindiName: 'स्पीड इनलाइन (ट्रैक व रोड रेसिंग)',
    recognitionBadge: 'WORLD SKATE & NATIONAL GAMES SPEED RACING',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80',
    description: 'Endurance and sprint inline racing specifically calibrated for open-road marathons, 100m straight road drag sprints, and circuit point races pushing speeds over 50 km/h.',
    hindiDescription: 'ओपन रोड मैराथन, 100 मीटर ड्रैग स्प्रिंट और सर्किट रेस के लिए हाई-स्पीड इनलाइन रेसिंग जहां 50 किमी/घंटा से अधिक गति दर्ज होती है।',
    equipmentSpecs: 'Custom molded carbon monocoque boots, 3x125mm long wheelbase road frames, high-elasticity dual-density racing wheels.',
    rinkStandard: 'Closed 400m-600m asphalt road circuit or certified 100m straight sprint drag strip.',
    events: [
      '100m Road Sprint',
      '1 Lap Road Sprint',
      '10,000m Points Race (Road)',
      '15,000m Elimination (Road)',
      '42.195km Full Marathon',
      '21km Half Marathon'
    ],
    rules: {
      governingBody: 'World Skate Technical Committee & RSFI Road Racing Commission',
      ageCategories: 'Sub-Junior (12-15), Junior (15-18), Senior (18+), Masters Open',
      safetyGear: 'Aerodynamic Safety Helmet, High-Visibility Race Bib Number, Ankle Timing Transponder',
      scoringFormat: 'Points per Lap Bell Lap Sprint + Final Placement Points System',
      wheelLimit: '125mm maximum wheel diameter for Marathon and Road Open divisions'
    }
  },

  // 5. ARTISTIC ROLLER SKATING
  {
    id: 'artistic-skating',
    number: 5,
    name: 'ARTISTIC ROLLER SKATING',
    hindiName: 'आर्टिस्टिक रोलर स्केटिंग',
    recognitionBadge: 'WORLD SKATE & WORLD GAMES ARTISTIC',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    description: 'Combines athletic athleticism with theatrical elegance across Free Skating, Figures, Solo Dance, Couple Dance, Pairs, and Synchronized Show Groups judged on technical execution and artistic score.',
    hindiDescription: 'कलात्मक और तकनीकी उत्कृष्टता का संगम, जिसमें फ्री स्केटिंग, सोलो डांस, और शो ग्रुप्स शामिल हैं जो संगीत और कोरियोग्राफी पर आंके जाते हैं।',
    equipmentSpecs: 'Reinforced high-top artistic boots, click-action steering precision plates with toe stops, 57mm-63mm roll-line artistic wheels.',
    rinkStandard: '20m × 40m or 25m × 50m smooth wooden parquet or treated concrete indoor arena.',
    events: [
      'Figures Compulsory',
      'Free Skating Short Program',
      'Free Skating Long Program',
      'Solo Dance',
      'Couple Dance',
      'Quartet & Show Groups'
    ],
    rules: {
      governingBody: 'World Skate Artistic Technical Committee & RSFI Artistic Committee',
      ageCategories: 'Minis (6-8), Cadet (8-10, 10-12), Sub-Junior (12-15), Junior (15-18), Senior (18+)',
      safetyGear: 'Official Regulation Costume complying with World Skate Decency & Elegance Code',
      scoringFormat: 'Rollart Digital Judging System (Technical Element Score + Component Artistic Score)',
      wheelLimit: 'Quad artistic wheels with durometer ranging 45D to 60D depending on floor grip'
    }
  },

  // 6. ROLLER FREESTYLE (STREET & PARK)
  {
    id: 'roller-freestyle',
    number: 6,
    name: 'ROLLER FREESTYLE (STREET & PARK)',
    hindiName: 'रोलर फ्रीस्टाइल (स्ट्रीट व पार्क)',
    recognitionBadge: 'WORLD SKATE URBAN GAMES & RSFI SANCTIONED',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    description: 'Acrobatic aggressive roller skating executed on street obstacles, skateparks, bowls, and halfpipes, featuring grinds, aerials, transfers, spins, and wall-rides.',
    hindiDescription: 'स्ट्रीट, पार्क, बाउल और हाफपाइप पर कलाबाजी और ग्राइंड ट्रिक्स की एग्रेसिव स्केटिंग।',
    equipmentSpecs: 'Hard-shell aggressive boots with soul plates, UFS anti-rocker/flat grind frames, 58mm-64mm street wheels, grind inserts.',
    rinkStandard: 'World Skate certified Skatepark with street course (ledges, rails, stairs) and transitions/bowl.',
    events: [
      'Street Course Best Run',
      'Park Bowl Jam',
      'Vert Ramp Best Trick',
      'Highest Air',
      'Mini-Ramp Session'
    ],
    rules: {
      governingBody: 'World Skate Roller Freestyle Technical Commission',
      ageCategories: 'Cadet (10-12), Sub-Junior (12-15), Junior (15-18), Senior (18+)',
      safetyGear: 'Full Multi-Impact Certified Helmet, Reinforced Heavy Duty Knee and Elbow Pads',
      scoringFormat: 'Overall Impression (OI) Scoring based on Difficulty, Amplitude, Style, and Flow',
      wheelLimit: 'Maximum 64mm wheel diameter with anti-rocker middle grind block wheels'
    }
  },

  // 7. ROLLER HOCKEY (RINK HOCKEY / QUAD)
  {
    id: 'roller-hockey',
    number: 7,
    name: 'ROLLER HOCKEY (RINK HOCKEY / QUAD)',
    hindiName: 'रोलर हॉकी (क्वॉड रिंक हॉकी)',
    recognitionBadge: 'WORLD SKATE & RSFI TRADITIONAL TEAM SPORT',
    imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&w=1200&q=80',
    description: 'High-octane non-contact team game played on quad roller skates with short curved wooden sticks and a compressed hard rubber ball in enclosed barrier rinks.',
    hindiDescription: 'क्वॉड स्केट्स पर खेली जाने वाली पारंपरिक टीम खेल विधा जिसमें स्टिक और हार्ड बॉल के साथ विरोधी गोल पर प्रहार किया जाता है।',
    equipmentSpecs: 'Traditional leather hockey quad boots, reinforced wooden composite sticks, leg pads, knee guards, glove gauntlets, and neck protectors.',
    rinkStandard: '20m × 40m enclosed rink with rounded corner barriers (1m height) and wooden or synthetic surface.',
    events: [
      'Sub-Junior State Championship',
      'Junior Inter-District Trophy',
      'Senior Men State League',
      'Senior Women State Championship',
      'UPRSA Inter-Club Cup'
    ],
    rules: {
      governingBody: 'World Skate Rink Hockey Technical Committee & RSFI Hockey Board',
      ageCategories: 'Cadet (8-12), Sub-Junior (12-15), Junior (15-18), Senior (18+)',
      safetyGear: 'Goalkeeper Full Armored Body Gear, Helmet with Face Cage, Player Shin/Knee Guards and Gloves',
      scoringFormat: 'Two 25-minute halves with stopped clock; Team with highest aggregate goals wins',
      wheelLimit: 'Regulation quad hockey skates with standard toe stops used exclusively for braking'
    }
  },

  // 8. INLINE HOCKEY
  {
    id: 'inline-hockey',
    number: 8,
    name: 'INLINE HOCKEY',
    hindiName: 'इनलाइन हॉकी',
    recognitionBadge: 'WORLD SKATE & WORLD GAMES TEAM SPORT',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    description: 'Fast-flowing, non-stop hockey played on inline skates using lightweight composite ice-hockey style sticks and specialized plastic sliding pucks on indoor tile surfaces.',
    hindiDescription: 'इनलाइन स्केट्स और कम्पोजिट स्टिक के साथ खेली जाने वाली तेज गति की पक्की हॉकी विधा जिसमें प्लास्टिक स्लाइडिंग पक का उपयोग होता है।',
    equipmentSpecs: 'Stiff inline hockey boots with Hi-Lo rocker chassis, composite carbon sticks, full-face cage helmets, padded pants, shin guards, elbow & chest protection.',
    rinkStandard: '25m-30m × 50m-60m Sport Court plastic tile or smooth polyurethane surface with acrylic glass dashers.',
    events: [
      'Junior State Inline Hockey Cup',
      'Senior State League Tournament',
      'All-UP Open Invitational',
      'Shootout Skills Challenge'
    ],
    rules: {
      governingBody: 'World Skate Inline Hockey Technical Committee & RSFI',
      ageCategories: 'Cadet (10-12), Sub-Junior (12-15), Junior (15-18), Senior (18+)',
      safetyGear: 'HECC/CSA Certified Hockey Helmet with Full Cage or Visor, Mouthguard, Padded Girdle',
      scoringFormat: 'Two 20-minute periods, 4-on-4 plus goaltender fast transition game',
      wheelLimit: 'Hi-Lo 76mm/80mm or 80mm flat indoor grip tile wheels (74A-78A durometer)'
    }
  },

  // 9. SKATEBOARDING (STREET & PARK)
  {
    id: 'skateboarding',
    number: 9,
    name: 'SKATEBOARDING (STREET & PARK)',
    hindiName: 'स्केटबोर्डिंग (स्ट्रीट व पार्क)',
    recognitionBadge: 'OLYMPIC GAMES & WORLD SKATE / RSFI DISCIPLINE',
    imageUrl: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=1200&q=80',
    description: 'Olympic medal discipline where riders navigate street courses and deep bowl parks performing ollies, kickflips, grinds, air tricks, and handrail slides.',
    hindiDescription: 'ओलंपिक खेल विधा जिसमें स्ट्रीट कोर्स और पार्क बाउल में स्केटबोर्डिंग ट्रिक्स, किकफ्लिप और ग्राइंड्स का प्रदर्शन होता है।',
    equipmentSpecs: '7-ply Canadian maple decks, high-grade aluminium trucks, 52mm-56mm street/park urethane wheels (99A-101A), ABEC-9 bearings.',
    rinkStandard: 'Olympic standard concrete street plaza (rails, stairs, euro-gaps) and 2m-3.5m deep transitional bowl/park.',
    events: [
      'Street 2-Run + 5-Trick Format (Olympic)',
      'Park 3-Run Format (Best Run Counts)',
      'Game of S.K.A.T.E',
      'Highest Ollie Contest',
      'Best Trick Handrail'
    ],
    rules: {
      governingBody: 'World Skate Skateboarding Commission & Olympic Technical Committee',
      ageCategories: 'Cadet (10-12), Sub-Junior (12-15), Junior (15-18), Senior (18+ Open)',
      safetyGear: 'ASTM Certified Skate Helmet (Compulsory under 18), Knee/Elbow pads for Park bowl',
      scoringFormat: 'Olympic 2/5/3 Scoring: 2 45-second runs + 5 individual trick attempts (Top 4 scores sum)',
      wheelLimit: 'Standard skateboard wheel dimensions 50mm to 60mm high-rebound hard urethane'
    }
  },

  // 10. ROLLER DERBY
  {
    id: 'roller-derby',
    number: 10,
    name: 'ROLLER DERBY',
    hindiName: 'रोलर डर्बी',
    recognitionBadge: 'WORLD SKATE OFFICIAL FULL-CONTACT SPORT',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    description: 'Full-contact quad roller sport where two teams race counter-clockwise on a flat oval track. Each team\'s \'Jammer\' scores points by lapping members of the opposing team.',
    hindiDescription: 'क्वॉड स्केट्स पर खेला जाने वाला रणनीतिक फुल-कॉन्टैक्ट टीम खेल जिसमें जैमर विरोधी टीम के सदस्यों को ओवरटेक कर अंक हासिल करता है।',
    equipmentSpecs: 'Durable low-cut derby quad boots, 59mm-62mm grippy derby wheels (88A-95A), heavy-duty kneepads, elbow pads, wrist braces, mouthguard, multi-impact helmet.',
    rinkStandard: 'Regulation 33m × 22m flat oval track marked with rope/tape boundaries on indoor polished floor.',
    events: [
      'State Inter-District Jam Tournament',
      'Senior Women Derby Championship',
      'Mixed Open Invitational Bout',
      'Skills Assessment Jam'
    ],
    rules: {
      governingBody: 'World Skate Roller Derby Technical Committee & WFTDA Alignment',
      ageCategories: 'Junior (15-18), Senior (18+ Adult)',
      safetyGear: 'Mouthguard (Mandatory), Multi-Impact Certified Helmet, Hard-Cap Knee, Elbow & Wrist Guards',
      scoringFormat: 'Two 30-minute periods made of 2-minute "Jams"; 1 point per opposing blocker passed legally',
      wheelLimit: 'Standard quad derby wheels 59mm-62mm diameter with precision aluminum hub'
    }
  },

  // 11. INLINE ALPINE & DOWNHILL
  {
    id: 'alpine-downhill',
    number: 11,
    name: 'INLINE ALPINE & DOWNHILL',
    hindiName: 'इनलाइन अल्पाइन व डाउनहिल',
    recognitionBadge: 'WORLD SKATE & RSFI GRAVITY RACING',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80',
    description: 'High-speed gravity racing on paved mountain passes and steep roadways, weaving through slalom gates or tucking at speeds up to 90 km/h on technical asphalt descents.',
    hindiDescription: 'ढलान वाली पक्की सड़कों पर स्लैलम गेट्स के बीच अत्यधिक गति से इनलाइन रेसिंग जिसमें 90 किमी/घंटा तक की गति हासिल होती है।',
    equipmentSpecs: 'Long 5-wheel downhill frames (5x84mm/90mm) or rigid slalom frames, aerodynamic leather racing suits, carbon knuckle gloves, full-face downhill helmet.',
    rinkStandard: 'Steep asphalt road gradient (8%-15% slope) with padded barrier safety nets on turns and electronic beam timing.',
    events: [
      'Alpine Slalom (Single & Dual Pole)',
      'Giant Slalom (GS)',
      'Downhill Speed Time Trial',
      'Mass Start Downhill Cross'
    ],
    rules: {
      governingBody: 'World Skate Inline Alpine & Downhill Technical Committee (RAD)',
      ageCategories: 'Sub-Junior (12-15), Junior (15-18), Senior (18+)',
      safetyGear: 'Full Face Downhill Helmet, Leather/Kevlar Speed Suit, Carbon-Reinforced Slide Gloves, Back Spine Protector',
      scoringFormat: 'Electronic Timing with 1/1000th second photocell precision across multiple runs',
      wheelLimit: 'Downhill 5-wheel setup (84mm-90mm) or Alpine 4-wheel slalom (100mm-110mm)'
    }
  },

  // 12. SCOOTERING (FREESTYLE PARK & STREET)
  {
    id: 'scootering',
    number: 12,
    name: 'SCOOTERING (FREESTYLE PARK & STREET)',
    hindiName: 'स्कूटरिंग (फ्रीस्टाइल पार्क व स्ट्रीट)',
    recognitionBadge: 'WORLD SKATE & RSFI URBAN DISCIPLINE',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    description: 'Freestyle urban discipline on pro-grade non-folding kick scooters executing tailwhips, barspins, bri-flips, grinds, and high air transfers over mega ramps and boxes.',
    hindiDescription: 'प्रोफेशनल नॉन-फोल्डिंग स्कूटर पर पार्क और स्ट्रीट में कलाबाजी, टेलव्हिप और बारस्पिन ट्रिक्स का रोमांचक प्रदर्शन।',
    equipmentSpecs: 'One-piece forged aluminium alloy deck, chromoly/titanium T-bars, SCS compression clamp, 110mm-120mm aluminium core wheels with 88A PU.',
    rinkStandard: 'Modular or concrete skatepark layout with launch boxes, spines, quarterpipes, flat ledges, and round rails.',
    events: [
      'Street Course Jam',
      'Park 2-Run Overall Format',
      'Best Air & Whip Contest',
      'Mega Box Best Trick'
    ],
    rules: {
      governingBody: 'World Skate Scootering Technical Commission & RSFI',
      ageCategories: 'Cadet (8-12), Sub-Junior (12-15), Junior (15-18), Senior (18+)',
      safetyGear: 'Certified Skate Helmet, Pro Knee Pads, Ankle Protectors and Wrist Wraps',
      scoringFormat: 'Judged on Run Continuity, Trick Difficulty, Amplitude, Variety, and Use of Park Obstacles',
      wheelLimit: 'Standard aluminium core stunt scooter wheels 110mm to 120mm with ABEC-9/11 bearings'
    }
  },

  // 13. SKATECROSS / INLINE CROSS
  {
    id: 'skatecross',
    number: 13,
    name: 'SKATECROSS / INLINE CROSS',
    hindiName: 'स्केटक्रॉस / इनलाइन क्रॉस',
    recognitionBadge: 'WORLD SKATE URBAN ACTION DISCIPLINE',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    description: 'High-octane obstacle course race where 4 skaters launch simultaneously out of a start gate, racing elbow-to-elbow over ramps, tabletops, bank turns, berms, and drops.',
    hindiDescription: '4 स्केटर्स एक साथ बाधाओं, रैंप्स और घुमावों वाले ट्रैक पर रेस लगाते हैं जिसमें पहले 2 फिनिशर अगले राउंड में प्रवेश करते हैं।',
    equipmentSpecs: 'Hard-shell freeride/urban inline boots, extruded 4x80mm / 3x110mm impact-resistant aluminium frames, 85A durable wheels, reinforced knee & elbow armor.',
    rinkStandard: 'Pump-track or custom obstacle obstacle sprint circuit (300m-500m) with berms, wooden kickers, and wave rollers.',
    events: [
      'Individual Qualifying Time Trial',
      '4-Skater Elimination Heats',
      'Quarterfinals & Semifinals',
      'Grand Final Podium Sprint'
    ],
    rules: {
      governingBody: 'World Skate Skatecross Technical Commission & RSFI',
      ageCategories: 'Cadet (10-12), Sub-Junior (12-15), Junior (15-18), Senior (18+)',
      safetyGear: 'Full Face Helmet or Reinforced Skate Helmet, Heavy Knee/Elbow Guards, Gloves with Plastic Sliders',
      scoringFormat: 'Time Trial Seeding followed by 4-cross Knockout Bracket (Top 2 advance each heat)',
      wheelLimit: 'Freeride 4x80mm or 3x110mm setup with high impact resistance'
    }
  },

  // 14. ROLLER FREESTYLE AGGRESSIVE & PUMP TRACK
  {
    id: 'pump-track-vert',
    number: 14,
    name: 'ROLLER FREESTYLE AGGRESSIVE & PUMP TRACK',
    hindiName: 'एग्रेसिव स्केटिंग व पंप ट्रैक',
    recognitionBadge: 'WORLD SKATE ACTION SPORTS & RSFI',
    imageUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
    description: 'Dynamic momentum-based racing and vertical aerial routines on asphalt/modular undulating pump tracks and vert halfpipes, generating pure speed through body compression and pumping.',
    hindiDescription: 'पंप ट्रैक और वर्ट हाफपाइप पर बॉडी मोमेंटम और हाई-एयर एरियल ट्रिक्स की प्रतिस्पर्धा बिना पैडलिंग के स्पीड हासिल करती है।',
    equipmentSpecs: 'Urban composite freestyle skates with shock-absorbing heels, rockered or flat 4x80mm setups, high-impact composite protective gear.',
    rinkStandard: 'All-weather asphalt undulating pump track circuit (150m-300m) with continuous berms, rollers, and doubles.',
    events: [
      'Pump Track Speed Time Trial',
      'Head-to-Head Pursuit Knockout',
      'Vert Halfpipe Championship',
      'Air to Air Big Trick'
    ],
    rules: {
      governingBody: 'World Skate Pump Track & Vert Technical Commission',
      ageCategories: 'Cadet (8-12), Sub-Junior (12-15), Junior (15-18), Senior (18+ Open)',
      safetyGear: 'Multi-Impact Helmet, Pro Hard Knee Caps, Elbow Guards and Wrist Braces',
      scoringFormat: 'Laser Transponder Lap Timing for Pump Track; 100-Point Judges Matrix for Vert Ramp',
      wheelLimit: '80mm-90mm high-rebound wheels with maximum grip for curved berm compression'
    }
  }
];
