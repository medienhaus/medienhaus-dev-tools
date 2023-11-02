import React, { useState } from 'react';

import { useAuth } from '../lib/Auth';
import { useMatrix } from '../lib/Matrix';
import { handleMatrixRateLimit } from './Utils';

export default function Leave() {
    const [roomName, setRoomName] = useState('');
    const [selectedRoomType, setSelectedRoomType] = useState('rooms');
    const [deleting, setDeleting] = useState(false);
    const [numberOfDeletedRooms, setNumberOfDeletedRooms] = useState(0);
    const [delay, setDelay] = useState(0);
    const auth = useAuth();
    const matrix = useMatrix(auth.getAuthenticationProvider('matrix'));
    const matrixClient = auth.getAuthenticationProvider('matrix').getMatrixClient();

    const leaveMatrixRoom = (roomId) => {
        return matrixClient.leave(roomId)
            .catch(error => handleMatrixRateLimit(error, () => leaveMatrixRoom(roomId))
                .catch(error => console.log(error.message)));
    };

    const handleClick = async () => {
        setNumberOfDeletedRooms(0);
        setDeleting(true);
        if (selectedRoomType === 'all' || selectedRoomType === 'rooms') {
            for (const room of matrix.rooms.values()) {
                if (room.name !== roomName) continue;
                await leaveMatrixRoom(room.roomId);
                setNumberOfDeletedRooms(prevState => prevState + 1);
                await new Promise(r => setTimeout(r, delay));
            }
        }
        if (selectedRoomType === 'all' || selectedRoomType === 'spaces') {
            for (const space of matrix.spaces.values()) {
                if (space.name !== roomName) continue;
                await leaveMatrixRoom(space.roomId);
                setNumberOfDeletedRooms(prevState => prevState + 1);
                await new Promise(r => setTimeout(r, delay));
            }
        }
        setDeleting(false);
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleClick(); }}>

            <select onChange={(e) => setSelectedRoomType(e.target.value)}>
                <option value="rooms">Rooms</option>
                <option value="spaces">Spaces</option>
                <option value="all">All</option>
            </select>
            <label>Room name to leave</label><input type="text" name="room-type" placeholder="Empty Room" onChange={(e) => setRoomName(e.target.value)} value={roomName} />
            <label>delay in ms between leaving each room</label><input type="text" name="delay" placeholder="delay in ms between leaving each room" onChange={(e) => setDelay(e.target.value)} value={delay} />

            <button disabled={deleting} type="submit">
                Leave all { selectedRoomType !== 'all' && selectedRoomType } with the name '{ roomName }'
            </button>
            { numberOfDeletedRooms > 0 && <p>Left { numberOfDeletedRooms } rooms/spaces successfully!</p> }
        </form>

    );
}

