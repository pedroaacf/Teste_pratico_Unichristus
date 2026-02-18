import React from 'react'
import '../reservation.css'
import { format } from 'date-fns'

export default function EventPopover({ x, y, event, onClose, onEdit, onDelete }) {
  if (!event) return null
  const a = event.raw
  return (
    <div className="event-popover" style={{ left: x, top: y }}>
      <div className="popover-header">
        <strong>{event.title}</strong>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="popover-body">
        <div><strong>Sala:</strong> {event.sala?.descricao}</div>
        <div><strong>Data:</strong> {format(event.start, 'dd/MM/yyyy')}</div>
        <div><strong>Turno / Horário:</strong> {a.turno} • {a.horario}</div>
        <div style={{ marginTop: 8 }}>{a.descricao}</div>
      </div>
      <div className="popover-actions">
        <button onClick={onEdit}>Editar</button>
        <button onClick={() => onDelete(event.id)} className="danger">Excluir</button>
      </div>
    </div>
  )
}
