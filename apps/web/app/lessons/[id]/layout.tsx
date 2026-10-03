import type { Metadata } from 'next';
import { getLesson } from '@adagio/theory';
import { LESSONS_DATA } from '@/lib/data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lesson = getLesson(id);
  if (lesson) return { title: lesson.metadata.title };
  const staticLesson = LESSONS_DATA.find((l) => l.slug === id || l.id === id);
  return { title: staticLesson ? staticLesson.title : 'Leçon' };
}

export default function LessonDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
