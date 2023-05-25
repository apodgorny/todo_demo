function element(
	tag       : string,
	className : string             = '',
	children  : Array<HTMLElement> = [],
	text      : string             = ''
): HTMLElement {
	let el = document.createElement(tag)
	if (className) {
		el.className = className
	}
	for (let child of children) {
		el.appendChild(child)
	}
	if (text) {
		el.appendChild(document.createTextNode(text))
	}
	return el
}

function ajax(
	url      : any, // TODO why use any?
	callback : any, // TODO why use callback style instead of async/await?
	method   : string = 'GET',
	body     : string = null
): void {
	let options: any = {
		method: method,
		headers: {
			'Accept'       : 'application/json, text/plain, */*',
			'Content-Type' : 'application/json'
		}
	}
	if (body) {
		options.body = body
	}

	fetch(url, options)
		.then((response) => {
			return response.json()
		})
		.then(callback)
		.catch ((error) => {
			console.log('Request failed', error)
		})
}

function formatDate(ms: string) {
	let date = new Date(parseInt(ms))
	let d = date.getDate()
	let m = date.getMonth()
	let y = date.getFullYear()
	return `${m}/${d}/${y}`;
}

type TodoItem = {
	id        : number,
	text      : string,
	created   : string,
	completed : string,
	is_done   : boolean
}

class Todo {
	parent    : HTMLElement | null
	element   : HTMLElement | null
	ul        : HTMLElement | null
	textbox   : any
	btn_add   : HTMLElement | null

	constructor(title: string, parentElementId: string) {
		this.parent = document.getElementById(parentElementId)
		this.element = element('div', 'todo', [
			element('h3', 'todo-title', [], title),
			this.ul = element('ul'),
			this.textbox = element('textarea', 'todo-textarea'),
			this.btn_add = element('button', 'todo-textarea-button', [], 'Add To–do Item')
		])
		this.parent.appendChild(this.element)
		this.btn_add.addEventListener('click', this.createItem.bind(this))
		this.fetchItems()
		this.textbox.focus()
	}

	renderItem(itemData: TodoItem): void {
		let cls_done: string = itemData.is_done ? ' done' : ''
		let btn_done: any
		let btn_delete: any
		let item = element('li', 'todo-item row' + cls_done, [
			element('div', 'column1', [
				element('div', 'todo-item-body', [], itemData.text),
				element('div', 'todo-item-foot', [
					element('span', 'todo-item-date', [], formatDate(itemData.created)),
					element('span', 'todo-item-date todo-item-completed', [], '- ' + formatDate(itemData.completed))
				]),
			]),
			element('div', 'column2', [
				btn_delete = element('div', 'todo-item-link todo-item-link-delete', [], '☒'),
				btn_done   = element('div', 'todo-item-link todo-item-link-done',   [], '☑')
			])
		])
		btn_done.addEventListener('click', () => { this.completeItem(itemData.id, item) })
		btn_delete.addEventListener('click', () => { this.deleteItem(itemData.id, item) })
		this.ul.appendChild(item)
	}

	fetchItems(): void {
		ajax('/all', (data: any) => {
			while (this.ul.firstChild) {
				this.ul.removeChild(this.ul.firstChild)
			}
			for (let itemData of data) {
				this.renderItem(itemData)
			}
		})
	}

	createItem(e: any): void {
		ajax('/create', (itemData: any) => {
				this.renderItem(itemData)
			}, 'POST',
			'text=' + encodeURIComponent(this.textbox.value)
		)
		this.textbox.value = ''
		this.textbox.focus()
	}

	deleteItem(id: number, item: HTMLElement): void {
		ajax('/delete', (itemData: any) => {
				item.remove()
			}, 'POST', `id=${id}`
		)
	}

	completeItem(id: number, item: HTMLElement): void {
		ajax('/complete', (itemData: any) => {
				item.className += ' done'
				let completedElement: any = item.getElementsByClassName('todo-item-completed')[0]
				completedElement.innerHTML = '- ' + formatDate(itemData.completed)
			}, 'POST', `id=${id}`
		)
	}


}

















