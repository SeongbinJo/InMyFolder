import './Home.css'

const mainImageUrl = './inmyfolder_image_main.png'

export default function Home() {
    return (
        <div className="background">
            <div className='left_side'>
                <div className='title'>
                    <h1>In</h1>
                    <h1>My</h1>
                    <h1>Folder</h1>
                </div>

                <div className='subtitle'>
                    <p>
                        <span className='italic bold'>In My Folder, </span>
                        인마뽀
                        <span className='italic'>!</span>
                    </p>
                    <p>
                        나만의 폴더형 포트폴리오를 만들어보세요
                        <span className='italic'>!</span>
                    </p>

                    <button>
                        Get Start
                    </button>
                </div>


            </div>
            <div className='right_side'>
                <img src={mainImageUrl} alt='main_image' />
            </div>

            <button className='info_button'>
                Info
            </button>

            <p className='info_p'>
                Created by Seongbin Jo
            </p>
        </div>
    )
}