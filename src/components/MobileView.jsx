import { motion } from 'framer-motion';
import { ChatSection } from '../components/ChatSection';
import { UsersList } from '../components/UsersList';
import { VideoSearch } from '../components/VideoSearch';

import YouTube from 'react-youtube';
import userssvg from '../assets/users.svg';
import searchsvg from '../assets/search.svg';
import chatsvg from '../assets/chat.svg';

export const MobileView = ({
    activeMobileTab,
    setActiveMobileTab,
    youtubeVideo,
    handlePlayerReady,
    handleStateChange,
    messages,
    messageInput,
    setMessageInput,
    sendMessage,
    messagesEndRef,
    roomData,
    isHost,
    handleKick,
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
            className="flex flex-col h-[calc(100vh-122px)]"
        >
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow mb-2">
                <div className="h-[35vh] w-full rounded-t-lg overflow-hidden">
                    <YouTube
                        videoId={extractVideoId(youtubeVideo) || 'QucA4W4RBL0'}
                        onReady={handlePlayerReady}
                        onStateChange={handleStateChange}
                        opts={{
                            width: '100%',
                            height: '100%',
                            playerVars: { autoplay: 0 },
                        }}
                        className="w-full h-full"
                    />
                </div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.3 } } }}
                className="bg-white dark:bg-neutral-900 rounded-lg shadow flex-1 flex flex-col"
            >
                <div className="p-3 border-b dark:border-neutral-700 flex justify-between items-center">
                    <div className="flex items-center w-full justify-between">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveMobileTab('chat')}
                            className={`flex items-center gap-1 ${activeMobileTab === 'chat' ? 'text-purple-500' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            <img src={chatsvg} className="w-5 h-5" alt="Chat" />
                            <span className="font-medium">Chat</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveMobileTab('users')}
                            className={`flex items-center gap-1 ${activeMobileTab === 'users' ? 'text-purple-500' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            <img src={userssvg} className="w-5 h-5" alt="Users" />
                            <span className="font-medium">Users</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveMobileTab('search')}
                            className={`flex items-center gap-1 ${activeMobileTab === 'search' ? 'text-purple-500' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            <img src={searchsvg} className="w-5 h-5" alt="Search" />
                            <span className="font-medium">Search</span>
                        </motion.button>
                    </div>
                </div>

                {activeMobileTab === 'chat' && (
                    <ChatSection
                        messages={messages}
                        messageInput={messageInput}
                        setMessageInput={setMessageInput}
                        sendMessage={sendMessage}
                        messagesEndRef={messagesEndRef}
                    />
                )}

                {activeMobileTab === 'users' && (
                    <UsersList
                        roomData={roomData}
                        isHost={isHost}
                        handleKick={handleKick}
                    />
                )}

                {activeMobileTab === 'search' && (
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
                )}
            </motion.div>
        </motion.div>
    );
};