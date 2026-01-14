import { Bold, CircleUser, Menu, Redo2, Undo2 } from "lucide-react"
import "./NavigationBar.css"

const lucideStyle = {
    strokeWidth: '1px'
}

export default function NavigationBar() {
    return (
        <>
            <div className="bar">
                <div className="left-menu">
                    <button><Menu style={lucideStyle} /></button>
                    <button>InMyFo</button>
                    <div className="Vline" />
                    <button><Undo2 style={lucideStyle} /></button>
                    <button><Redo2 style={lucideStyle} /></button>
                </div>

                <div className="right-menu">
                    <div className="profile-menu">
                        <button>
                            <CircleUser style={lucideStyle} />
                            <p>name</p>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}