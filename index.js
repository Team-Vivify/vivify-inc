const RETRY_LIMIT = 5
const DEFAULT_VALUES = {firstName: '', lastName: '', email: '', phoneNumber: ''}

const $form = document.getElementById('signup-form')
const errorModal = new bootstrap.Modal(document.getElementById('error-modal'))
const $successModalEl = document.getElementById('success-modal')
const succesModal = new bootstrap.Modal($successModalEl)

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
          errorModal.show()
        }
      }
    }
  }

  // TODO: Update url for actual url
  const url = 'https://85220777-f923-4cf0-bea4-d8b509edfb1b.mock.pstmn.io/beta-user'
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-Type', 'applcation/json')
  xhr.send(JSON.stringify({values}))
}

const handleSuccessModalHide = _ => {
  values = DEFAULT_VALUES
  $form.reset()
}

const handleSubmit = e => {
  e.preventDefault()
  attemptXhrRequest()
}

const handleChange = ({target: {name, value}}) => {
  values = {...values, [name]: value}
}

$form.addEventListener('submit', handleSubmit)
$form.addEventListener('change', handleChange)

$successModalEl.addEventListener('hide.bs.modal', handleSuccessModalHide)
