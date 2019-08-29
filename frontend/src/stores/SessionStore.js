import { observable, action } from 'mobx';

const BASE_API_URL = 'http://localhost:1338/api/v1/'
const DEPLOY_API_URL = 'http://ddnhat.ddns.net/api/v1/'
const REAL_API_URL = process.env.NODE_ENV === 'development' ? BASE_API_URL : DEPLOY_API_URL
class SessionsStore {
    @observable API_URL = REAL_API_URL
    @observable isLogin = false
    @observable userInfo = null
    @observable userToken = null

    @action
    setLoginComplete(b) {
        this.isLogin = b
    }

    @action
    getProductImage(url) {
        return `${REAL_API_URL}image?name=product/${url}`
    }

    @action
    getMusic(url) {
        return `${REAL_API_URL}music?url=${url}`
    }

    @action
    async setUserInfo(json) {
        //await sessionStorage.setItem('userInfo', JSON.stringify(json))
        await sessionStorage.setItem('userInfo', JSON.stringify(json))
    }

    @action
    async getUserInfo() {
        return await sessionStorage.getItem('userInfo')
    }

    @action
    checkingUserLogin() {
        this.getUserInfo().then(data => {
            if (data) {
                this.isLogin = true
                this.userInfo = JSON.parse(data)
            } else {
                this.isLogin = false
            }
        })
    }

    @action
    logOut() {
        sessionStorage.removeItem('userInfo');
        this.userToken = '';
        this.isLogin = false;
    }

    @action
    getUserToken() {
        //const data = sessionStorage.getItem('userInfo')
        const data = sessionStorage.getItem('userInfo')

        if (data) {
            const userInfo = JSON.parse(data)
            if (userInfo)
                return userInfo.token
        }
        this.isLogin = false
        return null
    }

    @action
    getUserID() {
        const data = sessionStorage.getItem('userInfo')
        if (data) {
            const userInfo = JSON.parse(data)
            if (userInfo)
                return userInfo.user.id
        }
        this.isLogin = false
        return null
    }
}

export default new SessionsStore()