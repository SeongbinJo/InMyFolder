import { getAdditionalUserInfo, signInWithPopup } from "firebase/auth"
import { userState } from "../../state/userState"
import { auth, googleProvider } from "../../firebase/firebaseConfig"
import './GoogleLogin.css'
import { X } from 'lucide-react'

const googleLogo = './google-logo.png'

type GoogleLoginProps = {
    onClose: () => void
}

export default function GoogleLogin({ onClose }: GoogleLoginProps) {
    const { currentUser, setCurrentUser } = userState()

    const googleSignIn = async () => {
        try {
            const signInResult = await signInWithPopup(auth, googleProvider)
            const user = signInResult.user
            const isNewUser = getAdditionalUserInfo(signInResult)?.isNewUser

            setCurrentUser(user)
            onClose()
        } catch (error) {
            console.error("Google sign-in error:", error)
        }
    }

    return (
        <div className="google_container">
            <button className="close_button" onClick={onClose}>
                <X size={18} />
            </button>

            <p>Login for 인마뽀</p>

            <button onClick={googleSignIn} style={{
                margin: '20px',
                backgroundColor: 'white',
                borderWidth: '1px',
                borderRadius: '20px',
                padding: '7px 10px 7px 10px',
                width: '200px'
            }}>
                <div>
                    <img src={googleLogo} alt='google_logo' />
                    Sign in Google
                </div>
            </button>
        </div >
    )
}