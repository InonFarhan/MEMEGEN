let gElCanvas
let gCtx
let gFont = 'Ariel'
let isFirstLineEmpty = true
let isSecondLineEmpty = true
let gTextLines = 0
let gCurrLine
let gIsItalic = false

function init() {
    gElCanvas = document.querySelector('.canvas-container')
    gCtx = gElCanvas.getContext('2d')
    gCtx.lineWidth = 22
    // renderPhotos()
}

function renderPhotos(imgs = getImgs()) {
    let elPhotos = document.querySelector('.images')
    // let imgs = getImgs()
    let strHTMLs = imgs.map(img => `<section class="img-option flex" onclick="onImgInputFromLiberty(${img.id})"><img src="${img.url}"></img></section>`)
    elPhotos.innerHTML = strHTMLs.join('')
}

function renderMemes() {

}

function onOpenMemesLiberty() {
    console.log(liberty)
    // renderPhotos(getImagesLiberty())
    // renderMemes()
    // onOpenPhotoLiberty('images')
}

function onOpenPhotoLiberty(liberty = getImagesLiberty()) {
    if (!liberty.length) return
    renderPhotos()
    let elPhotos = document.querySelector(`.${liberty}`)
    let elCanvas = document.querySelector('.canvas-container')
    let elBAr = document.querySelector('.Toolbar')
    elPhotos.style.display = 'grid'
    elCanvas.style.display = 'none'
    elBAr.style.display = 'none'
}

function chooseImg(value) {
    document.querySelector('.upload-img').style.display = 'none'
    if (value === 'liberty') onOpenPhotoLiberty('images')
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
    gMeme.selectedImgId = imgId
    let currImg = getImgById(imgId)
    const img = new Image()
    img.src = currImg.url
    closePhotoLiberty()
    renderImg(img)
    gTextLines = 0
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
    gTextLines = 0
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function onCloseUploadModal() {
    document.querySelector('.upload-img').style.display = 'none'
}

function onSaveImg() {
    let liberty = getImagesLiberty()
    let currMemes = JSON.parse(JSON.stringify(gMeme))
    liberty.push(currMemes)
    gTextLines = 0
    isFirstLineEmpty = true
    isSecondLineEmpty = true
    gMeme.lines = []
}

function italicFontStyle() {
    if (!gIsItalic) {
        gIsItalic = true
        document.querySelector('.italic').style.backgroundColor = 'black'
        document.querySelector('.italic').style.color = 'white'
    } else {
        gIsItalic = false
        document.querySelector('.italic').style.backgroundColor = 'white'
        document.querySelector('.italic').style.color = 'black'
    }
}

function addText(ev) {
    ev.preventDefault()
    let elInput = document.querySelector('input[name=add-text]').value
    if (gTextLines === 3) return
    if (!elInput) return
    let specialStyle = gIsItalic ? 'italic' : ''
    if (isFirstLineEmpty) {
        gCurrLine = gElCanvas.height * 0.1
        isFirstLineEmpty = false
    } else if (isSecondLineEmpty) {
        gCurrLine = gElCanvas.height * 0.9
        isSecondLineEmpty = false
    } else gCurrLine = gElCanvas.height * 0.5
    gCtx.font = `${specialStyle} ${gCtx.lineWidth * 1.5}px ${gFont}`
    gCtx.textAlign = 'center'
    gCtx.fillText(elInput, gElCanvas.width * 0.5, gCurrLine)
    gMeme.lines.push([
        {
            txt: elInput,
            size: gCtx.lineWidth * 1.5,
            font: gFont,
            specialStyle: specialStyle === '' ? null : specialStyle,
            align: gCtx.textAlign,
            color: gCtx.fillStyle,
        }
    ])
    gTextLines++
}

function cleanCanvas() {
    gCtx.fillStyle = '#aa91b4'
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