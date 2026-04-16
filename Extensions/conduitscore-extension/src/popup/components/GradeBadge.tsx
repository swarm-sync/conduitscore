interface GradeBadgeProps {
  grade: string;
}

function gradeClass(grade: string): string {
  switch (grade.toUpperCase()) {
    case 'A': return 'grade-a';
    case 'B': return 'grade-b';
    case 'C': return 'grade-c';
    case 'D': return 'grade-d';
    default:  return 'grade-f';
  }
}

export default function GradeBadge({ grade }: GradeBadgeProps) {
  return (
    <span className={`grade-badge ${gradeClass(grade)}`} aria-label={`Grade ${grade}`}>
      {grade.toUpperCase()}
    </span>
  );
}
