const API_URL = "https://pokeapi.co/api/v2/pokemon";
const SPRITES_URL = "https://veekun.com/dex/media/pokemon/dream-world/";
const COLORS = {
	fire: '#fc6c6d',
	grass: '#49d0b0',
	electric: '#f5c956',
	water: '#76befe',
	ground: '#f4e7da',
	rock: '#cacaca',
	fairy: '#fceaff',
	poison: '#98d7a5',
	bug: '#f8d5a3',
	dragon: '#97b3e6',
	psychic: '#eaeda1',
	flying: '#F5F5F5',
	fighting: '#E6E0D4',
	normal: '#E1E1E1'
};

const createCardComponent = data => {
	const pokedexId = data.id.toString().padStart(3, '0');
	const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
	const types = data.types.map(obj => obj.type.name);
	const typesSpan = types.map(type => `<span class="type">${type}</span>`).join(' ');
	const bgColor = COLORS[ types[0] ];

	const markup = `
		<article class="pokemon" style="background:${bgColor}">
			<div>
				<h2 class="name">${name}</h2>
				<span class="pokedex_number">#${pokedexId}</span>
			</div>

			<div>
				<div class="types">
					${typesSpan}
				</div>
				<img src="${SPRITES_URL}/${data.id}.svg" alt="${name}">
			</div>
		</article>
	`;

	return markup
}

const renderCardComponent = htmlMarkup => {
	const container = document.querySelector('.pokemon-container');

	container.insertAdjacentHTML('beforeend', htmlMarkup);
}

const createPokemon = data => {
	renderCardComponent( createCardComponent(data) )
}

const removeAllPokemon = () => {
	const container = document.querySelector('.pokemon-container');

	container.innerHTML = ''
}

const fetchPokemon = id => {
	return fetch(`${API_URL}/${id}`)
		.then(res => res.json())
		.catch(err => {
			console.error(`Error: ${err}`)
		})
}

const handlePaginate = (event) => {
	const button = event.target;

	if (button.id.toLowerCase() === 'prev') {
		minPokedex -= 50;
		maxPokedex -= 50;
	} else if (button.id.toLowerCase() === 'next') {
		minPokedex += 50;
		maxPokedex += 50;
	}

	removeAllPokemon()
	fetchPokemons(minPokedex, maxPokedex)
	hideOrShowButton(minPokedex, maxPokedex);
}

const hideOrShowButton = () => {
	const prevButton = document.querySelector('#prev');
	const nextButton = document.querySelector('#next');

	if (minPokedex <= 1) {
		prevButton.classList.add('button-hide');
	} else {
		prevButton.classList.remove('button-hide');
	}

	if (maxPokedex >= 650) {
		nextButton.classList.add('button-hide');
	} else {
		nextButton.classList.remove('button-hide');
	}
} 

const prevButton = document.querySelector('#prev');
const nextButton = document.querySelector('#next');

prevButton.addEventListener('click', handlePaginate)
nextButton.addEventListener('click', handlePaginate)

let minPokedex = 1;
let maxPokedex = 50;

const fetchPokemons = (min, max) => {
	let promises = [];
	
	for (let i = min; i <= max; i++) {
		promises.push( fetchPokemon(i) )
	}

	// Keep pokedex sorted by id rather than whichever promises
	// that is returned first
	Promise.all(promises)
		.then(data => {
			data.forEach(createPokemon)
		})
		.catch(err =>{
			console.error(`Error: ${err}`)
		})
}

// Initialize Pokedex
fetchPokemons(minPokedex, maxPokedex);