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

const folderImgUrl = './folder.png'

export default function MyPortfolio({ uid }: MyPortfolioProps) {

    const [portfolioData, setPortfolioData] = useState<Portfolio[]>([])

    useEffect(() => {
        // 포트폴리오 데이터 불러오기
        const fetchPortfolio = async () => {
            const data = await fetchPortfolioData(uid)
            if (data) setPortfolioData(data)      
        }

        fetchPortfolio()
    }, [uid])

    return (
        <div className="portfolio_list">
            {portfolioData.map((portfolio, index) => (
                <button className="folder" key={index}>
                    <img src={folderImgUrl} alt="folder" />
                    <span>{portfolio.name}</span>
                </button>
            ))}
            <button className="create_button"><Plus style={{
                color: '#BA9E59'
            }} /></button>
        </div>
    )
}