"use strict";

class Modal {
  constructor(id, name, options) {
    const defaults = {
      close: "[data-modal-close]",
      open: `[data-modal-open="${name}"`,
      openClass: "modal--is-active",
      closingClass: "modal--is-closing",
      bodyOpenClass: "modal-open",
      bodyClosingClass: "modal-closing",
      closeOffContentClick: true,
    };
    this.id = id;
    this.modal = document.getElementById(id);

    if (!this.modal) {
      return false;
    }

    this.activeSource = null;
    this.modalContent = this.modal.querySelector(".modal__inner");
    this.config = Object.assign(defaults, options);
    this.modalIsOpen = false;
    this.onEscDown = this.onEscDown.bind(this);

    this.init();
  }
  init() {
    document.querySelectorAll(this.config.open).forEach((btn) => {
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", this.open.bind(this));
    });

    this.modal.querySelectorAll(this.config.close).forEach((btn) => {
      btn.addEventListener("click", this.close.bind(this));
    });
  }
  open(evt) {
    let externalCall = false;

    if (this.modalIsOpen) {
      return;
    }

    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      this.activeSource = evt.currentTarget;
      this.activeSource.setAttribute("aria-expanded", "true");
    }

    if (this.modalIsOpen && !externalCall) {
      this.close();
    }

    this.modal.classList.add(this.config.openClass);

    document.documentElement.classList.add(this.config.bodyOpenClass);

    this.modalIsOpen = true;

    document.dispatchEvent(new CustomEvent("modalOpen"));
    document.dispatchEvent(new CustomEvent("modalOpen." + this.id));

    this.bindEvents();
  }
  close(evt) {
    console.log("WORK");
    if (!this.modalIsOpen) {
      return;
    }

    if (evt) {
      console.log("HERE", evt);
      if (evt.target.closest("[data-modal-close]")) {
      } else if (evt.target.closest(".modal__inner")) {
        return;
      }
    }

    document.activeElement.blur();

    this.modal.classList.remove(this.config.openClass);
    this.modal.classList.add(this.config.closingClass);

    document.documentElement.classList.remove(this.config.bodyOpenClass);
    document.documentElement.classList.add(this.config.bodyClosingClass);

    window.setTimeout(() => {
      document.documentElement.classList.remove(this.config.bodyClosingClass);
      this.modal.classList.remove(this.config.closingClass);

      if (
        this.activeSource &&
        this.activeSource.getAttribute("aria-expanded")
      ) {
        this.activeSource.setAttribute("aria-expanded", "false");
        this.activeSource.focus();
      }
    }, 500);

    this.modalIsOpen = false;

    document.dispatchEvent(new CustomEvent("modalClose." + this.id));

    this.unbindEvents();
  }
  bindEvents() {
    document.addEventListener("keyup", this.onEscDown);
  }
  unbindEvents() {
    document.removeEventListener("keyup", this.onEscDown);
  }
  onEscDown(evt) {
    console.log(evt);
    if (evt.keyCode === 27) {
      this.close();
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const templateModal = new Modal("TemplateModal", "template-modal");
  console.log(templateModal);
});
