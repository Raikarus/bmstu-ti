"use strict";

const skills = {
    data: [],

    errorMessage: "...ошибка получения данных...",
    errorCode: 0,
    sortMode: null,
    parentElement: undefined,

    setParentElement(parentElement) {
        this.parentElement = parentElement;
    },

    async generateBlock() {
        this.parentElement.innerHTML = '';
        const header = document.createElement('div');
        header.classList.add('header');
        const h2 = document.createElement('h2');
        h2.textContent = "Мои навыки";
        header.append(h2);
        this.parentElement.append(header);
        await this.loadData().then(() => {
            if (this.errorCode === 0) {
                this.generateButtons();
                this.generateList();
            }
            else {
                const errorBlock = document.createElement('div');
                errorBlock.textContent = this.errorMessage;

                const buttonReGenerateList = document.createElement('button');
                buttonReGenerateList.textContent = "Обновить";

                buttonReGenerateList.addEventListener('click', () => {
                    console.log(`Попытка повторного получения ('${this.path}')... `);
                    this.generateBlock();
                });
                this.parentElement.append(errorBlock, buttonReGenerateList);
            }
        });
    },

    generateButtons() {
        const header = this.parentElement.querySelector("div.header");
        const sortBlock = document.createElement('div');
        sortBlock.classList.add('sort-block');

        const sortText = document.createElement('div');
        sortText.textContent = "Сортировать";

        const buttonName = document.createElement('button');
        buttonName.textContent = 'по названию';
        buttonName.setAttribute('data-type', 'name');

        const buttonRange = document.createElement('button');
        buttonRange.textContent = 'по уровню';
        buttonRange.setAttribute('data-type', 'range');

        sortBlock.addEventListener('click', (e) => {
            const target = e.target
            if (target.nodeName === "BUTTON") {
                switch (target.dataset.type) {
                    case 'name':
                    case 'range':
                        skills.sortData(target.dataset.type);
                        break;
                    default:
                        console.log('неизвестная кнопка');
                }
            }
        });
        sortBlock.append(sortText, buttonName, buttonRange);
        header.append(sortBlock);
    },

    generateList() {
        const skillList = this.parentElement.querySelector('dl.skill_list') || document.createElement('dl');
        skillList.innerHTML = '';
        skillList.classList.add('skill_list');
        this.data.forEach(element => {
            const dt = document.createElement('dt');
            const dd = document.createElement('dd');
            const div = document.createElement('div');

            dt.style = `background-image: url('img/${element.icon}.svg')`;
            dd.classList.add('progress_bar');
            div.classList.add('progress_bar_inner')

            div.textContent = `${element.range}%`;
            div.style = `width: ${element.range}%`;
            dt.textContent = element.name;

            skillList.append(dt, dd);
            dd.append(div);
        });
        this.parentElement.append(skillList);
    },

    sortData(typeSort) {
        if (this.sortMode !== typeSort) {
            this.sortMode = typeSort
            this.data.sort(getComparer(typeSort));
        } else {
            this.data.reverse();
        }
        this.generateList();
    },

    setPath(path) {
        this.path = path;
    },

    async loadData() {
        await fetch(this.path)
            .then(data => data.json())
            .then(object => {
                this.data = object;
                this.errorCode = 0
            })
            .catch((err) => {
                console.error(err);
                this.errorCode = 1
            });
    }

};

const skillBlock = document.querySelector('#skills');

skills.setPath('db/skills.json');
skills.setParentElement(skillBlock);
skills.generateBlock();


function compare(a, b) {
    if (a.name < b.name) {
        return -1;
    }

    if (a.name > b.name) {
        return 1;
    }

    return 0;
}

function getComparer(prop) {
    return function (a, b) {
        if (a[prop] < b[prop]) {
            return -1;
        }

        if (a[prop] > b[prop]) {
            return 1;
        }

        return 0;
    }
}

const nav = document.querySelector('nav');
const menuSwitcher = document.querySelector('.nav-btn');
const menuSwitcherText = document.querySelector('.nav-btn .visually-hidden')

const menu = {
    close() {
        nav.classList.add('nav_closed');
        menuSwitcher.classList.remove('nav-btn_close');
        menuSwitcher.classList.add('nav-btn_open');
        menuSwitcherText.textContent = 'Открыть меню';
    },

    open() {
        nav.classList.remove('nav_closed');
        menuSwitcher.classList.remove('nav-btn_open');
        menuSwitcher.classList.add('nav-btn_close');
        menuSwitcherText.textContent = 'Закрыть меню';
    }
};

menu.close();

menuSwitcher.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-btn_open')) {
        menu.open();
    } else {
        menu.close();
    }
});

const theme_checkbox = document.querySelector('.switch_checkbox');
const body = document.querySelector('body');

function changeTheme() {
    if (theme_checkbox.checked) {
        body.classList.remove('dark_theme');
        localStorage.setItem('theme', 'light');
    }
    else {
        body.classList.add('dark_theme');
        localStorage.setItem('theme', 'dark');
    }
}

theme_checkbox.addEventListener('change', changeTheme)

function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        theme_checkbox.checked = true;
    } else {
        theme_checkbox.checked = false;
    }
    changeTheme();
}

window.onload = () => {
    applyTheme();
};
