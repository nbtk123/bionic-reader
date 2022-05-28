
let enableButton = document.getElementById("enableBionicReadingButton");

enableButton.addEventListener("click", async (ev) => {

	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: modifyPage,
  });
})

function modifyPage() {

	const htmlEntities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'"
  };
	
	// str.replace(/([&<>\"'])/g, match => htmlEntities[match]);

	const elemRef = document.querySelectorAll('p,li')

	elemRef.forEach(p => {
		let currentInnerHTML = p.innerHTML
		
		for (const e in htmlEntities) {
			currentInnerHTML = currentInnerHTML.replace(e, htmlEntities[e])
		}
		
		p.childNodes.forEach(c => {
			if (c.nodeName === '#text') {
				
				let currentTextContentList = c.textContent.split(' ').map(word => {
					// console.log(word)
					if (word.length <= 1) {
						return word
					}

					if (word.length == 2) {
						return `<b>${word[0]}</b>${word[1]}`
					}

					if (word.length == 3) {
						return `<b>${word[0]}</b>${word.substring(1)}`
					}

					const initial = word.substring(0, Math.floor(word.length/2+0.5))
					const ending = word.substring(Math.floor(word.length/2+0.5), word.length)
					// console.log(`<b>${initial}</b>${ending}`)
					return `<b>${initial}</b>${ending}`
				})
				
				console.log(currentInnerHTML, c.textContent)
				currentInnerHTML = currentInnerHTML.replace(c.textContent, currentTextContentList.join(' '))
				
			}
		})
		console.log(p.innerHTML, currentInnerHTML)
		p.innerHTML = currentInnerHTML
	})
}