// Get the value of a key from local storage
function getLocalStorageValue(key) {
  return localStorage.getItem(key);
}

// Set the value of a key in local storage
function setLocalStorageValue(key, value) {
  localStorage.setItem(key, value);
}

// Remove a key from local storage
function removeLocalStorageValue(key) {
  localStorage.removeItem(key);
}

// Clear all keys from local storage
function clearLocalStorage() {
  localStorage.clear();
}



const scriptsInEvents = {

	async EventSheet1_Event1_Act1(runtime, localVars)
	{
		runtime.globalVars.Username = localStorage.getItem("username");
		runtime.globalVars.School = localStorage.getItem("school");
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

