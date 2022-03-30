import { useState, useEffect } from 'react'
import { IS_FIREFOX, IS_SAFARI } from '../utils/environment'

const SUPPORTS_BEFORE_INPUT =
  typeof window.InputEvent.prototype.getTargetRanges === 'function'

const getActiveElement = () => {
  let active = document.activeElement

  while (true) {
    if (active && active.shadowRoot && active.shadowRoot.activeElement) {
      active = active.shadowRoot.activeElement
    } else {
      break
    }
  }

  return active
}

const useSelection = () => {
  const [selection, setSelection] = useState()
  const [processing, setProcessing] = useState<boolean>(false)

  const handleSelectionChange = () => {
    if (!processing) {
      setProcessing(true)
      const active = getActiveElement()

      if (active && active.getAttribute('contenteditable') === 'true') {
        document.execCommand('indent')
      } else {
        setSelection(null)
      }

      setProcessing(false)
    }
  }
  const handleBeforeInput = event => {
    const ranges = event.getTargetRanges()
    const range = ranges[0]

    const newRange = new Range()

    newRange.setStart(range.startContainer, range.startOffset)
    newRange.setEnd(range.endContainer, range.endOffset)

    setSelection({
      anchorNode: newRange.startContainer,
      focusNode: newRange.endContainer,
      anchorOffset: newRange.startOffset,
      focusOffset: newRange.endOffset,
    })

    // event.preventDefault()
    // event.stopImmediatePropagation()
  }
  const handleSelectStart = () => {
    setSelection(null)
  }

  useEffect(() => {
    console.log(typeof window.ShadowRoot.prototype.getSelection)
    if (typeof window.ShadowRoot.prototype.getSelection !== 'function') {
      window.addEventListener('selectionchange', handleSelectionChange, true)
      window.addEventListener('beforeinput', handleBeforeInput, true)
      window.addEventListener('selectstart', handleSelectStart, true)
      return () => {
        window.removeEventListener('selectionchange', handleSelectionChange)
        window.removeEventListener('beforeinput', handleBeforeInput)
        window.removeEventListener('selectstart', handleSelectStart)
      }
    }
  }, [])

  console.log('selection', selection)
  return selection
}

export default useSelection
