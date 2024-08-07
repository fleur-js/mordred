import domready from "domready";
import React, {
  MouseEvent,
  PropsWithChildren,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  ModalManager,
  ModalEntry,
  Modal,
  ModalComponentType,
  ResultOfModal,
  unrecommended_openModal,
  MordredOut,
  isEqualElement,
} from "@fleur/mordred";
import dedent from "dedent";
import { useModalsQueue } from "@fleur/mordred";
import { Transition, animated } from "react-spring/renderprops";

const TestContext = createContext<string>("");

domready(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { hasModal } = useModalsQueue();

  const handleClickOpenJsxModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(
    (result: ResultOfModal<typeof ConfirmModal>) => {
      unrecommended_openModal(AlertModal, {
        message: `Result is ${result}`,
        clickBackdropToClose: true,
      });
      setIsOpen(false);
    },
    []
  );

  const handleClickOpenMultiple = useCallback(() => {
    ModalManager.instance.changeSetting({ allowMultipleModals: true });

    unrecommended_openModal(AlertModal, { message: "1" });
    unrecommended_openModal(AlertModal, { message: "2" });
    unrecommended_openModal(AlertModal, { message: "3" });
  }, []);

  const handleClickOpenMultipleEach = useCallback(() => {
    ModalManager.instance.changeSetting({ allowMultipleModals: false });

    unrecommended_openModal(AlertModal, { message: "1" });
    unrecommended_openModal(AlertModal, { message: "2" });
    unrecommended_openModal(AlertModal, { message: "3" });
  }, []);

  return (
    <TestContext.Provider value="'Hello from context!'">
      <div>
        <div>
          <Button onClick={handleClickOpenJsxModal}>Open jsx modal</Button>
        </div>
        <Code>
          {dedent`
            const ConfirmModal: ModalComponentType<{ message: string }, boolean> = ({
              message,
              onClose,
            }) => {
              const context = useContext(TestContext);

              return (
                <ModalBase>
                  {message}
                  <div>From context: {context}</div>
                  <button onClick={() => onClose(false)}>Nope</button>
                  <button onClick={() => onClose(true)}>Continue</button>
                </ModalBase>
              );
            };

            <Modal
              component={ConfirmModal}
              props={{ message: "OK?" }}
              isOpen={isOpen}
              clickBackdropToClose={false}
              onClose={handleClose}
            />
          `}
        </Code>

        <div>
          <Button onClick={handleClickOpenMultiple}>
            Open multiple modals
          </Button>
        </div>
        <Code>
          {dedent`
            ModalManager.instance.changeSetting({ allowMultipleModals: true });

            openModal(AlertModal, { message: "1" });
            openModal(AlertModal, { message: "2" });
            openModal(AlertModal, { message: "3" });
          `}
        </Code>

        <div>
          <Button onClick={handleClickOpenMultipleEach}>
            Open multiple modals each
          </Button>
        </div>
        <Code>
          {dedent`
            ModalManager.instance.changeSetting({ allowMultipleModals: false });

            openModal(AlertModal, { message: "1" });
            openModal(AlertModal, { message: "2" });
            openModal(AlertModal, { message: "3" });
          `}
        </Code>

        <Modal
          component={ConfirmModal}
          props={{ message: "OK?" }}
          isOpen={isOpen}
          clickBackdropToClose={false}
          onClose={handleClose}
        />

        <div style={{ width: "100%", height: "40em" }} />

        <MordredOut>
          {({ entry }) => (
            <Transition
              items={hasModal}
              native
              from={{ opacity: 0 }}
              enter={{ opacity: 1 }}
              leave={{ opacity: 0 }}
            >
              {(has) => (props) =>
                has && (
                  <Backdrop style={props}>
                    <BackdropClickHandle entry={entry} />
                  </Backdrop>
                )}
            </Transition>
          )}
        </MordredOut>
      </div>
    </TestContext.Provider>
  );
};

const Backdrop: React.FC<{
  style: any;
  children: ReactNode;
}> = ({ style, children }) => {
  return (
    <animated.div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        background: "rgba(20, 20, 30, .4)",
        overflow: "auto",
        ...style,
      }}
    >
      {children}
    </animated.div>
  );
};

const BackdropClickHandle = ({ entry }: { entry: ModalEntry }) => {
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (isEqualElement(e.target, e.currentTarget)) return;
      if (entry.clickBackdropToClose) entry.close();
    },
    [entry]
  );

  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        display: "flex",
      }}
      onClick={handleClick}
    >
      {entry.element}
    </div>
  );
};

const ConfirmModal: ModalComponentType<{ message: string }, boolean> = ({
  message,
  onClose,
}) => {
  const context = useContext(TestContext);

  return (
    <ModalBase>
      {message}
      <div>From context: {context}</div>
      <button onClick={() => onClose(false)}>Nope</button>
      <button onClick={() => onClose(true)}>Continue</button>
    </ModalBase>
  );
};

const AlertModal: ModalComponentType<{ message: string }, void> = ({
  message,
  onClose,
}) => {
  return (
    <ModalBase>
      <div style={{ margin: "0 16px" }}>{message}</div>
      <button onClick={() => onClose()}>OK</button>
    </ModalBase>
  );
};

const ModalBase: React.FC = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div
      style={{
        margin: "auto",
        padding: "24px",
        background: "#fff",
        borderRadius: "8px",
      }}
    >
      {children}
    </div>
  );
};

const Button: React.FC<PropsWithChildren<{ onClick: () => void }>> = ({
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        margin: "4px",
        padding: "8px 16px",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "14px",
        backgroundColor: "#f72597",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
};

const Code: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <pre
    style={{
      marginBottom: "32px",
      padding: "8px",
      backgroundColor: "#efe2f5",
      borderRadius: "4px",
    }}
  >
    <code>{children}</code>
  </pre>
);
