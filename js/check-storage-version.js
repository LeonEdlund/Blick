const currentStorageVersion = "2.0";

window.addEventListener("load", checkStorageVersion);

function checkStorageVersion() {
  const storedVersion = localStorage.getItem("storageVersion");

  if (storedVersion === null || storedVersion !== currentStorageVersion) {
    localStorage.clear();
    localStorage.setItem("storageVersion", currentStorageVersion);
    console.log("Local storage cleared. New storage version found.");
  }
}
