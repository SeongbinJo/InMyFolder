import { useEffect, useState } from "react"
import { fetchPortfolioData, movePortfolioToTrash, renamePortfolio, restorePortfolioFromTrash, type Portfolio } from "../../firebase/firebaseManager"
import { userState } from "../../state/userState"
import { auth } from "../../firebase/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import "./MyPage.css"
import { Settings, LogOut } from "lucide-react"
import MyPortfolio from "./Myportfolio"
import Trash from "./Trash"
import Setting from "./Setting"

const defatulProfileImg = './default_profile.png'

type ActiveMenu = 'portfolio' | 'trash' | 'settings' | null

export default function MyPage({ }) {

    const { currentUser, setCurrentUser } = userState()

    const lucideStyle = { width: '16px', height: '16px', marginRight: '8px' }

    const [activeMenu, setActiveMenu] = useState<ActiveMenu>('portfolio')

    const [portfolioData, setPortfolioData] = useState<Portfolio[]>([])

    // 첫 실행
    useEffect(() => {
        // 로그인 확인
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        })

        // 포트폴리오 Data 불러오기
        const loadPortfolioData = async () => {
            if (!currentUser) return
            const data = await fetchPortfolioData(currentUser.uid)
            if (data) setPortfolioData(data)
        }

        loadPortfolioData()

        return () => unsubscribe()
    }, [currentUser])

    // 이름 변경 핸들러
    const handleRenamePortfolio = async (index: number, newName: string) => {
        setPortfolioData(prev =>
            prev.map((p, i) =>
                i === index ? { ...p, name: newName } : p
            )
        )

        if (!currentUser) return
        await renamePortfolio(currentUser.uid, index, newName)
    }

    // 내 포트폴리오 및 휴지통 분리
    const activePortfolios = portfolioData.filter(portfolio => !portfolio.isDeleted)
    const deletedPortfolios = portfolioData.filter(portfolio => portfolio.isDeleted)

    // 휴지통 이동
    const handleMoveToTrash = async (id: string) => {
        setPortfolioData(prev =>
            prev.map(p => p.id === id ? { ...p, isDeleted: true } : p)
        )

        if (!currentUser) return
        await movePortfolioToTrash(currentUser.uid, portfolioData.findIndex(p => p.id === id))
    }

    // 휴지통 복구
    const handleRetoreFromTrash = async (id: string) => {
        setPortfolioData(prev =>
            prev.map(p => p.id === id ? { ...p, isDeleted: false } : p)
        )

        if (!currentUser) return
        await restorePortfolioFromTrash(currentUser.uid, portfolioData.findIndex(p => p.id === id))
    }

    // 휴지통 영구 삭제
    const handleDeletePermanently = async (id: string) => {
        setPortfolioData(prev =>
            prev.filter(p => p.id !== id)
        )
    }

    const renderContent = () => {
        switch (activeMenu) {
            case 'portfolio':
                return <MyPortfolio
                    uid={currentUser?.uid ?? ''}
                    portfolioData={activePortfolios}
                    onMoveToTrash={handleMoveToTrash}
                    onRename={handleRenamePortfolio}
                />
            case 'trash':
                return <Trash
                    portfolioData={deletedPortfolios}
                    onRestoreFromTrash={handleRetoreFromTrash}
                    onDeletePermanently={handleDeletePermanently}
                />
            case 'settings':
                return <Setting />
            default:
                return null
        }
    }

    return (
        <div className="mypage">
            <div className="left_sidebar">
                <div className="profile">
                    <img src={defatulProfileImg} alt="default_profile" />
                    {currentUser ? <p>{currentUser.displayName}</p> : <p>Loading...</p>}
                </div>
                <div className="line"></div>
                <div className="button_panel">
                    <div className="button_group top">
                        <button
                            className={activeMenu === 'portfolio' ? 'active' : ''}
                            onClick={() => setActiveMenu('portfolio')}
                        >
                            내 포트폴리오
                        </button>
                        <button
                            className={activeMenu === 'trash' ? 'active' : ''}
                            onClick={() => setActiveMenu('trash')}
                        >
                            휴지통
                        </button>
                    </div>

                    <div className="button_group bottom">
                        <button
                            className={activeMenu === 'settings' ? 'active' : ''}
                            onClick={() => setActiveMenu('settings')}
                        >
                            <Settings style={lucideStyle} />
                            설정
                        </button>
                        <button><LogOut style={lucideStyle} />로그아웃</button>
                    </div>
                </div>
            </div>

            <div className="main_content">
                {renderContent()}
            </div>
        </div>
    )
}