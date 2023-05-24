"use strict";
function element(tag, className = '', children = [], text = '') {
    let el = document.createElement(tag);
    if (className) {
        el.className = className;
    }
    for (let child of children) {
        el.appendChild(child);
    }
    if (text) {
        el.appendChild(document.createTextNode(text));
    }
    return el;
}
function ajax(url, callback, method = 'GET', body = null) {
    let options = {
        method: method,
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    };
    if (body) {
        options.body = body;
    }
    fetch(url, options)
        .then((response) => {
        return response.json();
    })
        .then(callback)
        .catch((error) => {
        console.log('Request failed', error);
    });
}
function formatDate(ms) {
    let date = new Date(parseInt(ms));
    let d = date.getDate();
    let m = date.getMonth();
    let y = date.getFullYear();
    return `${m}/${d}/${y}`;
}
class Todo {
    constructor(title, parentElementId) {
        this.parent = document.getElementById(parentElementId);
        this.element = element('div', 'todo', [
            element('h3', 'todo-title', [], title),
            this.ul = element('ul'),
            this.textbox = element('textarea', 'todo-textarea'),
            this.btn_add = element('button', 'todo-textarea-button', [], 'Add To–do Item')
        ]);
        this.parent.appendChild(this.element);
        this.btn_add.addEventListener('click', this.createItem.bind(this));
        this.fetchItems();
        this.textbox.focus();
    }
    renderItem(itemData) {
        let cls_done = itemData.is_done ? ' done' : '';
        let btn_done;
        let btn_delete;
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
                btn_done = element('div', 'todo-item-link todo-item-link-done', [], '☑')
            ])
        ]);
        btn_done.addEventListener('click', () => { this.completeItem(itemData.id, item); });
        btn_delete.addEventListener('click', () => { this.deleteItem(itemData.id, item); });
        this.ul.appendChild(item);
    }
    fetchItems() {
        ajax('/all', (data) => {
            while (this.ul.firstChild) {
                this.ul.removeChild(this.ul.firstChild);
            }
            for (let itemData of data) {
                this.renderItem(itemData);
            }
        });
    }
    createItem(e) {
        ajax('/create', (itemData) => {
            this.renderItem(itemData);
        }, 'POST', 'text=' + encodeURIComponent(this.textbox.value));
        this.textbox.value = '';
        this.textbox.focus();
    }
    deleteItem(id, item) {
        ajax('/delete', (itemData) => {
            item.remove();
        }, 'POST', `id=${id}`);
    }
    completeItem(id, item) {
        ajax('/complete', (itemData) => {
            item.className += ' done';
            let completedElement = item.getElementsByClassName('todo-item-completed')[0];
            completedElement.innerHTML = '- ' + formatDate(itemData.completed);
        }, 'POST', `id=${id}`);
    }
}
