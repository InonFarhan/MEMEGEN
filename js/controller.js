'use strict'

let gElCanvas
let gCtx
let gFont = 'Ariel'
let isFirstLineEmpty = true
let isSecondLineEmpty = true
let gTextLines = 0
let gCurrLineMulti = 1
let gIsItalic = false

function init() {
    gElCanvas = document.querySelector('.canvas-container')
    gCtx = gElCanvas.getContext('2d')
    gCtx.lineWidth = 22
}

function renderPhotos(imgs) {
    let elPhotos = document.querySelector('.images')
    let strHTMLs = imgs.map(img => `<section class="img-option flex" onclick="onImgInputFromLiberty(${img.id})"><img src="${img.url}"></img></section>`)
    elPhotos.innerHTML = strHTMLs.join('')
}

// function renderMemes(memes) {
//     var numbersByWords = ['one', 'two', 'three', 'four']
//     let elMemesContainer = document.querySelector('.memes-container')
//     let strHTMLs = memes.map(mem => `<canvas class="memes-canvas ${numbersByWords[mem.selectedImgId - 1]}"></canvas>`)
//     elMemesContainer.innerHTML = strHTMLs.join('')
//     console.log(strHTMLs.join(''));

//     memes.forEach(mem => {
//         let currImg = getImgById(mem.selectedImgId)
//         const img = new Image()
//         img.src = currImg.url
//         let elCurrCanvas = document.querySelector(`.memes-canvas ${numbersByWords[mem.selectedImgId - 1]}`)
//         console.log(elCurrCanvas)
//         let ctx = elCurrCanvas.getContext('2d')
//         ctx.drawImage(img, 0, 0, elCurrCanvas.width, elCurrCanvas.height)
//     })
//     elMemesContainer.style.display = 'grid'
// }

function onOpenMemesLiberty() {
    let liberty = getMemesLiberty()
    closeCanvas()
    closeTools()
    onOpenPhotoLiberty(liberty)
}

function onOpenPhotoLiberty(liberty = getImgs()) {
    if (!liberty.length) return
    renderPhotos(liberty)
    closeCanvas()
    closeTools()
    let elPhotos = document.querySelector(`.images`)
    elPhotos.style.display = 'grid'
}

function closeCanvas() {
    let elCanvas = document.querySelector('.canvas-container')
    elCanvas.style.display = 'none'
}

function closeTools() {
    let elBAr = document.querySelector('.Toolbar')
    elBAr.style.display = 'none'
}

function openCanvas() {
    let elCanvas = document.querySelector('.canvas-container')
    elCanvas.style.display = 'block'
}

function openTools() {
    let elBAr = document.querySelector('.Toolbar')
    elBAr.style.display = 'block'
}

function chooseImg(value) {
    document.querySelector('.upload-img').style.display = 'none'
    if (value === 'liberty') onOpenPhotoLiberty()
    else if (value === 'upload') document.querySelector('.upload-img').style.display = 'block'
}

function closePhotoLiberty() {
    let elPhotos = document.querySelector('.images')
    elPhotos.style.display = 'none'
    openCanvas()
    openTools()
}

function onImgInputFromLiberty(imgId) {
    reset()
    gMeme.selectedImgId = imgId
    let currImg = getImgById(imgId)
    const img = new Image()
    img.src = currImg.url
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
    gTextLines = 0
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function onCloseUploadModal() {
    document.querySelector('.upload-img').style.display = 'none'
}

function onSaveImg() {
    const data = gElCanvas.toDataURL()
    let currMemes = JSON.parse(JSON.stringify(gMeme))
    currMemes.url = data
    saveImage(currMemes)
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

function moveText(ev) {
    // let x = ev.offsetX
    // let y = ev.offsetY
    // gCtx.clearRect(0, 0, 999, 999)
    // gCtx.fillText(gMeme.lines[0].txt, x, y);
}

function addText(ev) {
    ev.preventDefault()
    let elInput = document.querySelector('input[name=add-text]').value
    if (!elInput) return
    let specialStyle = gIsItalic ? 'italic' : ''
    gCtx.font = `${specialStyle} ${gCtx.lineWidth * 1.5}px ${gFont}`
    gCtx.textAlign = 'center'
    gCtx.fillText(elInput, gElCanvas.width / 2, gElCanvas.height * 0.1 * gCurrLineMulti)
    gMeme.lines.push(
        {
            txt: elInput,
            size: gCtx.lineWidth * 1.5,
            font: gFont,
            specialStyle: specialStyle === '' ? null : specialStyle,
            align: gCtx.textAlign,
            color: gCtx.fillStyle,
        }
    )
    gCurrLineMulti++
}

function clearCanvas() {
    let currColor = gCtx.fillStyle
    gCtx.fillStyle = '#aa91b4'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
    gCtx.fillStyle = currColor
    reset()
}

function reset() {
    gTextLines = 0
    isFirstLineEmpty = true
    isSecondLineEmpty = true
    gMeme = {
        selectedImgId: null,
        selectedLineIdx: null,
        lines: []
    }
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