var cities = [];
var totalCities = 10;

var popSize = 500;
var population = [];
var fitness = [];

var recordDistance = Infinity;
var bestEver;
var currentBest;

//var statusP;

function setup() {
  createCanvas(750, 750);
  var order = [];
  for (var i = 0; i < totalCities; i++) {
    var v = createVector(random(width), random(height / 2));
    cities[i] = v;
    order[i] = i;
  }

  for (var i = 0; i < popSize; i++) {
    population[i] = shuffle(order);
  }
  //statusP = createP('').style('font-size', '32pt');
}

function draw() {
  background(0);

  // GA
  calculateFitness();
  normalizeFitness();
  nextGeneration();

  stroke(0,0,00);
  strokeWeight(0.5);
  noFill();
  beginShape();
  for (var i = 0; i < currentBest.length; i++) {
    var n = currentBest[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);
  }
  endShape();
  
  stroke(0,255,0);
  strokeWeight(6);
  noFill();
  
  beginShape();
  for (var i = 0; i < bestEver.length; i++) {
    var n = bestEver[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);
  }
  endShape();

 translate(0, height / 2);
 
  stroke(255,0,0);
  strokeWeight(5);
  noFill();
  beginShape();
  for (var i = 0; i < currentBest.length; i++) {
    var n = currentBest[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);
  }
  endShape();

}

// function shuffle(a, num) {
//   for (var i = 0; i < num; i++) {
//     var indexA = floor(random(a.length));
//     var indexB = floor(random(a.length));
//     swap(a, indexA, indexB);
//   }
// }


function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}


function calcDistance(points, order) {
  var sum = 0;
  for (var i = 0; i < order.length - 1; i++) {
    var cityAIndex = order[i];
    var cityA = points[cityAIndex];
    var cityBIndex = order[i + 1];
    var cityB = points[cityBIndex];
    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  return sum;
}

function calculateFitness() {
  var currentRecord = Infinity;
  for (var i = 0; i < population.length; i++) {
    var d = calcDistance(cities, population[i]);
    if (d < recordDistance) {
      recordDistance = d;
      bestEver = population[i];
    }
    if (d < currentRecord) {
      currentRecord = d;
      currentBest = population[i];
    }

    fitness[i] = 1 / (pow(d, 8) + 1);
  }
}

function normalizeFitness() {
  var sum = 0;
  for (var i = 0; i < fitness.length; i++) {
    sum += fitness[i];
  }
  for (var i = 0; i < fitness.length; i++) {
    fitness[i] = fitness[i] / sum;;
  }
}

function nextGeneration() {
  var newPopulation = [];
  for (var i = 0; i < population.length; i++) {
    var orderA = pickOne(population, fitness);
    var orderB = pickOne(population, fitness);
    var order = crossOver(orderA, orderB);
    mutate(order, 0.01);
    newPopulation[i] = order;
  }
  population = newPopulation;

}

function pickOne(list, prob) {
  var index = 0;
  var r = random(1);

  while (r > 0) {
    r = r - prob[index];
    index++;
  }
  index--;
  return list[index].slice();
}

function crossOver(orderA, orderB) {
  var start = floor(random(orderA.length));
  var end = floor(random(start + 1, orderA.length));
  var neworder = orderA.slice(start, end);
  // var left = totalCities - neworder.length;
  for (var i = 0; i < orderB.length; i++) {
    var city = orderB[i];
    if (!neworder.includes(city)) {
      neworder.push(city);
    }
  }
  return neworder;
}


function mutate(order, mutationRate) {
  for (var i = 0; i < totalCities; i++) {
    if (random(1) < mutationRate) {
      var indexA = floor(random(order.length));
      var indexB = (indexA + 1) % totalCities;
      swap(order, indexA, indexB);
    }
  }
}