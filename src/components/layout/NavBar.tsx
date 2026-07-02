import { Link, useNavigate } from 'react-router-dom'
import { useMemberContext } from '../../context/MemberContext'
import { useListContext } from '../../context/ListContext'

export function NavBar() {
  const { currentMember, setCurrentMember } = useMemberContext()
  const { currentList, setCurrentList } = useListContext()
  const navigate = useNavigate()

  function switchMember() {
    setCurrentMember(null)
    setCurrentList(null)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between">
        <Link to="/tick-list" className="font-semibold text-slate-900">
          Shop Manager
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/members" className="text-slate-500 hover:text-slate-800">
            Members
          </Link>
          <Link to="/shop-combined" className="text-slate-500 hover:text-slate-800">
            Shop combined
          </Link>
          {currentMember && (
            <button onClick={switchMember} className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 hover:bg-slate-200">
              {currentMember.name} ▾
            </button>
          )}
        </div>
      </div>
      {currentList && (
        <Link to="/lists" className="mt-1 block text-xs text-slate-500 hover:text-slate-800">
          List: <span className="font-medium">{currentList.name}</span>
          {currentList.is_private && ' (private)'} ▾
        </Link>
      )}
    </header>
  )
}
