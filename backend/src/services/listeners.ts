import { Socket } from 'socket.io';
import { INote, ISuperDatabase } from '../database/super_storage';

export const session_name: string = 'miro-board';

export interface IListeners {
  update_note: (note: INote) => void;
  update_all_notes: (note: INote) => void;
  get_all_notes: () => void;
  disconnect: () => void;
};

export const register_listeners = (socket: Socket<IListeners, Record<keyof IListeners, any>>, storage: ISuperDatabase) => {
  socket.on('update_note', (note: INote) => {
    storage.update_note(note);
  });
  
  socket.on('update_all_notes', (note: INote) => {
    storage.update_all_notes(note);
    socket.to(session_name).emit(
      'get_all_notes',
      storage.get_all_notes(),
    );
  });

  socket.on('disconnect', () => {
    console.log('diconnecting socket...');
    socket.leave(session_name);
    socket.disconnect();
  });

  socket.join(session_name);
};
