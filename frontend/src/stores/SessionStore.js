import { observable, action } from 'mobx';

const BASE_URL = 'http://localhost:1338/'
const BASE_API_URL = 'http://localhost:1338/api/v1/'

class SessionsStore {
    @observable API_URL = BASE_API_URL
    @observable isLogin = false
    @observable userInfo = null
    @observable userToken = null

    @action
    setLoginComplete(b) {
        this.isLogin = b
    }

    @action
    getProductImage(url) {
        return `${BASE_URL}image?name=product/${url}`
    }

    @action
    getMusic(url) {
        return `${BASE_URL}music?url=${url}`
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
            data ? this.isLogin = true : this.isLogin = false
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