import type { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export type UserInfo = {
    uid: string;
    email: string | null;
    displayName: string | null;
    createdAt: Date;
    portfolio: Portfolio[];
}

export type Portfolio = {
    id: string;
    name: string;
    createdAt: Date;
    photos: Photos[];
    texts: Texts[];
    isDeleted: boolean;
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
        portfolio: [],
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
            portfolio: data.portfolio,
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

// 우클릭된 포트폴리오 이름 변경하기
export async function renamePortfolio(uid: string, index: number, newName: string) {
    try {
        const docRef = doc(db, "users", uid)
        const snap = await getDoc(docRef)
        if (!snap.exists()) {
            console.log("해당 유저의 문서가 존재하지 않습니다.")
            return false
        }
        const data = snap.data()
        const portfolioArray: Portfolio[] = data.portfolio
        portfolioArray[index].name = newName
        await setDoc(docRef, { portfolio: portfolioArray }, { merge: true })
        return true
    } catch (error) {
        console.error("Error renaming portfolio: ", error);
        return false
    }
}

// 포트폴리오 휴지통 이동 (isDeleted = true)
export async function movePortfolioToTrash(uid: string, index: number) {
    try {
        const docRef = doc(db, "users", uid)
        const snap = await getDoc(docRef)

        if (!snap.exists()) {
            console.log("해당 유저의 문서가 존재하지 않습니다.")
            return false
        }

        const data = snap.data()
        const portfolioArray: Portfolio[] = data.portfolio

        if (!portfolioArray[index]) return false

        portfolioArray[index].isDeleted = true
        await setDoc(docRef, { portfolio: portfolioArray }, { merge: true })
        return true
    } catch (error) {
        console.error("Error moving portfolio to trash: ", error);
        return false
    }
}

// 포트폴리오 휴지통에서 복구 (isDeleted = false)
export async function restorePortfolioFromTrash(uid: string, index: number) {
    try {
        const docRef = doc(db, "users", uid)
        const snap = await getDoc(docRef)

        if (!snap.exists()) {
            console.log("해당 유저의 문서가 존재하지 않습니다.")
            return false
        }

        const data = snap.data()
        const portfolioArray: Portfolio[] = data.portfolio

        if (!portfolioArray[index]) return false

        portfolioArray[index].isDeleted = false
        await setDoc(docRef, { portfolio: portfolioArray }, { merge: true })
        return true
    } catch (error) {
        console.error("Error restoring portfolio from trash: ", error);
        return false
    }
}

// 휴지통 포트폴리오 영구 삭제
export async function deletePortfolioPermanently(uid: string, index: number) {
    try {
        const docRef = doc(db, "users", uid)
        const snap = await getDoc(docRef)

        if (!snap.exists()) {
            console.log("해당 유저의 문서가 존재하지 않습니다.")
            return false
        }

        const data = snap.data()
        const portfolioArray: Portfolio[] = data.portfolio

        if (!portfolioArray[index]) return false

        portfolioArray.splice(index, 1)
        await setDoc(docRef, { portfolio: portfolioArray }, { merge: true })
        return true
    } catch (error) {
        console.error("Error deleting portfolio permanently: ", error);
        return false
    }
}