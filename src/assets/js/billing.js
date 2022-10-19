/* global IMask */
const maskOptions = {
	mask: '0000',
	lazy: false,
	placeholderChar: ' ',
};
const maskDate = {
	mask: '00/00',
	lazy: false,
	placeholderChar: '0',
};

document.querySelectorAll('[data-card-num] input').forEach(item => {
	IMask(item, maskOptions);
});

IMask(document.querySelector('#num-date'), maskDate);

const tax = 100;
const shipping = 150;
const subTotal = document.querySelector('[data-subtotal]');
const total = document.querySelector('[data-total]');
const itemsWrap = document.querySelector('.billing-cart__items');
const cartHint = document.querySelector('.header__cart-count');

const renderTotals = () => {
	let subTotalSum = 0;
	document.querySelectorAll('.billing-cart__item [data-all-cost]').forEach(item => {
		subTotalSum += Number(item.getAttribute('data-all-cost'));
	});

	const totalSum = tax + shipping + subTotalSum;
	subTotal.innerText = '$ ' + subTotalSum.toLocaleString('RU-ru');

	if (subTotalSum) {
		total.innerText = '$ ' + totalSum.toLocaleString('RU-ru');
	} else {
		total.innerText = '$ 0';
	}
};

renderTotals();

const setHandler = function (evt) {
	const handler = evt.target.closest('.billing-cart__counter-btn');
	const handlerName = handler.getAttribute('data-handler');
	const parent = handler.closest('.billing-cart__item');
	const count = parent.querySelector('.billing-cart__counter-num');
	const costItem = parent.querySelector('.billing-cart__cost');

	const cost = Number(parent.getAttribute('data-cost'));
	let countValue = Number(count.innerText);

	if (handlerName === 'minus' && countValue <= 1) return false;

	if (handlerName === 'minus') {
		count.innerText = --countValue;
	}
	if (handlerName === 'plus') {
		count.innerText = ++countValue;
	}

	costItem.innerText = '$ ' + (countValue * cost).toLocaleString('RU-ru');
	costItem.setAttribute('data-all-cost', countValue * cost);

	renderTotals();

	return true;
};

document.querySelectorAll('[data-handler]').forEach(item => {
	item.addEventListener('click', setHandler);
});

const itemDelete = evt => {
	const btnDelete = evt.target.closest('.billing-cart__item-del');
	const parent = btnDelete.closest('.billing-cart__item');

	parent.remove();

	const countItem = document.querySelectorAll('.billing-cart__item').length;

	cartHint.innerText = countItem;

	//If cart empty
	if (!countItem) {
		const warn = document.createElement('p');
		warn.innerText = 'Cart empty';
		itemsWrap.append(warn);

		cartHint.remove();
	}

	renderTotals();
};

document.querySelectorAll('.billing-cart__item-del').forEach(item => {
	item.addEventListener('click', itemDelete);
});

if (module.hot) {
	module.hot.dispose(() => {
		document.querySelectorAll('[data-handler]').forEach(item => {
			item.removeEventListener('click', setHandler);
		});
		document.querySelectorAll('.billing-cart__item-del').forEach(item => {
			item.removeEventListener('click', itemDelete);
		});
	});
}
