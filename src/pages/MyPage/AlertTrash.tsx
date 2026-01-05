import { X } from "lucide-react";
import "./AlertTrash.css";

type AlertTrashProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
}

export default function AlertTrash({ isOpen, onClose, onConfirm, title, description }: AlertTrashProps) {
    if (!isOpen) return null

    return (
        <div className="alert_background" onClick={onClose}>
            <div
                className="alert_modal"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="alert_title">{title}</h3>
                {description && <p className="alert_description">{description}</p>}

                <div className="alert_button_row">
                    <button className="alert_button cancel" onClick={onClose}>
                        취소
                    </button>
                    <button className="alert_button confirm" onClick={onConfirm}>
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}