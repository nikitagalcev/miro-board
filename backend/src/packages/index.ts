import { Server, Socket } from "socket.io";
import { INote, ISuperStorage } from '../database';

export const session_name: string = 'miro-board';

export const register_handlers = (socket: Socket, storage: ISuperStorage) => {
  socket.on('update_note', (note: INote) => {
    storage.update_note(note);
  });
  
  socket.on('update_all_notes', (note: INote) => {
    storage.update_all_notes(note);
  });

  socket.on('disconnect', () => {
    console.log('diconnecting socket...');
    socket.leave(session_name);
    socket.disconnect();
  });

  socket.join(session_name);
}
