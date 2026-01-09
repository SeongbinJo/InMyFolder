import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import MyPage from './pages/MyPage/MyPage'
import Portfolio from './pages/Portfolio/Portfolio'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/portfolio/:portfolioId" element={<Portfolio />} />
    </Routes>
  )
}

export default App
