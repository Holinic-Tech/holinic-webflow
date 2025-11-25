import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUserStore, useQuizStore } from '../../store';
import { trackQuizCompleted } from '../../services';

// Module-level flag to prevent double-firing in React Strict Mode
let quizCompletedFired = false;

interface FormData {
  name: string;
  email: string;
}

interface LeadCaptureFormProps {
  onSubmit: () => void;
}

// Map hair concern to display text
const concernTextMap: Record<string, string> = {
  concern_hairloss: 'hair loss',
  concern_splitends: 'split-ends',
  concern_scalp: 'scalp issues',
  concern_damage: 'damaged hair',
  concern_mixed: 'hair problems',
};

// Convert string to Title Case
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Position for tracking (email capture is position 18)
const EMAIL_CAPTURE_POSITION = 18;

// Matches Flutter LoginComponentWidget exactly
export function LeadCaptureForm({ onSubmit }: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setFullName, setUserInfo } = useUserStore();
  const { answers } = useQuizStore();

  // Track Quiz Completed on mount (before form submit) - Flutter: login_component_widget.dart:52
  useEffect(() => {
    if (!quizCompletedFired) {
      quizCompletedFired = true;
      trackQuizCompleted(EMAIL_CAPTURE_POSITION);
    }
  }, []);

  // Get concern text for personalization
  const hairConcern = answers.hairConcern as string;
  const concernText = concernTextMap[hairConcern] || 'hair problems';

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const onFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    // Convert name to Title Case
    const titleCaseName = toTitleCase(data.name);

    // Store user info
    setFullName(titleCaseName);
    setUserInfo({ email: data.email });

    // Small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    onSubmit();
  };

  return (
    <div className="h-[calc(100dvh-60px)] flex flex-col bg-white overflow-hidden">
      <div className="flex-1 max-w-[500px] mx-auto w-full px-[30px] py-4 overflow-hidden flex flex-col">
        {/* Header - "Your results are ready!" */}
        <h2 className="text-[24px] font-medium text-[#3A2D32] text-center font-inter flex-shrink-0">
          Your results are ready!
        </h2>

        {/* Subheading */}
        <p className="text-sm font-medium text-[#3A2D32] text-center mt-1 font-inter flex-shrink-0">
          On the next screen, you'll see...
        </p>

        {/* Personalized probability statement */}
        <p className="text-xs text-[#3A2D32] text-center mt-4 font-inter flex-shrink-0">
          Probability to fix your {concernText} in 14 days 🔒
        </p>

        {/* Progress Bar - 80% filled */}
        <div className="w-full max-w-[470px] mx-auto mt-2 flex-shrink-0">
          <div
            className="w-full h-[20px] rounded-[20px] overflow-hidden"
            style={{ backgroundColor: '#D9D9D9' }}
          >
            <div
              className="h-full rounded-[20px]"
              style={{
                width: '80%',
                background: 'linear-gradient(90deg, #7375A6 0%, #B1BAE3 50%, #F2DAC6 100%)',
              }}
            />
          </div>
        </div>

        {/* Form Card - Gradient background */}
        <div
          className="mt-4 rounded-[6px] px-[10px] py-4 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(115, 117, 166, 0.25) 0%, rgba(177, 186, 227, 0.6) 50%, rgba(242, 218, 198, 0.62) 100%)',
            border: '1px solid #7375A6',
          }}
        >
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3">
            {/* Name field */}
            <div className="px-[8px]">
              <label
                htmlFor="name"
                className="block text-sm font-normal text-[#3A2D32] mb-1 font-inter"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                className={`
                  w-full px-3 py-2.5 rounded-[6px] text-base font-inter
                  transition-colors duration-200
                  focus:outline-none
                  ${errors.name
                    ? 'border-[#FF5963] bg-white'
                    : 'border-white bg-white focus:border-[#7375A6]'
                  }
                `}
                style={{
                  color: '#3A2D32',
                  border: errors.name ? '1px solid #FF5963' : '1px solid white',
                }}
                {...register('name', {
                  required: 'Name is required',
                })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-[#FF5963] font-inter">{errors.name.message}</p>
              )}
            </div>

            {/* Email field */}
            <div className="px-[8px] pt-2">
              <label
                htmlFor="email"
                className="block text-sm font-normal text-[#3A2D32] mb-1 font-inter"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`
                  w-full px-3 py-2.5 rounded-[6px] text-base font-inter
                  transition-colors duration-200
                  focus:outline-none
                  ${errors.email
                    ? 'border-[#FF5963] bg-white'
                    : 'border-white bg-white focus:border-[#7375A6]'
                  }
                `}
                style={{
                  color: '#3A2D32',
                  border: errors.email ? '1px solid #FF5963' : '1px solid white',
                }}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter valid email',
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-[#FF5963] font-inter">{errors.email.message}</p>
              )}
            </div>

            {/* Submit button - Orange #FF6E00, fully rounded */}
            <div className="px-[8px] pt-3">
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`
                  w-full h-[44px] rounded-full font-medium text-base font-inter text-white
                  transition-all duration-200
                  ${isValid && !isSubmitting
                    ? 'hover:brightness-110 active:scale-[0.98]'
                    : 'opacity-50 cursor-not-allowed'
                  }
                `}
                style={{ backgroundColor: '#FF6E00' }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security notice - at bottom */}
        <p className="text-xs text-center mt-4 px-[5px] font-inter flex-shrink-0 pb-2" style={{ color: '#C5C5C5' }}>
          Your info is 100% secure and never shared
        </p>
      </div>
    </div>
  );
}
