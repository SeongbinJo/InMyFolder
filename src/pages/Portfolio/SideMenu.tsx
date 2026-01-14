import { SquarePen } from "lucide-react"
import "./SideMenu.css"

const lucideStyle = {
    strokeWidth: '1px',
    width: '15px'
}

export default function SideMenu() {
    return (
        <div className="side-menu">
            <div className="title">
                <p>porfolio name</p>
                <button>
                    <SquarePen style={lucideStyle} />
                </button>
            </div>

            <div className="line" />

            <div className="images">
                <p>Images</p>
            </div>
        </div>
    )
}