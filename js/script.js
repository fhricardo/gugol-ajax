document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('search')
    const suggestionsList = document.getElementById('suggestions')
    const definitionDiv = document.getElementById('definition')

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        if (query.length > 0) {
            fetch('data/data.json')
                .then(response => response.json())
                .then(data => {
                    const filteredWords = data.filter(item => {
                        item.word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").startsWith(query)
                    })
                    displaySuggestions(filteredWords)
                })
        } else {
            suggestionsList.innerHTML = ""
            definitionDiv.style.display = 'none'
            definitionDiv.innerHTML = ""
        }
    })

    suggestionsList.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const selectedWord = event.target.textContent
            searchInput.value = selectedWord
            suggestionsList.innerHTML = ""
            fetch('data/data.json')
                .then(response => response.json())
                .then(data => {
                    const wordData = data.find(item => item.word === selectedWord)
                    displayDefinition(wordData)
                })
        }
    })

    function displaySuggestions(words) {
        suggestionsList.innerHTML = ""
        words.forEach(word => {
            const li = document.createElement('li')
            li.textContent = word.word
            suggestionsList.appendChild(li)
        })
    }

    function displayDefinition(wordData) {
        if (wordData) {
            definitionDiv.innerHTML = `<p><strong>${wordData.word}:</strong> ${wordData.meaning}</p>`
            definitionDiv.style.display = 'block'
        }
    }
})