//Мы конечно можем создать модальное окно через класс, но будем создавать через функцию
//В чем прелесть данного подхода
//мы можем пользоваться замыканиями, а это значит,что нам доступны теперь приватные переменные
//как раз в ретерне реализовано замыкание
//анимации делаются на css, потому что срабатывают быстрее и реализуются проще
//системная или приватная функция _createModal
Element.prototype.appendAfter = function(element) {
    element.parentNode.insertBefore(this, element.nextSibling)
}

function noop() {}

function _createModalFooter(buttons = []) {
    if (buttons.length === 0) {
        return document.createElement('div')
    }

    const wrap = document.createElement('div')
    wrap.classList.add('modal-footer')

    buttons.forEach(btn => {
        const $btn = document.createElement('button')
        $btn.textContent = btn.text
        $btn.classList.add('btn')
        $btn.classList.add(`btn-${btn.type || 'secondary'}`)
        $btn.onclick = btn.handler || noop

        wrap.appendChild($btn)
    })

    return wrap
}

function _createModal(options) {
    const DEFAULT_WIDTH = '600px'
    const modal = document.createElement('div')
    modal.classList.add('vmodal')
    modal.insertAdjacentHTML('afterbegin', `        
        <div class="modal-overlay">
            <div class="modal-window" style="width: ${options.width || DEFAULT_WIDTH}">
                <div class="modal-header">
                    <span class="modal-title">${options.title || 'Окно'}</span>
                    ${options.closable ? `<span class="modal-close">&times;</span>` : ''}
                </div>
                <div class="modal-body" data-content>
                    ${options.content || ''}
                </div>
            </div>    
        </div>
    `)
    const footer = _createModalFooter(options.footerButtons)
    footer.appendAfter(modal.querySelector('[data-content]'))
    document.body.appendChild(modal)
    return modal
}


$.modal = function(options) {
    //создадим приватную функцию _createModal и чтобы не загромаждать функцию, вынесем ее за пределы modal
    const ANIMATION_SPEED = 200
    const $modal = _createModal(options)
    const overlay = document.querySelector('.modal-overlay')
    const modalClose = document.querySelector('.modal-close')
    let closing = false
    let destroyed = false

    const modal = {
        open() {
            if (destroyed) {
                return console.log('Modal is destroyed');
            }
            !closing && $modal.classList.add('open')
            overlay.setAttribute('data-close','true')
            modalClose.setAttribute('data-close','true')
        },
        close() {
            closing = true
            $modal.classList.remove('open')
            $modal.classList.add('hide')
            setTimeout(() => {
                $modal.classList.remove('hide')
                closing = false
                overlay.setAttribute('data-close','')
                modalClose.setAttribute('data-close','')
            }, ANIMATION_SPEED)},
    }

    const listener = event => {
        if (event.target.dataset.close) {
            modal.close()
        }
    }

    $modal.addEventListener('click', listener)

    return Object.assign(modal, {
        destroy() {
            $modal.parentNode.removeChild($modal) //обычный способ удаления ноды из дом дерева
            $modal.removeEventListener('click', listener)
            destroyed = true
        },
        setContent(html) {
            $modal.querySelector('[data-content]').innerHTML = html
        }
    })
}

