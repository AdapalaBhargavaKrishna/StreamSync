import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import copysvg from '../assets/copy.svg';
import lightModeIcon from '../assets/lightmode.svg';
import darkModeIcon from '../assets/darkmode.svg';

export const RoomHeader = ({ roomId, roomData, copied, setCopied, setShowExitModal, toggleTheme, isDark }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    toast.success('Copied!', { position: 'top-center' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-black flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-4 dark:border-zinc-800 transition-colors duration-300 top-0 z-20"
    >
      <div className="text-center sm:text-left mb-3 sm:mb-0">
        <motion.h1
          whileHover={{ scale: 1.02 }}
          className="text-xl sm:text-2xl font-semibold text-zinc-800 dark:text-white"
        >
          Room <span className="text-purple-500">{roomId}</span>
        </motion.h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">({roomData?.users?.length || 0}) user watching</p>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-zinc-800 dark:text-white rounded-lg text-sm transition"
        >
          <img src={copysvg} alt="" className="w-4 h-4 dark:invert" />
          {copied ? "Copied!" : "Copy Code"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowExitModal(true)}
          className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg text-sm transition font-medium"
        >
          Exit
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="flex items-center gap-2 px-2 py-2 rounded-full bg-neutral-100 dark:bg-neutral-900 text-sm text-black dark:text-white shadow-sm"
          aria-label="Toggle theme"
        >
          <img
            src={isDark ? lightModeIcon : darkModeIcon}
            className="w-5 h-5"
            alt={isDark ? "Light Mode" : "Dark Mode"}
          />
        </motion.button>
      </div>
    </motion.nav>
  );
};