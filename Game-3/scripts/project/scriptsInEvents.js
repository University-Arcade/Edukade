
// Firebase Functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getCountFromServer, query, where, orderBy, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDnYPk4Q_k5VvmPeQPleQZzVqkGwkLxLq4",
  authDomain: "edukade-c1a90.firebaseapp.com",
  projectId: "edukade-c1a90",
  storageBucket: "edukade-c1a90.appspot.com",
  messagingSenderId: "210614945943",
  appId: "1:210614945943:web:cbca55541963cd62fdc1d2",
  measurementId: "G-K4XB21R6NW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Submit Scores
async function incrementScoreBySchool(collect, school, increment) {
  const coll = collection(db, collect);
  const querySnapshot = await getDocs(query(coll, where("school", "==", school)));
  console.log(querySnapshot);
  querySnapshot.forEach((doc) => {
    updateDoc(doc.ref, {
      score: increment ? increment + doc.data().score : doc.data().score + 1,
    });
  });
}

// Get Scores
async function getHighScoresBySchool(collect) {
  const coll = collection(db, collect);
  const q = query(coll, orderBy("school"));
  const querySnapshot = await getDocs(q);
  const highScores = await querySnapshot.docs.map((doc) => ({
    id: doc.id,
    school: doc.data().school,
    score: doc.data().score,
  }));
  console.log(highScores);
  return highScores;
}

// Produce Output
function extractValues(str) {
  const match = str.match(/{"id":"([^"]+)","school":"([^"]+)","score":(\d+)}/);
  
  if (match) {
    const id = match[1];
    const school = match[2];
    const score = parseInt(match[3]);
    
    // Construct a new string without the matched substring
    const newStr = str.slice(0, match.index) + str.slice(match.index + match[0].length);
    
    return {id, school, score, newStr};
  } else {
    return null;
  }
}



const scriptsInEvents = {

	async Leadersheet_Event2_Act1(runtime, localVars)
	{
		runtime.globalVars.School = localStorage.getItem('school');
	},

	async Leadersheet_Event9_Act1(runtime, localVars)
	{
		var obj = extractValues(localVars.Go);
		
		localVars.FullName = obj.id;
		localVars.ShortName = obj.school;
		localVars.TotalScore = obj.score;
		localVars.Go = obj.newStr;
	},

	async Leadersheet_Event37_Act2(runtime, localVars)
	{
		localStorage.setItem('school', runtime.globalVars.School);
	},

	async Leadersheet_Event45_Act2(runtime, localVars)
	{
		var School = runtime.globalVars.School;
		var Score = runtime.globalVars.TeamScore;
		var Game = runtime.globalVars.GameName;
		var Total = runtime.globalVars.TotalLeaderboard;
		
		
		incrementScoreBySchool(Game, School, Score)
		  .then(() => {
		    console.log("Score incremented successfully!");
		  })
		  .catch((error) => {
		    console.error("Error incrementing score: ", error);
		  });
		  
		incrementScoreBySchool(Total, School, Score)
			.then(() => {
			console.log("Score incremented successfully!");
		})
			.catch((error) => {
			console.error("Error incrementing score: ", error);
		});
	},

	async Leadersheet_Event45_Act10(runtime, localVars)
	{
		var Leaderboard = runtime.globalVars.GameName;
		
		getHighScoresBySchool(Leaderboard)
		  .then((highScores) => {
		    console.log("High scores array:", highScores);
		    const sortedScores = highScores.sort((a, b) => b.score - a.score);
		    runtime.globalVars.Data = sortedScores.map((score) => JSON.stringify(score));
		  })
		  .catch((error) => {
		    console.error("Error retrieving high scores: ", error);
		  }); 
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

