import { useEffect, useState, useRef } from 'react';
import { useQuizStore, useUserStore } from '../../store';
import { getCouponCode } from '../../data';
import { trackQuizCompleted, trackCTAClicked, trackResultPageView } from '../../services';
import { submitToWebhook } from '../../services';
import { FloatingTimerBar } from './FloatingTimerBar';
import {
  ageAvatars,
  ageSummaryText,
  contextImages,
  timelineImages,
  goalDescriptions,
  concernTextMap,
  scoreTestimonialText,
  testimonialImages,
  closingImages,
  ratingsBackgroundImage,
  challengeBenefits,
  benefitsCardContent,
} from '../../data/dashboardContent';
import { buildCheckoutUrl } from '../../utils';

// Matches Flutter Dashboard widget - Complete implementation
export function ResultPage() {
  const { answers } = useQuizStore();
  const userInfo = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Track scroll position to update carousel dots
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const itemWidth = carousel.scrollWidth / carousel.children.length;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentTestimonialIndex(newIndex);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  // Get values from answers
  const hairConcern = (answers.hairConcern as string) || 'concern_mixed';
  const hairGoal = (answers.hairGoal as string) || 'goal_both';
  const age = (answers.age as string) || 'age_30_39';
  const diet = answers.diet as string;

  // Calculate coupon code
  const couponCode = getCouponCode(hairConcern, diet);

  // Get personalized content
  const ageAvatar = ageAvatars[age] || ageAvatars.age_30_39;
  const ageSummary = ageSummaryText[age] || 'Summary';
  const contextImage = contextImages[hairConcern] || contextImages.concern_mixed;
  const timelineImage = timelineImages[hairConcern] || timelineImages.concern_mixed;
  const goalDescription = goalDescriptions[hairConcern] || goalDescriptions.concern_mixed;
  const concernText = concernTextMap[hairConcern] || concernTextMap.concern_mixed;
  const scoreTestimonial = scoreTestimonialText[hairGoal] || scoreTestimonialText.goal_both;
  const testimonials = testimonialImages[hairConcern] || testimonialImages.concern_mixed;
  const closingImage = closingImages[hairConcern] || closingImages.concern_mixed;

  const userName = userInfo.firstName || userInfo.name || 'You';

  // Random seats remaining (3-14), set once on page load
  const [seatsRemaining] = useState(() => Math.floor(Math.random() * 12) + 3);

  // Random matching score (89-96%), set once on page load
  const [matchingScore] = useState(() => Math.floor(Math.random() * 8) + 89);

  useEffect(() => {
    const initializeResults = async () => {
      setIsLoading(true);

      // Track result page view
      trackResultPageView();

      // Track quiz completion and submit to webhook
      if (userInfo.email) {
        trackQuizCompleted(answers, {
          email: userInfo.email,
          name: userInfo.name,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
        });

        await submitToWebhook(
          answers,
          {
            name: userInfo.name,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
          },
          couponCode
        );
      }

      setIsLoading(false);
    };

    initializeResults();
  }, []);

  const handleCTAClick = () => {
    const checkoutUrl = buildCheckoutUrl(
      {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
      },
      couponCode
    );

    trackCTAClicked(checkoutUrl);
    window.location.href = checkoutUrl;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div
          className="w-16 h-16 border-4 rounded-full animate-spin mb-4"
          style={{ borderColor: '#E8EBFC', borderTopColor: '#7375A6' }}
        />
        <p className="text-[#696969] font-inter">Loading your results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[500px] mx-auto px-5 pb-8">

        {/* SECTION 0: CONGRATULATIONS */}
        <div className="pt-[25px] pb-2">
          <p
            className="text-[18px] font-medium text-center font-inter"
            style={{ color: '#D4A574' }}
          >
            Congratulations, {userName}!
          </p>
        </div>

        {/* SECTION 1: WELCOME MESSAGE */}
        <div className="pb-[25px]">
          <h1
            className="text-[20px] md:text-[27px] font-medium text-center font-inter"
            style={{ color: '#404F5F' }}
          >
            You are a perfect fit for the Haircare Challenge 😍
          </h1>
        </div>

        {/* SECTION 2: SCORE CARD */}
        <div
          className="rounded-[14px] p-4 mb-5"
          style={{
            background: 'linear-gradient(135deg, rgba(232, 235, 252, 0.8) 0%, rgba(177, 186, 227, 0.6) 100%)',
            border: '2px solid #7375A6',
          }}
        >
          <p className="text-[18px] font-semibold text-center font-inter mb-3" style={{ color: '#404F5F' }}>
            Your matching score is
          </p>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex-1 h-[30px] rounded-[50px] overflow-hidden"
              style={{
                backgroundColor: '#F5F5F5',
                boxShadow: '5px 5px 5px rgba(180, 180, 180, 0.3)',
              }}
            >
              <div
                className="h-full rounded-[50px] transition-all duration-500"
                style={{
                  width: `${matchingScore}%`,
                  backgroundColor: '#4CAF50',
                }}
              />
            </div>
            <span
              className="text-[20px] md:text-[28px] font-medium font-inter"
              style={{ color: '#4CAF50' }}
            >
              {matchingScore}%
            </span>
          </div>

          <p className="text-center font-inter mb-2" style={{ color: '#404F5F' }}>
            That's an outstanding score!
          </p>

          <p className="text-sm text-center font-inter" style={{ color: '#404F5F' }}>
            {scoreTestimonial}
          </p>
        </div>

        {/* SECTION 3: PERSONALIZATION CARD */}
        <div
          className="rounded-[14px] p-4 mb-5"
          style={{
            background: 'linear-gradient(135deg, rgba(232, 235, 252, 0.6) 0%, rgba(242, 218, 198, 0.4) 100%)',
            border: '2px solid #7375A6',
          }}
        >
          {/* Two-column layout */}
          <div className="flex gap-3 mb-4">
            {/* Left Column - User Info */}
            <div className="flex-1 flex flex-col items-center">
              <img
                src={ageAvatar}
                alt="Age avatar"
                className="w-[80px] h-[80px] rounded-lg mb-2"
              />
              <p className="text-[18px] font-semibold font-inter" style={{ color: '#404F5F' }}>
                {userName}
              </p>
              <p className="text-base font-inter" style={{ color: '#404F5F' }}>
                {ageSummary}
              </p>
            </div>

            {/* Vertical Divider */}
            <div className="w-[1px] bg-[#7375A6] opacity-50" />

            {/* Right Column - Goal */}
            <div className="flex-1">
              <p className="text-[18px] font-inter mb-2" style={{ color: '#7375A6' }}>
                My Goal:
              </p>
              <p className="text-base font-inter leading-relaxed" style={{ color: '#404F5F' }}>
                {goalDescription}
              </p>
            </div>
          </div>

          {/* Timeline Header */}
          <p className="text-[16px] font-medium font-inter mb-2" style={{ color: '#7375A6' }}>
            Your hair transformation timeline:
          </p>

          {/* Context Image - condition-specific illustration */}
          <img
            src={contextImage}
            alt="Hair condition illustration"
            className="w-full h-auto rounded-lg mb-3"
          />

          {/* Timeline Image */}
          <img
            src={timelineImage}
            alt="Progress timeline"
            className="w-full h-auto rounded-lg"
            style={{ marginBottom: '15px' }}
          />
        </div>

        {/* SECTION 4: ENCOURAGEMENT TEXT */}
        <div className="text-center mb-5">
          <p
            className="text-[18px] font-medium font-inter mb-4"
            style={{ color: '#D4A574' }}
          >
            You deserve this, {userName}!
          </p>

          <p
            className="text-[22px] font-normal font-inter leading-relaxed mb-3"
            style={{ color: '#404F5F' }}
          >
            Join the 14-Day Haircare Challenge and say goodbye to your{' '}
            <span className="font-medium">{concernText}</span> permanently with a routine that works.
          </p>

          <p
            className="text-[17px] italic font-inter"
            style={{ color: '#404F5F' }}
          >
            No more frustration or disappointments!
          </p>
        </div>

        {/* SECTION 5: CHALLENGE BENEFITS */}
        <div className="mb-5">
          {challengeBenefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 mb-3">
              <span className="text-green-500 text-xl flex-shrink-0">✓</span>
              <p className="font-inter" style={{ color: '#404F5F' }}>
                {benefit}
              </p>
            </div>
          ))}
        </div>

        {/* SECTION 6: CTA BUTTON #1 */}
        <div className="flex justify-center py-[25px]">
          <button
            onClick={handleCTAClick}
            className="w-[70%] h-[50px] rounded-[25px] font-semibold text-base text-white font-inter transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{ backgroundColor: '#FF6E00' }}
          >
            JOIN THE CHALLENGE
          </button>
        </div>

        {/* SECTION 7: SOCIAL PROOF STATS */}
        <div className="text-center mb-4 px-4">
          <p className="text-[24px] font-light font-inter leading-[1.3]">
            <span style={{ color: '#FF6E00' }}>200,000+ women </span>
            <span style={{ color: '#404F5F' }}>have taken this challenge, and </span>
            <span className="font-bold" style={{ color: '#FF6E00' }}>95% reported visibly better hair after 14 days.</span>
          </p>
        </div>

        {/* Ratings Background Image */}
        <div className="mb-5 p-[5px]">
          <img
            src={ratingsBackgroundImage}
            alt="Ratings"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* SECTION 8: TESTIMONIAL CAROUSEL */}
        <div className="mb-5">
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 snap-center"
              >
                <img
                  src={image}
                  alt={`Testimonial ${index + 1}`}
                  className="h-[350px] w-auto rounded-lg"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Carousel Navigation Dots */}
          <div className="flex justify-center gap-2 mt-2">
            {testimonials.slice(0, 5).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: index === currentTestimonialIndex ? '#FF6E00' : '#D9D9D9',
                }}
              />
            ))}
          </div>
        </div>

        {/* SECTION 9: CTA BUTTON #2 */}
        <div className="flex justify-center py-[20px]">
          <button
            onClick={handleCTAClick}
            className="w-[70%] h-[50px] rounded-[25px] font-semibold text-base text-white font-inter transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{ backgroundColor: '#FF6E00' }}
          >
            START MY CHALLENGE
          </button>
        </div>

        {/* SECTION 10: RECOMMENDATION TEXT */}
        <div className="text-center mb-4 px-4">
          <p className="text-[17px] font-inter leading-[1.4]" style={{ color: '#404F5F' }}>
            Based on your answers, you just need
          </p>
          <p className="text-[22px] font-semibold font-inter leading-[1.3] my-2" style={{ color: '#404F5F' }}>
            10 min a day, for 14 days
          </p>
          <p className="text-[17px] font-inter leading-[1.4]" style={{ color: '#404F5F' }}>
            to get beautiful and healthy hair that turns heads and boosts your confidence every single day.
          </p>
        </div>

        {/* SECTION 10.5: DAYS IMAGE */}
        <div className="mb-5 px-2">
          <img
            src="https://ccm.hairqare.co/Result_Page-_Days_Images_copy_4.webp"
            alt="14 Day transformation"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* SECTION 11: BENEFITS CARD */}
        <div
          className="rounded-lg p-6 mb-5"
          style={{
            backgroundColor: '#F8F9FC',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          {benefitsCardContent.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 mb-4">
              <div
                className="w-[30px] h-[30px] rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#E8EBFC' }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#7375A6"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-inter text-base" style={{ color: '#404F5F' }}>
                {benefit.fullText.split(benefit.boldText)[0]}
                <span className="font-semibold">{benefit.boldText}</span>
              </p>
            </div>
          ))}

          {/* Urgency Text */}
          <p className="text-center text-[15px] font-inter mt-4" style={{ color: '#FF6E00' }}>
            Only <span className="font-semibold">{seatsRemaining}</span> seats remaining. Hurry Up!
          </p>
        </div>

        {/* SECTION 12: CLOSING IMAGE */}
        <div className="mb-5">
          <img
            src={closingImage}
            alt="Success story"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* SECTION 13: CLOSING TEXT */}
        <div className="text-center mb-5">
          <p className="text-base font-inter" style={{ color: '#404F5F' }}>
            Start your transformation today and see visible results in just 14 days!
          </p>
        </div>

        {/* SECTION 14: CTA BUTTON #3 */}
        <div className="mb-5">
          <button
            onClick={handleCTAClick}
            className="w-full h-[50px] rounded-[25px] font-semibold text-base text-white font-inter transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{ backgroundColor: '#FF6E00' }}
          >
            START MY CHALLENGE
          </button>
        </div>

        {/* SECTION 15: REFUND GUARANTEE FOOTER */}
        <div className="text-center py-4 pb-24">
          <p className="text-sm font-inter" style={{ color: '#696969' }}>
            100% Refund guarantee | No Questions Asked
          </p>
        </div>
      </div>

      {/* Floating Timer Bar */}
      <FloatingTimerBar onCTAClick={handleCTAClick} initialMinutes={30} />
    </div>
  );
}
