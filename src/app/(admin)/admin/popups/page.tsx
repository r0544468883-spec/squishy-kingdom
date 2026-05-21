'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PopupLocation } from '@/types'

export default function AdminPopupsPage() {
  const [popups, setPopups] = useState<PopupLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => { loadPopups() }, [])

  async function loadPopups() {
    const supabase = createClient()
    const { data } = await supabase.from('popup_locations').select('*').order('date', { ascending: false })
    setPopups((data || []) as PopupLocation[])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()
    await supabase.from('popup_locations').insert({
      name, address, date,
      start_time: startTime || null,
      end_time: endTime || null,
      description: description || null,
    })
    setShowForm(false)
    setName(''); setAddress(''); setDate(''); setStartTime(''); setEndTime(''); setDescription('')
    loadPopups()
  }

  async function deletePopup(id: string) {
    if (!confirm('למחוק?')) return
    const supabase = createClient()
    await supabase.from('popup_locations').delete().eq('id', id)
    loadPopups()
  }

  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-kingdom-red"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">נקודות פופ-אפ</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-kingdom-red text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-kingdom-red-hover transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          נקודה חדשה
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">שם *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">כתובת</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">תאריך *</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} dir="ltr" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">שעת התחלה</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">שעת סיום</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className={inputClass} dir="ltr" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">תיאור</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className={inputClass} rows={2} />
          </div>
          <button type="submit" className="bg-kingdom-red text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-kingdom-red-hover cursor-pointer">
            הוספה
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">טוען...</div>
        ) : popups.length === 0 ? (
          <div className="p-8 text-center text-gray-400">אין נקודות פופ-אפ</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {popups.map(popup => (
              <div key={popup.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{popup.name}</p>
                  <p className="text-xs text-gray-500">
                    {popup.address} | {new Date(popup.date).toLocaleDateString('he-IL')}
                    {popup.start_time && ` | ${popup.start_time}-${popup.end_time}`}
                  </p>
                </div>
                <button onClick={() => deletePopup(popup.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
