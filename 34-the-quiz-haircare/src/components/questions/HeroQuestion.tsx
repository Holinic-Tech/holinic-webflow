import type { ImageAnswer } from '../../types';

interface HeroQuestionProps {
  questionText: string;
  subtitle?: string;
  options: ImageAnswer[];
  selectedAnswers: string[];
  onSelect: (answerId: string) => void;
  onSkip?: () => void;
}

// First screen with full background image - matches Flutter ImageBackgroundQuesBodyWidget exactly
export function HeroQuestion({
  options,
  selectedAnswers,
  onSelect,
  onSkip,
}: HeroQuestionProps) {
  // Background image from Flutter source
  const backgroundImage = 'https://assets.hairqare.co/sarah-quiz-start-cover.webp';
  const logoImage = 'https://assets.hairqare.co/Hairqare_white_logo_1.webp';

  return (
    <div
      className="h-screen max-h-screen flex flex-col relative overflow-hidden w-full max-w-[500px] mx-auto"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      {/* Content container - Flutter: Padding 15, 40, 15, 40 mobile */}
      <div className="relative z-10 flex flex-col h-full flex-1 px-[15px] py-10 justify-between">
        {/* Top section with logo and question text */}
        <div className="flex flex-col items-center">
          {/* Logo - Flutter: 80x18 mobile, 100x20 desktop */}
          <img
            src={logoImage}
            alt="HairQare"
            className="w-20 h-[18px] md:w-[100px] md:h-5 object-contain"
          />

          {/* Main headline - larger text */}
          <h2 className="mt-[45px] text-[24px] md:text-[32px] font-medium text-white text-center leading-tight font-inter">
            See if the Challenge is a fit for you and your hair profile
          </h2>
        </div>

        {/* Bottom section with instruction and options */}
        <div className="flex flex-col items-center">
          {/* Instruction text - Flutter: margin-top 45px, font 20px, min 18px */}
          <p className="mt-[45px] text-white text-[18px] md:text-xl font-medium text-center font-inter">
            Start by selecting your goal:
          </p>

          {/* Animated arrow - Flutter: size 30 */}
          <div className="animate-bounce my-2">
            <svg className="w-[30px] h-[30px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Two main option buttons - Flutter: maxWidth 650, gap 20, padding 10 start/end, height 60/80 */}
          <div className="flex gap-5 w-full max-w-[650px] px-[10px] mt-5">
            {options.slice(0, 2).map((option) => (
              <button
                key={option.id}
                onClick={() => onSelect(option.id)}
                className="flex-1 h-[60px] md:h-[80px] bg-white/85 rounded-[5px] flex items-center justify-center px-[5px] py-[2px] transition-all duration-200 hover:bg-white active:scale-[0.98]"
              >
                {/* Flutter: font 16px mobile, 19px desktop, min 10px, max 2 lines */}
                <span className="text-[16px] md:text-[19px] font-medium text-[#3A2D32] text-center leading-tight font-inter">
                  {option.answer}
                </span>
              </button>
            ))}
          </div>

          {/* "I want BOTH" checkbox option - Flutter: margin 20 top/bottom */}
          {options[2] && (
            <button
              onClick={() => onSelect(options[2].id)}
              className="flex items-center gap-[5px] py-5 mt-5"
            >
              {/* Circle checkbox - Flutter: CircleBorder shape */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedAnswers.includes(options[2].id)
                  ? 'bg-[#7375A6] border-[#7375A6]'
                  : 'border-white/70'
              }`}>
                {selectedAnswers.includes(options[2].id) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {/* Flutter: font 16px mobile, 19px desktop, min 13px, underlined */}
              <span className="text-white text-[16px] md:text-[19px] font-medium underline font-inter leading-[1.2]">
                {options[2].answer}
              </span>
            </button>
          )}

          {/* Skip quiz link - Flutter: font 14-16px, underlined, padding-bottom 10 */}
          {onSkip && (
            <button
              onClick={onSkip}
              className="text-white text-sm md:text-base underline pb-[10px] font-inter hover:opacity-80 transition-opacity"
            >
              Skip the Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
