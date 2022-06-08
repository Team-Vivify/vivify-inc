const RETRY_LIMIT = 5
const MODAL_TIMER = 3000
const DEFAULT_VALUES = {firstname: '', lastname: '', email: '', phoneNumber: ''}
const BETA_USER_URL = 'http://34.211.165.225/beta/profiles/create'

const $form = document.getElementById('signup-form')
const $errorModalEl = document.getElementById('error-modal')
const errorModal = new bootstrap.Modal($errorModalEl)
const $successModalEl = document.getElementById('success-modal')
const succesModal = new bootstrap.Modal($successModalEl)
const $errorModalBody = $errorModalEl.querySelector('.modal-body')

let values = DEFAULT_VALUES
let attempts = 0

const attemptXhrRequest = () => {
  attempts++
  var xhr = new XMLHttpRequest()

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        attempts = 0
        succesModal.show()
      } else {
        if (attempts < RETRY_LIMIT) {
          attemptXhrRequest()
        } else {
          attempts = 0
          $errorModalBody.textContent = ''
          const {errorMessages} = JSON.parse(xhr.response)
          const text = document.createTextNode(errorMessages[0])
          const $pTag = document.createElement('p')
          $pTag.appendChild(text)
          $errorModalBody.appendChild($pTag)
          errorModal.show()
        }
      }
    }
  }

  xhr.open('POST', BETA_USER_URL, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send(JSON.stringify(values))
}

const handleSubmit = e => {
  e.preventDefault()
  attemptXhrRequest()
}

const handleChange = ({target: {name, value}}) => {
  values = {...values, [name]: value}
}

const handleSuccessModalHide = _ => {
  values = DEFAULT_VALUES
  $form.reset()
}

const closeModal = modal => modal.hide()
const handleSuccessModalOpened = () => setTimeout(() => closeModal(succesModal), MODAL_TIMER)
const handleErrorModalOpened = () => setTimeout(() => closeModal(errorModal), MODAL_TIMER)

$form.addEventListener('submit', handleSubmit)
$form.addEventListener('change', handleChange)
$successModalEl.addEventListener('hide.bs.modal', handleSuccessModalHide)
$successModalEl.addEventListener('shown.bs.modal', handleSuccessModalOpened)
$errorModalEl.addEventListener('shown.bs.modal', handleErrorModalOpened)
