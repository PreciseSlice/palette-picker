# Palette Picker 

[![Build Status](https://travis-ci.org/PreciseSlice/palette-picker.svg?branch=master)](https://travis-ci.org/PreciseSlice/palette-picker)

<br/>

![full-page](./public/assets/full-page.png)

<br/>

This app enables you to generate a random palette of 5 colors. Colors can be locked and the rest of the color swatches shuffled. Projects can be saved as well as palettes. One project may have many palettes.

The project features a jQuery client side, a Node.js + Express.js server and postgreSQL database.    

### An app for choosing palettes inspired by [Coolers] (https://coolors.co/app).

### A live version of this project is deployed [here](https://palette--picker.herokuapp.com/).

## Libraries Utilized  

* jQuery
* PosgreSQL
* Node.js
* Express.js
* Knex.js
* Chai
* Mocha

## Getting Started 

#### Clone down this repository. 

`git clone https://github.com/PreciseSlice/palette-picker`

#### cd into the repository and install dependancies.

`cd palette-picker`

`npm install`

#### To start the server.

`npm start`

#### To run the test suite.

`npm test`

## Using the app

### Generate a Palette

Click the generate button or press space bar for a new set of random color swatches.

![generate](https://media.giphy.com/media/fwWjr3g9FQaQ8EM118/giphy.gif)  

<br/>

### Lock a Color

Click on a color swatch to toggle the lock.

![lock](https://media.giphy.com/media/uUlVBl1qr5YyUWh1oZ/giphy.gif)

<br/>

### Save a Project 

Enter the project name and hit save to create a new project. 

![save project](https://media.giphy.com/media/pcJXiyJbBkQKE4hL3a/giphy.gif)

<br/>

### Save a Palette

Select the project to save the palette to and then input the name of your palette.

![save palette](https://media.giphy.com/media/Dr0rMzwfrh4zKBbLHz/giphy.gif)
