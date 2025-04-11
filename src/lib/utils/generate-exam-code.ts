export function generateExamCode(title: string, subject: string, gradeLevel: string): string {
  // Get current year
  const year = new Date().getFullYear()
  
  // Get first letters of each word in title (e.g., "Mid Term" -> "MT")
  const titleCode = title
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
  
  // Get first 3 letters of subject
  const subjectCode = subject
    .slice(0, 3)
    .toUpperCase()
  
  // Grade level should already be in format like G1, K1
  const gradeLevelCode = gradeLevel.toUpperCase()
  
  // Random 3-digit number for uniqueness
  const randomNum = Math.floor(Math.random() * 900) + 100 // 100-999
  
  // Format: MT-MATH-G1-2025-123
  return `${titleCode}-${subjectCode}-${gradeLevelCode}-${year}-${randomNum}`
}
