import React, { useState } from 'react';
import styled from 'styled-components';

import { useAuth } from '../lib/Auth';
// import { useMatrix } from '../lib/Matrix';

const Textarea = styled.textarea`
  width: 100%;
  padding: calc(var(--margin) * 0.4) calc(var(--margin) * 0.5);
  color: var(--color-fg);
  resize: vertical;
  background-color: var(--color-bg);
  border-color: var(--color-fg);
  border-style: solid;
  border-width: calc(var(--margin) * 0.2);
  border-radius: unset;
  box-shadow: none;
  appearance: none;
`;
export default function StateEvent() {
    const [roomId, setRoomId] = useState('');
    const [stateEventName, setStateEventName] = useState('');
    const [stateEvent, setStateEvent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [validJson, setValidJson] = useState(false);
    const auth = useAuth();
    // const matrix = useMatrix(auth.getAuthenticationProvider('matrix'));
    const matrixClient = auth.getAuthenticationProvider('matrix').getMatrixClient();

    const handleClick = async () => {
        setSubmitting(true);
        await matrixClient.sendStateEvent(roomId, stateEventName, JSON.parse(stateEvent))
            .catch((err) => {
                setFeedback(err);
                return;
            });
        setFeedback('succesfully sent stat event!');
        setSubmitting(false);
    };

    const validateJson = async (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            //JSON is not okay
            setValidJson(false);
            await new Promise(() => setTimeout(setFeedback(e.message), 20));
            setFeedback('');
            return;
        }
        setFeedback('');
        setValidJson(true);
        return true;
    };
    return (
        <form onSubmit={(e) => { e.preventDefault(); handleClick(); }}>
            <label>Room or Space ID</label>
            <input type="text" name="roomId" placeholder="!jwo77UDSrXKBSmbuP:server.com" onChange={(e) => setRoomId(e.target.value)} value={roomId} />
            <label>Name of State Event</label>
            <input type="text" name="json" placeholder="org.website.event" onChange={(e) => setStateEventName(e.target.value)} value={stateEventName} />
            <label>State Event Object</label>
            <Textarea name="json"
                placeholder="{'key': 'value'}"
                onChange={(e) => {
                    setFeedback('');
                    setStateEvent(e.target.value);
                }}
                onBlur={e => validateJson(e.target.value)}
                value={stateEvent} />
            <button disabled={submitting || !validJson || !stateEventName || !roomId} type="submit">
                Add state event
            </button>
            { feedback && <p>{ feedback }</p> }
        </form>

    );
}

