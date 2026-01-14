import NavigationBar from "./NavigationBar";
import SideMenu from "./SideMenu";
import Workspace from "./Workspace";
import "./Portfolio.css"

export default function Portfolio() {
    return (
        <div className="portfolio">
            <div className="navigation">
                <NavigationBar />
            </div>

            <div className="contents">
                <div className="SideMenu">
                    <SideMenu />
                </div>

                <div className="main_portfolio">
                    <Workspace />
                </div>
            </div>
        </div>
    )
}