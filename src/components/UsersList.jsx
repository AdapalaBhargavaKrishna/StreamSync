import { motion } from 'framer-motion';
import removesvg from '../assets/remove.svg';
import hostsvg from '../assets/host.svg';

export const UsersList = ({ roomData, isHost, handleKick }) => {
  return (
    <div className="bg-white dark:bg-neutral-900 h-[70vh] md:max-h-[80vh] max-h-[50vh] overflow-y-auto p-4 custom-scroll rounded-b-2xl">
      {roomData?.users?.length > 0 ? (
        <ul className='grid gap-3'>
          {roomData.users.map((user, index) => {
            const isMe = user.name === sessionStorage.getItem('username');
            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.01 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl shadow-sm"
              >
                <motion.div
                  whileHover={{ rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-pink-400 text-white font-semibold text-lg shadow-sm"
                >
                  {user.name.charAt(0).toUpperCase()}
                </motion.div>

                <div className="flex-1">
                  <span className="text-zinc-800 dark:text-white font-medium flex items-center gap-2">
                    {user.name}
                    {isMe && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-[10px] bg-purple-500 text-white px-2 py-[2px] rounded-full uppercase"
                      >
                        Me
                      </motion.span>
                    )}
                    {user.isHost && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-sm text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1"
                      >
                        <img src={hostsvg} alt="host" className="w-4 h-4" />
                        Host
                      </motion.span>
                    )}
                    {isHost && !isMe && !user.isHost && (
                      <button
                        onClick={() => handleKick(user.name)}
                        className="ml-auto hover:scale-105 transition"
                        title="Kick user"
                      >
                        <img src={removesvg} alt="Kick" className="w-4 h-4" />
                      </button>
                    )}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </ul>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-zinc-500 dark:text-zinc-400 px-4"
        >
          No users in this room.
        </motion.p>
      )}
    </div>
  );
};