import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Trophy, Zap, Crown, Medal } from 'lucide-react'

export default function Leaderboard() {
  const { user } = useAuth()
  const [board,   setBoard]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // GET /api/profiles/public/leaderboard/data
    // → { leaderboard: [{ user_id, name, total_xp, level }] }
    api.get('/profiles/public/leaderboard/data')
      .then(r => {
        const data = r.data
        setBoard(Array.isArray(data) ? data : data.leaderboard ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const top3 = board.slice(0, 3)
  const rest  = board.slice(3)

  const PODIUM = [
    { rank:2, height:'h-32', style:'from-ink-300 to-ink-500',     border:'border-ink-300/30',  Icon: Medal  },
    { rank:1, height:'h-44', style:'from-sand-400 to-sand-600',   border:'border-sand-400/40', Icon: Crown  },
    { rank:3, height:'h-24', style:'from-terra-400 to-terra-600', border:'border-terra-400/30',Icon: Trophy },
  ]
  // Reorder entries for visual podium: 2nd | 1st | 3rd
  const podiumEntries = [top3[1], top3[0], top3[2]]

  return (
    <div className="min-h-screen pt-24 pb-16">

      {/* Header */}
      <div className="relative py-16 overflow-hidden border-b border-[var(--border)] mb-12">
        <div className="absolute inset-0 bg-ember-mesh pointer-events-none" />
        <div className="page-container relative text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sand-400 to-sand-600 shadow-glow-ember mb-6 animate-float">
            <Trophy size={28} className="text-white" />
          </div>
          <h1 className="font-display text-5xl font-700 mb-3 animate-fade-up">Leaderboard</h1>
          <p className="text-ink-400 animate-fade-up animate-delay-100">
            Top {board.length} learners ranked by experience points
          </p>
        </div>
      </div>

      <div className="page-container">

        {loading ? (
          <div className="space-y-3 max-w-2xl mx-auto">
            {Array(10).fill(0).map((_,i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
        ) : board.length === 0 ? (
          <div className="text-center py-20">
            <Trophy size={40} className="text-ink-600 mx-auto mb-3" />
            <p className="text-ink-400">No learners yet. Be the first!</p>
          </div>
        ) : (
          <>
            {/* Podium */}
            {top3.length > 0 && (
              <div className="flex items-end justify-center gap-4 mb-16 max-w-lg mx-auto">
                {PODIUM.map(({ rank, height, style, border, Icon }, pi) => {
                  const entry = podiumEntries[pi]
                  if (!entry) return <div key={pi} className="flex-1" />
                  return (
                    <Link key={entry.user_id}
                      to={`/profile/${entry.user_id}`}
                      className={`flex-1 card flex flex-col items-center justify-end p-4 border ${border} hover:-translate-y-1 transition-all duration-200 ${height}`}>
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${style} flex items-center justify-center text-white font-display font-700 text-sm mb-2`}>
                        {(entry.name || entry.username || '?')[0].toUpperCase()}
                      </div>
                      <p className="text-xs font-medium text-[var(--text-base)] truncate max-w-full text-center">
                        {entry.name || entry.username || 'Learner'}
                      </p>
                      <div className="xp-orb mt-1.5 text-2xs">
                        <Zap size={9} /> {(entry.total_xp || 0).toLocaleString()}
                      </div>
                      <div className={`badge bg-gradient-to-br ${style} text-white text-2xs mt-1.5`}>
                        #{rank}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Ranked list */}
            <div className="max-w-2xl mx-auto space-y-2">
              {rest.map((entry, idx) => {
                const rank = idx + 4
                const isMe = entry.user_id === user?.id
                return (
                  <Link key={entry.user_id}
                    to={`/profile/${entry.user_id}`}
                    className={`card-hover flex items-center gap-4 p-4 ${isMe ? 'border-ember-500/30 bg-ember-500/5' : ''}`}>
                    <span className="w-7 text-center text-sm font-mono text-ink-500 font-medium flex-shrink-0">
                      {rank}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ember-600/30 to-terra-600/30 border border-[var(--border-mid)] flex items-center justify-center text-sm font-semibold text-ember-300 flex-shrink-0">
                      {(entry.name || entry.username || '?')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isMe ? 'text-ember-400' : 'text-[var(--text-base)]'}`}>
                        {entry.name || entry.username || 'Learner'}
                        {isMe && <span className="text-xs text-ink-400 ml-1">(you)</span>}
                      </p>
                      <p className="text-xs text-ink-400">Level {entry.level || 1}</p>
                    </div>
                    <div className="xp-orb flex-shrink-0">
                      <Zap size={11} /> {(entry.total_xp || 0).toLocaleString()} XP
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
