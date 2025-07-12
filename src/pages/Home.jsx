import streamSync from '../assets/streamsync.svg'
import flashsvg from '../assets/flash.svg'
import userssvg from '../assets/users.svg'
import videosvg from '../assets/video.svg'
import chatsvg from '../assets/chat.svg'
import shieldsvg from '../assets/shield.svg'
import lightModeIcon from '../assets/lightmode.svg';
import darkModeIcon from '../assets/darkmode.svg';
import globesvg from '../assets/globe.svg'
import userswsvg from '../assets/usersw.svg'
import playsvg from '../assets/play.svg'
import playwsvg from '../assets/playw.svg'
import API from '../api.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const [createName, setCreateName] = useState('');
  const [joinName, setJoinName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const { isDark, toggleTheme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = async () => {
    if (!createName.trim()) {
      toast.error("Please enter your name", {
        position: "top-right",
        style: {
          background: isDark ? '#18181b' : '#fff',
          color: isDark ? '#fff' : '#000',
          border: isDark ? '1px solid #3f3f46' : '1px solid #e4e4e7'
        }
      });
      return;
    }

    const code = generateRoomCode();
    try {
      const loadingToast = toast.loading('Creating room...', {
        position: "top-right",
        style: {
          background: isDark ? '#18181b' : '#fff',
          color: isDark ? '#fff' : '#000',
          border: isDark ? '1px solid #3f3f46' : '1px solid #e4e4e7'
        }
      });

      const res = await API.post('/rooms', {
        roomId: code,
        host: createName
      });

      sessionStorage.setItem('username', createName);
      sessionStorage.setItem('isHost', true);
      sessionStorage.setItem('roomCode', code);

      toast.success('Room created successfully!', {
        id: loadingToast,
        position: "top-right",
        style: {
          background: isDark ? '#18181b' : '#fff',
          color: isDark ? '#fff' : '#000',
          border: isDark ? '1px solid #3f3f46' : '1px solid #e4e4e7'
        }
      });

      navigate(`/room/${code}`);
    } catch (err) {
      console.error('Room creation failed:', err);
      toast.error(err.response?.data?.message || 'Failed to create room', {
        position: "top-right",
        style: {
          background: isDark ? '#18181b' : '#fff',
          color: isDark ? '#fff' : '#000',
          border: isDark ? '1px solid #3f3f46' : '1px solid #e4e4e7'
        }
      });
    }
  };

  const handleJoinRoom = async () => {
    if (!joinName.trim() || !joinCode.trim()) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        style: {
          background: isDark ? '#18181b' : '#fff',
          color: isDark ? '#fff' : '#000',
          border: isDark ? '1px solid #3f3f46' : '1px solid #e4e4e7'
        }
      });
      return;
    }

    const roomId = joinCode.toUpperCase();
    const loadingToast = toast.loading('Joining room...', {
      position: "top-right",
      style: {
        background: isDark ? '#18181b' : '#fff',
        color: isDark ? '#fff' : '#000',
        border: isDark ? '1px solid #3f3f46' : '1px solid #e4e4e7'
      }
    });
    try {
      const res = await API.post('/rooms/join', {
        roomId,
        name: joinName.trim()
      });

      sessionStorage.setItem('username', joinName.trim());
      sessionStorage.setItem('isHost', false);
      sessionStorage.setItem('roomCode', roomId);

      toast.success('Joined room successfully!', {
        id: loadingToast,
        position: "top-right",
        style: {
          background: isDark ? '#18181b' : '#fff',
          color: isDark ? '#fff' : '#000',
          border: isDark ? '1px solid #3f3f46' : '1px solid #e4e4e7'
        }
      });

      navigate(`/room/${roomId}`);
    } catch (err) {
      console.error('Room join failed:', err);

      if (err.response?.status === 404) {
        toast.error(err.response?.data?.error || 'Room not found', {
        id: loadingToast,
        position: "top-right",
        style: {
          background: isDark ? '#18181b' : '#fff',
          color: isDark ? '#fff' : '#000',
          border: isDark ? '1px solid #3f3f46' : '1px solid #e4e4e7'
        }
      });
        navigate(`/notfound/${joinCode.toUpperCase()}`);
      } else {
        toast.error(err.response?.data?.error || 'Failed to join room', {
          position: "top-right",
          style: {
            background: isDark ? '#18181b' : '#fff',
            color: isDark ? '#fff' : '#000',
            border: isDark ? '1px solid #3f3f46' : '1px solid #e4e4e7'
          }
        });
      }
    }
  };

  return (
    <div className='bg-purple-50/50 dark:bg-zinc-950 min-h-screen'>
      <Toaster />

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex p-4 sm:p-6 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 justify-between items-center transition-colors duration-300"
      >
        <div>
          <img src={streamSync} className="w-28 sm:w-36 md:w-44 dark:invert" alt="StreamSync" />
        </div>

        <div className='flex items-center gap-2 sm:gap-4'>
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
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="#about"
            className="hidden sm:inline-flex text-zinc-800 dark:text-zinc-200 hover:underline hover:text-purple-500 dark:hover:text-purple-400 transition-all text-sm font-medium p-2 sm:p-3 rounded-full bg-neutral-100 dark:bg-neutral-900"
          >
            About
          </motion.a>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center space-y-2 sm:space-y-4 mt-8 sm:mt-12 md:mt-[6rem] px-4"
      >
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-800 dark:text-white"
        >
          Watch Together.
        </motion.h1>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight"
        >
          From Anywhere.
        </motion.h1>
      </motion.div>

      {/* Features and Room Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='flex flex-col items-center mt-4 sm:mt-5 gap-1 sm:gap-2 px-4'
      >
        <motion.h2
          variants={itemVariants}
          className='dark:text-neutral-300 text-lg sm:text-xl md:text-2xl max-w-3xl sm:max-w-4xl text-center text-black'
        >
          Create or join a room to watch YouTube videos in perfect sync with friends.
        </motion.h2>
        
        {/* Feature Highlights */}
        <motion.div
          variants={itemVariants}
          className='mt-3 sm:mt-5 flex justify-center w-full'
        >
          <ul className='flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-10 px-2 sm:px-0'>
            <motion.li
              whileHover={{ scale: 1.05 }}
              className='dark:text-neutral-200 text-black flex items-center gap-1 sm:gap-2 text-sm sm:text-base'
            >
              <img src={flashsvg} className="w-4 sm:w-5" alt="" />No signup required
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              className='dark:text-neutral-200 text-black flex items-center gap-1 sm:gap-2 text-sm sm:text-base'
            >
              <img src={userssvg} className="w-4 sm:w-5" alt="" />Real-time sync
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              className='dark:text-neutral-200 text-black flex items-center gap-1 sm:gap-2 text-sm sm:text-base'
            >
              <img src={playsvg} className="w-4 sm:w-5" alt="" />YouTube videos
            </motion.li>
          </ul>
        </motion.div>

        {/* Room Creation/Join Cards */}
        <motion.div
          variants={containerVariants}
          className="flex flex-col sm:flex-row justify-center mt-8 sm:mt-14 gap-6 sm:gap-8 md:gap-14 px-4 w-full max-w-6xl"
        >
          {/* Create Room Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center bg-white dark:bg-neutral-900 p-5 sm:p-7 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl w-full sm:w-[20rem] md:w-[22rem] space-y-3 sm:space-y-4 transition-all duration-300"
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="flex items-center justify-center bg-purple-500 p-4 sm:p-5 rounded-full shadow"
            >
              <img src={playwsvg} alt="Play Icon" className="w-5 sm:w-6 h-5 sm:h-6" />
            </motion.div>
            <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white">Create Room</h3>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 text-center">
              Start a new room and invite friends to watch together.
            </p>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Enter your name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white dark:bg-neutral-900 text-black dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 border dark:border-neutral-700 focus:ring-purple-400 transition text-sm sm:text-base"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateRoom}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 text-white font-medium sm:font-semibold py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow transition duration-300 text-sm sm:text-base"
            >
              Create Room
            </motion.button>
          </motion.div>

          {/* Join Room Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center bg-white dark:bg-neutral-900 p-5 sm:p-7 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl w-full sm:w-[20rem] md:w-[22rem] space-y-3 sm:space-y-4 transition-all duration-300"
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="flex items-center justify-center bg-blue-400 p-4 sm:p-5 rounded-full shadow"
            >
              <img src={userswsvg} alt="Users Icon" className="w-5 sm:w-6 h-5 sm:h-6" />
            </motion.div>
            <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white">Join Room</h3>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 text-center">
              Enter a room code to join your friends!
            </p>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Enter your name"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white dark:bg-neutral-900 text-black dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-400 border dark:border-neutral-700 transition text-sm sm:text-base"
            />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Enter room code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white dark:bg-neutral-900 text-black dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-400 border dark:border-neutral-700 transition text-sm sm:text-base"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoinRoom}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 text-white font-medium sm:font-semibold py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow transition duration-300 text-sm sm:text-base"
            >
              Join Room
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
        id="about"
        className="flex justify-center px-4 sm:px-6 pb-16 sm:pb-24 pt-16 sm:pt-28 transition-colors duration-300"
      >
        <div className="flex flex-col items-center w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-6 sm:p-8 md:p-10 space-y-8 sm:space-y-11">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-3 sm:space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-800 dark:text-white">About StreamSync</h2>
            <p className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl">
              StreamSync brings the movie night experience to the digital age. Watch YouTube videos together in perfect synchronization, chat in real-time, and enjoy content with friends no matter where they are in the world.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={containerVariants}
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full"
          >
            {[
              { icon: videosvg, title: "Synchronized Playback", desc: "Everyone watches at exactly the same time with automatic sync" },
              { icon: chatsvg, title: "Live Chat", desc: "React and discuss in real-time while watching together" },
              { icon: shieldsvg, title: "No Registration", desc: "Jump right in with just a nickname - no accounts needed" },
              { icon: globesvg, title: "Cross-Platform", desc: "Works seamlessly on desktop, tablet, and mobile devices" }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center space-y-2 sm:space-y-3 p-3 sm:p-4"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="p-2 sm:p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800"
                >
                  <img src={item.icon} className="w-10 sm:w-12 md:w-14" alt="" />
                </motion.div>
                <h3 className="text-base sm:text-lg font-semibold text-zinc-800 dark:text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.4 }}
            className="w-full text-center space-y-3 sm:space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-800 dark:text-white">How It Works</h2>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm mt-1 sm:mt-2 max-w-2xl mx-auto">
              {[
                { text: "1. Create or join a room", bg: "bg-purple-100", textColor: "text-purple-700", darkBg: "dark:bg-purple-900", darkText: "dark:text-purple-300" },
                { text: "2. Search YouTube or upload link", bg: "bg-blue-100", textColor: "text-blue-700", darkBg: "dark:bg-blue-900", darkText: "dark:text-blue-300" },
                { text: "3. Watch together in sync", bg: "bg-green-100", textColor: "text-green-700", darkBg: "dark:bg-green-900", darkText: "dark:text-green-300" },
                { text: "4. Chat and enjoy!", bg: "bg-pink-100", textColor: "text-pink-700", darkBg: "dark:bg-pink-900", darkText: "dark:text-pink-300" }
              ].map((step, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.1 * index }}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full ${step.bg} ${step.textColor} ${step.darkBg} ${step.darkText} font-medium`}
                >
                  {step.text}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Home