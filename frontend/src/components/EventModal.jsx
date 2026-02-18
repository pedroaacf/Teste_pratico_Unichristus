import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#root')

const defaultHorarioOptions = ['A','B','C','D','E','F']
const turnos = ['MANHA','TARDE','NOITE']

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '820px',
    maxWidth: '95vw',
    maxHeight: '85vh',
    overflow: 'auto',
    padding: '20px',
    borderRadius: '10px',
    boxSizing: 'border-box',
    border: '1px solid #e6e6e6',
    background: '#fff'
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 10000
  }
}

export default function EventModal({ isOpen, onRequestClose, onSave, onDelete, event, slotInfo, rooms }) {
  const [form, setForm] = useState({
    salaId: '',
    data: '',
    turno: 'MANHA',
    horario: 'A',
    descricao: ''
  })

  function formatDateToInput(date) {
    if (!date) return ''
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

  useEffect(() => {
    if (event) {
      const salaIdFromEvent = event.sala?.id || event.raw?.sala?.id || ''
      const dataFromEvent = event.start ? formatDateToInput(event.start) : (event.raw?.data || '')
      setForm({
        salaId: salaIdFromEvent || (rooms[0]?.id || ''),
        data: dataFromEvent,
        turno: event.raw?.turno || 'MANHA',
        horario: event.raw?.horario || 'A',
        descricao: event.title || event.raw?.descricao || ''
      })
      return
    }

    if (slotInfo) {
      setForm({
        salaId: slotInfo.salaId || (rooms[0]?.id || ''),
        data: slotInfo.date ? formatDateToInput(slotInfo.date) : '',
        turno: 'MANHA',
        horario: 'A',
        descricao: ''
      })
      return
    }

    setForm({
      salaId: rooms[0]?.id || '',
      data: '',
      turno: 'MANHA',
      horario: 'A',
      descricao: ''
    })
  }, [event, slotInfo, rooms])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.salaId) {
      alert('Selecione uma sala antes de salvar.')
      return
    }
    if (!form.data) {
      alert('Informe a data.')
      return
    }

    const payload = {
      salaId: form.salaId,
      data: form.data,
      turno: form.turno,
      horario: form.horario,
      descricao: form.descricao
    }

    await onSave(payload, event?.id)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={event ? 'Editar agendamento' : 'Novo agendamento'}
      style={modalStyles}
    >
      <h3 style={{ marginTop: 0 }}>{event ? 'Editar agendamento' : 'Novo agendamento'}</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Sala</label>
          <select
            name="salaId"
            value={form.salaId}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ddd', boxSizing: 'border-box' }}
          >
            <option value="" disabled>-- selecione uma sala --</option>
            {rooms && rooms.map(r => (
              <option key={r.id} value={r.id}>{r.descricao}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display:'block', marginBottom:6 }}>Data</label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ width: 140 }}>
            <label style={{ display:'block', marginBottom:6 }}>Turno</label>
            <select name="turno" value={form.turno} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ddd' }}>
              {turnos.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ width: 120 }}>
            <label style={{ display:'block', marginBottom:6 }}>Horário</label>
            <select name="horario" value={form.horario} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #ddd' }}>
              {defaultHorarioOptions.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display:'block', marginBottom:6 }}>Descrição</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            required
            style={{ width: '100%', minHeight: 100, padding: '8px', borderRadius: 6, border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
          <button type="submit" style={{ padding: '8px 14px', borderRadius: 6, border: 'none', background: '#2a8ef6', color: '#fff' }}>
            {event ? 'Salvar' : 'Criar'}
          </button>

          <button type="button" onClick={onRequestClose} style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #ddd', background: '#fff' }}>
            Cancelar
          </button>

          {event && (
            <button
              type="button"
              onClick={() => onDelete(event.id)}
              style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #f2c2c2', background: '#fff', color: '#d9534f' }}
            >
              Excluir
            </button>
          )}
        </div>
      </form>
    </Modal>
  )
}
