document.addEventListener('DOMContentLoaded', function () {
  const body = document.querySelector('body')

  function generateHTML() {
    const gameBody = document.createElement('div')
    gameBody.classList.add('game-body')
    body.append(gameBody)

    //sidebar
    const sidebar = document.createElement('aside')
    sidebar.classList.add('sidebar')
    gameBody.append(sidebar)
    const sidebarContent = document.createElement('div')
    sidebarContent.classList.add('sidebar__content')
    sidebarContent.insertAdjacentHTML(
      'afterbegin',
      `
      <h3 class="sidebar__title">Nonogramms</h3><img src="./img/logo.png" width="70px"/>
      <h4 class="sidebar__subtitle">Choose the picture</h4>
      <select name="select" class="game-picture-select">
        <option value="snake" selected>Snake</option>
        <option value="horseshoe">Horseshoe</option>
        <option value="rocket">Rocket</option>
        <option value="taxi">Taxi</option>
        <option value="bush">Bush</option>
      </select>
      <h2 class="game-timer">00 : 00 : 00</h2>
      <div class="theme__block">
        <h3 class="theme__block-title">Theme mode</h3>
        <div class="theme__block-content">
          <span class="theme__block-span">Light</span>
          <div class="theme__block-btn"></div>
          <span class="theme__block-span">Dark</span>
        </div>
      </div>
      `
    )
    sidebar.append(sidebarContent)

    // timer
    const timer = sidebar.querySelector('.game-timer')
    let seconds = 0
    let minutes = 0
    let hours = 0
    let interval

    function updateTime() {
      seconds++
      if (seconds === 60) {
        minutes++
        seconds = 0
      }
      if (minutes === 60) {
        hours++
        minutes = 0
      }
      timer.innerText = `${hours.toString().padStart(2, 0)} : ${minutes
        .toString()
        .padStart(2, 0)} : ${seconds.toString().padStart(2, 0)}`
    }

    function startTimer() {
      seconds = 0
      minutes = 0
      hours = 0
      interval = setInterval(updateTime, 1000)
    }

    function clearTimer() {
      clearInterval(interval)
    }

    // theme modes
    const modeBtn = sidebar.querySelector('.theme__block-btn')
    const sidebarTitle = sidebar.querySelector('.sidebar__title')
    const sidebarSubTitle = sidebar.querySelector('.sidebar__subtitle')
    modeBtn.addEventListener('click', () => {
      modeBtn.classList.toggle('switch-on')
      if (modeBtn.classList.contains('switch-on')) {
        body.classList.add('body_dark')
        gameBody.classList.add('game-body_dark')
        gameBoard.classList.add('gameBoard_dark')
        sidebar.classList.add('sidebar_dark')
        sidebarTitle.classList.add('sidebar__title_dark')
        sidebarSubTitle.classList.add('sidebar__subtitle_dark')
        select.classList.add('game-picture-select_dark')
        sidebarContent.classList.add('sidebar__content_dark')
        container
          .querySelectorAll('button')
          .forEach((btn) => btn.classList.add('btn_dark'))
      } else {
        body.classList.remove('body_dark')
        gameBody.classList.remove('game-body_dark')
        gameBoard.classList.remove('gameBoard_dark')
        sidebar.classList.remove('sidebar_dark')
        sidebarTitle.classList.remove('sidebar__title_dark')
        sidebarSubTitle.classList.remove('sidebar__subtitle_dark')
        select.classList.remove('game-picture-select_dark')
        sidebarContent.classList.remove('sidebar__content_dark')
        container
          .querySelectorAll('button')
          .forEach((btn) => btn.classList.remove('btn_dark'))
      }
    })

    // game body
    const container = document.createElement('div')
    container.classList.add('container')
    gameBody.append(container)

    const gameBoard = document.createElement('div')
    gameBoard.classList.add('gameBoard')
    container.append(gameBoard)

    const modalDiv = document.createElement('div')

    function showModal(time) {
      // генерирую в DOM-дерево модальное окно с текстом исходя из условия выйгрыша или проигрыша
      modalDiv.innerHTML = `<div class="modal__content">
        <h1 class="modal__content-title">
            Отлично! Вы решили нонограмму за ${time} секунд!
        </h1>
        <button class="modal__content-btn">Play again</button>
        </div>`

      modalDiv.classList.add('modal')

      // достаю кнопку и задаю ей слушатель события перезагрузки
      const modalBtn = document.querySelector('.modal__content-btn')
      modalBtn.addEventListener('click', () => {
        fullresetGame()
        modalDiv.classList.remove('show')
      })

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          fullresetGame()
          modalDiv.classList.remove('show')
        }
      })
    }
    // modal window
    const audioOnModalWin = document.createElement('audio')
    const sourceAudioModalWin = document.createElement('source')
    sourceAudioModalWin.src = './audio/win.mp3'
    sourceAudioModalWin.type = 'audio/mpeg'
    audioOnModalWin.append(sourceAudioModalWin)

    modalDiv.append(audioOnModalWin)
    body.append(modalDiv)

    function gameResult(time) {
      if (userClickedBlackCells.length) {
        const toNumberUserClickedBlackCells = userClickedBlackCells.map(
          (el) => +el
        )
        if (
          selectedDataIndexes.join('') ===
          toNumberUserClickedBlackCells.sort((a, b) => a - b).join('')
        ) {
          setTimeout(() => {
            showModal(time)
            modalDiv.classList.add('show')
            audioOnModalWin.play()
          }, 200)

          // debugger
          fullresetGame()
          getTopHints(createGameCode(Object.values(data[0])[0]))
          getLeftHints(createGameCode(Object.values(data[0])[0]))
        }
      }
    }

    // button Solution
    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('btn-container')
    container.append(buttonContainer)
    const solutionBtn = document.createElement('button')
    solutionBtn.classList.add('btn')
    solutionBtn.innerText = 'Solution'

    solutionBtn.addEventListener('click', () => {
      const cellField = cellsBox.querySelectorAll('.cell')
      cellField.forEach((cell, index) => {
        if (selectedDataIndexes.includes(index)) {
          cell.classList.add('cell_black')
        } else {
          cell.classList.remove('cell_black')
          cell.classList.remove('cell_cross')
        }
      })
      clearInterval(interval)
    })

    // button reset game
    const resetButton = document.createElement('button')
    resetButton.classList.add('btn')
    resetButton.innerText = 'Reset'

    // ========================== Local Storage===================
    const storageKey = 'KEY'
    const storage = []

    // button save game
    const saveBtn = document.createElement('button')
    saveBtn.classList.add('btn')
    saveBtn.id = 'save-btn'
    saveBtn.innerText = 'Save'

    // button continue game
    const continueBtn = document.createElement('button')
    continueBtn.classList.add('btn')
    continueBtn.id = 'continue-btn'
    continueBtn.innerText = 'Continue'

    buttonContainer.append(resetButton, saveBtn, continueBtn, solutionBtn)

    saveBtn.addEventListener('click', () => {
      const dataSaveGame = {
        blacklCells: [...userClickedBlackCells],
        crossCells: [...userClickedCrossCells],
        gamePicture: select.value,
        isLightMode: true,
      }
      if (modeBtn.classList.contains('switch-on'))
        dataSaveGame.isLightMode = false
      storage[0] = dataSaveGame
      localStorage.setItem(storageKey, JSON.stringify(storage))
    })

    continueBtn.addEventListener('click', () => {
      const dataFromStorage = localStorage.getItem(storageKey)
      const parseDataFromStorage = JSON.parse(dataFromStorage) || []
      if (parseDataFromStorage.length) {
        const cellField = cellsBox.querySelectorAll('.cell')
        cellField.forEach((cell) => {
          cell.classList.remove('cell_black')
          cell.classList.remove('cell_cross')
        })

        select.value = parseDataFromStorage[0].gamePicture
        const selectedImageData = data.find((img) => {
          return Object.keys(img)[0] === select.value
        })
        if (selectedImageData) {
          const selectedDataIndexes = Object.values(selectedImageData)[0]
          getTopHints(createGameCode(selectedDataIndexes))
          getLeftHints(createGameCode(selectedDataIndexes))

          cellField.forEach((cell, index) => {
            if (parseDataFromStorage[0].blacklCells.includes(index.toString()))
              cell.classList.add('cell_black')
            if (parseDataFromStorage[0].crossCells.includes(index.toString()))
              cell.classList.add('cell_cross')
          })
        }
        if (parseDataFromStorage[0].isLightMode) {
          body.classList.remove('body_dark')
          modeBtn.classList.remove('switch-on')
          gameBody.classList.remove('game-body_dark')
          gameBoard.classList.remove('gameBoard_dark')
          sidebar.classList.remove('sidebar_dark')
          sidebarTitle.classList.remove('sidebar__title_dark')
          sidebarSubTitle.classList.remove('sidebar__subtitle_dark')
          select.classList.remove('game-picture-select_dark')
          sidebarContent.classList.remove('sidebar__content_dark')
          container
            .querySelectorAll('button')
            .forEach((btn) => btn.classList.remove('btn_dark'))
        } else {
          body.classList.add('body_dark')
          modeBtn.classList.add('switch-on')
          gameBody.classList.add('game-body_dark')
          gameBoard.classList.add('gameBoard_dark')
          sidebar.classList.add('sidebar_dark')
          sidebarTitle.classList.add('sidebar__title_dark')
          sidebarSubTitle.classList.add('sidebar__subtitle_dark')
          select.classList.add('game-picture-select_dark')
          sidebarContent.classList.add('sidebar__content_dark')
          container
            .querySelectorAll('button')
            .forEach((btn) => btn.classList.add('btn_dark'))
        }
      } else console.log('No save games')
    })

    resetButton.addEventListener('click', resetGame)

    const topHints = document.createElement('div')
    topHints.classList.add('hints', 'top-hints')
    gameBoard.append(topHints)

    const topHintsContainer = document.createElement('div')
    topHintsContainer.classList.add('top-hints-container')
    topHints.append(topHintsContainer)

    const leftHints = document.createElement('div')
    leftHints.classList.add('hints', 'left-hints')
    gameBoard.append(leftHints)

    const leftHintsContainer = document.createElement('div')
    leftHintsContainer.classList.add('left-hints-container')
    leftHints.append(leftHintsContainer)

    const cellsBox = document.createElement('div')
    cellsBox.classList.add('cell-box')
    gameBoard.append(cellsBox)

    function createCellsBoard() {
      const nonogramSize = 5
      for (let i = 0; i < nonogramSize * nonogramSize; i++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.id = i
        cellsBox.append(cell)
      }
    }
    createCellsBoard()

    // get data indexes of selected image
    const select = document.querySelector('.game-picture-select')
    let userClickedBlackCells = []
    let selectedDataIndexes = Object.values(data[0])[0]

    function getDataIndexes() {
      select.addEventListener('change', (e) => {
        resetGame()
        const selectedImage = e.target.value
        const selectedImageData = data.find((img) => {
          return Object.keys(img)[0] === selectedImage
        })
        if (selectedImageData) {
          selectedDataIndexes = Object.values(selectedImageData)[0]
          getTopHints(createGameCode(selectedDataIndexes))
          getLeftHints(createGameCode(selectedDataIndexes))
        }
      })
    }
    getDataIndexes()

    // =========================================
    function createGameCode(data) {
      const gameField = Array.from({ length: 5 }, (el) => Array(5).fill(0))
      const codeArray = []

      for (let i = 0; i < gameField.length; i++) {
        codeArray.push([])
        for (let j = 0; j < gameField[i].length; j++) {
          if (data.includes(i * gameField[i].length + j)) {
            codeArray[i].push(1)
          } else {
            codeArray[i].push(0)
          }
        }
      }
      return codeArray
    }

    function getLeftHints(data) {
      const leftHintsContainer = document.querySelector('.left-hints-container')
      leftHintsContainer.innerHTML = ''
      for (let i = 0; i < data.length; i++) {
        const row = data[i]
        const hints = []
        let count = 0

        for (let j = 0; j < row.length; j++) {
          if (row[j] === 1) {
            count++
          } else if (count > 0) {
            hints.push(count)
            count = 0
          }
        }

        if (count > 0) {
          hints.push(count)
        }

        const hintElement = document.createElement('div')
        hintElement.classList.add('hint')
        hintElement.innerText = hints.join(' ')
        leftHintsContainer.append(hintElement)
      }
    }

    function getTopHints(data) {
      const toptHintsContainer = document.querySelector('.top-hints-container')
      topHintsContainer.innerHTML = ''

      for (let i = 0; i < data[0].length; i++) {
        const column = data.map((row) => row[i])
        const hints = []
        let count = 0

        for (let j = 0; j < column.length; j++) {
          if (column[j] === 1) {
            count++
          } else if (count > 0) {
            hints.push(count)
            count = 0
          }
        }

        if (count > 0) {
          hints.push(count)
        }

        const hintElement = document.createElement('div')
        hintElement.classList.add('hint')
        hintElement.innerText = hints.join('\n')
        topHintsContainer.append(hintElement)
      }
    }
    // ===========================================
    let timeStarter = false
    const cellBox = gameBoard.querySelector('.cell-box')
    cellBox.addEventListener('click', () => {
      if (!timeStarter) startTimer()
      timeStarter = true
    })
    cellBox.addEventListener('contextmenu', () => {
      if (!timeStarter) startTimer()
      timeStarter = true
    })

    let userClickedCrossCells = []
    function handleClickCell() {
      const cellField = cellsBox.querySelectorAll('.cell')

      cellField.forEach((cell) => {
        cell.addEventListener('click', () => {
          cell.classList.remove('cell_cross')
          cell.classList.toggle('cell_black')
          const cellId = cell.id
          if (cell.classList.contains('cell_black')) {
            if (!userClickedBlackCells.includes(cellId)) {
              userClickedBlackCells.push(cellId)
              audioOnBlack.play()
            }
          } else {
            const index = userClickedBlackCells.indexOf(cellId)
            if (index > -1) {
              userClickedBlackCells.splice(index, 1)
              audioOnWhite.play()
            }
          }
          const lastSecond = seconds
          gameResult(lastSecond)
        })
      })
      cellField.forEach((cell) => {
        cell.addEventListener('contextmenu', (e) => {
          e.preventDefault()
          cell.classList.remove('cell_black')
          cell.classList.toggle('cell_cross')

          audioOnCross.play()
          const cellId = cell.id
          userClickedCrossCells.push(cellId)

          const index = userClickedBlackCells.indexOf(cellId)
          if (index > -1) {
            userClickedBlackCells.splice(index, 1)
          }
        })
      })
    }

    // sound on click
    // black cell
    const audioOnBlack = document.createElement('audio')
    const sourceAudioBlack = document.createElement('source')
    sourceAudioBlack.src = './audio/black.mp3'
    sourceAudioBlack.type = 'audio/mpeg'
    audioOnBlack.append(sourceAudioBlack)

    // white cell
    const audioOnWhite = document.createElement('audio')
    const sourceAudioWhite = document.createElement('source')
    sourceAudioWhite.src = './audio/white.mp3'
    sourceAudioWhite.type = 'audio/mpeg'

    audioOnWhite.append(sourceAudioWhite)

    // cross cell
    const audioOnCross = document.createElement('audio')
    const sourceAudioCross = document.createElement('source')
    sourceAudioCross.src = './audio/cross.mp3'
    sourceAudioCross.type = 'audio/mpeg'

    audioOnCross.append(sourceAudioCross)

    gameBoard.append(audioOnBlack, audioOnWhite, audioOnCross)

    function fullresetGame() {
      clearTimer()
      timeStarter = false
      seconds = 0
      minutes = 0
      hours = 0
      timer.innerText = `00 : 00 : 00`
      const cellField = cellsBox.querySelectorAll('.cell')
      cellField.forEach((cell) => cell.classList.remove('cell_black'))
      cellField.forEach((cell) => cell.classList.remove('cell_cross'))
      userClickedBlackCells = []
      userClickedCrossCells = []
      selectedDataIndexes = Object.values(data[0])[0]
      select.selectedIndex = 0
      getTopHints(createGameCode(Object.values(data[0])[0]))
      getLeftHints(createGameCode(Object.values(data[0])[0]))
    }

    function resetGame() {
      clearTimer()
      timeStarter = false
      seconds = 0
      minutes = 0
      hours = 0
      timer.innerText = `00 : 00 : 00`
      const cellField = cellsBox.querySelectorAll('.cell')
      cellField.forEach((cell) => cell.classList.remove('cell_black'))
      cellField.forEach((cell) => cell.classList.remove('cell_cross'))
      userClickedBlackCells = []
      userClickedCrossCells = []
    }
    handleClickCell()

    function showDefaultHints() {
      const defaultImage = select.value
      const defaultImageData = data.find(
        (img) => Object.keys(img)[0] === defaultImage
      )
      if (defaultImageData) {
        const defaultDataIndexes = Object.values(defaultImageData)[0]
        getTopHints(createGameCode(defaultDataIndexes))
        getLeftHints(createGameCode(defaultDataIndexes))
      }
    }

    showDefaultHints()
  }
  generateHTML()
})
