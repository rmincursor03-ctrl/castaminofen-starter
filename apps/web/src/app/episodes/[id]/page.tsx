'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getEpisodeById, uploadEpisodeAudio } from '@/lib/episodes';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { EpisodeDetailView } from '@/features/episodes/components/EpisodeDetailView';

export default function EpisodeDetailsPage() {
  const params = useParams();
  const episodeId = params?.id as string;
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const query = useQuery({
    queryKey: ['episode', episodeId],
    queryFn: () => getEpisodeById(episodeId),
    enabled: Boolean(episodeId),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadEpisodeAudio(episodeId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episode', episodeId] });
    },
  });

  if (query.isLoading) {
    return <LoadingState message="Loading episode..." />;
  }

  if (query.isError || !query.data) {
    return <ErrorState message={query.error?.message ?? 'Episode not found'} />;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await uploadMutation.mutateAsync(selectedFile);
    setSelectedFile(null);
  };

  return (
    <ProtectedRoute>
      <EpisodeDetailView
        episode={query.data}
        selectedFile={selectedFile}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
        isUploading={uploadMutation.isPending}
        uploadError={uploadMutation.isError ? uploadMutation.error?.message ?? 'Upload failed' : null}
        uploadSuccess={uploadMutation.isSuccess}
      />
    </ProtectedRoute>
  );
}
