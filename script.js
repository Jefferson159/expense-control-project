document.getElementById('expense-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const expenseName = document.getElementById('expense-name').value;
  const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
  const limitInput = document.getElementById('expense-limit').value;
  const limitAmount = parseFloat(limitInput);

  const tableBody = document.getElementById('expense-table-body');
  const totalAmountElement = document.getElementById('total-amount');
  const remainingLimitElement = document.getElementById('remaining-limit');

  let totalAmount = parseFloat(totalAmountElement.textContent.replace('R$', '').trim());
  let remainingLimit = parseFloat(remainingLimitElement.textContent.replace('R$', '').trim());

  if (!limitAmount) {
    alert('Por favor, defina um limite de gasto.');
    return;
  }

  if (isNaN(remainingLimit) || remainingLimit === 0) {
    remainingLimit = limitAmount;
    remainingLimitElement.textContent = remainingLimit.toFixed(2);
  }

  if ((remainingLimit - expenseAmount) >= 0) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td class="px-4 py-2">${expenseName}</td>
      <td class="px-4 py-2">R$ ${expenseAmount.toFixed(2)}</td>
      <td class="px-4 py-2 no-print">
        <button class="edit-expense bg-yellow-500 text-white p-1 rounded">Editar</button>
        <button class="remove-expense bg-red-500 text-white p-1 rounded">Remover</button>
      </td>
    `;
    tableBody.appendChild(newRow);
    totalAmount += expenseAmount;
    totalAmountElement.textContent = totalAmount.toFixed(2);
    remainingLimit -= expenseAmount;
    remainingLimitElement.textContent = remainingLimit.toFixed(2);

    const removeButtons = document.querySelectorAll('.remove-expense');
    removeButtons.forEach((button) => {
      button.addEventListener('click', function() {
        const row = this.closest('tr');
        const amount = parseFloat(row.cells[1].textContent.replace('R$', '').trim());
        totalAmount -= amount;
        remainingLimit += amount;
        totalAmountElement.textContent = totalAmount.toFixed(2);
        remainingLimitElement.textContent = remainingLimit.toFixed(2);
        row.remove();
      });
    });

    const editButtons = document.querySelectorAll('.edit-expense');
    editButtons.forEach((button) => {
      button.addEventListener('click', function() {
        const row = this.closest('tr');
        const name = row.cells[0].textContent;
        const amount = parseFloat(row.cells[1].textContent.replace('R$', '').trim());

        document.getElementById('expense-name').value = name;
        document.getElementById('expense-amount').value = amount;
        remainingLimit += amount;
        remainingLimitElement.textContent = remainingLimit.toFixed(2);
        totalAmount -= amount;
        totalAmountElement.textContent = totalAmount.toFixed(2);
        row.remove();
      });
    });
  } else {
    alert('Você excedeu seu limite de gasto!');
  }

  document.getElementById('expense-name').value = '';
  document.getElementById('expense-amount').value = '';
});

document.getElementById('print-ticket').addEventListener('click', function() {
  window.print();
});

document.getElementById('export-excel').addEventListener('click', function() {
  const table = document.querySelector('table');
  const workbook = XLSX.utils.table_to_book(table, {sheet: "Sheet1"});
  XLSX.writeFile(workbook, 'controle_de_gastos.xlsx');
});