const loanModal = document.getElementById('loanModal');
const openAddModal = document.getElementById('openAddModal');
const closeModal = document.getElementById('closeModal');
const loanForm = document.getElementById('loanForm');
const loanTableBody = document.getElementById('loanTableBody');
const cancelBtn = document.getElementById('cancelBtn');  // Bekor qilish tugmasi
let loans = JSON.parse(localStorage.getItem('loans')) || [];
let isEditing = false;
let editIndex = null;

const searchInput = document.getElementById('searchInput');
const searchDate = document.getElementById('searchDate');

let filteredLoans = loans;  // Barcha loans ro'yxatini filtrlashni saqlash

// Qidirish funksiyasi
const searchLoans = (query, date) => {
  filteredLoans = loans.filter(loan => {
    const isNameMatch = loan.name.toLowerCase().includes(query.toLowerCase());
    const isDateMatch = date ? loan.date === date : true;
    return isNameMatch && isDateMatch;
  });
  renderLoans();  // Yangilangan ro'yxatni render qilish
};

// Qidirish uchun inputlar bilan bog'lash
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  const date = searchDate.value;
  searchLoans(query, date);
});

searchDate.addEventListener('input', (e) => {
  const query = searchInput.value.trim();
  const date = e.target.value;
  searchLoans(query, date);
});

// Render funksiyasi (filterlangan ro'yxatni chiqarish)
const renderLoans = () => {
  loanTableBody.innerHTML = '';
  filteredLoans.forEach((loan, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${loan.name}</td>
      <td>${loan.amount}</td>
      <td>${loan.date}</td>
      <td>
        <button class="open-modal-btn" onclick="editLoan(${index})">Tahrirlash</button>
        <button class="open-modal-btn delete-btn" onclick="deleteLoan(${index})">O'chirish</button>
      </td>
    `;
    loanTableBody.appendChild(row);
  });
};

// Ma'lumotlarni saqlash
const saveLoans = () => {
  localStorage.setItem('loans', JSON.stringify(loans));
};

// Qo'shish yoki tahrirlash funksiyasi
const addOrEditLoan = (name, amount, date) => {
  if (isEditing) {
    loans[editIndex] = { name, amount, date };  // Tahrirlashda loans arrayini yangilash
    isEditing = false;
  } else {
    loans.push({ name, amount, date });
  }
  saveLoans();
  renderLoans();
};

// Tahrirlash funksiyasi
const editLoan = (index) => {
  isEditing = true;
  editIndex = index;
  const loan = filteredLoans[index];  // Faqat filtrlangan ro'yxatdan foydalanish
  document.getElementById('name').value = loan.name;
  document.getElementById('amount').value = loan.amount;
  document.getElementById('date').value = loan.date;
  document.getElementById('modalTitle').innerText = 'Qarz Tahrirlash';
  loanModal.style.display = 'flex';
};

// O'chirish funksiyasi
const deleteLoan = (index) => {
  if (confirm('Ma\'lumotni o‘chirishga ishonchingiz komilmi?')) {
    const loanToDelete = filteredLoans[index];  // Faqat filtrlangan ro'yxatdan o'chiriladigan loan
    loans = loans.filter(loan => loan !== loanToDelete);  // Asl ro'yxatdan o'chirish
    saveLoans();
    renderLoans();
  }
};

// Modalda ma'lumotni saqlash
loanForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const amount = document.getElementById('amount').value;
  const date = document.getElementById('date').value;
  addOrEditLoan(name, amount, date);
  loanModal.style.display = 'none';
  loanForm.reset();
});

// Modalni ochish
openAddModal.addEventListener('click', () => {
  document.getElementById('modalTitle').innerText = 'Qarz Qo\'shish';
  loanModal.style.display = 'flex';
});

// Modalni yopish
closeModal.addEventListener('click', () => {
  loanModal.style.display = 'none';
  loanForm.reset();
});

cancelBtn.addEventListener('click', () => {
  loanModal.style.display = 'none';
  loanForm.reset();
});

// Avvalgi ma'lumotlarni render qilish
renderLoans();
