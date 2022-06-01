import React, { memo, useState, useEffect, useRef, useCallback, Fragment } from 'react';
import useSockets from '../hooks/useSockets';
import Note, { INote } from './Note';

interface IWhiteBoardProps {
  userName: string;
};

interface IAddNote {
  userName: string;
  posX: number;
  posY: number;
};

const WhiteBoard: React.FC<IWhiteBoardProps> = memo(({ userName }) => {
  const [notes, setNotes] = useState<INote[]>([]);
  const currentDraggableNote = useRef<number | null>(null);

  const {
    sendNoteViaSocket,
    parsedNotes,
    updateNoteViaSocket,
    debouncedNoteUpdateViaSocket,
  } = useSockets({ userName });

  useEffect(() => {
    setNotes(parsedNotes);
  }, [parsedNotes]);

  const addNote = useCallback(({ userName, posX, posY }: IAddNote) => {
    const note = {
      ownerName: userName,
      posX,
      posY,
      id: new Date().valueOf(),
      color: 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)',
    };

    setNotes([...notes, note]);
    sendNoteViaSocket(note);
  }, [notes, sendNoteViaSocket]);

  const handleWhiteBoardClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    const { clientX, clientY } = event;

    if (!currentDraggableNote.current) {
      addNote({ userName, posX: clientX, posY: clientY });
    }
  }, [addNote, userName]);


  const handleOnMouseDown = useCallback((id: number, ownerName: string) => () => {
    if (userName !== ownerName) return;

    currentDraggableNote.current = id;
  }, [userName]);

  const handleMouseUp = useCallback(() => {
    const currentNote = notes.find(({ id }) => currentDraggableNote.current === id);

    if (currentNote) {
      updateNoteViaSocket(currentNote);
    }

    currentDraggableNote.current = null
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


  const handleInputChange = useCallback((id: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
            userName={userName}
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
