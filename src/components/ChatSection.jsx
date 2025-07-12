import { motion } from 'framer-motion';

export const ChatSection = ({ messages, messageInput, setMessageInput, sendMessage, messagesEndRef }) => {
  return (
    <div className="bg-white dark:bg-neutral-900 md:max-h-[80vh] max-h-[50vh] h-[70vh] flex flex-col rounded-b-2xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex items-center justify-center"
          >
            <p className="text-sm text-zinc-400">No messages yet</p>
          </motion.div>
        ) : (
          messages.map((msg, idx) => {
            const isCurrentUser = msg.user === sessionStorage.getItem('username');
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
              >
                <p className={`text-xs font-semibold mb-1 ${isCurrentUser ? 'text-purple-600 dark:text-purple-400 text-right' : 'text-gray-600 dark:text-gray-300 text-left'}`}>
                  {msg.user}
                </p>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`rounded-lg px-3 py-2 w-fit max-w-[90%] ${isCurrentUser
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-zinc-800 dark:text-white'
                    }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-[11px] text-right text-zinc-500 dark:text-zinc-400 mt-1">
                    {msg.time}
                  </p>
                </motion.div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t dark:border-neutral-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 text-sm border border-zinc-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm transition"
          >
            Send
          </motion.button>
        </div>
      </div>
    </div>
  );
};