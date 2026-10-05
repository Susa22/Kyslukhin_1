let prices = [150, 0, 45, 320, 0, 85];

let totalSum = 0;
let finalSum = 0;

let cartChips = document.querySelector('#cartChips');
let receiptItems = document.querySelector('#receiptItems');
let receiptRawTotal = document.querySelector('#receiptRawTotal');
let receiptToPay = document.querySelector('#receiptToPay');
let btnApplyBonuses = document.querySelector('#btnApplyBonuses');

let fold = '';
for (let i = 0; i < prices.length; i++) {
    if (prices[i] === 0) {
        fold += '<span class="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-semibold border border-dashed border-slate-300">0 грн (подарунок)</span> ';
    }
    else {
        fold += '<span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200">' + prices[i] + ' грн</span> ';
    }
}
cartChips.innerHTML = fold;

function calculateCart() {
    totalSum = 0;
    let receiptFold = '';

    for (let i = 0; i < prices.length; i++) {
        if (prices[i] === 0) {
            continue;
        }
        else {
            let itemPriceWithVat = prices[i] * 1.2;
            totalSum += itemPriceWithVat;
            receiptFold += '<div class="flex justify-between"><span>Товар #' + (i + 1) + ' (' + prices[i] + ' грн + ПДВ):</span><span>' + itemPriceWithVat.toFixed(2) + ' грн</span></div>';
        }
    }
    let formattedTotal = totalSum.toFixed(2) + ' грн';
    finalSum = totalSum;

    receiptItems.innerHTML = receiptFold;
    receiptRawTotal.innerHTML = formattedTotal;
    receiptToPay.innerHTML = formattedTotal;

    btnApplyBonuses.removeAttribute('disabled');
}

let bonusBalanceInput = document.querySelector('#bonusBalanceInput');
let bonusStepsContainer = document.querySelector('#bonusStepsContainer');
let receiptDiscount = document.querySelector('#receiptDiscount');
let btnValidateCash = document.querySelector('#btnValidateCash');

function applyBonuses() {
    let bonusBalance = Number(bonusBalanceInput.value);
    let step = 50;
    let maxDiscount = totalSum * 0.5;
    let totalDiscount = 0;
    let stepsFold = '';

    while (bonusBalance >= step && (totalDiscount + step) <= maxDiscount) {
        bonusBalance -= step;
        totalDiscount += step;

        stepsFold += '<div>Списано пакет ' + step + ' балів. Залишок бонусів: ' + bonusBalance + '</div>';
    }

    finalSum = totalSum - totalDiscount;

    receiptDiscount.innerHTML = '-' + totalDiscount.toFixed(2) + ' грн';
    receiptToPay.innerHTML = finalSum.toFixed(2) + ' грн';

    bonusBalanceInput.value = bonusBalance;

    bonusStepsContainer.classList.remove('hidden');
    bonusStepsContainer.innerHTML = stepsFold || '<div>Бонуси не списано (недостатньо балів або перевищено ліміт 50%).</div>';

    btnApplyBonuses.setAttribute('disabled', 'true');
    btnValidateCash.removeAttribute('disabled');
}

let cashInput = document.querySelector('#cashInput');
let validationMsg = document.querySelector('#validationMsg');
let receiptCash = document.querySelector('#receiptCash');
let receiptChange = document.querySelector('#receiptChange');
let btnCalculateChange = document.querySelector('#btnCalculateChange');

let cashGiven = 0;

function validateCashInput() {
    let isValid = false;

    do {
        cashGiven = Number(cashInput.value);

        if (cashGiven >= finalSum) {
            isValid = true;
        }
        else {
            isValid = false;
        }
    } while (false);

    if (isValid) {
        validationMsg.className = 'text-xs text-emerald-600 mt-2';
        validationMsg.innerHTML = 'Успішно! Внесено: ' + cashGiven.toFixed(2) + ' грн (вистачає для оплати).';

        receiptCash.innerHTML = cashGiven.toFixed(2) + ' грн';
        btnCalculateChange.disabled = false;
    }
    else {
        validationMsg.className = 'text-xs text-rose-600 mt-2';
        validationMsg.innerHTML = 'Помилка: сума має бути числом не менше за суму до сплати (' + finalSum.toFixed(2) + ' грн)!';
    }
}

let banknotesResult = document.querySelector('#banknotesResult');

function calculateChange() {
    let change = cashGiven - finalSum;

    receiptChange.innerHTML = change.toFixed(2) + ' грн';

    let banknotes = [500, 200, 100, 50, 20, 10, 5, 2, 1];
    let banknotesFold = '';
    let currentChange = Math.floor(change);

    for (let i = 0; i < banknotes.length; i++) {
        let note = banknotes[i];
        let count = 0;

        while (currentChange >= note) {
            currentChange -= note;
            count++;
        }

        if (count > 0) {
            banknotesFold += '<div class="p-2 bg-purple-50 border border-purple-200 rounded-xl text-center text-xs font-bold text-purple-900">' + note + ' грн: ' + count + ' шт</div>';
        }
    }

    banknotesResult.innerHTML = banknotesFold || '<div class="text-xs text-slate-500">Решта без купюр (0 грн)</div>';
    btnCalculateChange.disabled = true;
}