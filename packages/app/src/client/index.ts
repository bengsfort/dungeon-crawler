// Temporary entrypoint

const status = document.getElementById("status") as HTMLDivElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;
const roomIdInput = document.getElementById("room-id") as HTMLInputElement;
const createBtn = document.getElementById("create-btn") as HTMLButtonElement;
const joinBtn = document.getElementById("join-btn") as HTMLButtonElement;

const ROOM_ID_LENGTH = 5;

let username = "";
let roomId = "";

function showError(err: string): void {
  status.classList.remove("hide");
  status.innerText = err;
}

usernameInput.addEventListener("change", (ev) => {
  username = (ev.target as HTMLInputElement).value;
});
roomIdInput.addEventListener("change", (ev) => {
  roomId = (ev.target as HTMLInputElement).value;
});

joinBtn.addEventListener("click", () => {
  const validRoomId = roomId.length === ROOM_ID_LENGTH;
  const validUsername = username.length > 3;
  let activeError = "";
  if (!validRoomId)
    activeError = "Room ID is invalid! (Must be 5 characters)\n";
  if (!validUsername)
    activeError += "Username invalid, must be more than 3 characters.";
  if (activeError !== "") {
    showError(activeError);
    return;
  }
  // join
});

createBtn.addEventListener("click", () => {
  const validUsername = username.length > 3;
  let activeError = "";
  if (!validUsername)
    activeError += "Username invalid, must be more than 3 characters.";
  if (activeError !== "") {
    showError(activeError);
    return;
  }
  // join
});
