import YouTube from 'react-youtube';
import { motion } from 'framer-motion';

export const VideoPlayer = ({ youtubeVideo, handlePlayerReady, handleStateChange, isHost }) => {
  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
    const match = url?.trim().match(regex);
    return match?.[1] || '';
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="w-full rounded-lg"
    >
      <div className='bg-white dark:bg-neutral-900 rounded-lg shadow-xl h-[40vh] sm:h-[50vh] md:h-[58vh] overflow-hidden'>
        <YouTube
          videoId={extractVideoId(youtubeVideo) || 'QucA4W4RBL0'}
          onReady={handlePlayerReady}
          onStateChange={(e) => handleStateChange(e, isHost)}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: { autoplay: 0 },
          }}
          className="w-full h-full"
        />
      </div>
    </motion.div>
  );
};