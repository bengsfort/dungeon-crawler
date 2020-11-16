// Temporary entrypoint

const statusElement = document.getElementById("status") as HTMLDivElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;
const roomIdInput = document.getElementById("room-id") as HTMLInputElement;
const createBtn = document.getElementById("create-btn") as HTMLButtonElement;
const joinBtn = document.getElementById("join-btn") as HTMLButtonElement;

interface RoomCreateResponse extends Response {
  roomId: string;
}

interface RoomCreateResponseError {
  error: string;
}

const ROOM_ID_LENGTH = 5;

let username = "";
let roomId = "";

function showError(err: string): void {
  statusElement.classList.remove("hide");
  statusElement.classList.add("error");
  statusElement.innerText = err;
}

function showStatus(msg: string): void {
  statusElement.classList.remove("hide");
  statusElement.classList.add("success");
  statusElement.innerText = msg;
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
  showStatus(`Connecting to ${roomId}...`);
  // @todo: apart from redo this make request to see whether the room is joinable or not
  window.location.pathname = `/room/${roomId}`;
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
  showStatus("Creating game room...");
  // @todo: We should create a session for user data maybe?
  void fetch("/room/create", {
    method: "POST",
    body: JSON.stringify({
      username,
      world: "sandbox",
    }),
  })
    .then((value) => value.json())
    .then((value) => {
      showStatus(`Joining ${(value as RoomCreateResponse).roomId}...`);
      window.location.pathname = `/room/${
        (value as RoomCreateResponse).roomId
      }`;
      return;
    })
    .catch((e) => showError((e as RoomCreateResponseError).error));
});
