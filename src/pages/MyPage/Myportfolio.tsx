import { useEffect, useRef, useState } from "react"
import { createNewPortfolio, type Portfolio } from "../../firebase/firebaseManager"
import "./MyPortfolio.css"
import { Plus } from "lucide-react"
import AlertTrash from "./AlertTrash"
import AlertCreate from "./AlertCreate"
import { useNavigate } from "react-router-dom"

type MyPortfolioProps = {
    uid: string
    portfolioData: Portfolio[]
    setPortfolioData: (data: Portfolio[]) => void
    onMoveToTrash: (id: string) => void
    onRename: (index: number, newName: string) => void
}

type contextMenuState = {
    visible: boolean,
    x: number,
    y: number,
    targetIndex: number | null,
    target: Portfolio | null,
}

const folderImgUrl = './folder.png'

export default function MyPortfolio({ uid, portfolioData, setPortfolioData, onMoveToTrash, onRename }: MyPortfolioProps) {

    const navigate = useNavigate()

    const [menu, setMenu] = useState<contextMenuState>({
        visible: false,
        x: 0,
        y: 0,
        targetIndex: null,
        target: null,
    })

    // 이름 변경 중인 포트폴리오 인덱스/이름
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [editingName, setEditingName] = useState<string>("")
    const inputRef = useRef<HTMLInputElement | null>(null)

    // 휴지통 이동 Alert
    const [showTrashAlert, setShowTrashAlert] = useState(false)

    // 포트폴리오 생성
    const [showCreateAlert, setShowCreateAlert] = useState(false)
    const [newPortfolioTitle, setNewPortfolioTitle] = useState("")

    // 좌클릭 & 더블클릭
    const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)

    const handleClickPortfolio = (portfolio: Portfolio) => {
        setSelectedPortfolio(portfolio)
    }

    const handlerDoubleClickPortfolio = (portfoilio: Portfolio) => {
        openPortfolio(portfoilio)
    }

    // 이름 변경시 input 전체 선택
    useEffect(() => {
        if (editingIndex !== null && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [editingIndex])

    // 우클릭 메뉴 핸들러
    const handleContextMenu = (
        event: React.MouseEvent,
        portfolio: Portfolio,
        index: number
    ) => {
        event.preventDefault()

        setMenu({
            visible: true,
            x: event.clientX + 10,
            y: event.clientY,
            targetIndex: index,
            target: portfolio,
        })
    }

    // 바깥 클릭/스크롤 시 메뉴 닫기
    useEffect(() => {
        if (!menu.visible) return

        const hide = () => setMenu({ ...menu, visible: false })

        window.addEventListener('click', hide)
        window.addEventListener('scroll', hide)

        return () => {
            window.removeEventListener('click', hide)
            window.removeEventListener('scroll', hide)
        }
    }, [menu])

    // 이름 변경 commit
    const commitRename = async () => {
        if (editingIndex === null || editingName.trim() === "") return

        onRename(editingIndex, editingName.trim())
        setEditingIndex(null)
        setEditingName("")
    }

    // 열기 navigate
    const openPortfolio = (portfolio: Portfolio) => {
        navigate(`/portfolio/${portfolio.id}`)
    }

    // 우클릭 메뉴 기능 핸들러
    const handleMenuClick = (action: string) => {
        if (action === "open" && menu.target !== null) {
            openPortfolio(menu.target)
        }

        if (action === "rename" && menu.targetIndex !== null && menu.target) {
            setEditingIndex(menu.targetIndex)
            setEditingName(menu.target.name)
        }

        if (action === "delete" && menu.targetIndex !== null) {
            setShowTrashAlert(true)
        }
        console.log(`메뉴 액션: ${action}`)
        setMenu({ ...menu, visible: false })
        // TODO: 액션에 따른 기능 구현
    }

    // 생성
    const handleCreateConfirm = async () => {
        if (newPortfolioTitle.trim() === "") return

        // 파이어베이스 생성 함수
        const created = await createNewPortfolio(uid, newPortfolioTitle.trim())
        if (created === false) return
        setPortfolioData(created)
        setShowCreateAlert(false)
    }

    return (
        <div
            className="portfolio_list">
            <div className="portfolio_grid">
                {portfolioData.map((portfolio, index) => (
                    <button
                        className={`folder ${selectedPortfolio?.id === portfolio.id ? "selected" : ""}`}
                        key={index}
                        onContextMenu={(event) => handleContextMenu(event, portfolio, index)}
                        onClick={() => handleClickPortfolio(portfolio)}
                        onDoubleClick={() => handlerDoubleClickPortfolio(portfolio)}
                    >
                        <img src={folderImgUrl} alt="folder" />
                        {editingIndex === index ? (
                            <input
                                ref={inputRef}
                                className="porfolio_title_input"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onBlur={commitRename}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') commitRename()
                                    if (e.key === 'Escape') setEditingIndex(null)
                                }}
                            />
                        ) : (
                            <span className="portfolio_title">{portfolio.name}</span>
                        )}
                    </button>
                ))}
                <button className="create_button" onClick={() => setShowCreateAlert(true)}><Plus style={{
                    color: '#BA9E59'
                }} /></button>
            </div>

            {showTrashAlert && menu.target && (
                <AlertTrash
                    isOpen={showTrashAlert}
                    onClose={() => setShowTrashAlert(false)}
                    onConfirm={() => {
                        if (menu.target) {
                            onMoveToTrash(menu.target.id)
                        }
                        setShowTrashAlert(false)
                    }}
                    title={`휴지통으로 이동`}
                    description={`'${menu.target.name}' 을(를) 휴지통으로 이동하시겠습니까?`}
                />)
            }

            {showCreateAlert && (
                <AlertCreate
                    isOpen={showCreateAlert}
                    onClose={() => setShowCreateAlert(false)}
                    onConfirm={handleCreateConfirm}
                    title="새 포트폴리오 만들기"
                    description="포트폴리오 이름을 입력하세요."
                    inputValue={newPortfolioTitle}
                    onChangeInput={setNewPortfolioTitle}
                    placeholder="포트폴리오 이름"
                />
            )}

            {menu.visible && (
                <div
                    className="portfolio_context_menu"
                    style={{ top: menu.y, left: menu.x }}
                    onClick={(e) => e.stopPropagation()}  // 메뉴 클릭 시 바깥 클릭 이벤트 막기
                >
                    <button onClick={() => handleMenuClick("open")}>열기</button>
                    <button onClick={() => handleMenuClick("rename")}>이름 변경</button>
                    <button onClick={() => handleMenuClick("delete")}>휴지통으로 이동</button>
                </div>
            )}
        </div>
    )
}