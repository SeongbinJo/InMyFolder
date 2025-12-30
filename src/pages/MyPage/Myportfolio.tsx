// 1. MyPage가 켜질때 MyPortfolio가 기본으로 보이므로 fetchPortfolioData가 선 실행
// 2. 가져온 포트폴리오 데이터 오른쪽(공간이 없다면 다음 행)에 포트폴리오를 추가할 수 있는 버튼 존재
// 3. 우클릭 시 속성 창 오픈 -> 편집, 삭제, 공유(후순위) 옵션 구현
// 4. 포트폴리오 추가 버튼 클릭 시 모달창 오픈 -> 포트폴리오 정보 입력 -> 
// 저장 시 포트폴리오 데이터 업데이트 및 다시 불러오기 -> 포트폴리오 목록 갱신 -> 편집창으로 이동

import { useEffect, useState } from "react"
import { fetchPortfolioData, type Portfolio } from "../../firebase/firebaseManager"
import "./MyPortfolio.css"
import { Plus } from "lucide-react"

type MyPortfolioProps = {
    uid: string
}

type contextMenuState = {
    visible: boolean,
    x: number,
    y: number,
}

const folderImgUrl = './folder.png'

export default function MyPortfolio({ uid }: MyPortfolioProps) {

    const [portfolioData, setPortfolioData] = useState<Portfolio[]>([])

    const [menu, setMenu] = useState<contextMenuState>({
        visible: false,
        x: 0,
        y: 0,
    })

    useEffect(() => {
        // 포트폴리오 데이터 불러오기
        const fetchPortfolio = async () => {
            const data = await fetchPortfolioData(uid)
            if (data) setPortfolioData(data)
        }

        fetchPortfolio()
    }, [uid])

    // 우클릭 메뉴 핸들러
    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault()

        const rect = event.currentTarget.getBoundingClientRect()

        setMenu({
            visible: true,
            x: event.clientX + 10,
            y: event.clientY,
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

    // 우클릭 메뉴 기능 핸들러
    const handleMenuClick = (action: string) => {
        console.log(`메뉴 액션: ${action}`)
        setMenu({ ...menu, visible: false })
        // TODO: 액션에 따른 기능 구현
    }

    return (
        <div
            className="portfolio_list">
            <div className="portfolio_grid">
                {portfolioData.map((portfolio, index) => (
                    <button
                        className="folder"
                        key={index}
                        onContextMenu={handleContextMenu}
                    >
                        <img src={folderImgUrl} alt="folder" />
                        <span className="portfolio_title">{portfolio.name}</span>
                    </button>
                ))}
                <button className="create_button"><Plus style={{
                    color: '#BA9E59'
                }} /></button>
            </div>

            {menu.visible && (
                <div
                    className="portfolio_context_menu"
                    style={{ top: menu.y, left: menu.x }}
                    onClick={(e) => e.stopPropagation()}  // 메뉴 클릭 시 바깥 클릭 이벤트 막기
                >
                    <button onClick={() => handleMenuClick("new")}>열기</button>
                    <button onClick={() => handleMenuClick("new")}>이름 변경</button>
                    <button onClick={() => handleMenuClick("refresh")}>휴지통으로 이동</button>
                </div>
            )}
        </div>
    )
}