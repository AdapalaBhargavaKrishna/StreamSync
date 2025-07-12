import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import API from '../api.jsx';
import io from 'socket.io-client';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { RoomHeader } from '../components/RoomHeader.jsx';
import { VideoPlayer } from '../components/VideoPlayer';
import { VideoSearch } from '../components/VideoSearch';
import { ChatSection } from '../components/ChatSection';
import { UsersList } from '../components/UsersList';
import { ExitModal } from '../components/ExitModal';
import { MobileView } from '../components/MobileView';
import userssvg from '../assets/users.svg';
import chatsvg from '../assets/chat.svg';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = useRef(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const [roomData, setRoomData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [searchVideos, setSearchVideos] = useState([]);
  const [isPlayerReady, setIsPlayerReady] = useState([]);
  const [youtubeURL, setYoutubeURL] = useState('');
  const [youtubeVideo, setYoutubeVideo] = useState('');
  const [youtubeSearch, setYoutubeSearch] = useState('');
  const [showExitModal, setShowExitModal] = useState(false);
  const [isHost, setIsHost] = useState(sessionStorage.getItem('isHost') === 'true');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [activeMobileTab, setActiveMobileTab] = useState('chat');
  const messagesEndRef = useRef(null);
  const playerRef = useRef(null);

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeTab === 'url' || activeTab === 'search') {
      setSearchVideos([]);
      setYoutubeSearch('');
      setYoutubeURL('');
    }
  }, [activeTab]);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_SOCKET_SERVER_URL);

    const username = sessionStorage.getItem('username');
    const roomCode = sessionStorage.getItem('roomCode');

    if (!username || !roomCode) {
      sessionStorage.clear();
      navigate(`/notfound/${roomId}`);
      return;
    }
    socket.current.emit('joinRoom', { roomId, user: username });

    socket.current.on('chatMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.current.on('roomData', ({ users }) => {
      const username = sessionStorage.getItem('username');
      const me = users.find(u => u.name === username);
      if (me) {
        setIsHost(me.isHost);
        sessionStorage.setItem("isHost", me.isHost);
      }
      setRoomData(prev => ({ ...prev, users }));
    });

    socket.current.on('setVideo', (videoUrl) => {
      setYoutubeVideo(videoUrl);
    });

    socket.current.on('error', (error) => {
      toast.error(error.message || 'Error', { position: 'top-center' });
    });

    return () => {
      socket.current.emit('leaveroom', { roomId, user: username });
      socket.current.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    socket.current?.on('videoControl', ({ type, time }) => {
      if (isHost || !isPlayerReady) return;
      const player = playerRef.current;
      if (!player) return;
      if (type === 'play') {
        player.seekTo(time, true);
        player.playVideo();
      } else if (type === 'pause') {
        player.seekTo(time, true);
        player.pauseVideo();
      }
    });
  }, [isHost, isPlayerReady]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!messageInput.trim()) {
      toast.error('Message empty', { position: 'top-center' });
      return;
    }

    const username = sessionStorage.getItem('username');
    const message = {
      user: username,
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.current.emit('chatMessage', { roomId, message });
    setMessageInput('');
  };

  const fetchYouTubeVideos = async () => {
    if (!youtubeSearch.trim()) {
      toast.error('Enter search term', { position: 'top-center' });
      return;
    }

    toast.promise(
      fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          youtubeSearch
        )}&type=video&maxResults=10&key=${API_KEY}`
      ).then(res => res.json()),
      {
        loading: 'Searching...',
        success: (data) => {
          setSearchVideos(data.items || []);
          return 'Search done';
        },
        error: (error) => {
          console.error("Search Error:", error);
          return 'Search failed';
        },
      },
      { position: 'top-center' }
    );
  };

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
    const match = url?.trim().match(regex);
    return match?.[1] || '';
  };

  const handleAddVideo = () => {
    if (!extractVideoId(youtubeURL)) {
      toast.error('Invalid URL', { position: 'top-center' });
      return;
    }
    setYoutubeVideo(youtubeURL);
    socket.current.emit("setVideo", { roomId, videoUrl: youtubeURL });
    toast.success('Video added', { position: 'top-center' });
  };

  const handlePlayerReady = (event) => {
    playerRef.current = event.target;
    setIsPlayerReady(true);
  };

  const handleStateChange = (event) => {
    if (!isHost) return;
    const player = event.target;
    const state = event.data;
    const currentTime = player.getCurrentTime();
    if (state === 1) {
      socket.current.emit('videoControl', { roomId, type: 'play', time: currentTime });
    } else if (state === 2) {
      socket.current.emit('videoControl', { roomId, type: 'pause', time: currentTime });
    }
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const res = await API.get(`/rooms/${roomId}`);
        setRoomData(res.data.room);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch", { position: 'top-center' });
        navigate(`/notfound/${roomId}`)
      }
    };
    fetchRoomData();
  }, [roomId, navigate]);

  const handleKick = async (targetName) => {
    try {
      await API.post('/rooms/kick', { roomId, target: targetName });
      socket.current.emit('kickUser', { roomId, target: targetName });
      toast.success(`${targetName} kicked`, { position: 'top-center' });
    } catch (err) {
      console.error('Kick error:', err);
      toast.error('Failed to kick user', { position: 'top-center' });
    }
  };

  useEffect(() => {
    socket.current?.on('kicked', () => {
      toast.error("You were removed from the room", { position: 'top-center' });
      sessionStorage.clear();
      setTimeout(() => navigate(`/notfound/${roomId}`), 2000);
    });

    return () => socket.current?.off('kicked');
  }, [roomId]);

  const handleExitConfirm = async () => {
    const username = sessionStorage.getItem('username');
    const roomCode = sessionStorage.getItem('roomCode');
    try {
      if (isHost) {
        await API.delete(`/rooms/${roomCode}`);
        toast.success('Room deleted', { position: 'top-center' });
      } else {
        await API.post('/rooms/leave', { roomId: roomCode, name: username });
        toast.success('Left room', { position: 'top-center' });
      }
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('isHost');
      sessionStorage.removeItem('roomCode');
      setTimeout(() => navigate('/'), 500);
    } catch (error) {
      console.error("Leave error:", error);
      toast.error("Leave failed", { position: 'top-center' });
    }
  };

  return (
    <div className='bg-purple-50 dark:bg-neutral-950 min-h-screen'>
      <Toaster position="top-center" />

      <RoomHeader
        roomId={roomId}
        roomData={roomData}
        copied={copied}
        setCopied={setCopied}
        setShowExitModal={setShowExitModal}
        toggleTheme={toggleTheme}
        isDark={isDark}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7 pb-20 lg:pb-0'>
        {!isMobile ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
              <VideoPlayer
                youtubeVideo={youtubeVideo}
                handlePlayerReady={handlePlayerReady}
                handleStateChange={handleStateChange}
                isHost={isHost}
              />

              <VideoSearch
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                youtubeSearch={youtubeSearch}
                setYoutubeSearch={setYoutubeSearch}
                fetchYouTubeVideos={fetchYouTubeVideos}
                youtubeURL={youtubeURL}
                setYoutubeURL={setYoutubeURL}
                handleAddVideo={handleAddVideo}
                searchVideos={searchVideos}
                setSearchVideos={setSearchVideos}
                setYoutubeVideo={setYoutubeVideo}
                socket={socket}
                roomId={roomId}
              />
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.3 } } }}
              transition={{ delay: 0.2 }}
              className="col-span-1"
            >
              <div className="rounded-lg h-full flex flex-col">
                <div className="flex border-b dark:border-neutral-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium text-sm transition-colors ${activeTab === 'chat' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    <img src={chatsvg} className="w-5 h-5" alt="Chat" />
                    <span>Chat</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('users')}
                    className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium text-sm transition-colors ${activeTab === 'users' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    <img src={userssvg} className="w-5 h-5" alt="Users" />
                    <span>Users ({roomData?.users?.length || 0})</span>
                  </motion.button>
                </div>

                <div className="flex-1 overflow-hidden relative">
                  <motion.div
                    className={`absolute inset-0 transition-all duration-300 ease-in-out ${activeTab === 'chat' ? 'translate-x-0' : '-translate-x-full'}`}
                  >
                    <ChatSection
                      messages={messages}
                      messageInput={messageInput}
                      setMessageInput={setMessageInput}
                      sendMessage={sendMessage}
                      messagesEndRef={messagesEndRef}
                    />
                  </motion.div>

                  <motion.div
                    className={`absolute inset-0 transition-all duration-300 ease-in-out ${activeTab === 'users' ? 'translate-x-0' : 'translate-x-full'}`}
                  >
                    <UsersList
                      roomData={roomData}
                      isHost={isHost}
                      handleKick={handleKick}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <MobileView
            activeMobileTab={activeMobileTab}
            setActiveMobileTab={setActiveMobileTab}
            youtubeVideo={youtubeVideo}
            handlePlayerReady={handlePlayerReady}
            handleStateChange={handleStateChange}
            messages={messages}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            sendMessage={sendMessage}
            messagesEndRef={messagesEndRef}
            roomData={roomData}
            isHost={isHost}
            handleKick={handleKick}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            youtubeSearch={youtubeSearch}
            setYoutubeSearch={setYoutubeSearch}
            fetchYouTubeVideos={fetchYouTubeVideos}
            youtubeURL={youtubeURL}
            setYoutubeURL={setYoutubeURL}
            handleAddVideo={handleAddVideo}
            searchVideos={searchVideos}
            setSearchVideos={setSearchVideos}
            setYoutubeVideo={setYoutubeVideo}
            socket={socket}
            roomId={roomId}
          />
        )}
      </div>

      <ExitModal
        showExitModal={showExitModal}
        setShowExitModal={setShowExitModal}
        isHost={isHost}
        handleExitConfirm={handleExitConfirm}
      />
    </div>
  );
};

export default Room;