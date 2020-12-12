// Temporary entrypoint

import {
  CreateRoomRequest,
  CreateRoomResponse,
  JoinRoomRequest,
  JoinRoomResponse,
} from "@dungeon-crawler/network";

const statusElement = document.getElementById("status") as HTMLDivElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;
const roomIdInput = document.getElementById("room-id") as HTMLInputElement;
const createBtn = document.getElementById("create-btn") as HTMLButtonElement;
const joinBtn = document.getElementById("join-btn") as HTMLButtonElement;

const ROOM_ID_LENGTH = 5;

const showError = (err: string): void => {
  statusElement.classList.remove("hide", "success");
  statusElement.classList.add("error");
  statusElement.innerText = err;
};

const showStatus = (msg: string): void => {
  statusElement.classList.remove("hide", "error");
  statusElement.classList.add("success");
  statusElement.innerText = msg;
};

const joinRoom = async (req: JoinRoomRequest): Promise<void> => {
  try {
    const res = await fetch("/room/join", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });
    const { error, roomId } = (await res.json()) as JoinRoomResponse;
    if (error) throw new Error(error);
    showStatus(`Connecting to ${roomId}...`);
    window.location.pathname = `/play/${roomId}`;
  } catch (e) {
    showError(e);
  }
};

const createRoom = async (req: CreateRoomRequest): Promise<void> => {
  try {
    const res = await fetch("/room/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });
    const { error, roomId } = (await res.json()) as CreateRoomResponse;
    if (error) throw new Error(error);
    showStatus(`Connecting to ${roomId}...`);
    window.location.pathname = `/play/${roomId}`;
  } catch (e) {
    showError(e);
  }
};

joinBtn.addEventListener("click", () => {
  const roomId = roomIdInput.value;
  const username = usernameInput.value;

  let activeError = "";
  if (roomId.length !== ROOM_ID_LENGTH)
    activeError = "Room ID is invalid! (Must be 5 characters)\n";
  if (username.length <= 3)
    activeError += "Username invalid, must be more than 3 characters.";
  if (activeError !== "") {
    showError(activeError);
    return;
  }

  showStatus(`joining game room ${roomId}...`);
  void joinRoom({ username, roomId });
});

createBtn.addEventListener("click", () => {
  const username = usernameInput.value;

  let activeError = "";
  if (username.length <= 3)
    activeError += "Username invalid, must be more than 3 characters.";
  if (activeError !== "") {
    showError(activeError);
    return;
  }

  showStatus("Creating game room...");
  void createRoom({ username, world: "sandbox" });
});
