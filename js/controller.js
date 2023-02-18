'use strict'

let gElCanvas
let gCtx
let gFont = 'Ariel'
let gIsItalic = false
let gSize = 22
let gChangeLineStep
let gCurrUploadImg

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
    let currImg
    if (!imgId) currImg = '<img src="${gCurrUploadImg}"></img>'
    else {
        gMeme.selectedImgId = imgId
        currImg = getImgById(imgId)
    }
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
        gCurrUploadImg = img
        img.src = event.target.result
        img.onload = onImageReady.bind(null, img)
    }
    reader.readAsDataURL(ev.target.files[0])
    gMeme.selectedImgId = getImgs().length
    document.querySelector('.upload-img').style.display = 'none'
}

function renderImg(img) {
    gCurrUploadImg = img
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function onCloseUploadModal() {
    document.querySelector('.upload-img').style.display = 'none'
}

function italicFontStyle() {
    if (!gIsItalic) {
        gIsItalic = true
        document.querySelector('.italic').style.color = 'white'
    } else {
        gIsItalic = false
        document.querySelector('.italic').style.color = 'gray'
    }
}

function moveText(value) {
    let currLine = gMeme.selectedLineIdx - 1
    gMeme.lines[currLine].cell.y += +value
    renderCanvas(gMeme)
    changeLine(false)
}

function changeLine(isChange = true) {
    if (gMeme.selectedLineIdx === 1) gChangeLineStep = '+1'
    if (gMeme.selectedLineIdx === gMeme.lines.length) gChangeLineStep = '-1'
    if (!isChange) gChangeLineStep = '0'
    gMeme.selectedLineIdx += +gChangeLineStep
    renderCanvas(gMeme)
    drawFrame(gMeme.lines[gMeme.selectedLineIdx - 1])
}

function addText(ev) {
    ev.preventDefault()
    let elInput = document.querySelector('input[name=add-text]').value
    if (!elInput || gMeme.lines.length === 3) return

    let currTextSize = gSize * 1.5
    let specialStyle = gIsItalic ? 'italic' : ''
    let cell = {
        x: gElCanvas.width / 2,
        y: !gMeme.lines.length ? gElCanvas.height * 0.2 : gMeme.lines.length === 1 ? gElCanvas.height * 0.5 : gElCanvas.height * 0.8
    }

    gCtx.font = `${specialStyle} ${currTextSize}px ${gFont}`
    gCtx.textAlign = 'center'
    gCtx.fillText(elInput, cell.x, cell.y)

    gMeme.lines.push(
        {
            txt: elInput,
            size: currTextSize,
            font: gFont,
            specialStyle: specialStyle === '' ? null : specialStyle,
            align: gCtx.textAlign,
            color: gCtx.fillStyle,
            cell: cell,
            textWidth: gCtx.measureText(elInput).width
        }
    )
    renderCanvas(gMeme)
    drawFrame(gMeme.lines[gMeme.selectedLineIdx])
    gMeme.selectedLineIdx++
}

function drawFrame(line) {
    gCtx.lineWidth = 3
    gCtx.strokeStyle = 'red'
    gCtx.strokeRect((line.cell.x - 10) - (gCtx.measureText(line.txt).width / 2), line.cell.y - line.size, gCtx.measureText(line.txt).width + 20, line.size + 10)
}

function renderCanvas(mem) {
    clearCanvas(false)
    let currImg = mem.selectedImgId
    if (currImg > getImgs().length - 1) renderImg(gCurrUploadImg)
    else if (currImg) onImgInputFromLiberty(currImg)
    mem.lines.forEach(line => {
        // console.log(line);
        gCtx.beginPath()
        gCtx.textAlign = line.align
        gCtx.fillStyle = line.color
        gCtx.font = `${line.specialStyle} ${line.size}px ${line.font}`
        gCtx.fillText(line.txt, line.cell.x, line.cell.y)
    })
}

function clearCanvas(isReset = true) {
    let currColor = gCtx.fillStyle
    gCtx.fillStyle = '#aa91b4'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
    gCtx.fillStyle = currColor
    if (isReset) reset()
}

function reset() {
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
    if (value === '+') gSize += 2
    else gSize -= 2
    document.querySelector('.size-number').innerText = gSize
}

function setFont(value) {
    gFont = value
}

function save(elLink) {
    renderCanvas(gMeme)
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-img.jpg'
}

function onSaveImg() {
    renderCanvas(gMeme)
    const data = gElCanvas.toDataURL()
    let currMemes = JSON.parse(JSON.stringify(gMeme))
    currMemes.url = data
    saveImage(currMemes)
}