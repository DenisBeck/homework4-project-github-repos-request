export const appModules = {
    validateInput: function() {
        let send = this.sendRequest;
        let form = document.forms.searchform;
        let input = document.querySelector('input[type="search"]');

        form.addEventListener('keydown', function(e) {
            if(e.key == 'enter') {
                validate(e);
            }
        })
        input.addEventListener('input', function() {
            let span = this.parentElement.querySelector('span');
            if(span) {
                span.remove();
            }
        })
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if(input.value.length < 4 ) {
                if(this.querySelector('span')) return;
                input.parentElement.insertAdjacentHTML('beforeend', '<span style="color:red">Недостаточно символов, введите не менее 4 символов</span>')
            } else {
                send(this);
            }
        });
        
    },
    sendRequest: async function(data) {
        let itemsList = document.querySelector('.request__list');
        itemsList.innerHTML = '';
        itemsList.classList.add('_sending');
        let result;
        let response = await fetch('https://api.github.com/search/repositories?q=' + data.search.value);
        if(response.ok) {
            result = await response.json();
        } else {
            console.log('Ошибка: ' + response.status);
            return;
        }

        let repos = result.items;
        let itemsCount = result.total_count < 10 ? result.total_count : 10;
        if(itemsCount === 0) {
            itemsList.classList.remove('_sending');
            itemsList.innerHTML = '<li class="request__item"><strong>Ничего не найдено</strong></li>';
            return;
        }
        for(let i = 0; i < itemsCount; i++) {
            let item = document.createElement('li');
            item.classList.add('request__item');
            item.classList.add('request-item');

            let itemInnerContent = `
                <div class="request-item__owner">
                    <a href="${repos[i].owner.html_url}">
                        <img src="${repos[i].owner.avatar_url}" alt="avatar-${i}">
                    </a>
                </div>
                <div class="request-item__repo">
                    <div class="request-item__login">${repos[i].owner.login}</div>
                    <a href="${repos[i].html_url}" target="blanc" class="request-item__link">${repos[i].full_name}</a>
                </div>
            `;
            itemsList.classList.remove('_sending');
            item.innerHTML = itemInnerContent;
            itemsList.append(item);
        }
    }
}