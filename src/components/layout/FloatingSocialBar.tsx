import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { UPRSA_INFO } from '../../data/uprsaKnowledge';

interface SocialPlatform {
  id: string;
  name: string;
  href: string;
  bgColor: string;
  hoverBg?: string;
  tooltip: string;
  icon: React.ReactNode;
}

export const FloatingSocialBar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const socialLinks: SocialPlatform[] = [
    {
      id: 'facebook',
      name: 'Facebook',
      href: 'https://facebook.com/uprsa',
      bgColor: 'bg-[#1877F2]',
      hoverBg: 'hover:bg-[#166fe5]',
      tooltip: 'Follow on Facebook',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: 'instagram',
      name: 'Instagram',
      href: 'https://instagram.com/uprsa_official',
      bgColor: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
      tooltip: 'Follow on Instagram',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      id: 'youtube',
      name: 'YouTube',
      href: 'https://youtube.com/@uprsa',
      bgColor: 'bg-[#FF0000]',
      hoverBg: 'hover:bg-[#e60000]',
      tooltip: 'Subscribe on YouTube',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      href: `https://wa.me/919415021989?text=${encodeURIComponent('Hello UPRSA Secretariat, I have a query regarding Roller Skating.')}`,
      bgColor: 'bg-[#25D366]',
      hoverBg: 'hover:bg-[#20bd5a]',
      tooltip: 'Chat on WhatsApp',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      href: 'https://x.com/uprsa_official',
      bgColor: 'bg-black border border-slate-700/80',
      hoverBg: 'hover:bg-slate-900',
      tooltip: 'Follow on X',
      icon: (
        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/uprsa',
      bgColor: 'bg-[#0A66C2]',
      hoverBg: 'hover:bg-[#084e96]',
      tooltip: 'Connect on LinkedIn',
      icon: (
        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      aria-label="UPRSA Official Social Media Toolbar"
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-transform duration-300 ease-in-out ${
        isCollapsed ? 'translate-x-[calc(100%-14px)] sm:translate-x-[calc(100%-16px)]' : 'translate-x-0'
      }`}
    >
      <div className="relative flex items-center">
        {/* Toggle Collapse / Expand Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-7 sm:-left-8 top-1/2 -translate-y-1/2 w-7 h-11 sm:w-8 sm:h-12 bg-slate-900/95 hover:bg-slate-800 text-amber-400 border-l border-t border-b border-slate-700/80 rounded-l-lg shadow-xl flex items-center justify-center cursor-pointer transition-all hover:text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 backdrop-blur-md"
          title={isCollapsed ? 'Expand Social Toolbar' : 'Collapse Social Toolbar'}
          aria-label={isCollapsed ? 'Expand Social Toolbar' : 'Collapse Social Toolbar'}
        >
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" />
          ) : (
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" />
          )}
        </button>

        {/* Social Icons Stack */}
        <div className="flex flex-col gap-1.5 p-1.5 sm:p-2 bg-slate-900/95 border-l border-t border-b border-slate-700/90 rounded-l-2xl shadow-2xl backdrop-blur-md">
          {socialLinks.map((item) => (
            <div key={item.id} className="relative group">
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.tooltip}
                className={`w-9 h-9 sm:w-10 sm:h-10 ${item.bgColor} ${item.hoverBg || ''} text-white rounded-xl flex items-center justify-center shadow-lg shadow-black/40 transition-all duration-200 transform group-hover:-translate-x-1.5 group-hover:scale-105 active:scale-95 cursor-pointer relative z-10`}
              >
                {item.icon}
              </a>

              {/* Tooltip on the left side */}
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 hidden sm:flex items-center z-50">
                <div className="bg-slate-950/95 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xl border border-slate-700/80 whitespace-nowrap backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{item.tooltip}</span>
                </div>
                {/* Tooltip Right-pointed Arrow */}
                <div className="w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-slate-700/80" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

