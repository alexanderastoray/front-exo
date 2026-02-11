/**
 * EditableTitle Component
 * Title that can be edited inline
 */

import { useState, useRef, useEffect } from 'react';

interface EditableTitleProps {
  initialTitle: string;
  onTitleChange?: (newTitle: string) => void;
}

export function EditableTitle({ initialTitle, onTitleChange }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (onTitleChange) {
      onTitleChange(title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (onTitleChange) {
        onTitleChange(title);
      }
    }
    if (e.key === 'Escape') {
      setTitle(initialTitle);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        {!isEditing ? (
          <h2 className="text-2xl font-bold text-content-light dark:text-content-dark">
            {title}
          </h2>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="text-2xl font-bold text-content-light dark:text-content-dark bg-transparent border-0 focus:ring-2 focus:ring-primary rounded p-1 -ml-1 w-full"
          />
        )}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 text-subtle-light dark:text-subtle-dark hover:text-primary dark:hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-base">edit</span>
      </button>
    </div>
  );
}
