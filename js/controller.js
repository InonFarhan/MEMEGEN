let gElCanvas
let gCtx
let gFont = 'Ariel'
let isFirstLineEmpty = true
let isSecondLineEmpty = true
let gTextLines = 0
let gCurrLine

function init() {
    gElCanvas = document.querySelector('.canvas-container')
    gCtx = gElCanvas.getContext('2d')
    gCtx.lineWidth = 8
    renderPhotos()
}

function renderPhotos() {
    let elPhotos = document.querySelector('.images')
    let imgs = getImgs()
    let strHTMLs = imgs.map(img => `<section class="img-option flex"><img src="${img.url}"></img>
    <button onclick="onImgInputFromLiberty(${img.id})">Choose photo</button></section>`)
    elPhotos.innerHTML = strHTMLs.join('')
}

function openPhotoLiberty() {
    let elPhotos = document.querySelector('.images')
    let elCanvas = document.querySelector('.canvas-container')
    let elBAr = document.querySelector('.Toolbar')
    elPhotos.style.display = 'grid'
    elCanvas.style.display = 'none'
    elBAr.style.display = 'none'
}

function chooseImg(value) {
    document.querySelector('.upload-img').style.display = 'none'
    if (value === 'liberty') openPhotoLiberty()
    else if (value === 'upload') document.querySelector('.upload-img').style.display = 'block'
}

function closePhotoLiberty() {
    let elPhotos = document.querySelector('.images')
    let elCanvas = document.querySelector('.canvas-container')
    let elBAr = document.querySelector('.Toolbar')
    elPhotos.style.display = 'none'
    elCanvas.style.display = 'block'
    elBAr.style.display = 'block'
}

function onImgInputFromLiberty(imgId) {
    const img = new Image()
    img.src = getImgById(imgId).url
    closePhotoLiberty()
    renderImg(img)
}

function onImgInputFromUser(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    reader.onload = function (event) {
        let img = new Image()
        img.src = event.target.result
        img.onload = onImageReady.bind(null, img)
    }
    reader.readAsDataURL(ev.target.files[0])
    document.querySelector('.upload-img').style.display = 'none'
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function addText(ev) {
    ev.preventDefault()
    if (gTextLines === 3) return
    if (isFirstLineEmpty) {
        gCurrLine = gElCanvas.height * 0.1
        isFirstLineEmpty = false
    } else if (isSecondLineEmpty) {
        gCurrLine = gElCanvas.height * 0.9
        isSecondLineEmpty = false
    } else gCurrLine = gElCanvas.height * 0.5
    gCtx.font = `${gCtx.lineWidth * 1.5}px ${gFont}`
    let elInput = document.querySelector('input[name=add-text]').value
    gCtx.fillText(elInput, gElCanvas.width * 0.5, gCurrLine)
    gTextLines++
}

function cleanCanvas() {
    gCtx.fillStyle = 'rgba(6, 44, 82, 1)'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function setColor(color) {
    gCtx.fillStyle = color
}

function setSize(value) {
    if (value === '+') gCtx.lineWidth += 2
    else gCtx.lineWidth -= 2
    document.querySelector('.size-number').innerText = gCtx.lineWidth
}

function setFont(value) {
    gFont = value
}

function save(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-img.jpg'
}