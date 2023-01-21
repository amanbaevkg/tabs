let button1 = document.getElementById('button1')
let showText1 = document.getElementById('show1')
button1.addEventListener('click',() => {
    showText1.classList.remove('hidden')
    showText2.classList.add('hidden')
    showText3.classList.add('hidden')
    showText4.classList.add('hidden')
    showText5.classList.add('hidden')
    // ----------------------
    button1.classList.add('tabs-title-active')
    button2.classList.remove('tabs-title-active')
    button3.classList.remove('tabs-title-active')
    button4.classList.remove('tabs-title-active')
    button5.classList.remove('tabs-title-active')

})
let button2 = document.getElementById('button2')
let showText2 = document.getElementById('show2')
button2.addEventListener('click',() => {
    showText2.classList.remove('hidden')
    showText1.classList.add('hidden')
    showText3.classList.add('hidden')
    showText4.classList.add('hidden')
    showText5.classList.add('hidden')
    // ----------------------
    button2.classList.add('tabs-title-active')
    button1.classList.remove('tabs-title-active')
    button3.classList.remove('tabs-title-active')
    button4.classList.remove('tabs-title-active')
    button5.classList.remove('tabs-title-active')

})
let button3 = document.getElementById('button3')
let showText3 = document.getElementById('show3')
button3.addEventListener('click',() => {
    showText3.classList.remove('hidden')
    showText2.classList.add('hidden')
    showText1.classList.add('hidden')
    showText4.classList.add('hidden')
    showText5.classList.add('hidden')
    // ----------------------
    button3.classList.add('tabs-title-active')
    button2.classList.remove('tabs-title-active')
    button1.classList.remove('tabs-title-active')
    button4.classList.remove('tabs-title-active')
    button5.classList.remove('tabs-title-active')


})
let button4 = document.getElementById('button4')
let showText4 = document.getElementById('show4')
button4.addEventListener('click',() => {
    showText4.classList.remove('hidden')
    showText2.classList.add('hidden')
    showText3.classList.add('hidden')
    showText1.classList.add('hidden')
    showText5.classList.add('hidden')
    // ----------------------
    button4.classList.add('tabs-title-active')
    button2.classList.remove('tabs-title-active')
    button3.classList.remove('tabs-title-active')
    button1.classList.remove('tabs-title-active')
    button5.classList.remove('tabs-title-active')


})
let button5 = document.getElementById('button5')
let showText5 = document.getElementById('show5')
button5.addEventListener('click',() => {
    showText5.classList.remove('hidden')
    showText2.classList.add('hidden')
    showText3.classList.add('hidden')
    showText4.classList.add('hidden')
    showText1.classList.add('hidden')
    // ----------------------
    button5.classList.add('tabs-title-active')
    button2.classList.remove('tabs-title-active')
    button3.classList.remove('tabs-title-active')
    button4.classList.remove('tabs-title-active')
    button1.classList.remove('tabs-title-active')


})

// let ul = document.querySelector('.tabs'); 
// ul.addEventListener('click', function (ev) {
// console.log(ev.target.dataset.type);
// let data = ev.target.dataset.type;
// console.log(document.querySelector('.'));
// document.querySelector('.active-p').classList.remove('active-p');
// console.log(document.querySelector('.active-tab'));
// document.querySelector('.active-tab').classList.remove('tabs-title-active');
// console.log(document.querySelector(`[data-li = ${data}]`));
// document.querySelector(`[data-li = ${data}]`).classList.add('hidden'); 
// ev.target.classList.add('hidden') });
