import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 * @param {...string} inputs - Class names to merge
 * @returns {string} - The merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Returns subject-specific guidance for GCSE marking
 * 
 * @param {string} subject - The subject being marked
 * @param {string} examBoard - The exam board (e.g., aqa, edexcel)
 * @returns {string} - Subject-specific guidance text
 */
export function getSubjectGuidance(subject, examBoard) {
  const guidance = {
    english: {
      aqa: `- Focus on the use of language, structure and form
- Evaluate the writer's methods and intentions
- Consider the social, historical and literary context
- Reference the text with specific quotations
- Assessment Objectives: AO1 (ideas & language), AO2 (analysis), AO3 (context), AO4 (evaluation)`,
      edexcel: `- Analyze how writers use language and structure to achieve effects
- Comment on the influence of contextual factors
- Use subject terminology accurately
- Support points with precise references to the text`,
      ocr: `- Evaluate writers' choices of language, form and structure
- Consider the impact on readers
- Demonstrate understanding of context
- Use a range of appropriate terminology`,
      wjec: `- Analyze how meanings are shaped through language, form and structure
- Show understanding of the relationship between texts and contexts
- Use relevant terminology
- Support interpretations with specific references`
    },
    maths: {
      general: `- Check for correct application of mathematical procedures
- Evaluate the clarity of working out
- Consider alternative methods/solutions
- Award method marks for correct approaches even with calculation errors
- Check final answers for accuracy and appropriate rounding`
    },
    science: {
      general: `- Look for scientific accuracy in explanations
- Check for proper use of technical terminology
- Consider experimental design quality
- Evaluate analytical reasoning and critical thinking
- Assess understanding of scientific principles`
    },
    history: {
      general: `- Evaluate the use of historical evidence
- Consider different historical interpretations
- Assess understanding of key historical concepts
- Look for chronological understanding
- Check for balanced argumentation`
    },
    geography: {
      general: `- Check for understanding of physical and human processes
- Evaluate use of geographical data and case studies
- Consider sustainability and interconnection concepts
- Assess the quality of geographical analysis
- Look for appropriate use of maps and diagrams`
    },
    computerScience: {
      general: `- Evaluate understanding of computing principles
- Check for logical problem-solving approaches
- Assess code quality and algorithm efficiency
- Consider practical application of theoretical concepts
- Look for critical understanding of computing systems`
    },
    businessStudies: {
      general: `- Check understanding of business concepts and theories
- Evaluate analytical and critical thinking
- Assess application to real business contexts
- Consider different stakeholder perspectives
- Look for balanced evaluation of business decisions`
    }
  };

  // Use subject-specific guidance if available, otherwise use general guidance
  if (guidance[subject] && guidance[subject][examBoard]) {
    return guidance[subject][examBoard];
  } else if (guidance[subject] && guidance[subject].general) {
    return guidance[subject].general;
  }

  // Fallback guidance if nothing specific is available
  return `- Focus on accurate subject knowledge
- Consider structure and clarity of response
- Look for relevant examples and evidence
- Assess depth of analysis and evaluation
- Check for appropriate subject-specific terminology`;
} 