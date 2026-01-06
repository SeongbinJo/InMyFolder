import { X } from "lucide-react";
import "./AlertCreate.css";

type AlertCreateProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    inputValue: string
    onChangeInput: (value: string) => void
    placeholder?: string
}

export default function AlertCreate({
    isOpen, onClose, onConfirm, title, description, inputValue, onChangeInput, placeholder }: AlertCreateProps) {
    if (!isOpen) return null

    return (
        <div className="alert_background" onClick={onClose}>
            <div
                className="alert_modal"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="alert_title">{title}</h3>
                {description && <p className="alert_description">{description}</p>}

                <input
                    className="alert_input"
                    value={inputValue}
                    onChange={(e) => onChangeInput(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onConfirm()
                    }}
                    autoFocus
                />

                <div className="alert_button_row">
                    <button className="alert_button cancel" onClick={onClose}>
                        취소
                    </button>
                    <button className="alert_button confirm" onClick={onConfirm}>
                        만들기
                    </button>
                </div>
            </div>
        </div>
    );
}