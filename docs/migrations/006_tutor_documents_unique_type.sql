DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'tutor_documents_unique_type'
      AND conrelid = 'public.tutor_documents'::regclass
  ) THEN
    ALTER TABLE public.tutor_documents
      ADD CONSTRAINT tutor_documents_unique_type
      UNIQUE (tutor_id, document_type);
  END IF;
END
$$;