const search = document.getElementById("search")
const dataList = document.getElementById("dogs")
const random = document.getElementById("random")
const prevPage = document.getElementById("prev-page")
const nextPage = document.getElementById("next-page")
const resultsTotal = document.getElementById("results-total")
const pageNumber = document.getElementById("page-number")
const pagesTotal = document.getElementById("pages-total")
const imageContainer = document.querySelector(".image-container")
const form = document.querySelector("form")
const footer = document.querySelector(".footer")
var currentPage = 1
var currentBreed = ""
var currentSubBreed = ""
var currentResults
var fullList
var breeds
var subBreeds
var breedNames = []

initialize()

form.addEventListener("submit", e => {
  e.preventDefault()
  handleSubmit()
})

async function handleSubmit() {
  const words = search.value.trim().split(" ")
  for (let i = 0; i < breeds.length; i++) {
    if (breeds[i].includes(words[1])) {
      if (subBreeds[i].length == 0) {
        currentResults = await getPics(breeds[i], false)
      } else {
        for (let j = 0; j < subBreeds[i].length; j++)
          if (subBreeds[i][j].includes(words[0])) {
            currentResults = await getPics(breeds[i], subBreeds[i][j])
          }
      }
    }
  }
  if (currentResults != null) {
    currentPage = 1
    displayPics(currentResults, currentPage)
  }
}

random.addEventListener("click", getRandom)
prevPage.addEventListener("click", () => {
  currentPage--
  displayPics(currentResults, currentPage)
})
nextPage.addEventListener("click", () => {
  currentPage++
  displayPics(currentResults, currentPage)
})

async function initialize() {
  fullList = await getList()
  breeds = fullList.map(([key, value]) => key)
  subBreeds = fullList.map(([key, value]) => value)
  for (let i = 0; i < breeds.length; i++) {
    if (subBreeds[i].length == 0) {
      breedNames.push(breeds[i])
    } else {
      for (let j = 0; j < subBreeds[i].length; j++) {
        breedNames.push(subBreeds[i][j] + " " + breeds[i])
      }
    }
  }
  breedNames.forEach(breedName => {
    const breedOption = document.createElement("option")
    breedOption.value = breedName
    dataList.append(breedOption)
  })
}

async function getList() {
  const url = "https://dog.ceo/api/breeds/list/all"
  const res = await fetch(url)
  const data = await res.json()
  return Object.entries(data.message)
}

async function getRandom() {
  currentPage = 1
  const index = Math.floor(Math.random() * breeds.length)
  const breed = breeds[index]
  const subBreedList = subBreeds[index]
  let subBreed = false
  if (subBreedList.length != 0) {
    subBreed =
      subBreeds[index][Math.floor(Math.random() * subBreeds[index].length)]
  }
  if (subBreed == false) {
    search.value = breed
  } else {
    search.value = subBreed + " " + breed
  }
  currentBreed = breed
  currentSubBreed = subBreed
  currentResults = await getPics(breed, subBreed)
  displayPics(currentResults, currentPage)
}

async function displayPics(results, page) {
  const pages = Math.ceil(results.length / 6)
  if (page > pages) return
  pagesTotal.textContent = pages
  pageNumber.textContent = page
  footer.classList.toggle("hidden", false)
  prevPage.disabled = page === 1
  nextPage.disabled = page === pages
  imageContainer.innerHTML = ""
  for (let i = 6 * (page - 1); i < 6 * page && i < results.length; i++) {
    const image = document.createElement("img")
    const anchor = document.createElement("a")
    image.src = results[i]
    anchor.href = results[i]
    anchor.append(image)
    imageContainer.append(anchor)
  }
}

async function getPics(breed, subBreed) {
  let url = "https://dog.ceo/api/breed/" + breed + "/images"
  if (subBreed) {
    url = "https://dog.ceo/api/breed/" + breed + "/" + subBreed + "/images"
  }
  const res = await fetch(url)
  const data = await res.json()
  const results = data.message
  resultsTotal.textContent = results.length
  return results
}

// search.addEventListener("keyup", () => getPics(search.value))

// async function getDog(dogName) {
//   const res = await fetch(
//     "https://api.api-ninjas.com/v1/dogs?name=" + dogName,
//     {
//       method: "GET",
//       headers: {
//         "content-type": "application/json",
//         "X-Api-Key": "ZZ1cTkbGuyJNi0I12prHhA==vLZq51TMAfCvfdlg",
//       },
//     }
//   )
//   const data = await res.json()
//   console.log(data)
// }
// getDog(dogName)
