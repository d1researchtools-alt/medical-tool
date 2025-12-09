'use client';

import React, { useState } from 'react';
import { QUESTIONS } from '@/lib/questions';
import { UserAnswers, GeneratedPlan } from '@/lib/types';
import { generateSessionId, formatDate, sanitizeFilename } from '@/lib/utils';

type AppStep = 'landing' | 'email-gate' | 'questionnaire' | 'generating' | 'results';

const initialAnswers: UserAnswers = {
  name: '',
  email: '',
  isPractitioner: null,
  stage: '',
  deviceType: '',
  complexity: '',
  ipStatus: '',
  timeCommitment: '',
  budgetExpectation: '',
  endGoal: '',
  biggestConcern: '',
  employerType: '',
  coinventors: '',
  targetMarkets: '',
  deviceDescription: '',
};

export default function MedicalDeviceIdeaPlanner() {
  const [step, setStep] = useState<AppStep>('landing');
  const [answers, setAnswers] = useState<UserAnswers>(initialAnswers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => generateSessionId());

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex) / (QUESTIONS.length + 1)) * 100);

  // Handle email gate submission
  const handleEmailGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.name && answers.email && answers.isPractitioner !== null) {
      setStep('questionnaire');
    }
  };

  // Handle question answer
  const handleQuestionAnswer = (answer: string) => {
    const key = currentQuestion.dataKey as keyof UserAnswers;
    setAnswers((prev) => ({ ...prev, [key]: answer }));

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Move to device description
      setCurrentQuestionIndex(QUESTIONS.length);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setStep('email-gate');
    }
  };

  // Handle device description submission
  const handleDeviceDescriptionSubmit = async () => {
    if (answers.deviceDescription.length < 200) {
      setError('Please provide at least 200 characters describing your device.');
      return;
    }

    setError(null);
    setStep('generating');

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate plan');
      }

      const data = await response.json();
      setGeneratedPlan(data.plan);
      setStep('results');
    } catch (err) {
      console.error('Error generating plan:', err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      setStep('questionnaire');
      setCurrentQuestionIndex(QUESTIONS.length);
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!generatedPlan) return;

    try {
      const { default: jsPDF } = await import('jspdf');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margins = { top: 20, right: 20, bottom: 20, left: 20 };
      const contentWidth = pageWidth - margins.left - margins.right;
      let currentY = margins.top;

      const checkPageBreak = (neededHeight: number) => {
        if (currentY + neededHeight > pageHeight - margins.bottom) {
          pdf.addPage();
          currentY = margins.top;
          return true;
        }
        return false;
      };

      const addText = (text: string, fontSize: number, style: 'normal' | 'bold' = 'normal', color: number[] = [0, 0, 0]) => {
        pdf.setFont('helvetica', style);
        pdf.setFontSize(fontSize);
        pdf.setTextColor(color[0], color[1], color[2]);
        const lines = pdf.splitTextToSize(text, contentWidth);
        const lineHeight = fontSize * 0.45;
        checkPageBreak(lines.length * lineHeight);
        lines.forEach((line: string) => {
          pdf.text(line, margins.left, currentY);
          currentY += lineHeight;
        });
        return lines.length * lineHeight;
      };

      const addSectionHeader = (title: string) => {
        currentY += 5;
        checkPageBreak(15);
        pdf.setDrawColor(255, 102, 0);
        pdf.setLineWidth(0.5);
        addText(title, 14, 'bold', [255, 102, 0]);
        pdf.line(margins.left, currentY, margins.left + contentWidth, currentY);
        currentY += 5;
      };

      // Header
      pdf.setFillColor(84, 86, 90);
      pdf.rect(0, 0, pageWidth, 25, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Design 1st', margins.left, 15);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Medical Device Idea Planner', pageWidth - margins.right - 50, 15);
      currentY = 35;

      // Title
      addText(generatedPlan.header.title, 18, 'bold', [17, 17, 17]);
      currentY += 2;
      addText(generatedPlan.header.subtitle, 11, 'normal', [84, 86, 90]);
      currentY += 2;
      addText(`Generated: ${generatedPlan.header.generatedDate}`, 9, 'normal', [128, 128, 128]);
      currentY += 8;

      // Section 1: Where You Are Now
      addSectionHeader('1. Where You Are Now');
      addText(generatedPlan.sections.whereYouAreNow, 10, 'normal');
      currentY += 5;

      // Section 2: Regulatory Pathway
      addSectionHeader('2. Your Likely Regulatory Pathway');
      addText(generatedPlan.sections.regulatoryPathway, 10, 'normal');
      currentY += 5;

      // Section 3: Next 3 Steps
      addSectionHeader('3. Your Next 3 Steps');
      generatedPlan.sections.nextThreeSteps.forEach((step, index) => {
        checkPageBreak(10);
        addText(`${index + 1}. ${step}`, 10, 'normal');
        currentY += 2;
      });
      currentY += 3;

      // Section 4: Timeline
      addSectionHeader('4. Realistic Timeline');
      generatedPlan.sections.timeline.forEach((milestone) => {
        checkPageBreak(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${milestone.milestone}:`, margins.left, currentY);
        pdf.setFont('helvetica', 'normal');
        pdf.text(milestone.timeframe, margins.left + 70, currentY);
        currentY += 5;
      });
      currentY += 3;

      // Section 5: Budget Reality Check
      addSectionHeader('5. Budget Reality Check');
      addText(generatedPlan.sections.budgetRealityCheck.expectationComparison, 10, 'normal');
      currentY += 5;
      addText('Budget Breakdown:', 10, 'bold');
      currentY += 2;
      generatedPlan.sections.budgetRealityCheck.breakdown.forEach((item) => {
        checkPageBreak(6);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${item.category}:`, margins.left + 5, currentY);
        pdf.text(item.range, margins.left + 80, currentY);
        currentY += 5;
      });
      currentY += 2;
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      const disclaimerLines = pdf.splitTextToSize(generatedPlan.sections.budgetRealityCheck.disclaimer, contentWidth);
      disclaimerLines.forEach((line: string) => {
        checkPageBreak(4);
        pdf.text(line, margins.left, currentY);
        currentY += 4;
      });
      currentY += 5;

      // Section 6: Key Risks
      addSectionHeader('6. Key Risks to Address Early');
      generatedPlan.sections.keyRisks.forEach((risk) => {
        checkPageBreak(20);
        const riskColors: Record<string, number[]> = {
          HIGH: [220, 38, 38],
          MEDIUM: [234, 88, 12],
          LOW: [22, 163, 74],
        };
        const color = riskColors[risk.severity] || [0, 0, 0];
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(color[0], color[1], color[2]);
        pdf.text(`[${risk.severity}] ${risk.title}`, margins.left, currentY);
        currentY += 5;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        const riskLines = pdf.splitTextToSize(risk.description, contentWidth - 5);
        riskLines.forEach((line: string) => {
          pdf.text(line, margins.left + 5, currentY);
          currentY += 4;
        });
        currentY += 3;
      });

      // Section 7: Design 1st Focus
      addSectionHeader('7. What Design 1st Would Focus On First');
      addText('Based on your situation, if you engaged Design 1st, we would likely start by:', 10, 'normal');
      currentY += 3;
      generatedPlan.sections.designFirstFocus.forEach((focus, index) => {
        checkPageBreak(8);
        addText(`${index + 1}. ${focus}`, 10, 'normal');
        currentY += 2;
      });
      currentY += 5;

      // Section 8: CTA
      checkPageBreak(30);
      pdf.setFillColor(255, 243, 230);
      pdf.rect(margins.left, currentY, contentWidth, 35, 'F');
      currentY += 8;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(255, 102, 0);
      pdf.text(generatedPlan.sections.callToAction.headline, margins.left + 5, currentY);
      currentY += 6;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(84, 86, 90);
      const ctaLines = pdf.splitTextToSize(generatedPlan.sections.callToAction.body, contentWidth - 10);
      ctaLines.forEach((line: string) => {
        pdf.text(line, margins.left + 5, currentY);
        currentY += 4;
      });
      currentY += 4;
      pdf.setTextColor(255, 102, 0);
      pdf.textWithLink('Book Free Project Review', margins.left + 5, currentY, {
        url: generatedPlan.sections.callToAction.calendlyLink,
      });

      // Footer
      const footerY = pageHeight - 10;
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Generated by Design 1st Medical Device Idea Planner', pageWidth / 2, footerY, { align: 'center' });

      // Save
      const filename = `Design1st_DevicePlan_${sanitizeFilename(answers.deviceType)}_${formatDate(new Date()).replace(/,?\s+/g, '_')}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Restart
  const handleRestart = () => {
    setStep('landing');
    setAnswers(initialAnswers);
    setCurrentQuestionIndex(0);
    setGeneratedPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#54565a]">
        <div className="px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white font-bold text-lg">Design 1st</span>
            <span className="hidden md:block text-gray-300 text-sm">Medical Device Idea Planner</span>
          </div>
          {step !== 'landing' && (
            <button
              onClick={handleRestart}
              className="px-4 py-2 rounded-lg font-medium text-sm bg-[#ff6600] hover:bg-[#d95000] text-white transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Landing Page */}
          {step === 'landing' && (
            <div className="text-center py-12 animate-fadeIn">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-[#ff6600] rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Medical Device Idea Planner
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  Transform your medical device idea into a clear action plan. Answer a few questions and receive a personalized development roadmap with realistic timelines, budget estimates, and regulatory guidance.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#ff6600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">11 Quick Questions</h3>
                  <p className="text-sm text-gray-600">Structured questions to understand your situation, goals, and constraints.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#ff6600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
                  <p className="text-sm text-gray-600">Get personalized insights based on 16+ years of medical device development experience.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#ff6600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Downloadable Plan</h3>
                  <p className="text-sm text-gray-600">Receive a comprehensive PDF with your personalized development roadmap.</p>
                </div>
              </div>

              <button
                onClick={() => setStep('email-gate')}
                className="px-8 py-4 bg-[#ff6600] hover:bg-[#d95000] text-white font-semibold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Get Your Free Development Plan
              </button>

              <p className="mt-6 text-sm text-gray-500">
                Takes about 5-10 minutes to complete
              </p>
            </div>
          )}

          {/* Email Gate */}
          {step === 'email-gate' && (
            <div className="max-w-md mx-auto py-12 animate-fadeIn">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Let&apos;s get started</h2>
                <p className="text-gray-600 mb-6">We&apos;ll use this information to personalize your development plan.</p>

                <form onSubmit={handleEmailGateSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={answers.name}
                      onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#ff6600] transition-colors"
                      placeholder="First and Last Name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={answers.email}
                      onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#ff6600] transition-colors"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Are you a practicing physician, dentist, or veterinarian?
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setAnswers({ ...answers, isPractitioner: true })}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                          answers.isPractitioner === true
                            ? 'bg-[#ff6600] border-[#ff6600] text-white'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-[#ff6600]'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnswers({ ...answers, isPractitioner: false })}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                          answers.isPractitioner === false
                            ? 'bg-[#ff6600] border-[#ff6600] text-white'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-[#ff6600]'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!answers.name || !answers.email || answers.isPractitioner === null}
                    className="w-full py-4 bg-[#ff6600] hover:bg-[#d95000] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                  >
                    Continue to Questions
                  </button>
                </form>

                <button
                  onClick={() => setStep('landing')}
                  className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* Questionnaire */}
          {step === 'questionnaire' && (
            <div className="py-8 animate-fadeIn">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {currentQuestionIndex < QUESTIONS.length
                      ? `Question ${currentQuestionIndex + 1} of ${QUESTIONS.length}`
                      : 'Final Step'}
                  </span>
                  <span className="text-sm font-medium text-gray-600">{progress}% Complete</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ff6600] progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question Card */}
              {currentQuestionIndex < QUESTIONS.length ? (
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 bg-orange-100 text-[#ff6600] text-xs font-semibold rounded-full">
                      {currentQuestion.dataKey.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQuestion.displayText}</h2>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const key = currentQuestion.dataKey as keyof UserAnswers;
                      const isSelected = answers[key] === option;

                      return (
                        <button
                          key={index}
                          onClick={() => handleQuestionAnswer(option)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'bg-orange-50 border-[#ff6600]'
                              : 'bg-white border-gray-200 hover:border-[#ff6600] hover:bg-gray-50'
                          }`}
                        >
                          <span className={isSelected ? 'text-[#ff6600] font-medium' : 'text-gray-700'}>
                            {option}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Why we ask:</span> {currentQuestion.whyWeAsk}
                    </p>
                  </div>

                  <button
                    onClick={handleBack}
                    className="mt-6 text-sm text-gray-500 hover:text-gray-700"
                  >
                    ← Back
                  </button>
                </div>
              ) : (
                /* Device Description */
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Describe your device idea
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Tell us about your device and the clinical problem it solves. Include what it does, what problem it solves, and how it&apos;s different from existing solutions.
                  </p>

                  <textarea
                    value={answers.deviceDescription}
                    onChange={(e) => setAnswers({ ...answers, deviceDescription: e.target.value })}
                    className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#ff6600] transition-colors resize-none"
                    placeholder="Describe your medical device idea in detail..."
                  />

                  <div className="flex justify-between items-center mt-2 mb-4">
                    <span className={`text-sm ${answers.deviceDescription.length < 200 ? 'text-red-500' : 'text-green-600'}`}>
                      {answers.deviceDescription.length} / 200 minimum characters
                      {answers.deviceDescription.length >= 200 && ' ✓'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {answers.deviceDescription.length} / 2000 max
                    </span>
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleDeviceDescriptionSubmit}
                    disabled={answers.deviceDescription.length < 200}
                    className="w-full py-4 bg-[#ff6600] hover:bg-[#d95000] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                  >
                    Generate My Development Plan
                  </button>

                  <button
                    onClick={handleBack}
                    className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
                  >
                    ← Back to Questions
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Generating State */}
          {step === 'generating' && (
            <div className="py-24 text-center animate-fadeIn">
              <div className="w-16 h-16 mx-auto mb-6">
                <div className="w-full h-full border-4 border-orange-200 border-t-[#ff6600] rounded-full animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Plan</h2>
              <p className="text-gray-600">
                Analyzing your inputs and creating a personalized development roadmap...
              </p>
              <p className="text-sm text-gray-500 mt-4">This usually takes 15-30 seconds</p>
            </div>
          )}

          {/* Results */}
          {step === 'results' && generatedPlan && (
            <div className="py-8 animate-fadeIn">
              {/* Header */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {generatedPlan.header.title}
                    </h1>
                    <p className="text-gray-600">{generatedPlan.header.subtitle}</p>
                    <p className="text-sm text-gray-500 mt-1">Generated: {generatedPlan.header.generatedDate}</p>
                  </div>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-6 py-3 bg-[#ff6600] hover:bg-[#d95000] text-white font-semibold rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Section 1: Where You Are Now */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
                <h2 className="section-header">1. Where You Are Now</h2>
                <p className="text-gray-700 whitespace-pre-line">{generatedPlan.sections.whereYouAreNow}</p>
              </div>

              {/* Section 2: Regulatory Pathway */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
                <h2 className="section-header">2. Your Likely Regulatory Pathway</h2>
                <p className="text-gray-700 whitespace-pre-line">{generatedPlan.sections.regulatoryPathway}</p>
              </div>

              {/* Section 3: Next 3 Steps */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
                <h2 className="section-header">3. Your Next 3 Steps</h2>
                <div className="space-y-4">
                  {generatedPlan.sections.nextThreeSteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#ff6600] text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Timeline */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
                <h2 className="section-header">4. Realistic Timeline</h2>
                <div className="space-y-3">
                  {generatedPlan.sections.timeline.map((milestone, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-900">{milestone.milestone}</span>
                      <span className="text-[#ff6600] font-semibold">{milestone.timeframe}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Budget Reality Check */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
                <h2 className="section-header">5. Budget Reality Check</h2>
                <p className="text-gray-700 mb-6">{generatedPlan.sections.budgetRealityCheck.expectationComparison}</p>

                <h3 className="font-semibold text-gray-900 mb-4">Budget Breakdown</h3>
                <div className="space-y-2 mb-6">
                  {generatedPlan.sections.budgetRealityCheck.breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{item.category}</span>
                      <span className="font-semibold text-gray-900">{item.range}</span>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-500 italic">{generatedPlan.sections.budgetRealityCheck.disclaimer}</p>
              </div>

              {/* Section 6: Key Risks */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
                <h2 className="section-header">6. Key Risks to Address Early</h2>
                <div className="space-y-4">
                  {generatedPlan.sections.keyRisks.map((risk, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 ${
                        risk.severity === 'HIGH'
                          ? 'risk-high'
                          : risk.severity === 'MEDIUM'
                          ? 'risk-medium'
                          : 'risk-low'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold">[{risk.severity}]</span>
                        <span className="font-semibold">{risk.title}</span>
                      </div>
                      <p className="text-sm">{risk.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 7: Design 1st Focus */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
                <h2 className="section-header">7. What Design 1st Would Focus On First</h2>
                <p className="text-gray-600 mb-4">
                  Based on where you are and what you&apos;ve told us, if you engaged Design 1st, we would likely start by:
                </p>
                <div className="space-y-3">
                  {generatedPlan.sections.designFirstFocus.map((focus, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <svg className="w-5 h-5 text-[#ff6600] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-700">{focus}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">
                    <strong>Key positioning:</strong> You keep 100% of your IP. We&apos;re your technical team, not partners or investors. Hourly rate model with no equity stake. Phased development with exit points - pause or stop anytime and keep all work product.
                  </p>
                </div>
              </div>

              {/* Section 8: CTA */}
              <div className={`rounded-2xl p-8 shadow-lg ${generatedPlan.sections.callToAction.showBookingButton ? 'bg-orange-50 border-2 border-[#ff6600]' : 'bg-white'}`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {generatedPlan.sections.callToAction.headline}
                </h2>
                <p className="text-gray-600 mb-6">{generatedPlan.sections.callToAction.body}</p>

                <div className="flex flex-wrap gap-4">
                  {generatedPlan.sections.callToAction.showBookingButton && (
                    <a
                      href={generatedPlan.sections.callToAction.calendlyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-[#ff6600] hover:bg-[#d95000] text-white font-semibold rounded-xl transition-all"
                    >
                      Book Free Project Review
                    </a>
                  )}
                  <button
                    onClick={handleDownloadPDF}
                    className="px-6 py-3 bg-white border-2 border-gray-300 hover:border-[#ff6600] text-gray-700 font-semibold rounded-xl transition-all"
                  >
                    Download Your Plan (PDF)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#54565a] text-white py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-300">
            Powered by Design 1st | 16+ years, 1200+ products, 25+ physician inventors
          </p>
          <p className="text-xs text-gray-400 mt-2">
            This tool provides preliminary guidance only. Consult with legal and regulatory professionals before making business decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}
