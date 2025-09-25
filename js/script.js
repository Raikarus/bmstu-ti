"use strict";
const skills = {
    data : [
        {name: 'html', range: 70, icon: 'html_icon'},
        {name: 'css', range: 30, icon: 'css_icon'},
        {name: 'python', range: 30, icon: 'python_icon'},
        {name: 'c++', range: 5, icon: 'cpp_icon'}
    ],
    generateList(parentElement){
        const skillList = parentElement;
        this.data.forEach(element => {
            let dt = document.createElement('dt');
            let dd = document.createElement('dd');
            let div = document.createElement('div');
            dt.style = `background-image: url('img/${element.icon}.svg')`;
            dd.classList.add('progress_bar');
            div.classList.add('progress_bar_inner')
            div.textContent = `${element.range}%`;
            div.style = `width: ${element.range}%; font-size: 0`;
            dt.textContent = element.name;
            dd.appendChild(div);
            skillList.appendChild(dt);
            skillList.appendChild(dd);
        });
    }
}

const skillList = document.querySelector('.skill_list');
skills.generateList(skillList);
