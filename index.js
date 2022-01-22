//Файл для ведения разработки, отвечает за само приложение, подключаем крайним
//обращаемся к условной библиотеке $(в нашем случае всего лишь объект)
const fruits = [
    {id:1, title: 'Яблоки', price: 20, img: 'https://e1.edimdoma.ru/data/ingredients/0000/2374/2374-ed4_wide.jpg?1487746348'},
    {id:2, title: 'Апельсины', price: 30, img: 'https://grandkulinar.ru/uploads/posts/2014-07/1404571972_apelsiny.jpg'},
    {id:3, title: 'Манго', price: 40, img: 'https://itsfresh.ru/upload/iblock/72f/72fe44b4c729ed570369b34eb9ac8423.jpg'}
]

//Функция для хранения будущей карточки
const toHTML = fruit => `
    <div class="col">
        <div class="card">
            <img src="${fruit.img}" class="card-img-top" style="height: 300px; width: 400px" alt="${fruit.title}">
            <div class="card-body">
                <h5 class="card-title">${fruit.title}</h5>
                <a href="#" class="btn btn-primary" data-btn="price" data-id="${fruit.id}">Посмотреть цену</a>
                <a href="#" class="btn btn-danger" data-btn="remove" data-id="${fruit.id}">Удалить</a>
            </div>
        </div>
    </div>
`

//Функция будет рендерить наш список fruits
function render() {
    //map берет каждый элемент и преобразовывает во что-то
    //html можно переписать, т.к. когда мы принимаем в стрелочную функцию параметр и вызываем ее в методе внутри функции  
    //const html = fruits.map(fruit => toHTML(fruit))
    const html = fruits.map(toHTML).join('')
    document.querySelector('#fruits').innerHTML = html
}

render()

const confirmModal = $.modal({
    title: 'Вы уверены?',
    closable: true,
    width: '400px',
    footerButtons: [
        {text: 'Отменить', type: 'secondary', handler() {
            confirmModal.close()
        }},
        {text: 'Удалить', type: 'danger', handler() {
            confirmModal.close()
        }}
    ]
}) 

const priceModal = $.modal({
    title: 'Цена на товар',
    closable: true,
    width: '400px',
    footerButtons: [
        {text: 'Закрыть', type: 'primary', handler() {
            priceModal.close()
        }}
    ]
}) 



document.addEventListener('click', event => {
    //чтобы по хэшу не прыгал наверх при нажатии на кнопку отменяем дефолтное поведение
    event.preventDefault()
    const btnType = event.target.dataset.btn
    const id = +event.target.dataset.id
    const fruit = fruits.find(f => f.id === id)

    if (btnType === 'price') {
        priceModal.setContent(`
            <p>Цена на ${fruit.title}: <strong>${fruit.price}$</strong></p>
        `)
        priceModal.open()
    } else if (btnType === 'remove') {
        confirmModal.setContent(`
            <p>Вы удаляете: <strong>${fruit.title}</strong></p>
        `)
        confirmModal.open()
    }
})

