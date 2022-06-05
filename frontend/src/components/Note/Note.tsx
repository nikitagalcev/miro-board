import React, { memo } from 'react';
import './Note.css'

export interface INote {
  readonly ownerName: string;
  readonly id: number;
  readonly color: string;
  posX: number;
  posY: number;
  noteText?: string;
};

interface INoteProps extends INote {
  isCardOwner: boolean;
  handleMouseUp: () => void;
  handleOnMouseDown: () => void;
  handleDrag: (e:React.MouseEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const Note: React.FC<INoteProps> = memo(({
  isCardOwner,
  ownerName,
  color,
  posX,
  posY,
  noteText,
  handleDrag,
  handleMouseUp,
  handleOnMouseDown,
  handleInputChange,
}) => {

  const noteStyles:React.CSSProperties = {
    position: 'absolute',
    top: posY - 125, // 125 - half of height
    left: posX - 125, // 125 - half of width
    backgroundColor: color,
    cursor: isCardOwner ? 'grab' : 'not-allowed',
    ...(isCardOwner ? { border: '4px dashed black' } : {}),
  };

  return (
    <div
      className='note'
      style={noteStyles}
      onMouseDown={handleOnMouseDown}
      onMouseMove={handleDrag}
      onMouseUp={handleMouseUp}
    >
      <h3>{ownerName}</h3>
      <textarea
        defaultValue={noteText}
        onChange={handleInputChange}
        disabled={!isCardOwner}
      />
    </div>
  )
});

export default Note;
