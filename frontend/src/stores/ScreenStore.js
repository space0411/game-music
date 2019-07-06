import { observable, action } from 'mobx'

class ScreenStore {
    @observable title = 'Dashboard'
    @observable isEditEventStage = false
    @observable editEventData

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