import { Library, LineChart, Trophy, Sparkles } from 'lucide-react';
import ShaderBackground from "@/components/ui/shader-background";
import FloatingBook from "@/components/ui/floating-book";
import './App.css';

function App() {
  return (
    <div className="h-screen w-screen flex items-center justify-center p-4 overflow-hidden relative font-serif text-brand-text">
      <ShaderBackground />

      {/* Floating Books Background Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Top Left */}
        <FloatingBook 
          width={160} height={120} color="#e9c46a" 
          className="top-[10%] left-[5%]" 
          rotateZ={15} delay={0} duration={6} flapDuration={1.2}
        />
        {/* Bottom Right */}
        <FloatingBook 
          width={180} height={140} color="#3d1c0b" 
          className="bottom-[15%] right-[8%]" 
          rotateZ={-10} delay={2} duration={7} flapDuration={1.5}
        />
        {/* Top Right (Far) */}
        <FloatingBook 
          width={120} height={90} color="#d5941d" 
          className="top-[15%] right-[15%] opacity-80" 
          rotateZ={-20} delay={4} duration={8} flapDuration={1.0}
        />
        {/* Bottom Left (Blurry/Close) */}
        <FloatingBook 
          width={220} height={160} color="#5c3a2a" 
          className="bottom-[5%] left-[10%] blur-[1px]" 
          rotateZ={5} delay={1} duration={9} flapDuration={1.8}
        />
      </div>

      <div className="w-full max-w-[1000px] bg-brand-bg/85 backdrop-blur-md relative p-8 md:p-12 rounded-2xl shadow-md border border-brand-accent/20 z-10 scale-[0.85] origin-center">
        {/* Decorative Corners */}
        <div className="absolute w-10 h-10 border-brand-accent/80 border-solid pointer-events-none top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl-lg"></div>
        <div className="absolute w-10 h-10 border-brand-accent/80 border-solid pointer-events-none top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr-lg"></div>
        <div className="absolute w-10 h-10 border-brand-accent/80 border-solid pointer-events-none bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-lg"></div>
        <div className="absolute w-10 h-10 border-brand-accent/80 border-solid pointer-events-none bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-lg"></div>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 items-center text-center md:text-left">
          {/* Left Column: Branding, Title, QR */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="font-bold text-2xl mb-3 block tracking-tighter text-brand-text">ReadRacing by Aidar Altynbek 10S</div>
            <h1 className="text-4xl md:text-5xl leading-tight mb-4 font-bold">
              Читай. <span className="text-brand-accent-dark italic">Соревнуйся.</span> Побеждай.
            </h1>
            <p className="text-lg text-brand-text-light mb-7 italic max-w-[480px] mx-auto md:mx-0">
              Преврати чтение книг в захватывающую гонку за знаниями. Твой личный тренер и библиотека в одном приложении.
            </p>

            <div className="bg-white rounded-2xl p-3 shadow-md border border-brand-accent/20 inline-flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              <img src="/ReadRacing.png" alt="ReadRacing QR Code" className="w-[140px] h-[140px] object-contain block" />
              <img src="/landing-logo.png" alt="ReadRacing Logo" className="w-[140px] h-[140px] object-contain block" />
            </div>
          </div>

          {/* Right Column: Features */}
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <FeatureItem 
              icon={<Library className="w-5 h-5" />}
              title="Личная полка"
              description="Все книги под рукой. Организуй библиотеку так, как удобно тебе."
            />
            <FeatureItem 
              icon={<LineChart className="w-5 h-5" />}
              title="Аналитика чтения"
              description="Отслеживай скорость и прогресс в реальном времени."
            />
            <FeatureItem 
              icon={<Trophy className="w-5 h-5" />}
              title="Лидерборд"
              description="Обгоняй друзей и становись лучшим в рейтинге наград."
            />
            <FeatureItem 
              icon={<Sparkles className="w-5 h-5" />}
              title="AI-Заметки"
              description="Умный помощник поможет выделить главное из прочитанного."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-sm border border-brand-accent/15 transition-transform hover:translate-x-2 hover:border-brand-accent/40 text-left">
      <div className="text-brand-accent-dark shrink-0 bg-brand-accent/15 w-9 h-9 flex items-center justify-center rounded-lg mt-0.5">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-sm text-brand-text-light leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default App;
