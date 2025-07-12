import { AnimatePresence, motion } from 'framer-motion';
import deletesvg from '../assets/delete.svg';
import exitsvg from '../assets/exit.svg';

export const ExitModal = ({ showExitModal, setShowExitModal, isHost, handleExitConfirm }) => {
  return (
    <AnimatePresence>
      {showExitModal && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setShowExitModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300
            }}
            className="relative bg-gradient-to-br from-white to-gray-50 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl shadow-2xl max-w-md w-full p-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/10 to-transparent opacity-20 dark:opacity-30" />

            <div className="relative z-10 flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  whileHover={{ rotate: isHost ? [-5, 5, -5] : [0] }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`p-3 rounded-full ${isHost ? 'bg-red-500/10' : 'bg-purple-500/10'} mb-4`}
                >
                  <img
                    src={isHost ? deletesvg : exitsvg}
                    className="w-8 h-8"
                    alt={isHost ? "Delete" : "Exit"}
                  />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isHost ? "Delete this room?" : "Leave the room?"}
                </h3>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 dark:text-gray-400 text-center px-4"
              >
                {isHost
                  ? "This will permanently delete the room and kick everyone out."
                  : "Don't worry, you can rejoin anytime with the room code."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-3 mt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExitConfirm}
                  className={`w-full py-3 rounded-xl ${isHost ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'} text-white font-medium flex items-center justify-center gap-2 transition-colors`}
                >
                  <img
                    src={isHost ? deletesvg : exitsvg}
                    className="w-5 h-5"
                    alt={isHost ? "Delete" : "Exit"}
                  />
                  {isHost ? "Delete Room" : "Leave Room"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowExitModal(false)}
                  className="w-full py-3 rounded-xl bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-gray-800 dark:text-gray-200 font-medium transition-colors"
                >
                  Cancel
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};