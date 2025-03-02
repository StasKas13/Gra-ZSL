// Funkcja losująca pytanie z wybranego przedmiotu
function random_question(przedmiot) {
    const pyt_przedmiot = questions[przedmiot];
    const i = Math.floor(Math.random() * pyt_przedmiot.length);
    const pytanie = { ...pyt_przedmiot[i] };
    delete pytanie.poprawna; // Usuwamy poprawną odpowiedź
    return pytanie;
  }
  

// Funkcja przypisująca pytanie do przycisku
document.getElementById('chemia').addEventListener('click', function() {
    const p_Chemia = random_question("Chemia");
    alert(`Pytanie: ${p_Chemia.pytanie}\n -> ${p_Chemia.odpowiedzi.join("\n -> ")}`);
  });
  
  document.getElementById('geografia').addEventListener('click', function() {
    const p_Geografia = random_question("Geografia");
    alert(`Pytanie: ${p_Geografia.pytanie}\n -> ${p_Geografia.odpowiedzi.join("\n -> ")}`);
  });
  
  document.getElementById('bazy_danych').addEventListener('click', function() {
    const p_B_Danych = random_question("Zarządzanie bazami danych");
    alert(`Pytanie: ${p_B_Danych.pytanie}\n -> ${p_B_Danych.odpowiedzi.join("\n -> ")}`);
  });
  
  document.getElementById('strony_internetowe').addEventListener('click', function() {
    const p_S_Internetowe = random_question("Projektowanie stron internetowych");
    alert(`Pytanie: ${p_S_Internetowe.pytanie}\n -> ${p_S_Internetowe.odpowiedzi.join("\n -> ")}`);
  });
  