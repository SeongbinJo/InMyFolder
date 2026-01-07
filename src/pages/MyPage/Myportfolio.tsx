// 1. MyPage가 켜질때 MyPortfolio가 기본으로 보이므로 fetchPortfolioData가 선 실행
// 2. 가져온 포트폴리오 데이터 오른쪽(공간이 없다면 다음 행)에 포트폴리오를 추가할 수 있는 버튼 존재
// 3. 우클릭 시 속성 창 오픈 -> 편집, 삭제, 공유(후순위) 옵션 구현
// 4. 포트폴리오 추가 버튼 클릭 시 모달창 오픈 -> 포트폴리오 정보 입력 -> 
// 저장 시 포트폴리오 데이터 업데이트 및 다시 불러오기 -> 포트폴리오 목록 갱신 -> 편집창으로 이동

import { useEffect, useRef, useState } from "react"
import { createNewPortfolio, type Portfolio } from "../../firebase/firebaseManager"
import "./MyPortfolio.css"
import { Plus } from "lucide-react"
import AlertTrash from "./AlertTrash"
import AlertCreate from "./AlertCreate"

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
        // 포트폴리오 열기 기능 추가..
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

    // 우클릭 메뉴 기능 핸들러
    const handleMenuClick = (action: string) => {
        if (action === "open" && menu.targetIndex !== null) {
            console.log(`포트폴리오 열기: ${portfolioData[menu.targetIndex].name}`)
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

    // 포트폴리오 생성 버튼
    const handleCreatePortfolio = () => {
        setShowCreateAlert(true)
        setNewPortfolioTitle("")
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