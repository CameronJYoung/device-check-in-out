
export let modal = document.querySelector(".modal");
export let trigger = document.querySelector(".modal-trigger");
export let closeButton = document.querySelector(".modal-close-button");

export let toggleModal = () => {
	modal.classList.toggle("show-modal");
}

export let windowOnClick = (event) => {
	if (event.target === modal) {
		toggleModal();
	}
}
