import { TournamentEvent, DisciplineType } from '../types';

export const ALL_STANDARD_AGE_CATEGORIES = [
  '5 to 7 Years',
  '7 to 9 Years',
  '9 to 11 Years',
  '11 to 14 Years',
  '14 to 17 Years',
  'Above 17 Years',
  'Cadet (8 to 10)',
  'Cadet (10 to 12)',
  'Sub-Junior (11 to 14 Years)',
  'Sub-Junior (12 to 15)',
  'Junior (14 to 17 Years)',
  'Junior (15 to 18)',
  'Senior (Above 17)',
  'Senior (Above 18)',
  'Masters (Above 35)',
  'All Age Groups'
];

export const generateStandardChampionshipEvents = (tournamentId: string = 'tour-2026-01'): TournamentEvent[] => {
  return [
    // ==========================================
    // 1. SPEED SKATING (QUAD) - क्वॉड स्केटिंग
    // ==========================================
    {
      id: `${tournamentId}-quad-01`,
      tournamentId,
      discipline: 'Speed Skating (Quad)' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: '500m+D Sprint Rink Race (Quad - Banked Track)',
      distance: '500m+D',
      entryFee: 0
    },
    {
      id: `${tournamentId}-quad-02`,
      tournamentId,
      discipline: 'Speed Skating (Quad)' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: '1000m Sprint Rink Race (Quad - Banked Track)',
      distance: '1000m',
      entryFee: 0
    },
    {
      id: `${tournamentId}-quad-03`,
      tournamentId,
      discipline: 'Speed Skating (Quad)' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: '200m Dual Time Trial - DTT (Quad - Track)',
      distance: '200m DTT',
      entryFee: 0
    },
    {
      id: `${tournamentId}-quad-04`,
      tournamentId,
      discipline: 'Speed Skating (Quad)' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: '1 Lap Road Sprint (Quad - Road Circuit)',
      distance: '1 Lap Road',
      entryFee: 0
    },
    {
      id: `${tournamentId}-quad-05`,
      tournamentId,
      discipline: 'Speed Skating (Quad)' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: '1500m / 3000m Points Race (Quad - Banked Track)',
      distance: '1500m / 3000m',
      entryFee: 0
    },
    {
      id: `${tournamentId}-quad-06`,
      tournamentId,
      discipline: 'Speed Skating (Quad)' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: '100m Road Sprint (Quad - Straight Road)',
      distance: '100m Road',
      entryFee: 0
    },

    // ==========================================
    // 2. SPEED SKATING (INLINE) - इनलाइन स्केटिंग
    // ==========================================
    {
      id: `${tournamentId}-inline-01`,
      tournamentId,
      discipline: 'Speed Skating (Inline)' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: '500m+D Sprint Rink Race (Inline - Banked Track)',
      distance: '500m+D',
      entryFee: 0
    },
    {
      id: `${tournamentId}-inline-02`,
      tournamentId,
      discipline: 'Speed Skating (Inline)' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: '1000m Sprint Rink Race (Inline - Banked Track)',
      distance: '1000m',
      entryFee: 0
    },
    {
      id: `${tournamentId}-inline-03`,
      tournamentId,
      discipline: 'Speed Skating (Inline)' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: '200m Dual Time Trial - DTT (Inline - Track)',
      distance: '200m DTT',
      entryFee: 0
    },
    {
      id: `${tournamentId}-inline-04`,
      tournamentId,
      discipline: 'Speed Skating (Inline)' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: '3000m / 5000m Points Elimination (Inline - Track)',
      distance: '5000m Points',
      entryFee: 0
    },
    {
      id: `${tournamentId}-inline-05`,
      tournamentId,
      discipline: 'Speed Skating (Inline)' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: '1 Lap Road Sprint (Inline - Road Circuit)',
      distance: '1 Lap Road',
      entryFee: 0
    },
    {
      id: `${tournamentId}-inline-06`,
      tournamentId,
      discipline: 'Speed Skating (Inline)' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: '100m Sprint (Inline - Straight Road)',
      distance: '100m Road',
      entryFee: 0
    },
    {
      id: `${tournamentId}-inline-07`,
      tournamentId,
      discipline: 'Speed Skating (Inline)' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: '10,000m Elimination Long Distance Race (Inline)',
      distance: '10,000m',
      entryFee: 0
    },

    // ==========================================
    // 3. INLINE FREESTYLE - इनलाइन फ्रीस्टाइल
    // ==========================================
    {
      id: `${tournamentId}-freestyle-01`,
      tournamentId,
      discipline: 'Inline Freestyle' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: 'Speed Slalom Knockout (20 Cones Speed Run)',
      distance: 'Slalom Cones',
      entryFee: 0
    },
    {
      id: `${tournamentId}-freestyle-02`,
      tournamentId,
      discipline: 'Inline Freestyle' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: 'Classic Slalom Musical Routine (Timed Presentation)',
      distance: 'Music Freestyle',
      entryFee: 0
    },
    {
      id: `${tournamentId}-freestyle-03`,
      tournamentId,
      discipline: 'Inline Freestyle' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: 'Battle Slalom Tricks & Combo Battle',
      distance: 'Battle Cones',
      entryFee: 0
    },
    {
      id: `${tournamentId}-freestyle-04`,
      tournamentId,
      discipline: 'Inline Freestyle' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: 'Free Jump Height Clearance',
      distance: 'High Jump Bar',
      entryFee: 0
    },
    {
      id: `${tournamentId}-freestyle-05`,
      tournamentId,
      discipline: 'Inline Freestyle' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: 'Slides Contest (Braking Maneuvers)',
      distance: 'Slide Track',
      entryFee: 0
    },

    // ==========================================
    // 4. ARTISTIC SKATING - आर्टिस्टिक स्केटिंग
    // ==========================================
    {
      id: `${tournamentId}-artistic-01`,
      tournamentId,
      discipline: 'Artistic Skating' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: 'Figure Skating Compulsory Figures',
      distance: 'Circle Figures',
      entryFee: 0
    },
    {
      id: `${tournamentId}-artistic-02`,
      tournamentId,
      discipline: 'Artistic Skating' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: 'Solo Dance Free Routine (Music Choreography)',
      distance: 'Solo Dance',
      entryFee: 0
    },
    {
      id: `${tournamentId}-artistic-03`,
      tournamentId,
      discipline: 'Artistic Skating' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: 'Free Skating Short & Long Technical Program',
      distance: 'Free Skating',
      entryFee: 0
    },
    {
      id: `${tournamentId}-artistic-04`,
      tournamentId,
      discipline: 'Artistic Skating' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: 'Show Group & Precision Team Routine',
      distance: 'Group Presentation',
      entryFee: 0
    },

    // ==========================================
    // 5. ROLLER HOCKEY & INLINE HOCKEY - हॉकी
    // ==========================================
    {
      id: `${tournamentId}-hockey-01`,
      tournamentId,
      discipline: 'Roller Hockey' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: 'State Championship League Matches (Roller Hockey Quad)',
      distance: '2x20 Min Halves',
      entryFee: 0
    },
    {
      id: `${tournamentId}-hockey-02`,
      tournamentId,
      discipline: 'Inline Hockey' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: 'Inter-District Championship Matches (Inline Hockey)',
      distance: '2x20 Min Halves',
      entryFee: 0
    },
    {
      id: `${tournamentId}-hockey-03`,
      tournamentId,
      discipline: 'Roller Hockey' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: 'Penalty Shootout Knockout Challenge',
      distance: 'Penalty Box',
      entryFee: 0
    },

    // ==========================================
    // 6. SKATEBOARDING & ROLLER FREESTYLE
    // ==========================================
    {
      id: `${tournamentId}-skate-01`,
      tournamentId,
      discipline: 'Skateboarding' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: 'Street Course Competition (2 Runs + 5 Best Tricks)',
      distance: 'Street Obstacles',
      entryFee: 0
    },
    {
      id: `${tournamentId}-skate-02`,
      tournamentId,
      discipline: 'Roller Freestyle' as DisciplineType,
      ageCategory: 'Sub-Junior (12 to 15)',
      ageCategories: ALL_STANDARD_AGE_CATEGORIES,
      gender: 'All Genders',
      eventName: 'Park Bowl & Vert Ramp Best Trick Jam',
      distance: 'Bowl & Vert',
      entryFee: 0
    }
  ];
};
