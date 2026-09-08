import React, { useState, useEffect } from 'react';
import { Calendar, Download, Share2, Plus, Trash2, Moon } from 'lucide-react';

const CycleTracker = () => {
  // Phase-based color palette: Lively-inspired earth tones
  const PHASE_COLORS = {
    menstrual: { border: '#C47B6D', accent: '#D4A5A5', light: '#F5EAE7' },      // Soft rust/terracotta
    follicular: { border: '#8BA88F', accent: '#A8C9A8', light: '#E8F0E8' },     // Sage green
    ovulation: { border: '#D4C68A', accent: '#E8DDB5', light: '#FFFBF0' },      // Warm cream/gold
    luteal: { border: '#9B9FB5', accent: '#B5B9D4', light: '#EEF0F7' }          // Soft mauve
  };
  const CYCLE_LENGTH = 28;
  const PHASE_INFO = {
    menstrual: {
      days: [0, 1, 2, 3, 4],
      name: 'Menstrual',
      emoji: '🌑',
      description: 'Low hormones. A time to shed, rest, and turn inward.',
      energy: 'Lower energy—this is restorative time',
      lifestyle: ['Gentle movement (yoga, walking)', 'Prioritize sleep', 'Introspection and journaling', 'Lighter social commitments', 'Self-care rituals'],
      nutrition: ['Iron-rich foods (spinach, lentils, red meat)', 'Magnesium for comfort (nuts, leafy greens)', 'Warm, nourishing meals', 'Extra hydration', 'Herbal teas'],
      partnerSupport: ['Encourage rest without pressure', 'Handle household tasks', 'Offer cozy, low-key time together', 'Be emotionally present', 'Bring comfort foods she loves']
    },
    follicular: {
      days: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      name: 'Follicular',
      emoji: '🌱',
      description: 'Estrogen rising. Energy and optimism are building.',
      energy: 'Increasing energy and motivation—time to go harder',
      lifestyle: ['High-intensity workouts', 'Start new projects', 'Social engagement', 'Goal-setting and planning', 'Try new things'],
      nutrition: ['Whole grains', 'Fresh vegetables and fruits', 'Lean proteins', 'Lighter, cleaner meals', 'Explore new recipes'],
      partnerSupport: ['Match her enthusiasm', 'Support new ideas', 'Plan active adventures', 'Engage socially', 'Be her biggest cheerleader']
    },
    ovulation: {
      days: [15, 16, 17],
      name: 'Ovulation',
      emoji: '✨',
      description: 'Peak confidence and radiance. Your most magnetic time.',
      energy: 'Peak energy and presence; heightened communication and magnetism',
      lifestyle: ['Intense workouts feel amazing', 'Take on big presentations', 'Network and connect', 'Adventurous activities', 'High-visibility moments'],
      nutrition: ['Protein and antioxidants', 'Balanced, clean meals', 'Foods with omega-3s', 'Stay well-hydrated', 'Nutrient-dense options'],
      partnerSupport: ['Celebrate her confidence', 'Support her big asks', 'Engage in social moments', 'Match her energy and radiance', 'Be present for her wins']
    },
    luteal: {
      days: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
      name: 'Luteal',
      emoji: '🌙',
      description: 'Progesterone rising then falling. Focus inward, wrap up, and be gentle.',
      energy: 'Gradually declining; early phase still has energy, late phase is introspective',
      lifestyle: ['Moderate to gentle workouts', 'Complete projects', 'Organize and plan ahead', 'Rest and boundaries', 'Stress management'],
      nutrition: ['Slightly more calories', 'Complex carbs for mood', 'Calcium and magnesium', 'Satisfying, grounding foods', 'Reduce stimulants if they trigger mood'],
      partnerSupport: ['Be patient and understanding', 'Help with task completion', 'Offer space when needed', 'Provide comfort and reassurance', 'Be kind during PMS']
    }
  };

  const [cycleStartDate, setCycleStartDate] = useState(() => {
    const stored = localStorage.getItem('cycleStartDate');
    return stored || '2026-08-31';
  });
  
  const [notes, setNotes] = useState(() => {
    const stored = localStorage.getItem('notes');
    return stored ? JSON.parse(stored) : [];
  });

  const [showPartnerView, setShowPartnerView] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [selectedPhase, setSelectedPhase] = useState(null);

  useEffect(() => {
    localStorage.setItem('cycleStartDate', cycleStartDate);
  }, [cycleStartDate]);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const calculateDayInCycle = (date) => {
    const start = new Date(cycleStartDate);
    const diffTime = Math.abs(date - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays % CYCLE_LENGTH;
  };

  const getPhaseForDay = (dayInCycle) => {
    for (const [key, phase] of Object.entries(PHASE_INFO)) {
      if (phase.days.includes(dayInCycle)) {
        return { key, ...phase };
      }
    }
    return null;
  };

  const getCurrentPhase = () => {
    const today = new Date();
    const dayInCycle = calculateDayInCycle(today);
    return getPhaseForDay(dayInCycle);
  };

  const getCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dayInCycle = calculateDayInCycle(date);
      const phase = getPhaseForDay(dayInCycle);
      days.push({ date, dayInCycle, phase });
    }
    return days;
  };

  const exportToGoogleCalendar = () => {
    const events = [];
    const today = new Date();
    
    // Generate events for next 3 months
    for (let month = 0; month < 3; month++) {
      for (let day = 0; day < CYCLE_LENGTH; day++) {
        const date = new Date(cycleStartDate);
        date.setDate(date.getDate() + (CYCLE_LENGTH * month) + day);
        
        // Only export Menstrual and Luteal phases
        const phase = getPhaseForDay(day);
        if (phase && (phase.key === 'menstrual' || phase.key === 'luteal')) {
          const startDate = new Date(date);
          const endDate = new Date(date);
          endDate.setDate(endDate.getDate() + 1);
          
          events.push({
            title: phase.name + ' Phase',
            start: startDate,
            end: endDate,
            allDay: true
          });
        }
      }
    }

    // Generate ICS content
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cycle Tracker//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VTIMEZONE
TZID:America/Los_Angeles
BEGIN:STANDARD
TZOFFSETFROM:-0700
TZOFFSETTO:-0800
TZNAME:PST
DTSTART:20231105T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
BEGIN:DAYLIGHT
TZOFFSETFROM:-0800
TZOFFSETTO:-0700
TZNAME:PDT
DTSTART:20230312T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
END:VTIMEZONE
`;

    events.forEach((event, idx) => {
      const startStr = event.start.toISOString().split('T')[0].replace(/-/g, '');
      const endStr = event.end.toISOString().split('T')[0].replace(/-/g, '');
      
      icsContent += `BEGIN:VEVENT
UID:${idx}@cycle-tracker.local
DTSTART;VALUE=DATE:${startStr}
DTEND;VALUE=DATE:${endStr}
SUMMARY:${event.title}
DESCRIPTION:Cycle tracking reminder
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`;
    });

    icsContent += `END:VCALENDAR`;

    // Download ICS file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent));
    element.setAttribute('download', 'menstrual_cycle.ics');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const addNote = () => {
    if (newNote.trim()) {
      const phase = getCurrentPhase();
      setNotes([...notes, { 
        id: Date.now(), 
        date: new Date().toLocaleDateString(),
        phase: phase?.name || 'Unknown',
        text: newNote 
      }]);
      setNewNote('');
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const currentPhase = getCurrentPhase();
  const calendarDays = getCalendarDays();

  if (showPartnerView) {
    return (
      <div style={{ backgroundColor: '#FDFBF8', minHeight: '100vh' }} className="p-6 md:p-8">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            font-family: 'Inter', sans-serif;
          }
          
          .phase-serif {
            font-family: 'Lora', serif;
          }
          
          .phase-card {
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0,0,0,0.05);
          }
        `}</style>

        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setShowPartnerView(false)}
            className="mb-8 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            ← Back to your view
          </button>

          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-light phase-serif text-gray-900 mb-2">
              How to Support
            </h1>
            <p className="text-gray-600">Understanding her cycle and what she needs right now</p>
          </div>

          {currentPhase && (
            <div className="mb-16">
              <div 
                className="phase-card p-10 md:p-12 rounded-lg"
                style={{ 
                  backgroundColor: `${PHASE_COLORS[currentPhase.key].light}`,
                  borderColor: PHASE_COLORS[currentPhase.key].border,
                  borderTop: `4px solid ${PHASE_COLORS[currentPhase.key].border}`
                }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <span className="text-5xl">{currentPhase.emoji}</span>
                  <div>
                    <h2 className="phase-serif text-4xl font-semibold text-gray-900 mb-2">
                      {currentPhase.name} Phase
                    </h2>
                    <p className="text-gray-700 text-lg">{currentPhase.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 mt-10">
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-600 font-semibold mb-4">How She Might Feel</h3>
                    <p className="text-gray-800 leading-relaxed">{currentPhase.energy}</p>
                  </div>
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-600 font-semibold mb-4">Ways to Support Her</h3>
                    <ul className="space-y-3">
                      {currentPhase.partnerSupport.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-gray-400 mt-1">•</span>
                          <span className="text-gray-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calendar */}
          <div className="mb-16">
            <h3 className="phase-serif text-2xl font-semibold text-gray-900 mb-6">Looking Ahead</h3>
            
            <div className="bg-white phase-card p-8 rounded-lg">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-500 py-3">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 mb-8">
                {calendarDays.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => day.phase && setSelectedPhase(day.phase)}
                    className="aspect-square rounded flex flex-col items-center justify-center text-xs font-medium transition relative hover:opacity-80"
                    style={{
                      backgroundColor: day.phase ? PHASE_COLORS[day.phase.key].light : '#FDFBF8',
                      borderTop: day.phase ? `3px solid ${PHASE_COLORS[day.phase.key].border}` : 'none',
                      color: day.phase ? PHASE_COLORS[day.phase.key].border : '#999',
                      cursor: day.phase ? 'pointer' : 'default'
                    }}
                  >
                    <div className="font-semibold">{day.date.getDate()}</div>
                    {day.date.toDateString() === new Date().toDateString() && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{backgroundColor: '#D97757'}}></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                {Object.entries(PHASE_INFO).map(([key, phase]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{backgroundColor: PHASE_COLORS[key].border}}
                    ></div>
                    <span className="text-sm text-gray-700">{phase.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white phase-card p-8 rounded-lg">
            <h3 className="phase-serif text-lg font-semibold text-gray-900 mb-6">Notes & Observations</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
              {notes.length === 0 ? (
                <p className="text-gray-500 text-sm">No notes yet. Add one to track patterns and observations.</p>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="border-l-2 pl-4 py-3 border-gray-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-medium text-gray-600">{note.phase} · {note.date}</p>
                        <p className="text-sm text-gray-800 mt-1.5">{note.text}</p>
                      </div>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-gray-400 hover:text-gray-600 ml-4"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNote()}
                placeholder="Share a note or observation..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
              <button
                onClick={addNote}
                className="px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Phase Preview Modal - Partner View */}
        {selectedPhase && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div 
              className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto phase-card"
              style={{
                borderTop: `4px solid ${PHASE_COLORS[selectedPhase.key].border}`
              }}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{selectedPhase.emoji}</span>
                    <div>
                      <h2 className="phase-serif text-3xl font-semibold text-gray-900">
                        {selectedPhase.name}
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">{selectedPhase.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPhase(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-600 font-semibold mb-3">How She Might Feel</h3>
                    <p className="text-gray-800 text-sm leading-relaxed mb-6">{selectedPhase.energy}</p>
                    
                    <h3 className="text-sm uppercase tracking-wider text-gray-600 font-semibold mb-3">Lifestyle</h3>
                    <ul className="space-y-2">
                      {selectedPhase.lifestyle.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span className="text-gray-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-600 font-semibold mb-3">What She Might Need</h3>
                    <ul className="space-y-2">
                      {selectedPhase.partnerSupport.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span className="text-gray-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPhase(null)}
                  className="mt-8 w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FDFBF8', minHeight: '100vh' }} className="p-6 md:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .phase-serif {
          font-family: 'Lora', serif;
        }
        
        .phase-card {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        button:focus {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-light phase-serif text-gray-900 mb-2">
                Your Cycle
              </h1>
              <p className="text-gray-600 text-base">Track your rhythm, understand your patterns</p>
            </div>
            <button
              onClick={() => setShowPartnerView(true)}
              className="px-5 py-2.5 text-sm font-medium text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        {/* Current Phase */}
        {currentPhase && (
          <div className="mb-16">
            <div 
              className="phase-card p-10 md:p-12 rounded-lg mb-8"
              style={{ 
                backgroundColor: currentPhase.emoji ? `${PHASE_COLORS[currentPhase.key].light}` : 'white',
                borderColor: PHASE_COLORS[currentPhase.key].border
              }}
            >
              <div className="flex items-start gap-4 mb-6">
                <span className="text-5xl">{currentPhase.emoji}</span>
                <div className="flex-1">
                  <h2 className="phase-serif text-4xl font-semibold text-gray-900 mb-1">
                    {currentPhase.name}
                  </h2>
                  <p className="text-gray-700">{currentPhase.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-600 font-semibold mb-3">Energy & Mood</h3>
                  <p className="text-gray-800 leading-relaxed mb-6">{currentPhase.energy}</p>
                  
                  <h3 className="text-sm uppercase tracking-wider text-gray-600 font-semibold mb-3">Lifestyle</h3>
                  <ul className="space-y-2.5">
                    {currentPhase.lifestyle.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-600 font-semibold mb-3">Nutrition</h3>
                  <ul className="space-y-2.5">
                    {currentPhase.nutrition.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="mb-16">
          <h3 className="phase-serif text-2xl font-semibold text-gray-900 mb-6">This Month</h3>
          
          <div className="bg-white phase-card p-8 rounded-lg">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-3">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => day.phase && setSelectedPhase(day.phase)}
                  className="aspect-square rounded flex flex-col items-center justify-center text-xs font-medium transition relative hover:opacity-80"
                  style={{
                    backgroundColor: day.phase ? PHASE_COLORS[day.phase.key].light : '#FDFBF8',
                    borderTop: day.phase ? `3px solid ${PHASE_COLORS[day.phase.key].border}` : 'none',
                    color: day.phase ? PHASE_COLORS[day.phase.key].border : '#999',
                    cursor: day.phase ? 'pointer' : 'default'
                  }}
                >
                  <div className="font-semibold">{day.date.getDate()}</div>
                  {day.date.toDateString() === new Date().toDateString() && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{backgroundColor: '#D97757'}}></div>
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
              {Object.entries(PHASE_INFO).map(([key, phase]) => (
                <div key={key} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{backgroundColor: PHASE_COLORS[key].border}}
                  ></div>
                  <span className="text-sm text-gray-700">{phase.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white phase-card p-8 rounded-lg">
            <h3 className="phase-serif text-lg font-semibold text-gray-900 mb-6">Settings</h3>
            <label className="block mb-6">
              <span className="text-sm font-medium text-gray-700 mb-2 block">Cycle Start Date</span>
              <input
                type="date"
                value={cycleStartDate}
                onChange={(e) => setCycleStartDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
              <p className="text-xs text-gray-500 mt-2">First day of your last period</p>
            </label>
            <p className="text-sm text-gray-600 mb-6">Cycle length: 28 days</p>
            <button
              onClick={exportToGoogleCalendar}
              className="w-full px-4 py-2.5 bg-gray-900 text-white rounded font-medium text-sm hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              <Download size={16} /> Export to Google Calendar
            </button>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Download an ICS file and import to Google Calendar for iOS reminders on Menstrual and Luteal phases.
            </p>
          </div>

          <div className="bg-white phase-card p-8 rounded-lg">
            <h3 className="phase-serif text-lg font-semibold text-gray-900 mb-6">Notes</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
              {notes.length === 0 ? (
                <p className="text-gray-500 text-sm">No notes yet. Add one below.</p>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="border-l-2 pl-3 py-2 border-gray-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-medium text-gray-600">{note.phase} · {note.date}</p>
                        <p className="text-sm text-gray-800 mt-1">{note.text}</p>
                      </div>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNote()}
                placeholder="Add a note..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
              <button
                onClick={addNote}
                className="px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Phase Preview Modal */}
        {selectedPhase && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div 
              className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto phase-card"
              style={{
                borderTop: `4px solid ${PHASE_COLORS[selectedPhase.key].border}`
              }}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{selectedPhase.emoji}</span>
                    <div>
                      <h2 className="phase-serif text-3xl font-semibold text-gray-900">
                        {selectedPhase.name}
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">{selectedPhase.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPhase(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-600 font-semibold mb-3">Energy & Mood</h3>
                    <p className="text-gray-800 text-sm leading-relaxed mb-6">{selectedPhase.energy}</p>
                    
                    <h3 className="text-sm uppercase tracking-wider text-gray-600 font-semibold mb-3">Lifestyle</h3>
                    <ul className="space-y-2">
                      {selectedPhase.lifestyle.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span className="text-gray-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-600 font-semibold mb-3">Nutrition</h3>
                    <ul className="space-y-2">
                      {selectedPhase.nutrition.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span className="text-gray-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPhase(null)}
                  className="mt-8 w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CycleTracker;
