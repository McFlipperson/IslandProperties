import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";

interface VideoPlayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl: string;
  propertyTitle?: string;
}

export default function VideoPlayerModal({ 
  open, 
  onOpenChange, 
  videoUrl, 
  propertyTitle 
}: VideoPlayerModalProps) {
  const [videoType, setVideoType] = useState<'youtube' | 'vimeo' | 'direct' | 'unknown'>('unknown');
  const [embedUrl, setEmbedUrl] = useState('');
  const [error, setError] = useState('');

  // Function to determine video type and create embed URL
  useEffect(() => {
    if (!videoUrl) {
      setVideoType('unknown');
      setEmbedUrl('');
      setError('No video URL provided');
      return;
    }

    setError('');

    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = videoUrl.match(youtubeRegex);
    
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      setVideoType('youtube');
      setEmbedUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
      return;
    }

    // Vimeo URL patterns
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = videoUrl.match(vimeoRegex);
    
    if (vimeoMatch) {
      const videoId = vimeoMatch[1];
      setVideoType('vimeo');
      setEmbedUrl(`https://player.vimeo.com/video/${videoId}?autoplay=1`);
      return;
    }

    // Direct video file URLs
    const directVideoRegex = /\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i;
    if (directVideoRegex.test(videoUrl)) {
      setVideoType('direct');
      setEmbedUrl(videoUrl);
      return;
    }

    // If none of the patterns match
    setVideoType('unknown');
    setEmbedUrl('');
    setError('Unsupported video format. Please use YouTube, Vimeo, or direct video file URLs.');
  }, [videoUrl]);

  const renderVideoPlayer = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-600 text-center">{error}</p>
        </div>
      );
    }

    switch (videoType) {
      case 'youtube':
      case 'vimeo':
        return (
          <div className="aspect-video w-full">
            <iframe
              src={embedUrl}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`Video for ${propertyTitle || 'Property'}`}
            />
          </div>
        );
      
      case 'direct':
        return (
          <div className="aspect-video w-full">
            <video
              src={embedUrl}
              controls
              autoPlay
              className="w-full h-full rounded-lg"
              title={`Video for ${propertyTitle || 'Property'}`}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-center">Loading video...</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              {propertyTitle ? `${propertyTitle} - Property Video` : 'Property Video'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          {renderVideoPlayer()}
        </div>
      </DialogContent>
    </Dialog>
  );
}