import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSubjectGuidance(subject: string, examBoard?: string): string {
  const subjectGuidance = {
    english: `- Focus on language analysis and literary techniques
- Evaluate depth of interpretation
- Check for textual evidence
- Assess structure and coherence of argument`,
    maths: `- Verify calculation accuracy
- Check method and working shown
- Assess problem-solving approach
- Look for appropriate units and precision`,
    science: `- Verify scientific accuracy
- Check use of terminology
- Assess experimental understanding
- Evaluate data interpretation`,
    history: `- Check historical accuracy
- Assess use of evidence
- Evaluate source analysis
- Look for contextual understanding`,
    geography: `- Verify geographical concepts
- Check case study knowledge
- Assess data interpretation
- Evaluate application of theory`
  };

  const boardGuidance = {
    aqa: {
      english: `- AQA emphasizes clear structure and textual references
- Look for AO1 (interpretation), AO2 (analysis), AO3 (context)`,
      maths: `- AQA values method marks and clear working
- Problem-solving questions are key differentiators`,
      science: `- AQA requires precise terminology
- Practical skills questions are important`
    },
    edexcel: {
      english: `- Edexcel values personal response
- Comparative analysis is often required`,
      maths: `- Edexcel focuses on real-world applications
- Multi-step problems are common`,
      science: `- Edexcel emphasizes data interpretation
- Extended writing questions carry weight`,
      computerScience: `- Edexcel focuses on practical programming
- Algorithm design questions are common`,
      businessStudies: `- Edexcel emphasizes case studies
- Financial calculations are important`
    },
    ocr: {
      english: `- OCR values close textual analysis
- Contextual understanding is weighted`,
      maths: `- OCR includes more proof questions
- Reasoning is particularly important`,
      science: `- OCR focuses on synoptic links
- Practical understanding is assessed`
    },
    wjec: {
      computerScience: `- WJEC focuses on systems architecture
- Programming concepts are tested thoroughly`,
      businessStudies: `- WJEC values application to real businesses
- Market analysis is important`
    }
  };

  let guidance = subjectGuidance[subject as keyof typeof subjectGuidance] || '';
  
  if (examBoard && boardGuidance[examBoard as keyof typeof boardGuidance]) {
    const boardEntry = boardGuidance[examBoard as keyof typeof boardGuidance];
    if (subject in boardEntry) {
      const boardSpecific = boardEntry[subject as keyof typeof boardEntry];
      if (boardSpecific) {
        guidance += `\n\nExam Board (${examBoard.toUpperCase()}) Specific:\n${boardSpecific}`;
      }
    }
  }

  return guidance;
}
