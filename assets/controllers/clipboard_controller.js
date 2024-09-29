import { Controller } from '@hotwired/stimulus';

export default class extends Controller
{
    static targets = ["pin"]

    static classes = ["supported"]

    connect() {
        if (navigator.clipboard === undefined) {
            this.element.classList.add(this.supportedClass);
        }
    }

    copy() {
        alert(`${this.pin} copié !`)
    }

    get pin() {
        return this.pinTarget.value
    }
}
