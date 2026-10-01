import { useQuery } from '@tanstack/react-query';
import { getTutor, listTutors } from '../services/tutorsService';
import type { TutorFilters } from '../services/tutorsService';

export function useTutors(filters: TutorFilters = {}) {
  return useQuery({
    queryKey: ['tutors', filters],
    queryFn: () => listTutors(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTutor(id: string | undefined) {
  return useQuery({
    queryKey: ['tutor', id],
    queryFn: () => getTutor(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}