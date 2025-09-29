"use strict";

const skills = {
    data: [
        { name: 'html', range: 70, icon: 'html_icon' },
        { name: 'css', range: 30, icon: 'css_icon' },
        { name: 'python', range: 30, icon: 'python_icon' },
        { name: 'c++', range: 5, icon: 'cpp_icon' }
    ],
    sortMode: null,
    generateList(parentElement) {
        parentElement.innerHTML = '';
        const skillList = parentElement;
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
    },
    sortList(typeSort) {
        if (this.sortMode !== typeSort) {
            this.sortMode = typeSort
            this.data.sort(getComparer(typeSort));
        } else {
            this.data.reverse();
        }
        this.generateList(skillList);
    }
}

const skillList = document.querySelector('.skill_list');
skills.generateList(skillList);


const buttonsBlock = document.querySelector('.right');
buttonsBlock.addEventListener('click', (e) => {
    let target = e.target
    if (target.nodeName === "BUTTON") {
        switch (target.dataset.type) {
            case 'name':
            case 'range':
                skills.sortList(target.dataset.type);
                break;
            default:
                console.log('неизвестная кнопка');
        }
    }
});

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

