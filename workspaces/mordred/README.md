# 🌹 @fleur/mordred 🌹

`Mordred (モードレッド)` is Perfect React Modal library at 2021.

## Features

- Have **not** any appearance
  - Mordred manages modal state and positioner element only, design modal your self!
- Better accessibility
  - Auto scroll lock when modal appearered
  - Limit focus  only inside on Modal when modal appearered, with [`focus-trap`](https://github.com/focus-trap/focus-trap)
- Both of `JSX style` and `imperative style`
  - Callable from out of React (likes Action creator)
  - Can be connect to another React context likes Redux store from Modal (of course imperative style too)
- Abortable (with `AbortController`)
- Sever-side ready (module is **import safe** in server side)
  - Really works only client side
- Supports backdrop animation
  - Tune it yourself, with react-spring
- Tuned re-rendering region / performance
- Type safe
  - Modal result can be type

## Usage

See full example code (with single backdrop fade) in [this example](https://github.com/fleur-js/mordred/blob/main/workspaces/example)

### Setup

Add `MordredRenderer` into your App root and call `Mordred.init` on after domready

```tsx
import domready from 'domready'
import { Mordret, MordredRenderer } from '@fleur/mordred'

const App = () => {
  return (
    <div>
      <MordredRenderer>
        {({ children }) => (
          <YourBackdrop>{children}</YourBackdrop>
        )}
      </MordredRenderer>
    </div>
  )
}

domready(() => {
  Mordret.init()
  ReactDOM.render(<App />, yourRootElement)
})
```

### Calling your Modal

And define and call ModalComponet to use it up!

```tsx
import { MordredRenderer, ModalComponentType, useModalOpener } from '@fleur/mordred'

// jsx style
const ConfirmModal: ModalComponentType<{ message: string }, boolean> = ({ onClose }) => (
  <div>
    {message}
    <button onClick={() => onClose(false)}>Cancel</button>
    <button onClick={() => onClose(true)}>Continute</button>
  </div>
)

const SomePage = () => {
  const [isOpened, setIsOpen] = useState(false)
  const { openModal } = useModalOpener()
  const handleClose = (result) => console.log(result)

  const handleClickGotoSleep = useCallback(() => {
    const result = await openModal(ConfirmModal, { message: 'Sleep?' })
  }, [])

  return (
    <div>
      <button onClick={handleClickGotoSleep}>Sleep</button>
    </div>
  )
}

// imperative style (Stable, but unrecommended)
import { unrecommended_openModal } from '@fleur/mordred'

const result = await openModal(ConfirmModal, { message: 'Godmode?' })
```
