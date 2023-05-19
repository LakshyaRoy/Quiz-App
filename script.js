"use strict";

/***************************** *********/
/************quiz controller********** */
/***************************** **********/

const quizController = (function () {
  //  question constructor *****************

  function Question(id, questionText, option, correctAnswer) {
    this.id = id;
    this.questionText = questionText;
    this.option = option;
    this.correctAnswer = correctAnswer;
  }

  var questionLocalStorage = {
    setQuestionCollection: function (newCollection) {
      localStorage.setItem("QuestionCollection", JSON.stringify(newCollection));
    },
    getQuestionCollection: function () {
      //   return JSON.parse(localStorage.getItem("questionCollection") || []);
      try {
        return JSON.parse(localStorage.getItem("QuestionCollection")) || [];
      } catch (error) {
        return [];
      }
    },
    removeQuestionCollection: function () {
      localStorage.removeItem("QuestionCollection");
    },
  };
  if (questionLocalStorage.getQuestionCollection() === null) {
    questionLocalStorage.setQuestionCollection([]);
  }

  let quizProgress = {
    questionIndex: 0,
  };

  // ***********************person Constructor***********

  function Person(id, firstname, lastname, score) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.score = score;
  }

  let currPersonData = {
    fullName: [],
    score: 0,
  };

  let adminFullName = ["Lakshya", "Roy"];

  let personLocalStorage = {
    setPersonData: function (newPersonData) {
      localStorage.setItem("personData", JSON.stringify(newPersonData));
    },

    getPersonData: function () {
      return JSON.parse(localStorage.getItem("personData"));
    },
    removePersonData: function () {
      localStorage.removeItem("personData");
    },
  };

  if (personLocalStorage.getPersonData() === null) {
    personLocalStorage.setPersonData([]);
  }

  return {
    getQuizProgress: quizProgress,
    getQuestionLocalStorage: questionLocalStorage,
    addQuestionOnLocalStorage: function (newQuestionText, option) {
      const optionsArr = [];
      let corrAns;
      let questionId, getStoredQuests, isChecked;
      isChecked = false;

      for (let i = 0; i < option.length; i++) {
        if (option[i].value !== "") {
          optionsArr.push(option[i].value);
        }
        if (
          option[i].previousElementSibling.checked &&
          option[i].value !== ""
        ) {
          corrAns = option[i].value;
          isChecked = true;
        }
      }
      //   [{id:}]

      if (questionLocalStorage.getQuestionCollection().length > 0) {
        questionId =
          questionLocalStorage.getQuestionCollection()[
            questionLocalStorage.getQuestionCollection().length - 1
          ].id + 1;
      } else {
        questionId = 0;
      }
      if (newQuestionText.value !== "") {
        if (optionsArr.length > 1) {
          if (isChecked) {
            const newQuestion = new Question(
              questionId,
              newQuestionText.value,
              optionsArr,
              corrAns
            );

            getStoredQuests = questionLocalStorage.getQuestionCollection();
            getStoredQuests.push(newQuestion);

            questionLocalStorage.setQuestionCollection(getStoredQuests);

            newQuestionText.value = "";
            for (let x = 0; x < option.length; x++) {
              option[x].value = "";
              option[x].previousElementSibling.checked = false;
            }
            // console.log(questionLocalStorage.getQuestionCollection());
            return true;
          } else {
            alert("You missed to check the correct answer");
            return false;
          }
        } else {
          alert("Please Insert Atleast 2 Options");
          return false;
        }
      } else {
        alert("Please Insert Question!");
        return false;
      }
    },
    checkAnswer: function (ans) {
      if (
        questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex]
          .correctAnswer === ans.textContent.trim()
      ) {
        currPersonData.score++;
        return true;
      } else {
        return false;
      }
    },
    isFinished: function () {
      return (
        quizProgress.questionIndex + 1 ===
        questionLocalStorage.getQuestionCollection().length
      );
    },

    addPerson: function () {
      let newPerson, personId, personData;
      if (personLocalStorage.getPersonData().length > 0) {
        personId =
          personLocalStorage.getPersonData()[
            personLocalStorage.getPersonData().length - 1
          ].id + 1;
      } else {
        personId = 0;
      }

      newPerson = new Person(
        personId,
        currPersonData.fullName[0],
        currPersonData.fullName[1],
        currPersonData.score
      );

      personData = personLocalStorage.getPersonData();
      personData.push(newPerson);
      personLocalStorage.setPersonData(personData);

      // console.log(newPerson);
    },
    getCurrPersonData: currPersonData,
    getAdminFullName: adminFullName,
    getPersonLocalStorage: personLocalStorage,
  };
})();

/***************************** *********/
/************UI Controller********** */
/***************************** **********/

const UIController = (function () {
  const domItems = {
    // admin panel ********************
    adminPanel: document.querySelector(".admin-panel-container"),
    questInsertBtn: document.getElementById("question-insert-btn"),
    newQuestionText: document.getElementById("new-question-text"),
    adminOptions: document.querySelectorAll(".admin-option"),
    adminOptionsContainer: document.querySelector(".admin-options-container"),
    insertedQuestionWrapper: document.querySelector(
      ".inserted-questions-wrapper"
    ),
    questUpdateBtn: document.getElementById("question-update-btn"),
    questDeleteBtn: document.getElementById("question-delete-btn"),
    questClearBtn: document.getElementById("questions-clear-btn"),
    resultListWrapper: document.querySelector(".results-list-wrapper"),

    // **************Quiz section***************
    quizSection: document.querySelector(".quiz-container"),
    askedQuestText: document.getElementById("asked-question-text"),
    quizOptionWrapper: document.querySelector(".quiz-options-wrapper"),
    progressBar: document.querySelector("progress"),
    progressPar: document.getElementById("progress"),
    instAnswerContainer: document.querySelector(".instant-answer-container"),
    instAnswerText: document.getElementById("instant-answer-text"),
    instantAnsDiv: document.getElementById("instant-answer-wrapper"),
    emotionIcon: document.getElementById("emotion"),
    nextQuestBtn: document.getElementById("next-question-btn"),
    // landing page
    landingPageSection: document.querySelector(".landing-page-container"),
    startQuizBtn: document.getElementById("start-quiz-btn"),
    firstNameInput: document.getElementById("firstname"),
    lastNameInput: document.getElementById("lastname"),
    // final result section ***********************
    finalScoreText: document.getElementById("final-score-text"),
    finalResultSection: document.querySelector(".final-result-container"),
    resultClearBtn: document.getElementById("results-clear-btn"),
  };
  return {
    getDomItems: domItems,

    addInputsDynamically: function () {
      let addInput = function () {
        let z = document.querySelectorAll(".admin-option").length;
        let inputHtml = `<div class="admin-option-wrapper"><input type="radio" class="admin-option-${z}" name="answer" value="0"><input type="text" class="admin-option admin-option-${z}" value=""> </div>`;

        domItems.adminOptionsContainer.insertAdjacentHTML(
          "beforeend",
          inputHtml
        );

        domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener(
          "focus",
          addInput
        );
        domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener(
          "focus",
          addInput
        );
      };

      domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener(
        "focus",
        addInput
      );
    },

    createQuestionList: function (getQuestion) {
      let questionHtml, numberingArr;
      numberingArr = [];

      domItems.insertedQuestionWrapper.innerHTML = "";
      for (let i = 0; i < getQuestion.getQuestionCollection().length; i++) {
        numberingArr.push(i + 1);

        questionHtml = `<p><span>${numberingArr[i]}.${
          getQuestion.getQuestionCollection()[i].questionText
        }</span><button id="question-${
          getQuestion.getQuestionCollection()[i].id
        }">Edit</button></p>`;

        domItems.insertedQuestionWrapper.insertAdjacentHTML(
          "afterbegin",
          questionHtml
        );
      }
    },

    editQuestList: function (
      event,
      storageQuestList,
      addInpsDyns,
      updateQuestListFn
    ) {
      let getId,
        getStoredQuestList,
        foundItem,
        placeInArr,
        optionHtml = "";

      if ("question-".indexOf(event.target.id)) {
        getId = parseInt(event.target.id.split("-")[1]);
        getStoredQuestList = storageQuestList.getQuestionCollection();

        for (let i = 0; i < getStoredQuestList.length; i++) {
          if (getStoredQuestList[i].id === getId) {
            foundItem = getStoredQuestList[i];
            placeInArr = i;
          }
        }
        domItems.newQuestionText.value = foundItem.questionText;
        domItems.adminOptionsContainer.innerHTML = "";
        for (let x = 0; x < foundItem.option.length; x++) {
          optionHtml =
            `<div class="admin-option-wrapper"><input type="radio" class="admin-option-${x}" name="answer" value="${x}"><input type="text" class="admin-option admin-option-${x}" value="${foundItem.option[x]}"></div>` +
            optionHtml;
        }

        domItems.adminOptionsContainer.innerHTML = optionHtml;

        domItems.questUpdateBtn.style.visibility = "visible";
        domItems.questDeleteBtn.style.visibility = "visible";
        domItems.questInsertBtn.style.visibility = "hidden";
        // domItems.questClearBtn.style.visibility = "hidden";
        domItems.questClearBtn.style.pointerEvents = "none";

        addInpsDyns();

        let backDefaultView = function () {
          let updatedOption = document.querySelectorAll(".admin-option");
          domItems.newQuestionText.value = "";

          for (let i = 0; i < updatedOption.length; i++) {
            updatedOption[i].value = "";
            updatedOption[i].previousElementSibling.checked = false;
          }
          domItems.questUpdateBtn.style.visibility = "hidden";
          domItems.questDeleteBtn.style.visibility = "hidden";
          domItems.questInsertBtn.style.visibility = "visible";
          // domItems.questClearBtn.style.visibility = "hidden";
          domItems.questClearBtn.style.pointerEvents = "";

          updateQuestListFn(storageQuestList);
        };

        let updateQuestion = function () {
          var newOptions, optionElms;

          newOptions = [];
          optionElms = document.querySelectorAll(".admin-option");
          foundItem.questionText = domItems.newQuestionText.value;
          foundItem.correctAnswer = "";

          for (let i = 0; i < optionElms.length; i++) {
            if (optionElms[i].value != "") {
              newOptions.push(optionElms[i].value);
              if (optionElms[i].previousElementSibling.checked) {
                foundItem.correctAnswer = optionElms[i].value;
              }
            }
          }

          foundItem.option = newOptions;

          if (foundItem.questionText !== "") {
            if (foundItem.option.length > 1) {
              if (foundItem.correctAnswer !== "") {
                getStoredQuestList.splice(placeInArr, 1, foundItem);

                storageQuestList.setQuestionCollection(getStoredQuestList);
                backDefaultView();
              } else {
                alert(
                  "Please missed to check the correct answer, or you checked the answer without value"
                );
              }
            } else {
              alert("Please add Atleast 2 options to the question");
            }
          } else {
            alert("Please ,Insert Question");
          }
        };

        domItems.questUpdateBtn.onclick = updateQuestion;

        let deleteQuestion = function () {
          getStoredQuestList.splice(placeInArr, 1);
          storageQuestList.setQuestionCollection(getStoredQuestList);
          backDefaultView();
        };
        domItems.questDeleteBtn.onclick = deleteQuestion;
      }

      // console.log(event, storageQuestList);
    },
    clearQuestList: function (storageQuestList) {
      if (storageQuestList.getQuestionCollection() !== null) {
        if (storageQuestList.getQuestionCollection().length > 0) {
          let conf = confirm("Warning You Will Lose Entire Question List!");

          if (conf) {
            storageQuestList.removeQuestionCollection();
            domItems.insertedQuestionWrapper.innerHTML = "";
          }
        }
      }
    },

    displayQuestion: function (storageQuestList, progress) {
      let newOptionHTML, characterArr;
      characterArr = ["A", "B", "C", "D", "E", "F"];

      if (storageQuestList.getQuestionCollection().length > 0) {
        domItems.askedQuestText.textContent =
          storageQuestList.getQuestionCollection()[
            progress.questionIndex
          ].questionText;

        domItems.quizOptionWrapper.innerHTML = "";
        for (
          let i = 0;
          i <
          storageQuestList.getQuestionCollection()[progress.questionIndex]
            .option.length;
          i++
        ) {
          newOptionHTML = `  <div class="choice-${i}"><span class="choice-${i}">${
            characterArr[i]
          }</span><p  class="choice-${i}">
          ${
            storageQuestList.getQuestionCollection()[progress.questionIndex]
              .option[i]
          }</p>
          </div>`;

          domItems.quizOptionWrapper.insertAdjacentHTML(
            "beforeend",
            newOptionHTML
          );
        }
      }
    },

    displayProgress: function (storageQuestList, progress) {
      domItems.progressBar.max =
        storageQuestList.getQuestionCollection().length;
      domItems.progressBar.value = progress.questionIndex + 1;
      domItems.progressPar.textContent =
        progress.questionIndex +
        1 +
        "/" +
        storageQuestList.getQuestionCollection().length;
    },

    newDesign: function (ansResult, selectedAns) {
      let index = 0;

      if (ansResult) {
        index = 1;
      }

      let twoOptions = {
        instAnswerText: ["This is a Wrong Answer", "This is a Correct Answer"],
        instAnswerClass: ["red", "green"],
        emotionType: ["images/sad.png", "images/happy.png"],
        optionSpanBg: ["red", "green"],
      };

      domItems.quizOptionWrapper.style.cssText =
        "opacity:0.6; pointer-events:none;";

      domItems.instAnswerContainer.style.opacity = "1";
      domItems.instAnswerText.textContent = twoOptions.instAnswerText[index];

      domItems.instantAnsDiv.className = twoOptions.instAnswerClass[index];
      domItems.emotionIcon.setAttribute("src", twoOptions.emotionType[index]);

      selectedAns.previousElementSibling.style.backgroundColor =
        twoOptions.optionSpanBg[index];
    },
    resetDesign: function () {
      domItems.quizOptionWrapper.style.cssText = "";
      domItems.instAnswerContainer.style.opacity = "0";
    },

    getFullName: function (currPerson, storageQuestList, admin) {
      if (
        domItems.firstNameInput.value !== "" &&
        domItems.lastNameInput.value !== ""
      ) {
        if (
          !(
            domItems.firstNameInput.value === admin[0] &&
            domItems.lastNameInput.value === admin[1]
          )
        ) {
          if (storageQuestList.getQuestionCollection().length > 0) {
            currPerson.fullName.push(domItems.firstNameInput.value);
            currPerson.fullName.push(domItems.lastNameInput.value);
            domItems.landingPageSection.style.display = "none";
            domItems.quizSection.style.display = "block";
            // console.log(currPerson);
          } else {
            alert("quiz is not ready please contact to admin! ");
          }
        } else {
          domItems.landingPageSection.style.display = "none";
          domItems.adminPanel.style.display = "block";
        }
      } else {
        alert("Please Enter First and Last Name!");
      }
    },

    finalResult: function (currPerson) {
      domItems.finalScoreText.textContent = `${currPerson.fullName[0]} ${currPerson.fullName[1]} Your Final Score Is ${currPerson.score}`;

      domItems.quizSection.style.display = "none";
      domItems.finalResultSection.style.display = "block";
    },
    addResultOnPanel: function (userData) {
      let resultHtml;

      domItems.resultListWrapper.innerHTML = "";

      for (let i = 0; i < userData.getPersonData().length; i++) {
        resultHtml = `<p class="person person-${i}"><span class="person-${i}">${
          userData.getPersonData()[i].firstname
        } ${userData.getPersonData()[i].lastname} - ${
          userData.getPersonData()[i].score
        } Points</span><button id="delete-result-btn_${
          userData.getPersonData()[i].id
        }" class="delete-result-btn">Delete</button></p>`;
        domItems.resultListWrapper.insertAdjacentHTML("afterBegin", resultHtml);
      }
      // let userData = function () {};
    },
    deleteResult: function (event, userData) {
      let getId, personsArr;
      personsArr = userData.getPersonData();
      if ("delete-result-btn_".indexOf(event.target.id)) {
        getId = parseInt(event.target.id.split("_")[1]);

        for (let i = 0; i < personsArr.length; i++) {
          if (personsArr[i].id === getId) {
            personsArr.splice(i, 1);
            userData.setPersonData(personsArr);
          }
        }
      }
    },
    clearResultList: function (userData) {
      if (userData.getPersonData() !== null) {
        if (userData.getPersonData().length > 0) {
          let conf = confirm("Warning! You will lose entire result List");
          if (conf) {
            userData.removePersonData();
            domItems.resultListWrapper.innerHTML = "";
          }
        }
      }
    },
  };
})();

/***************************** *********/
/************controller********** */
/***************************** **********/

var controller = (function (quizCtrl, UICtrl) {
  // 11
  var selectedDomItems = UICtrl.getDomItems;
  // 64
  UICtrl.addInputsDynamically();
  // 81
  UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
  // 9 -- //12 (change with var selectedDomItems)
  selectedDomItems.questInsertBtn.addEventListener("click", function () {
    // 77
    var adminOptions = document.querySelectorAll(".admin-option");
    // 10
    // console.log('Works');
    // 100             // 17                                                                // 78
    var checkBoolean = quizCtrl.addQuestionOnLocalStorage(
      selectedDomItems.newQuestionText,
      adminOptions
    );
    // 101
    if (checkBoolean) {
      // 102
      UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
    }
  });

  selectedDomItems.insertedQuestionWrapper.addEventListener(
    "click",
    function (e) {
      UICtrl.editQuestList(
        e,
        quizCtrl.getQuestionLocalStorage,
        UICtrl.addInputsDynamically,
        UICtrl.createQuestionList
      );
    }
  );
  selectedDomItems.questClearBtn.addEventListener("click", function () {
    UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
  });

  UICtrl.displayQuestion(
    quizCtrl.getQuestionLocalStorage,
    quizCtrl.getQuizProgress
  );

  UICtrl.displayProgress(
    quizCtrl.getQuestionLocalStorage,
    quizCtrl.getQuizProgress
  );

  selectedDomItems.quizOptionWrapper.addEventListener("click", function (e) {
    let updatedOptionDiv =
      selectedDomItems.quizOptionWrapper.querySelectorAll("div");

    for (let i = 0; i < updatedOptionDiv.length; i++) {
      if (e.target.className === "choice-" + i) {
        let answer = document.querySelector(
          ".quiz-options-wrapper div p." + e.target.className
        );

        let answerResult = quizCtrl.checkAnswer(answer);

        UICtrl.newDesign(answerResult, answer);

        let nextQuestion = function (questData, progress) {
          if (quizCtrl.isFinished()) {
            // finished quiz
            quizCtrl.addPerson();
            UICtrl.finalResult(quizCtrl.getCurrPersonData);

            if (quizCtrl.isFinished()) {
              selectedDomItems.nextQuestBtn.textContent = "Finish";
              // console.log("Finish");
            }
          } else {
            // next question
            UICtrl.resetDesign();
            quizCtrl.getQuizProgress.questionIndex++;
            UICtrl.displayQuestion(
              quizCtrl.getQuestionLocalStorage,
              quizCtrl.getQuizProgress
            );
            UICtrl.displayProgress(
              quizCtrl.getQuestionLocalStorage,
              quizCtrl.getQuizProgress
            );
          }
        };

        selectedDomItems.nextQuestBtn.onclick = function () {
          nextQuestion(
            quizCtrl.getQuestionLocalStorage,
            quizCtrl.getQuizProgress
          );
        };
      }
    }
  });

  selectedDomItems.startQuizBtn.addEventListener("click", function () {
    UICtrl.getFullName(
      quizCtrl.getCurrPersonData,
      quizCtrl.getQuestionLocalStorage,
      quizCtrl.getAdminFullName
    );
  });
  selectedDomItems.lastNameInput.addEventListener("focus", function () {
    selectedDomItems.lastNameInput.addEventListener("keypress", function (e) {
      if (e.keyCode === 13) {
        // enter keycode = 13
        // console.log(e.keyCode);
        UICtrl.getFullName(
          quizCtrl.getCurrPersonData,
          quizCtrl.getQuestionLocalStorage,
          quizCtrl.getAdminFullName
        );
      }
    });
  });

  UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
  selectedDomItems.resultListWrapper.addEventListener("click", function (e) {
    UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);
    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
  });
  selectedDomItems.resultClearBtn.addEventListener("click", function () {
    UICtrl.clearResultList(quizCtrl.getPersonLocalStorage);
  });
})(quizController, UIController);
