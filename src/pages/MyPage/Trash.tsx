import { useEffect, useState } from "react"
import { type Portfolio } from "../../firebase/firebaseManager"
import "./Trash.css"
import AlertTrash from "./AlertTrash"

type TrashProps = {
    portfolioData: Portfolio[]
    onRestoreFromTrash: (id: string) => void
    onDeletePermanently: (id: string) => void
}

type ContextMenuState = {
    visible: boolean
    x: number
    y: number
    target: Portfolio | null
}

const folderImgUrl = "./folder.png"

export default function Trash({ portfolioData, onRestoreFromTrash, onDeletePermanently }: TrashProps) {
    const [menu, setMenu] = useState<ContextMenuState>({
        visible: false,
        x: 0,
        y: 0,
        target: null,
    })

    const [showAlert, setShowAlert] = useState(false)
    const [alertMode, setAlertMode] = useState<"restore" | "delete" | null>(null)
    const [alertTarget, setAlertTarget] = useState<Portfolio | null>(null)

    // 우클릭 메뉴 핸들러
    const handleContextMenu = (
        event: React.MouseEvent,
        portfolio: Portfolio,
    ) => {
        event.preventDefault()

        setMenu({
            visible: true,
            x: event.clientX + 10,
            y: event.clientY,
            target: portfolio,
        })
    }

    // 바깥 클릭/스크롤 시 메뉴 닫기
    useEffect(() => {
        if (!menu.visible) return

        const hide = () =>
            setMenu((prev) => ({
                ...prev,
                visible: false,
                target: null,
            }))

        window.addEventListener("click", hide)
        window.addEventListener("scroll", hide)

        return () => {
            window.removeEventListener("click", hide)
            window.removeEventListener("scroll", hide)
        }
    }, [menu.visible])

    // 우클릭 메뉴 기능 핸들러
    const handleMenuClick = (action: "restore" | "delete") => {
        if (!menu.target) return

        if (action === "restore") {
            setAlertMode("restore")
            setAlertTarget(menu.target)
            setShowAlert(true)
        }

        if (action === "delete") {
            setAlertMode("delete")
            setAlertTarget(menu.target)
            setShowAlert(true)
        }

        setMenu((prev) => ({
            ...prev,
            visible: false,
            target: null,
        }))
    }

    const handleAlertConfirm = () => {
        if (!alertTarget) return

        if (alertMode === "restore") {
            onRestoreFromTrash(alertTarget.id)
            console.log('복구복구')
        } else if (alertMode === "delete") {
            onDeletePermanently(alertTarget.id)
        }

        setShowAlert(false)
        setAlertMode(null)
        setAlertTarget(null)
    }

    return (
        <div className="trash_list">
            {portfolioData.length === 0 ? (
                <div className="empty_wrapper">
                    <p className="empty_message">휴지통이 비어 있습니다.</p>
                </div>
            ) : (
                <div className="trash_grid">
                    {portfolioData.map((portfolio) => (
                        <button
                            key={portfolio.id}
                            className="trash_folder"
                            onContextMenu={(event) =>
                                handleContextMenu(event, portfolio)
                            }
                        >
                            <img src={folderImgUrl} alt="folder" />
                            <span className="trash_title">{portfolio.name}</span>
                        </button>
                    ))}
                </div>)
            }

            {menu.visible && (
                <div
                    className="trash_context_menu"
                    style={{ top: menu.y, left: menu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={() => handleMenuClick("restore")}>
                        복구
                    </button>
                    <button onClick={() => handleMenuClick("delete")}>
                        영구 삭제
                    </button>
                </div>
            )}

            <AlertTrash
                isOpen={showAlert}
                onClose={() => {
                    setShowAlert(false)
                    setAlertMode(null)
                }}
                onConfirm={handleAlertConfirm}
                title={alertMode === "restore" ? "복구" : "영구 삭제"}
                description={
                    alertMode === "restore" ?
                        `'${alertTarget?.name}' 을(를) 복구하시겠습니까?` :
                        `'${alertTarget?.name}' 을(를) 영구 삭제하시겠습니까?`
                }
            />
        </div>
    )
}