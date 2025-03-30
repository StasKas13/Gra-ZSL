

/*// Funkcja losująca pytanie z wybranego przedmiotu
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

document.getElementById('pol').addEventListener('click', function() {
  const p_pol = random_question("Język polski");
  alert(`Pytanie: ${p_pol.pytanie}\n -> ${p_pol.odpowiedzi.join("\n -> ")}`);
});

document.getElementById('ang').addEventListener('click', function() {
  const p_ang = random_question("Język angielski");
  alert(`Pytanie: ${p_ang.pytanie}\n -> ${p_ang.odpowiedzi.join("\n -> ")}`);
});

document.getElementById('matma').addEventListener('click', function() {
  const p_matma = random_question("Matematyka");
  alert(`Pytanie: ${p_matma.pytanie}\n -> ${p_matma.odpowiedzi.join("\n -> ")}`);
});

document.getElementById('historia').addEventListener('click', function() {
  const p_his = random_question("Historia");
  alert(`Pytanie: ${p_his.pytanie}\n -> ${p_his.odpowiedzi.join("\n -> ")}`);
});

document.getElementById('biologia').addEventListener('click', function() {
  const p_biol = random_question("Biologia");
  alert(`Pytanie: ${p_biol.pytanie}\n -> ${p_biol.odpowiedzi.join("\n -> ")}`);
});

// Pobiera pytania z pliku HTML
function loadQuestions() {
  const dataElement = document.getElementById("questions-data");
  return JSON.parse(dataElement.textContent);
}

// Pobiera losowe pytanie z danej kategorii
function random_question(przedmiot) {
  const questions = loadQuestions(); // Wczytaj pytania
  const pytania = questions[przedmiot];

  if (!pytania || pytania.length === 0) {
      console.error(`Brak pytań dla ${przedmiot}`);
      return null;
  }

  const losowe = Math.floor(Math.random() * pytania.length);
  const pytanie = { ...pytania[losowe] };
  delete pytanie.poprawna; // Usuwamy poprawną odpowiedź
  return pytanie;
}

// Eksportujemy funkcję dla game.js
window.getQuestion = random_question;
document.addEventListener("DOMContentLoaded", () => {
  const dataContainer = document.getElementById("questionData");
  dataContainer.dataset.questions = JSON.stringify(window.questions);
});

window.getQuestion = function (przedmiot) {
  const allQuestions = JSON.parse(document.getElementById("questionData").dataset.questions);
  if (!allQuestions[przedmiot] || allQuestions[przedmiot].length === 0) {
      console.error(`Brak pytań dla ${przedmiot}`);
      return null;
  }
  const i = Math.floor(Math.random() * allQuestions[przedmiot].length);
  const pytanie = { ...allQuestions[przedmiot][i] };
  delete pytanie.poprawna; // Ukrywamy poprawną odpowiedź
  return pytanie;
};*/
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const dataContainer = document.getElementById("questionData");
    dataContainer.dataset.questions = JSON.stringify(window.questions);
    console.log("✅ Dane pytań ustawione w dataset.questions", dataContainer.dataset.questions);
  }, 100);
});
window.getQuestion = function (przedmiot) {
  const rawData = document.getElementById("questionData").dataset.questions;
  if (!rawData) {
    console.error("❌ Nie znaleziono danych pytań!");
    return null;
  }
  try {
    const allQuestions = JSON.parse(rawData);
    if (!allQuestions[przedmiot] || allQuestions[przedmiot].length === 0) {
      console.error(`Brak pytań dla ${przedmiot}`);
      return null;
    }
    const i = Math.floor(Math.random() * allQuestions[przedmiot].length);
    return { ...allQuestions[przedmiot][i] };
  } catch (error) {
    console.error("❌ Błąd parsowania JSON w getQuestion:", error);
    return null;
  }
};
console.log("✅ window.getQuestion jest teraz dostępne!");