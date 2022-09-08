import React, { useState } from 'react';

import { useAuth } from '../lib/Auth';
import { useMatrix } from '../lib/Matrix';

export default function Dashboard() {
    const [roomName, setRoomName] = useState('');
    const [selectedRoomType, setSelectedRoomType] = useState('rooms');
    const [deleting, setDeleting] = useState(false);
    const [numberOfDeletedRooms, setNumberOfDeletedRooms] = useState(0);
    const [delay, setDelay] = useState(0);
    const auth = useAuth();
    const matrix = useMatrix(auth.getAuthenticationProvider('matrix'));
    const matrixClient = auth.getAuthenticationProvider('matrix').getMatrixClient();

    const handleClick = async () => {
        setNumberOfDeletedRooms(0);
        setDeleting(true);
        if (selectedRoomType === 'all' || selectedRoomType === 'rooms') {
            for (const room of matrix.rooms.values()) {
                if (room.name !== roomName) continue;
                matrixClient.leave(room.roomId);
                setNumberOfDeletedRooms(prevState => prevState + 1);
                await new Promise(r => setTimeout(r, delay));
            }
        }
        if (selectedRoomType === 'all' || selectedRoomType === 'spaces') {
            for (const space of matrix.spaces.values()) {
                if (space.name !== roomName) continue;
                matrixClient.leave(space.roomId);
                setNumberOfDeletedRooms(prevState => prevState + 1);
                await new Promise(r => setTimeout(r, delay));
            }
        }
        setDeleting(false);
    };
    return (
        <>
            <select onChange={(e) => setSelectedRoomType(e.target.value)}>
                <option value="rooms">Rooms</option>
                <option value="spaces">Spaces</option>
                <option value="all">All</option>
            </select>
            <label>Room name to leave</label><input type="text" name="room-type" placeholder="Empty Room" onChange={(e) => setRoomName(e.target.value)} value={roomName} />
            <label>delay in ms between leaving each room</label><input type="text" name="delay" placeholder="delay in ms between leaving each room" onChange={(e) => setDelay(e.target.value)} value={delay} />

            <button disabled={deleting}
                onClick={handleClick}>Leave all { selectedRoomType } with the name '{ roomName }'</button>
            { numberOfDeletedRooms > 0 && <p>Left { numberOfDeletedRooms } rooms/spaces successfully!</p> }
        </>

    );
}

