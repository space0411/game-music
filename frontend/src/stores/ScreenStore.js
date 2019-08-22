import { observable, action } from 'mobx'

class ScreenStore {
    @observable title = 'Dashboard'
    @observable isEditEventStage = false
    @observable editEventData

    // Music Player
    @observable isOpenMusicPlayer = false
    @observable musics = []

    @action
    setDataMusicPlayer(playlist) {
        this.musics = playlist
    }

    @action
    setOpenMusicPlayer(b) {
        this.isOpenMusicPlayer = b
    }

    @action
    closeMusicPlayer() {
        this.musics = []
        this.isOpenMusicPlayer = false
    }

    @action
    setTitle(mytitle) {
        this.title = mytitle
    }

    @action
    setEditEventStage(b, data) {
        this.isEditEventStage = b
        this.editEventData = data
    }

    @action
    clearEditEventStage() {
        this.isEditEventStage = false
        this.editEventData = undefined
    }
}

export default new ScreenStore()