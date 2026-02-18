import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  parseISO,
  differenceInCalendarDays,
  addDays,
  format,
  startOfWeek
} from 'date-fns'
import {
  fetchAgendamentos,
  createAgendamento,
  updateAgendamento,
  deleteAgendamento,
  fetchSalas as apiFetchSalas
} from '../api'
import EventModal from './EventModal'
import EventPopover from './EventPopover'
import '../reservation.css'

const DAYS_TO_SHOW = 5
const BACKEND = 'http://localhost:8080'

const EVENT_HEIGHT = 84
const EVENT_GAP = 10
const LEFT_COLUMN = 260
const MIN_COL_WIDTH = 180
const ROW_MIN_HEIGHT = Math.max(160, EVENT_HEIGHT + EVENT_GAP * 2)

function getWeekStart(date = new Date()) {
  return startOfWeek(date, { weekStartsOn: 1 })
}

export default function ReservationGrid() {
  const [events, setEvents] = useState([])
  const [rooms, setRooms] = useState([])
  const [groupedRooms, setGroupedRooms] = useState({})
  const [baseDate, setBaseDate] = useState(getWeekStart())
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [popover, setPopover] = useState({ visible: false, x: 0, y: 0, event: null })
  const [modalOpen, setModalOpen] = useState(false)
  const [slotInfo, setSlotInfo] = useState(null)
  const [collapsedFloors, setCollapsedFloors] = useState(new Set())

  const [morePopover, setMorePopover] = useState({ visible: false, x: 0, y: 0, items: [], room: null, dayIndex: -1 })

  useEffect(() => { load() }, [baseDate])

  async function load() {
    const data = await fetchAgendamentos()
    const evts = data.map(a => {
      const start = parseISO(a.data)
      const end = addDays(start, 1)
      return { id: a.id, title: a.descricao, start, end, sala: a.sala, raw: a }
    })

    let salaList = null
    try {
      if (typeof apiFetchSalas === 'function') salaList = await apiFetchSalas()
      else {
        const resp = await axios.get(`${BACKEND}/salas`).catch(() => null)
        if (resp && resp.data && Array.isArray(resp.data)) salaList = resp.data
      }
    } catch (e) {
      salaList = null
    }

    let roomsArr = []
    if (salaList && salaList.length) {
      roomsArr = salaList.slice().sort((a, b) => {
        if (a.andar === b.andar) return a.descricao.localeCompare(b.descricao)
        return (a.andar || '').localeCompare(b.andar || '')
      })
    } else {
      const seen = new Map()
      evts.forEach(e => { if (e.sala && !seen.has(e.sala.id)) seen.set(e.sala.id, e.sala) })
      roomsArr = Array.from(seen.values()).sort((a,b) => {
        if (a.andar === b.andar) return a.descricao.localeCompare(b.descricao)
        return (a.andar || '').localeCompare(b.andar || '')
      })
    }

    const grouped = {}
    roomsArr.forEach(r => {
      const g = r.andar || 'Outros'
      if (!grouped[g]) grouped[g] = []
      grouped[g].push(r)
    })

    setEvents(evts)
    setRooms(roomsArr)
    setGroupedRooms(grouped)
  }

  const days = useMemo(() => {
    const arr = []
    for (let i = 0; i < DAYS_TO_SHOW; i++) arr.push(addDays(baseDate, i))
    return arr
  }, [baseDate])

  function toggleFloor(andar) {
    const copy = new Set(collapsedFloors)
    if (copy.has(andar)) copy.delete(andar)
    else copy.add(andar)
    setCollapsedFloors(copy)
  }

  function handleSlotClick(e, salaId, day) {
    setSlotInfo({ salaId, date: day })
    setSelectedEvent(null)
    setModalOpen(true)
  }

  function handleEventClick(e, evt) {
    const rect = e.currentTarget.getBoundingClientRect()
    setPopover({ visible: true, x: rect.right + 8, y: rect.top, event: evt })
  }

  async function handleSave(payload, existingId) {
    if (existingId) await updateAgendamento(existingId, payload)
    else await createAgendamento(payload)
    await load()
    setModalOpen(false)
  }

  async function handleDelete(id) {
    await deleteAgendamento(id)
    await load()
    setModalOpen(false)
    setPopover({ visible: false, event: null })
  }

  function dayIndexFor(date) {
    return differenceInCalendarDays(date, baseDate)
  }

  const calendarMinWidth = LEFT_COLUMN + (DAYS_TO_SHOW * MIN_COL_WIDTH)

  function handleShowMoreClick(e, room, dayIndex, items) {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setMorePopover({
      visible: true,
      x: rect.right + 8,
      y: rect.top,
      items,
      room,
      dayIndex
    })
  }

  function closeMorePopover() {
    setMorePopover({ visible: false, x: 0, y: 0, items: [], room: null, dayIndex: -1 })
  }

  function openEventFromMore(ev) {
    setSelectedEvent(ev)
    setModalOpen(true)
    closeMorePopover()
  }

  useEffect(() => {
    if (!morePopover.visible) return
    function onDocClick(ev) {
      closeMorePopover()
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [morePopover.visible])

  return (
    <div className="reservation-container">
      <div className="reservation-header">
        <button onClick={() => setBaseDate(addDays(baseDate, -DAYS_TO_SHOW))}>◀</button>
        <div className="header-title">{format(baseDate, 'dd MMM yyyy')}</div>
        <button onClick={() => setBaseDate(addDays(baseDate, DAYS_TO_SHOW))}>▶</button>
      </div>

      <div
        className="reservation-grid-wrapper"
        style={{ minWidth: '100%', overflowX: 'auto' }}
      >
        <div style={{ minWidth: `${calendarMinWidth}px` }}>

          <div className="headers-row" style={{ display: 'flex' }}>
            <div style={{ width: LEFT_COLUMN, background: '#fafafa', borderRight: '1px solid #eee' }} />
            <div
              style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: `repeat(${DAYS_TO_SHOW}, minmax(${MIN_COL_WIDTH}px, 1fr))`
              }}
            >
              {days.map((d,i) => (
                <div key={i} className="grid-day" style={{ padding: 12, borderLeft: '1px solid #eee', textAlign: 'center', background: '#f3f6f8' }}>
                  <div className="grid-day-number">{format(d, 'EEE dd')}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rows-container">
            {Object.keys(groupedRooms).map(floor => {
              const roomsOfFloor = groupedRooms[floor] || []
              const collapsed = collapsedFloors.has(floor)

              return (
                <div key={floor} className="floor-block">
                  <div className="floor-header" style={{ display:'flex' }}>
                    <div style={{ width: LEFT_COLUMN, padding: '10px 12px', background: '#fff', borderBottom: '1px solid #f0f0f0', display:'flex', alignItems:'center', gap:8 }}>
                      <button className="collapse-btn" onClick={() => toggleFloor(floor)}>
                        {collapsed ? '▸' : '▾'}
                      </button>
                      <div style={{ fontWeight:700 }}>{floor}</div>
                    </div>
                    <div style={{ flex:1, borderBottom: '1px solid #f0f0f0', background: '#fff' }} />
                  </div>

                  {!collapsed && roomsOfFloor.map(room => (
                    <div key={room.id} className="room-row-wrapper" style={{ display: 'flex' }}>
                      <div className="room-info-cell" style={{ width: LEFT_COLUMN }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight: 700, fontSize: 20 }}>{room.descricao}</div>
                          <div style={{ fontSize: 16, color:'#666' }}>{room.andar}</div>
                        </div>
                        <div style={{ fontSize: 16, color:'#777' }}>{"Capacidade: " + room.capacidade}</div>
                      </div>

                      <div
                        className="room-day-container"
                        style={{
                          flex:1,
                          position:'relative',
                          overflow:'hidden',
                          minHeight: `${ROW_MIN_HEIGHT}px`
                        }}
                      >
                        <div
                          className="grid-row-cells"
                          style={{
                            display:'grid',
                            gridTemplateColumns: `repeat(${DAYS_TO_SHOW}, minmax(${MIN_COL_WIDTH}px, 1fr))`
                          }}
                        >
                          {days.map((d,ci) => (
                            <div key={ci} className="grid-cell" onDoubleClick={(e) => handleSlotClick(e, room.id, d)} style={{ minHeight: ROW_MIN_HEIGHT }} />
                          ))}
                        </div>

                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: `${ROW_MIN_HEIGHT}px`,
                            pointerEvents: 'none'
                          }}
                        >
                          {(() => {
                            const roomEvents = events
                              .filter(ev => ev.sala?.id === room.id)
                              .sort((a,b) => {
                                const da = dayIndexFor(a.start), db = dayIndexFor(b.start)
                                if (da !== db) return da - db
                                return String(a.id).localeCompare(String(b.id))
                              })

                            const singleDayByIndex = Array.from({ length: DAYS_TO_SHOW }, () => [])
                            const multiDay = []

                            roomEvents.forEach(ev => {
                              const s = dayIndexFor(ev.start)
                              const e = dayIndexFor(ev.end)
                              const span = e - s
                              if (span <= 1) {
                                if (s >= 0 && s < DAYS_TO_SHOW) singleDayByIndex[s].push(ev)
                              } else {
                                if (!(e <= 0 || s >= DAYS_TO_SHOW)) multiDay.push(ev)
                              }
                            })

                            const elements = []
                            const dayWidthPct = 100 / DAYS_TO_SHOW

                            multiDay.forEach((ev, idx) => {
                              const s = Math.max(0, dayIndexFor(ev.start))
                              const e = Math.min(DAYS_TO_SHOW, dayIndexFor(ev.end))
                              if (e <= 0 || s >= DAYS_TO_SHOW) return
                              const visibleStart = s
                              const visibleEnd = e
                              const spanWidthPct = (visibleEnd - visibleStart) * dayWidthPct
                              const spanLeftPct = visibleStart * dayWidthPct
                              const centerPct = spanLeftPct + spanWidthPct / 2
                              const eventWidthPct = Math.max(spanWidthPct * 0.88, 12)

                              const topOffset = 8 + (idx * 6)

                              elements.push(
                                <div
                                  key={`md-${ev.id}`}
                                  className="event-bar"
                                  style={{
                                    left: `${centerPct}%`,
                                    width: `calc(${eventWidthPct}% - 20px)`,
                                    top: `${topOffset}px`,
                                    height: `${EVENT_HEIGHT}px`,
                                    pointerEvents: 'auto'
                                  }}
                                  onClick={(e) => handleEventClick(e, ev)}
                                >
                                  <div className="event-title">{ev.title}</div>
                                  <div className="event-meta">{format(ev.start,'dd/MM')} • {ev.raw.turno} {ev.raw.horario}</div>
                                </div>
                              )
                            })

                            for (let di = 0; di < DAYS_TO_SHOW; di++) {
                              const list = singleDayByIndex[di]
                              if (!list || list.length === 0) continue

                              const maxStack = Math.max(1, Math.floor((ROW_MIN_HEIGHT - 12) / (EVENT_HEIGHT + EVENT_GAP)))
                              const toShow = Math.min(list.length, maxStack)
                              const hidden = Math.max(0, list.length - toShow)

                              const contentHeight = toShow * (EVENT_HEIGHT + EVENT_GAP) - EVENT_GAP
                              const startOffset = Math.max(8, (ROW_MIN_HEIGHT - contentHeight) / 2)

                              const centerPct = (di * dayWidthPct) + (dayWidthPct / 2)
                              const cellWidthPct = dayWidthPct

                              for (let i = 0; i < toShow; i++) {
                                const ev = list[i]
                                const topOffset = startOffset + i * (EVENT_HEIGHT + EVENT_GAP)
                                elements.push(
                                  <div
                                    key={`sd-${ev.id}`}
                                    className="event-bar"
                                    style={{
                                      left: `${centerPct}%`,
                                      width: `calc(${cellWidthPct}% - 24px)`,
                                      top: `${topOffset}px`,
                                      height: `${EVENT_HEIGHT}px`,
                                      pointerEvents: 'auto'
                                    }}
                                    onClick={(e) => handleEventClick(e, ev)}
                                  >
                                    <div className="event-title">{ev.title}</div>
                                    <div className="event-meta">{format(ev.start,'dd/MM')} • {ev.raw.turno} {ev.raw.horario}</div>
                                  </div>
                                )
                              }

                              if (hidden > 0) {
                                const pillTop = startOffset + toShow * (EVENT_HEIGHT + EVENT_GAP)
                                elements.push(
                                  <div
                                    key={`more-${room.id}-${di}`}
                                    className="more-pill"
                                    style={{
                                      left: `${centerPct}%`,
                                      top: `${pillTop}px`,
                                      position: 'absolute',
                                      transform: 'translateX(-50%)',
                                      pointerEvents: 'auto'
                                    }}
                                    onClick={(e) => {
                                      handleShowMoreClick(e, room, di, list)
                                    }}
                                  >
                                    +{hidden} more
                                  </div>
                                )
                              }
                            }

                            return elements
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              )
            })}
          </div>

        </div>
      </div>

      {popover.visible && popover.event && (
        <EventPopover
          x={popover.x}
          y={popover.y}
          event={popover.event}
          onEdit={() => { setSelectedEvent(popover.event); setModalOpen(true); setPopover({ visible: false }) }}
          onDelete={() => handleDelete(popover.event.id)}
          onClose={() => setPopover({ visible: false, event: null })}
        />
      )}

      {morePopover.visible && (
        <div
          className="more-popover"
          style={{
            position: 'fixed',
            left: morePopover.x,
            top: morePopover.y,
            zIndex: 11000,
            minWidth: 260,
            maxHeight: 300,
            overflow: 'auto',
            background: '#fff',
            border: '1px solid #e6e6e6',
            borderRadius: 8,
            boxShadow: '0 8px 30px rgba(30,40,60,0.12)',
            padding: 8
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{morePopover.room?.descricao} — {format(days[morePopover.dayIndex], 'dd/MM/yyyy')}</div>
          {morePopover.items.map(it => (
            <div key={it.id} style={{ padding: 8, borderRadius: 6, cursor: 'pointer' }}
                 onClick={() => openEventFromMore(it)}>
              <div style={{ fontWeight: 600 }}>{it.title}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{format(it.start,'dd/MM')} • {it.raw.turno} {it.raw.horario}</div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <EventModal
          isOpen={modalOpen}
          onRequestClose={() => { setModalOpen(false); setSelectedEvent(null) }}
          onSave={handleSave}
          onDelete={handleDelete}
          event={selectedEvent}
          slotInfo={slotInfo}
          rooms={rooms}
        />
      )}
    </div>
  )
}
