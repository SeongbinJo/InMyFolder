import { useEffect, useState } from "react"
import { fetchUserData } from "../../firebase/firebaseManager"
import { userState } from "../../state/userState"
import { auth } from "../../firebase/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import "./MyPage.css"
import { Settings, LogOut } from "lucide-react"

const defatulProfileImg = './default_profile.png'

type ActiveMenu = 'portfolio' | 'trash' | 'settings' | null

export default function MyPage({ }) {

    const { currentUser, setCurrentUser } = userState()

    const lucideStyle = { width: '16px', height: '16px', marginRight: '8px' }

    const [activeMenu, setActiveMenu] = useState<ActiveMenu>('portfolio')

    // 로드 시 로그인확인
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        })

        return () => unsubscribe()
    }, [setCurrentUser])

    useEffect(() => {
        // 페이지 로드 시 실행
        const fetchData = async () => {
            if (currentUser) {
                const data = await fetchUserData(currentUser.uid)
                console.log(`데이터 불러오기 성공: `, currentUser.displayName)
            }
        }

        fetchData()
    }, [])

    return (
        <div>
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

            </div>
        </div>
    )
}