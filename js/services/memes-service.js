let gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
let gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'trump'] },
    { id: 2, url: 'img/2.jpg', keywords: ['cute', 'dog'] },
    { id: 3, url: 'img/3.jpg', keywords: ['cute', 'dog', 'baby'] },
    { id: 4, url: 'img/4.jpg', keywords: ['cute', 'cat'] },
    { id: 5, url: 'img/5.jpg', keywords: ['victory', 'child'] },
    { id: 6, url: 'img/6.jpg', keywords: ['man'] },
    { id: 7, url: 'img/7.jpg', keywords: ['funny', 'baby'] },
    { id: 8, url: 'img/8.jpg', keywords: ['man'] },
    { id: 9, url: 'img/9.jpg', keywords: ['funny', 'cunnig', 'baby'] },
    { id: 10, url: 'img/10.jpg', keywords: ['funny', 'obama'] },
    { id: 11, url: 'img/11.jpg', keywords: ['funny', 'men'] },
    { id: 12, url: 'img/12.jpg', keywords: ['funny', 'haim echt'] },
    { id: 13, url: 'img/13.jpg', keywords: ['cheers'] },
    { id: 14, url: 'img/14.jpg', keywords: ['shock', 'man'] },
    { id: 15, url: 'img/15.jpg', keywords: ['man'] },
    { id: 16, url: 'img/16.jpg', keywords: ['funny', 'man'] },
    { id: 17, url: 'img/17.jpg', keywords: ['putin'] },
    { id: 18, url: 'img/18.jpg', keywords: ['funny', 'Toy Story'] },
]
let gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: []
}

function getImgs() {
    return gImgs
}

function getImgById(imgId) {
    return gImgs.find(img => img.id === imgId)
}
