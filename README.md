# vue-mapbox-gl-divvy-viz

## Project setup
```
npm install
```

Create a mapbox account and token following these [instructions](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/). Mapbox has a free tier that does not require a credit card.
Create a `.env` file at the root and add you token:

```
VUE_APP_ACCESS_TOKEN=your_token
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Todo

* update station info to be scrollable if height is higher than the viewport
* update design to handle phone portait differently (vertical?)
* add unit tests
* add move info
* update marker ==> display circle to represent the number of trips to a destination
* add a popup on markers to see the info? Or highlight the info on the left page
* add a button to load new station from the map
* add mapbox token info to the readme

