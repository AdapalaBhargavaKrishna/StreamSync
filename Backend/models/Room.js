import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isHost: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  host: {
    type: String,
    required: true
  },
  users: {
    type: [UserSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7200
  }
});

const Room = mongoose.model('Room', RoomSchema);
export default Room;
