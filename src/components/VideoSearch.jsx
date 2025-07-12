import { motion } from 'framer-motion';

import cancelsvg from '../assets/cancel.svg';
import searchsvg from '../assets/search.svg';
import linksvg from '../assets/link.svg';

export const VideoSearch = ({
  activeTab,
  setActiveTab,
  youtubeSearch,
  setYoutubeSearch,
  fetchYouTubeVideos,
  youtubeURL,
  setYoutubeURL,
  handleAddVideo,
  searchVideos,
  setSearchVideos,
  setYoutubeVideo,
  socket,
  roomId
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.3 } } }}
      transition={{ delay: 0.1 }}
      className="w-full bg-white/85 dark:bg-neutral-800/90 rounded-xl p-5 sm:p-7"
    >
      <h1 className='font-semibold text-lg dark:text-white mb-4'>Add YouTube Video</h1>
      <div className='flex gap-2 mt-2 flex-wrap'>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setActiveTab('search')}
          className={`rounded-lg px-3 py-2 font-semibold text-sm items-center gap-2 flex ${activeTab === 'search' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white'}`}
        >
          <img src={searchsvg} className={`w-4 h-4 ${activeTab === 'search' ? 'invert' : 'dark:invert'} `} alt="" />
          <span>Search Youtube</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setActiveTab('url')}
          className={`rounded-lg px-3 py-2 font-semibold text-sm items-center gap-2 flex ${activeTab === 'url' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white'}`}
        >
          <img src={linksvg} className={`w-4 h-4 ${activeTab === 'url' ? 'invert' : 'dark:invert'} `} alt="" />
          <span>YouTube URL</span>
        </motion.button>
      </div>

      {activeTab === 'search' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className='relative mt-4 w-full'
        >
          <img
            src={searchsvg}
            alt=""
            className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:invert'
          />
          <input
            type="text"
            placeholder="Search YouTube Videos..."
            value={youtubeSearch}
            onChange={(e) => setYoutubeSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchYouTubeVideos()}
            className='w-full pl-10 pr-24 p-2 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
          <motion.button
            onClick={fetchYouTubeVideos}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-1.5 rounded-md text-sm transition"
          >
            Search
          </motion.button>
        </motion.div>
      )}

      {activeTab === 'url' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className='relative mt-4 w-full'
        >
          <img
            src={linksvg}
            alt=""
            className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:invert'
          />
          <input
            type="text"
            placeholder="Enter YouTube URL..."
            value={youtubeURL}
            onChange={(e) => setYoutubeURL(e.target.value)}
            className='w-full pl-10 pr-24 p-2 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
          <motion.button
            onClick={handleAddVideo}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-1.5 rounded-md text-sm transition"
          >
            Add Video
          </motion.button>
        </motion.div>
      )}

      {searchVideos.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.3 } } }}
          className='bg-white dark:bg-neutral-700 mt-4 p-4 border dark:border-neutral-600 rounded-lg relative'
        >
          <div className="flex justify-between items-center mb-2">
            <h1 className="dark:text-white">Search Results</h1>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchVideos([])}
              className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 transition"
              aria-label="Clear search results"
            >
              <img src={cancelsvg} className="w-5 h-5 dark:invert" alt="Cancel" />
            </motion.button>
          </div>
          <ul className='space-y-3 max-h-[40vh] overflow-y-auto custom-scroll'>
            {searchVideos.map((video) => (
              <motion.li
                key={video.id.videoId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
                  setYoutubeVideo(videoUrl);
                  socket.current.emit("setVideo", { roomId, videoUrl });
                }}
                className='flex gap-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-600 p-2 rounded-lg transition'
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-24 sm:w-32 h-16 sm:h-20 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                    YouTube
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm line-clamp-2 mb-1 text-gray-900 dark:text-white">
                    {video.snippet.title}
                  </h5>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{video.snippet.channelTitle}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};