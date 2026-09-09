import { AthleteJourneyData } from '../types';

export const INITIAL_FEATURED_ATHLETES: AthleteJourneyData[] = [
  {
    id: 'ath-1',
    name: 'Aarav Sharma',
    hindiName: 'आरव शर्मा',
    district: 'Lucknow',
    discipline: 'Inline Speed Skating (110mm / 3x125)',
    category: 'Junior Men (14 to 17)',
    achievement: 'National Gold Medalist (500m + D Sprint)',
    record: 'State Record: 44.82s (200m Banked Track)',
    medals: '4 🥇 Gold • 1 🥈 Silver',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    tag: 'SPEED RECORD HOLDER',
    regNo: 'UPRSA/2026/LKO/00101',
    dob: '12-Mar-2009',
    age: 17,
    clubName: 'Awadh Speed Skating Academy, KD Singh Babu Stadium',
    coachName: 'Coach R.K. Yadav (NIS Certified)',
    startedYear: 2017,
    bioSummary: 'आरव शर्मा उत्तर प्रदेश के सबसे प्रतिभाशाली और तेज गति के इनलाइन स्प्रिंटर हैं। लखनऊ के केडी सिंह बाबू स्टेडियम की 200 मीटर सिंथेटिक ट्रैक पर अभ्यास करते हुए, उन्होंने 500 मीटर और 1000 मीटर स्प्रिंट में राज्य रिकॉर्ड स्थापित किया है।',
    personalStory: '8 वर्ष की उम्र में जब आरव ने पहली बार क्वाड स्केट्स पहने, तब से ही उनकी गति और संतुलन देखने लायक था। 2021 में इनलाइन प्रोफेशनल 110mm बूट्स पर अपग्रेड करने के बाद, उन्होंने लगातार 4 राज्य चैंपियनशिप जीतीं और 2025 में 63वीं नेशनल रोलर स्केटिंग चैंपियनशिप में स्वर्ण पदक हासिल किया। वह प्रतिदिन सुबह 4:30 बजे 25 किमी रोड स्ट्राइड और शाम को 2 घंटे हाई-इंटेंसिटी ट्रैक लैप्स करते हैं।',
    specialty: 'एक्सप्लोसिव कॉर्नरिंग, 500m स्प्रिंट में अंतिम 100 मीटर की किक और एरोडायनामिक ड्राफ्टिंग।',
    trainingRegime: 'सप्ताह में 6 दिन (प्रतिदिन 4.5 घंटे): सुबह कार्डियो व प्लायोमेट्रिक्स, शाम को बैंक ट्रैक इंटरवल्स।',
    gearSetup: 'Bont Custom Carbon Boots, 3x125mm Inline Speed Wheels, Ceramic Bearings (9-ball).',
    quote: 'हर लैप में हवा को चीरते हुए आगे बढ़ना ही मेरा जुनून है। मेरा सपना विश्व चैंपियनशिप में तिरंगा फहराना है।',
    careerMilestones: [
      {
        year: '2026',
        event: '36th UP State Roller Skating Championship (Lucknow)',
        level: 'State',
        result: '🥇 स्वर्ण पदक (Gold)',
        timingOrScore: '44.82s (नया राज्य रिकॉर्ड)',
        highlight: '500m + D स्प्रिंट में अभूतपूर्व समय के साथ राज्य खिताब बरकरार रखा।'
      },
      {
        year: '2025',
        event: '63rd RSFI National Championship (Mohali)',
        level: 'National',
        result: '🥇 राष्ट्रीय स्वर्ण (National Champion)',
        timingOrScore: '45.10s',
        highlight: 'उत्तर प्रदेश का प्रतिनिधित्व करते हुए जूनियर बालक वर्ग में गोल्ड मेडल जीता।'
      },
      {
        year: '2024',
        event: 'North Zone Inter-State Speed Meet',
        level: 'State',
        result: '🥇 2 Gold Medals',
        timingOrScore: '1000m: 1:31.20s',
        highlight: '1000m और 500m दोनों स्पर्धाओं में शीर्ष स्थान हासिल किया।'
      },
      {
        year: '2023',
        event: 'UP State Ranking Tournament (Noida Banked Track)',
        level: 'State',
        result: '🥈 रजत पदक (Silver)',
        timingOrScore: '46.05s',
        highlight: 'सब-जूनियर से जूनियर वर्ग में आते ही पहले प्रयास में पोडियम फिनिश।'
      }
    ],
    galleryPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
        caption: 'बैंक ट्रैक पर 500m स्प्रिंट फिनिश'
      },
      {
        url: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=600&q=80',
        caption: 'राज्य मेडल सेरेमनी 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=600&q=80',
        caption: 'हाई-इंटेंसिटी मॉर्निंग स्पीड ट्रेनिंग'
      },
      {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        caption: 'टीम यूपी आधिकारिक जर्सी में'
      }
    ],
    stats: {
      stateMedals: 6,
      nationalMedals: 2,
      racesWon: 28,
      personalBest: '44.82s (500m)'
    },
    order: 1,
    status: 'Active'
  },
  {
    id: 'ath-2',
    name: 'Riyayat Srivastava',
    hindiName: 'रियायत श्रीवास्तव',
    district: 'Kanpur Nagar',
    discipline: 'Inline Freestyle Slalom & Battle',
    category: 'Sub-Junior Girls (11 to 14)',
    achievement: 'RSFI National Silver Medalist (Battle Slalom)',
    record: 'State Points: 142.5 pts (World Skate Matrix)',
    medals: '3 🥇 Gold • 2 🥈 Silver',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    tag: 'FREESTYLE SLALOM ACE',
    regNo: 'UPRSA/2026/KNP/00142',
    dob: '24-Nov-2012',
    age: 14,
    clubName: 'Ganga Barrage Freestyle Skating Club, Kanpur',
    coachName: 'Coach Amit Saxena (World Skate Level 2)',
    startedYear: 2019,
    bioSummary: 'रियायत श्रीवास्तव कानपुर की फ्रीस्टाइल स्केटिंग सनसनी हैं। कोन्स (Cones) के बीच उनकी फुर्ती, फ्लेक्सिबिलिटी और मेलोडिक बैटल मूव्स ने उन्हें राष्ट्रीय स्तर पर पहचान दिलाई है।',
    personalStory: 'रियायत ने 7 वर्ष की उम्र में गंगा बैराज स्केटिंग रिंग से अपनी शुरुआत की थी। कठिन कोर स्ट्रेंथ और म्यूजिक कोरियोग्राफी के दम पर उन्होंने क्लासिक स्लैलम और बैटल स्लैलम में राज्य स्तर पर दबदबा बनाया। 2025 में उन्होंने नेशनल में रजत पदक हासिल किया और अब वह 2027 एशियन चैंपियनशिप के लिए तैयार हो रही हैं।',
    specialty: 'वन-व्हील स्नेक (One-Wheel Snake), कोब्रा सिट स्लैलम और 80cm कोन्स पर बैकवर्ड व्हीलिंग।',
    trainingRegime: 'प्रतिदिन 3 घंटे स्लैलम ड्रिल, फ्लेक्सिबिलिटी योग और म्यूजिकल रूटीन अभ्यास।',
    gearSetup: 'Seba High Light Carbon Slalom Skates, Rockered 76mm/80mm 85A Wheels.',
    quote: 'स्केटिंग मेरे लिए केवल खेल नहीं, बल्कि पहियों पर किया जाने वाला संगीत और नृत्य है।',
    careerMilestones: [
      {
        year: '2026',
        event: 'UP State Freestyle Slalom Cup (Kanpur)',
        level: 'State',
        result: '🥇 स्वर्ण पदक (Gold)',
        timingOrScore: '142.5 pts',
        highlight: 'क्लासिक और स्पीड स्लैलम दोनों में शानदार अंक प्राप्त कर शीर्ष स्थान पाया।'
      },
      {
        year: '2025',
        event: '63rd RSFI National Freestyle Championship (Bangalore)',
        level: 'National',
        result: '🥈 राष्ट्रीय रजत (National Silver)',
        timingOrScore: '138.2 pts',
        highlight: 'उत्तर प्रदेश के लिए बालिका वर्ग में ऐतिहासिक रजत पदक जीता।'
      },
      {
        year: '2024',
        event: 'All-India Open Slalom Invitational',
        level: 'National',
        result: '🥇 स्वर्ण पदक (Gold)',
        timingOrScore: 'Score: 9.4/10',
        highlight: 'शानदार तकनीकी शुद्धता (Technical Cleanliness) के साथ विजेता बनीं।'
      }
    ],
    galleryPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
        caption: 'फ्रीस्टाइल स्लैलम बैटल रूटीन'
      },
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
        caption: 'कोन्स के बीच व्हीलिंग तकनीक'
      }
    ],
    stats: {
      stateMedals: 5,
      nationalMedals: 1,
      racesWon: 19,
      personalBest: '142.5 pts'
    },
    order: 2,
    status: 'Active'
  },
  {
    id: 'ath-3',
    name: 'Vikramaditya Rao',
    hindiName: 'विक्रमादित्य राव',
    district: 'Gautam Buddha Nagar (Noida)',
    discipline: 'Quad Speed Skating (Traditional 4-Wheel)',
    category: 'Senior Men (17+)',
    achievement: 'State Sprint Champion & Captain Team UP',
    record: '1000m Time: 1:32.40s (State Record)',
    medals: '6 🥇 Gold • 3 🥈 Silver • 1 🥉 Bronze',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    tag: 'QUAD SPEED CHAMPION',
    regNo: 'UPRSA/2026/GBN/00088',
    dob: '05-Aug-2003',
    age: 23,
    clubName: 'Noida Roller Sports Club, Sector 21A Stadium',
    coachName: 'Coach Surender Singh (Senior State Coach)',
    startedYear: 2013,
    bioSummary: 'विक्रमादित्य राव उत्तर प्रदेश क्वाड स्केटिंग टीम के कप्तान हैं। पारंपरिक 4-पहिया क्वाड स्केटिंग में उनकी गति, ग्रिप और ताकतवर पुश पूरे उत्तर भारत में विख्यात है।',
    personalStory: '12 वर्षों से निरंतर स्केटिंग कर रहे विक्रमादित्य ने उत्तर प्रदेश के लिए 10 से अधिक अंतर्राज्यीय और राष्ट्रीय पदक जीते हैं। नोएडा स्टेडियम के ट्रैक से निकलकर उन्होंने कई युवा स्केटर्स को भी मार्गदर्शन दिया है। उनका लक्ष्य 2026-27 के राष्ट्रीय खेलों में उत्तर प्रदेश को टीम स्वर्ण दिलाना है।',
    specialty: 'क्वाड कॉर्नर ग्रिप, 1000m रिले फिनिश और मास-स्टार्ट रेस टैक्टिक्स।',
    trainingRegime: 'प्रतिदिन 5 घंटे: स्ट्रेंथ ट्रेनिंग, वेटेड स्क्वैट्स, ट्रैक टाइम ट्रायल्स।',
    gearSetup: 'Riedell Quad Leather Custom, Roll-Line Matrix Plates, Bones Swiss Bearings.',
    quote: 'अनुशासन और निरंतरता ही आपको पोडियम के शीर्ष पर पहुँचाती है।',
    careerMilestones: [
      {
        year: '2026',
        event: 'UP State Quad Championship (Greater Noida)',
        level: 'State',
        result: '🥇 2x Gold Medalist',
        timingOrScore: '1:32.40s (Record)',
        highlight: '1000m और 1500m दोनों स्पर्धाओं में स्वर्ण पदक के साथ ऑल-राउंड ट्रॉफी।'
      },
      {
        year: '2025',
        event: 'National Roller Games (Chandigarh)',
        level: 'National',
        result: '🥈 रजत पदक (Silver)',
        timingOrScore: '1:33.10s',
        highlight: 'सीनियर पुरुष क्वाड स्प्रिंट में नेशनल सिल्वर मेडल।'
      }
    ],
    galleryPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
        caption: 'क्वाड स्प्रिंट लाइनअप'
      }
    ],
    stats: {
      stateMedals: 9,
      nationalMedals: 3,
      racesWon: 42,
      personalBest: '1:32.40s (1000m)'
    },
    order: 3,
    status: 'Active'
  },
  {
    id: 'ath-4',
    name: 'Ananya Verma',
    hindiName: 'अनन्या वर्मा',
    district: 'Varanasi',
    discipline: 'Artistic & Figure Skating',
    category: 'Cadet Girls (9 to 11)',
    achievement: 'State Trophy Winner (Solo Free Skating)',
    record: 'Artistic Grade A+ (World Skate India Certified)',
    medals: '3 🥇 Gold • 1 🥈 Silver',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    tag: 'ARTISTIC PHENOM',
    regNo: 'UPRSA/2026/VNS/00215',
    dob: '18-Feb-2015',
    age: 11,
    clubName: 'Kashi Skating Academy, Sigra Stadium, Varanasi',
    coachName: 'Coach Sunita Mishra (Artistic Coach)',
    startedYear: 2020,
    bioSummary: 'वाराणसी की अनन्या वर्मा आर्टिस्टिक और फिगर स्केटिंग में राज्य की उभरती हुई सितारा हैं। क्लासिकल एक्सप्रेशन, जंप्स (Axel & Salchow) और शानदार स्पिन्स उनकी पहचान हैं।',
    personalStory: 'सिगरा स्टेडियम की रिंग पर अभ्यास करते हुए अनन्या ने मात्र 10 वर्ष की उम्र में राज्य स्तरीय सोलो फ्री स्केटिंग में प्रथम स्थान प्राप्त किया। उनकी कोरियोग्राफी में भारतीय शास्त्रीय नृत्य और वेस्टर्न फिगर स्केटिंग का अनूठा संगम दिखता है।',
    specialty: 'डबल लूप जंप्स, कैमल स्पिन्स (Camel Spin) और फुटवर्क सीक्वेंस।',
    trainingRegime: 'प्रतिदिन 3 घंटे: बैले डांसिंग, ऑन-स्केट्स जंप ड्रिल और बैलेंस ट्रेनिंग।',
    gearSetup: 'Edea Fly Artistic Boots, Roll-Line Dance Frame, Giotto 57mm Wheels.',
    quote: 'जब मैं स्केट करती हूँ, मुझे लगता है जैसे मैं हवा में उड़ रही हूँ।',
    careerMilestones: [
      {
        year: '2026',
        event: 'UP State Artistic Skating Championship (Varanasi)',
        level: 'State',
        result: '🥇 स्वर्ण पदक (Gold)',
        timingOrScore: 'Grade A+ (88.5/100)',
        highlight: 'कैडेट बालिका वर्ग में सर्वश्रेष्ठ कलात्मक प्रदर्शन का पुरस्कार।'
      }
    ],
    galleryPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
        caption: 'आर्टिस्टिक फिगर रूटीन'
      }
    ],
    stats: {
      stateMedals: 4,
      nationalMedals: 1,
      racesWon: 14,
      personalBest: 'Grade A+'
    },
    order: 4,
    status: 'Active'
  },
  {
    id: 'ath-5',
    name: 'Devansh Pandey',
    hindiName: 'देवांश पाण्डेय',
    district: 'Prayagraj',
    discipline: 'Roller Hockey & Inline Hockey',
    category: 'Junior Team Lead',
    achievement: 'Northern Zone Inter-State Winner 2025',
    record: 'Top Scorer: 18 Goals (Tournament Record)',
    medals: '2 🥇 Gold • 1 🥈 Silver',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    tag: 'ROLLER HOCKEY ACE',
    regNo: 'UPRSA/2026/PRY/00095',
    dob: '10-Jul-2008',
    age: 18,
    clubName: 'Triveni Roller Sports Complex, Prayagraj',
    coachName: 'Coach V.K. Tiwari (National Hockey Lead)',
    startedYear: 2018,
    bioSummary: 'प्रयागराज के देवांश पाण्डेय उत्तर प्रदेश जूनियर रोलर हॉकी टीम के प्रमुख स्ट्राइकर और प्लेमेकर हैं। उनकी स्टिक हैंडलिंग और तेज ड्रिब्लिंग विरोधियों के लिए अबूझ पहेली है।',
    personalStory: 'प्रयागराज की रिंक से शुरुआत करने वाले देवांश ने 2025 में नॉर्थ ज़ोन इंटर-स्टेट चैंपियनशिप में उत्तर प्रदेश को विजेता बनाया, जहाँ उन्होंने पूरे टूर्नामेंट में सर्वाधिक 18 गोल दागे।',
    specialty: 'क्विक रिस्ट शॉट, पावरप्ले असिट्स और बैकहैंड पासिंग।',
    trainingRegime: 'प्रतिदिन 4 घंटे: स्टिक वर्क, रिंक ड्रिल्स, टीम फॉर्मेशन व स्टेमिना।',
    gearSetup: 'Reno Roller Hockey Professional Skates, Carbon Composite Stick, Full Impact Gear.',
    quote: 'टीम का हर सदस्य जब एक दिल से खेलता है, तभी जीत सुनिश्चित होती है।',
    careerMilestones: [
      {
        year: '2025',
        event: 'North Zone Inter-State Roller Hockey Championship',
        level: 'State',
        result: '🥇 टीम गोल्ड (Champions)',
        timingOrScore: '18 Goals (Top Scorer)',
        highlight: 'फाइनल में निर्णायक हैट्रिक लगाकर उत्तर प्रदेश को ट्रॉफी दिलाई।'
      }
    ],
    galleryPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        caption: 'रोलर हॉकी मैच एक्शन'
      }
    ],
    stats: {
      stateMedals: 3,
      nationalMedals: 1,
      racesWon: 16,
      personalBest: '18 Goals in 5 Matches'
    },
    order: 5,
    status: 'Active'
  },
  {
    id: 'ath-6',
    name: 'Suhani Kapoor',
    hindiName: 'सुहानी कपूर',
    district: 'Ghaziabad',
    discipline: 'Speed Skating (1 Lap Road & Rink)',
    category: 'Minis (6 to 8)',
    achievement: 'Rising Star Talent Hunt Trophy 2026',
    record: 'Rising Phenom: Unbeaten in 2025-26',
    medals: '2 🥇 Gold • 1 🥈 Silver',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    tag: 'RISING STAR',
    regNo: 'UPRSA/2026/GZB/00312',
    dob: '15-May-2018',
    age: 8,
    clubName: 'Ghaziabad Roller Skating Arena, Raj Nagar',
    coachName: 'Coach Deepak Sharma',
    startedYear: 2023,
    bioSummary: 'मात्र 8 वर्ष की उम्र में गाजियाबाद की सुहानी कपूर ने अपने वर्ग में असाधारण फुर्ती और गति दिखाई है। 2025-26 के सभी राज्य स्तरीय टैलेंट हंट आयोजनों में वह अजेय रही हैं।',
    personalStory: '5 वर्ष की आयु में स्केटिंग शुरू करने वाली सुहानी ने अपनी सहज गति और आत्मविश्वास से सबको चकित कर दिया है। यूपी रोलर स्पोर्ट्स एसोसिएशन के जूनियर डेवलपमेंट प्रोग्राम में उन्हें विशेष प्रशिक्षण दिया जा रहा है।',
    specialty: 'फास्ट स्टार्ट, कॉर्नर लीन और 500m में निरंतर गति।',
    trainingRegime: 'सप्ताह में 5 दिन (प्रतिदिन 2 घंटे): बेसिक स्पीड ड्रिल्स और फन ट्रेनिंग।',
    gearSetup: 'Luigino Kids Inline 90mm, Atom Matrix Wheels, Abec 7 Bearings.',
    quote: 'मुझे रोलर स्केट्स पर दौड़ना सबसे ज्यादा पसंद है!',
    careerMilestones: [
      {
        year: '2026',
        event: 'UP State Grassroots Talent Championship',
        level: 'State',
        result: '🥇 2x Gold Winner',
        timingOrScore: '24.15s (1 Lap)',
        highlight: 'मिनी वर्ग में रिकॉर्ड अंतर से दोनों रेस जीतीं।'
      }
    ],
    galleryPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
        caption: 'टैलेंट हंट पोडियम फिनिश'
      }
    ],
    stats: {
      stateMedals: 3,
      nationalMedals: 0,
      racesWon: 11,
      personalBest: '24.15s (1 Lap Road)'
    },
    order: 6,
    status: 'Active'
  }
];
