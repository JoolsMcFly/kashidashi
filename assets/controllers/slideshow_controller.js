import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = [ "slide" ]
    static values = { index: Number }

    indexValueChanged() {
        this.showCurrentSlide()
    }

    next() {
        if (this.indexValue >= this.slideTargets.length - 1) {
            return;
        }
        this.indexValue++
    }

    previous() {
        if (this.indexValue <= 0) {
            return;
        }
        this.indexValue--
    }

    showCurrentSlide() {
        this.slideTargets.forEach((element, index) => {
            element.hidden = index !== this.indexValue
        })
    }
}
