import React, { useState } from 'react';

import { useAuth } from '../lib/Auth';
import { useMatrix } from '../lib/Matrix';
import { handleMatrixRateLimit } from '../components/Utils';

export default function Leave() {
    const [roomName, setRoomName] = useState('');
    const [selectedRoomType, setSelectedRoomType] = useState('all');
    const [deleting, setDeleting] = useState(false);
    const [numberOfDeletedRooms, setNumberOfDeletedRooms] = useState(0);
    const [leaveEverything, setLeaveEverything] = useState(false);
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
                if (!leaveEverything && room.name !== roomName) continue;
                await leaveMatrixRoom(room.roomId);
                setNumberOfDeletedRooms(prevState => prevState + 1);
                await new Promise(r => setTimeout(r, delay));
            }
        }
        if (selectedRoomType === 'all' || selectedRoomType === 'spaces') {
            for (const space of matrix.spaces.values()) {
                if (!leaveEverything && space.name !== roomName) continue;
                await leaveMatrixRoom(space.roomId);
                setNumberOfDeletedRooms(prevState => prevState + 1);
                await new Promise(r => setTimeout(r, delay));
            }
        }
        setDeleting(false);
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleClick(); }}>

            <select disabled={leaveEverything} onChange={(e) => setSelectedRoomType(e.target.value)}>
                <option value="all">All</option>
                <option value="rooms">Rooms</option>
                <option value="spaces">Spaces</option>
            </select>
            <label>Room name to leave</label><input disabled={leaveEverything} type="text" name="room-type" placeholder="Empty Room" onChange={(e) => setRoomName(e.target.value)} value={roomName} />
            <label>delay in ms between leaving each room</label><input type="text" name="delay" placeholder="delay in ms between leaving each room" onChange={(e) => setDelay(e.target.value)} value={delay} />
            <input onChange={() => setLeaveEverything(prevState => !prevState)} type="checkbox" id="leave-all" name="leave-all" checked={leaveEverything} />
            <label htmlFor="leave-all">Leave every room and space</label>
            <button disabled={deleting} type="submit">
                { leaveEverything ? 'Leave everything!!' :
                    `Leave all ${selectedRoomType !== 'all' && selectedRoomType } with the name '${ roomName }'`
                }
            </button>
            { numberOfDeletedRooms > 0 && <p>Left { numberOfDeletedRooms } rooms/spaces successfully!</p> }
        </form>
    );
}

