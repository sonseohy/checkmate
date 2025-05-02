import Modal from 'react-modal';
import "@/shared/styles/ModalContent.css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const ModalContent:React.FC<ModalProps> = ({isOpen, onClose, children}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel='Modal'
            className="modal-classname"
            overlayClassName="overlayClassName"
            appElement={document.getElementById('root')!} 
        >
            <div>
                { children }
            </div>
        </Modal>
        
    )
}