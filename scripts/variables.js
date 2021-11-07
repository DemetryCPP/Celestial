const deleteButton = document.getElementById("delete");
const planetColor = document.getElementById("color");
const planetName = document.getElementById("name");
const planetMass = document.getElementById("mass");
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const { PI, random, round, hypot, sqrt, abs } = Math;

let planetsCount = 0;