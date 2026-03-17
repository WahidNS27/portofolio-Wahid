import Navbar from '../../components/public/Navbar';
import HeroSection from '../../components/public/HeroSection';
import AboutSection from '../../components/public/AboutSection';
import ProjectsSection from '../../components/public/ProjectsSection';
import TimelineSection from '../../components/public/TimelineSection';
import CertificatesSection from '../../components/public/CertificatesSection';
import ContactSection from '../../components/public/ContactSection';
import Footer from '../../components/public/Footer';

export default function HomePage() {
  return (
    <div className="dark min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <TimelineSection />
        <CertificatesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
