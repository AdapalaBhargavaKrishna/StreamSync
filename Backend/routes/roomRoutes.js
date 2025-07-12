import express from 'express';
import Room from '../models/Room.js';

const router = express.Router();

router.get('/:roomId', async (req, res) => {
    const { roomId } = req.params;
    try {
        const room = await Room.findOne({ roomId });
        if (!room) return res.status(404).json({
            message: 'Room not found'
        })
        res.status(200).json({ room });
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/', async (req, res) => {
    const { roomId, host } = req.body;

    try {
        const existingRoom = await Room.findOne({ roomId });
        if (existingRoom) {
            return res.status(400).json({
                message: 'Room with this code already exists'
            });
        }

        const newRoom = new Room({
            roomId,
            host,
            users: [{ name: host, isHost: true }]
        });

        await newRoom.save();
        res.status(201).json({ message: 'Room created successfully', room: newRoom });
    } catch (error) {
        console.error('Error creating room:', error.message);
        res.status(500).json({ message: 'Error creating room' });
    }
});

router.post('/join', async (req, res) => {
    const { roomId, name } = req.body;

    try {
        const room = await Room.findOne({ roomId });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        const alreadyInRoom = room.users.some(user => user.name === name);
        if (!alreadyInRoom) {
            room.users.push({ name, isHost: false });
            await room.save();
        }

        res.json({ message: 'Joined Room', room });
    } catch (err) {
        console.error('Error joining room:', err);
        res.status(500).json({ error: 'Error joining room' });
    }
});

router.delete('/:roomId', async (req, res) => {
    const { roomId } = req.params;
    try {
        const room = await Room.findOne({ roomId })
        if (!room) return res.status(404).json({
            message: 'Room not found'
        })
        await Room.deleteOne({ roomId });
        res.status(200).json({
            message: 'Room deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/leave', async (req, res) => {
    const { roomId, name } = req.body;
    try {
        const room = await Room.findOne({ roomId })
        if (!room) return res.status(404).json({
            message: 'Room not found'
        });
        if (room.host === name) {
            return res.status(400).json({ error: 'Host must delete room instead of leaving' });
        }
        room.users = room.users.filter(user => user.name !== name);
        await room.save();
        res.status(200).json({
            message: 'Left room successfully'
        });
    } catch (error) {
        console.error('Error leaving room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/kick', async (req, res) => {
    const { roomId, target } = req.body;
    try {
        const room = await Room.findOne({ roomId });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        room.users = room.users.filter(user => user.name !== target);
        await room.save();
        res.status(200).json({message: `${target} removed from room`})
    } catch (error) {
        console.log('Kick error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

export default router