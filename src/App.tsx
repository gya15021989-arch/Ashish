import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingSocialBar } from './components/layout/FloatingSocialBar';
import { FloatingLiveMatchButton } from './components/layout/FloatingLiveMatchButton';
import { FloatingChatButton } from './components/chat/FloatingChatButton';
import { ChatBoardModal } from './components/chat/ChatBoardModal';
import { LoginModal } from './components/auth/LoginModal';
import { SkaterLoginPage } from './components/auth/SkaterLoginPage';
import { AdminAuthPage } from './components/auth/AdminAuthPage';

// Public Pages
import { Home } from './components/public/Home';
import { About } from './components/public/About';
import { Activities } from './components/public/Activities';
import { Districts } from './components/public/Districts';
import { Clubs } from './components/public/Clubs';
import { Tournaments } from './components/public/Tournaments';
import { Results } from './components/public/Results';
import { Rankings } from './components/public/Rankings';
import { LiveScoreboard } from './components/public/LiveScoreboard';
import { CertificateVerification } from './components/public/CertificateVerification';
import { AthleteVerification } from './components/public/AthleteVerification';
import { NewsGallery } from './components/public/NewsGallery';
import { Contact } from './components/public/Contact';

// Skater Portal
import { RegistrationForm } from './components/skater/RegistrationForm';
import { AccountActivation } from './components/skater/AccountActivation';
import { RegistrationStatusView } from './components/skater/RegistrationStatusView';
import { SkaterPortal } from './components/skater/SkaterPortal';
import { SkaterTournamentRegistration } from './components/skater/SkaterTournamentRegistration';

// Admin Dashboard
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Skater } from './types';

const MainApp: React.FC = () => {
  const { user, skater, isAdmin, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalInitialRole, setModalInitialRole] = useState<'skater' | 'admin'>('skater');
  const [isChatBoardOpen, setIsChatBoardOpen] = useState(false);
  const [chatBoardInitialTab, setChatBoardInitialTab] = useState<'ai' | 'community'>('ai');
  const [selectedVerifyCode, setSelectedVerifyCode] = useState<string>('');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleNavigateToVerify = (code: string) => {
    setSelectedVerifyCode(code);
    setCurrentPage('verify_cert');
  };

  const handleOpenAiChat = () => {
    setChatBoardInitialTab('ai');
    setIsChatBoardOpen(true);
  };

  const handleOpenCommunityBoard = () => {
    setChatBoardInitialTab('community');
    setIsChatBoardOpen(true);
  };

  const handleOpenSkaterLoginModal = () => {
    setModalInitialRole('skater');
    setIsLoginModalOpen(true);
  };

  const handleOpenAdminLoginModal = () => {
    setModalInitialRole('admin');
    setIsLoginModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#070d18] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 m-0 p-0 overflow-x-hidden">
      {/* Top Header */}
      <Header
        activePage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onOpenLogin={handleOpenSkaterLoginModal}
        onOpenSkaterLogin={handleOpenSkaterLoginModal}
        onOpenAdminLogin={handleOpenAdminLoginModal}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Home
            onNavigate={(page) => setCurrentPage(page)}
            onOpenAiChat={handleOpenAiChat}
          />
        )}

        {currentPage === 'about' && <About />}

        {currentPage === 'activities' && (
          <Activities 
            onNavigate={(page) => setCurrentPage(page)}
            onNavigateToTournaments={() => setCurrentPage('tournaments')} 
          />
        )}

        {currentPage === 'districts' && (
          <Districts onNavigate={(page) => setCurrentPage(page)} />
        )}

        {currentPage === 'clubs' && (
          <Clubs onNavigateToRegister={() => setCurrentPage('register')} />
        )}

        {currentPage === 'tournaments' && (
          <Tournaments 
            onNavigate={(page) => setCurrentPage(page)}
            onEnterTournament={() => setCurrentPage('tournament_entry')}
            onViewResults={() => setCurrentPage('results')}
            onOpenLiveScore={() => setCurrentPage('live_score')}
          />
        )}

        {currentPage === 'results' && (
          <Results onNavigateToVerify={handleNavigateToVerify} />
        )}

        {currentPage === 'rankings' && <Rankings />}

        {currentPage === 'live_score' && <LiveScoreboard />}

        {currentPage === 'verify_cert' && (
          <CertificateVerification initialCode={selectedVerifyCode} />
        )}

        {currentPage === 'verify_athlete' && (
          <AthleteVerification initialRegNo={selectedVerifyCode} />
        )}

        {(currentPage === 'news_gallery' || currentPage === 'news' || currentPage === 'gallery') && <NewsGallery />}

        {currentPage === 'contact' && <Contact />}

        {/* Dedicated Skater Login Page */}
        {(currentPage === 'skater_login' || currentPage === 'login') && (
          <SkaterLoginPage
            onSuccess={() => setCurrentPage('skater_portal')}
            onNavigateToRegistration={() => setCurrentPage('register')}
            onNavigateToActivation={() => setCurrentPage('activate_skater')}
            onNavigateToVerifyAthlete={() => setCurrentPage('verify_athlete')}
            onSwitchToAdmin={() => setCurrentPage('admin_login')}
          />
        )}

        {/* Dedicated Admin Authentication Page */}
        {(currentPage === 'admin_login' || currentPage === 'admin_auth') && (
          <AdminAuthPage
            onSuccess={() => setCurrentPage('admin')}
            onSwitchToSkater={() => setCurrentPage('skater_login')}
          />
        )}

        {/* Skater Registration & Status */}
        {currentPage === 'register' && (
          <RegistrationForm
            onSuccess={(newSkater: Skater) => {
              setCurrentPage('skater_portal');
            }}
            onNavigateToPortal={() => setCurrentPage('skater_portal')}
            onNavigateToVerify={(regNo) => {
              setSelectedVerifyCode(regNo);
              setCurrentPage('verify_athlete');
            }}
            onNavigateHome={() => setCurrentPage('home')}
            onCancel={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'activate_skater' && (
          <div className="min-h-screen py-16 px-4 bg-[#070d18]">
            <AccountActivation
              onSuccess={() => setCurrentPage('skater_portal')}
              onSwitchToLogin={() => setCurrentPage('skater_login')}
            />
          </div>
        )}

        {currentPage === 'skater_status' && (
          <div className="min-h-screen py-16 px-4 bg-[#070d18]">
            <RegistrationStatusView />
          </div>
        )}

        {/* Skater Portal: If logged in, show Portal; if not, show Skater Login */}
        {currentPage === 'skater_portal' && (
          isAuthenticated ? (
            <SkaterPortal
              onNavigateToTournamentEntry={() => setCurrentPage('tournament_entry')}
              onNavigateToVerifyCert={handleNavigateToVerify}
            />
          ) : (
            <SkaterLoginPage
              onSuccess={() => setCurrentPage('skater_portal')}
              onNavigateToRegistration={() => setCurrentPage('register')}
              onNavigateToActivation={() => setCurrentPage('activate_skater')}
              onNavigateToVerifyAthlete={() => setCurrentPage('verify_athlete')}
              onSwitchToAdmin={() => setCurrentPage('admin_login')}
            />
          )
        )}

        {currentPage === 'tournament_entry' && (
          <SkaterTournamentRegistration
            skater={skater}
            onSuccess={() => setCurrentPage('skater_portal')}
            onCancel={() => setCurrentPage('tournaments')}
          />
        )}

        {/* Executive Board / Admin: If authenticated as admin, show CMS; else show Admin Auth Page */}
        {currentPage === 'admin' && (
          isAdmin ? (
            <AdminDashboard />
          ) : (
            <AdminAuthPage
              onSuccess={() => setCurrentPage('admin')}
              onSwitchToSkater={() => setCurrentPage('skater_login')}
            />
          )
        )}
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={(page) => setCurrentPage(page)}
        onOpenAdminLogin={handleOpenAdminLoginModal}
        onOpenLogin={handleOpenSkaterLoginModal}
      />

      {/* Floating Elements */}
      <FloatingSocialBar />
      
      <FloatingLiveMatchButton
        onOpenLiveScore={() => setCurrentPage('live_score')}
      />

      <FloatingChatButton
        onOpen={() => {
          setChatBoardInitialTab('ai');
          setIsChatBoardOpen(true);
        }}
      />

      {/* Unified Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        initialRole={modalInitialRole}
        onClose={() => setIsLoginModalOpen(false)}
        onNavigateToRegistration={() => {
          setIsLoginModalOpen(false);
          setCurrentPage('register');
        }}
        onNavigateToActivation={() => {
          setIsLoginModalOpen(false);
          setCurrentPage('activate_skater');
        }}
      />

      <ChatBoardModal
        isOpen={isChatBoardOpen}
        onClose={() => setIsChatBoardOpen(false)}
        initialTab={chatBoardInitialTab}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
