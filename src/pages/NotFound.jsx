import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import searchsvg from '../assets/searchp.svg'
import homesvg from '../assets/homep.svg'
import linksvg from '../assets/linkp.svg'
import errorsvg from '../assets/error.svg'

const NotFound = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
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
                stiffness: 100
            }
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='fixed inset-0 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 p-4 overflow-hidden'
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className='p-8 sm:p-10 bg-white dark:bg-neutral-800 rounded-xl flex flex-col items-center shadow-lg dark:shadow-neutral-900/50 text-center max-w-md w-full space-y-6'
            >
                <motion.div variants={itemVariants}>
                    <div className='p-4 bg-red-100 dark:bg-neutral-700 rounded-full w-20 h-20 flex items-center justify-center'>
                        <img src={errorsvg} className='w-12 h-12' alt="Error" />
                    </div>
                </motion.div>

                <motion.h1 variants={itemVariants} className='text-3xl sm:text-4xl font-bold text-neutral-800 dark:text-neutral-100'>
                    Room Not Found
                </motion.h1>

                <motion.p variants={itemVariants} className="text-lg text-neutral-600 dark:text-neutral-300">
                    The room code <span className="font-mono font-semibold text-red-500 dark:text-red-400 bg-red-50 dark:bg-neutral-700 px-1 py-0.5 rounded inline-block mx-auto">
                        {roomId}
                    </span> doesn't exist.
                </motion.p>

                <motion.p variants={itemVariants} className="text-sm text-neutral-500 dark:text-neutral-400">
                    It might have been deleted, expired, or you may have entered the wrong code.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="p-4 rounded-xl w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-100 dark:border-neutral-600"
                >
                    <h3 className="font-semibold mb-3 text-neutral-900 dark:text-neutral-100">What you can do:</h3>
                    <div className="space-y-3 text-sm">
                        <motion.div
                            variants={itemVariants}
                            className="flex items-start space-x-3 text-neutral-600 dark:text-neutral-300"
                        >
                            <img src={searchsvg} alt="Search" className="mt-0.5 flex-shrink-0" />
                            <span>Double-check the room code for typos</span>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                            className="flex items-start space-x-3 text-neutral-600 dark:text-neutral-300"
                        >
                            <img src={homesvg} alt="Home" className="mt-0.5 flex-shrink-0" />
                            <span>Create a new room and invite your friends</span>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                            className="flex items-start space-x-3 text-neutral-600 dark:text-neutral-300"
                        >
                            <img src={linksvg} alt="Link" className="mt-0.5 flex-shrink-0" />
                            <span>Ask your friend to share the room link again</span>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoHome}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 transition-all shadow-md"
                >
                    Go to Home
                </motion.button>

                <motion.p variants={itemVariants} className="text-xs text-neutral-400 dark:text-neutral-500">
                    Room codes are 6 characters long and case-sensitive
                </motion.p>
            </motion.div>
        </motion.div>
    )
}

export default NotFound