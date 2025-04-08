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