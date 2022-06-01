import { debounce, DebouncedFunc } from 'lodash';
import { useRef, useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { INote } from '../components/Note';

interface IUseSockets {
  ({ userName }: { userName: string}): {
    sendNoteViaSocket: (note: INote) => void;
    updateNoteViaSocket: (note: INote) => void;
    debouncedNoteUpdateViaSocket: DebouncedFunc<(currentNote: INote) => void>
    parsedNotes: INote[];
  }
};

const useSockets: IUseSockets = ({ userName }) => {
  let socket = useRef<Socket>();

  const [, triggerUpdate] = useState<number>();

  const [parsedNotes, setParsedNotes] = useState<INote[]>([]);
  
  const initiateSocketConnection = useCallback(() => {
    socket.current = io('http://localhost:4000', {
      transports: ['websocket', 'polling', 'flashsocket'], // todo read about it
      query: { user_name: userName },
    });

    triggerUpdate(Math.random());
    console.log('Connecting socket...');
  }, [userName])
  
  const disconnectSocket = useCallback(() => {
    console.log('Disconnectiong socket...');
  
    if (socket.current) socket.current.disconnect();
  }, []);
  
  const sendNoteViaSocket = useCallback((note: INote) => {
    if (socket.current) {
      socket.current.emit('update_all_notes', note);
    }
  }, []);

  const updateNoteViaSocket = useCallback((note: INote) => {
    if (socket.current) {
      socket.current.emit('update_note', note);
    }
  }, []);

  const debouncedNoteUpdateViaSocket = useCallback(
    debounce((currentNote) => updateNoteViaSocket(currentNote), 400), 
    [updateNoteViaSocket]);


  useEffect(() => {
    if (userName) {
      initiateSocketConnection();

      socket.current?.on('get_all_notes', (data: INote[]) => {
        setParsedNotes(data);
      });

      return () => {
        disconnectSocket();
      }
    }
  }, [disconnectSocket, initiateSocketConnection, userName]);

  return {
    sendNoteViaSocket,
    updateNoteViaSocket,
    debouncedNoteUpdateViaSocket,
    parsedNotes
  };
};

export default useSockets;
