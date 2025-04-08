<<<<<<< HEAD
=======
window.usedQuestions = {}; // Przechowuje użyte pytania dla każdego przedmiotu

>>>>>>> 322e4111ee7c1c4128c47ee250fe183696725ee0
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const dataContainer = document.getElementById("questionData");
    dataContainer.dataset.questions = JSON.stringify(window.questions);
    console.log(
      "✅ Dane pytań ustawione w dataset.questions",
      dataContainer.dataset.questions
    );
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
      console.error(`❌ Brak pytań dla ${przedmiot}`);
      return null;
    }

    // Jeśli to pierwsze losowanie, inicjalizujemy listę
    if (!window.usedQuestions[przedmiot]) {
      window.usedQuestions[przedmiot] = new Set();
    }

    const totalQuestions = allQuestions[przedmiot].length;
    const usedSet = window.usedQuestions[przedmiot];

    // Jeśli wszystkie pytania były już użyte, zwracamy null
    if (usedSet.size >= totalQuestions) {
      console.warn(
        "⚠️ Wszystkie pytania dla tego przedmiotu zostały już wykorzystane!"
      );
      return null;
    }

    // Losowanie indeksu, który jeszcze nie był użyty
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * totalQuestions);
    } while (usedSet.has(randomIndex));

    // Dodajemy indeks do zbioru użytych
    usedSet.add(randomIndex);

    return { ...allQuestions[przedmiot][randomIndex] };
  } catch (error) {
    console.error("❌ Błąd parsowania JSON w getQuestion:", error);
    return null;
  }
};

console.log("✅ window.getQuestion jest teraz dostępne!");
