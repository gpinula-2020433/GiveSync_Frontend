import React, { useState } from 'react'
import PublicationForm from './PublicationForm'
import { usePublicationActions } from '../../shared/hooks/publication/usePublicationActions'

const PublicationCard = ({ publication, onChange }) => {
  const [editMode, setEditMode] = useState(false)
  const { deletePublication } = usePublicationActions()

  const handleDelete = async () => {
    if (window.confirm('¿Seguro que deseas eliminar esta publicación?')) {
      await deletePublication(publication._id)
      onChange()
    }
  }

  return (
    <div style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
      {editMode ? (
        <PublicationForm
          existingPublication={publication}
          institutionId={publication.institutionId}
          onSuccess={() => {
            setEditMode(false)
            onChange()
          }}
        />
      ) : (
        <>
          <h3>{publication.title}</h3>
          <p>{publication.content}</p>
          {publication.imagePublication?.map((img, i) => (
            <img
              key={i}
              src={`/uploads/img/users/${img}`}
              alt="publicación"
              style={{ width: 150, marginRight: 10 }}
            />
          ))}
          <div>
            <button onClick={() => setEditMode(true)}>Editar</button>
            <button onClick={handleDelete} style={{ marginLeft: 10, color: 'red' }}>
              Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default PublicationCard