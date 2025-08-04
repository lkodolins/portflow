import { useState, useEffect, useRef } from 'react'

const EditableText = ({ 
  value, 
  onSave, 
  isEditing, 
  className = '', 
  placeholder = '', 
  multiline = false 
}) => {
  const [editValue, setEditValue] = useState(value)
  const [isLocalEditing, setIsLocalEditing] = useState(false)
  const inputRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && isLocalEditing) {
      const ref = multiline ? textareaRef.current : inputRef.current
      if (ref) {
        ref.focus()
        ref.select()
      }
    }
  }, [isEditing, isLocalEditing, multiline])

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim())
    }
    setIsLocalEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsLocalEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Enter' && e.metaKey && multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing && isLocalEditing) {
    return multiline ? (
      <textarea
        ref={textareaRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full bg-white border border-primary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${className}`}
        rows={3}
      />
    ) : (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full bg-white border border-primary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${className}`}
      />
    )
  }

  return (
    <div
      onClick={() => isEditing && setIsLocalEditing(true)}
      className={`${className} ${
        isEditing 
          ? 'cursor-text hover:bg-gray-50 rounded-lg px-3 py-2 -mx-3 -my-2 transition-colors duration-200' 
          : ''
      }`}
    >
      {value || (isEditing && <span className="text-gray-400 italic">{placeholder}</span>)}
    </div>
  )
}

export default EditableText 