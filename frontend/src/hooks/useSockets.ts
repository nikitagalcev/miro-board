import { debounce, DebouncedFunc } from 'lodash';
import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { INote } from '../components/Note/Note';

interface IUseSockets {
  ({ userName }: { userName: string}): {
    sendNoteViaSocket: (note: INote) => void;
    updateNoteViaSocket: (note: INote) => void;
    debouncedNoteUpdateViaSocket: DebouncedFunc<(currentNote: INote) => void>
    parsedNotes: INote[];
  }
};

const isDev = process.env.NODE_ENV === 'development';

const useSockets: IUseSockets = ({ userName }) => {
  const [socket, setSocket] = useState<Socket>();
  const [parsedNotes, setParsedNotes] = useState<INote[]>([]);
  
  const initiateSocketConnection = useCallback(() => {
    const socketCurrent = io(isDev ? 'http://localhost:4000' : '/', {
      transports: ['websocket', 'polling', 'flashsocket'],
      query: { user_name: userName },
    });

    setSocket(socketCurrent);
    console.log('Connecting socket...');
  }, [userName])
  
  const disconnectSocket = useCallback(() => {
    console.log('Disconnectiong socket...');
  
    if (socket) socket.disconnect();
  }, [socket]);
  
  const sendNoteViaSocket = useCallback((note: INote) => {
    if (socket) {
      socket.emit('update_all_notes', note);
    }
  }, [socket]);

  const updateNoteViaSocket = useCallback((note: INote) => {
    if (socket) {
      socket.emit('update_note', note);
    }
  }, [socket]);

  const debouncedNoteUpdateViaSocket = useCallback(
    debounce((currentNote) => updateNoteViaSocket(currentNote), 400), 
    [updateNoteViaSocket]);

  useEffect(() => {
    if (userName) {
      initiateSocketConnection();
    }
  }, [userName]);

  useEffect(() => {
    if (socket) {
      socket?.on('get_all_notes', (data: INote[]) => {
        setParsedNotes(data);
      });
  
      return () => {
        disconnectSocket();
      }
    }
  }, [socket])

  return {
    sendNoteViaSocket,
    updateNoteViaSocket,
    debouncedNoteUpdateViaSocket,
    parsedNotes
  };
};

export default useSockets;
