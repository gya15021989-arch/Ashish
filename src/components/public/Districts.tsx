import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Phone, 
  Mail, 
  Shield, 
  CheckCircle2, 
  Building2,
  Users,
  Award,
  ChevronRight,
  ExternalLink,
  Info,
  X,
  Sparkles,
  Trophy
} from 'lucide-react';
import { ALL_75_DISTRICTS, DetailedDistrict, DistrictOfficeBearer } from '../../data/all75Districts';

interface DistrictsProps {
  onNavigate?: (page: string) => void;
}

const ZONE_FILTERS = [
  'ALL UP ZONES',
  'CENTRAL UP',
  'WESTERN UP',
  'EASTERN UP',
  'BUNDELKHAND',
  'ROHILKHAND',
  'AWADH ZONE'
] as const;

type ZoneFilterType = typeof ZONE_FILTERS[number];

export const Districts: React.FC<DistrictsProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState<ZoneFilterType>('ALL UP ZONES');
  const [selectedDistrictModal, setSelectedDistrictModal] = useState<DetailedDistrict | null>(null);

  // Helper to extract initials safely
  const getInitials = (name: string): string => {
    const clean = name.replace(/^(Dr\.|Prof\.|Shri|Smt\.|Coach)\s+/i, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (parts[0]?.slice(0, 2) || 'UP').toUpperCase();
  };

  // Filtered districts list
  const filteredDistricts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return ALL_75_DISTRICTS.filter((district) => {
      // Zone match logic
      let matchesZone = true;
      if (selectedZone !== 'ALL UP ZONES') {
        if (selectedZone === 'CENTRAL UP') {
          matchesZone = district.zone === 'Central UP';
        } else if (selectedZone === 'WESTERN UP') {
          matchesZone = district.zone === 'Western UP';
        } else if (selectedZone === 'EASTERN UP') {
          matchesZone = district.zone === 'Eastern UP';
        } else if (selectedZone === 'BUNDELKHAND') {
          matchesZone = district.zone === 'Bundelkhand';
        } else if (selectedZone === 'ROHILKHAND') {
          matchesZone = district.zone === 'Rohilkhand';
        } else if (selectedZone === 'AWADH ZONE') {
          matchesZone = district.zone === 'Awadh Zone' || 
            ['Lucknow', 'Ayodhya (Faizabad)', 'Barabanki', 'Rae Bareli', 'Amethi', 'Sultanpur', 'Sitapur', 'Hardoi', 'Lakhimpur Kheri', 'Unnao', 'Ambedkar Nagar'].includes(district.name);
        }
      }

      if (!matchesZone) return false;

      // Search query match logic
      if (!query) return true;

      const inName = district.name.toLowerCase().includes(query);
      const inHindiName = district.hindiName.includes(query);
      const inAssocName = district.associationName.toLowerCase().includes(query);
      const inAddress = district.officeAddress.toLowerCase().includes(query);
      const inPresident = district.president.name.toLowerCase().includes(query);
      const inSecretary = district.generalSecretary.name.toLowerCase().includes(query);
      const inTreasurer = district.treasurer.name.toLowerCase().includes(query);
      const inVenue = district.stadiumVenue.toLowerCase().includes(query);
      const inZone = district.zone.toLowerCase().includes(query);
      const inCode = district.uprsaCode.toLowerCase().includes(query);

      return (
        inName ||
        inHindiName ||
        inAssocName ||
        inAddress ||
        inPresident ||
        inSecretary ||
        inTreasurer ||
        inVenue ||
        inZone ||
        inCode
      );
    });
  }, [search, selectedZone]);

  // Office bearer card renderer with prominent 4:5 portrait photo
  const renderOfficeBearerCard = (bearer: DistrictOfficeBearer, roleLabel: string, roleColor: string) => {
    const isPending = !bearer.phone || bearer.phone.includes('pending') || bearer.phone.includes('Pending');
    const isEmailPending = !bearer.email || bearer.email.includes('pending') || bearer.email.includes('Pending');
    const initials = getInitials(bearer.name);

    return (
      <div className="bg-[#09101d] border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-inner h-full group/card">
        <div className="space-y-3.5">
          {/* Role Header Badge */}
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider ${roleColor}`}>
              {roleLabel}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">UPRSA ID</span>
          </div>

          {/* Large Professional 4:5 Portrait Photo / Authentic Official Monogram */}
          <div className="aspect-[4/5] w-full rounded-xl overflow-hidden relative shadow-md border border-slate-700/80 bg-[#070c17] group/photo">
            {bearer.photoUrl ? (
              <img
                src={bearer.photoUrl}
                alt={bearer.name}
                className="w-full h-full object-cover object-top brightness-95 contrast-105 group-hover/card:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const fallback = (e.target as HTMLElement).nextElementSibling;
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
            ) : null}

            {/* Official Placeholder with 4:5 Portrait Frame */}
            <div
              className={`w-full h-full bg-gradient-to-b from-slate-900 via-[#0b1426] to-[#050a14] border border-slate-800/80 flex-col items-center justify-center text-center p-4 select-none relative ${
                bearer.photoUrl ? 'hidden' : 'flex'
              }`}
            >
              {/* Background Shield Watermark */}
              <Shield className="w-20 h-20 text-slate-800/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center space-y-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-blue-600/20 border border-amber-500/40 flex items-center justify-center shadow-lg">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 tracking-wider">
                    {initials}
                  </span>
                </div>

                <div className="space-y-0.5 pt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">
                    UPRSA Official
                  </span>
                  <span className="text-[9px] font-mono text-amber-400/80 block">
                    Accredited Office Bearer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details below the photo */}
          <div className="space-y-1 pt-1">
            <p className="text-[11px] font-extrabold uppercase text-amber-400 tracking-wider line-clamp-1">
              {bearer.designation}
            </p>
            <h5 className="text-sm sm:text-base font-black text-white leading-snug group-hover/card:text-amber-300 transition-colors line-clamp-1">
              {bearer.name}
            </h5>
          </div>
        </div>

        {/* Contact details */}
        <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-2 text-[11px]">
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            {isPending ? (
              <span className="text-slate-500 italic text-[10px] truncate">
                Official contact pending verification
              </span>
            ) : (
              <a
                href={`tel:${bearer.phone?.replace(/[^0-9+]/g, '')}`}
                className="text-slate-200 hover:text-amber-300 font-medium truncate transition-colors"
              >
                {bearer.phone}
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            {isEmailPending ? (
              <span className="text-slate-500 italic text-[10px] truncate">
                Official email pending verification
              </span>
            ) : (
              <a
                href={`mailto:${bearer.email}`}
                className="text-slate-200 hover:text-sky-300 truncate transition-colors"
              >
                {bearer.email}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#040811] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-10 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* ================================================== */}
        {/* 1. PAGE HEADER                                     */}
        {/* ================================================== */}
        <div className="text-center max-w-4xl mx-auto space-y-3 pt-4">
          {/* Small green verification line */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-300 px-4 py-1.5 rounded-full border border-emerald-500/30 text-xs font-black tracking-widest uppercase shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>OFFICIAL UNIT & UPRSA RECOGNIZED STATE DIRECTORY</span>
          </div>

          {/* Large heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase">
            DISTRICT ROLLER SPORTS ASSOCIATIONS
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
            Official profile of 75 District Roller Sports Associations across Uttar Pradesh — governing local championships, selection trials, club affiliations, and certified talent registration.
          </p>

          <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full mx-auto mt-4 shadow-sm shadow-amber-500/30" />
        </div>

        {/* ================================================== */}
        {/* 2. SEARCH + ZONE FILTER                            */}
        {/* ================================================== */}
        <div className="bg-[#0b1322] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search district association, president, secretary, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#070c17] border border-slate-700/80 rounded-2xl pl-12 pr-10 py-3.5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Zone Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {ZONE_FILTERS.map((zone) => {
              const isActive = selectedZone === zone;
              return (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400 scale-[1.02]'
                      : 'bg-[#070c17] text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
                  }`}
                >
                  {zone}
                </button>
              );
            })}
          </div>

          {/* Status Counter Bar */}
          <div className="pt-3 border-t border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Showing <strong className="text-white font-bold">{filteredDistricts.length}</strong> of 75 district associations
              </span>
              {selectedZone !== 'ALL UP ZONES' && (
                <span className="text-blue-400 font-semibold">({selectedZone})</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-slate-300 text-xs">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Official State Headquarters: <strong className="text-white">Lucknow, Uttar Pradesh</strong>
              </span>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* 3. DISTRICT ASSOCIATION CARDS                      */}
        {/* ================================================== */}
        {filteredDistricts.length === 0 ? (
          <div className="bg-[#0b1322] border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No District Association Matches Your Search</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              We couldn't find any district matching &quot;{search}&quot; in {selectedZone}. Try searching by district name, secretary name, or switch zones.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedZone('ALL UP ZONES');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredDistricts.map((district) => {
              const isContactPending = 
                !district.phone || district.phone.includes('pending') || district.phone.includes('Pending');
              const isEmailPending = 
                !district.email || district.email.includes('pending') || district.email.includes('Pending');

              return (
                <div
                  key={district.id}
                  className="bg-[#0c1322] border border-slate-800 hover:border-blue-500/40 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col lg:flex-row group"
                >
                  {/* ================================================== */}
                  {/* LEFT SIDE: District / Association Photograph       */}
                  {/* ================================================== */}
                  <div className="relative w-full lg:w-[32%] xl:w-[28%] min-h-[260px] lg:min-h-full overflow-hidden bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0">
                    <img
                      src={district.imageUrl}
                      alt={`${district.name} Roller Sports`}
                      className="w-full h-full object-cover object-center brightness-[0.88] contrast-[1.08] group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const fallback = (e.target as HTMLElement).nextElementSibling;
                        if (fallback) (fallback as HTMLElement).style.display = 'flex';
                      }}
                    />

                    {/* Fallback pattern */}
                    <div className="hidden w-full h-full bg-gradient-to-br from-slate-900 via-[#0d1629] to-slate-950 items-center justify-center p-6 text-center">
                      <Shield className="w-16 h-16 text-amber-400/30 mb-2" />
                      <span className="text-sm font-black text-amber-400">{district.name} DRSA</span>
                    </div>

                    {/* Left overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0c1322]/90 via-transparent to-transparent pointer-events-none" />

                    {/* Top overlay badge on photo */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                      <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-lg border border-blue-400/30">
                        {district.zone}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-slate-950/80 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/30 backdrop-blur-sm">
                        {district.uprsaCode}
                      </span>
                    </div>

                    {/* Bottom stadium venue info on image */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 hidden sm:block">
                      <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-300">
                        <span className="text-[9px] uppercase font-bold text-amber-400 block tracking-wider">
                          Primary Venue & Track
                        </span>
                        <p className="font-semibold text-white truncate">{district.stadiumVenue}</p>
                      </div>
                    </div>
                  </div>

                  {/* ================================================== */}
                  {/* RIGHT SIDE: Association Information                */}
                  {/* ================================================== */}
                  <div className="p-6 sm:p-8 lg:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-5">
                      
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                          {district.zone}
                        </span>

                        <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Recognized Association</span>
                        </span>

                        <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          <span>{district.rankingBadge}</span>
                        </span>

                        <span className="text-[11px] font-mono text-slate-400 ml-auto hidden sm:inline-block">
                          Affiliated Since {district.affiliatedYear}
                        </span>
                      </div>

                      {/* Association Title & Hindi Name */}
                      <div className="space-y-1">
                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight group-hover:text-blue-300 transition-colors">
                          {district.associationName}
                        </h3>
                        <p className="text-sm sm:text-base font-bold text-amber-400 tracking-wide">
                          {district.hindiAssociationName}
                        </p>
                      </div>

                      {/* Information Row: Address, Phone, Email, Verified */}
                      <div className="bg-[#09101d] border border-slate-800 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        {/* Address */}
                        <div className="flex items-start gap-2.5 text-slate-300">
                          <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">
                              Official Address
                            </span>
                            <span className="text-slate-200 text-xs line-clamp-2 leading-snug">
                              {district.officeAddress}
                            </span>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-2.5 text-slate-300">
                          <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">
                              Contact Number
                            </span>
                            {isContactPending ? (
                              <span className="text-slate-500 italic text-[11px]">
                                Official details pending verification
                              </span>
                            ) : (
                              <a
                                href={`tel:${district.phone.split(',')[0].trim().replace(/[^0-9+]/g, '')}`}
                                className="text-white hover:text-amber-300 font-bold text-xs truncate block"
                              >
                                {district.phone}
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-2.5 text-slate-300">
                          <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">
                              Official Email ID
                            </span>
                            {isEmailPending ? (
                              <span className="text-slate-500 italic text-[11px]">
                                Official details pending verification
                              </span>
                            ) : (
                              <a
                                href={`mailto:${district.email}`}
                                className="text-white hover:text-sky-300 font-medium text-xs truncate block"
                              >
                                {district.email}
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Verification Status */}
                        <div className="flex items-start gap-2.5 text-slate-300">
                          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">
                              Accreditation
                            </span>
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Official Verified
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ================================================== */}
                      {/* 4. EXECUTIVE COUNCIL & KEY OFFICE BEARERS          */}
                      {/* ================================================== */}
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>EXECUTIVE COUNCIL & KEY OFFICE BEARERS</span>
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono">
                            District Board (2024–2028)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
                          {renderOfficeBearerCard(
                            district.president,
                            'PRESIDENT',
                            'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          )}
                          {renderOfficeBearerCard(
                            district.generalSecretary,
                            'GENERAL SECRETARY',
                            'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          )}
                          {renderOfficeBearerCard(
                            district.treasurer,
                            'TREASURER',
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ================================================== */}
                    {/* 5. DISTRICT DETAILS FOOTER                         */}
                    {/* ================================================== */}
                    <div className="pt-5 border-t border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Club & Skater Stats */}
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 font-semibold">
                          <Building2 className="w-4 h-4 text-amber-400" />
                          <span>
                            <strong className="text-white font-bold">{district.affiliatedClubsCount}</strong> Affiliated Clubs
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 font-semibold">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span>
                            <strong className="text-white font-bold">{district.registeredSkatersCount}</strong> Registered Skaters
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => setSelectedDistrictModal(district)}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Info className="w-3.5 h-3.5 text-slate-400" />
                          <span>Complete Profile</span>
                        </button>

                        <button
                          onClick={() => onNavigate?.('clubs')}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-blue-600/20 hover:scale-[1.02]"
                        >
                          <span>Explore Clubs</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ================================================== */}
      {/* COMPLETE PROFILE MODAL                             */}
      {/* ================================================== */}
      {selectedDistrictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b1322] border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative text-slate-100">
            {/* Close Button */}
            <button
              onClick={() => setSelectedDistrictModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 p-2 rounded-xl transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <div className="inline-flex items-center gap-2 bg-blue-500/15 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>UPRSA Certified District Unit • {selectedDistrictModal.uprsaCode}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {selectedDistrictModal.associationName}
              </h2>
              <p className="text-sm font-bold text-amber-400">
                {selectedDistrictModal.hindiAssociationName}
              </p>
            </div>

            {/* Description & Overview */}
            <div className="bg-[#070c17] border border-slate-800/90 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                District Administration Overview
              </span>
              <p>{selectedDistrictModal.description}</p>
            </div>

            {/* Rink & Track Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#070c17] border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Primary Skating Stadium
                </span>
                <p className="text-xs font-semibold text-white">{selectedDistrictModal.stadiumVenue}</p>
              </div>

              <div className="bg-[#070c17] border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-sky-400 block tracking-wider">
                  Track Specifications
                </span>
                <p className="text-xs font-semibold text-white">{selectedDistrictModal.trackSpecifications}</p>
              </div>
            </div>

            {/* Secretariat Information */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase text-slate-300 tracking-wider block">
                District Secretariat & Governance
              </span>
              <div className="bg-[#070c17] border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Secretariat Address:</strong> {selectedDistrictModal.officeAddress}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Official Phone:</strong> {selectedDistrictModal.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Official Email:</strong> {selectedDistrictModal.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Affiliation Status:</strong> Active since {selectedDistrictModal.affiliatedYear} (Continuous RSFI Recognition)</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedDistrictModal(null)}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Profile
              </button>
              <button
                onClick={() => {
                  setSelectedDistrictModal(null);
                  onNavigate?.('clubs');
                }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <span>View District Clubs</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
