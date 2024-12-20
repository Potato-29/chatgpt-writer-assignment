import { generateResponse } from "./../services/response";
import { modalHtml } from "@/components/modal.ts";
import regenerateIcon from "@/assets/regenerate.svg";
import editIcon from "@/assets/edit.svg";

export default defineContentScript({
  matches: ["*://*.google.com/*", "*://*.linkedin.com/*"],
  main() {
    let lastGeneratedMessage = "";
    let parentContainer: HTMLElement | null = null;

    const icon = document.createElement("img");
    icon.className = "editIcon";
    icon.id = "editIcon";
    icon.src = editIcon;
    icon.alt = "Custom Icon";
    icon.style.position = "absolute";
    icon.style.bottom = "5px";
    icon.style.right = "5px";
    icon.style.width = "45px";
    icon.style.height = "45px";
    icon.style.cursor = "pointer";
    icon.style.zIndex = "1000";
    icon.style.display = "block";

    document.body.insertAdjacentHTML("beforeend", modalHtml);
    let modal: HTMLElement | null = document.getElementById("generate-modal");
    const generateBtn = document.getElementById(
      "generate-btn"
    ) as HTMLButtonElement;
    const insertBtn = document.getElementById(
      "confirm-btn"
    ) as HTMLButtonElement;
    const inputText = document.getElementById("gptwriter-modal-input-text") as HTMLInputElement;
    const responseDiv = document.getElementById("responses") as HTMLDivElement;


    var mutationObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "attributes" && mutation.attributeName === "data-artdeco-is-focused") {
          const target = mutation.target as HTMLElement;
          console.log(target)
          if (target.matches(".msg-form__contenteditable"))
            if (mutation.oldValue === null) {
              icon.style.display = "block";
              parentContainer =
                target.closest(".msg-form__container") ||
                target.closest(".msg-form__contenteditable");
              if (parentContainer && !parentContainer.querySelector("#editIcon")) {
                parentContainer.appendChild(icon);
              }
            }
          if (mutation.oldValue === "true") {
            icon.style.display = "none";
          }
          icon.addEventListener("click", (e) => {
            e.stopPropagation();
            modal.style.display = "flex";
            inputText.focus()

          });
        }
      });
    });
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      characterData: true,
      childList: false,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });

    // this listener generate a dummy response
    generateBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      // get input and validate
      const inputValue = inputText.value.trim();
      if (!inputValue) {
        alert("Please enter a prompt!");
        return;
      }

      // push response in array
      const userMessageDiv = document.createElement("div");
      userMessageDiv.textContent = inputValue;
      Object.assign(userMessageDiv.style, {
        backgroundColor: "#DFE1E7",
        color: "#666D80",
        borderRadius: "12px",
        padding: "10px",
        marginBottom: "5px",
        textAlign: "right",
        maxWidth: "80%",
        alignSelf: "flex-end",
        marginLeft: "auto",
      });
      responseDiv.appendChild(userMessageDiv);

      generateBtn.disabled = true;
      generateBtn.textContent = "Loading...";
      generateBtn.style.backgroundColor = "#666D80";

      // Simulate API call delay
      setTimeout(() => {
        lastGeneratedMessage = generateResponse();
        const generatedMessageDiv = document.createElement("div");
        generatedMessageDiv.textContent = lastGeneratedMessage;
        Object.assign(generatedMessageDiv.style, {
          backgroundColor: "#DBEAFE",
          color: "#666D80",
          borderRadius: "4px",
          padding: "10px",
          marginBottom: "5px",
          textAlign: "left",
          maxWidth: "80%",
          alignSelf: "flex-start",
          marginRight: "auto",
        });

        responseDiv.appendChild(generatedMessageDiv);
        responseDiv.scrollTop = responseDiv.scrollHeight;

        generateBtn.disabled = false;
        generateBtn.style.backgroundColor = "#007bff";
        generateBtn.style.color = "white";
        generateBtn.innerHTML = `<img src="${regenerateIcon}" alt="Regenerate" style="vertical-align: middle; margin-right: 5px; width: 16px; height: 16px"> <b>Regenerate</b>`;
        generateBtn.disabled = true

        // Reset input field
        inputText.value = "";
        insertBtn.style.display = "inline-block";
      }, 1000);
    });

    insertBtn.addEventListener("click", (e) => {
      const target = e?.target as HTMLElement;
      if (lastGeneratedMessage && parentContainer) {
        let existingParagraph = parentContainer.querySelector("p");

        if (!existingParagraph) {
          existingParagraph = document.createElement("p");
          parentContainer.appendChild(existingParagraph);
        }

        // insert the new message
        existingParagraph.textContent = lastGeneratedMessage;

        // close the modal
        insertBtn.style.display = "none";
        modal.style.display = "none";
        const label = document.querySelector(".msg-form__placeholder");
        label?.removeAttribute("data-placeholder");
      }
    });

    const inputElements = [inputText, generateBtn, insertBtn];
    inputElements.forEach((element) => {
      element.addEventListener("focus", () => {
        if (parentContainer) {
          parentContainer.setAttribute("data-artdeco-is-focused", "true");
        }
      });
    });

    // close the modal when user clicks outside
    document.addEventListener("click", (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.id === "generate-modal" && modal?.style.display === "flex") {
        modal.style.display = "none";
      }
    });
  },
});
