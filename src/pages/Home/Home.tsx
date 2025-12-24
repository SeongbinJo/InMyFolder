import { useNavigate } from 'react-router-dom'
import './Home.css'
import { auth } from '../../firebase/firebaseConfig'
import { userState } from '../../state/userState'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import GoogleLogin from './GoogleLogin'

const mainImageUrl = './inmyfolder_image_main.png'

export default function Home() {

    const navigate = useNavigate()

    const { currentUser, setCurrentUser } = userState()

    const [showLogin, setShowLogin] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        })

        return () => unsubscribe()
    }, [setCurrentUser])

    useEffect(() => {
        if (currentUser) {
            navigate('/mypage')
        }
    }, [currentUser, navigate])


    const handleStart = () => {
        if (currentUser) {
            navigate('/mypage')
        } else {
            setShowLogin(true)
        }
    }

    return (
        <div className="background">
            <div className={`home_content ${showLogin ? 'blurred' : ''}`}>
                <div className="left_side">
                    <div className="title">
                        <h1>In</h1>
                        <h1>My</h1>
                        <h1>Folder</h1>
                    </div>

                    <div className="subtitle">
                        <p>
                            <span className="italic bold">In My Folder, </span>
                            인마뽀
                            <span className="italic">!</span>
                        </p>
                        <p>
                            나만의 폴더형 포트폴리오를 만들어보세요
                            <span className="italic">!</span>
                        </p>

                        <button onClick={handleStart}>
                            Get Start
                        </button>
                    </div>


                </div>
                <div className="right_side">
                    <img src={mainImageUrl} alt="main_image" />
                </div>

                <button className="info_button">
                    Info
                </button>

                <p className="info_p">
                    Created by Seongbin Jo
                </p>
            </div>

            {showLogin && (
                <div className="login_modal">
                    <GoogleLogin onClose={() => setShowLogin(false)} />
                </div>
            )}

        </div>
    )
}