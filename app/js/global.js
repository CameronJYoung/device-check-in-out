let modal = document.querySelector(".modal");
let trigger = document.querySelector(".modal-trigger");
let closeButton = document.querySelector(".modal-close-button");

let toggleModal = () => {
	modal.classList.toggle("show-modal");
}

let windowOnClick = (event) => {
	if (event.target === modal) {
		toggleModal();
	}
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick)
