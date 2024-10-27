import generateIcon from "@/assets/generate.svg";
import confirmIcon from "@/assets/insert.svg";

export const modalHtml: string = `<div id="generate-modal" style="position: fixed; display: none; inset: 0; background: rgba(0, 0, 0, 0.5);  justify-content: center; align-items: center; z-index: 999;">
<div id="modal-content" style="background: white; border-radius: 8px; width: 100%; max-width: 570px; padding: 10px;">
  <div id="responses" style="max-height: 200px; overflow-y: auto; display: flex; flex-direction: column;"></div>
  <div style="margin-bottom: 10px;">
    <input id="gptwriter-modal-input-text" type="text" placeholder="Enter your prompt..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"/>
  </div>
  <div style="text-align: right; margin-top: 12px;">
    <button id="confirm-btn" style="background: #fff; color: #666D80; padding: 8px 16px; border: 2px solid #666D80; border-radius: 4px; cursor: pointer; display: none; margin-right: 10px;">
      <img src="${confirmIcon}" alt="Confirm" style="vertical-align: middle; margin-right: 5px; width: 14px; height: 14px;"> 
      <b>Confirm</b>
    </button>
    <button id="generate-btn" style="background: #007bff; color: white; padding: 8px 16px; border: 2px solid #007bff; border-radius: 4px; cursor: pointer;">
      <img src="${generateIcon}" alt="Generate" style="vertical-align: middle; margin-right: 5px; width: 14px; height: 14px"> 
      <b>Generate</b>
    </button>
  </div>
</div>
</div>`;
