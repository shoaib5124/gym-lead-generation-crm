"use client";
import { useState } from 'react';
import {Navbar} from "./components/Navbar";
import {Hero} from "./components/Hero";
import {Stats} from "./components/Stats";
import {SignaturePrograms} from "./components/SignatureProgram";
import {IronForgeStandard} from "./components/IronForgeSignature";
import {MobileBottomNav} from "./components/MobileBottomNav";
import {FreeTrialForm} from "./components/FreeTrialForm";


export default function Home() {
   const [activeTab, setActiveTab] = useState<string>('programs');

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'programs') {
      scrollToSection('programs');
    } else if (tabId === 'trainers') {
      scrollToSection('about');
    } else if (tabId === 'pricing') {
      scrollToSection('trial');
    } else if (tabId === 'about') {
      scrollToSection('about');
    }
  };
  return (
    <main className="min-h-screen bg-black">
      <Navbar onTrialClick={() => scrollToSection('trial')} />
      <Hero 
       onTrialClick={() => scrollToSection('trial')}
       onProgramsClick={() => scrollToSection('programs')}
       />
      <Stats />
      <SignaturePrograms />
      <IronForgeStandard/>
       {/* 7. Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <FreeTrialForm/>  
    </main>
  );
}