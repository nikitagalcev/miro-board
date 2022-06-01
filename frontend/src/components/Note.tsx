import React, { memo } from 'react';

export interface INote {
  ownerName: string;
  posX: number;
  posY: number;
  id: number;
  color: string;
  noteText?: string;
}

interface INoteProps extends INote {
  userName: string;
  handleMouseUp: () => void;
  handleOnMouseDown: () => void;
  handleDrag: (e:React.MouseEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const Note: React.FC<INoteProps> = memo(({
  userName,
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
  const isCardOwner = userName === ownerName;

  const noteStyles:React.CSSProperties = {
    position: 'absolute',
    top: posY - 125,
    left: posX - 125,
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
