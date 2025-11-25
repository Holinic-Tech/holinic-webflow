import type { QuestionConfig, ImageAnswer, TextOptionAnswer, FeedbackAnswer, CheckboxAnswer } from '../../types';
import {
  ImageCardQuestion,
  HeroQuestion,
  TextOptionQuestion,
  MultiSelectQuestion,
  FeedbackCardQuestion,
  SliderQuestion,
} from '../questions';

interface QuestionRendererProps {
  question: QuestionConfig;
  selectedAnswers: string[];
  sliderValue?: number;
  isFirstQuestion?: boolean;
  onSelectAnswer: (answerId: string) => void;
  onToggleAnswer: (answerId: string) => void;
  onSliderChange: (value: number) => void;
  onNoneOfAbove: (noneOptionId: string) => void;
  onNext: () => void;
  onSkip?: () => void;
}

export function QuestionRenderer({
  question,
  selectedAnswers,
  sliderValue,
  isFirstQuestion = false,
  onSelectAnswer,
  onToggleAnswer,
  onSliderChange,
  onNoneOfAbove,
  onNext,
  onSkip,
}: QuestionRendererProps) {
  // Questions that should use single-column layout with small images
  const singleColumnQuestions = ['hairConcern', 'knowledgeState', 'hairqare'];

  switch (question.format) {
    case 'imageCard':
      // Use hero layout for first question
      if (isFirstQuestion) {
        return (
          <HeroQuestion
            questionText={question.questionText}
            subtitle={question.subtitle}
            options={question.options as ImageAnswer[]}
            selectedAnswers={selectedAnswers}
            onSelect={onSelectAnswer}
            onSkip={onSkip}
          />
        );
      }

      // Use single column layout for Q5 (knowledgeState) and Q8 (hairqare)
      if (singleColumnQuestions.includes(question.id)) {
        return (
          <TextOptionQuestion
            questionText={question.questionText}
            subtitle={question.subtitle}
            options={(question.options as ImageAnswer[]).map(opt => ({
              id: opt.id,
              answer: opt.answer,
              title: opt.answer,
              image: opt.image,
            }))}
            selectedAnswers={selectedAnswers}
            onSelect={onSelectAnswer}
            showImages={true}
          />
        );
      }

      return (
        <ImageCardQuestion
          questionText={question.questionText}
          subtitle={question.subtitle}
          options={question.options as ImageAnswer[]}
          selectedAnswers={selectedAnswers}
          onSelect={onSelectAnswer}
          variant="large"
          questionId={question.id}
        />
      );

    case 'textOption':
      return (
        <TextOptionQuestion
          questionText={question.questionText}
          subtitle={question.subtitle}
          options={question.options as TextOptionAnswer[]}
          selectedAnswers={selectedAnswers}
          onSelect={onSelectAnswer}
        />
      );

    case 'multiSelect':
      return (
        <MultiSelectQuestion
          questionText={question.questionText}
          subtitle={question.subtitle}
          options={question.options as CheckboxAnswer[]}
          selectedAnswers={selectedAnswers}
          onToggle={onToggleAnswer}
          onNoneOfAbove={onNoneOfAbove}
        />
      );

    case 'feedbackCard':
      return (
        <FeedbackCardQuestion
          questionText={question.questionText}
          subtitle={question.subtitle}
          options={question.options as FeedbackAnswer[]}
          selectedAnswers={selectedAnswers}
          onSelect={onSelectAnswer}
          onContinue={onNext}
        />
      );

    case 'slider':
      return (
        <SliderQuestion
          questionText={question.questionText}
          subtitle={question.subtitle}
          minLabel={question.minLabel || 'Not at all'}
          maxLabel={question.maxLabel || 'Totally'}
          value={sliderValue}
          onChange={onSliderChange}
        />
      );

    default:
      return (
        <div className="text-center text-gray-500">
          Unknown question format: {question.format}
        </div>
      );
  }
}
