import type { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export type UserInfo = {
    uid: string;
    email: string | null;
    displayName: string | null;
    createdAt: Date;
    portfolio: [name: string, createdAt: Date, Photos[], Texts[]][];
}

type Photos = {
    name: string;
    url: string;
    position: position;
}

type Texts = {
    name: string;
    font: [fontTitle: string, fontSize: number];
    position: position;
}

type position = [x: number, y: number];


// 신규 유저 데이터 추가
export async function addUserData(userInfo: User) {
    // 신규 유저 default 데이터
    const defaultData: UserInfo = {
        uid: userInfo.uid,
        email: userInfo.email,
        displayName: userInfo.displayName,
        createdAt: new Date(),
        portfolio: []
    }

    try {
        await setDoc(doc(db, "users", userInfo.uid), defaultData)
    } catch (error) {
        console.error("Error adding user data: ", error);
    }
}

// 기존 유저 데이터 불러오기
export async function fetchUserData(uid: string) {
    try {
        const docRef = doc(db, "users", uid)
        const snap = await getDoc(docRef)

        if (!snap.exists()) {
            console.log("해당 유저의 문서가 존재하지 않습니다.")
            return null
        }

        const data = snap.data()

        const userData: UserInfo = {
            uid: data.uid,
            email: data.email,
            displayName: data.displayName,
            createdAt: data.createdAt.toDate(),
            portfolio: data.portfolio
        }

        return userData
    } catch (error) {
        console.error("Error fetching user data: ", error);
        return null
    }
}

// 현재 유저의 포트폴리오 배열 불러오기
export async function fetchPortfolioData(uid: string) {
    try {
        const docRef = doc(db, "users", uid)
        const snap = await getDoc(docRef)
        if (!snap.exists()) {
            console.log("해당 유저의 문서가 존재하지 않습니다.")
            return null
        }
        const data = snap.data()
        return data.portfolio
    } catch (error) {
        console.error("Error fetching portfolio data: ", error);
        return null
    }
}