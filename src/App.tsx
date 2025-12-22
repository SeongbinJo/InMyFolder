import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import MyPage from './pages/MyPage/MyPage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  )
}

export default App
