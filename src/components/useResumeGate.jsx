import { useCallback, useState } from 'react'
import ResumeGateDialog from './ResumeGate'

/** Click handler for a résumé link, plus the dialog to render beside it. */
export function useResumeGate() {
  const [open, setOpen] = useState(false)

  const onClick = useCallback((e) => {
    e.preventDefault()
    setOpen(true)
  }, [])

  const dialog = <ResumeGateDialog onClose={() => setOpen(false)} open={open} />
  return { onClick, dialog }
}
