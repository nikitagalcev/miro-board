import React, { memo, useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { getRandomColor } from '../../helpers/getRandomColor';
import useSockets from '../../hooks/useSockets';
import Note, { INote } from '../Note/Note';
import './WhiteBoard.css';

interface IWhiteBoardProps {
  userName: string;
};

type AddNoteType = Pick<INote,'ownerName'| 'posX' | 'posY'>;

const WhiteBoard: React.FC<IWhiteBoardProps> = memo(({ userName }) => {
  const [notes, setNotes] = useState<INote[]>([]);
  const currentDraggableNote = useRef<INote['id'] | null>(null);

  const {
    sendNoteViaSocket,
    updateNoteViaSocket,
    debouncedNoteUpdateViaSocket,
    parsedNotes,
  } = useSockets({ userName });

  useEffect(() => {
    setNotes(parsedNotes);
  }, [parsedNotes]);

  const addNote = useCallback(({ ownerName, posX, posY }: AddNoteType) => {
    const note = {
      ownerName,
      posX,
      posY,
      id: new Date().valueOf(),
      color: getRandomColor(),
    };

    setNotes([...notes, note]);
    sendNoteViaSocket(note);
  }, [notes, sendNoteViaSocket]);

  const handleWhiteBoardClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || currentDraggableNote.current) return;

    const { clientX, clientY } = event;

    addNote({ ownerName: userName, posX: clientX, posY: clientY });
  }, [addNote, userName]);


  const handleOnMouseDown = useCallback((id: INote['id'], ownerName: INote['ownerName']) => () => {
    if (userName !== ownerName) return;

    currentDraggableNote.current = id;
  }, [userName]);

  const handleMouseUp = useCallback(() => {
    const currentNote = notes.find(({ id }) => currentDraggableNote.current === id);

    if (currentNote) {
      updateNoteViaSocket(currentNote);
    }

    currentDraggableNote.current = null;
  }, [notes, updateNoteViaSocket]);

  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (!currentDraggableNote.current) return;

    setNotes((prevState) => {
      const currentNote = prevState.find(({ id }) => currentDraggableNote.current === id);

      if (!currentNote) return prevState;

      currentNote.posX = e.clientX;
      currentNote.posY = e.clientY;

      return [
        ...prevState.filter(({ id }) => currentDraggableNote.current !== id),
        currentNote,
      ];
    });
  }, []);

  const handleInputChange = useCallback((id: INote['id']) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes((prevState) => {
      const currentNote = prevState.find((note) => note.id === id);

      if (!currentNote) return prevState;

      currentNote.noteText = e.target.value;

      debouncedNoteUpdateViaSocket(currentNote);
      return [
        ...prevState.filter((note) => note.id !== id),
        currentNote,
      ];
    });
  }, [debouncedNoteUpdateViaSocket]);

  return (
    <Fragment>
      <h1>Whiteboard</h1>
      <div className='whiteboard' onClick={handleWhiteBoardClick}>
        {notes.length ? notes.map((note: INote) => (
          <Note
            key={note.id}
            isCardOwner={userName === note.ownerName}
            handleDrag={handleDrag}
            handleMouseUp={handleMouseUp}
            handleOnMouseDown={handleOnMouseDown(note.id, note.ownerName)}
            handleInputChange={handleInputChange(note.id)}
            {...note}
          />
        )) : null}
      </div>
    </Fragment>
  )
}); 


export default WhiteBoard;
